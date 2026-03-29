"use client";

import { useEffect, useRef } from "react";
import { translateText } from "@/lib/translations";

// Store original English text so we can re-translate when language changes
const ORIGINAL_ATTR = "data-original-text";
const TRANSLATED_ATTR = "data-translated";
const PLACEHOLDER_ATTR = "data-original-placeholder";

// Skip these elements
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA", "SVG", "PATH", "CIRCLE", "RECT", "POLYGON", "INPUT"]);
// Skip admin panel
const SKIP_SELECTORS = [".notranslate", "[data-no-translate]"];

function shouldSkipNode(node: Node): boolean {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    if (SKIP_TAGS.has(el.tagName)) return true;
    if (el.closest("[data-no-translate]")) return true;
    if (el.classList?.contains("notranslate")) return true;
    // Skip contenteditable
    if (el.isContentEditable) return true;
  }
  return false;
}

function getTextNodes(root: Node): Text[] {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
      // Check parent chain for skip
      let parent = node.parentElement;
      while (parent) {
        if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.hasAttribute("data-no-translate")) return NodeFilter.FILTER_REJECT;
        if (parent.classList?.contains("notranslate")) return NodeFilter.FILTER_REJECT;
        if (parent.isContentEditable) return NodeFilter.FILTER_REJECT;
        parent = parent.parentElement;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    nodes.push(node);
  }
  return nodes;
}

function translateNode(textNode: Text, lang: "hi" | "gu" | "en") {
  const parent = textNode.parentElement;
  if (!parent) return;

  if (lang === "en") {
    // Restore original
    const original = parent.getAttribute(ORIGINAL_ATTR);
    if (original && textNode.textContent !== original) {
      textNode.textContent = original;
      parent.removeAttribute(TRANSLATED_ATTR);
    }
    // Restore placeholder
    if (parent.tagName === "INPUT" || parent.tagName === "TEXTAREA") {
      const origPlaceholder = parent.getAttribute(PLACEHOLDER_ATTR);
      if (origPlaceholder) {
        (parent as HTMLInputElement).placeholder = origPlaceholder;
        parent.removeAttribute(PLACEHOLDER_ATTR);
      }
    }
    return;
  }

  const currentText = textNode.textContent || "";
  // Use stored original or current text as source
  const originalText = parent.getAttribute(ORIGINAL_ATTR) || currentText;
  
  const translated = translateText(originalText, lang);
  if (translated && translated !== currentText) {
    // Store original
    if (!parent.hasAttribute(ORIGINAL_ATTR)) {
      parent.setAttribute(ORIGINAL_ATTR, originalText);
    }
    textNode.textContent = translated;
    parent.setAttribute(TRANSLATED_ATTR, lang);
  }
}

function translatePlaceholders(root: Element, lang: "hi" | "gu" | "en") {
  const inputs = root.querySelectorAll("input[placeholder], textarea[placeholder]");
  inputs.forEach((el) => {
    const input = el as HTMLInputElement;
    if (input.closest("[data-no-translate]")) return;
    
    if (lang === "en") {
      const orig = input.getAttribute(PLACEHOLDER_ATTR);
      if (orig) {
        input.placeholder = orig;
        input.removeAttribute(PLACEHOLDER_ATTR);
      }
      return;
    }
    
    const original = input.getAttribute(PLACEHOLDER_ATTR) || input.placeholder;
    const translated = translateText(original, lang);
    if (translated) {
      if (!input.hasAttribute(PLACEHOLDER_ATTR)) {
        input.setAttribute(PLACEHOLDER_ATTR, original);
      }
      input.placeholder = translated;
    }
  });
}

function translateDOM(root: Element | Document, lang: "hi" | "gu" | "en") {
  const textNodes = getTextNodes(root);
  for (const node of textNodes) {
    translateNode(node, lang);
  }
  translatePlaceholders(root instanceof Document ? root.body : root, lang);
}

export function DOMTranslator({ language }: { language: "hi" | "gu" | "en" }) {
  const observerRef = useRef<MutationObserver | null>(null);
  const langRef = useRef(language);
  langRef.current = language;

  useEffect(() => {
    // Translate entire DOM
    translateDOM(document, language);

    // Watch for new content (dynamic loading, route changes)
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (language === "en") return; // No observer needed for English

    let timeoutId: NodeJS.Timeout;
    const observer = new MutationObserver((mutations) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        for (const mutation of mutations) {
          // New nodes added
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
              translateNode(node as Text, langRef.current);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as Element;
              if (!shouldSkipNode(el)) {
                translateDOM(el, langRef.current);
              }
            }
          }
          // Text content changed
          if (mutation.type === "characterData" && mutation.target.nodeType === Node.TEXT_NODE) {
            const parent = mutation.target.parentElement;
            if (parent && !parent.hasAttribute(TRANSLATED_ATTR)) {
              translateNode(mutation.target as Text, langRef.current);
            }
          }
        }
      }, 100); // 100ms debounce
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [language]);

  return null; // This component renders nothing
}

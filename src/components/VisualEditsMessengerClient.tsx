"use client";

// Inlined from orchids-visual-edits to avoid package resolution issues
import { useState, useEffect, useRef } from "react";

const CHANNEL = "ORCHIDS_HOVER_v1";
const VISUAL_EDIT_MODE_KEY = "orchids_visual_edit_mode";

export default function VisualEditsMessengerClient() {
  const [isVisualEditMode, setIsVisualEditMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(VISUAL_EDIT_MODE_KEY) === "true";
    }
    return false;
  });
  const [hoverBoxes, setHoverBoxes] = useState<{top:number;left:number;width:number;height:number}[]>([]);
  const [hoverTag, setHoverTag] = useState<string | null>(null);
  const [focusBox, setFocusBox] = useState<{top:number;left:number;width:number;height:number} | null>(null);
  const [focusTag, setFocusTag] = useState<string | null>(null);
  const isVisualEditModeRef = useRef(false);

  useEffect(() => {
    isVisualEditModeRef.current = isVisualEditMode;
    if (typeof window !== "undefined") {
      localStorage.setItem(VISUAL_EDIT_MODE_KEY, String(isVisualEditMode));
    }
  }, [isVisualEditMode]);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type !== CHANNEL) return;
      if (e.data.msg === "VISUAL_EDIT_MODE" && "active" in e.data) {
        const newMode = e.data.active;
        setIsVisualEditMode(newMode);
        if (!newMode && typeof window !== "undefined") {
          localStorage.removeItem(VISUAL_EDIT_MODE_KEY);
        }
        window.parent.postMessage({ type: CHANNEL, msg: "VISUAL_EDIT_MODE_ACK", active: newMode }, "*");
        if (!newMode) {
          setHoverBoxes([]);
          setFocusBox(null);
          setHoverTag(null);
          setFocusTag(null);
          window.parent.postMessage({ type: CHANNEL, msg: "HIT", id: null, tag: null, rect: null }, "*");
        }
      }
      if (e.data.msg === "SCROLL" && "dx" in e.data && "dy" in e.data) {
        window.scrollBy(e.data.dx, e.data.dy);
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  useEffect(() => {
    if (!isVisualEditMode) return;
    function onPointerMove(e: PointerEvent) {
      const hit = (document.elementFromPoint(e.clientX, e.clientY) as Element | null)?.closest("[data-orchids-id]") ?? null;
      if (!hit) {
        setHoverBoxes([]);
        setHoverTag(null);
        window.parent.postMessage({ type: CHANNEL, msg: "HIT", id: null, tag: null, rect: null }, "*");
        return;
      }
      const hitId = hit.getAttribute("data-orchids-id");
      const tagName = hit.getAttribute("data-orchids-name") || hit.tagName.toLowerCase();
      const all = document.querySelectorAll(`[data-orchids-id="${hitId}"]`);
      const boxes: {top:number;left:number;width:number;height:number}[] = [];
      all.forEach(el => {
        const r = el.getBoundingClientRect();
        boxes.push({ top: r.top - 4, left: r.left - 4, width: r.width + 8, height: r.height + 8 });
      });
      setHoverBoxes(boxes);
      setHoverTag(tagName);
      const r = hit.getBoundingClientRect();
      window.parent.postMessage({ type: CHANNEL, msg: "HIT", id: hitId, tag: tagName, rect: { top: r.top - 4, left: r.left - 4, width: r.width + 8, height: r.height + 8 } }, "*");
    }
    function onClick(e: MouseEvent) {
      const hit = (e.target as Element | null)?.closest("[data-orchids-id]");
      if (!hit) {
        setFocusBox(null);
        setFocusTag(null);
        return;
      }
      const hitId = hit.getAttribute("data-orchids-id");
      const tagName = hit.getAttribute("data-orchids-name") || hit.tagName.toLowerCase();
      const r = hit.getBoundingClientRect();
      const box = { top: r.top - 4, left: r.left - 4, width: r.width + 8, height: r.height + 8 };
      setFocusBox(box);
      setFocusTag(tagName);
      window.parent.postMessage({ type: CHANNEL, msg: "ELEMENT_CLICKED", id: hitId, tag: tagName, rect: box, clickPosition: { x: e.clientX, y: e.clientY }, isEditable: false, currentStyles: {}, className: hit.getAttribute("class") || "" }, "*");
    }
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("click", onClick, true);
    };
  }, [isVisualEditMode]);

  if (!isVisualEditMode) return null;

  return (
    <>
      {hoverBoxes.map((box, i) => (
        <div key={i}>
          <div className="orchids-hover-box" style={{ position: "fixed", zIndex: 100000, left: box.left, top: box.top, width: box.width, height: box.height, border: "0.5px dashed #38bdf8", backgroundColor: "rgba(191,219,254,0.2)", borderRadius: "2px", pointerEvents: "none" }} />
          {hoverTag && <div className="orchids-hover-tag" style={{ position: "fixed", zIndex: 100001, left: box.left, top: box.top - 20, fontSize: 10, color: "white", backgroundColor: "#38bdf8", padding: "2px 4px", borderRadius: "2px", pointerEvents: "none" }}>{hoverTag}</div>}
        </div>
      ))}
      {focusBox && (
        <>
          {focusTag && <div style={{ position: "fixed", zIndex: 100003, left: focusBox.left - 4, top: focusBox.top - 16, fontSize: 10, fontWeight: 600, color: "white", backgroundColor: "#3b82f6", padding: "0 4px", borderRadius: "2px", pointerEvents: "none" }}>{focusTag}</div>}
          <div style={{ position: "fixed", zIndex: 100001, left: focusBox.left, top: focusBox.top, width: focusBox.width, height: focusBox.height, border: "1.5px solid #38bdf8", borderRadius: "2px", pointerEvents: "none" }} />
        </>
      )}
    </>
  );
}

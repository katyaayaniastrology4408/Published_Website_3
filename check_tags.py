import sys
import re

def check_tags(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    tags = re.findall(r'<([a-zA-Z0-9]+)|</([a-zA-Z0-9]+)>', content)
    stack = []
    for open_tag, close_tag in tags:
        if open_tag:
            if open_tag not in ['img', 'br', 'hr', 'input', 'link', 'meta']: # basic self-closing
                stack.append(open_tag)
        elif close_tag:
            if not stack:
                print(f"Extra closing tag </{close_tag}>")
                continue
            last = stack.pop()
            if last != close_tag:
                print(f"Mismatched tag: <{last}> closed by </{close_tag}>")
    
    if stack:
        print(f"Unclosed tags: {stack}")
    else:
        print("All tags balanced")

if __name__ == "__main__":
    check_tags(sys.argv[1])

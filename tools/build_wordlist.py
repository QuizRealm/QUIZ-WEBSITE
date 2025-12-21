#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path

WORD_RE = re.compile(r"^[A-Z]{4,32}$")

def load_words(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8", errors="ignore")

    # If it's JSON, try to parse it; otherwise treat as raw text
    if path.suffix.lower() == ".json":
        try:
            data = json.loads(text)
            if isinstance(data, list):
                raw = data
            elif isinstance(data, dict) and isinstance(data.get("words"), list):
                raw = data["words"]
            else:
                raw = []
            words = [str(w) for w in raw]
        except Exception:
            words = []
    else:
        # Extract "word-like" tokens from any text file
        words = re.findall(r"[A-Za-z]{4,32}", text)

    cleaned = []
    for w in words:
        w = w.strip().upper()
        if WORD_RE.match(w):
            cleaned.append(w)
    return cleaned

def main():
    if len(sys.argv) < 2:
        print("Usage: build_wordlist.py <input.txt|input.json> [out_dir]")
        sys.exit(1)

    inp = Path(sys.argv[1])
    out_dir = Path(sys.argv[2]) if len(sys.argv) >= 3 else Path("assets/wordlists")
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Loading: {inp}")
    words = load_words(inp)
    if not words:
        print("ERROR: No words parsed. Check your input format.")
        sys.exit(2)

    # Deduplicate + sort
    uniq = sorted(set(words))
    print(f"Parsed {len(words):,} tokens -> {len(uniq):,} unique valid words")

    # Write TXT (fastest + smallest)
    txt_path = out_dir / "enable1.txt"
    txt_path.write_text("\n".join(uniq) + "\n", encoding="utf-8")
    print(f"Wrote: {txt_path} ({txt_path.stat().st_size/1024/1024:.2f} MB)")

    # Write JSON (array format = smallest)
    json_path = out_dir / "wordlist.json"
    json_path.write_text(json.dumps(uniq, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote: {json_path} ({json_path.stat().st_size/1024/1024:.2f} MB)")

    # Optional: also write words.txt if you want multiple sources
    words_txt = out_dir / "words.txt"
    words_txt.write_text("\n".join(uniq) + "\n", encoding="utf-8")
    print(f"Wrote: {words_txt} ({words_txt.stat().st_size/1024/1024:.2f} MB)")

if __name__ == "__main__":
    main()

---
title: "HTML Entity Encoder Decoder - Encode & Decode Special Chars Free"
description: "Free HTML entity encoder and decoder. Convert special characters to HTML entities and decode entities back to readable text. Useful for escaping HTML in code snippets."
icon: "&#x1F524;"
tool_slug: "html-entity-encoder"
slug: "html-entity-encoder"
layout: "tools/single"
draft: false
---

## How to Use the HTML Entity Encoder/Decoder

1. **Choose mode** — select Encode (text to entities) or Decode (entities to text)
2. **Type or paste text** — the output field updates in real-time
3. **Copy the result** — click the copy button to grab the converted text
4. **Swap to reverse** — use the swap button to exchange input and output for quick round-trip conversion

## Features

- **Encode mode** — converts `& < > " '` and special characters to HTML entities
- **Decode mode** — converts entities like `&amp;` and `&#169;` back to characters
- **30+ character mappings** — common symbols, currency, arrows, quotes, math operators
- **Decimal entity support** — handles `&#123;` format for any character
- **Hex entity support** — handles `&#x3C;` format
- **Swap button** — exchange input and output instantly
- **Real-time** — no button to click, results appear as you type

## Use Cases

- **Blogging**: When writing code tutorials, encode `<code>` tags so they display as text instead of being interpreted by the browser
- **CMS publishing**: Many CMS platforms strip raw HTML — encode entities to preserve special characters
- **Email templates**: HTML emails require entities for special characters to render consistently across clients
- **XML/feed generation**: RSS feeds and sitemaps need special characters encoded to remain valid XML
- **Internationalization**: Properly encode currency symbols (€, £, ¥) and accented characters (é, ñ, ü)

## FAQ

### What is an HTML entity?
An HTML entity is a string that begins with an ampersand (&) and ends with a semicolon (;), used to represent characters that have special meaning in HTML or characters that aren't easily typed. For example, `&lt;` represents the less-than sign `<`.

### When should I encode vs decode?
Encode when you're preparing text to be displayed in HTML — especially code snippets or user-generated content. Decode when you're extracting text from HTML source and need the readable version.

### Do I need to encode every special character?
No. Only characters with special meaning in HTML must be encoded: `<`, `>`, `&`, `"`, and `'`. For readability, you can leave other characters as-is.

### Are named entities better than numeric ones?
Named entities (like `&copy;`) are easier to read in source code, while numeric entities (like `&#169;`) work universally across all character encodings. Both render identically in the browser.

## Tips

- Use Encode mode before pasting code into WordPress or any WYSIWYG editor
- When decoding, the tool handles named, decimal, and hex entities all at once
- Bookmark this tool — you'll reach for it more often than you expect when working with CMS platforms
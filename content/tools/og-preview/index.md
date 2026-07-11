---
title: "Open Graph Preview - OG Meta Tag Checker & Debugger Free"
description: "Preview how your page looks when shared on Facebook, LinkedIn, Slack, and Twitter. Test Open Graph meta tags (og:title, og:description, og:image) for social sharing. Free OG preview tool."
icon: "&#x1F517;"
tool_slug: "og-preview"
slug: "og-preview"
layout: "tools/single"
draft: false
---

## How to Use the OG Preview Tool

1. **Enter page URL** — type or paste the full URL of your page (the domain extracts automatically)
2. **Add OG title** — the title that appears in bold on social shares (recommended max 70 characters)
3. **Write OG description** — the supporting text below the title (recommended max 200 characters)
4. **Set OG image URL** — enter the direct URL to the image you want in the share card
5. **Preview the card** — see exactly how your page will look when shared on Facebook, LinkedIn, or Slack

## Features

- **Social card preview** — realistic preview of how your link appears on Facebook, LinkedIn, and Slack
- **Live image rendering** — loads and displays your OG image (shows errors if the image fails to load)
- **Title length checker** — warns when your title exceeds recommended character limits
- **Description length checker** — ensures your description fits within social platform limits
- **Domain extraction** — automatically parses the URL and displays the domain
- **Error handling** — shows clear error messages if the image URL is broken or inaccessible
- **All local** — no server-side processing; your URLs are not stored or logged

## Use Cases

**Content marketers** preview how their blog posts and articles will appear on social media before publishing. They can tweak the title and description to maximize engagement, then update the actual OG tags on the page.

**Social media managers** use the preview tool to test multiple title and description variations for a single piece of content. They find the combination that looks best in the card preview before scheduling the share.

**Web developers** debug OG tag issues by testing image URLs, checking for missing og:image tags, and verifying that the domain renders correctly. It's faster than using Facebook's official debugger for quick checks.

**SEO professionals** include OG preview testing as part of their content QA process. They verify that every new page has correct Open Graph tags before it goes live to avoid broken-looking social shares.

## FAQ

### Why does my image not show in the preview?
The image URL must be accessible (not blocked by hotlink protection), use a supported format (JPEG, PNG, WebP, GIF), and be at least 200 x 200 pixels. Check that the URL starts with https:// and that the file is not too large.

### What is the ideal image size for OG tags?
Facebook recommends 1200 x 630 pixels with a 1.91:1 aspect ratio. Twitter recommends 1200 x 600 pixels. Images smaller than 600 x 315 pixels may not display properly.

### Does this tool actually fetch my page's OG tags?
No. This tool lets you input OG tag values manually to preview how they will look. It does not crawl your page. To see your actual live tags, use a tool that fetches the URL directly.

### Why does my title look different on Facebook vs Twitter?
Facebook uses og:title. Twitter uses twitter:title (falls back to og:title if not set). They may display differently due to platform-specific character limits — Facebook shows about 70 characters, while Twitter shows about 70 as well.

### Is this tool the same as Facebook Sharing Debugger?
No. The Facebook Sharing Debugger actually crawls your URL and shows what Facebook sees. This tool is a manual preview — useful for testing tags before they go live on your page.

## Tips

- Always use an absolute image URL (starting with https://) — relative URLs do not work
- Test your OG image on multiple devices — what looks good on desktop may crop differently on mobile
- Use a URL shortener if your page URL is very long, but avoid URL shorteners for the og:image URL

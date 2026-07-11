---
# RankMath SEO
rankmath_title: "Robots.txt Guide: How to Control Search Engine Crawling | FreeToolz"
rankmath_description: "Complete guide to robots.txt for SEO. Learn how to block crawlers, allow Googlebot, manage crawl budget, and avoid common robots.txt mistakes that hurt your rankings."
rankmath_permalink: /blog/robots-txt-guide/
rankmath_focus_keyword: "robots.txt guide"
rankmath_related_keywords: [robots.txt file, how to create robots.txt, robots.txt example, block search engine crawlers, robots.txt disallow, crawl budget, robots.txt allow, search engine crawling, googlebot robots.txt, robots.txt syntax]

title: "Robots.txt Guide: Control How Search Engines Crawl Your Site"
date: "2026-07-06"
description: "Complete robots.txt guide for SEO. Learn how to create, test, and optimise your robots.txt file to control crawler access, manage crawl budget, and prevent search engines from indexing private or duplicate content."
image: "/images/og-default.jpg"
tags:
  - robots.txt
  - seo crawling
  - search engine optimization
  - googlebot
  - crawl budget
  - technical seo
  - webmaster tools
---

Your `robots.txt` file is the first thing search engines check when they visit your site. It tells Googlebot, Bingbot, and other crawlers which pages they can and cannot access. Get it wrong, and you could accidentally block your entire site from search results — or waste crawl budget on low-value pages.

This guide covers everything you need to know about robots.txt: syntax, rules, testing, common mistakes, and SEO best practices.

## What Is Robots.txt?

Robots.txt is a plain text file placed at the root of your domain (`yoursite.com/robots.txt`). It uses the Robots Exclusion Protocol to instruct web crawlers on which parts of your site they should or should not crawl.

**Important:** Robots.txt is a directive, not an enforcement mechanism. Obedient crawlers (Googlebot, Bingbot) follow it. Malicious crawlers and scrapers ignore it.

## Basic Robots.txt Syntax

### The Three Core Components

```
User-agent: [crawler name]
Disallow: [path to block]
Allow: [path to allow]
```

- **User-agent:** Which crawler the rule applies to (`*` = all crawlers)
- **Disallow:** Paths the crawler cannot access
- **Allow:** Paths the crawler can access (used to override Disallow)

### Simple Example

```
User-agent: *
Disallow: /admin/
Disallow: /private/
```

This tells all crawlers not to access any URL starting with `/admin/` or `/private/`.

### Complete Working Robots.txt

```
User-agent: *
Disallow: /wp-admin/
Disallow: /wp-includes/
Disallow: /temp/
Allow: /wp-admin/admin-ajax.php

Sitemap: https://yoursite.com/sitemap.xml
```

This blocks crawlers from WordPress admin and includes directories, allows AJAX requests (which some themes need), and points to your XML sitemap.

## Common Robots.txt Rules

### Block Everything (Not Recommended)

```
User-agent: *
Disallow: /
```

This blocks all crawlers from your entire site — your pages won't appear in search results. Only use this on staging or development sites.

### Block a Specific Directory

```
User-agent: *
Disallow: /admin/
Disallow: /downloads/
Disallow: /private/
```

### Block a Specific File Type

```
User-agent: *
Disallow: /*.pdf$
Disallow: /*.zip$
Disallow: /*.docx$
```

Prevents crawlers from indexing PDFs, ZIPs, and Word documents — useful if you have many downloadable files that don't need search visibility.

### Block Specific Crawlers

```
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: Google-Extended
Disallow: /
```

This blocks AI training crawlers while still allowing Googlebot for search indexing. Increasingly common as site owners opt out of AI data collection.

### Allow a Path Within a Blocked Directory

```
User-agent: *
Disallow: /private/
Allow: /private/public-page.html
```

This blocks all of `/private/` except for one specific page.

## Robots.txt for WordPress

WordPress sites have specific directories that should typically be blocked:

```
User-agent: *
Disallow: /wp-admin/
Disallow: /wp-includes/
Disallow: /wp-content/plugins/
Disallow: /wp-content/themes/
Disallow: /xmlrpc.php
Disallow: /trackback/

Sitemap: https://yoursite.com/sitemap.xml
```

**Note:** Do not block `/wp-content/uploads/` — this is where your images and media live. Blocking it would prevent images from appearing in Google Image Search.

## Crawl Budget Management

Crawl budget is the number of URLs Googlebot will crawl on your site within a given timeframe. For small sites (under 10,000 pages), crawl budget rarely matters. For large sites, it's critical.

### How to Optimise Crawl Budget with Robots.txt

1. **Block low-value pages:** Tag pages, filter parameters, sort orders, internal search results
2. **Block duplicate content:** Printer-friendly versions, session IDs, pagination copies
3. **Block staging environments:** Never let crawlers find your dev or staging site
4. **Don't block CSS/JS:** Google needs these to render pages (see below)

### What to Block for Crawl Budget

```
User-agent: *
Disallow: /search/
Disallow: /tag/
Disallow: /author/
Disallow: /page/2/
Disallow: /*sort=*
Disallow: /*filter=*
Disallow: /*utm_source=*
Disallow: /*sessionid=*
```

## Common Robots.txt Mistakes

### 1. Blocking CSS and JavaScript

**Wrong:**
```
User-agent: *
Disallow: /assets/
```

If your CSS and JS files are in `/assets/`, Google can't render your page properly. It will see unstyled HTML, which hurts your rankings.

**Fix:** Remove CSS/JS directories from Disallow, or better, don't block them at all.

### 2. Using Robots.txt for Security

Robots.txt doesn't hide pages. It tells honest crawlers not to visit a URL, but anyone can still access it directly. For actual security, use password protection or authentication.

### 3. Blocking the Entire Site Accidentally

```
Disallow: /
```

This is the most common mistake. A misplaced space or incorrect path can block your entire site. Always test your robots.txt after making changes.

### 4. Missing the Sitemap Directive

Without a `Sitemap:` directive in robots.txt, Google has to discover your sitemap through other means (like Search Console). Adding it speeds up discovery.

### 5. Case Sensitivity Issues

```
Disallow: /Admin/
```

This only blocks `/Admin/`, not `/admin/`. Paths are case-sensitive. Use lowercase to be safe.

## How to Test Your Robots.txt

### Google Search Console

1. Go to **Search Console > Settings > Crawl Stats > Robots.txt Tester**
2. Enter URLs to test against your robots.txt
3. It will tell you whether each URL is allowed or blocked

### Manual Test

Type `yoursite.com/robots.txt` in your browser. You should see your robots.txt file. If you get a 404 or a page not found error, search engines can't access it either.

### Using curl

```bash
curl https://yoursite.com/robots.txt
```

This returns the raw file. Check for syntax errors or missing directives.

## Robots.txt and Crawl Directives Comparison

| Directive | Where It Goes | What It Does | Enforced? |
|-----------|--------------|-------------|-----------|
| Disallow | robots.txt | Prevents crawling | Voluntary (obedient bots only) |
| Noindex | Meta tag or HTTP header | Prevents indexing | Usually respected |
| Password protection | Server config | Blocks all access | Enforced |
| Canonical | HTML `<link>` tag | Tells Google which URL is primary | Advisory |
| X-Robots-Tag | HTTP header | Noindex/nofollow for non-HTML files | Usually respected |

Use our **[Robots.txt Generator](/tools/robots-txt-generator/)** to create a custom robots.txt file for your site in seconds — no coding required.

## Robots.txt for Specific CMS Platforms

### WordPress

```
User-agent: *
Disallow: /wp-admin/
Disallow: /wp-includes/
Disallow: /xmlrpc.php
Disallow: /trackback/
Allow: /wp-admin/admin-ajax.php
Sitemap: https://yoursite.com/sitemap.xml
```

### Shopify

Shopify generates its own robots.txt — you can't edit it directly. Add custom rules via your theme's `robots.txt.liquid` file or use Shopify's built-in SEO settings.

### Wix

Wix automatically generates your robots.txt. You can view it at `yoursite.com/robots.txt` but you can't edit it directly. For custom rules, use Wix SEO settings.

### Squarespace

Squarespace also auto-generates robots.txt. You can't manually edit it, but you can control page-level indexing in page settings.

### Custom Sites

Place your robots.txt file in the root directory of your site (`/robots.txt`). Ensure your web server serves it with `Content-Type: text/plain` and a `200 OK` status.

## AI Crawlers: Do You Need to Block Them?

In 2024-2026, more AI companies than ever are scraping web content for training data. You may want to block some or all of them.

### Common AI Crawlers to Consider Blocking

| Crawler | Used By | Block Directive |
|---------|---------|----------------|
| GPTBot | OpenAI GPT training | `User-agent: GPTBot` |
| ChatGPT-User | ChatGPT browsing | `User-agent: ChatGPT-User` |
| Google-Extended | Google AI training | `User-agent: Google-Extended` |
| CCBot | Common Crawl | `User-agent: CCBot` |
| Claude-Web | Anthropic | `User-agent: Claude-Web` |
| PerplexityBot | Perplexity AI | `User-agent: PerplexityBot` |

### Selective Blocking Example

```
User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: *
Disallow: /admin/
Disallow: /private/

Sitemap: https://yoursite.com/sitemap.xml
```

This blocks AI training crawlers entirely while still allowing Googlebot and Bingbot to crawl and index your site normally.

## Advanced Robots.txt Features

### Crawl-Delay Directive

```
User-agent: *
Crawl-Delay: 10
```

Tells crawlers to wait 10 seconds between requests. This is legacy — Googlebot ignores it, but smaller search engines and SEO tools may respect it.

### Multiple User-Agent Blocks

```
User-agent: Googlebot
Disallow: /private/

User-agent: Bingbot
Disallow: /private/

User-agent: *
Disallow: /
```

Googlebot and Bingbot can access everything except `/private/`. All other crawlers are completely blocked.

### Sitemap Directive

```
Sitemap: https://yoursite.com/sitemap.xml
Sitemap: https://yoursite.com/sitemap-video.xml
```

You can list multiple sitemaps. This helps search engines discover all your content.

## FAQ

**What happens if I don't have a robots.txt file?**
Nothing bad. Search engines will crawl your entire site without restrictions. It's only needed when you want to block specific pages or crawlers.

**Can robots.txt prevent Google from indexing my pages?**
Indirectly. If Googlebot can't crawl a page (because it's blocked by robots.txt), it can't index it. But if Googlebot can crawl it and you want it removed from search, use a `noindex` meta tag instead.

**Does robots.txt affect other search engines?**
Yes — Bing, Yahoo, Yandex, and most major search engines respect robots.txt. However, some smaller crawlers and SEO tools may not.

**How long does it take for robots.txt changes to take effect?**
Googlebot checks robots.txt regularly and caches it for up to 24 hours. You can force a recrawl in Google Search Console. Changes usually take effect within a few hours to a day.

**Can I use wildcards in robots.txt?**
Yes. `*` matches any sequence of characters. `$` matches the end of a URL. Example: `Disallow: /*.pdf$` blocks all PDF files.

**Does robots.txt affect subdomains?**
Each subdomain needs its own robots.txt file. `blog.yoursite.com/robots.txt` is separate from `yoursite.com/robots.txt`.

**Should I block Google Images?**
Probably not. If you want your images to appear in Google Image Search, don't block image directories. If you don't want image indexing, add `User-agent: Googlebot-Image` with `Disallow: /`.

**Can I use robots.txt to block ads or analytics scripts?**
No. Robots.txt only controls which URLs crawlers can access. It doesn't affect browser-based requests. Block ads or analytics through your content security policy or ad blocker configuration.

**What's the maximum size for robots.txt?**
Googlebot processes the first 500 KB of a robots.txt file. Keep it under that limit, but most sites will never come close.

**How do I check if my robots.txt is working?**
Visit `yoursite.com/robots.txt` in your browser. Use Google Search Console's robots.txt tester to check specific URLs. Monitor your crawl stats to see if crawl volume changes after updates.

---

*Create your own robots.txt instantly with FreeToolz's **[Robots.txt Generator](/tools/robots-txt-generator/)** — no signup, no coding.*

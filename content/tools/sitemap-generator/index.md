---
title: "Sitemap Generator - Free Online XML Sitemap Generator"
description: "Free online XML sitemap generator. Create XML sitemaps from a list of URLs with optional priority, changefreq, and lastmod settings. Copy ready-to-use sitemap XML."
icon: "&#x1F5C2;"
tool_slug: "sitemap-generator"
slug: "sitemap-generator"
layout: "tools/single"
draft: false
---

## How to Use the Sitemap Generator

1. **Enter base URL** — type your website's root URL (e.g., `https://example.com`)
2. **List your page URLs** — enter one URL path per line (e.g., `/about`, `/contact`, `/blog/post-title`) — shorthand paths auto-expand with your base URL
3. **Set default options** — choose default priority (0.0 to 1.0), changefreq (always, hourly, daily, weekly, monthly, yearly, never), and lastmod date
4. **Customize per URL** — optionally override priority and changefreq for specific pages
5. **Copy the XML** — grab your complete, valid sitemap XML with one click

Perfect for SEO professionals launching or updating websites.

## Features

- **Per-URL customization** — set priority and changefreq individually for each page in your sitemap
- **Auto URL resolution** — shorthand paths like `/about` auto-expand with your base URL to full URLs
- **Valid XML output** — generates XML that conforms to the sitemaps.org schema
- **One-click copy** — grab the complete XML output instantly
- **No data sent** — everything runs locally in your browser

## Use Cases

- **New website launch** — generate your sitemap before submitting it to Google Search Console
- **Site migration** — quickly create updated sitemaps after URL structure changes during a migration
- **Blog indexing** — prioritize blog posts with daily changefreq and category pages with weekly
- **E-commerce catalogs** — set higher priority for product pages and lower for filter or tag pages
- **Multilingual sites** — generate separate sitemaps for each language section of your site

## FAQ

### What is a changefreq and how should I set it?
Changefreq tells search engines how often a page is likely to change. Set it to "daily" for news and blogs, "weekly" for most pages, "monthly" for evergreen content, and "yearly" for very stable pages like About or Contact.

### How does priority work in XML sitemaps?
Priority indicates the relative importance of a page compared to other pages on your site, from 0.0 (lowest) to 1.0 (highest). Set your homepage to 1.0, main category pages to 0.8, and less important pages lower. Priority only matters relative to other pages on your site.

### How many URLs can I include in one sitemap?
A single sitemap can contain up to 50,000 URLs and must not exceed 50MB uncompressed. If you have more URLs, split them into multiple sitemap files and create a sitemap index file.

### Do I need to update my sitemap every time I add a page?
Yes, ideally. Search engines periodically check your sitemap for new URLs. Some CMS platforms auto-generate sitemaps, but if you're managing a static site, regenerate and re-upload your sitemap after adding important pages.

## Tips

- Submit your sitemap URL in Google Search Console and Bing Webmaster Tools for faster indexing
- Use higher priority values sparingly — if every page has priority 1.0, none is prioritized
- Include only canonical URLs — never include duplicate or parameter-based URLs
- Set lastmod dates correctly — outdated lastmod values can cause search engines to skip recrawling

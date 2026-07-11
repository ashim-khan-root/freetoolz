---
# RankMath SEO
rankmath_title: "XML Sitemap Guide: What Is a Sitemap & How to Create One | FreeToolz"
rankmath_description: "Complete guide to XML sitemaps for SEO. Learn what a sitemap is, how to create and submit one to Google, and best practices for better indexing and crawl efficiency."
rankmath_permalink: /blog/xml-sitemap-guide/
rankmath_focus_keyword: "xml sitemap guide"
rankmath_related_keywords: [what is a sitemap, sitemap.xml, how to create a sitemap, submit sitemap to google, sitemap generator, xml sitemap example, sitemap best practices, google search console sitemap, website indexing, crawl optimization]

title: "XML Sitemap Guide: Help Search Engines Find Your Pages"
date: "2026-07-06"
description: "Complete XML sitemap guide for SEO. Learn what a sitemap is, how to create a sitemap.xml file, submit it to Google Search Console, and follow best practices for faster indexing and better crawl efficiency."
image: "/images/og-default.jpg"
tags:
  - xml sitemap
  - sitemap generator
  - seo indexing
  - google search console
  - website crawl
  - technical seo
  - sitemap best practices
---

An XML sitemap is like a roadmap for search engines. It lists every important page on your website and tells Google, Bing, and other search engines when it was last updated, how often it changes, and how important it is relative to other pages.

Without a sitemap, search engines have to discover your pages by following links — which can take weeks for new content. With a sitemap, they know exactly where your content lives.

This guide covers everything: what a sitemap is, how to create one, how to submit it to Google, and advanced optimisation tips.

## What Is an XML Sitemap?

An XML sitemap is a file (`sitemap.xml`) placed at the root of your website. It follows the Sitemaps Protocol standard and contains a list of URLs you want search engines to index.

### Basic Sitemap Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yoursite.com/</loc>
    <lastmod>2026-07-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yoursite.com/about/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yoursite.com/blog/post-title/</loc>
    <lastmod>2026-07-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
```

### Sitemap XML Tags Explained

| Tag | Required | Purpose |
|-----|----------|---------|
| `<loc>` | Yes | Full URL of the page (including https) |
| `<lastmod>` | No | Date of last modification (YYYY-MM-DD) |
| `<changefreq>` | No | How often the page changes (always, hourly, daily, weekly, monthly, yearly, never) |
| `<priority>` | No | Relative importance (0.0 to 1.0, default 0.5) |

Use our **[XML Sitemap Generator](/tools/sitemap-generator/)** to create a sitemap.xml for your site in seconds.

## Why XML Sitemaps Matter for SEO

### 1. Faster Indexing

New pages get discovered and indexed faster. Instead of waiting for Googlebot to find your new post through internal links, it shows up in your sitemap immediately.

### 2. Better Coverage

Large sites (1,000+ pages) benefit most. Sitemaps ensure Google doesn't miss important pages buried deep in your site architecture.

### 3. Content Priority Signals

By setting priority values and lastmod dates, you tell Google which pages matter most and when they were updated. This helps Google crawl smarter, not harder.

### 4. Indexing Orphan Pages

Pages with no internal links pointing to them (orphan pages) are invisible to crawlers without a sitemap. A sitemap is their only lifeline to search engines.

### 5. Media and Video Indexing

Specialised sitemaps (video, image, news) help your media content appear in Google's specialised search results.

## Types of Sitemaps

### Standard XML Sitemap

The basic sitemap listing all URLs. Enough for most sites.

### Image Sitemap

Helps Google discover images on your site for Google Images search.

```xml
<url>
  <loc>https://yoursite.com/products/</loc>
  <image:image>
    <image:loc>https://yoursite.com/images/product.jpg</image:loc>
    <image:title>Product Name</image:title>
    <image:caption>Best product for your needs</image:caption>
  </image:image>
</url>
```

### Video Sitemap

Helps videos appear in Google video search results.

```xml
<url>
  <loc>https://yoursite.com/videos/</loc>
  <video:video>
    <video:thumbnail_loc>https://yoursite.com/thumb.jpg</video:thumbnail_loc>
    <video:title>How to Use Our Tool</video:title>
    <video:description>Step by step tutorial</video:description>
    <video:content_loc>https://yoursite.com/video.mp4</video:content_loc>
    <video:duration>300</video:duration>
  </video:video>
</url>
```

### News Sitemap

For news websites to appear in Google News. Only includes articles published in the last 48 hours.

### HTML Sitemap

A user-facing page listing your site structure. Not the same as XML sitemaps — HTML sitemaps help human visitors navigate, while XML sitemaps help search engines crawl.

## How to Create an XML Sitemap

### Method 1: Using a Sitemap Generator (Recommended)

Use FreeToolz's **[Sitemap Generator](/tools/sitemap-generator/)** — enter your URL and it crawls your site to generate a complete sitemap.xml file you can download and upload to your server.

### Method 2: CMS Plugins

**WordPress:**
- RankMath SEO — includes automatic sitemap generation (Settings > Sitemap)
- Yoast SEO — XML sitemaps enabled by default
- Google XML Sitemaps — dedicated sitemap plugin

**Shopify:**
- Sitemaps are generated automatically: `yourshop.com/sitemap.xml`
- No plugin needed, but you can't customise it directly

**Wix / Squarespace:**
- Auto-generated, submitted automatically to Google
- No manual action needed

### Method 3: Manual Creation

For small sites (under 50 pages), you can write a sitemap by hand or use a spreadsheet to generate the XML. Use our code example above as a template.

### Method 4: Dynamic Sitemap (Developers)

For larger sites, generate sitemaps programmatically. Here's a basic approach:

```python
# Python example: generate sitemap.xml
import datetime

pages = [
    {"url": "https://yoursite.com/", "lastmod": "2026-07-01", "priority": "1.0"},
    {"url": "https://yoursite.com/about/", "priority": "0.8"},
    {"url": "https://yoursite.com/blog/", "priority": "0.6"},
]

sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

for page in pages:
    sitemap += '  <url>\n'
    sitemap += f'    <loc>{page["url"]}</loc>\n'
    if "lastmod" in page:
        sitemap += f'    <lastmod>{page["lastmod"]}</lastmod>\n'
    sitemap += f'    <priority>{page["priority"]}</priority>\n'
    sitemap += '  </url>\n'

sitemap += '</urlset>'

with open("sitemap.xml", "w") as f:
    f.write(sitemap)
```

## How to Submit Your Sitemap to Google

### Step 1: Upload to Your Server

Place `sitemap.xml` in the root directory of your website:
```
https://yoursite.com/sitemap.xml
```

### Step 2: Add to Robots.txt

Add this line to your `robots.txt` file:
```
Sitemap: https://yoursite.com/sitemap.xml
```

Use our **[Robots.txt Generator](/tools/robots-txt-generator/)** to create both files at once.

### Step 3: Submit via Google Search Console

1. Go to **Google Search Console**
2. Select your property
3. Go to **Indexing > Sitemaps**
4. Enter your sitemap URL: `https://yoursite.com/sitemap.xml`
5. Click **Submit**

### Step 4: Submit to Bing

1. Go to **Bing Webmaster Tools**
2. Select your site
3. Go to **Sitemaps**
4. Enter your sitemap URL
5. Click **Submit**

### Step 5: Monitor Status

Check these metrics in Search Console after submission:

| Metric | Good Signal | Problem Signal |
|--------|------------|---------------|
| Submitted URLs | Matches expected count | Much lower or higher |
| Indexed URLs | 90%+ of submitted | Below 50% |
| Errors | 0 | Any errors need investigation |
| Last read | Recent (within 1-2 days) | Never read or stale |

## Sitemap Best Practices

### 1. Keep It Under 50MB and 50,000 URLs

If your sitemap exceeds these limits, split it into multiple sitemaps and create a sitemap index file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://yoursite.com/sitemap-pages.xml</loc>
    <lastmod>2026-07-01</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://yoursite.com/sitemap-posts.xml</loc>
    <lastmod>2026-07-06</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://yoursite.com/sitemap-images.xml</loc>
    <lastmod>2026-07-01</lastmod>
  </sitemap>
</sitemapindex>
```

### 2. Only Include Indexable Pages

Don't include:
- Noindex pages
- Pagination parameters
- Redirected URLs
- Canonicalised URLs (use the canonical version)
- Admin or login pages
- Tag or category archive pages (if thin content)

### 3. Use HTTPS URLs

All URLs in your sitemap should use HTTPS, not HTTP. Google prefers secure URLs and may ignore HTTP URLs in an HTTPS sitemap.

### 4. Keep lastmod Dates Accurate

Set accurate `lastmod` dates. Google uses this to determine whether to recrawl. Inflating dates reduces trust in your sitemap.

### 5. Prioritise Wisely

- **1.0:** Homepage (only one page should have this)
- **0.9:** Category/archive pages
- **0.8:** Important landing pages
- **0.6-0.7:** Blog posts, articles
- **0.3-0.5:** Less important pages
- **0.0-0.2:** Never use — Google may ignore

### 6. Update Your Sitemap Regularly

Update your sitemap whenever you:
- Publish new content
- Update existing content
- Remove or redirect pages
- Change URL structure

### 7. Use Multiple Sitemaps for Large Sites

| Sitemap | Contents | Best For |
|---------|----------|----------|
| sitemap-pages.xml | Static pages (About, Contact, Services) | Business sites |
| sitemap-posts.xml | Blog posts and articles | Content sites |
| sitemap-products.xml | Product pages | E-commerce |
| sitemap-images.xml | Image URLs | Media-heavy sites |
| sitemap-video.xml | Video URLs | Video content |
| sitemap-news.xml | Recent news articles | News sites |

## Common Sitemap Mistakes

### 1. Including Thin or Low-Quality Pages

Every page in your sitemap tells Google "this page is important." Including hundreds of thin tag pages or low-value archive pages wastes crawl budget.

### 2. Forgetting to Update After Site Changes

An outdated sitemap with broken links or old URLs hurts crawl efficiency. Automate your sitemap updates if possible.

### 3. Using Relative URLs

```
Wrong: <loc>/about/</loc>
Right: <loc>https://yoursite.com/about/</loc>
```

Always use absolute URLs in your sitemap.

### 4. Neglecting the Sitemap Index

For sites with over 50,000 URLs, a sitemap index is mandatory. Without it, Google won't see your full sitemap.

### 5. Not Excluding Noindex Pages

If you've added a noindex tag to a page, remove it from your sitemap. Conflicting signals confuse Google.

## Sitemap vs Robots.txt: What's the Difference?

| Purpose | Sitemap (Tell) | Robots.txt (Allow/Block) |
|---------|---------------|------------------------|
| Tells Google which pages exist | Yes | No |
| Tells Google which pages not to access | No | Yes |
| Provides metadata (lastmod, priority) | Yes | No |
| Controls crawl rate | No | No (separate setting) |
| Required for indexing | No (helpful) | No |

Think of robots.txt as "don't go here" and sitemap as "here's everything important — please index it."

## FAQ

**Do I need a sitemap for a small website?**
Yes, but it's less critical. For sites under 100 pages with good internal linking, search engines will find everything naturally. A sitemap still helps new pages get indexed faster.

**Can I have multiple sitemaps?**
Yes. Large sites should use a sitemap index file that references multiple sitemaps. You can submit multiple sitemaps directly in Search Console too.

**How often should I update my sitemap?**
Every time you add, update, or remove content. For blogs, update when you publish. For e-commerce, update when products change. Automate it if possible.

**Does a sitemap guarantee my pages will be indexed?**
No. A sitemap is a suggestion, not a command. Google may still choose not to index pages based on quality, relevance, or crawl budget constraints.

**What happens if my sitemap has errors?**
Google will show errors in Search Console. Common issues include 404 URLs, redirect chains, HTTPS mismatches, and XML formatting errors. Fix these to ensure proper indexing.

**Should I include paginated pages in my sitemap?**
Generally no. Include the main page and let Google discover paginated versions through internal links. Use rel="next" and rel="prev" for pagination.

**Can I submit a sitemap for a subdomain?**
Yes. Each subdomain needs its own sitemap. Submit `blog.yoursite.com/sitemap.xml` separately from `yoursite.com/sitemap.xml`.

**How long after submitting does Google index my pages?**
Typically 1-4 days for new pages on established sites. Fresh sites or pages from new domains may take 1-4 weeks. Submitting a sitemap speeds this up significantly.

**Do images and videos need separate sitemaps?**
Not required, but recommended if you want them to appear in Google Images or Google Video search. You can include image/video tags in your main sitemap or create dedicated sitemaps.

**What's the difference between XML and HTML sitemaps?**
XML sitemaps are for search engines. HTML sitemaps are for human visitors — a page listing your site structure to help users navigate. Good sites have both.

---

*Create your sitemap.xml instantly with FreeToolz's **[Sitemap Generator](/tools/sitemap-generator/)** — free, no signup required.*

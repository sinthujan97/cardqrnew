# CardQR — Add Legal Pages & Content Pages (Antigravity Prompt)

Paste this as your prompt. This adds new pages and links them into the existing site — it does not touch the QR generation logic, template creator, or visual redesign already in place.

---

## Brief

I have 7 pieces of page content ready (provided as markdown files, each with frontmatter containing `title`, `meta-description`, and `slug`). Add these as real, indexable pages on my site, replacing the current placeholder `#` links in the footer and adding new SEO landing pages.

## Pages to add

1. **privacy-policy.md** → route `/privacy-policy` — replace the current dead `#` link labeled "Privacy Policy" in the footer to point here
2. **terms-of-service.md** → route `/terms-of-service` — replace the current dead `#` link labeled "Terms of Service" in the footer to point here
3. **contact-support.md** → route `/contact` — replace the current dead `#` link labeled "Contact Support" in the footer to point here
4. **about-cardqr.md** → route `/about` — add a new "About" link to the footer, near the existing legal links
5. **blog-wifi-qr-code-generator.md** → route `/wifi-qr-code-generator`
6. **blog-qr-code-menu-maker.md** → route `/qr-code-menu-maker`
7. **blog-digital-business-card-maker.md** → route `/digital-business-card-maker`

## Requirements

- Each page must render as a real HTML page with its own `<title>` tag and `<meta name="description">` tag, populated from the `title` and `meta-description` frontmatter fields in each markdown file — this matters for SEO, each page needs unique metadata, not the site's default homepage metadata.
- Render the markdown content as clean, readable HTML using the site's existing typography and layout system (whatever markdown rendering approach fits the current stack — e.g. a markdown-to-JSX pipeline, or hand-converted static pages, whichever matches how the rest of the site is built).
- Apply the site's current visual design system (the stationery/print-inspired redesign already in place) to these pages — fonts, colors, spacing should match the rest of the site, not look like a bare unstyled markdown dump.
- These pages should include the site's standard header (logo, nav) and footer for consistent navigation.
- Internal links within the markdown content (e.g. links to `/create?t=wifi`, `/create?t=menu`, `/create?t=business`, `/#faq`) must resolve correctly to existing routes — verify these match my actual existing route structure and adjust if my routes differ.
- The three blog/content pages (wifi-qr-code-generator, qr-code-menu-maker, digital-business-card-maker) should be linked from somewhere discoverable on the site — add a simple "Guides" or "Resources" section/link in the main navigation or footer that lists these three pages, so they're not orphaned pages with no internal links pointing to them.
- Generate or update a `sitemap.xml` to include all new routes so they can be submitted to Google Search Console.

## Scope boundary

Do not modify: the QR generation logic, the `/create` template creator functionality, the homepage hero or 6-template grid, or any backend/API logic. This task is limited to adding the 7 new pages listed above, wiring their navigation links, fixing the dead footer links, and updating the sitemap.

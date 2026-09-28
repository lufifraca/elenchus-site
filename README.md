# elenchus-site

One-page static site for Elenchus. Plain HTML and CSS, no build step, no frameworks,
no trackers or analytics, no third-party requests (the display font is bundled).

| File | What it is |
|---|---|
| `index.html` | The page: all copy lives here |
| `styles.css` | Styles: the "case file" look, plus a dark mode (a photocopy negative) that follows the visitor's system setting |
| `site.js` | Holds the contact email and turns contact links into mailto links |
| `favicon.svg` | Favicon |
| `og-image.png` | 1200x630 preview image for link shares (Open Graph) |
| `fonts/` | Self-hosted Anton (headlines) and Courier Prime (the Elenchus name and labels), both under the SIL Open Font License (`fonts/OFL-*.txt`). Body text uses the system font |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is |

## Change the contact email

Edit the one constant at the top of `site.js`:

```js
const CONTACT_EMAIL = "hello@example.com";
```

Every link marked `data-contact` in `index.html` picks it up (the header link, both
"Request a free pilot" buttons and the footer). Visitors with JavaScript turned off see the
links jump to the footer rather than open their mail app.

## GitHub Pages

1. On GitHub: **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose branch
   `main` and folder `/ (root)`, and save.
3. After a minute the site is live at `https://lufifraca.github.io/elenchus-site/`.

Pushing to `main` redeploys it; there is nothing to build.

## Custom domain (later)

Not set up yet. When there is a domain:

1. Add a file named `CNAME` at the repo root containing just the domain (e.g. `elenchus.example`).
2. Point the domain's DNS at GitHub Pages (Settings → Pages shows the records) and tick
   **Enforce HTTPS** once it is available.
3. Update the two absolute URLs in `index.html` (`og:url` and `og:image`) to the new domain,
   so link previews keep working.

## Content rules

Keep claims to what the page already says: no client names, logos, testimonials or
statistics beyond our own test results, and never publish attack payload text.

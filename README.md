# exetast-site

One-page static site for Exetast, served at **exetast.com**. Plain HTML and CSS, no build
step, no frameworks, no trackers or analytics, no third-party requests (the fonts are bundled).

| File | What it is |
|---|---|
| `index.html` | The page: all copy lives here |
| `styles.css` | Styles: the "case file" look, plus a graphite-grey dark mode that follows the visitor's system setting |
| `site.js` | Holds the contact email (turns contact links into mailto links) and runs the hero transcript replay |
| `favicon.svg` | Favicon (the Exetast "E" mark) |
| `brand/` | Logo files: `exetast-mark`/`exetast-icon` SVGs (light and dark), PNG icons at 16–512 px. The 16/32 PNGs are fallback favicons and the 180 px one is the iOS home-screen icon. The mark is also inlined in the header and footer of `index.html` |
| `og-image.png` | 1200x630 preview image for link shares (Open Graph) |
| `fonts/` | Self-hosted Anton (headlines) and Courier Prime (the Exetast name and labels), both under the SIL Open Font License (`fonts/OFL-*.txt`). Body text uses the system font |
| `CNAME` | The custom domain (`exetast.com`) for GitHub Pages |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is |

## Change the contact email

Edit the one constant at the top of `site.js`:

```js
const CONTACT_EMAIL = "luca@exetast.com";
```

Every link marked `data-contact` in `index.html` picks it up (the header link, both
"Request a free pilot" buttons and the footer). Visitors with JavaScript turned off see the
links jump to the footer rather than open their mail app.

## GitHub Pages + custom domain

1. On GitHub: **Settings → Pages**. Set **Source** to *Deploy from a branch*, branch `main`,
   folder `/ (root)`, and save.
2. The repo already contains a `CNAME` file with `exetast.com`, so Pages will serve the site
   on that domain once DNS is set.
3. **DNS (at your domain registrar):** point the apex `exetast.com` at GitHub Pages with the
   four A records GitHub lists (185.199.108–111.153), or an ALIAS/ANAME to
   `lufifraca.github.io`. Settings → Pages shows the exact records and will verify them.
4. Tick **Enforce HTTPS** once the certificate is issued (can take a little while after DNS
   resolves).

Pushing to `main` redeploys; there is nothing to build. The `og:url` and `og:image` tags in
`index.html` already point at `https://exetast.com/`.

## Content rules

Keep claims to what the page already says: no client names, logos, testimonials or
statistics beyond our own test results, and never publish attack payload text.

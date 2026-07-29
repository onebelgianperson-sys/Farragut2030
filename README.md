# Farragut2030

*"Damn the torpedoes, full speed ahead."*

A research reference site cataloging companies developing autonomous and semi-autonomous naval mine-countermeasure (MCM) technology — mine detection, classification, and neutralization at sea. Built for researchers and policymakers who want a fast, structured orientation to the field.

The homepage renders each company as a clickable sea mine in an animated underwater minefield. A plain sortable/filterable table view is also available for quick comparison.

## Project structure

```
index.html          Homepage — animated minefield
companies.html       Sortable/filterable directory (table view)
company.html         Company profile template (reads ?slug=... from the URL)
about.html           About & methodology
css/style.css        All styles
js/main.js           Homepage minefield rendering + animation
js/companies.js       Directory table logic
js/company.js         Profile page rendering
data/companies.json    All company data — edit this to add/update companies
images/               Background photos (Pexels, free license)
```

No build step, no framework, no dependencies — just static HTML/CSS/JS. It can be edited with any text editor and hosted anywhere that serves static files (GitHub Pages, Netlify, etc.).

## Adding or editing a company

Open [`data/companies.json`](data/companies.json) and add an entry following the existing shape:

```json
{
  "slug": "unique-url-friendly-id",
  "name": "Company Name",
  "placeholder": false,
  "country": "Country",
  "founded": 2020,
  "autonomyLevel": "Fully autonomous (AUV)",
  "website": "https://example.com",
  "summary": "One paragraph overview.",
  "products": [ { "name": "Product Name", "description": "..." } ],
  "contracts": [ "Notable contract or customer, one string per item" ],
  "funding": "Funding history summary.",
  "sources": [ { "label": "Source title", "url": "https://..." } ]
}
```

That's it — no code changes needed. The homepage minefield and the directory table both read from this one file automatically, and each new entry gets its own mine and its own profile page.

Set `"placeholder": true` for entries that are illustrative/unverified — this shows an orange notice on the profile page. Real, sourced entries should set it to `false` (or omit it).

## Running it locally

Because the pages load `data/companies.json` via `fetch()`, opening `index.html` directly from disk (`file://`) will fail in most browsers due to CORS restrictions on local files. Serve the folder over HTTP instead:

```bash
python3 -m http.server 8420
```

Then open `http://localhost:8420` in a browser.

## Deploying to GitHub Pages

1. Push this repository to GitHub (see the setup steps your assistant walked you through, or GitHub's own docs).
2. In the repo on GitHub: **Settings → Pages**.
3. Under "Build and deployment", set **Source** to "Deploy from a branch".
4. Set **Branch** to `main` and folder to `/ (root)`, then **Save**.
5. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

## Image credits

Background photography is free-to-use under the [Pexels License](https://www.pexels.com/license/) (no attribution required, credited here as good practice):

- "Underwater Photography of Deep Sea" — Blaque X
- "Silhouette of Warship on the Sea" — Germannavyphotograph
- "Dark Sea Waves" — iramezatil

## Disclaimer

This is an independent, unofficial reference. It is not exhaustive, not vetted by any defense institution or government body, and should not be the sole basis for procurement, investment, or policy decisions. See [`about.html`](about.html) for full methodology.

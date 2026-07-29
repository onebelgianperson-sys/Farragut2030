// Farragut2030 — company profile page renderer
(function () {
  "use strict";

  const root = document.getElementById("profileRoot");
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function renderNotFound() {
    root.innerHTML = `
      <a class="profile__back" href="index.html">&larr; Back to minefield</a>
      <h1>Company not found</h1>
      <p>We couldn't find a profile for "${escapeHtml(slug || "")}". It may have been removed or renamed.</p>
      <p><a href="companies.html">Browse the full directory instead &rarr;</a></p>
    `;
  }

  function renderCompany(c) {
    document.title = c.name + " — Farragut2030";

    const badges = [c.country, c.autonomyLevel]
      .filter(Boolean)
      .map((b) => `<span class="badge">${escapeHtml(b)}</span>`)
      .join("");

    const products = (c.products || [])
      .map(
        (p) => `
        <div class="product-card">
          <h3>${escapeHtml(p.name)}</h3>
          <p>${escapeHtml(p.description)}</p>
        </div>`
      )
      .join("") || "<p>No product information yet.</p>";

    const contracts = (c.contracts || [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("") || "<li>No contract or funding information yet.</li>";

    const sources = (c.sources || [])
      .map(
        (s) =>
          `<li><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.label)}</a></li>`
      )
      .join("") || "<li>No sources listed yet.</li>";

    const placeholderNote = c.placeholder
      ? `<div class="profile__placeholder-note">This is a placeholder entry seeded for site development. Details are illustrative, not verified research, and links point to example.com.</div>`
      : "";

    root.innerHTML = `
      <a class="profile__back" href="index.html">&larr; Back to minefield</a>

      <div class="profile__header">
        <div>
          <h1 class="profile__title">${escapeHtml(c.name)}</h1>
          <p class="profile__meta">${c.founded ? "Founded " + escapeHtml(c.founded) : ""}${
      c.website ? ` &middot; <a href="${escapeHtml(c.website)}" target="_blank" rel="noopener noreferrer">Website</a>` : ""
    }</p>
        </div>
        <div class="profile__badges">${badges}</div>
      </div>

      ${placeholderNote}

      <div class="profile__grid">
        <div>
          <section class="profile__section">
            <h2>Overview</h2>
            <p>${escapeHtml(c.summary)}</p>
          </section>

          <section class="profile__section">
            <h2>Products &amp; Programs</h2>
            ${products}
          </section>

          <section class="profile__section">
            <h2>Contracts &amp; Funding</h2>
            <ul class="contract-list">${contracts}</ul>
            ${c.funding ? `<p>${escapeHtml(c.funding)}</p>` : ""}
          </section>
        </div>

        <div>
          <section class="profile__section">
            <h2>Key Facts</h2>
            <ul class="fact-list">
              <li><span>Country</span><span>${escapeHtml(c.country || "—")}</span></li>
              <li><span>Autonomy level</span><span>${escapeHtml(c.autonomyLevel || "—")}</span></li>
              <li><span>Founded</span><span>${escapeHtml(c.founded || "—")}</span></li>
            </ul>
          </section>

          <section class="profile__section">
            <h2>Sources</h2>
            <ul class="source-list">${sources}</ul>
          </section>
        </div>
      </div>
    `;
  }

  fetch("data/companies.json")
    .then((r) => r.json())
    .then((companies) => {
      const c = companies.find((item) => item.slug === slug);
      if (!c) {
        renderNotFound();
        return;
      }
      renderCompany(c);
    })
    .catch((err) => {
      root.innerHTML = '<p style="color:var(--danger-400);">Could not load company data.</p>';
      console.error(err);
    });
})();

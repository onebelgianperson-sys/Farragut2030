// Farragut2030 — directory (table) view
(function () {
  "use strict";

  const tableBody = document.getElementById("tableBody");
  const resultCount = document.getElementById("resultCount");
  const emptyState = document.getElementById("emptyState");
  const searchInput = document.getElementById("searchInput");
  const filterCountry = document.getElementById("filterCountry");
  const filterAutonomy = document.getElementById("filterAutonomy");
  const headers = document.querySelectorAll(".directory__table thead th");

  let allCompanies = [];
  let sortKey = "name";
  let sortDir = 1;

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function uniqueSorted(values) {
    return Array.from(new Set(values.filter(Boolean))).sort();
  }

  function populateFilterOptions(companies) {
    const countries = uniqueSorted(companies.map((c) => c.country));
    const autonomyLevels = uniqueSorted(companies.map((c) => c.autonomyLevel));

    countries.forEach((v) => filterCountry.add(new Option(v, v)));
    autonomyLevels.forEach((v) => filterAutonomy.add(new Option(v, v)));
  }

  function applyFiltersAndSort() {
    const query = searchInput.value.trim().toLowerCase();
    const country = filterCountry.value;
    const autonomy = filterAutonomy.value;

    let filtered = allCompanies.filter((c) => {
      if (query && !c.name.toLowerCase().includes(query)) return false;
      if (country && c.country !== country) return false;
      if (autonomy && c.autonomyLevel !== autonomy) return false;
      return true;
    });

    filtered.sort((a, b) => {
      const av = (a[sortKey] ?? "").toString().toLowerCase();
      const bv = (b[sortKey] ?? "").toString().toLowerCase();
      if (av < bv) return -1 * sortDir;
      if (av > bv) return 1 * sortDir;
      return 0;
    });

    renderRows(filtered);
  }

  function renderRows(companies) {
    resultCount.textContent = `${companies.length} of ${allCompanies.length} companies`;

    if (companies.length === 0) {
      tableBody.innerHTML = "";
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;

    tableBody.innerHTML = companies
      .map(
        (c) => `
        <tr>
          <td><a href="company.html?slug=${encodeURIComponent(c.slug)}">${escapeHtml(c.name)}</a></td>
          <td>${escapeHtml(c.country || "—")}</td>
          <td>${escapeHtml(c.autonomyLevel || "—")}</td>
          <td>${escapeHtml(c.founded || "—")}</td>
        </tr>`
      )
      .join("");
  }

  headers.forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.key;
      if (sortKey === key) {
        sortDir *= -1;
      } else {
        sortKey = key;
        sortDir = 1;
      }
      headers.forEach((h) => h.removeAttribute("data-active"));
      th.setAttribute("data-active", "");
      applyFiltersAndSort();
    });
  });

  [searchInput, filterCountry, filterAutonomy].forEach((el) => {
    el.addEventListener("input", applyFiltersAndSort);
  });

  fetch("data/companies.json")
    .then((r) => r.json())
    .then((companies) => {
      allCompanies = companies;
      populateFilterOptions(companies);
      applyFiltersAndSort();
    })
    .catch((err) => {
      tableBody.innerHTML = '<tr><td colspan="4">Could not load company data.</td></tr>';
      console.error(err);
    });
})();

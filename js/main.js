// Farragut2030 — homepage minefield renderer
(function () {
  "use strict";

  const FIELD = document.getElementById("minefield");
  const BUBBLE_LAYER = document.getElementById("bubbleLayer");

  function hashStr(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (Math.imul(h, 31) + str.charCodeAt(i)) >>> 0;
    }
    return h;
  }

  function rand01(slug, salt) {
    return (hashStr(slug + ":" + salt) % 10000) / 10000;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function buildMineSvg() {
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "mine-svg");
    svg.setAttribute("viewBox", "0 0 120 120");
    svg.setAttribute("aria-hidden", "true");

    const hull = document.createElementNS(NS, "circle");
    hull.setAttribute("class", "mine-hull");
    hull.setAttribute("cx", "60");
    hull.setAttribute("cy", "60");
    hull.setAttribute("r", "38");
    svg.appendChild(hull);

    // Horns radiating around the hull, evenly spaced
    const hornCount = 10;
    for (let i = 0; i < hornCount; i++) {
      const angle = (i / hornCount) * Math.PI * 2;
      const baseX = 60 + Math.cos(angle) * 36;
      const baseY = 60 + Math.sin(angle) * 36;
      const tipX = 60 + Math.cos(angle) * 50;
      const tipY = 60 + Math.sin(angle) * 50;

      const horn = document.createElementNS(NS, "line");
      horn.setAttribute("class", "mine-horn");
      horn.setAttribute("x1", baseX.toFixed(1));
      horn.setAttribute("y1", baseY.toFixed(1));
      horn.setAttribute("x2", tipX.toFixed(1));
      horn.setAttribute("y2", tipY.toFixed(1));
      horn.setAttribute("stroke", "url(#hornGradient)");
      horn.setAttribute("stroke-width", "6");
      horn.setAttribute("stroke-linecap", "round");
      svg.appendChild(horn);

      const tip = document.createElementNS(NS, "circle");
      tip.setAttribute("class", "mine-horn");
      tip.setAttribute("cx", tipX.toFixed(1));
      tip.setAttribute("cy", tipY.toFixed(1));
      tip.setAttribute("r", "4.5");
      svg.appendChild(tip);
    }

    // A ring of small rivets for texture
    const rivetCount = 8;
    for (let i = 0; i < rivetCount; i++) {
      const angle = (i / rivetCount) * Math.PI * 2 + 0.3;
      const rx = 60 + Math.cos(angle) * 22;
      const ry = 60 + Math.sin(angle) * 22;
      const rivet = document.createElementNS(NS, "circle");
      rivet.setAttribute("class", "mine-rivet");
      rivet.setAttribute("cx", rx.toFixed(1));
      rivet.setAttribute("cy", ry.toFixed(1));
      rivet.setAttribute("r", "2.4");
      svg.appendChild(rivet);
    }

    return svg;
  }

  function renderMines(companies) {
    FIELD.innerHTML = "";
    const n = companies.length;

    companies.forEach((company, index) => {
      const slug = company.slug;
      const slot = 100 / n;
      const xPct = clamp(
        slot * index + slot * (0.22 + 0.56 * rand01(slug, "x")),
        7,
        90
      );
      const band = index % 2 === 0 ? 20 : 34;
      const yPct = clamp(band + rand01(slug, "y") * 14, 16, 58);
      const chainLen = Math.round(150 + rand01(slug, "chain") * 190);
      const swayDur = (4.5 + rand01(slug, "dur") * 3).toFixed(2);
      const swayDelay = (rand01(slug, "delay") * 4).toFixed(2);
      const mineSize = Math.round(88 + rand01(slug, "size") * 22);
      const labelSize = company.name.length > 20 ? 0.62 : company.name.length > 13 ? 0.68 : 0.78;

      const marker = document.createElement("div");
      marker.className = "mine-marker";
      marker.style.left = xPct.toFixed(2) + "%";
      marker.style.top = yPct.toFixed(2) + "%";
      marker.setAttribute("role", "listitem");

      const chain = document.createElement("div");
      chain.className = "mine-chain";
      chain.style.height = chainLen + "px";

      const link = document.createElement("a");
      link.className = "mine-clickable";
      link.href = "company.html?slug=" + encodeURIComponent(slug);
      link.setAttribute("aria-label", "Open profile: " + company.name);
      link.style.setProperty("--sway-duration", swayDur + "s");
      link.style.setProperty("--sway-delay", swayDelay + "s");
      link.style.setProperty("--mine-size", mineSize + "px");
      link.style.setProperty("--label-size", labelSize + "rem");

      const pulse = document.createElement("span");
      pulse.className = "mine-pulse-ring";

      const label = document.createElement("span");
      label.className = "mine-label";
      label.textContent = company.name;

      link.appendChild(buildMineSvg());
      link.appendChild(pulse);
      link.appendChild(label);

      marker.appendChild(chain);
      marker.appendChild(link);
      FIELD.appendChild(marker);
    });

    // A dashed "more entries" marker linking to the full directory.
    // Give it the opposite band from the last mine so their labels never share a row.
    const moreSlot = 100 / (n + 1);
    const moreBand = n % 2 === 0 ? 20 : 34;
    const moreMarker = document.createElement("div");
    moreMarker.className = "mine-marker";
    moreMarker.style.left = clamp(moreSlot * n + moreSlot * 0.5, 7, 90).toFixed(2) + "%";
    moreMarker.style.top = moreBand + "%";

    const moreChain = document.createElement("div");
    moreChain.className = "mine-chain";
    moreChain.style.height = "110px";

    const moreLink = document.createElement("a");
    moreLink.className = "mine-clickable";
    moreLink.href = "companies.html";
    moreLink.setAttribute("aria-label", "View the full company directory");
    moreLink.style.setProperty("--mine-size", "78px");
    moreLink.style.setProperty("--sway-duration", "6.2s");

    const moreInner = document.createElement("div");
    moreInner.className = "mine-more";
    moreInner.style.width = "100%";
    moreInner.style.height = "100%";
    moreInner.innerHTML = "View<br>all&nbsp;&rarr;";

    moreLink.appendChild(moreInner);
    moreMarker.appendChild(moreChain);
    moreMarker.appendChild(moreLink);
    FIELD.appendChild(moreMarker);
  }

  function renderBubbles(count) {
    if (!BUBBLE_LAYER) return;
    for (let i = 0; i < count; i++) {
      const b = document.createElement("div");
      b.className = "bubble";
      const size = 4 + Math.random() * 14;
      b.style.width = size + "px";
      b.style.height = size + "px";
      b.style.left = Math.random() * 100 + "%";
      b.style.setProperty("--drift", (Math.random() * 60 - 30).toFixed(0) + "px");
      b.style.animationDuration = (9 + Math.random() * 12).toFixed(2) + "s";
      b.style.animationDelay = "-" + (Math.random() * 20).toFixed(2) + "s";
      BUBBLE_LAYER.appendChild(b);
    }
  }

  fetch("data/companies.json")
    .then((r) => r.json())
    .then((companies) => {
      renderMines(companies);
      renderBubbles(28);
    })
    .catch((err) => {
      FIELD.innerHTML =
        '<p style="color:var(--danger-400); text-align:center; padding-top:2rem;">Could not load company data. If you\'re opening this file directly, run a local server instead (see README).</p>';
      console.error("Failed to load companies.json", err);
    });
})();

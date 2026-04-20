// Détecte ASIN sur la page produit Amazon et affiche un badge flottant
(function () {
  function detectMarketplace() {
    const host = location.hostname;
    if (host.includes("amazon.fr")) return "fr";
    if (host.includes("amazon.co.uk")) return "uk";
    return "com";
  }

  function detectAsin() {
    const m = location.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/);
    if (m) return m[1];
    const el = document.querySelector('[data-asin]');
    if (el) return el.getAttribute("data-asin");
    return null;
  }

  function estimateFromBsr(bsr) {
    if (!bsr || bsr <= 0) return { daily: 0, monthly: 0 };
    let daily = 0;
    if (bsr <= 100) daily = 800;
    else if (bsr <= 1000) daily = 250;
    else if (bsr <= 5000) daily = 60;
    else if (bsr <= 20000) daily = 15;
    else if (bsr <= 100000) daily = 4;
    else if (bsr <= 500000) daily = 1;
    else daily = 0.2;
    return { daily: Math.round(daily), monthly: Math.round(daily * 30) };
  }

  function scoreFromMetrics({ bsr, price, reviews }) {
    let score = 0;
    // BSR (50 pts)
    if (bsr) {
      if (bsr <= 5000) score += 50;
      else if (bsr <= 20000) score += 40;
      else if (bsr <= 100000) score += 25;
      else if (bsr <= 500000) score += 10;
    }
    // Prix (20 pts)
    if (price) {
      if (price >= 4 && price <= 15) score += 20;
      else if (price >= 2.99) score += 12;
      else score += 5;
    }
    // Concurrence via reviews (30 pts) — moins de reviews = opportunité
    if (reviews !== null && reviews !== undefined) {
      if (reviews < 50) score += 30;
      else if (reviews < 200) score += 20;
      else if (reviews < 1000) score += 10;
      else score += 3;
    } else {
      score += 15;
    }
    return Math.min(100, Math.round(score));
  }

  function verdictFromScore(score) {
    if (score >= 70) return { label: "GO", color: "#10b981", emoji: "🚀" };
    if (score >= 45) return { label: "À CREUSER", color: "#f59e0b", emoji: "🔍" };
    return { label: "À ÉVITER", color: "#ef4444", emoji: "⛔" };
  }

  function competitionFromReviews(reviews) {
    if (reviews === null || reviews === undefined) return { label: "Inconnue", color: "#64748b" };
    if (reviews < 50) return { label: "Faible", color: "#10b981" };
    if (reviews < 500) return { label: "Moyenne", color: "#f59e0b" };
    return { label: "Forte", color: "#ef4444" };
  }

  function injectBadge(metrics) {
    if (document.getElementById("ebkstudio-badge")) return;
    const score = scoreFromMetrics(metrics);
    const verdict = verdictFromScore(score);
    const est = estimateFromBsr(metrics.bsr);
    const comp = competitionFromReviews(metrics.reviews);

    const box = document.createElement("div");
    box.id = "ebkstudio-badge";
    box.innerHTML = `
      <div class="ebk-head">
        <span class="ebk-logo">📚 EbookStudio</span>
        <button class="ebk-close" aria-label="Fermer">×</button>
      </div>
      <div class="ebk-score-row">
        <div class="ebk-score" style="--c:${verdict.color}">
          <div class="ebk-score-num">${score}</div>
          <div class="ebk-score-lbl">/100</div>
        </div>
        <div class="ebk-verdict" style="background:${verdict.color}">
          ${verdict.emoji} ${verdict.label}
        </div>
      </div>
      <div class="ebk-stats">
        <div class="ebk-stat"><span>Ventes/jour</span><b>~${est.daily}</b></div>
        <div class="ebk-stat"><span>Ventes/mois</span><b>~${est.monthly}</b></div>
        <div class="ebk-stat"><span>Concurrence</span><b style="color:${comp.color}">${comp.label}</b></div>
        <div class="ebk-stat"><span>BSR</span><b>${metrics.bsr ? "#" + metrics.bsr.toLocaleString("fr-FR") : "—"}</b></div>
      </div>
      <a class="ebk-cta" href="https://www.ebookstudio.fr/offres" target="_blank" rel="noopener">
        Analyse complète sur EbookStudio →
      </a>
    `;
    document.body.appendChild(box);
    box.querySelector(".ebk-close").addEventListener("click", () => box.remove());
  }

  function parseFromPage() {
    // BSR
    let bsr = null;
    const bodyText = document.body.innerText || "";
    const bsrMatch = bodyText.match(/(?:n[°o]|#)\s?([\d\s.,]{2,})\s+(?:in|en|dans)\s+(?:Boutique\s+)?Kindle/i);
    if (bsrMatch) bsr = parseInt(bsrMatch[1].replace(/[\s.,]/g, ""), 10);
    if (!bsr) {
      const bsrAlt = bodyText.match(/Best Sellers Rank[^\d]*#?([\d,]+)/i);
      if (bsrAlt) bsr = parseInt(bsrAlt[1].replace(/[,\s]/g, ""), 10);
    }
    // Prix
    let price = null;
    const priceEl = document.querySelector(".a-price .a-offscreen, #kindle-price, .a-color-price");
    if (priceEl) {
      const m = priceEl.textContent.match(/([\d]+[.,][\d]{2})/);
      if (m) price = parseFloat(m[1].replace(",", "."));
    }
    // Reviews
    let reviews = null;
    const reviewsEl = document.querySelector("#acrCustomerReviewText");
    if (reviewsEl) {
      const m = reviewsEl.textContent.match(/([\d\s.,]+)/);
      if (m) reviews = parseInt(m[1].replace(/[\s.,]/g, ""), 10);
    }
    return { bsr, price, reviews };
  }

  function run() {
    const asin = detectAsin();
    if (!asin) return;
    if (!/\/(dp|gp\/product)\//.test(location.pathname)) return;
    const metrics = parseFromPage();
    if (!metrics.bsr && !metrics.price) return;
    injectBadge(metrics);
  }

  // Run on load + on URL change (Amazon SPA-ish)
  setTimeout(run, 1500);
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      const old = document.getElementById("ebkstudio-badge");
      if (old) old.remove();
      setTimeout(run, 1500);
    }
  }).observe(document, { subtree: true, childList: true });
})();

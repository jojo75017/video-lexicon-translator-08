// EbookStudio Scanner — affiche un badge sur toutes les pages Amazon Kindle pertinentes
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
    return null;
  }

  function isSearchPage() {
    return /\/s(\?|$)/.test(location.pathname + location.search);
  }

  function isProductPage() {
    return /\/(dp|gp\/product)\//.test(location.pathname);
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
    if (bsr) {
      if (bsr <= 5000) score += 50;
      else if (bsr <= 20000) score += 40;
      else if (bsr <= 100000) score += 25;
      else if (bsr <= 500000) score += 10;
    } else {
      score += 20;
    }
    if (price) {
      if (price >= 4 && price <= 15) score += 20;
      else if (price >= 2.99) score += 12;
      else score += 5;
    } else {
      score += 10;
    }
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

  function injectBadge(metrics, mode) {
    const existing = document.getElementById("ebkstudio-badge");
    if (existing) existing.remove();

    const score = scoreFromMetrics(metrics);
    const verdict = verdictFromScore(score);
    const est = estimateFromBsr(metrics.bsr);
    const comp = competitionFromReviews(metrics.reviews);

    const box = document.createElement("div");
    box.id = "ebkstudio-badge";

    if (mode === "search") {
      box.innerHTML = `
        <div class="ebk-head">
          <span class="ebk-logo">📚 EbookStudio</span>
          <button class="ebk-close" aria-label="Fermer">×</button>
        </div>
        <div class="ebk-search-msg">
          🔍 Page de recherche détectée<br/>
          Cliquez sur un livre pour voir son score de niche complet.
        </div>
        <a class="ebk-cta" href="https://www.ebookstudio.fr/offres" target="_blank" rel="noopener">
          Outils de recherche KDP avancés →
        </a>
      `;
    } else {
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
          <div class="ebk-stat"><span>Prix</span><b>${metrics.price ? metrics.price.toFixed(2) + " €" : "—"}</b></div>
          <div class="ebk-stat"><span>Avis</span><b>${metrics.reviews !== null ? metrics.reviews : "—"}</b></div>
        </div>
        <a class="ebk-cta" href="https://www.ebookstudio.fr/offres" target="_blank" rel="noopener">
          Analyse complète sur EbookStudio →
        </a>
      `;
    }
    document.body.appendChild(box);
    box.querySelector(".ebk-close").addEventListener("click", () => box.remove());
  }

  function parseFromPage() {
    const bodyText = document.body.innerText || "";

    // BSR — multiple patterns FR/UK/US
    let bsr = null;
    const patterns = [
      /(?:n[°o]|#)\s?([\d\s.,]{2,})\s+(?:in|en|dans)\s+(?:Boutique\s+)?Kindle/i,
      /Best Sellers Rank[^\d]*#?([\d,. ]+)\s+in\s+Kindle/i,
      /Classement\s+des\s+meilleures\s+ventes[^\d]*#?([\d\s.,]+)\s+en\s+(?:Boutique\s+)?Kindle/i,
      /#([\d,. ]+)\s+Paid\s+in\s+Kindle/i,
    ];
    for (const re of patterns) {
      const m = bodyText.match(re);
      if (m) {
        bsr = parseInt(m[1].replace(/[\s.,]/g, ""), 10);
        if (bsr) break;
      }
    }

    // Prix
    let price = null;
    const priceSelectors = [
      ".a-price .a-offscreen",
      "#kindle-price",
      ".kindle-price .a-color-price",
      ".a-color-price",
      "#price",
    ];
    for (const sel of priceSelectors) {
      const el = document.querySelector(sel);
      if (el) {
        const m = el.textContent.match(/([\d]+[.,][\d]{2})/);
        if (m) {
          price = parseFloat(m[1].replace(",", "."));
          if (price) break;
        }
      }
    }

    // Reviews
    let reviews = null;
    const reviewsEl = document.querySelector("#acrCustomerReviewText, [data-hook='total-review-count']");
    if (reviewsEl) {
      const m = reviewsEl.textContent.match(/([\d\s.,]+)/);
      if (m) reviews = parseInt(m[1].replace(/[\s.,]/g, ""), 10);
    }

    return { bsr, price, reviews };
  }

  function run() {
    if (isSearchPage()) {
      injectBadge({ bsr: null, price: null, reviews: null }, "search");
      return;
    }
    if (isProductPage()) {
      const metrics = parseFromPage();
      injectBadge(metrics, "product");
      return;
    }
  }

  // Run après chargement
  setTimeout(run, 1200);
  setTimeout(run, 3000); // retry pour SPA + lazy load

  // Re-run on URL change (Amazon SPA)
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

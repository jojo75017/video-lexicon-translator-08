// EbookStudio Scanner — Analyse Amazon Kindle complète
(function () {
  const STORAGE_KEY = "ebkstudio_history";
  const MAX_HISTORY = 30;

  function detectMarketplace() {
    const host = location.hostname;
    if (host.includes("amazon.fr")) return "fr";
    if (host.includes("amazon.co.uk")) return "uk";
    if (host.includes("amazon.de")) return "de";
    if (host.includes("amazon.es")) return "es";
    if (host.includes("amazon.it")) return "it";
    return "com";
  }

  function detectAsin() {
    const m = location.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/);
    return m ? m[1] : null;
  }

  function isSearchPage() {
    return /\/s(\?|$|\/)/.test(location.pathname + location.search) || location.search.includes("k=");
  }

  function isProductPage() {
    return /\/(dp|gp\/product)\/[A-Z0-9]{10}/.test(location.pathname);
  }

  // ============ PARSING FIABLE ============
  function parseNumber(str) {
    if (!str) return null;
    // Normalise: supprime espaces (insécables compris), points, virgules
    const cleaned = String(str).replace(/[\s\u00A0.,]/g, "");
    const n = parseInt(cleaned, 10);
    return isNaN(n) ? null : n;
  }

  function parsePrice(str) {
    if (!str) return null;
    // Cherche un nombre style 12,34 ou 12.34 (en évitant les milliers)
    const m = String(str).match(/(\d+)[.,](\d{2})(?!\d)/);
    if (!m) return null;
    return parseFloat(`${m[1]}.${m[2]}`);
  }

  function extractBsrFromProduct() {
    // Stratégie 1: tableau de détails produit
    const detailRows = document.querySelectorAll("#detailBulletsWrapper_feature_div li, #productDetails_detailBullets_sections1 tr, #prodDetails tr");
    for (const row of detailRows) {
      const txt = row.innerText || "";
      if (/(Best\s*Sellers?\s*Rank|Classement|Amazon\s*Bestsellers?\s*Rank|Meilleurs?\s*ventes)/i.test(txt)) {
        // Prend le PREMIER nombre suivi de "in/en/dans/Boutique/Kindle/Paid"
        const m = txt.match(/[#nN][°o]?\s*([\d\s.,\u00A0]{2,})\s+(?:in|en|dans|Paid)/);
        if (m) {
          const n = parseNumber(m[1]);
          if (n && n > 0) return n;
        }
      }
    }
    // Stratégie 2: SalesRank explicite
    const rankEl = document.querySelector("#SalesRank, [data-feature-name='salesRank']");
    if (rankEl) {
      const m = rankEl.innerText.match(/[#nN][°o]?\s*([\d\s.,\u00A0]{2,})/);
      if (m) {
        const n = parseNumber(m[1]);
        if (n && n > 0) return n;
      }
    }
    return null;
  }

  function extractPriceFromProduct() {
    const selectors = [
      "#kindle-price",
      ".kindle-price .a-color-price",
      "#tmm-grid-swatch-KINDLE .a-color-price",
      "#tmmSwatches .selected .a-color-price",
      "#corePrice_feature_div .a-price .a-offscreen",
      "#corePriceDisplay_desktop_feature_div .a-price .a-offscreen",
      ".a-price .a-offscreen",
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        const p = parsePrice(el.textContent);
        if (p && p > 0 && p < 999) return p;
      }
    }
    return null;
  }

  function extractReviewsFromProduct() {
    const el = document.querySelector("#acrCustomerReviewText, [data-hook='total-review-count']");
    if (el) {
      const n = parseNumber(el.textContent.replace(/[^\d\s.,]/g, ""));
      if (n !== null) return n;
    }
    return null;
  }

  function extractTitle() {
    const el = document.querySelector("#productTitle, #title");
    return el ? el.innerText.trim() : null;
  }

  function extractDescription() {
    const sel = document.querySelector("#bookDescription_feature_div .a-expander-content, #productDescription, [data-feature-name='bookDescription']");
    return sel ? sel.innerText.trim().slice(0, 1500) : "";
  }

  function parseProductPage() {
    return {
      asin: detectAsin(),
      title: extractTitle(),
      bsr: extractBsrFromProduct(),
      price: extractPriceFromProduct(),
      reviews: extractReviewsFromProduct(),
      description: extractDescription(),
    };
  }

  // ============ MOTS-CLÉS ============
  const STOP_WORDS = new Set("le la les un une des de du et ou à a au aux en pour par sur dans avec sans qui que quoi comme si plus moins très tout tous toute toutes ce cette ces son sa ses leur leurs notre votre nos vos mon ma mes ton ta tes the of and or to in for on with by from is are was were be been being it its as at this that these those an your you we our they them him her his she he i".split(/\s+/));

  function extractKeywords(title, description) {
    const text = `${title || ""} ${description || ""}`.toLowerCase();
    // Mots simples (>= 4 lettres)
    const words = text.match(/[a-zàâäéèêëïîôöùûüç]{4,}/gi) || [];
    const freq = {};
    words.forEach(w => {
      const lw = w.toLowerCase();
      if (!STOP_WORDS.has(lw)) freq[lw] = (freq[lw] || 0) + 1;
    });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8).map(e => e[0]);

    // Bigrammes
    const tokens = text.match(/[a-zàâäéèêëïîôöùûüç]+/gi) || [];
    const bigrams = {};
    for (let i = 0; i < tokens.length - 1; i++) {
      const a = tokens[i].toLowerCase(), b = tokens[i + 1].toLowerCase();
      if (a.length < 3 || b.length < 3 || STOP_WORDS.has(a) || STOP_WORDS.has(b)) continue;
      const bg = `${a} ${b}`;
      bigrams[bg] = (bigrams[bg] || 0) + 1;
    }
    const topBigrams = Object.entries(bigrams).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);

    return { single: top, longTail: topBigrams };
  }

  // ============ SCORING ============
  function estimateFromBsr(bsr) {
    if (!bsr || bsr <= 0) return { daily: 0, monthly: 0 };
    let daily;
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
      else score += 3;
    } else score += 15;

    if (price) {
      if (price >= 4 && price <= 15) score += 20;
      else if (price >= 2.99) score += 12;
      else score += 5;
    } else score += 8;

    if (reviews !== null && reviews !== undefined) {
      if (reviews < 50) score += 30;
      else if (reviews < 200) score += 20;
      else if (reviews < 1000) score += 10;
      else score += 3;
    } else score += 12;

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

  // ============ HISTORIQUE ============
  function saveToHistory(entry) {
    if (!chrome?.storage?.local) return;
    chrome.storage.local.get([STORAGE_KEY], (res) => {
      const list = res[STORAGE_KEY] || [];
      // Évite doublons (par ASIN)
      const filtered = list.filter(x => x.asin !== entry.asin);
      filtered.unshift({ ...entry, scannedAt: Date.now() });
      chrome.storage.local.set({ [STORAGE_KEY]: filtered.slice(0, MAX_HISTORY) });
    });
  }

  // ============ ANALYSE PAGE DE RECHERCHE ============
  function scanSearchResults() {
    const results = document.querySelectorAll("[data-component-type='s-search-result']");
    const items = [];
    results.forEach((card, idx) => {
      if (idx >= 10) return;
      const asin = card.getAttribute("data-asin");
      if (!asin || asin.length !== 10) return;
      const titleEl = card.querySelector("h2 span, h2 a span");
      const priceEl = card.querySelector(".a-price .a-offscreen");
      const reviewsEl = card.querySelector("[aria-label*='ratings'], [aria-label*='évaluations'], .a-size-base.s-underline-text");
      const ratingEl = card.querySelector("[aria-label*='out of 5'], [aria-label*='sur 5']");

      const price = priceEl ? parsePrice(priceEl.textContent) : null;
      const reviews = reviewsEl ? parseNumber(reviewsEl.textContent) : null;
      const rating = ratingEl ? parseFloat((ratingEl.getAttribute("aria-label") || "").match(/[\d.,]+/)?.[0]?.replace(",", ".") || "0") : null;

      items.push({
        asin,
        title: titleEl?.innerText?.trim()?.slice(0, 80) || "?",
        price,
        reviews,
        rating,
        card,
      });
    });
    return items;
  }

  function highlightNuggets(items) {
    items.forEach(item => {
      // Pépite = peu d'avis (<100) + bon prix (>=2.99)
      if (item.reviews !== null && item.reviews < 100 && item.price && item.price >= 2.99) {
        const badge = document.createElement("div");
        badge.className = "ebk-nugget-badge";
        badge.innerHTML = "💎 PÉPITE";
        item.card.style.position = "relative";
        item.card.style.outline = "2px solid #10b981";
        item.card.style.outlineOffset = "-2px";
        item.card.appendChild(badge);
      }
    });
  }

  function analyzeSearchNiche(items) {
    if (!items.length) return null;
    const withReviews = items.filter(i => i.reviews !== null);
    const withPrice = items.filter(i => i.price !== null);
    const avgReviews = withReviews.length ? Math.round(withReviews.reduce((s, i) => s + i.reviews, 0) / withReviews.length) : null;
    const avgPrice = withPrice.length ? (withPrice.reduce((s, i) => s + i.price, 0) / withPrice.length) : null;
    const nuggets = items.filter(i => i.reviews !== null && i.reviews < 100 && i.price && i.price >= 2.99).length;

    // Score niche : peu d'avis moyens = bon, prix moyen sain = bon
    let nicheScore = 0;
    if (avgReviews !== null) {
      if (avgReviews < 50) nicheScore += 50;
      else if (avgReviews < 200) nicheScore += 35;
      else if (avgReviews < 1000) nicheScore += 20;
      else nicheScore += 5;
    }
    if (avgPrice !== null) {
      if (avgPrice >= 4 && avgPrice <= 12) nicheScore += 30;
      else if (avgPrice >= 2.99) nicheScore += 20;
      else nicheScore += 8;
    }
    nicheScore += Math.min(20, nuggets * 4);

    return { avgReviews, avgPrice, nuggets, nicheScore: Math.min(100, nicheScore), total: items.length };
  }

  // ============ UI BADGE ============
  function injectBadge(content) {
    const old = document.getElementById("ebkstudio-badge");
    if (old) old.remove();
    const box = document.createElement("div");
    box.id = "ebkstudio-badge";
    box.innerHTML = content;
    document.body.appendChild(box);
    box.querySelector(".ebk-close")?.addEventListener("click", () => box.remove());
  }

  function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      const orig = btn.textContent;
      btn.textContent = "✓ Copié !";
      setTimeout(() => { btn.textContent = orig; }, 1500);
    });
  }

  function renderProductBadge(metrics, keywords) {
    const score = scoreFromMetrics(metrics);
    const verdict = verdictFromScore(score);
    const est = estimateFromBsr(metrics.bsr);
    const comp = competitionFromReviews(metrics.reviews);

    return `
      <div class="ebk-head">
        <span class="ebk-logo">📚 EbookStudio</span>
        <button class="ebk-close" aria-label="Fermer">×</button>
      </div>
      <div class="ebk-tabs">
        <button class="ebk-tab ebk-active" data-tab="score">Score</button>
        <button class="ebk-tab" data-tab="kw">Mots-clés</button>
      </div>
      <div class="ebk-pane ebk-pane-score">
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
          <div class="ebk-stat"><span>Avis</span><b>${metrics.reviews !== null ? metrics.reviews.toLocaleString("fr-FR") : "—"}</b></div>
        </div>
      </div>
      <div class="ebk-pane ebk-pane-kw" style="display:none">
        <div class="ebk-kw-section">
          <div class="ebk-kw-label">Mots-clés principaux</div>
          <div class="ebk-kw-list">
            ${keywords.single.map(k => `<span class="ebk-kw">${k}</span>`).join("") || "<i>Aucun détecté</i>"}
          </div>
          <button class="ebk-copy-btn" data-copy="${keywords.single.join(", ")}">📋 Copier les mots-clés</button>
        </div>
        <div class="ebk-kw-section">
          <div class="ebk-kw-label">Longue traîne</div>
          <div class="ebk-kw-list">
            ${keywords.longTail.map(k => `<span class="ebk-kw ebk-kw-long">${k}</span>`).join("") || "<i>Aucune détectée</i>"}
          </div>
          <button class="ebk-copy-btn" data-copy="${keywords.longTail.join(", ")}">📋 Copier la longue traîne</button>
        </div>
      </div>
      <a class="ebk-cta" href="https://www.ebookstudio.fr/offres" target="_blank" rel="noopener">
        Analyse complète sur EbookStudio →
      </a>
    `;
  }

  function renderSearchBadge(analysis, items) {
    if (!analysis) {
      return `
        <div class="ebk-head"><span class="ebk-logo">📚 EbookStudio</span><button class="ebk-close">×</button></div>
        <div class="ebk-search-msg">🔍 Analyse impossible (aucun résultat détecté).</div>
      `;
    }
    const verdict = verdictFromScore(analysis.nicheScore);
    return `
      <div class="ebk-head">
        <span class="ebk-logo">📚 EbookStudio — Niche</span>
        <button class="ebk-close" aria-label="Fermer">×</button>
      </div>
      <div class="ebk-score-row">
        <div class="ebk-score" style="--c:${verdict.color}">
          <div class="ebk-score-num">${analysis.nicheScore}</div>
          <div class="ebk-score-lbl">/100</div>
        </div>
        <div class="ebk-verdict" style="background:${verdict.color}">
          ${verdict.emoji} ${verdict.label}
        </div>
      </div>
      <div class="ebk-stats">
        <div class="ebk-stat"><span>Top analysé</span><b>${analysis.total}</b></div>
        <div class="ebk-stat"><span>Pépites 💎</span><b style="color:#10b981">${analysis.nuggets}</b></div>
        <div class="ebk-stat"><span>Avis moyen</span><b>${analysis.avgReviews !== null ? analysis.avgReviews.toLocaleString("fr-FR") : "—"}</b></div>
        <div class="ebk-stat"><span>Prix moyen</span><b>${analysis.avgPrice !== null ? analysis.avgPrice.toFixed(2) + " €" : "—"}</b></div>
      </div>
      <div class="ebk-search-msg" style="font-size:11px">
        💎 Les livres entourés en vert dans les résultats sont des opportunités (peu d'avis + prix sain).
      </div>
      <a class="ebk-cta" href="https://www.ebookstudio.fr/offres" target="_blank" rel="noopener">
        Analyse complète sur EbookStudio →
      </a>
    `;
  }

  function attachInteractions() {
    const box = document.getElementById("ebkstudio-badge");
    if (!box) return;
    box.querySelectorAll(".ebk-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        box.querySelectorAll(".ebk-tab").forEach(t => t.classList.remove("ebk-active"));
        tab.classList.add("ebk-active");
        const target = tab.dataset.tab;
        box.querySelector(".ebk-pane-score").style.display = target === "score" ? "" : "none";
        box.querySelector(".ebk-pane-kw").style.display = target === "kw" ? "" : "none";
      });
    });
    box.querySelectorAll(".ebk-copy-btn").forEach(btn => {
      btn.addEventListener("click", () => copyText(btn.dataset.copy, btn));
    });
  }

  // ============ MAIN ============
  function run() {
    if (isProductPage()) {
      const metrics = parseProductPage();
      const keywords = extractKeywords(metrics.title, metrics.description);
      injectBadge(renderProductBadge(metrics, keywords));
      attachInteractions();
      if (metrics.asin) {
        saveToHistory({
          asin: metrics.asin,
          title: metrics.title,
          bsr: metrics.bsr,
          price: metrics.price,
          reviews: metrics.reviews,
          score: scoreFromMetrics(metrics),
          marketplace: detectMarketplace(),
          url: location.href,
        });
      }
      return;
    }
    if (isSearchPage()) {
      const items = scanSearchResults();
      highlightNuggets(items);
      const analysis = analyzeSearchNiche(items);
      injectBadge(renderSearchBadge(analysis, items));
      return;
    }
  }

  setTimeout(run, 1500);
  setTimeout(run, 3500);

  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      const old = document.getElementById("ebkstudio-badge");
      if (old) old.remove();
      setTimeout(run, 1800);
    }
  }).observe(document, { subtree: true, childList: true });
})();

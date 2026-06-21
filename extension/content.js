// EbookStudio Scanner — Analyse Amazon Kindle (données fiables via backend PA-API)
(function () {
  const STORAGE_KEY = "ebkstudio_history";
  const MAX_HISTORY = 30;

  // ============ DÉTECTION ============
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

  // ============ PARSING DOM (fallback / affichage immédiat) ============
  function parseNumber(str) {
    if (!str) return null;
    const cleaned = String(str).replace(/[\s\u00A0.,]/g, "");
    const n = parseInt(cleaned, 10);
    return isNaN(n) ? null : n;
  }

  function parsePrice(str) {
    if (!str) return null;
    const m = String(str).match(/(\d+)[.,](\d{2})(?!\d)/);
    if (!m) return null;
    return parseFloat(`${m[1]}.${m[2]}`);
  }

  function extractBsrFromProduct() {
    const detailRows = document.querySelectorAll("#detailBulletsWrapper_feature_div li, #productDetails_detailBullets_sections1 tr, #prodDetails tr");
    for (const row of detailRows) {
      const txt = row.innerText || "";
      if (/(Best\s*Sellers?\s*Rank|Classement|Amazon\s*Bestsellers?\s*Rank|Meilleurs?\s*ventes)/i.test(txt)) {
        const m = txt.match(/[#nN][°o]?\s*([\d\s.,\u00A0]{2,})\s+(?:in|en|dans|Paid)/);
        if (m) {
          const n = parseNumber(m[1]);
          if (n && n > 0) return n;
        }
      }
    }
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

  function extractAuthor() {
    const el = document.querySelector(".author .a-link-normal, #bylineInfo .author a, [data-feature-name='bylineInfo'] a");
    return el ? el.innerText.trim() : null;
  }

  function extractRating() {
    const el = document.querySelector("[data-hook='rating-out-of-text'], #acrPopover .a-icon-alt, .a-icon-star .a-icon-alt");
    if (el) {
      const txt = el.textContent || el.getAttribute("title") || "";
      const m = txt.match(/([\d.,]+)\s*(?:sur|out of|von|de)\s*5/i) || txt.match(/^([\d.,]+)/);
      if (m) return parseFloat(m[1].replace(",", "."));
    }
    return null;
  }

  function extractCover() {
    const el = document.querySelector("#imgBlkFront, #ebooksImgBlkFront, #landingImage, #main-image");
    return el ? (el.getAttribute("src") || el.getAttribute("data-old-hires") || null) : null;
  }

  function extractFormatPages() {
    const txt = document.body.innerText || "";
    const pagesMatch = txt.match(/(\d{1,4})\s*pages/i);
    const formatEl = document.querySelector("#productSubtitle, #tmmSwatches .selected, [data-feature-name='kformat']");
    return {
      pages: pagesMatch ? parseInt(pagesMatch[1], 10) : null,
      format: formatEl ? formatEl.innerText.trim().split("\n")[0].slice(0, 30) : "Format Kindle",
    };
  }

  function extractPublicationDate() {
    const detailRows = document.querySelectorAll("#detailBulletsWrapper_feature_div li, #productDetails_detailBullets_sections1 tr");
    for (const row of detailRows) {
      const txt = row.innerText || "";
      const m = txt.match(/(?:Date de publication|Publication date|Publishing date)\s*[:\s]\s*([^\n]+)/i);
      if (m) return m[1].trim().slice(0, 30);
    }
    return null;
  }

  function extractDescription() {
    const sel = document.querySelector("#bookDescription_feature_div .a-expander-content, #productDescription, [data-feature-name='bookDescription']");
    return sel ? sel.innerText.trim().slice(0, 1500) : "";
  }

  function parseProductPage() {
    const fp = extractFormatPages();
    return {
      asin: detectAsin(),
      title: extractTitle(),
      author: extractAuthor(),
      rating: extractRating(),
      pages: fp.pages,
      format: fp.format,
      publishedAt: extractPublicationDate(),
      bsr: extractBsrFromProduct(),
      price: extractPriceFromProduct(),
      reviews: extractReviewsFromProduct(),
      description: extractDescription(),
      cover: extractCover(),
      marketplace: detectMarketplace(),
      source: "dom",
    };
  }

  // ============ MOTS-CLÉS ============
  const STOP_WORDS = new Set("le la les un une des de du et ou à a au aux en pour par sur dans avec sans qui que quoi comme si plus moins très tout tous toute toutes ce cette ces son sa ses leur leurs notre votre nos vos mon ma mes ton ta tes the of and or to in for on with by from is are was were be been being it its as at this that these those an your you we our they them him her his she he i".split(/\s+/));

  function extractKeywords(title, description) {
    const text = `${title || ""} ${description || ""}`.toLowerCase();
    const words = text.match(/[a-zàâäéèêëïîôöùûüç]{4,}/gi) || [];
    const freq = {};
    words.forEach(w => {
      const lw = w.toLowerCase();
      if (!STOP_WORDS.has(lw)) freq[lw] = (freq[lw] || 0) + 1;
    });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8).map(e => e[0]);

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

  // ============ SCORING & ESTIMATIONS ============
  function estimateFromBsr(bsr) {
    if (!bsr || bsr <= 0) return { daily: 0, monthly: 0 };
    let daily;
    if (bsr <= 100) daily = 50;
    else if (bsr <= 1000) daily = 12;
    else if (bsr <= 5000) daily = 5;
    else if (bsr <= 20000) daily = 2;
    else if (bsr <= 100000) daily = 1;
    else if (bsr <= 500000) daily = 0.3;
    else daily = 0.1;
    return { daily: Math.round(daily * 10) / 10, monthly: Math.round(daily * 30) };
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

  // ============ RECOMMANDATIONS ============
  function buildRecommendations(m) {
    const recs = [];
    if (m.reviews !== null && m.reviews !== undefined) {
      if (m.reviews < 50) recs.push({ icon: "✅", t: "Peu d'avis : niche encore accessible, fenêtre d'opportunité." });
      else if (m.reviews >= 500) recs.push({ icon: "⚠️", t: "Beaucoup d'avis : concurrence installée, différencie-toi fort." });
    }
    if (m.price !== null && m.price !== undefined) {
      if (m.price < 2.99) recs.push({ icon: "💸", t: "Prix bas : marge faible, vise 4–9,99 € pour 70 % de royalties." });
      else if (m.price > 15) recs.push({ icon: "💰", t: "Prix élevé : possible de se positionner moins cher." });
      else recs.push({ icon: "👍", t: "Prix dans la zone saine (4–15 €)." });
    }
    if (m.bsr) {
      if (m.bsr <= 20000) recs.push({ icon: "🔥", t: "BSR très bon : demande réelle et soutenue." });
      else if (m.bsr > 200000) recs.push({ icon: "🐢", t: "BSR faible : peu de ventes, vérifie la demande globale." });
    }
    if (m.rating !== null && m.rating !== undefined && m.rating < 4 && m.reviews && m.reviews > 20) {
      recs.push({ icon: "🎯", t: "Note moyenne : un livre mieux noté peut prendre la place." });
    }
    if (!recs.length) recs.push({ icon: "ℹ️", t: "Données partielles — ouvre la fiche complète pour plus de précision." });
    return recs.slice(0, 4);
  }

  // ============ HISTORIQUE ============
  function saveToHistory(entry) {
    if (!chrome?.storage?.local) return;
    chrome.storage.local.get([STORAGE_KEY], (res) => {
      const list = res[STORAGE_KEY] || [];
      const filtered = list.filter(x => x.asin !== entry.asin);
      filtered.unshift({ ...entry, scannedAt: Date.now() });
      chrome.storage.local.set({ [STORAGE_KEY]: filtered.slice(0, MAX_HISTORY) });
    });
  }

  // ============ PAGE DE RECHERCHE ============
  function scanSearchResults() {
    const results = document.querySelectorAll("[data-component-type='s-search-result']");
    const items = [];
    results.forEach((card, idx) => {
      if (idx >= 12) return;
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
        price, reviews, rating, card,
      });
    });
    return items;
  }

  function highlightNuggets(items) {
    items.forEach(item => {
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
    return box;
  }

  function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      const orig = btn.textContent;
      btn.textContent = "✓ Copié !";
      setTimeout(() => { btn.textContent = orig; }, 1500);
    });
  }

  function headHtml() {
    return `
      <div class="ebk-head">
        <span class="ebk-logo"><span class="ebk-logo-dot">📚</span> EbookStudio <em>Scanner</em></span>
        <button class="ebk-close" aria-label="Fermer">×</button>
      </div>`;
  }

  function skeletonBadge(title) {
    return `
      ${headHtml()}
      <div class="ebk-book-info">
        <div class="ebk-book-title">${title || "Analyse en cours…"}</div>
      </div>
      <div class="ebk-loading">
        <div class="ebk-spinner"></div>
        <div class="ebk-loading-txt">Récupération des données fiables (Amazon officiel)…</div>
        <div class="ebk-skel"></div>
        <div class="ebk-skel" style="width:70%"></div>
        <div class="ebk-skel" style="width:85%"></div>
      </div>`;
  }

  function renderProductBadge(metrics, keywords) {
    const score = scoreFromMetrics(metrics);
    const verdict = verdictFromScore(score);
    const est = estimateFromBsr(metrics.bsr);
    const monthly = metrics.estimatedMonthlySales ?? est.monthly;
    const daily = metrics.estimatedDailySales ?? est.daily;
    const revenue = metrics.estimatedMonthlyRevenue ?? Math.round(monthly * (metrics.price || 4.99) * 0.7);
    const comp = competitionFromReviews(metrics.reviews);
    const recs = buildRecommendations(metrics);

    const mp = (metrics.marketplace || "fr").toUpperCase();
    const stars = metrics.rating ? "★".repeat(Math.round(metrics.rating)) + "☆".repeat(5 - Math.round(metrics.rating)) : "—";
    const titleSafe = (metrics.title || "(titre introuvable)").replace(/"/g, "&quot;");
    const reliable = metrics.source && metrics.source.includes("paapi");
    const fiab = reliable ? "Source officielle Amazon" : "Estimation (lecture page)";

    return `
      ${headHtml()}
      <div class="ebk-book-info">
        <div class="ebk-book-row">
          ${metrics.cover ? `<img class="ebk-cover" src="${metrics.cover}" alt="" />` : ""}
          <div class="ebk-book-text">
            <div class="ebk-book-title" title="${titleSafe}">${metrics.title || "(titre introuvable)"}</div>
            <div class="ebk-book-author">${metrics.author ? "par " + metrics.author : ""}</div>
          </div>
        </div>
        <div class="ebk-book-meta">
          <span class="ebk-asin" title="Cliquer pour copier">ASIN <b>${metrics.asin || "—"}</b></span>
          <span class="ebk-mp">🌍 .${mp.toLowerCase()}</span>
          ${metrics.pages ? `<span>📖 ${metrics.pages} p.</span>` : ""}
          ${metrics.rating ? `<span class="ebk-stars">${stars} ${metrics.rating.toFixed(1)}</span>` : ""}
        </div>
      </div>
      <div class="ebk-tabs">
        <button class="ebk-tab ebk-active" data-tab="score">Score</button>
        <button class="ebk-tab" data-tab="niche">Niche</button>
        <button class="ebk-tab" data-tab="kw">Mots-clés</button>
      </div>
      <div class="ebk-pane ebk-pane-score">
        <div class="ebk-score-row">
          <div class="ebk-score" style="--c:${verdict.color};--c-pct:${score}">
            <div class="ebk-score-num">${score}</div>
            <div class="ebk-score-lbl">/100</div>
          </div>
          <div class="ebk-verdict" style="background:${verdict.color}">
            ${verdict.emoji} ${verdict.label}
          </div>
        </div>
        <div class="ebk-stats">
          <div class="ebk-stat"><span>Ventes/jour</span><b>~${daily}</b></div>
          <div class="ebk-stat"><span>Ventes/mois</span><b>~${monthly}</b></div>
          <div class="ebk-stat"><span>BSR</span><b>${metrics.bsr ? "#" + metrics.bsr.toLocaleString("fr-FR") : "—"}</b></div>
          <div class="ebk-stat"><span>Prix</span><b>${metrics.price ? metrics.price.toFixed(2) + " €" : "—"}</b></div>
          <div class="ebk-stat"><span>Avis</span><b>${metrics.reviews !== null && metrics.reviews !== undefined ? metrics.reviews.toLocaleString("fr-FR") : "—"}</b></div>
          <div class="ebk-stat"><span>Concurrence</span><b style="color:${comp.color}">${comp.label}</b></div>
        </div>
        <div class="ebk-revenue">
          💰 Revenus estimés / mois : <b>~${revenue} €</b>
          <div class="ebk-fiab ${reliable ? "ok" : ""}">${reliable ? "🟢" : "🟡"} ${fiab}</div>
        </div>
      </div>
      <div class="ebk-pane ebk-pane-niche" style="display:none">
        <div class="ebk-kw-label">Recommandations</div>
        <div class="ebk-recs">
          ${recs.map(r => `<div class="ebk-rec"><span class="ebk-rec-i">${r.icon}</span><span>${r.t}</span></div>`).join("")}
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

  function renderSearchBadge(analysis) {
    if (!analysis) {
      return `${headHtml()}<div class="ebk-search-msg">🔍 Analyse impossible (aucun résultat détecté).</div>`;
    }
    const verdict = verdictFromScore(analysis.nicheScore);
    return `
      ${headHtml()}
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
      <div class="ebk-search-msg">
        💎 Les livres entourés en vert sont des opportunités (peu d'avis + prix sain).
      </div>
      <a class="ebk-cta" href="https://www.ebookstudio.fr/offres" target="_blank" rel="noopener">
        Analyse complète sur EbookStudio →
      </a>
    `;
  }

  function attachInteractions(box) {
    if (!box) return;
    box.querySelectorAll(".ebk-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        box.querySelectorAll(".ebk-tab").forEach(t => t.classList.remove("ebk-active"));
        tab.classList.add("ebk-active");
        const target = tab.dataset.tab;
        box.querySelector(".ebk-pane-score").style.display = target === "score" ? "" : "none";
        const niche = box.querySelector(".ebk-pane-niche");
        if (niche) niche.style.display = target === "niche" ? "" : "none";
        box.querySelector(".ebk-pane-kw").style.display = target === "kw" ? "" : "none";
      });
    });
    box.querySelectorAll(".ebk-copy-btn").forEach(btn => {
      btn.addEventListener("click", () => copyText(btn.dataset.copy, btn));
    });
    const asinEl = box.querySelector(".ebk-asin");
    if (asinEl) {
      asinEl.style.cursor = "pointer";
      asinEl.addEventListener("click", () => {
        const asin = asinEl.querySelector("b")?.textContent;
        if (asin && asin !== "—") {
          navigator.clipboard.writeText(asin).then(() => {
            const orig = asinEl.innerHTML;
            asinEl.innerHTML = "✓ ASIN copié !";
            setTimeout(() => { asinEl.innerHTML = orig; }, 1200);
          });
        }
      });
    }
  }

  // Fusionne données backend fiables par-dessus le DOM
  function mergeBackend(dom, data) {
    const m = { ...dom };
    const pick = (k) => { if (data[k] !== null && data[k] !== undefined) m[k] = data[k]; };
    ["title", "author", "price", "rating", "reviews", "bsr", "pages",
     "estimatedDailySales", "estimatedMonthlySales", "estimatedMonthlyRevenue"].forEach(pick);
    if (!m.description && data.description) m.description = data.description;
    if (data.source) m.source = data.source;
    return m;
  }

  // ============ MAIN ============
  function renderProduct(metrics) {
    const keywords = extractKeywords(metrics.title, metrics.description);
    const box = injectBadge(renderProductBadge(metrics, keywords));
    attachInteractions(box);
    if (metrics.asin) {
      saveToHistory({
        asin: metrics.asin,
        title: metrics.title,
        bsr: metrics.bsr,
        price: metrics.price,
        reviews: metrics.reviews,
        score: scoreFromMetrics(metrics),
        marketplace: metrics.marketplace,
        url: location.href,
      });
    }
  }

  function run() {
    if (isProductPage()) {
      const dom = parseProductPage();
      // Affichage immédiat : skeleton
      injectBadge(skeletonBadge(dom.title));

      const asin = dom.asin;
      if (asin && chrome?.runtime?.sendMessage) {
        let answered = false;
        const timer = setTimeout(() => {
          if (!answered) renderProduct(dom); // fallback DOM si backend lent
        }, 9000);

        try {
          chrome.runtime.sendMessage(
            { type: "SCAN_ASIN", asin, marketplace: dom.marketplace },
            (resp) => {
              answered = true;
              clearTimeout(timer);
              if (resp && resp.ok && resp.data) renderProduct(mergeBackend(dom, resp.data));
              else renderProduct(dom);
            }
          );
        } catch {
          clearTimeout(timer);
          renderProduct(dom);
        }
      } else {
        renderProduct(dom);
      }
      return;
    }
    if (isSearchPage()) {
      const items = scanSearchResults();
      highlightNuggets(items);
      const analysis = analyzeSearchNiche(items);
      injectBadge(renderSearchBadge(analysis));
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

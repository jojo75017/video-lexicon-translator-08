// Service worker MV3 — relais d'analyse vers EbookStudio (données fiables PA-API)
const API_BASE = "https://xvdgazrewsuaqtalqxue.supabase.co/functions/v1";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZGdhenJld3N1YXF0YWxxeHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTgwMDYsImV4cCI6MjA3NzgzNDAwNn0.8LDj5M77n8yDqF4NU6O1wfzJVZojyDnT02VOBpVTQKA";

const CACHE_TTL = 1000 * 60 * 30; // 30 min

function cacheKey(asin, marketplace) {
  return `ebk_cache_${marketplace}_${asin}`;
}

async function getCached(asin, marketplace) {
  return new Promise((resolve) => {
    const key = cacheKey(asin, marketplace);
    chrome.storage.local.get([key], (res) => {
      const entry = res[key];
      if (entry && Date.now() - entry.t < CACHE_TTL) resolve(entry.data);
      else resolve(null);
    });
  });
}

function setCached(asin, marketplace, data) {
  const key = cacheKey(asin, marketplace);
  chrome.storage.local.set({ [key]: { t: Date.now(), data } });
}

async function scanAsin(asin, marketplace) {
  const cached = await getCached(asin, marketplace);
  if (cached) return { ok: true, data: cached, cached: true };

  const res = await fetch(`${API_BASE}/kdp-asin-scraper`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": ANON_KEY,
      "Authorization": `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ asin, marketplace: marketplace || "fr", mode: "asin" }),
  });
  const json = await res.json();
  if (json && json.success && json.data) {
    setCached(asin, marketplace, json.data);
    return { ok: true, data: json.data };
  }
  return { ok: false, error: (json && json.error) || "Réponse invalide" };
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "SCAN_ASIN") {
    scanAsin(msg.asin, msg.marketplace)
      .then(sendResponse)
      .catch((err) => sendResponse({ ok: false, error: err.message }));
    return true; // async
  }
});

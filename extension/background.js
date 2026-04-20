// Service worker MV3 — relais d'analyse vers EbookStudio
const API_BASE = "https://xvdgazrewsuaqtalqxue.supabase.co/functions/v1";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZGdhenJld3N1YXF0YWxxeHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTgwMDYsImV4cCI6MjA3NzgzNDAwNn0.8LDj5M77n8yDqF4NU6O1wfzJVZojyDnT02VOBpVTQKA";

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "SCAN_ASIN") {
    fetch(`${API_BASE}/kdp-asin-scraper`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": ANON_KEY,
        "Authorization": `Bearer ${ANON_KEY}`
      },
      body: JSON.stringify({ asin: msg.asin, marketplace: msg.marketplace || "fr", mode: "scrape" })
    })
      .then(r => r.json())
      .then(data => sendResponse({ ok: true, data }))
      .catch(err => sendResponse({ ok: false, error: err.message }));
    return true; // async
  }
});

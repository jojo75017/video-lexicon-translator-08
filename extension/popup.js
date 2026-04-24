const STORAGE_KEY = "ebkstudio_history";

document.querySelectorAll(".tab").forEach(t => {
  t.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    const target = t.dataset.tab;
    document.getElementById("pane-guide").style.display = target === "guide" ? "" : "none";
    document.getElementById("pane-history").style.display = target === "history" ? "" : "none";
    if (target === "history") loadHistory();
  });
});

function scoreClass(s) {
  if (s >= 70) return "go";
  if (s >= 45) return "warn";
  return "bad";
}

function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function loadHistory() {
  chrome.storage.local.get([STORAGE_KEY], (res) => {
    const list = res[STORAGE_KEY] || [];
    const countEl = document.getElementById("hist-count");
    countEl.textContent = list.length ? `(${list.length})` : "";
    const container = document.getElementById("hist-list");
    if (!list.length) {
      container.innerHTML = `<div class="empty"><div class="empty-icon">📭</div>Aucun scan pour l'instant.<br/>Visite une fiche Amazon Kindle.</div>`;
      return;
    }
    container.innerHTML = list.map(item => `
      <div class="hist-item" data-url="${item.url}">
        <div class="hist-title">${item.title || "(sans titre)"}</div>
        <div class="hist-meta">
          <span class="hist-score ${scoreClass(item.score)}">${item.score}/100</span>
          <span>BSR ${item.bsr ? "#" + item.bsr.toLocaleString("fr-FR") : "—"}</span>
          <span>${item.price ? item.price.toFixed(2) + "€" : "—"}</span>
          <span style="margin-left:auto;font-size:10px">${fmtDate(item.scannedAt)}</span>
        </div>
      </div>
    `).join("");
    container.querySelectorAll(".hist-item").forEach(el => {
      el.addEventListener("click", () => chrome.tabs.create({ url: el.dataset.url }));
    });
  });
}

document.getElementById("export-csv").addEventListener("click", () => {
  chrome.storage.local.get([STORAGE_KEY], (res) => {
    const list = res[STORAGE_KEY] || [];
    if (!list.length) { alert("Aucune donnée à exporter."); return; }
    const headers = ["Date", "ASIN", "Titre", "Score", "BSR", "Prix", "Avis", "Marketplace", "URL"];
    const rows = list.map(i => [
      new Date(i.scannedAt).toISOString(),
      i.asin || "",
      `"${(i.title || "").replace(/"/g, '""')}"`,
      i.score,
      i.bsr || "",
      i.price || "",
      i.reviews ?? "",
      i.marketplace || "",
      i.url || "",
    ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ebookstudio-scans-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
});

document.getElementById("clear-hist").addEventListener("click", () => {
  if (!confirm("Effacer tout l'historique des scans ?")) return;
  chrome.storage.local.remove([STORAGE_KEY], loadHistory);
});

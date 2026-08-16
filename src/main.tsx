import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import { installGlobalErrorHandlers } from "./lib/errorLogger";
import { installChunkErrorRecovery } from "./lib/chunkErrorRecovery";
import { purgeLegacyOffresCache } from "./lib/offresCachePurge";
import { runSiteWidePurge } from "./lib/sitePurge";
import { AdminAccessProvider } from "./contexts/AdminAccessContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Agent de contrôle : récupère automatiquement les pages cassées par un
// chunk JS obsolète (post-déploiement) sur /offres, /demo, etc.
installChunkErrorRecovery();
installGlobalErrorHandlers();

// 1) Purge globale une seule fois par navigateur (ménage août 2026 :
//    suppression de ~45 pages, redirections SEO, SW/caches obsolètes).
void runSiteWidePurge();

// 2) Purge spécifique /offres (versionnage UI)
void purgeLegacyOffresCache();

// 3) Nettoyage best-effort des anciens service workers sans en réinstaller un
//    à chaque chargement.
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .getRegistrations()
      .then((regs) => regs.forEach((r) => r.unregister()))
      .catch(() => {});
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AdminAccessProvider>
          <App />
        </AdminAccessProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);

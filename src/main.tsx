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

// Agent de contrôle : récupère automatiquement les pages cassées par un
// chunk JS obsolète (post-déploiement) sur /offres, /demo, etc.
installChunkErrorRecovery();
installGlobalErrorHandlers();

// 1) Purge spécifique /offres (versionnage UI)
void purgeLegacyOffresCache();

// 2) Kill-switch global : déploie /sw.js qui désinscrit tout SW existant
//    et vide tous les caches. Sans cette étape, les visiteurs ayant
//    installé l'ancien SW PWA continuent de voir d'anciens bandeaux.
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch(() => {
        // Si l'enregistrement échoue, on tente au moins de désinscrire l'existant
        navigator.serviceWorker
          .getRegistrations()
          .then((regs) => regs.forEach((r) => r.unregister()))
          .catch(() => {});
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

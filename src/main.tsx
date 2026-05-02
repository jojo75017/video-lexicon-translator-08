import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { installGlobalErrorHandlers } from "./lib/errorLogger";
import { purgeLegacyOffresCache } from "./lib/offresCachePurge";

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

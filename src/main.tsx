import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { installGlobalErrorHandlers } from "./lib/errorLogger";

installGlobalErrorHandlers();

const OFFRES_UI_VERSION = "offres-banners-v3-single-bar";

const purgeLegacyOffresCache = () => {
  if (typeof window === "undefined") return;
  if (window.location.pathname !== "/offres") return;

  const versionKey = "ebookstudio_offres_ui_version";
  const currentVersion = localStorage.getItem(versionKey);

  if (currentVersion === OFFRES_UI_VERSION) return;

  localStorage.setItem(versionKey, OFFRES_UI_VERSION);

  void Promise.all([
    "serviceWorker" in navigator
      ? navigator.serviceWorker.getRegistrations().then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister()))
        )
      : Promise.resolve(),
    "caches" in window
      ? caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      : Promise.resolve(),
  ]).finally(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("ui") !== OFFRES_UI_VERSION) {
      url.searchParams.set("ui", OFFRES_UI_VERSION);
      window.location.replace(url.toString());
    }
  });
};

purgeLegacyOffresCache();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

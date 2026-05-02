export const OFFRES_UI_VERSION = "offres-banners-v3-single-bar";
export const OFFRES_VERSION_KEY = "ebookstudio_offres_ui_version";
export const OFFRES_PATH = "/offres";

/**
 * Anti-cache strategy for /offres:
 * - Reads stored UI version from localStorage.
 * - If outdated/missing, unregisters service workers, clears all caches,
 *   then forces a reload with a versioned `?ui=` query param so the user
 *   always sees the latest banner variant (no stacked banners from cache).
 */
export const purgeLegacyOffresCache = (): Promise<boolean> => {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.location.pathname !== OFFRES_PATH) return Promise.resolve(false);

  const currentVersion = localStorage.getItem(OFFRES_VERSION_KEY);
  if (currentVersion === OFFRES_UI_VERSION) return Promise.resolve(false);

  localStorage.setItem(OFFRES_VERSION_KEY, OFFRES_UI_VERSION);

  const swCleanup =
    "serviceWorker" in navigator
      ? navigator.serviceWorker
          .getRegistrations()
          .then((registrations) =>
            Promise.all(registrations.map((registration) => registration.unregister())),
          )
      : Promise.resolve();

  const cacheCleanup =
    "caches" in window
      ? caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      : Promise.resolve();

  return Promise.all([swCleanup, cacheCleanup])
    .then(() => {
      const url = new URL(window.location.href);
      if (url.searchParams.get("ui") !== OFFRES_UI_VERSION) {
        url.searchParams.set("ui", OFFRES_UI_VERSION);
        window.location.replace(url.toString());
        return true;
      }
      return false;
    })
    .catch(() => false);
};

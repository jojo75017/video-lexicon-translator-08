/**
 * One-shot site-wide cache purge.
 *
 * Unregisters any lingering service worker, wipes the Cache Storage API,
 * and forces one clean reload so users don't stay on stale HTML/chunks
 * pointing to routes that no longer exist (post-cleanup August 2026).
 *
 * Runs once per browser thanks to a version flag in localStorage.
 * Bump PURGE_VERSION any time you need to force another global purge.
 */
export const PURGE_VERSION = "v4-bd-tunnel-2026-09-02";
const PURGE_KEY = "ebookstudio_site_purge_version";

export const runSiteWidePurge = async (): Promise<void> => {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(PURGE_KEY) === PURGE_VERSION) return;

    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister().catch(() => false)));
    }

    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k).catch(() => false)));
    }

    localStorage.setItem(PURGE_KEY, PURGE_VERSION);

    const url = new URL(window.location.href);
    if (url.searchParams.get("v") !== PURGE_VERSION) {
      url.searchParams.set("v", PURGE_VERSION);
      window.location.replace(url.toString());
    }
  } catch {
    // best-effort — never block boot
  }
};

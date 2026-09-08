/**
 * Agent de contrôle des erreurs de chargement de modules ("chunks").
 *
 * Problème ciblé :
 *   Après chaque mise en ligne, les visiteurs qui ont encore l'ancienne version
 *   en cache tentent de charger un fichier JS dont le hash a changé
 *   (ex: SalesPage-XXXX.js) → "Failed to fetch dynamically imported module".
 *   Résultat : page blanche / erreur sur /offres, /demo, etc.
 *
 * Solution :
 *   On détecte ces erreurs et on recharge la page UNE seule fois (avec un
 *   garde-fou anti-boucle) pour récupérer la dernière version. On vide aussi
 *   les caches navigateur avant le rechargement.
 *
 * Les erreurs "bruit" (extensions wallet type MetaMask, "Script error."
 * cross-origin, ResizeObserver) sont identifiées pour ne pas être traitées
 * comme de vraies pannes.
 */

const RELOAD_FLAG = "chunk_reload_attempt";
const RELOAD_COUNT = "chunk_reload_count";
const RELOAD_WINDOW_MS = 30_000; // fenêtre anti-boucle
const MAX_ATTEMPTS = 2; // 2 tentatives max dans la fenêtre

const CHUNK_ERROR_PATTERNS = [
  "Failed to fetch dynamically imported module",
  "error loading dynamically imported module",
  "Importing a module script failed",
  "Unable to preload CSS",
  "Loading chunk",
  "Loading CSS chunk",
];

/** Bruit connu, sans impact réel pour l'utilisateur. */
const NOISE_PATTERNS = [
  "Failed to connect to MetaMask",
  "MetaMask",
  "Script error.",
  "ResizeObserver loop",
  "ethereum",
];

function matches(message: string, patterns: string[]): boolean {
  const m = (message || "").toString();
  return patterns.some((p) => m.includes(p));
}

export function isChunkError(message: string): boolean {
  return matches(message, CHUNK_ERROR_PATTERNS);
}

export function isNoiseError(message: string): boolean {
  return matches(message, NOISE_PATTERNS);
}

async function clearCaches(): Promise<void> {
  try {
    if (typeof caches !== "undefined") {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch {
    /* best-effort */
  }
}

function recover(reason: string): void {
  let attempt = 0;
  try {
    const now = Date.now();
    const last = Number(sessionStorage.getItem(RELOAD_FLAG) || "0");
    attempt = Number(sessionStorage.getItem(RELOAD_COUNT) || "0");

    if (last && now - last < RELOAD_WINDOW_MS && attempt >= MAX_ATTEMPTS) {
      console.warn("[chunk-recovery] plusieurs tentatives échouées, on n'insiste pas.", reason);
      return;
    }
    if (!last || now - last >= RELOAD_WINDOW_MS) attempt = 0;
    sessionStorage.setItem(RELOAD_FLAG, String(now));
    sessionStorage.setItem(RELOAD_COUNT, String(attempt + 1));
  } catch {
    /* sessionStorage indisponible : on recharge quand même une fois */
  }

  console.warn("[chunk-recovery] erreur de module détectée, rechargement…", reason);
  void clearCaches().finally(() => {
    // reload() peut resservir le HTML en cache (donc les mêmes anciens hash de
    // chunks) : on force une vraie requête réseau via un paramètre d'URL.
    const url = new URL(window.location.href);
    url.searchParams.set("v", String(Date.now()));
    window.location.replace(url.toString());
  });
}

/**
 * Installe l'agent de contrôle. À appeler une seule fois au démarrage.
 */
export function installChunkErrorRecovery(): void {
  if (typeof window === "undefined") return;
  if ((window as unknown as { __chunkRecoveryInstalled?: boolean }).__chunkRecoveryInstalled) {
    return;
  }
  (window as unknown as { __chunkRecoveryInstalled?: boolean }).__chunkRecoveryInstalled = true;

  // Erreurs synchrones (ex: échec d'import dynamique remonté en window.error)
  window.addEventListener("error", (event) => {
    const msg = event?.message || (event?.error && event.error.message) || "";
    if (isChunkError(msg)) recover(msg);
  });

  // Promesses rejetées (cas le plus fréquent pour les imports dynamiques)
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event?.reason;
    const msg = (reason && (reason.message || String(reason))) || "";
    if (isChunkError(msg)) recover(msg);
  });

  // Une navigation réussie nettoie le drapeau pour autoriser une future récup.
  window.addEventListener("load", () => {
    try {
      const last = Number(sessionStorage.getItem(RELOAD_FLAG) || "0");
      if (last && Date.now() - last >= RELOAD_WINDOW_MS) {
        sessionStorage.removeItem(RELOAD_FLAG);
      }
    } catch {
      /* ignore */
    }
  });
}

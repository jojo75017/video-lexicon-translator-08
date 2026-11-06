// Only allow redirects to the app's own domains (blocks open redirects).
const ALLOWED = [/^(www\.)?ebookstudio\.fr$/, /^notify\.ebookstudio\.fr$/, /\.lovable\.app$/, /\.lovableproject\.com$/, /^localhost(:\d+)?$/];

export function isSafeRedirect(url: unknown): url is string {
  if (typeof url !== "string") return false;
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && !(u.protocol === "http:" && u.hostname === "localhost")) return false;
    return ALLOWED.some((r) => r.test(u.host));
  } catch { return false; }
}

export function safeRedirectOr(url: unknown, fallback: string): string {
  return isSafeRedirect(url) ? url : fallback;
}

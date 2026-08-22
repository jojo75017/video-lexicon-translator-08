// Shared Resend sender with:
// - Global throttle: max 8 requests/second (Resend hard limit is 10 req/s)
// - Automatic retry on HTTP 429 rate_limit_exceeded (respects Retry-After)
// - Abort-on-daily-quota: stops the whole batch when Resend returns
//   `daily_quota_exceeded` so we don't burn through calls that will all fail.
//
// Usage:
//   import { sendResendEmailThrottled, isQuotaExhausted } from "../_shared/resendThrottle.ts";
//   const res = await sendResendEmailThrottled({ from, to, subject, html });
//   if (isQuotaExhausted()) break; // stop looping when daily quota is hit

import { EMAIL_SENDING_ENABLED } from "./emailSendingGuard.ts";

const RESEND_API_URL = "https://api.resend.com/emails";

// 8 req/s => min 125ms between requests
const MIN_INTERVAL_MS = 125;
const MAX_RETRIES_ON_RATE_LIMIT = 4;

let lastCallAt = 0;
let inFlightChain: Promise<void> = Promise.resolve();
let dailyQuotaHit = false;

export function isQuotaExhausted(): boolean {
  return dailyQuotaHit;
}

export function resetQuotaFlag(): void {
  dailyQuotaHit = false;
}

async function waitForSlot(): Promise<void> {
  // Serialize slot acquisition across concurrent callers within this isolate.
  const previous = inFlightChain;
  let release!: () => void;
  inFlightChain = new Promise<void>((r) => (release = r));
  try {
    await previous;
    const now = Date.now();
    const wait = Math.max(0, lastCallAt + MIN_INTERVAL_MS - now);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastCallAt = Date.now();
  } finally {
    release();
  }
}

export interface ResendPayload {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  reply_to?: string | string[];
  headers?: Record<string, string>;
  tags?: Array<{ name: string; value: string }>;
}

export interface ResendResult {
  ok: boolean;
  id?: string;
  status?: number;
  detail?: string;
  quotaExhausted?: boolean;
}

/**
 * Version texte brut dérivée du HTML.
 *
 * Un email HTML envoyé sans partie texte est pénalisé par Gmail et Outlook
 * (signal de spam). On la génère systématiquement quand l'appelant n'en
 * fournit pas, en conservant les liens sous la forme « libellé (url) ».
 */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, href, label) => {
      const text = String(label).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      return text ? `${text} (${href})` : String(href);
    })
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|h[1-6]|li|table)>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&euro;/g, "€")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

export async function sendResendEmailThrottled(
  payload: ResendPayload,
  opts: { apiKey?: string } = {},
): Promise<ResendResult> {
  if (!EMAIL_SENDING_ENABLED) {
    return { ok: false, status: 423, detail: "domain_pending_validation" };
  }
  const apiKey = opts.apiKey || Deno.env.get("RESEND_API_KEY");
  if (!apiKey) return { ok: false, detail: "RESEND_API_KEY manquante" };

  // Toujours envoyer une alternative texte : elle améliore la délivrabilité.
  if (!payload.text && payload.html) {
    payload = { ...payload, text: htmlToPlainText(payload.html) };
  }

  if (dailyQuotaHit) {
    return { ok: false, status: 429, detail: "daily_quota_exceeded (short-circuit)", quotaExhausted: true };
  }


  let lastRateLimitBody = "";
  for (let attempt = 0; attempt <= MAX_RETRIES_ON_RATE_LIMIT; attempt++) {
    await waitForSlot();

    let res: Response;
    try {
      res = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      return { ok: false, detail: `network: ${String(err)}` };
    }

    if (res.ok) {
      const json = await res.json().catch(() => ({} as any));
      return { ok: true, id: json?.id, status: res.status };
    }

    const bodyText = await res.text();
    const lower = bodyText.toLowerCase();

    // Daily quota — no point retrying, and stop the whole batch.
    if (res.status === 429 && lower.includes("daily_quota")) {
      dailyQuotaHit = true;
      return { ok: false, status: 429, detail: bodyText, quotaExhausted: true };
    }

    // Per-second rate limit — back off and retry.
    if (res.status === 429) {
      const retryAfterHeader = res.headers.get("retry-after");
      const retryAfterMs = retryAfterHeader
        ? Math.max(250, Number(retryAfterHeader) * 1000 || 500)
        : Math.min(4000, 250 * Math.pow(2, attempt));
      await new Promise((r) => setTimeout(r, retryAfterMs));
      continue;
    }

    // Transient 5xx — one short retry.
    if (res.status >= 500 && attempt < 1) {
      await new Promise((r) => setTimeout(r, 500));
      continue;
    }

    return { ok: false, status: res.status, detail: bodyText.slice(0, 500) };
  }

  return { ok: false, status: 429, detail: "rate_limit_exceeded after retries" };
}

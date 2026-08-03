// Lovable Payments — Stripe via connector gateway
// The "API key" stored in STRIPE_SANDBOX_API_KEY / STRIPE_LIVE_API_KEY
// is a Lovable connection identifier, NOT a real Stripe sk_xxx key.
// All Stripe calls must be proxied through the gateway with two headers.

import { encodeHex } from "https://deno.land/std@0.224.0/encoding/hex.ts";

export type StripeEnv = "sandbox" | "live";

const GATEWAY = "https://connector-gateway.lovable.dev/stripe";
const STRIPE_API_VERSION = "2026-03-25.dahlia";

function env(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

function getApiKey(envName: StripeEnv): string {
  return envName === "sandbox"
    ? env("STRIPE_SANDBOX_API_KEY")
    : env("STRIPE_LIVE_API_KEY");
}

function flatten(obj: any, prefix: string, out: URLSearchParams) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (item && typeof item === "object") flatten(item, `${key}[${i}]`, out);
        else out.append(`${key}[${i}]`, String(item));
      });
    } else if (typeof v === "object") {
      flatten(v as any, key, out);
    } else {
      out.append(key, String(v));
    }
  }
}

function encodeForm(params: any): string {
  const out = new URLSearchParams();
  flatten(params, "", out);
  return out.toString();
}

export async function stripeRequest<T = any>(
  envName: StripeEnv,
  method: "GET" | "POST",
  path: string,
  params?: Record<string, any>,
): Promise<T> {
  const apiKey = getApiKey(envName);
  const lovableKey = env("LOVABLE_API_KEY");
  let url = `${GATEWAY}/v1${path}`;
  let body: string | undefined;
  if (params && method === "POST") {
    body = encodeForm(params);
  } else if (params && method === "GET") {
    const qs = new URLSearchParams();
    flatten(params, "", qs);
    url += "?" + qs.toString();
  }
  const r = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": apiKey,
      "Stripe-Version": STRIPE_API_VERSION,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const text = await r.text();
  let json: any;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!r.ok) {
    throw new Error(`Stripe ${method} ${path} → ${r.status}: ${json.error?.message || text}`);
  }
  return json as T;
}

// HMAC-SHA256 webhook verification (no Stripe SDK needed)
export async function verifyWebhook(
  req: Request,
  envName: StripeEnv,
): Promise<{ id: string; type: string; data: { object: any } }> {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();
  const secret = envName === "sandbox"
    ? env("PAYMENTS_SANDBOX_WEBHOOK_SECRET")
    : env("PAYMENTS_LIVE_WEBHOOK_SECRET");

  if (!signature || !body) throw new Error("Missing signature or body");

  let timestamp: string | undefined;
  const v1Signatures: string[] = [];
  for (const part of signature.split(",")) {
    const [key, value] = part.split("=", 2);
    if (key === "t") timestamp = value;
    if (key === "v1") v1Signatures.push(value);
  }
  if (!timestamp || v1Signatures.length === 0) throw new Error("Invalid signature format");
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (age > 300) throw new Error("Webhook timestamp too old");

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${body}`),
  );
  const expected = encodeHex(new Uint8Array(signed));
  if (!v1Signatures.includes(expected)) throw new Error("Invalid webhook signature");

  return JSON.parse(body);
}

// Signed unsubscribe links: only the recipient's own link can unsubscribe their address.
const enc = new TextEncoder();

async function key() {
  const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  return await crypto.subtle.importKey("raw", enc.encode(`unsub:${secret}`), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}

export async function unsubToken(email: string): Promise<string> {
  const sig = await crypto.subtle.sign("HMAC", await key(), enc.encode(email.trim().toLowerCase()));
  return Array.from(new Uint8Array(sig)).slice(0, 16).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyUnsubToken(email: string, token: string): Promise<boolean> {
  if (!token) return false;
  const expected = await unsubToken(email);
  if (expected.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}

export async function unsubUrl(functionsBase: string, email: string): Promise<string> {
  return `${functionsBase}/unsubscribe?email=${encodeURIComponent(email)}&k=${await unsubToken(email)}`;
}

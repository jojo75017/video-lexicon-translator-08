// Brute-force guard for email + access-code sign-in: failures are counted per email and per IP over 15 minutes.
// deno-lint-ignore no-explicit-any
type Admin = any;
const WINDOW_MS = 15 * 60 * 1000;
export const MAX_PER_EMAIL = 5;
export const MAX_PER_IP = 20;

export function clientIp(req: Request): string | null {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip") || null;
}

export async function isLockedOut(admin: Admin, email: string, ip: string | null): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const { count: byEmail } = await admin.from("access_code_attempts").select("id", { count: "exact", head: true }).eq("email", email).gte("created_at", since);
  if ((byEmail ?? 0) >= MAX_PER_EMAIL) return true;
  if (!ip) return false;
  const { count: byIp } = await admin.from("access_code_attempts").select("id", { count: "exact", head: true }).eq("ip", ip).gte("created_at", since);
  return (byIp ?? 0) >= MAX_PER_IP;
}

export async function recordFailure(admin: Admin, email: string, ip: string | null) {
  await admin.from("access_code_attempts").insert({ email, ip });
}

// Outbound fetch for user-supplied URLs: public http(s) hosts only, redirects re-checked at every hop.
function isPrivateIp(ip: string): boolean {
  const v = ip.toLowerCase().replace(/^\[|\]$/g, "");
  if (v.includes(':')) {
    // Only globally routed IPv6 unicast is accepted; mapped/translation and local ranges are rejected.
    return !/^[23][0-9a-f]{3}:/.test(v) || v.startsWith('2001:db8:') || v.startsWith('2001:0:') || v.startsWith('2002:');
  }
  const m = v.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return false;
  const [a, b] = [Number(m[1]), Number(m[2])];
  return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && (b === 168 || b === 0 || b === 2)) ||
    (a === 198 && (b === 18 || b === 19 || b === 51)) || (a === 203 && b === 0) ||
    (a === 100 && b >= 64 && b <= 127) || a >= 224;
}

async function assertPublicUrl(raw: string): Promise<URL> {
  const u = new URL(raw);
  if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("Adresse non autorisée");
  if (u.port && !["80", "443"].includes(u.port)) throw new Error("Adresse non autorisée");
  const host = u.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".internal") || host.endsWith(".local") || !host.includes(".") && !host.includes(":")) {
    throw new Error("Adresse non autorisée");
  }
  if (isPrivateIp(host)) throw new Error("Adresse non autorisée");
  if (!/^\d+\.\d+\.\d+\.\d+$/.test(host) && !host.includes(':')) {
    const ips = [
      ...(await Deno.resolveDns(host, "A").catch(() => [] as string[])),
      ...(await Deno.resolveDns(host, "AAAA").catch(() => [] as string[])),
    ];
    if (!ips.length || ips.some(isPrivateIp)) throw new Error("Adresse non autorisée");
  }
  return u;
}

export async function safeFetch(url: string, init: RequestInit = {}, maxRedirects = 3): Promise<Response> {
  let current = url;
  for (let i = 0; i <= maxRedirects; i++) {
    await assertPublicUrl(current);
    const res = await fetch(current, { ...init, redirect: "manual" });
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      const location = res.headers.get("location");
      if (!location) return res;
      await res.body?.cancel();
      current = new URL(location, current).toString();
      continue;
    }
    return res;
  }
  throw new Error("Trop de redirections");
}

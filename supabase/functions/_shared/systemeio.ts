// Helper partagé : pousse un contact vers Systeme.io et lui assigne des tags.
// Crée le contact s'il n'existe pas, sinon récupère l'existant, puis applique les tags.
// IMPORTANT : l'API Systeme.io exige un tagId numérique (pas un nom) pour l'assignation.
// Les tags sont donc créés à la volée s'ils n'existent pas, puis assignés par ID.

const SYSTEMEIO_BASE = "https://api.systeme.io/api";

type Headers = Record<string, string>;

// Cache des IDs de tags (valable le temps d'une exécution) pour éviter
// de lister/créer les tags à chaque contact.
const tagIdCache = new Map<string, number>();

/** Retourne l'ID numérique d'un tag Systeme.io, en le créant si nécessaire. */
async function ensureTagId(name: string, headers: Headers): Promise<number | null> {
  const key = name.trim().toLowerCase();
  if (!key) return null;
  const cached = tagIdCache.get(key);
  if (cached) return cached;

  const scanExisting = async (): Promise<number | null> => {
    try {
      const listRes = await fetch(`${SYSTEMEIO_BASE}/tags?limit=100`, { headers });
      if (!listRes.ok) return null;
      const data = await listRes.json().catch(() => ({}));
      const items = Array.isArray(data?.items) ? data.items : [];
      for (const t of items) {
        const n = String(t?.name ?? "").trim().toLowerCase();
        const id = Number(t?.id);
        if (n && Number.isFinite(id)) tagIdCache.set(n, id);
      }
      return tagIdCache.get(key) ?? null;
    } catch (e) {
      console.warn("Systeme.io tags list exception", (e as Error).message);
      return null;
    }
  };

  // 1) Cherche dans les tags existants
  const found = await scanExisting();
  if (found) return found;

  // 2) Crée le tag
  try {
    const createRes = await fetch(`${SYSTEMEIO_BASE}/tags`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name: name.trim() }),
    });
    if (createRes.ok) {
      const data = await createRes.json().catch(() => ({}));
      const id = Number(data?.id);
      if (Number.isFinite(id)) {
        tagIdCache.set(key, id);
        return id;
      }
    } else {
      // 422 = le tag existe déjà (créé entre-temps) → on reliste
      console.warn("Systeme.io tag create warning", createRes.status, await createRes.text());
    }
  } catch (e) {
    console.warn("Systeme.io tag create exception", (e as Error).message);
  }

  // 3) Dernier recours : relister (couvre le cas "déjà existant")
  return await scanExisting();
}

export async function pushToSystemeIo(
  email: string,
  firstName: string,
  tags: string[],
  extraFields: { slug: string; value: string }[] = [],
): Promise<{ ok: boolean; detail?: string; contactId?: string | number }> {
  const apiKey = Deno.env.get("SYSTEMEIO_API_KEY");
  if (!apiKey) {
    console.warn("SYSTEMEIO_API_KEY missing — skipping Systeme.io push");
    return { ok: false, detail: "missing_key" };
  }
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-API-Key": apiKey,
  };

  let contactId: number | string | null = null;
  try {
    const fields = [
      ...(firstName ? [{ slug: "first_name", value: firstName }] : []),
      ...extraFields,
    ];
    const createRes = await fetch(`${SYSTEMEIO_BASE}/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, fields }),
    });

    if (createRes.ok) {
      const data = await createRes.json().catch(() => ({}));
      contactId = data?.id ?? data?.contact?.id ?? null;
      if (!contactId) return { ok: false, detail: "created_no_id" };
    } else if (createRes.status === 422) {
      const cbody = await createRes.text();
      const isUndeliverable = /n['’]existe pas|does not exist|n['’]est pas valide|invalid|non délivrable|undeliverable/i.test(cbody);
      const isDuplicate = /déjà|already|existe déjà|already exists|duplicate|taken/i.test(cbody);
      if (isDuplicate && !isUndeliverable) {
        const findRes = await fetch(
          `${SYSTEMEIO_BASE}/contacts?email=${encodeURIComponent(email)}`,
          { headers },
        );
        if (findRes.ok) {
          const found = await findRes.json().catch(() => ({}));
          contactId = found?.items?.[0]?.id ?? null;
        }
        if (!contactId) return { ok: false, detail: "existing_not_found" };
      } else {
        console.warn("Systeme.io email rejected", cbody);
        return { ok: false, detail: "email_rejected" };
      }
    } else if (createRes.status === 429) {
      return { ok: false, detail: "rate_429" };
    } else {
      const txt = await createRes.text();
      console.error("Systeme.io create error", createRes.status, txt);
      return { ok: false, detail: `create_${createRes.status}:${txt.slice(0, 200)}` };
    }
  } catch (e) {
    console.error("Systeme.io create exception", (e as Error).message);
    return { ok: false, detail: "create_exception" };
  }

  if (!contactId) return { ok: false, detail: "no_contact_id" };

  // Assignation des tags par ID numérique (l'API refuse les noms : "tagId should not be blank").
  const tagFailures: string[] = [];
  for (const tag of tags) {
    if (!tag) continue;
    try {
      const tagId = await ensureTagId(tag, headers);
      if (!tagId) {
        tagFailures.push(tag);
        continue;
      }
      const tagRes = await fetch(`${SYSTEMEIO_BASE}/contacts/${contactId}/tags`, {
        method: "POST",
        headers,
        body: JSON.stringify({ tagId }),
      });
      // 422 à l'assignation = tag déjà présent sur le contact : acceptable.
      if (!tagRes.ok && tagRes.status !== 422) {
        console.warn("Systeme.io tag assign warning", tagRes.status, await tagRes.text());
        if (tagRes.status === 429) return { ok: false, detail: "rate_429", contactId };
        tagFailures.push(tag);
      }
    } catch (e) {
      console.warn("Systeme.io tag exception", (e as Error).message);
      tagFailures.push(tag);
    }
  }

  if (tagFailures.length > 0) {
    // Le contact existe mais des tags manquent : signalé comme échec retentative.
    return { ok: false, detail: `tag_failed:${tagFailures.join(",").slice(0, 150)}`, contactId };
  }
  return { ok: true, contactId };
}

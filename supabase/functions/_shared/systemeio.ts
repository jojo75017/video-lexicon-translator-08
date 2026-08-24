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

  // Parcourt TOUTES les pages de tags (l'ancienne version s'arrêtait aux 100
  // premiers : au-delà, un tag existant n'était pas trouvé et un doublon
  // homonyme était créé → le workflow Systeme.io ne se déclenchait jamais).
  const scanExisting = async (): Promise<number | null> => {
    try {
      let url: string | null = `${SYSTEMEIO_BASE}/tags?limit=100`;
      let guard = 0;
      while (url && guard++ < 30) {
        const listRes = await fetch(url, { headers });
        if (!listRes.ok) {
          console.warn("Systeme.io tags list error", listRes.status, (await listRes.text()).slice(0, 200));
          break;
        }
        const data = await listRes.json().catch(() => ({}));
        const items = Array.isArray(data?.items) ? data.items : [];
        for (const t of items) {
          const n = String(t?.name ?? "").trim().toLowerCase();
          const id = Number(t?.id);
          if (n && Number.isFinite(id) && !tagIdCache.has(n)) tagIdCache.set(n, id);
        }
        const hit = tagIdCache.get(key);
        if (hit) return hit;
        const next = data?.hasMore && items.length > 0
          ? `${SYSTEMEIO_BASE}/tags?limit=100&startingAfter=${items[items.length - 1]?.id}`
          : null;
        url = next;
      }
      return tagIdCache.get(key) ?? null;
    } catch (e) {
      console.warn("Systeme.io tags list exception", (e as Error).message);
      return null;
    }
  };

  // 1) Cherche dans les tags existants
  const found = await scanExisting();
  if (found) {
    console.log(`Systeme.io tag "${name}" trouvé (id=${found})`);
    return found;
  }

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
        console.log(`Systeme.io tag "${name}" créé (id=${id})`);
        tagIdCache.set(key, id);
        return id;
      }
    } else {
      // 422 = le tag existe déjà (créé entre-temps) → on reliste
      console.warn("Systeme.io tag create warning", createRes.status, (await createRes.text()).slice(0, 200));
    }
  } catch (e) {
    console.warn("Systeme.io tag create exception", (e as Error).message);
  }

  // 3) Dernier recours : relister (couvre le cas "déjà existant")
  return await scanExisting();
}

/** Liste les tags d'un contact (diagnostic : vérifie que le tag est bien posé). */
export async function getContactTags(
  contactId: string | number,
  headers?: Headers,
): Promise<{ id: number; name: string }[] | null> {
  const apiKey = Deno.env.get("SYSTEMEIO_API_KEY");
  if (!apiKey && !headers) return null;
  const h = headers ?? { Accept: "application/json", "X-API-Key": apiKey! };
  try {
    const res = await fetch(`${SYSTEMEIO_BASE}/contacts/${contactId}`, { headers: h });
    if (!res.ok) return null;
    const data = await res.json().catch(() => ({}));
    const tags = Array.isArray(data?.tags) ? data.tags : [];
    return tags.map((t: any) => ({ id: Number(t?.id), name: String(t?.name ?? "") }));
  } catch {
    return null;
  }
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

/** Retire un tag d'un contact Systeme.io (utilisé après achat pour stopper la relance d'essai). */
export async function removeSystemeIoTag(
  contactId: string | number,
  tagName: string,
): Promise<{ ok: boolean; detail?: string }> {
  const apiKey = Deno.env.get("SYSTEMEIO_API_KEY");
  if (!apiKey) return { ok: false, detail: "missing_key" };
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-API-Key": apiKey,
  };
  try {
    const tagId = await ensureTagId(tagName, headers);
    if (!tagId) return { ok: false, detail: "tag_not_found" };
    const res = await fetch(`${SYSTEMEIO_BASE}/contacts/${contactId}/tags/${tagId}`, {
      method: "DELETE",
      headers,
    });
    // 404 = le tag n'était déjà plus sur le contact : résultat identique.
    if (res.ok || res.status === 404) return { ok: true };
    return { ok: false, detail: `delete_${res.status}` };
  } catch (e) {
    return { ok: false, detail: (e as Error).message };
  }
}

/** Retrouve l'ID d'un contact Systeme.io à partir de son email. */
export async function findSystemeIoContactId(email: string): Promise<string | number | null> {
  const apiKey = Deno.env.get("SYSTEMEIO_API_KEY");
  if (!apiKey) return null;
  try {
    const res = await fetch(`${SYSTEMEIO_BASE}/contacts?email=${encodeURIComponent(email)}`, {
      headers: { Accept: "application/json", "X-API-Key": apiKey },
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => ({}));
    return data?.items?.[0]?.id ?? null;
  } catch {
    return null;
  }
}


/**
 * Envoi d'un contact d'essai : tente avec les champs personnalisés
 * (date_debut_essai / date_fin_essai / source) et retombe automatiquement sur
 * un envoi « prénom + email + tag » si ces champs n'existent pas encore dans
 * le compte Systeme.io. Le tag reste ainsi toujours posé.
 */
export async function pushTrialContact(
  email: string,
  firstName: string,
  tags: string[],
  fields: { slug: string; value: string }[] = [],
): Promise<{ ok: boolean; contactId?: string | number | null; detail?: string; fieldsSkipped?: boolean }> {
  if (fields.length > 0) {
    const res = await pushToSystemeIo(email, firstName, tags, fields);
    if (res.ok) return res;
  }
  const fallback = await pushToSystemeIo(email, firstName, tags);
  return { ...fallback, fieldsSkipped: fields.length > 0 };
}

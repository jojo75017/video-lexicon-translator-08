// Helper partagé : pousse un contact vers Systeme.io et lui assigne des tags.
// Crée le contact s'il n'existe pas, sinon récupère l'existant, puis applique les tags.
// Les tags doivent exister côté compte Systeme.io pour déclencher les automations.

const SYSTEMEIO_BASE = "https://api.systeme.io/api";

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
      if (/exist|déjà|already/i.test(cbody)) {
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

  for (const tag of tags) {
    if (!tag) continue;
    try {
      const tagRes = await fetch(`${SYSTEMEIO_BASE}/contacts/${contactId}/tags`, {
        method: "POST",
        headers,
        body: JSON.stringify({ tagName: tag }),
      });
      if (!tagRes.ok) {
        console.warn("Systeme.io tag warning", tagRes.status, await tagRes.text());
      }
    } catch (e) {
      console.warn("Systeme.io tag exception", (e as Error).message);
    }
  }

  return { ok: true, contactId };
}

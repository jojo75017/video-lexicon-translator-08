// Cover Studio KDP Pro — coffre des clés API personnelles (BYOK OpenAI).
//
// Actions : `save` (chiffre puis enregistre après test réel), `test`, `delete`.
// La clé ne quitte jamais le serveur : le client ne reçoit qu'un aperçu masqué.
// Aucun message d'erreur ne peut contenir la clé (fonction `scrub`).

import {
  authenticate,
  corsHeaders,
  encryptKey,
  hasCoverProRight,
  json,
  loadUserOpenAIKey,
  maskKey,
  scrub,
  serviceClient,
} from "../_shared/coverPro.ts";

/** Vérifie réellement la clé auprès d'OpenAI, sans jamais l'exposer. */
async function testOpenAIKey(key: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (res.ok) return { ok: true };
    if (res.status === 401) return { ok: false, error: "Clé OpenAI refusée (401). Vérifiez-la sur votre compte OpenAI." };
    const body = await res.text();
    return { ok: false, error: scrub(`OpenAI a répondu ${res.status} : ${body.slice(0, 200)}`) };
  } catch (err) {
    return { ok: false, error: scrub(err instanceof Error ? err.message : "Test impossible") };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const user = await authenticate(req);
    if (!user) return json({ error: "Non authentifié" }, 401);

    const service = serviceClient();
    const right = await hasCoverProRight(service, user);
    if (!right.granted) return json({ error: "Cover Studio KDP Pro non débloqué." }, 403);

    const body = await req.json().catch(() => ({}));
    const action = String(body?.action ?? "");

    if (action === "delete") {
      const { error } = await service.from("cover_pro_api_keys").delete().eq("user_id", user.id);
      if (error) throw error;
      return json({ ok: true, key: null });
    }

    if (action === "test") {
      const stored = await loadUserOpenAIKey(service, user.id);
      if (!stored) return json({ ok: false, error: "Aucune clé personnelle enregistrée." }, 404);
      const result = await testOpenAIKey(stored);
      await service.from("cover_pro_api_keys")
        .update({ last_tested_at: new Date().toISOString(), last_test_ok: result.ok })
        .eq("user_id", user.id);
      return json({ ok: result.ok, error: result.error });
    }

    if (action === "save") {
      const raw = typeof body?.apiKey === "string" ? body.apiKey.trim() : "";
      if (!raw.startsWith("sk-") || raw.length < 20) {
        return json({ error: "Format de clé OpenAI invalide (elle doit commencer par « sk- »)." }, 400);
      }

      const result = await testOpenAIKey(raw);
      if (!result.ok) return json({ error: result.error ?? "Clé refusée par OpenAI." }, 400);

      const { cipher, iv } = await encryptKey(raw);
      const mask = maskKey(raw);
      const { error } = await service.from("cover_pro_api_keys").upsert({
        user_id: user.id,
        provider: "openai",
        key_cipher: cipher,
        key_iv: iv,
        key_mask: mask,
        last_tested_at: new Date().toISOString(),
        last_test_ok: true,
      }, { onConflict: "user_id" });
      if (error) throw error;

      return json({ ok: true, key: { provider: "openai", mask, lastTestOk: true } });
    }

    return json({ error: "Action inconnue" }, 400);
  } catch (err) {
    return json({ error: scrub(err instanceof Error ? err.message : "Erreur inattendue") }, 500);
  }
});

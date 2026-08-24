// Inscription à l'essai gratuit 7 jours.
//
// Règles :
//  - 1 seul essai par email (unicité garantie en base) ;
//  - l'essai est enregistré AVANT l'appel Systeme.io : si l'API échoue,
//    l'inscription n'est jamais perdue (l'erreur est stockée + rejouée par le cron) ;
//  - aucun email marketing n'est envoyé ici : c'est le tag ESSAI_EBOOKSTUDIO
//    qui déclenche la campagne dans Systeme.io.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { pushTrialContact } from "../_shared/systemeio.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TRIAL_DAYS = 7;
export const TRIAL_TAG = "ESSAI_EBOOKSTUDIO";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);



Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const firstName = String(body.first_name || "").trim().slice(0, 80);
    const honeypot = String(body.website || "").trim();

    // Piège anti-robot : on répond OK sans rien créer.
    if (honeypot) return json({ ok: true, ignored: true });

    if (!isValidEmail(email)) {
      return json({ ok: false, error: "Adresse email invalide." }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1) Anti-duplication : un essai déjà enregistré bloque toute nouvelle demande.
    const { data: existing } = await supabase
      .from("free_trials")
      .select("id, status, started_at, ends_at")
      .ilike("email", email)
      .maybeSingle();

    if (existing) {
      return json({
        ok: false,
        alreadyUsed: true,
        status: existing.status,
        endsAt: existing.ends_at,
        error:
          existing.status === "converti"
            ? "Vous avez déjà un accès actif à EbookStudio."
            : "Vous avez déjà utilisé votre essai gratuit de 7 jours.",
      });
    }

    const startedAt = new Date();
    const endsAt = new Date(startedAt.getTime() + TRIAL_DAYS * 24 * 3600 * 1000);

    // 2) Création de l'essai (insertion atomique : la contrainte d'unicité
    //    protège des doubles clics et des requêtes concurrentes).
    const { data: created, error: insertError } = await supabase
      .from("free_trials")
      .insert({
        email,
        first_name: firstName || null,
        started_at: startedAt.toISOString(),
        ends_at: endsAt.toISOString(),
        status: "actif",
        source: "lovable",
        utm_source: body.utm_source || null,
        utm_campaign: body.utm_campaign || null,
        landing_url: body.landing_url || null,
        ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
        user_agent: req.headers.get("user-agent") || null,
      })
      .select("id")
      .single();

    if (insertError) {
      // 23505 = violation d'unicité → une autre requête a créé l'essai entre-temps.
      if (insertError.code === "23505") {
        return json({
          ok: false,
          alreadyUsed: true,
          error: "Vous avez déjà utilisé votre essai gratuit de 7 jours.",
        });
      }
      console.error("free_trials insert error", insertError);
      return json({ ok: false, error: "Enregistrement impossible. Réessayez." }, 500);
    }

    // 3) Ouverture de l'accès applicatif (7 jours, palier « essai »).
    const { data: subscriber } = await supabase
      .from("subscribers")
      .select("id, status")
      .ilike("email", email)
      .maybeSingle();

    if (subscriber) {
      await supabase
        .from("subscribers")
        .update({
          status: "trialing",
          plan_type: "essai",
          plan_tier: "essai",
          trial_ends_at: endsAt.toISOString(),
        })
        .eq("id", subscriber.id);
    } else {
      await supabase.from("subscribers").insert({
        email,
        status: "trialing",
        plan_type: "essai",
        plan_tier: "essai",
        trial_ends_at: endsAt.toISOString(),
      });
    }

    // 4) Envoi vers Systeme.io — non bloquant pour l'inscription.
    let systemeio = false;
    try {
      // Aucun champ personnalisé : les slugs source / date_debut_essai /
      // date_fin_essai n'existent pas dans le compte Systeme.io et provoquaient
      // un 422 à chaque inscription. Seul le tag pilote la campagne.
      const res = await pushTrialContact(email, firstName, [TRIAL_TAG]);

      systemeio = res.ok;
      await supabase
        .from("free_trials")
        .update({
          systemeio_synced_at: res.ok ? new Date().toISOString() : null,
          systemeio_contact_id: res.contactId ? String(res.contactId) : null,
          systemeio_attempts: 1,
          systemeio_last_error: res.ok ? null : (res.detail ?? "unknown"),
          // Première reprise 10 minutes plus tard en cas d'échec.
          systemeio_next_attempt_at: res.ok
            ? null
            : new Date(Date.now() + 10 * 60_000).toISOString(),
        })
        .eq("id", created.id);
      if (!res.ok) console.error("Systeme.io push failed for trial", email, res.detail);
    } catch (e) {
      console.error("Systeme.io push exception", (e as Error).message);
      await supabase
        .from("free_trials")
        .update({
          systemeio_attempts: 1,
          systemeio_last_error: (e as Error).message.slice(0, 300),
          systemeio_next_attempt_at: new Date(Date.now() + 10 * 60_000).toISOString(),
        })
        .eq("id", created.id);
    }

    return json({
      ok: true,
      email,
      firstName: firstName || null,
      startedAt: startedAt.toISOString(),
      endsAt: endsAt.toISOString(),
      systemeio,
    });
  } catch (e) {
    console.error("free-trial-signup error", e);
    return json({ ok: false, error: "Erreur serveur. Réessayez dans un instant." }, 500);
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { EMAIL_SENDING_ENABLED } from "../_shared/emailSendingGuard.ts";
// Systeme.io désactivé — tous les leads restent dans la base interne.
import { pushToSystemeIo } from "../_shared/systemeio.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Magnet = {
  url: string;
  title: string;
  subject: string;
  intro: string;
  items: string[];
  cta?: string;
};

const MAGNETS: Record<string, Magnet> = {
  "5-niches-rentables-2026": {
    url: "https://ebookstudio.fr/lead-magnets/5-niches-rentables-2026.pdf",
    title: "📘 Vos 5 niches rentables 2026",
    subject: "📘 Vos 5 niches rentables 2026 (PDF à l'intérieur)",
    intro:
      "Merci pour votre inscription ! Voici votre guide gratuit, compilé à partir des données Amazon les plus récentes :",
    items: [
      "5 niches non saturées avec demande forte",
      "Mots-clés Amazon à fort volume pour chaque niche",
      "Plan d'ebook type pour démarrer",
      "Prix moyens et top 3 best-sellers par niche",
    ],
  },
  "publier-kdp-etranger": {
    url: "https://ebookstudio.fr/lead-magnets/guide-publier-kdp-etranger.pdf",
    title: "🌍 Publier sur Amazon KDP depuis l'étranger",
    subject: "🌍 Votre guide : publier sur KDP depuis l'étranger (PDF)",
    intro:
      "Merci pour votre inscription ! Voici votre guide gratuit pour créer et vendre un ebook en français depuis votre pays de résidence :",
    items: [
      "Créer un compte KDP depuis la Suisse, la Belgique, le Canada…",
      "Être payé sur votre compte bancaire local (CHF, EUR, CAD)",
      "Le formulaire fiscal (tax interview) expliqué simplement",
      "Checklist complète avant publication",
    ],
  },
  "masterclass-ebookstudio": {
    url: "https://ebookstudio.fr/masterclass",
    title: "🎓 Votre accès à la Masterclass EbookStudio Pro",
    subject: "🎓 Votre Masterclass EbookStudio Pro est débloquée",
    intro:
      "Merci ! Votre accès aux 5 modules de la Masterclass (5h de formation) est débloqué. Reprenez là où vous en étiez quand vous voulez :",
    items: [
      "Module 1 — Fondations & vision",
      "Module 2 — Génération de contenu par IA",
      "Module 3 — Design & couverture professionnelle",
      "Module 4 — Métadonnées & SEO Amazon KDP",
      "Module 5 — Automatisation & stratégie marketing",
    ],
  },
  "10-niches-offertes": {
    url: "https://ebookstudio.fr/10-niches-offertes",
    title: "🎁 Votre pack 10 niches offertes",
    subject: "🎁 Vos 10 niches qui se vendent déjà (accès immédiat)",
    intro:
      "Merci pour votre inscription ! Voici votre pack : 10 niches KDP où la demande existe déjà, avec les mots-clés Amazon exacts à viser :",
    items: [
      "10 niches vérifiées, une par grande catégorie",
      "Le mot-clé Amazon exact à viser pour chacune",
      "BSR cible, niveau de concurrence et prix constaté",
      "Un bouton « Écrire ce livre » pour démarrer directement",
    ],
    cta: "🎁 Ouvrir mon pack 10 niches",
  },
};

const DEFAULT_MAGNET = "5-niches-rentables-2026";
const LEAD_MAGNET_URL = MAGNETS[DEFAULT_MAGNET].url;

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

async function sendLeadMagnetEmail(email: string, firstName: string, magnetKey: string) {
  if (!EMAIL_SENDING_ENABLED) return false;
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY missing — skipping email");
    return false;
  }
  const magnet = MAGNETS[magnetKey] || MAGNETS[DEFAULT_MAGNET];
  const greeting = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#232F3E;background:#FAFAFA;padding:24px;border-radius:12px">
    <h1 style="color:#008296;margin:0 0 12px">${magnet.title}</h1>
    <p>${greeting}</p>
    <p>${magnet.intro}</p>
    <p style="text-align:center;margin:24px 0">
      <a href="${magnet.url}" style="background:#FF9E2D;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
        ${magnet.cta || "📥 Télécharger le PDF"}
      </a>
    </p>
    <p>À l'intérieur :</p>
    <ul>
      ${magnet.items.map((i) => `<li>${i}</li>`).join("")}
    </ul>
    <p>Bonne lecture,<br/>L'équipe EbookStudio</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
    <p style="font-size:12px;color:#6b7280">Vous recevez cet email car vous l'avez demandé sur ebookstudio.fr.</p>
  </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "EbookStudio <contact@ebookstudio.fr>",
      to: [email],
      subject: magnet.subject,
      html,
    }),
  });
  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return false;
  }
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const first_name = String(body.first_name || "").trim().slice(0, 80);
    const ref_code = String(body.ref_code || "").trim().slice(0, 64) || null;
    const magnetKey = String(body.lead_magnet || "").trim() || DEFAULT_MAGNET;
    const abVariantRaw = String(body.ab_variant || "").trim().toUpperCase();
    const ab_variant = abVariantRaw === "A" || abVariantRaw === "B" ? abVariantRaw : null;
    const honeypot = String(body.website || "").trim();

    if (honeypot) {
      // Bot detected — silently succeed
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Email invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      null;

    // Upsert by lowercase email
    const { data: existing } = await supabase
      .from("funnel_leads")
      .select("id, ab_variant")
      .ilike("email", email)
      .maybeSingle();

    let leadId = existing?.id;
    if (leadId) {
      await supabase
        .from("funnel_leads")
        .update({
          first_name: first_name || null,
          ref_code: ref_code,
          lead_magnet: magnetKey,
          // On conserve la variante A/B d'origine si elle existe déjà
          ab_variant: existing?.ab_variant || ab_variant,
          utm_source: body.utm_source || null,
          utm_medium: body.utm_medium || null,
          utm_campaign: body.utm_campaign || null,
          landing_url: body.landing_url || null,
          user_agent: req.headers.get("user-agent") || null,
          ip,
        })
        .eq("id", leadId);
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from("funnel_leads")
        .insert({
          email,
          first_name: first_name || null,
          ref_code,
          lead_magnet: magnetKey,
          ab_variant,
          utm_source: body.utm_source || null,
          utm_medium: body.utm_medium || null,
          utm_campaign: body.utm_campaign || null,
          landing_url: body.landing_url || null,
          user_agent: req.headers.get("user-agent") || null,
          ip,
        })
        .select("id")
        .single();
      if (insErr) throw insErr;
      leadId = inserted.id;
    }

    // Send lead magnet email (non-blocking failure)
    const sent = await sendLeadMagnetEmail(email, first_name, magnetKey);
    if (sent) {
      await supabase
        .from("funnel_leads")
        .update({ lead_magnet_sent_at: new Date().toISOString() })
        .eq("id", leadId);
    }

    // Synchronisation Systeme.io : le lead est poussé avec ses tags
    // (échec non bloquant — le lead reste en base interne quoi qu'il arrive).
    try {
      const tags = ["ebookstudio-lead", `lm-${magnetKey}`];
      if (ab_variant) tags.push(`ab-${ab_variant.toLowerCase()}`);
      const res = await pushToSystemeIo(email, first_name, tags, [
        ...(ref_code ? [{ slug: "ref_code", value: ref_code }] : []),
      ]);
      if (!res.ok) console.warn("Systeme.io push skipped:", res.detail);
    } catch (e) {
      console.warn("Systeme.io push exception", (e as Error).message);
    }


    return new Response(
      JSON.stringify({
        ok: true,
        lead_id: leadId,
        lead_magnet_url: (MAGNETS[magnetKey] || MAGNETS[DEFAULT_MAGNET]).url,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("funnel-capture-lead error:", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message || "Erreur serveur" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

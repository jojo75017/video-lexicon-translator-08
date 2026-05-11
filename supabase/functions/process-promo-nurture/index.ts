import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE = "https://ebookstudio.fr";

interface StepDef {
  step: number;
  delayDays: number; // days from previous email
  subject: string;
  build: (firstName: string, unsubUrl: string) => string;
}

const wrap = (inner: string, unsubUrl: string) => `
<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#232F3E;background:#FAFAFA;padding:24px;border-radius:12px">
  ${inner}
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
  <p style="font-size:11px;color:#9ca3af;text-align:center">
    EbookStudio — <a href="${unsubUrl}" style="color:#9ca3af">Se désinscrire</a>
  </p>
</div>`;

const cta = (href: string, label: string) =>
  `<p style="text-align:center;margin:24px 0"><a href="${href}" style="background:#FF9E2D;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">${label}</a></p>`;

const STEPS: StepDef[] = [
  {
    step: 1,
    delayDays: 1,
    subject: "📘 As-tu lu le guide ? La niche n°1 en détail",
    build: (n, u) => wrap(`
      <h1 style="color:#008296">Hello ${n || ""} 👋</h1>
      <p>Tu as eu le temps de parcourir le guide des 5 niches ?</p>
      <p>Pour aller plus loin, j'ai préparé une <strong>analyse approfondie de la niche n°1</strong> (la plus rentable en 2026).</p>
      <p>Découvre comment générer ton premier ebook sur cette niche en moins de 30 minutes :</p>
      ${cta(`${SITE}/promo/decouverte`, "Voir la démo gratuite")}
      <p>À demain,<br/>Georges</p>
    `, u),
  },
  {
    step: 2,
    delayDays: 2,
    subject: "📈 Le cas Marie : 1247€ en 30 jours avec 1 ebook",
    build: (n, u) => wrap(`
      <h1 style="color:#008296">Une histoire qui va te parler</h1>
      <p>${n ? `Salut ${n},` : "Salut,"}</p>
      <p>Marie L., enseignante de 42 ans, a publié son premier ebook KDP en mars dernier.</p>
      <p>30 jours plus tard : <strong>1247€ de revenus passifs</strong>. Sans expérience préalable.</p>
      <p>Sa méthode ? Exactement celle qu'on enseigne dans EbookStudio.</p>
      ${cta(`${SITE}/promo/decouverte`, "Voir comment elle a fait")}
      <p>À très vite,<br/>Georges</p>
    `, u),
  },
  {
    step: 3,
    delayDays: 2,
    subject: "⏱️ \"Je n'ai pas le temps\" — Vraiment ?",
    build: (n, u) => wrap(`
      <h1 style="color:#008296">L'objection n°1 (et pourquoi elle est fausse)</h1>
      <p>${n ? `${n},` : ""}</p>
      <p>"Je n'ai pas le temps d'écrire un livre" — c'est ce que je m'entends dire 10x par semaine.</p>
      <p>Réalité : <strong>avec EbookStudio, un ebook complet se génère en 30 minutes.</strong> Pas 30 jours. 30 minutes.</p>
      <ul>
        <li>✅ Plan automatique en 2 clics</li>
        <li>✅ Rédaction IA chapitre par chapitre</li>
        <li>✅ Couverture pro générée</li>
        <li>✅ Export PDF/EPUB prêt pour Amazon KDP</li>
      </ul>
      ${cta(`${SITE}/promo/commande`, "Démarrer pour 67€/an")}
      <p>Garantie satisfait ou remboursé 7 jours.</p>
    `, u),
  },
  {
    step: 4,
    delayDays: 2,
    subject: "🚪 Dernière chance — l'offre se ferme",
    build: (n, u) => wrap(`
      <h1 style="color:#008296">Dernier rappel</h1>
      <p>${n ? `${n},` : ""}</p>
      <p>C'est mon dernier email sur cette offre. Je ne veux pas spammer ta boîte 😉</p>
      <p>Récap de ce que tu obtiens pour <strong>67€/an</strong> (= 5,58€/mois) :</p>
      <ul>
        <li>📚 Ebooks illimités (KDP-ready)</li>
        <li>🎨 Couvertures illimitées</li>
        <li>🎙️ Audiobook + BD</li>
        <li>📖 Licence commerciale</li>
        <li>🎓 Formation + Forum</li>
      </ul>
      <p><strong>Garantie 7 jours :</strong> tu testes, et si ça ne te plaît pas, je rembourse. Sans question.</p>
      ${cta(`${SITE}/promo/commande`, "J'en profite — 67€")}
      <p>Sinon, je te souhaite bonne continuation 🙏<br/>Georges</p>
    `, u),
  },
];

async function sendEmail(to: string, subject: string, html: string) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) return false;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "EbookStudio <contact@ebookstudio.fr>",
      to: [to],
      subject,
      html,
    }),
  });
  if (!r.ok) console.error("Resend fail", r.status, await r.text());
  return r.ok;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: rows, error } = await supabase
      .from("email_sequences")
      .select("id, email, current_step")
      .eq("sequence_name", "promo_funnel")
      .eq("completed", false)
      .eq("unsubscribed", false)
      .lte("next_email_at", new Date().toISOString())
      .limit(50);
    if (error) throw error;

    let sent = 0;
    for (const row of rows || []) {
      const nextStep = (row.current_step ?? 0) + 1;
      const def = STEPS.find((s) => s.step === nextStep);
      if (!def) {
        await supabase.from("email_sequences").update({ completed: true }).eq("id", row.id);
        continue;
      }

      // fetch first name from funnel_leads
      const { data: lead } = await supabase
        .from("funnel_leads")
        .select("first_name")
        .ilike("email", row.email)
        .maybeSingle();
      const firstName = (lead?.first_name || "").trim();

      const unsubUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/unsubscribe?email=${encodeURIComponent(row.email)}&seq=promo_funnel`;
      const ok = await sendEmail(row.email, def.subject, def.build(firstName, unsubUrl));
      if (!ok) continue;

      const next = STEPS.find((s) => s.step === nextStep + 1);
      const completed = !next;
      const nextAt = next
        ? new Date(Date.now() + next.delayDays * 86400 * 1000).toISOString()
        : new Date().toISOString();

      await supabase.from("email_sequences").update({
        current_step: nextStep,
        last_email_sent_at: new Date().toISOString(),
        next_email_at: nextAt,
        completed,
      }).eq("id", row.id);
      sent++;
    }

    return new Response(JSON.stringify({ ok: true, processed: rows?.length ?? 0, sent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("process-promo-nurture error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

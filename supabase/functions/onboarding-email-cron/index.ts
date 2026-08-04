// Cron d'onboarding EbookStudio — envoie automatiquement les 8 emails
// aux nouveaux essais gratuits (sequence_name = 'onboarding').
// Envoi via Brevo (BREVO_API_KEY). Aucune action manuelle requise.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE = "https://ebookstudio.fr";
const TEAL = "#008296";
const AMBER = "#FF9E2D";
const INK = "#232F3E";
const SENDER = { name: "Georges — EbookStudio", email: "contact@ebookstudio.fr" };

// ── Helpers de mise en forme (repris du design des emails Brevo) ──
const cta = (href: string, label: string, color = AMBER) =>
  `<tr><td align="center" style="padding:26px 0">
    <a href="${href}" style="background:${color};color:#ffffff;padding:15px 34px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;font-family:Arial,Helvetica,sans-serif">${label}</a>
  </td></tr>`;

const shell = (inner: string, unsubUrl: string) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAFAFA">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAFA;padding:24px 0">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px -12px rgba(0,0,0,0.12)">
<tr><td style="background:${TEAL};padding:22px 32px">
  <span style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:800;color:#ffffff">Ebook<span style="color:${AMBER}">Studio</span></span>
</td></tr>
<tr><td style="padding:32px;font-family:Arial,Helvetica,sans-serif;color:${INK};font-size:16px;line-height:1.6">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${inner}
</table>
</td></tr>
<tr><td style="padding:0 32px 26px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#5b6875;line-height:1.6">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eef1f4;padding-top:18px">
  <tr><td style="padding-top:18px;text-align:center">
    Une question avant de vous lancer ? On en parle 👇<br/><br/>
    <a href="${SITE}/demo" style="display:inline-block;margin:4px 6px;padding:10px 18px;border:1px solid ${TEAL};border-radius:8px;color:${TEAL};text-decoration:none;font-weight:600;font-size:14px">📅 Réserver une démo privée avec Georges</a>
    <a href="mailto:contact@ebookstudio.fr" style="display:inline-block;margin:4px 6px;padding:10px 18px;border:1px solid #d8dee4;border-radius:8px;color:#5b6875;text-decoration:none;font-weight:600;font-size:14px">💬 Répondre directement à cet email</a>
    <div style="margin-top:18px;font-size:13px;color:#7b8794;line-height:1.5">
      ⭐⭐⭐⭐⭐<br/>
      Chaque semaine, de nouveaux auteurs rejoignent EbookStudio pour publier plus rapidement.
    </div>
  </td></tr>
  </table>
</td></tr>
<tr><td style="padding:20px 32px;background:#f3f5f7;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9aa4b0;text-align:center">
  EbookStudio — Créez, publiez et vendez vos ebooks avec l'IA.<br/>
  <a href="${unsubUrl}" style="color:#9aa4b0">Se désinscrire</a>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;

const h1 = (t: string) => `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:800;color:${TEAL};padding-bottom:12px">${t}</td></tr>`;
const p = (t: string) => `<tr><td style="padding-bottom:14px">${t}</td></tr>`;
const hi = (n: string) => (n ? `Bonjour ${n},` : "Bonjour,");

interface StepDef {
  step: number;
  delayDays: number; // écart en jours depuis l'email précédent
  subject: string;
  build: (firstName: string, unsubUrl: string) => string;
}

// ── Les 8 emails (calendrier J0, J+1, J+2, J+4, J+6, J+8, J+10, J+30) ──
const STEPS: StepDef[] = [
  {
    step: 1, delayDays: 0,
    subject: "🎉 Bienvenue dans EbookStudio !",
    build: (n, u) => shell(
      h1("Bienvenue à bord 👋") + p(hi(n)) +
      p("Ravi de vous compter parmi les auteurs d'EbookStudio ! Vous venez de rejoindre l'outil qui transforme une simple idée en ebook complet, prêt pour Amazon KDP.") +
      p("Dans les prochains jours, je vais vous montrer, pas à pas, comment tirer le maximum de la plateforme. Aujourd'hui, une seule chose : connectez-vous et faites le tour du propriétaire.") +
      cta(`${SITE}/subscription`, "🚀 Accéder à mon espace") +
      p("À très vite,<br/>Georges — fondateur d'EbookStudio"), u),
  },
  {
    step: 2, delayDays: 1,
    subject: "Votre premier ebook en 15 minutes ⏱️",
    build: (n, u) => shell(
      h1("Votre premier ebook en 15 minutes") + p(hi(n)) +
      p("Beaucoup pensent qu'écrire un livre prend des mois. Avec EbookStudio, votre premier ebook peut être prêt en un après-midi.") +
      p("Les 3 étapes :") +
      p("<strong>1.</strong> Choisissez un sujet (ou laissez l'IA vous en suggérer).<br/><strong>2.</strong> Générez le plan et les chapitres automatiquement.<br/><strong>3.</strong> Exportez en PDF/EPUB + couverture KDP.") +
      cta(`${SITE}/subscription`, "✍️ Créer mon premier ebook") +
      p("Lancez-vous maintenant, l'expérience vaut mille explications."), u),
  },
  {
    step: 3, delayDays: 1,
    subject: "Découvrez les agents IA d'EbookStudio 🤖",
    build: (n, u) => shell(
      h1("Vos agents IA au travail") + p(hi(n)) +
      p("EbookStudio n'est pas un simple générateur de texte. C'est une équipe de <strong>15 agents IA spécialisés</strong> qui collaborent : plan, rédaction, cohérence, SEO, couverture, marketing…") +
      p("Chaque agent a un rôle précis, comme une vraie maison d'édition automatisée. Résultat : un livre structuré, cohérent et prêt à vendre.") +
      cta(`${SITE}/subscription`, "🤖 Découvrir les agents") +
      p("Testez le pipeline complet sur votre prochain projet."), u),
  },
  {
    step: 4, delayDays: 2,
    subject: "Les erreurs que font 90 % des auteurs ⚠️",
    build: (n, u) => shell(
      h1("Les 4 erreurs à éviter") + p(hi(n)) +
      p("La plupart des auteurs débutants échouent pour les mêmes raisons :") +
      p("❌ Un titre qui ne dit pas ce que le lecteur va gagner.<br/>❌ Une couverture amateur.<br/>❌ Aucune recherche de mots-clés KDP.<br/>❌ Un contenu générique, sans angle unique.") +
      p("Bonne nouvelle : EbookStudio corrige ces 4 points automatiquement (titres testés, couvertures pro, mots-clés, angle éditorial).") +
      cta(`${SITE}/subscription`, "✅ Corriger mes ebooks") +
      p("Un petit ajustement peut doubler vos ventes."), u),
  },
  {
    step: 5, delayDays: 2,
    subject: "Étude de cas : 1 247 € en 30 jours 📈",
    build: (n, u) => shell(
      h1("L'histoire de Marie") + p(hi(n)) +
      p("Marie, enseignante de 42 ans, n'avait jamais écrit de livre. En mars, elle publie son premier ebook créé avec EbookStudio.") +
      p("30 jours plus tard : <strong>1 247 € de revenus</strong>, en travaillant le soir, sans expérience technique.") +
      p("Sa méthode ? Exactement celle que vous avez entre les mains. La seule différence : elle est passée à l'action.") +
      cta(`${SITE}/subscription`, "📚 Créer mon ebook rentable") +
      p("Votre première vente est plus proche que vous ne le pensez."), u),
  },
  {
    step: 6, delayDays: 2,
    subject: "Vos questions les plus fréquentes 💬",
    build: (n, u) => shell(
      h1("Questions fréquentes") + p(hi(n)) +
      p("<strong>« Faut-il savoir écrire ? »</strong> Non. L'IA rédige, vous validez.") +
      p("<strong>« Est-ce légal pour Amazon KDP ? »</strong> Oui, vous êtes propriétaire du contenu généré et détenez la licence commerciale.") +
      p("<strong>« Combien de temps pour un livre ? »</strong> De 15 minutes à quelques heures selon la longueur.") +
      p("<strong>« Et si je bloque ? »</strong> Formation, forum et assistance sont inclus.") +
      cta(`${SITE}/subscription`, "🙋 Poser ma question / Démarrer") +
      p("Il ne vous manque plus qu'à publier."), u),
  },
  {
    step: 7, delayDays: 2,
    subject: "🎁 Offre de lancement : l'accès à vie à 67 €",
    build: (n, u) => shell(
      h1("Votre offre de lancement") + p(hi(n)) +
      p("Votre essai gratuit touche à sa fin. Pour continuer à créer des ebooks illimités, profitez de l'offre de lancement :") +
      p(`<span style="font-size:30px;font-weight:800;color:${TEAL}">67 €</span> <span style="color:#9aa4b0">— paiement unique, accès à vie</span>`) +
      p("✅ Ebooks illimités (KDP-ready)<br/>✅ Couvertures illimitées<br/>✅ Audiobook + BD<br/>✅ Licence commerciale<br/>✅ Formation + Forum") +
      cta(`${SITE}/promo/commande`, "🚀 J'obtiens mon accès à vie — 67 €") +
      p("Garantie satisfait ou remboursé 7 jours. Aucun risque.") +
      p("Merci de votre confiance,<br/>Georges"), u),
  },
  {
    step: 8, delayDays: 20,
    subject: "Votre projet d'ebook est-il toujours d'actualité ?",
    build: (n, u) => shell(
      h1("On reprend contact 👋") + p(hi(n)) +
      p("Cela fait quelques semaines depuis votre essai d'EbookStudio. Je voulais simplement savoir : <strong>votre projet d'ebook est-il toujours d'actualité ?</strong>") +
      p("Si oui, sachez qu'EbookStudio a beaucoup évolué. Voici ce qui pourrait vous relancer :") +
      p("✨ <strong>Nouveautés</strong> : de nouveaux agents IA et un pipeline encore plus rapide pour passer de l'idée au livre publié.") +
      p("📚 <strong>Documentation Studio</strong> : notre plateforme qui génère automatiquement toute la documentation, le marketing et la communication d'un produit numérique à partir d'un seul brief.") +
      cta(`${SITE}/subscription`, "🔄 Reprendre mon projet") +
      p("Et parce que je tiens à vous accompagner, je vous offre un <strong>bonus temporaire</strong> pour vous remettre le pied à l'étrier. Répondez simplement à cet email et je vous l'envoie.") +
      p("Au plaisir de vous relire,<br/>Georges"), u),
  },
];

async function sendBrevo(email: string, subject: string, html: string): Promise<boolean> {
  const key = Deno.env.get("BREVO_API_KEY");
  if (!key) { console.error("BREVO_API_KEY missing"); return false; }
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ sender: SENDER, to: [{ email }], subject, htmlContent: html }),
  });
  if (!res.ok) { console.error("Brevo send fail", res.status, await res.text()); return false; }
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Ancien moteur Brevo neutralisé : les campagnes marketing sont désormais
  // pilotées hors de l'application pour éviter les doublons et tarifs obsolètes.
  return new Response(JSON.stringify({ ok: true, disabled: true, processed: 0, sent: 0 }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

  /* Legacy implementation retained temporarily for audit history.
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: rows, error } = await supabase
      .from("email_sequences")
      .select("id, email, current_step")
      .eq("sequence_name", "onboarding")
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

      const { data: lead } = await supabase
        .from("funnel_leads")
        .select("first_name")
        .ilike("email", row.email)
        .maybeSingle();
      const firstName = (lead?.first_name || "").trim();

      const unsubUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/unsubscribe?email=${encodeURIComponent(row.email)}&seq=onboarding`;
      const ok = await sendBrevo(row.email, def.subject, def.build(firstName, unsubUrl));
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
    console.error("onboarding-email-cron error:", e);
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  */
});

/**
 * Campagne « Offre de lancement 47 € » — séquence de 7 emails.
 * - Email 1 : envoi MANUEL par l'admin (tranches de 500 max).
 * - Emails 2 à 7 : envoi AUTOMATIQUE (tâche planifiée 9h00 Paris, header x-cron-secret),
 *   uniquement aux actifs ayant reçu l'email 1, hors acheteurs/abonnés/désinscrits/rejetés.
 * - Arrêt total si pause, si 0 place restante ou après le 15/10/2026 23:59 Paris.
 * - Journal offre_lancement_sends (email, email_id) : jamais deux fois la même étape.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled, isQuotaExhausted } from "../_shared/resendThrottle.ts";
import { FROM_CAMPAIGN, REPLY_TO } from "../_shared/emailIdentity.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const TRANCHE = 500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CTA_URL = "https://ebookstudio-2026-offre-47.landaa.io/f/tunnel-de-vente/de-vente";
const FIN_ISO = "2026-10-15T23:59:59+02:00";
const PAUSE_KEY = "offre_lancement_sequence";
const CTA = "Je réserve ma place à 47 €";
const SIGN = "Georges Boubet";

type Ctx = { prenom: string | null; places: string };
type Step = {
  n: number;
  emailId: string;
  date: string | null; // AAAA-MM-JJ (Paris) ; null = manuel
  subject: (c: Ctx) => string;
  preheader: string;
  paras: (c: Ctx) => string[];
  closing: string;
  ps?: string;
};

const placesLabel = (n: number) => `${n} place${n > 1 ? "s" : ""}`;

const STEPS: Step[] = [
  {
    n: 1, emailId: "offre-lancement-47", date: null,
    subject: (c) => c.prenom
      ? `${c.prenom}, 15 places à 47 € pour EbookStudio V3 (jusqu'au 15 octobre)`
      : "15 places à 47 € pour EbookStudio V3 (jusqu'au 15 octobre)",
    preheader: "Accès à vie, payé une seule fois. Sans abonnement.",
    paras: () => [
      "EbookStudio V3 est ouvert. Pour le lancement, je propose 15 places à un tarif que je ne referai pas : l'accès à vie au niveau Édition pour 47 €, payés une seule fois. Aucun abonnement.",
      "Avec l'atelier, vous passez de l'idée au livre prêt pour Amazon KDP : sujet, sommaire, rédaction chapitre par chapitre, correction, couverture, mise en page et fiche de vente. Vous gardez la main sur tout, et vos livres vous appartiennent.",
      "L'offre s'arrête dès que les 15 places sont prises, et au plus tard le 15 octobre 2026. Ensuite, la V3 passe en abonnement : 27 €, 47 € ou 97 € par mois.",
    ],
    closing: `À très vite dans l'atelier,<br>${SIGN}`,
    ps: "PS : si vous avez une question avant de vous décider, répondez simplement à cet email, je vous lis.",
  },
  {
    n: 2, emailId: "offre-lancement-47-e2", date: "2026-10-05",
    subject: (c) => c.prenom ? `${c.prenom}, avez-vous vu mon message ?` : "Avez-vous vu mon message ?",
    preheader: "L'accès à vie à 47 €, en deux lignes.",
    paras: (c) => [
      "Vendredi je vous ai écrit pour vous annoncer l'ouverture d'EbookStudio V3 et une offre de lancement.",
      "Au cas où mon message vous aurait échappé, la voici en deux lignes : l'accès à vie au niveau Édition pour 47 €, payés une seule fois, sans abonnement.",
      `Il reste ${c.places} sur 15, et l'offre s'arrête au plus tard le 15 octobre. Ensuite, la V3 passe en abonnement mensuel.`,
    ],
    closing: SIGN,
  },
  {
    n: 3, emailId: "offre-lancement-47-e3", date: "2026-10-11",
    subject: () => "De l'idée au livre publié : ce que vous obtenez",
    preheader: "Cinq étapes, et c'est vous qui décidez.",
    paras: (c) => [
      "Beaucoup d'auteurs me disent la même chose : « j'ai une idée, mais je ne sais pas par où commencer ». EbookStudio V3 est fait pour ça.",
      "Vous avancez étape par étape :<br>1. vous précisez votre sujet et votre lecteur ;<br>2. vous construisez votre sommaire ;<br>3. vous rédigez chapitre par chapitre ;<br>4. vous corrigez votre manuscrit ;<br>5. vous préparez la couverture, la mise en page et la fiche Amazon KDP.",
      "À chaque étape, c'est vous qui décidez, et vos livres vous appartiennent.",
      `L'accès à vie est à 47 € une seule fois jusqu'au 15 octobre. Il reste ${c.places}.`,
    ],
    closing: SIGN,
  },
  {
    n: 4, emailId: "offre-lancement-47-e4", date: "2026-10-12",
    subject: () => "47 € une fois, ou 47 € chaque mois",
    preheader: "Un calcul simple avant le 15 octobre.",
    paras: (c) => [
      "Un calcul simple. Jusqu'au 15 octobre, le niveau Édition d'EbookStudio V3 coûte 47 €, payés une seule fois, pour un accès à vie.",
      "À partir du 16 octobre, ce même niveau coûtera 47 € par mois. Autrement dit, ce que vous payez aujourd'hui une fois, il faudra le payer chaque mois ensuite.",
      `Il reste ${c.places} sur 15.`,
    ],
    closing: SIGN,
  },
  {
    n: 5, emailId: "offre-lancement-47-e5", date: "2026-10-13",
    subject: () => "« Je n'ai pas d'idée de livre » (et autres questions)",
    preheader: "Les questions que je reçois le plus souvent.",
    paras: (c) => [
      "Voici les questions que je reçois le plus souvent.",
      "<b>« Je n'ai pas d'idée de livre. »</b> L'atelier commence justement par là : vous donnez vos informations et il vous propose plusieurs sujets à choisir ou à ajuster.",
      "<b>« Je ne suis pas à l'aise avec la technique. »</b> Rien à installer : votre navigateur suffit, et chaque écran vous dit quoi faire.",
      "<b>« Je n'ai pas le temps. »</b> Vous avancez par sessions courtes et vous retrouvez votre travail là où vous l'avez laissé.",
      "<b>« Mon livre m'appartient-il ? »</b> Entièrement : vous publiez sous votre nom, sur votre compte Amazon KDP.",
      `L'offre à 47 € une seule fois se termine le 15 octobre. Il reste ${c.places}.`,
    ],
    closing: SIGN,
    ps: "PS : une autre question ? Répondez à cet email, je vous lis.",
  },
  {
    n: 6, emailId: "offre-lancement-47-e6", date: "2026-10-14",
    subject: () => "Dernier jour demain pour l'accès à vie à 47 €",
    preheader: "L'offre se termine jeudi 15 octobre à minuit.",
    paras: (c) => [
      `L'offre de lancement d'EbookStudio V3 se termine demain soir, jeudi 15 octobre à minuit. Il reste ${c.places} sur 15.`,
      "Après, l'accès à vie ne sera plus proposé : la V3 passera en abonnement, à 27 €, 47 € ou 97 € par mois.",
      "Si vous hésitiez, c'est le moment de regarder.",
    ],
    closing: SIGN,
  },
  {
    n: 7, emailId: "offre-lancement-47-e7", date: "2026-10-15",
    subject: () => "Ce soir minuit : fin de l'accès à vie à 47 €",
    preheader: "Mon dernier message à ce sujet.",
    paras: (c) => [
      "C'est mon dernier message à ce sujet.",
      "Ce soir à minuit, l'offre de lancement s'arrête : accès à vie au niveau Édition d'EbookStudio V3, 47 € payés une seule fois, sans abonnement.",
      `Il reste ${c.places}. Demain, ce sera uniquement l'abonnement mensuel.`,
    ],
    closing: `Merci de m'avoir lu ces derniers jours,<br>${SIGN}`,
  },
];

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

function buildHtml(step: Step, email: string, ctx: Ctx, baseUrl: string): string {
  const e = encodeURIComponent(email);
  const fn = `${baseUrl}/functions/v1`;
  const s = 46 + step.n; // 47 = email 1 (inchangé), 48..53 = emails 2..7
  const click = `${fn}/track-email-click?e=${e}&s=${s}&t=${step.emailId}&u=${encodeURIComponent(CTA_URL)}`;
  const pixel = `${fn}/track-email-open?e=${e}&s=${s}&t=${step.emailId}`;
  const unsub = `${fn}/unsubscribe?email=${e}`;
  const hello = ctx.prenom ? `Bonjour ${esc(ctx.prenom)},` : "Bonjour,";
  const p = (t: string) => `<p style="margin:0 0 16px;line-height:1.65">${t}</p>`;
  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;background:#FAFAFA">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${step.preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAFA;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;font-family:Georgia,'Times New Roman',serif;color:#1f2937">
<tr><td style="padding:26px;font-size:16px">
${p(hello)}
${step.paras(ctx).map(p).join("\n")}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0 22px"><tr>
<td style="background:#c2410c;border-radius:8px"><a href="${click}" style="display:inline-block;padding:15px 28px;color:#ffffff;text-decoration:none;font:700 16px Arial,Helvetica,sans-serif">${CTA}</a></td>
</tr></table>
${p(step.closing)}
${step.ps ? `<p style="margin:0;font-size:14px;color:#555">${step.ps}</p>` : ""}
</td></tr></table>
<p style="font-size:11px;color:#999;text-align:center;margin:16px 0 0">Vous recevez cet email car vous avez demandé à découvrir EbookStudio. <a href="${unsub}" style="color:#999">Se désinscrire</a></p>
<img src="${pixel}" width="1" height="1" alt="" style="display:block;border:0" />
</td></tr></table></body></html>`;
}

const parisDate = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

// deno-lint-ignore no-explicit-any
async function sentEmails(db: any, emailId: string): Promise<Set<string>> {
  const { data } = await db.from("offre_lancement_sends").select("email").eq("email_id", emailId).eq("status", "sent").limit(20000);
  return new Set((data ?? []).map((r: { email: string }) => String(r.email).toLowerCase()));
}

// deno-lint-ignore no-explicit-any
async function buildPending(db: any, step: Step) {
  const { data: prospects, error } = await db.from("sales_prospects")
    .select("email, first_name").eq("segment_lancement", "actif").eq("unsubscribed", false).neq("status", "bounced").limit(20000);
  if (error) throw new Error(error.message);
  const already = await sentEmails(db, step.emailId);
  let required: Set<string> | null = null;
  const excluded = new Set<string>();
  if (step.n > 1) {
    required = await sentEmails(db, STEPS[0].emailId);
    const { data: buyers } = await db.from("v3_installment_orders").select("email")
      .eq("plan", "v3_edition_lifetime").eq("environment", "live").in("status", ["active", "completed", "paid"]).limit(20000);
    const { data: subs } = await db.from("subscribers").select("email").limit(20000);
    for (const r of [...(buyers ?? []), ...(subs ?? [])]) excluded.add(String(r.email ?? "").trim().toLowerCase());
  }
  const seen = new Set<string>();
  const pending: { email: string; first_name: string | null }[] = [];
  let excludedCount = 0;
  for (const r of prospects ?? []) {
    const e = String(r.email ?? "").trim().toLowerCase();
    if (!EMAIL_RE.test(e) || seen.has(e) || already.has(e)) continue;
    seen.add(e);
    if (required && !required.has(e)) continue;
    if (excluded.has(e)) { excludedCount++; continue; }
    const n = String(r.first_name ?? "").trim();
    pending.push({ email: e, first_name: n || null });
  }
  return { pending, alreadySent: already.size, excludedCount };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const baseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const db = createClient(baseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const body = await req.json().catch(() => ({} as Record<string, unknown>));

    const { data: cronSecret } = await db.from("app_secrets").select("value").eq("key", "cron_secret").maybeSingle();
    const isCron = !!cronSecret?.value && req.headers.get("x-cron-secret") === cronSecret.value;

    let adminEmail = "";
    if (!isCron) {
      const userClient = createClient(baseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
        global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
      });
      const { data: u } = await userClient.auth.getUser();
      if (!u.user) return respond({ error: "Non connecté" }, 401);
      const { data: isAdmin } = await userClient.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
      if (isAdmin !== true) return respond({ error: "Réservé aux administrateurs" }, 403);
      adminEmail = (u.user.email ?? "").toLowerCase();
    }

    const { data: placesData } = await db.rpc("lancement_places_restantes", { _env: "live" });
    const places = typeof placesData === "number" ? placesData : 0;
    const { data: pauseRow } = await db.from("launch_settings").select("value").eq("key", PAUSE_KEY).maybeSingle();
    const paused = (pauseRow?.value as { paused?: boolean } | null)?.paused === true;
    const closed = Date.now() > new Date(FIN_ISO).getTime() || places <= 0;

    const mode = isCron ? "cron" : String(body.mode ?? "preview");
    const stepNum = Number(body.step ?? 1);
    const step = STEPS.find((s) => s.n === stepNum) ?? STEPS[0];

    if (mode === "test") {
      if (!EMAIL_RE.test(adminEmail)) return respond({ error: "Adresse admin introuvable" }, 400);
      const ctx = { prenom: "Georges", places: placesLabel(Math.max(places, 0)) };
      const res = await sendResendEmailThrottled({
        from: FROM_CAMPAIGN, to: adminEmail, reply_to: REPLY_TO,
        subject: `[TEST] ${step.subject(ctx)}`,
        html: buildHtml(step, "test@ebookstudio.local", ctx, baseUrl),
      });
      return res.ok ? respond({ success: true, to: adminEmail, step: step.n }) : respond({ error: res.detail || "Envoi refusé" }, 502);
    }

    if (mode === "preview") {
      const today = parisDate();
      const steps = [];
      for (const s of STEPS) {
        const { count } = await db.from("offre_lancement_sends").select("id", { count: "exact", head: true })
          .eq("email_id", s.emailId).eq("status", "sent");
        const status = s.n === 1 ? ((count ?? 0) > 0 ? "envoyé" : "manuel")
          : closed ? ((count ?? 0) > 0 ? "envoyé" : "annulé (offre fermée)")
          : s.date! < today ? ((count ?? 0) > 0 ? "envoyé" : "non envoyé")
          : s.date === today ? ((count ?? 0) > 0 ? "envoyé" : "aujourd'hui")
          : paused ? "en pause" : "planifié";
        steps.push({ n: s.n, date: s.date, subject: s.subject({ prenom: "{{prenom}}", places: "" }), sent: count ?? 0, status });
      }
      const p1 = await buildPending(db, STEPS[0]);
      return respond({ totalPending: p1.pending.length, alreadySent: p1.alreadySent, trancheSize: TRANCHE, paused, places, closed, steps });
    }

    if (mode === "dry_run") {
      const r = await buildPending(db, step);
      return respond({ step: step.n, recipients: r.pending.length, alreadySent: r.alreadySent, excludedBuyers: r.excludedCount, places, paused, closed, wouldSend: !paused && !closed });
    }

    // Envoi : manuel (email 1 uniquement) ou automatique (emails 2 à 7).
    let target: Step;
    if (mode === "cron") {
      const today = parisDate();
      const t = STEPS.find((s) => s.date === today);
      if (!t) return respond({ skipped: "aucune étape prévue aujourd'hui", today });
      target = t;
      if (paused) return respond({ skipped: "séquence en pause", step: t.n });
      if (closed) return respond({ skipped: "offre fermée (0 place ou échéance)", step: t.n });
    } else if (mode === "send") {
      target = STEPS[0];
    } else {
      return respond({ error: "Mode inconnu" }, 400);
    }

    const { pending } = await buildPending(db, target);
    const batch = pending.slice(0, TRANCHE);
    const ctxPlaces = placesLabel(Math.max(places, 0));
    let sentCount = 0, failedCount = 0, quotaStopped = false;
    for (const person of batch) {
      const ctx = { prenom: person.first_name, places: ctxPlaces };
      const res = await sendResendEmailThrottled({
        from: FROM_CAMPAIGN, to: person.email, reply_to: REPLY_TO,
        subject: target.subject(ctx),
        html: buildHtml(target, person.email, ctx, baseUrl),
      });
      if (res.ok) sentCount++; else failedCount++;
      await db.from("offre_lancement_sends").upsert({
        email: person.email, email_id: target.emailId, batch_index: target.n,
        status: res.ok ? "sent" : "error",
        error: res.ok ? null : String(res.detail || `status ${res.status}`).slice(0, 500),
        sent_at: res.ok ? new Date().toISOString() : null,
      }, { onConflict: "email,email_id" });
      if (res.quotaExhausted || isQuotaExhausted()) { quotaStopped = true; break; }
    }
    return respond({ success: true, step: target.n, sentCount, failedCount, remaining: Math.max(0, pending.length - sentCount), quotaStopped });
  } catch (err) {
    console.error("send-offre-lancement error", err);
    return respond({ error: (err as Error).message }, 500);
  }
});

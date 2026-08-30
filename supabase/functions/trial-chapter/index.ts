// Essai gratuit du lancement V3 : génère le chapitre 1 d'un livre à partir
// d'une simple idée, puis le livre par email quand le visiteur le demande.
//
// Actions :
//   { action: "generate", idea, audience, tone, language }
//   { action: "claim", trialId, email }
import { createClient } from "npm:@supabase/supabase-js@2";
import { FROM_CAMPAIGN, REPLY_TO, DIRECT_EMAIL } from "../_shared/emailIdentity.ts";
import { EMAIL_SENDING_ENABLED } from "../_shared/emailSendingGuard.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

const admin = () =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

const SITE = "https://ebookstudio.fr";

/** 3 essais / heure / IP — barrière anti-abus côté serveur. */
const rate = new Map<string, { count: number; reset: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = rate.get(ip);
  if (!rec || rec.reset < now) {
    rate.set(ip, { count: 1, reset: now + 60 * 60 * 1000 });
    return false;
  }
  if (rec.count >= 3) return true;
  rec.count++;
  return false;
}

async function callAI(messages: Array<{ role: string; content: string }>, maxTokens = 4000) {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) throw new Error("Moteur IA non configuré");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      max_tokens: maxTokens,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("AI gateway error", res.status, text);
    if (res.status === 429) throw new Error("Trop de demandes en même temps, réessayez dans une minute.");
    throw new Error("La génération a échoué, réessayez.");
  }
  const data = await res.json();
  return String(data?.choices?.[0]?.message?.content ?? "");
}

function extractJson(raw: string): any {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Réponse IA illisible");
  return JSON.parse(cleaned.slice(start, end + 1));
}

const LANGUAGES: Record<string, string> = {
  fr: "français",
  en: "anglais",
  es: "espagnol",
  de: "allemand",
  it: "italien",
  pt: "portugais",
  nl: "néerlandais",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée" }, 405);

  try {
    const body = await req.json();
    const action = String(body?.action ?? "generate");
    const supabase = admin();

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const trialOpen = async () => {
      const { data: setting } = await supabase
        .from("launch_settings")
        .select("value")
        .eq("key", "free_trial_open")
        .maybeSingle();
      return !(setting && (setting.value as any)?.enabled === false);
    };

    // ----------------------------------------------------------------- outline
    // Étape 1 (publique, rapide) : titre + sous-titre + sommaire complet.
    if (action === "outline") {
      if (!(await trialOpen())) return json({ error: "L'essai gratuit est momentanément fermé." }, 403);

      const idea = String(body?.idea ?? "").trim();
      if (idea.length < 10) return json({ error: "Décrivez votre idée en une phrase au minimum." }, 400);
      if (idea.length > 2000) return json({ error: "Idée trop longue (2 000 caractères max)." }, 400);
      if (rateLimited(clientIp)) {
        return json({ error: "Vous avez déjà lancé 3 essais dans l'heure. Revenez plus tard." }, 429);
      }

      const audience = String(body?.audience ?? "").trim().slice(0, 300);
      const tone = String(body?.tone ?? "").trim().slice(0, 200);
      const langCode = LANGUAGES[String(body?.language ?? "fr")] ? String(body.language) : "fr";
      const langName = LANGUAGES[langCode];

      const raw = await callAI([
        {
          role: "system",
          content:
            `Tu es un directeur éditorial professionnel. Tu écris intégralement en ${langName}, ` +
            `sans un seul mot de latin, sans pseudo-langue, sans mot inventé ni mot étranger décoratif. ` +
            `Réponds uniquement par un objet JSON valide, sans texte autour.`,
        },
        {
          role: "user",
          content:
            `Idée du livre : ${idea}\n` +
            (audience ? `Public visé : ${audience}\n` : "") +
            (tone ? `Ton souhaité : ${tone}\n` : "") +
            `\nProduis un JSON avec exactement ces clés :\n` +
            `{ "title": "titre commercial court", "subtitle": "sous-titre qui explique la promesse", ` +
            `"outline": [{"title":"Chapitre 1 — …","summary":"2 phrases"}, … exactement 12 chapitres] }`,
        },
      ], 2500);

      const parsed = extractJson(raw);
      const outline = Array.isArray(parsed.outline)
        ? parsed.outline.slice(0, 20).map((c: any, i: number) => ({
            title: String(c?.title ?? `Chapitre ${i + 1}`).slice(0, 200),
            summary: String(c?.summary ?? "").slice(0, 600),
          }))
        : [];
      if (outline.length < 3) throw new Error("Sommaire incomplet, relancez la génération.");

      const { data: inserted, error } = await supabase
        .from("trial_chapters")
        .insert({
          book_idea: idea,
          audience: audience || null,
          tone: tone || null,
          language: langCode,
          proposed_title: String(parsed.title ?? "").slice(0, 300) || null,
          proposed_subtitle: String(parsed.subtitle ?? "").slice(0, 400) || null,
          outline,
          status: "outline",
          ip: clientIp,
          user_agent: req.headers.get("user-agent")?.slice(0, 400) ?? null,
          utm_source: String(body?.utmSource ?? "").slice(0, 120) || null,
          utm_campaign: String(body?.utmCampaign ?? "").slice(0, 120) || null,
        })
        .select("id")
        .single();
      if (error) throw error;

      return json({
        trialId: inserted.id,
        title: parsed.title ?? "",
        subtitle: parsed.subtitle ?? "",
        outline,
      });
    }

    // ----------------------------------------------------------------- chapter
    // Étape 2 : chapitre 1 écrit, mais seul l'extrait libre revient au client.
    if (action === "chapter") {
      const trialId = String(body?.trialId ?? "");
      if (!/^[0-9a-f-]{36}$/.test(trialId)) return json({ error: "Essai introuvable." }, 400);

      const { data: trial, error: readErr } = await supabase
        .from("trial_chapters")
        .select("id, book_idea, audience, tone, language, proposed_title, outline, chapter_text, chapter_title, word_count")
        .eq("id", trialId)
        .maybeSingle();
      if (readErr) throw readErr;
      if (!trial) return json({ error: "Essai introuvable." }, 404);

      const excerptOf = (text: string) => {
        const parts = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
        return { excerpt: parts.slice(0, 2), totalParagraphs: parts.length };
      };

      if (trial.chapter_text && String(trial.chapter_text).length > 400) {
        const { excerpt, totalParagraphs } = excerptOf(String(trial.chapter_text));
        return json({
          chapterTitle: trial.chapter_title ?? "",
          excerpt,
          totalParagraphs,
          wordCount: trial.word_count ?? 0,
        });
      }

      const langCode = LANGUAGES[String(trial.language ?? "fr")] ? String(trial.language) : "fr";
      const langName = LANGUAGES[langCode];
      const firstChapter = (trial.outline as any[])?.[0];

      const raw = await callAI([
        {
          role: "system",
          content:
            `Tu es un auteur professionnel publié. Tu écris intégralement en ${langName}, ` +
            `sans un seul mot de latin, sans pseudo-langue, sans mot inventé ni mot étranger décoratif. ` +
            `Style d'une vraie maison d'édition : phrases complètes, ponctuation soignée, ` +
            `aucune liste à puces, aucun titre en markdown. Chaque paragraphe se termine par ` +
            `une phrase complète suivie d'un point.`,
        },
        {
          role: "user",
          content:
            `Livre : ${trial.proposed_title ?? ""}\n` +
            `Idée : ${trial.book_idea}\n` +
            (trial.audience ? `Public : ${trial.audience}\n` : "") +
            (trial.tone ? `Ton : ${trial.tone}\n` : "") +
            (firstChapter
              ? `Chapitre 1 prévu : ${firstChapter.title} — ${firstChapter.summary ?? ""}\n`
              : "") +
            `\nÉcris le chapitre 1 complet, entre 1200 et 1800 mots.\n` +
            `Format de réponse, en texte brut et rien d'autre :\n` +
            `TITRE: le titre du chapitre 1\n` +
            `(une ligne vide, puis le texte intégral du chapitre, paragraphes séparés par une ligne vide)\n` +
            `Ouverture forte, développement, fin de chapitre qui donne envie de lire le suivant.`,
        },
      ], 8000);

      const cleanedRaw = raw.replace(/```[a-z]*|```/g, "").trim();
      const titleMatch = cleanedRaw.match(/^\s*TITRE\s*:\s*(.+)$/im);
      const chapterTitle = (titleMatch?.[1] ?? firstChapter?.title ?? "Chapitre 1").trim();
      const chapter = cleanedRaw
        .replace(/^\s*TITRE\s*:\s*.+$/im, "")
        .trim();
      if (chapter.length < 400) throw new Error("Chapitre incomplet, relancez la génération.");
      const wordCount = chapter.split(/\s+/).filter(Boolean).length;


      await supabase
        .from("trial_chapters")
        .update({
          chapter_title: String(parsed.chapterTitle ?? "").slice(0, 300) || null,
          chapter_text: chapter,
          word_count: wordCount,
          status: "generated",
        })
        .eq("id", trialId);

      const { excerpt, totalParagraphs } = excerptOf(chapter);
      return json({
        chapterTitle: parsed.chapterTitle ?? "",
        excerpt,
        totalParagraphs,
        wordCount,
      });
    }

    // ---------------------------------------------------------------- generate

    if (action === "generate") {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown";

      const { data: setting } = await supabase
        .from("launch_settings")
        .select("value")
        .eq("key", "free_trial_open")
        .maybeSingle();
      if (setting && (setting.value as any)?.enabled === false) {
        return json({ error: "L'essai gratuit est momentanément fermé." }, 403);
      }

      const idea = String(body?.idea ?? "").trim();
      if (idea.length < 10) return json({ error: "Décrivez votre idée en une phrase au minimum." }, 400);
      if (idea.length > 2000) return json({ error: "Idée trop longue (2 000 caractères max)." }, 400);

      if (rateLimited(ip)) {
        return json(
          { error: "Vous avez déjà lancé 3 essais dans l'heure. Créez votre compte pour continuer." },
          429,
        );
      }

      const audience = String(body?.audience ?? "").trim().slice(0, 300);
      const tone = String(body?.tone ?? "").trim().slice(0, 200);
      const langCode = LANGUAGES[String(body?.language ?? "fr")] ? String(body.language) : "fr";
      const langName = LANGUAGES[langCode];

      const raw = await callAI([
        {
          role: "system",
          content:
            `Tu es un directeur éditorial professionnel. Tu écris intégralement en ${langName}, ` +
            `sans un seul mot de latin, sans pseudo-langue, sans mot inventé ni mot étranger décoratif. ` +
            `Ton style est celui d'une vraie maison d'édition : phrases complètes, ponctuation soignée, ` +
            `aucune liste à puces dans le corps du chapitre, aucun titre en markdown. ` +
            `Chaque paragraphe se termine par une phrase complète suivie d'un point. ` +
            `Réponds uniquement par un objet JSON valide, sans texte autour.`,
        },
        {
          role: "user",
          content:
            `Idée du livre : ${idea}\n` +
            (audience ? `Public visé : ${audience}\n` : "") +
            (tone ? `Ton souhaité : ${tone}\n` : "") +
            `\nProduis un JSON avec exactement ces clés :\n` +
            `{\n` +
            `  "title": "titre commercial court",\n` +
            `  "subtitle": "sous-titre qui explique la promesse",\n` +
            `  "outline": [{"title":"Chapitre 1 — …","summary":"2 phrases"} , … 12 chapitres],\n` +
            `  "chapterTitle": "titre du chapitre 1",\n` +
            `  "chapter": "le texte intégral du chapitre 1, entre 1200 et 1800 mots, paragraphes séparés par \\n\\n"\n` +
            `}\n` +
            `Le chapitre 1 doit être publiable tel quel : ouverture forte, développement, ` +
            `fin de chapitre qui donne envie de lire le suivant.`,
        },
      ], 8000);

      const parsed = extractJson(raw);
      const chapter = String(parsed.chapter ?? "").trim();
      if (chapter.length < 400) throw new Error("Chapitre incomplet, relancez la génération.");

      const outline = Array.isArray(parsed.outline)
        ? parsed.outline
            .slice(0, 20)
            .map((c: any, i: number) => ({
              title: String(c?.title ?? `Chapitre ${i + 1}`).slice(0, 200),
              summary: String(c?.summary ?? "").slice(0, 600),
            }))
        : [];

      const wordCount = chapter.split(/\s+/).filter(Boolean).length;

      const { data: inserted, error } = await supabase
        .from("trial_chapters")
        .insert({
          book_idea: idea,
          audience: audience || null,
          tone: tone || null,
          language: langCode,
          proposed_title: String(parsed.title ?? "").slice(0, 300) || null,
          proposed_subtitle: String(parsed.subtitle ?? "").slice(0, 400) || null,
          outline,
          chapter_title: String(parsed.chapterTitle ?? "").slice(0, 300) || null,
          chapter_text: chapter,
          word_count: wordCount,
          status: "generated",
          ip,
          user_agent: req.headers.get("user-agent")?.slice(0, 400) ?? null,
          utm_source: String(body?.utmSource ?? "").slice(0, 120) || null,
          utm_campaign: String(body?.utmCampaign ?? "").slice(0, 120) || null,
        })
        .select("id")
        .single();
      if (error) throw error;

      return json({
        trialId: inserted.id,
        title: parsed.title ?? "",
        subtitle: parsed.subtitle ?? "",
        outline,
        chapterTitle: parsed.chapterTitle ?? "",
        chapter,
        wordCount,
      });
    }

    // ------------------------------------------------------------------- claim
    if (action === "claim") {
      const trialId = String(body?.trialId ?? "");
      const email = String(body?.email ?? "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return json({ error: "Email invalide." }, 400);
      }
      if (!/^[0-9a-f-]{36}$/.test(trialId)) return json({ error: "Essai introuvable." }, 400);

      const { data: trial, error: readErr } = await supabase
        .from("trial_chapters")
        .select("id, proposed_title, chapter_title, chapter_text, word_count")
        .eq("id", trialId)
        .maybeSingle();
      if (readErr) throw readErr;
      if (!trial) return json({ error: "Essai introuvable." }, 404);

      await supabase
        .from("trial_chapters")
        .update({ email, status: "delivered", delivered_at: new Date().toISOString() })
        .eq("id", trialId);

      // Prospect enregistré pour la séquence de lancement
      await supabase
        .from("funnel_leads")
        .upsert(
          { email, lead_magnet: "essai-chapitre-1", landing_url: `${SITE}/essai` },
          { onConflict: "email" },
        );

      let emailSent = false;
      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (EMAIL_SENDING_ENABLED && resendKey) {
        const title = trial.proposed_title || "Votre livre";
        const paragraphs = String(trial.chapter_text ?? "")
          .split(/\n{2,}/)
          .map((p) => `<p style="margin:0 0 16px 0;">${p.replace(/</g, "&lt;")}</p>`)
          .join("");
        const html = `<!DOCTYPE html><html lang="fr"><body style="margin:0;background:#f6f6f6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f6f6;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:10px;">
<tr><td style="padding:28px 32px 8px;font:14px Arial,Helvetica,sans-serif;color:#888;">EbookStudio</td></tr>
<tr><td style="padding:0 32px 32px;font:17px/1.7 Georgia,'Times New Roman',serif;color:#1a1a1a;">
<h1 style="font:bold 24px Georgia,serif;color:#064e3b;margin:0 0 8px;">${title.replace(/</g, "&lt;")}</h1>
<p style="margin:0 0 24px;color:#555;font:14px Arial,sans-serif;">${trial.chapter_title ? String(trial.chapter_title).replace(/</g, "&lt;") : "Chapitre 1"} — ${trial.word_count} mots, écrit pour vous.</p>
${paragraphs}
<table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="margin:28px auto;">
<tr><td bgcolor="#064e3b" style="border-radius:8px;"><a href="${SITE}/commander?src=essai-email" style="display:inline-block;padding:15px 30px;font:bold 16px Arial,sans-serif;color:#ffffff;text-decoration:none;">Écrire la suite de mon livre</a></td></tr></table>
<p style="margin:0 0 12px;">L'accès à vie est à 47 € jusqu'au 30 septembre 2026 : paiement unique, aucun abonnement.</p>

<p style="margin:24px 0 0;">Bien à vous,<br><strong>Georges Boubet</strong><br>EbookStudio — ${DIRECT_EMAIL}</p>
</td></tr></table></td></tr></table></body></html>`;

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: FROM_CAMPAIGN,
            to: [email],
            reply_to: REPLY_TO,
            subject: `Votre chapitre 1 : ${title}`,
            html,
          }),
        });
        emailSent = res.ok;
        if (!res.ok) console.error("Resend error", await res.text());
      }

      return json({
        ok: true,
        emailSent,
        chapterTitle: trial.chapter_title ?? "",
        chapter: trial.chapter_text ?? "",
        wordCount: trial.word_count ?? 0,
      });
    }

    return json({ error: "Action inconnue" }, 400);
  } catch (e) {
    console.error("trial-chapter error", e);
    return json({ error: (e as Error).message ?? "Erreur inconnue" }, 400);
  }
});

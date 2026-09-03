// Cover Studio KDP Pro — génération de l'illustration de couverture (étape 3).
//
// Financement :
//   1. tant qu'il reste des générations incluses → clé OpenAI serveur d'EbookStudio ;
//   2. ensuite → uniquement la clé personnelle chiffrée de l'abonné (BYOK) ;
//   3. sinon → refus explicite (422). Aucun repli payant financé par EbookStudio.
//
// Aucune passerelle Lovable, aucun crédit Lovable : appel direct à api.openai.com.
// Un crédit inclus n'est définitivement consommé que si l'image est générée,
// enregistrée dans le bucket privé `covers` et rattachée au projet.

import { decode, Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";
import {
  authenticate,
  corsHeaders,
  hasCoverProRight,
  json,
  loadUserOpenAIKey,
  scrub,
  serviceClient,
} from "../_shared/coverPro.ts";

const MODEL = "gpt-image-2";
const SIZE = "1024x1536"; // plus grand format portrait accepté par l'API images
const QUALITY = "high";

interface Brief {
  genre?: string;
  summary?: string;
  mood?: string;
  scene?: string;
  palette?: string;
  style?: string;
  include?: string;
  avoid?: string;
  bookTitle?: string;
}

/** Construit le prompt : illustration éditoriale STRICTEMENT sans aucun texte. */
function buildPrompt(b: Brief): string {
  const lines = [
    "Illustration de couverture de livre professionnelle, qualité édition, cadrage portrait vertical.",
    b.genre ? `Genre du livre : ${b.genre}.` : "",
    b.summary ? `Contexte / résumé : ${b.summary}.` : "",
    b.mood ? `Ambiance recherchée : ${b.mood}.` : "",
    b.scene ? `Scène principale : ${b.scene}.` : "",
    b.palette ? `Palette de couleurs : ${b.palette}.` : "",
    b.style ? `Style graphique : ${b.style}.` : "",
    b.include ? `Éléments souhaités : ${b.include}.` : "",
    b.avoid ? `Éléments à éviter absolument : ${b.avoid}.` : "",
    b.bookTitle
      ? `Le livre s'intitule « ${b.bookTitle} » : cette information sert uniquement à comprendre le sujet et ne doit JAMAIS apparaître dans l'image.`
      : "",
    "INTERDICTIONS ABSOLUES : aucun titre, aucun sous-titre, aucun nom d'auteur, aucune lettre, aucun mot, aucun chiffre, aucun logo, aucun filigrane, aucun code-barres, aucun ISBN, aucun faux caractère typographique, aucune signature.",
    "Composition : image purement visuelle, avec des zones calmes en haut et en bas permettant d'ajouter plus tard le titre, le sous-titre et le nom de l'auteur dans des calques séparés.",
  ];
  return lines.filter(Boolean).join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const service = serviceClient();
  let reserved = false;
  let userId = "";
  let projectId: string | null = null;

  try {
    const user = await authenticate(req);
    if (!user) return json({ error: "Non authentifié" }, 401);
    userId = user.id;

    const right = await hasCoverProRight(service, user);
    if (!right.granted) {
      return json({ error: "Cover Studio KDP Pro n'est pas débloqué sur ce compte." }, 403);
    }

    const body = await req.json().catch(() => ({}));
    projectId = typeof body?.projectId === "string" ? body.projectId : null;
    if (!projectId) return json({ error: "Projet de couverture requis." }, 400);

    // Le projet doit appartenir à l'utilisateur (vérification serveur, pas seulement RLS).
    const { data: project } = await service
      .from("cover_projects")
      .select("id,user_id,book_title")
      .eq("id", projectId)
      .maybeSingle();
    if (!project || project.user_id !== user.id) {
      return json({ error: "Projet introuvable ou non autorisé." }, 403);
    }

    const brief: Brief = {
      genre: body?.genre, summary: body?.summary, mood: body?.mood, scene: body?.scene,
      palette: body?.palette, style: body?.style, include: body?.include, avoid: body?.avoid,
      bookTitle: project.book_title ?? undefined,
    };
    const prompt = buildPrompt(brief);

    // --- Choix du financement ---------------------------------------------
    const { data: creditRow } = await service
      .from("cover_pro_credits")
      .select("granted,used")
      .eq("user_id", user.id)
      .maybeSingle();
    const remaining = Math.max(0, (creditRow?.granted ?? 0) - (creditRow?.used ?? 0));

    let apiKey: string | null = null;
    let funding: "ebookstudio" | "byok" = "byok";

    if (remaining > 0) {
      // Réservation atomique : deux appels simultanés ne peuvent pas prendre le même crédit.
      const { data: ok } = await service.rpc("cover_pro_reserve_credit", {
        _user_id: user.id,
        _project_id: projectId,
      });
      if (ok === true) {
        reserved = true;
        funding = "ebookstudio";
        apiKey = Deno.env.get("OPENAI_API_KEY") ?? null;
        if (!apiKey) {
          await service.rpc("cover_pro_restore_credit", {
            _user_id: user.id, _project_id: projectId, _detail: "clé serveur indisponible",
          });
          reserved = false;
          return json({ error: "Génération incluse momentanément indisponible." }, 503);
        }
      }
    }

    if (!apiKey) {
      // Plus de générations incluses : la clé d'EbookStudio est totalement bloquée.
      funding = "byok";
      apiKey = await loadUserOpenAIKey(service, user.id);
      if (!apiKey) {
        await service.from("cover_pro_credit_events").insert({
          user_id: user.id, project_id: projectId, event_type: "denied",
          funding: "byok", detail: "aucune clé personnelle enregistrée",
        });
        return json({
          error:
            "Vos 3 générations incluses sont utilisées. Connectez votre propre clé API OpenAI pour continuer.",
          needsKey: true,
        }, 422);
      }
    }

    // --- Appel direct à OpenAI (jamais la passerelle Lovable) --------------
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, prompt, size: SIZE, quality: QUALITY, n: 1 }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(scrub(`OpenAI ${res.status} : ${text.slice(0, 300)}`));
    }

    const payload = await res.json();
    const b64 = payload?.data?.[0]?.b64_json;
    if (!b64) throw new Error("Aucune image renvoyée par le fournisseur.");
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

    // Dimensions réellement obtenues + miniature (aucun agrandissement artificiel).
    const decoded = await decode(bytes);
    const width = decoded.width;
    const height = decoded.height;
    let thumbBytes: Uint8Array | null = null;
    if (decoded instanceof Image) {
      const thumb = decoded.clone().resize(400, Image.RESIZE_AUTO);
      thumbBytes = await thumb.encodeJPEG(82);
    }

    // --- Enregistrement privé : covers/<user_id>/<project_id>/ ------------
    const stamp = Date.now();
    const base = `${user.id}/${projectId}`;
    const imagePath = `${base}/illustration-${stamp}.png`;
    const thumbPath = `${base}/thumbnail-${stamp}.jpg`;

    const up1 = await service.storage.from("covers").upload(imagePath, bytes, {
      contentType: "image/png", upsert: true,
    });
    if (up1.error) throw new Error(`Enregistrement de l'image impossible : ${up1.error.message}`);

    if (thumbBytes) {
      const up2 = await service.storage.from("covers").upload(thumbPath, thumbBytes, {
        contentType: "image/jpeg", upsert: true,
      });
      if (up2.error) throw new Error(`Enregistrement de la miniature impossible : ${up2.error.message}`);
    }

    const { error: updErr } = await service.from("cover_projects").update({
      illustration_path: imagePath,
      thumbnail_path: thumbBytes ? thumbPath : null,
      ai_generated: true,
      illustration_provider: "openai",
      illustration_model: MODEL,
      illustration_width: width,
      illustration_height: height,
      illustration_generated_at: new Date().toISOString(),
    }).eq("id", projectId).eq("user_id", user.id);
    if (updErr) throw new Error(`Rattachement au projet impossible : ${updErr.message}`);

    // Le crédit n'est confirmé qu'ici : image générée + stockée + rattachée.
    await service.from("cover_pro_credit_events").insert({
      user_id: user.id,
      project_id: projectId,
      event_type: funding === "ebookstudio" ? "consumed" : "byok_used",
      provider: "openai",
      model: MODEL,
      funding,
      detail: `${width}×${height}`,
    });

    const { data: after } = await service
      .from("cover_pro_credits")
      .select("granted,used")
      .eq("user_id", user.id)
      .maybeSingle();

    return json({
      ok: true,
      funding,
      provider: "openai",
      model: MODEL,
      width,
      height,
      illustrationPath: imagePath,
      thumbnailPath: thumbBytes ? thumbPath : null,
      credits: {
        granted: after?.granted ?? 0,
        used: after?.used ?? 0,
        remaining: Math.max(0, (after?.granted ?? 0) - (after?.used ?? 0)),
      },
    });
  } catch (err) {
    const message = scrub(err instanceof Error ? err.message : "Génération impossible");
    if (reserved && userId) {
      // Échec de génération ou d'enregistrement → le crédit est restauré.
      await service.rpc("cover_pro_restore_credit", {
        _user_id: userId, _project_id: projectId, _detail: message.slice(0, 300),
      });
    }
    console.error("cover-pro-generate:", message);
    return json({ error: message }, 500);
  }
});

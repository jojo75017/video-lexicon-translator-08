// Cover Studio Pro — enregistrement d'une image générée dans « Mes couvertures ».
//
// Aucun appel IA, aucun crédit consommé : on récupère l'image côté serveur
// (les URLs des moteurs ne sont pas accessibles depuis le navigateur),
// on la stocke dans le bucket privé `covers` puis on crée / met à jour
// un projet de couverture appartenant à l'utilisateur.

import { authenticate, corsHeaders, json, scrub, serviceClient } from "../_shared/coverPro.ts";

const MAX_BYTES = 15 * 1024 * 1024;

function decodeDataUrl(dataUrl: string): { bytes: Uint8Array; contentType: string } {
  const match = /^data:([^;,]+);base64,(.+)$/s.exec(dataUrl);
  if (!match) throw new Error("Image locale illisible.");
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { bytes, contentType: match[1] };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const service = serviceClient();
  try {
    const user = await authenticate(req);
    if (!user) return json({ error: "Non authentifié" }, 401);

    const body = await req.json().catch(() => ({}));
    const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : "";
    const bookTitle = typeof body?.bookTitle === "string" ? body.bookTitle.trim() : "";
    const projectName =
      (typeof body?.projectName === "string" && body.projectName.trim()) ||
      bookTitle ||
      "Couverture premium";
    const existingProjectId =
      typeof body?.projectId === "string" && body.projectId ? body.projectId : null;

    if (!imageUrl) return json({ error: "Aucune image à enregistrer." }, 400);

    let bytes: Uint8Array;
    let contentType = "image/png";

    if (imageUrl.startsWith("data:")) {
      const decoded = decodeDataUrl(imageUrl);
      bytes = decoded.bytes;
      contentType = decoded.contentType;
    } else if (/^https?:\/\//i.test(imageUrl)) {
      const res = await fetch(imageUrl);
      if (!res.ok) throw new Error("L'image n'est plus accessible chez le moteur d'images.");
      contentType = res.headers.get("content-type") || "image/png";
      bytes = new Uint8Array(await res.arrayBuffer());
    } else {
      return json({ error: "Format d'image non pris en charge." }, 400);
    }

    if (bytes.byteLength === 0) throw new Error("Image vide.");
    if (bytes.byteLength > MAX_BYTES) throw new Error("Image trop volumineuse.");

    const ext = contentType.includes("jpeg") ? "jpg" : contentType.includes("webp") ? "webp" : "png";
    const imagePath = `${user.id}/studio-pro/${crypto.randomUUID()}.${ext}`;

    const up = await service.storage.from("covers").upload(imagePath, bytes, {
      contentType,
      upsert: true,
    });
    if (up.error) throw new Error(`Enregistrement impossible : ${up.error.message}`);

    let projectId = existingProjectId;

    if (projectId) {
      const { data: project } = await service
        .from("cover_projects")
        .select("id,user_id")
        .eq("id", projectId)
        .maybeSingle();
      if (!project || project.user_id !== user.id) {
        return json({ error: "Projet introuvable ou non autorisé." }, 403);
      }
      const { error: updErr } = await service
        .from("cover_projects")
        .update({
          illustration_path: imagePath,
          ai_generated: true,
          illustration_provider: "studio-pro",
          illustration_generated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .eq("user_id", user.id);
      if (updErr) throw new Error(updErr.message);
    } else {
      const { data: inserted, error: insErr } = await service
        .from("cover_projects")
        .insert({
          user_id: user.id,
          project_name: projectName.slice(0, 120),
          book_title: bookTitle ? bookTitle.slice(0, 200) : null,
          illustration_path: imagePath,
          ai_generated: true,
          illustration_provider: "studio-pro",
          illustration_generated_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (insErr) throw new Error(insErr.message);
      projectId = inserted.id;
    }

    const signed = await service.storage.from("covers").createSignedUrl(imagePath, 60 * 60);

    return json({
      ok: true,
      projectId,
      illustrationPath: imagePath,
      signedUrl: signed.data?.signedUrl ?? null,
    });
  } catch (err) {
    const message = scrub(err instanceof Error ? err.message : "Enregistrement impossible");
    console.error("cover-studio-save-image:", message);
    return json({ error: message }, 500);
  }
});

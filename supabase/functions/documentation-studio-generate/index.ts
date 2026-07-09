import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const PAID_STATUSES = new Set(["active", "completed", "paid"]);

// Libellés des livrables (miroir du client, pour le prompt IA)
const DELIVERABLE_LABELS: Record<string, { label: string; brief: string }> = {
  brandbook: { label: "Brand Book", brief: "vision, mission, valeurs, positionnement, design system, blueprint produit" },
  "user-manual": { label: "Manuel utilisateur", brief: "guide pas à pas de chaque module et fonctionnalité, avec conseils" },
  "technical-doc": { label: "Documentation technique", brief: "architecture, intégration, référence développeur, bonnes pratiques" },
  faq: { label: "FAQ", brief: "12 à 20 questions fréquentes avec réponses claires" },
  "help-center": { label: "Centre d'aide", brief: "base de connaissances organisée par thèmes avec articles courts" },
  landing: { label: "Landing Page", brief: "page de vente orientée conversion : hero, bénéfices, preuve, CTA" },
  onepage: { label: "One Page", brief: "présentation produit condensée et percutante" },
  "media-kit": { label: "Kit Média", brief: "descriptions courte/longue, boilerplate, faits marquants, contacts presse" },
  "affiliate-kit": { label: "Kit Affiliés", brief: "arguments de vente, angles, exemples de messages pour affiliés" },
  "partner-kit": { label: "Kit Partenaires", brief: "dossier de présentation partenaires, bénéfices mutuels" },
  "product-hunt": { label: "Product Hunt", brief: "tagline, description, premier commentaire maker, FAQ lancement" },
  appsumo: { label: "AppSumo", brief: "titre deal, description, points forts, plans, FAQ" },
  "sales-deck": { label: "Présentation commerciale", brief: "deck de vente structuré section par section" },
  "pitch-deck": { label: "Pitch investisseur", brief: "problème, solution, marché, business model, traction, équipe, ask" },
  "launch-emails": { label: "Emails de lancement", brief: "séquence de 4 à 6 emails de lancement produit" },
  "video-scripts": { label: "Scripts vidéo", brief: "script démo, teaser 30s et tutoriel, avec plans" },
  linkedin: { label: "Publications LinkedIn", brief: "5 posts LinkedIn prêts à publier" },
  facebook: { label: "Publications Facebook", brief: "5 posts Facebook prêts à publier" },
  twitter: { label: "Publications X (Twitter)", brief: "3 threads / posts X prêts à publier" },
};

async function callLovableAI(system: string, user: string, maxTokens: number) {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) return { ok: false as const, status: 500, text: "LOVABLE_API_KEY missing" };
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.75,
      max_tokens: maxTokens,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error("Lovable AI error:", res.status, text.slice(0, 400));
    return { ok: false as const, status: res.status, text };
  }
  try {
    const data = JSON.parse(text);
    return { ok: true as const, text: data?.choices?.[0]?.message?.content || "" };
  } catch {
    return { ok: true as const, text };
  }
}

function aiError(status: number) {
  const s = status === 429 ? 429 : status === 402 ? 402 : 502;
  const message = s === 429
    ? "Limite IA atteinte. Réessayez dans quelques instants."
    : s === 402
      ? "Crédits IA indisponibles pour le moment."
      : "Service IA temporairement indisponible.";
  return json(s, { error: message });
}

function buildContext(p: any): string {
  const j = (v: any) => (v ? String(v) : "—");
  const modules = (p?.modules || []).map((m: any) => `- ${m.name}: ${m.description} (${m.fonction})`).join("\n") || "—";
  const features = (p?.features || []).map((f: any) => `- ${f.name}: ${f.description}${f.example ? ` — ex: ${f.example}` : ""}`).join("\n") || "—";
  const agents = (p?.agents || []).map((a: any) => `- ${a.name}: ${a.mission}`).join("\n") || "—";
  return `PRODUIT: ${j(p?.project?.name)} (v${j(p?.project?.version)})
ENTREPRISE: ${j(p?.project?.company)} — ${j(p?.project?.website)}
SLOGAN: ${j(p?.project?.slogan)}
LANGUE: ${j(p?.project?.language)}
TYPE: ${j(p?.productType)}

POSITIONNEMENT
Vision: ${j(p?.positioning?.vision)}
Mission: ${j(p?.positioning?.mission)}
Valeurs: ${j(p?.positioning?.values)}
Public: ${j(p?.positioning?.audience)}
Problème: ${j(p?.positioning?.problem)}
Promesse: ${j(p?.positioning?.promise)}
Avantages: ${j(p?.positioning?.advantages)}

MODULES
${modules}

FONCTIONNALITÉS
${features}

AGENTS IA
${agents}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json(401, { error: "Authentification requise" });
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return json(401, { error: "Session invalide" });

    const body = await req.json().catch(() => ({}));
    const project = body?.project;
    const requested: string[] = Array.isArray(body?.deliverables) ? body.deliverables : [];
    if (!project?.project?.name) return json(400, { error: "Le nom du produit est requis." });
    if (requested.length === 0) return json(400, { error: "Sélectionnez au moins un livrable." });

    // Vérification d'accès côté serveur (pack complet, pack Documentation Studio ou admin)
    let unlocked = false;
    try {
      const { data } = await supabase.rpc("get_my_v3_installment_orders");
      const paid = (data ?? []).filter((r: any) => PAID_STATUSES.has(String(r.status ?? "").toLowerCase()));
      unlocked = paid.some((r: any) => {
        const plan = String(r.plan ?? "").toLowerCase();
        return plan.startsWith("full") || plan.includes("documentation");
      });
    } catch { unlocked = false; }
    // Fallback admin : rôle via has_role (source de vérité), puis app_metadata
    if (!unlocked) {
      try {
        const { data: hasRole } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
        if (hasRole === true) unlocked = true;
      } catch { /* ignore */ }
    }
    if (!unlocked) {
      const role = String((user.app_metadata as any)?.role || (user.user_metadata as any)?.role || "").toLowerCase();
      if (role === "admin") unlocked = true;
    }

    // Démo : 1 seul livrable, version courte
    const isDemo = !unlocked;
    const toGenerate = isDemo ? requested.slice(0, 1) : requested.slice(0, 20);

    const context = buildContext(project);
    const system = "Tu es un rédacteur expert en documentation produit, branding et marketing SaaS. Tu écris en français, dans un style premium, clair et structuré. Tu utilises le format Markdown (titres ##, listes, gras). Pas de préambule ni de conclusion méta.";
    const lengthHint = isDemo
      ? "Version DÉMO courte : environ 250 mots, un aperçu représentatif seulement."
      : "Document complet, riche et professionnel (600 à 1200 mots selon le type).";

    const buildPrompt = (meta: { label: string; brief: string }) => `Rédige le document suivant pour ce produit.

DOCUMENT: ${meta.label}
CONTENU ATTENDU: ${meta.brief}
${lengthHint}

Base-toi UNIQUEMENT sur les informations réelles ci-dessous. N'invente pas de chiffres, de témoignages ou de fausses statistiques. Si une information manque, reste générique plutôt que d'inventer.

=== FICHE PRODUIT ===
${context}`;

    // Génération en parallèle (par lots) pour éviter les timeouts sur de nombreux livrables
    const ids = toGenerate.filter((id) => DELIVERABLE_LABELS[id]);
    const results: { id: string; label: string; content: string }[] = [];
    let firstErrorStatus = 0;
    const BATCH = 4;

    for (let i = 0; i < ids.length; i += BATCH) {
      const batch = ids.slice(i, i + BATCH);
      const settled = await Promise.all(
        batch.map(async (id) => {
          const meta = DELIVERABLE_LABELS[id];
          const r = await callLovableAI(system, buildPrompt(meta), isDemo ? 900 : 2600);
          return { id, meta, r };
        }),
      );
      for (const { id, meta, r } of settled) {
        if (!r.ok) {
          if (!firstErrorStatus) firstErrorStatus = r.status;
          continue;
        }
        results.push({ id, label: meta.label, content: r.text.trim() });
      }
    }

    if (results.length === 0) return aiError(firstErrorStatus || 502);

    return json(200, {
      demo: isDemo,
      requested: requested.length,
      generated: results.length,
      documents: results,
    });
  } catch (e) {
    console.error("documentation-studio-generate error:", e);
    return json(500, { error: "Erreur interne." });
  }
});

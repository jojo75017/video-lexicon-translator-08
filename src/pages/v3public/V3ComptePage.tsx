import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Crown, Key, CreditCard, Gauge, ArrowRight, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { V3_PLANS, formatPrice } from "@/data/v3Pricing";
import { BackButton } from "@/components/v3/BackButton";

type ProjectRow = {
  id: string;
  title: string | null;
  updated_at: string | null;
  status?: string | null;
};

export default function V3ComptePage() {
  const [email, setEmail] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<"debutant" | "expert" | "auteur" | null>(null);
  const [geminiKeys, setGeminiKeys] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      setEmail(user?.email ?? null);

      if (user) {
        const { data } = await supabase
          .from("ebook_projects")
          .select("id,title,updated_at,project_type")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(5);
        setProjects(((data ?? []) as unknown) as ProjectRow[]);

        const { data: sub } = await (supabase as any)
          .from("subscribers")
          .select("plan_tier")
          .eq("user_id", user.id)
          .maybeSingle();
        const tier = (sub?.plan_tier ?? "").toLowerCase();
        if (tier.includes("auteur")) setPlan("auteur");
        else if (tier.includes("expert")) setPlan("expert");
        else if (tier.includes("debutant") || tier.includes("débutant")) setPlan("debutant");
      }

      // Load Gemini keys from localStorage (BYOK)
      try {
        const raw = localStorage.getItem("gemini_keys_v2");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setGeminiKeys(parsed.map((k: any) => k?.label ?? k?.key ?? "clé").slice(0, 5));
          }
        } else {
          const legacy = localStorage.getItem("gemini_api_key");
          if (legacy) setGeminiKeys(["Clé principale"]);
        }
      } catch {}

      setLoading(false);
    })();
  }, []);

  const currentPlan = plan ? V3_PLANS.find((p) => p.id === plan) : null;
  const quota = currentPlan?.booksPerMonth;

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "#FAFAFA" }}>
      <div className="max-w-6xl mx-auto px-4 pt-4"><BackButton /></div>
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-2" style={{ color: "#b45309" }}>
            Mon compte V3
          </p>
          <h1 className="text-3xl md:text-4xl font-serif" style={{ color: "#232F3E" }}>
            Bonjour {email?.split("@")[0] ?? "Auteur"} 👋
          </h1>
          <p className="text-sm mt-2" style={{ color: "#6b7280" }}>
            {email ?? "Non connecté"}
          </p>
        </header>

        {/* Cards row */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Plan actif */}
          <div className="rounded-2xl bg-white p-5 border" style={{ borderColor: "#e5e7eb" }}>
            <div className="flex items-center gap-2 mb-3">
              <Crown size={18} style={{ color: "#b45309" }} />
              <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#6b7280" }}>
                Forfait
              </h2>
            </div>
            {currentPlan ? (
              <>
                <p className="text-2xl font-serif" style={{ color: "#232F3E" }}>
                  {currentPlan.name}
                </p>
                <p className="text-xs mb-3" style={{ color: "#6b7280" }}>
                  {formatPrice(currentPlan.monthlyPrice)}/mois · {currentPlan.agentsCount} agents
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-serif" style={{ color: "#232F3E" }}>
                  Aucun
                </p>
                <p className="text-xs mb-3" style={{ color: "#6b7280" }}>
                  Choisissez un forfait pour commencer
                </p>
              </>
            )}
            <Link
              to="/v3/forfaits"
              className="text-xs font-semibold inline-flex items-center gap-1"
              style={{ color: "#008296" }}
            >
              {currentPlan ? "Changer" : "Voir les forfaits"} <ArrowRight size={12} />
            </Link>
          </div>

          {/* Quota */}
          <div className="rounded-2xl bg-white p-5 border" style={{ borderColor: "#e5e7eb" }}>
            <div className="flex items-center gap-2 mb-3">
              <Gauge size={18} style={{ color: "#008296" }} />
              <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#6b7280" }}>
                Quota mensuel
              </h2>
            </div>
            <p className="text-2xl font-serif" style={{ color: "#232F3E" }}>
              {quota === null ? "Illimité" : quota ? `${quota} livres` : "—"}
            </p>
            <p className="text-xs mt-1" style={{ color: "#6b7280" }}>
              Renouvelé chaque 1er du mois
            </p>
          </div>

          {/* Clés API */}
          <div className="rounded-2xl bg-white p-5 border" style={{ borderColor: "#e5e7eb" }}>
            <div className="flex items-center gap-2 mb-3">
              <Key size={18} style={{ color: "#7c3aed" }} />
              <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#6b7280" }}>
                Clés IA (BYOK)
              </h2>
            </div>
            <p className="text-2xl font-serif" style={{ color: "#232F3E" }}>
              {geminiKeys.length} clé{geminiKeys.length > 1 ? "s" : ""}
            </p>
            <p className="text-xs mt-1 mb-2" style={{ color: "#6b7280" }}>
              {geminiKeys.length === 0 ? "Aucune clé Gemini configurée" : geminiKeys.join(", ")}
            </p>
            <button
              onClick={() => {
                const btn = document.querySelector('[data-api-keys-button]') as HTMLElement | null;
                btn?.click();
              }}
              className="text-xs font-semibold inline-flex items-center gap-1"
              style={{ color: "#7c3aed" }}
            >
              Gérer mes clés <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Projets récents */}
        <section className="rounded-2xl bg-white border p-6 mb-8" style={{ borderColor: "#e5e7eb" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen size={18} style={{ color: "#008296" }} />
              <h2 className="text-lg font-serif" style={{ color: "#232F3E" }}>
                Mes livres récents
              </h2>
            </div>
            <Link to="/v3/mes-livres" className="text-sm font-semibold" style={{ color: "#008296" }}>
              Tout voir →
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-slate-500">Chargement…</p>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm mb-3" style={{ color: "#6b7280" }}>
                Aucun livre pour l'instant. Lancez votre premier projet !
              </p>
              <Link
                to="/v3/create"
                className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
                style={{ background: "#008296" }}
              >
                Créer mon premier livre
              </Link>
            </div>
          ) : (
            <ul className="divide-y" style={{ borderColor: "#f3f4f6" }}>
              {projects.map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#232F3E" }}>
                      {p.title ?? "Sans titre"}
                    </p>
                    <p className="text-xs" style={{ color: "#9ca3af" }}>
                      {p.updated_at ? new Date(p.updated_at).toLocaleDateString("fr-FR") : "—"}
                      {p.status ? ` · ${p.status}` : ""}
                    </p>
                  </div>
                  <Link
                    to={(p as any).project_type === 'kids_book' ? `/v3/create/illustre?projectId=${p.id}` : `/v3/book/${p.id}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-md border"
                    style={{ borderColor: "#e5e7eb", color: "#008296" }}
                  >
                    Ouvrir
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Facturation */}
        <section className="rounded-2xl bg-white border p-6" style={{ borderColor: "#e5e7eb" }}>
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={18} style={{ color: "#232F3E" }} />
            <h2 className="text-lg font-serif" style={{ color: "#232F3E" }}>
              Facturation
            </h2>
          </div>
          <p className="text-sm mb-4" style={{ color: "#6b7280" }}>
            Gérez votre abonnement, votre moyen de paiement et téléchargez vos factures.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/subscription"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: "#232F3E" }}
            >
              Mon abonnement <ExternalLink size={14} />
            </Link>
            <Link
              to="/v3/forfaits"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border"
              style={{ borderColor: "#008296", color: "#008296" }}
            >
              Changer de forfait
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

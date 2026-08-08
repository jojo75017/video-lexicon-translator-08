import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles, Crown, Feather } from "lucide-react";
import {
  V3_PLANS,
  formatPrice,
  getYearlySavingsPercent,
  type V3BillingInterval,
} from "@/data/v3Pricing";
import { BackButton } from "@/components/v3/BackButton";
import { PayPalSubscribeButton } from "@/components/v3/PayPalSubscribeButton";

const PLAN_ICONS = {
  plume: Feather,
  edition: Crown,
} as const;

const PLAN_ACCENTS: Record<string, string> = {
  plume: "#0d7a5f",     // Plume — émeraude
  edition: "#5B21B6",   // Édition — pourpre (mis en avant)
};


export default function V3ForfaitsPage() {
  const [interval, setInterval] = useState<V3BillingInterval>("month");


  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "#FAFAFA" }}>
      <div className="max-w-6xl mx-auto">
        <BackButton className="mb-4" />
        <header className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ color: "#b45309" }}>
            EbookStudio V3 · Forfaits
          </p>
          <h1 className="text-4xl md:text-5xl font-serif mb-4" style={{ color: "#232F3E" }}>
            Choisissez votre atelier d'édition
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#4b5563" }}>
            Deux forfaits, tous les outils dans les deux. Édition ajoute la puissance
            professionnelle et inclut les upsells. Changez de forfait à tout moment.
          </p>

          <div className="inline-flex mt-8 p-1 rounded-full border" style={{ borderColor: "#e5e7eb", background: "#fff" }}>
            <button
              onClick={() => setInterval("month")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                interval === "month" ? "text-white" : "text-slate-600"
              }`}
              style={{ background: interval === "month" ? "#008296" : "transparent" }}
            >
              Mensuel
            </button>
            <button
              onClick={() => setInterval("year")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                interval === "year" ? "text-white" : "text-slate-600"
              }`}
              style={{ background: interval === "year" ? "#008296" : "transparent" }}
            >
              Annuel <span className="text-xs opacity-80">(2 mois offerts)</span>
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {V3_PLANS.map((plan) => {
            const Icon = PLAN_ICONS[plan.id];
            const accent = PLAN_ACCENTS[plan.id];
            const price = interval === "month" ? plan.monthlyPrice : plan.yearlyPrice;
            const savings = getYearlySavingsPercent(plan);
            const featured = plan.id === "edition";

            return (
              <article
                key={plan.id}
                className="relative rounded-2xl bg-white p-8 flex flex-col"
                style={{
                  border: featured ? `2px solid ${accent}` : "1px solid #e5e7eb",
                  boxShadow: featured
                    ? "0 20px 40px -12px rgba(180, 83, 9, 0.25)"
                    : "0 4px 12px rgba(0,0,0,0.04)",
                }}
              >
                {featured && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg whitespace-nowrap"
                    style={{ background: accent }}
                  >
                    ⭐ Recommandé
                  </span>
                )}

                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-lg grid place-items-center"
                    style={{ background: `${accent}15`, color: accent }}
                  >
                    <Icon size={20} />
                  </div>
                  <h2 className="text-2xl font-serif" style={{ color: "#232F3E" }}>
                    {plan.name}
                  </h2>
                </div>

                <p className="text-sm mb-6 min-h-[3rem]" style={{ color: "#6b7280" }}>
                  {plan.tagline}
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold" style={{ color: "#232F3E" }}>
                      {formatPrice(price)}
                    </span>
                    <span className="text-sm text-slate-500">
                      /{interval === "month" ? "mois" : "an"}
                    </span>
                  </div>
                  {interval === "year" && (
                    <p className="text-xs mt-1" style={{ color: accent }}>
                      Économisez {savings}% vs mensuel
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex gap-2 text-sm" style={{ color: "#374151" }}>
                      <Check size={16} className="shrink-0 mt-0.5" style={{ color: accent }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/contact-support?sujet=v3-${plan.id}-${interval}`}
                  className="block text-center py-3 rounded-lg font-semibold transition hover:opacity-90"
                  style={{
                    background: featured ? accent : "#232F3E",
                    color: "#fff",
                  }}
                >
                  Être prévenu au lancement
                </Link>
                <div className="mt-2">
                  <PayPalSubscribeButton
                    planId={plan.id}
                    interval={interval}
                    planName={plan.name}
                    amount={price}
                    accent={accent}
                  />
                </div>
                <p className="text-[11px] text-center mt-2" style={{ color: "#9ca3af" }}>
                  Prélèvement automatique {interval === "month" ? "mensuel" : "annuel"} · Annulable à tout moment
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center space-y-4">
          <p className="text-sm" style={{ color: "#6b7280" }}>
            Une question ?{" "}
            <Link to="/contact-support" className="underline" style={{ color: "#008296" }}>
              Contactez-nous
            </Link>{" "}
            — réponse sous 24h.
          </p>

        </div>
      </div>

    </div>
  );
}

import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Check, Crown, Feather, Gift, Infinity as InfinityIcon, Lock, Sparkles } from "lucide-react";
import {
  V3_PLANS,
  formatPrice,
  getV3PriceId,
  type V3BillingInterval,
} from "@/data/v3Pricing";
import {
  V2_LEGACY_MODULES,
  V2_LEGACY_QUOTAS,
  V2_LEGACY_EXCLUSIONS,
  legacyPrice,
} from "@/data/v2LegacyAccess";
import { BackButton } from "@/components/v3/BackButton";
import { PayPalSubscribeButton } from "@/components/v3/PayPalSubscribeButton";
import V3SubscribeCheckout from "@/components/v3public/V3SubscribeCheckout";
import useV3Entitlement from "@/hooks/useV3Entitlement";

const PLAN_ICONS = { plume: Feather, edition: Crown } as const;
const PLAN_ACCENTS: Record<string, string> = {
  plume: "#0d7a5f",
  edition: "#5B21B6",
};

export default function V3MigrationPage() {
  const { loading, hasV2 } = useV3Entitlement();
  const [interval, setInterval] = useState<V3BillingInterval>("month");
  const [checkout, setCheckout] = useState<{ priceId: string; planName: string } | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center" style={{ background: "#FAFAFA" }}>
        <p className="text-sm text-slate-500">Vérification de votre accès V2…</p>
      </div>
    );
  }

  if (!hasV2) return <Navigate to="/v3/forfaits" replace />;

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "#FAFAFA" }}>
      {checkout && (
        <V3SubscribeCheckout
          priceId={checkout.priceId}
          planName={checkout.planName}
          onClose={() => setCheckout(null)}
        />
      )}

      <div className="max-w-5xl mx-auto">
        <BackButton className="mb-4" />

        <header className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ color: "#b45309" }}>
            Ancien client V2
          </p>
          <h1 className="text-4xl md:text-5xl font-serif mb-4" style={{ color: "#232F3E" }}>
            Votre V2 reste à vie — et la V3 s'ouvre à vous
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#4b5563" }}>
            Vous avez acheté EbookStudio V2 : rien ne change, votre accès reste acquis à vie.
            En plus, trois nouveautés V3 vous sont offertes, et vous gardez
            <strong> -20 % à vie</strong> si vous voulez la version complète.
          </p>
        </header>

        {/* 3 nouveautés offertes */}
        <section
          className="rounded-2xl bg-white p-8 mb-10"
          style={{ border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg grid place-items-center" style={{ background: "#e8f7ef", color: "#0b6e4c" }}>
              <Gift size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-serif" style={{ color: "#232F3E" }}>
                Offert à vie : 3 nouveautés V3
              </h2>
              <p className="text-sm" style={{ color: "#6b7280" }}>
                Déjà actives dans votre compte, sans rien payer.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {V2_LEGACY_MODULES.map((m) => (
              <Link
                key={m.key}
                to={m.to}
                className="rounded-xl p-5 transition hover:opacity-90"
                style={{ border: "1px solid #e5e7eb", background: "#fcfcfc" }}
              >
                <div className="flex items-start gap-2 mb-2">
                  <Check size={16} className="shrink-0 mt-1" style={{ color: "#0b6e4c" }} />
                  <h3 className="font-semibold text-sm" style={{ color: "#232F3E" }}>{m.title}</h3>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{m.description}</p>
              </Link>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="rounded-xl p-4" style={{ background: "#f6fbf8", border: "1px solid #0f8a5f33" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#0b6e4c" }}>
                Ce qui est inclus
              </p>
              <ul className="text-sm space-y-1" style={{ color: "#374151" }}>
                <li>{V2_LEGACY_QUOTAS.booksPerMonth} livres / mois via les nouveautés</li>
                <li>{V2_LEGACY_QUOTAS.chaptersMax} chapitres max · {V2_LEGACY_QUOTAS.wordsPerChapter.toLocaleString("fr-FR")} mots / chapitre</li>
                <li>Export PDF / DOCX / EPUB avec sommaire stylé</li>
                <li className="flex items-center gap-1">
                  <InfinityIcon size={14} /> Votre V2 complète, inchangée
                </li>
              </ul>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#fdfbf6", border: "1px solid #e5e7eb" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#9a6b0a" }}>
                Réservé aux forfaits
              </p>
              <ul className="text-sm space-y-1" style={{ color: "#6b7280" }}>
                {V2_LEGACY_EXCLUSIONS.map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <Lock size={13} className="shrink-0 mt-1" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Offre de fidélité */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif mb-2" style={{ color: "#232F3E" }}>
              Votre remise fidélité : -20 % à vie
            </h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: "#6b7280" }}>
              Réservée aux acheteurs V2, appliquée automatiquement, et conservée
              aussi longtemps que votre abonnement reste actif.
            </p>

            <div className="inline-flex mt-6 p-1 rounded-full border" style={{ borderColor: "#e5e7eb", background: "#fff" }}>
              <button
                onClick={() => setInterval("month")}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${interval === "month" ? "text-white" : "text-slate-600"}`}
                style={{ background: interval === "month" ? "#008296" : "transparent" }}
              >
                Mensuel
              </button>
              <button
                onClick={() => setInterval("year")}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${interval === "year" ? "text-white" : "text-slate-600"}`}
                style={{ background: interval === "year" ? "#008296" : "transparent" }}
              >
                Annuel <span className="text-xs opacity-80">(2 mois offerts)</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {V3_PLANS.map((plan) => {
              const Icon = PLAN_ICONS[plan.id];
              const accent = PLAN_ACCENTS[plan.id];
              const publicPrice = interval === "month" ? plan.monthlyPrice : plan.yearlyPrice;
              const yourPrice = legacyPrice(publicPrice);
              const featured = plan.id === "edition";

              return (
                <article
                  key={plan.id}
                  className="relative rounded-2xl bg-white p-8 flex flex-col"
                  style={{
                    border: featured ? `2px solid ${accent}` : "1px solid #e5e7eb",
                    boxShadow: featured ? "0 20px 40px -12px rgba(91,33,182,0.2)" : "0 4px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg whitespace-nowrap"
                    style={{ background: "#b45309" }}
                  >
                    -20 % à vie · ancien client
                  </span>

                  <div className="flex items-center gap-3 mb-2 mt-2">
                    <div className="w-10 h-10 rounded-lg grid place-items-center" style={{ background: `${accent}15`, color: accent }}>
                      <Icon size={20} />
                    </div>
                    <h3 className="text-2xl font-serif" style={{ color: "#232F3E" }}>{plan.name}</h3>
                  </div>

                  <p className="text-sm mb-6 min-h-[3rem]" style={{ color: "#6b7280" }}>{plan.tagline}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold" style={{ color: "#232F3E" }}>
                        {formatPrice(yourPrice)}
                      </span>
                      <span className="text-sm text-slate-500">/{interval === "month" ? "mois" : "an"}</span>
                    </div>
                    <p className="text-xs mt-1 text-slate-500">
                      Prix public <span className="line-through">{formatPrice(publicPrice)}</span> — votre remise est déjà appliquée.
                    </p>
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex gap-2 text-sm" style={{ color: "#374151" }}>
                        <Check size={16} className="shrink-0 mt-0.5" style={{ color: accent }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() =>
                      setCheckout({
                        priceId: getV3PriceId(plan.id, interval, true),
                        planName: `${plan.name} — ancien client (-20 %)`,
                      })
                    }
                    className="block w-full text-center py-3 rounded-lg font-semibold transition hover:opacity-90"
                    style={{ background: featured ? accent : "#232F3E", color: "#fff" }}
                  >
                    Activer ma remise — {formatPrice(yourPrice)}
                  </button>

                  <div className="mt-2">
                    <PayPalSubscribeButton
                      planId={plan.id}
                      interval={interval}
                      planName={`${plan.name} (ancien client)`}
                      amount={yourPrice}
                      accent={accent}
                      legacyV2
                    />
                  </div>

                  <p className="text-[11px] text-center mt-2" style={{ color: "#9ca3af" }}>
                    Prélèvement {interval === "month" ? "mensuel" : "annuel"} · Annulable à tout moment
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <p className="text-center text-sm mt-12" style={{ color: "#6b7280" }}>
          Une question sur votre accès V2 ?{" "}
          <Link to="/contact-support?sujet=migration-v2" className="underline" style={{ color: "#008296" }}>
            Écrivez-nous
          </Link>{" "}
          — réponse sous 24 h.
        </p>
      </div>
    </div>
  );
}

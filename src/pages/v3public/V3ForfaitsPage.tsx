import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Crown, Feather, Gift, Minus } from "lucide-react";
import {
  V3_PLANS,
  formatPrice,
  getV3PriceId,
  getYearlySavingsPercent,
  type V3BillingInterval,
} from "@/data/v3Pricing";
import {
  V2_LEGACY_MODULES,
  V2_LEGACY_EXTRA_FEATURES,
  V2_ACCESS_NOTE,
  V2_ACCESS_UNTIL_LABEL,
} from "@/data/v2LegacyAccess";
import { BackButton } from "@/components/v3/BackButton";
import { PayPalSubscribeButton } from "@/components/v3/PayPalSubscribeButton";
import V3SubscribeCheckout from "@/components/v3public/V3SubscribeCheckout";
import useV3Entitlement from "@/hooks/useV3Entitlement";
import { Button } from "@/components/ui/button";

const PLAN_ICONS = {
  plume: Feather,
  edition: Crown,
} as const;

const COMPARISON = [
  {
    label: `Accès V2 (jusqu'au ${V2_ACCESS_UNTIL_LABEL})`,
    legacy: "Inclus",
    plume: "Inclus",
    edition: "Inclus",
  },
  { label: "Livres par mois", legacy: "2", plume: "50", edition: "Illimités" },
  { label: "Chapitres par livre", legacy: "40", plume: "40", edition: "60" },
  { label: "Mots par chapitre", legacy: "5 000", plume: "5 000", edition: "8 000" },
  { label: "Génie et sommaire", legacy: "Inclus", plume: "Guidé", edition: "Avancé + séries" },
  { label: "Correction et exports", legacy: "Inclus", plume: "Complets", edition: "Professionnels" },
  { label: "Recherche avancée", legacy: "Incluse", plume: "Incluse", edition: "Incluse + Amazon Spy" },
  { label: "Couvertures", legacy: "Simple (comme la V2)", plume: "Kindle + broché", edition: "Cover Studio Pro + relié" },
  { label: "Audiolivre", legacy: "—", plume: "Standard", edition: "Premium inclus" },
  { label: "Traductions 10 langues", legacy: "—", plume: "À la carte", edition: "Incluses" },
  { label: "Sélection maisons d'édition", legacy: "—", plume: "À la carte", edition: "Incluse" },
  { label: "BD Studio Pro et Studio Jeunesse", legacy: "—", plume: "—", edition: "Inclus" },
] as const;

export default function V3ForfaitsPage() {
  const [interval, setInterval] = useState<V3BillingInterval>("month");
  const { hasV2 } = useV3Entitlement();
  const [checkout, setCheckout] = useState<{ priceId: string; planName: string } | null>(null);

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "var(--v3-paper)", color: "var(--v3-ink)" }}>
      {checkout && <V3SubscribeCheckout priceId={checkout.priceId} planName={checkout.planName} onClose={() => setCheckout(null)} />}
      <div className="mx-auto max-w-7xl">
        <BackButton className="mb-4" />

        <header className="text-center mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--v3-gold-600)" }}>
            EbookStudio V3 · Forfaits
          </p>
          <h1 className="v3-serif mb-4 text-4xl md:text-5xl" style={{ color: "var(--v3-emerald)" }}>
            Trois accès, sans mauvaise surprise
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed" style={{ color: "var(--v3-muted)" }}>
            Les abonnés actuels gardent leur V2 et cinq modules V3. Plume accompagne une production régulière.
            Édition ajoute les studios professionnels et les livres illimités.
          </p>

          <div className="mt-7 inline-flex rounded-md border bg-background p-1" style={{ borderColor: "var(--v3-line)" }}>
            <Button variant={interval === "month" ? "default" : "ghost"} size="sm" onClick={() => setInterval("month")}>Mensuel</Button>
            <Button variant={interval === "year" ? "default" : "ghost"} size="sm" onClick={() => setInterval("year")}>Annuel · 2 mois offerts</Button>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-3">
          <article className="flex flex-col rounded-lg bg-background p-7" style={{ border: "1px solid var(--v3-line)" }}>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md" style={{ background: "var(--v3-gold-soft)", color: "var(--v3-gold-600)" }}><Gift size={19} /></span>
              <div><p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: "var(--v3-gold-600)" }}>Offre fidélité</p><h2 className="v3-serif text-2xl">Déjà abonné</h2></div>
            </div>
            <p className="mt-5 text-2xl font-bold" style={{ color: "var(--v3-emerald)" }}>Vous ne perdez rien</p>
            <p className="mt-1 text-sm" style={{ color: "var(--v3-muted)" }}>Vous gagnez la V3 essentielle, sans nouvel achat obligatoire</p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {V2_LEGACY_MODULES.map((module) => <li key={module.key} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--v3-emerald)" }} />{module.title}</li>)}
              {V2_LEGACY_EXTRA_FEATURES.map((feat) => <li key={feat} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--v3-emerald)" }} />{feat}</li>)}
            </ul>
            <p className="mt-3 rounded-md px-3 py-2 text-xs font-semibold" style={{ background: "var(--v3-cream)", color: "var(--v3-emerald)" }}>
              {V2_ACCESS_NOTE}
            </p>
            <p className="mt-2 rounded-md px-3 py-2 text-xs" style={{ background: "var(--v3-cream)", color: "var(--v3-muted)" }}>
              Non inclus : couverture Kindle/broché prête pour KDP, audiolivre, traductions et studios pro — disponibles avec Plume ou Édition.
            </p>
            <Button asChild variant="outline" className="mt-6"><Link to={hasV2 ? "/v3/migration" : "/v3/auth"}>{hasV2 ? "Voir mes avantages" : "Me connecter"}</Link></Button>
          </article>

          {V3_PLANS.map((plan) => {
            const Icon = PLAN_ICONS[plan.id];
            const publicPrice = interval === "month" ? plan.monthlyPrice : plan.yearlyPrice;
            const savings = getYearlySavingsPercent(plan);
            const featured = plan.id === "plume";

            return (
              <article
                key={plan.id}
                className="relative flex flex-col rounded-lg bg-background p-7"
                style={{ border: featured ? "2px solid var(--v3-gold)" : "1px solid var(--v3-line)", boxShadow: featured ? "var(--v3-shadow-card)" : "none" }}
              >
                {featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold" style={{ background: "var(--v3-gold)", color: "var(--v3-editorial-ink)" }}>Le meilleur équilibre</span>}

                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-md" style={{ background: "var(--v3-emerald-50)", color: "var(--v3-emerald)" }}><Icon size={19} /></span>
                  <h2 className="v3-serif text-2xl">{plan.name}</h2>
                </div>

                <p className="mt-4 min-h-12 text-sm" style={{ color: "var(--v3-muted)" }}>{plan.tagline}</p>

                <div className="my-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold" style={{ color: "var(--v3-emerald)" }}>{formatPrice(publicPrice)}</span>
                    <span className="text-sm" style={{ color: "var(--v3-muted)" }}>/{interval === "month" ? "mois" : "an"}</span>
                  </div>
                  {!hasV2 && interval === "year" && <p className="mt-1 text-xs" style={{ color: "var(--v3-gold-600)" }}>Économisez {savings}%</p>}
                </div>

                <p className="mb-4 rounded-md px-3 py-2 text-xs font-semibold" style={{ background: "var(--v3-cream)", color: "var(--v3-emerald)" }}>
                  {plan.aiSummary} · 10 langues incluses
                </p>

                <ul className="mb-5 flex-1 space-y-2.5">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <Check size={16} className="mt-0.5 shrink-0" style={{ color: "var(--v3-emerald)" }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="mb-4 rounded-md p-3 text-xs" style={{ background: "var(--v3-cream)", color: "var(--v3-muted)" }}><strong style={{ color: "var(--v3-ink)" }}>Idéal pour :</strong> {plan.idealFor}</div>
                <Button onClick={() => setCheckout({ priceId: getV3PriceId(plan.id, interval, hasV2), planName: plan.name })}>Choisir {plan.name} · {formatPrice(publicPrice)}</Button>
                <div className="mt-2">
                  <PayPalSubscribeButton
                    planId={plan.id}
                    interval={interval}
                    planName={plan.name}
                    amount={publicPrice}
                    accent="var(--v3-emerald)"
                    legacyV2={hasV2}
                  />
                </div>
                <p className="mt-2 text-center text-[11px]" style={{ color: "var(--v3-muted)" }}>
                  Prélèvement automatique {interval === "month" ? "mensuel" : "annuel"} · Annulable à tout moment
                </p>
              </article>
            );
          })}
        </div>

        <section className="mt-12 overflow-hidden rounded-lg bg-background" style={{ border: "1px solid var(--v3-line)" }}>
          <div className="p-6"><h2 className="v3-serif text-2xl font-semibold">Comparer l’essentiel</h2><p className="mt-1 text-sm" style={{ color: "var(--v3-muted)" }}>Les gros compléments premium restent à la carte dans les trois offres.</p></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead style={{ background: "var(--v3-cream)" }}><tr><th className="px-5 py-3 text-left">Fonction</th><th className="px-5 py-3 text-left">Déjà abonné</th><th className="px-5 py-3 text-left">Plume</th><th className="px-5 py-3 text-left">Édition</th></tr></thead>
              <tbody>{COMPARISON.map((row) => <tr key={row.label} style={{ borderTop: "1px solid var(--v3-line)" }}><th className="px-5 py-3 text-left font-medium">{row.label}</th>{([row.legacy, row.plume, row.edition] as const).map((value, index) => <td key={index} className="px-5 py-3" style={{ color: value === "—" ? "var(--v3-muted)" : "var(--v3-ink)" }}>{value === "—" ? <Minus className="h-4 w-4" /> : value}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </section>

        <p className="mt-8 text-center text-sm" style={{ color: "var(--v3-muted)" }}>Une question ? <Link to="/contact-support" className="underline" style={{ color: "var(--v3-emerald)" }}>Contactez-nous</Link> — réponse sous 24 h.</p>
      </div>
    </div>
  );
}

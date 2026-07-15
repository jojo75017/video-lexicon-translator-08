import React from 'react';
import { Clock, Calendar, CreditCard, Layers, XCircle, CheckCircle2, BookOpen, Crown, Sparkles } from 'lucide-react';

const INK = '#2A2118';
const SERIF = "'Georgia', 'Times New Roman', serif";
const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const AMBER_SOFT = '#FFF3DF';

/**
 * Onglet « En attente » du Hub V3.
 * Affiche la roadmap V3 — Lancement Octobre 2026 mise en pause,
 * telle qu'archivée dans .lovable/plan.md (aucune action code déclenchée).
 */
export default function V3PendingLaunchTab() {
  return (
    <section className="space-y-6">
      {/* Bandeau statut */}
      <div
        className="rounded-2xl border p-5 sm:p-6"
        style={{ background: '#fff', borderColor: `${AMBER}44` }}
      >
        <div
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider"
          style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: AMBER_DEEP }}
        >
          <Clock className="h-3.5 w-3.5" /> En attente — à déclencher fin septembre 2026
        </div>
        <h2
          className="mt-4 text-3xl sm:text-4xl font-medium leading-tight"
          style={{ fontFamily: SERIF, color: INK }}
        >
          EbookStudio V3 — Lancement Octobre 2026
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: '#6f5e47' }}>
          Ce chantier est <strong>archivé dans la roadmap</strong> et prêt à être exécuté.
          Aucune modification de code n'est faite tant que vous n'avez pas dit « on y va ».
          Rien ne casse d'ici là.
        </p>
      </div>

      {/* Décisions prises */}
      <div className="rounded-2xl border bg-white p-5 sm:p-6" style={{ borderColor: `${AMBER}33` }}>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5" style={{ color: AMBER_DEEP }} />
          <h3 className="text-xl font-semibold" style={{ fontFamily: SERIF, color: INK }}>
            Décisions prises
          </h3>
        </div>
        <ul className="space-y-3 text-sm" style={{ color: '#4a3f2f' }}>
          <li className="flex gap-2">
            <Layers className="h-4 w-4 mt-0.5 shrink-0" style={{ color: AMBER }} />
            <span><strong>Un seul V3</strong> avec <strong>30 agents</strong> (22 base + 8 des packs Pro). Plus de « V4 » ni de « Pack Pro Vendeur » à 347€.</span>
          </li>
          <li className="flex gap-2">
            <Calendar className="h-4 w-4 mt-0.5 shrink-0" style={{ color: AMBER }} />
            <span><strong>Prix de lancement : 97€</strong> du <strong>1er au 31 octobre 2026</strong> (23h59).</span>
          </li>
          <li className="flex gap-2">
            <Calendar className="h-4 w-4 mt-0.5 shrink-0" style={{ color: AMBER }} />
            <span><strong>Prix normal : 197€</strong> à partir du <strong>1er novembre 2026</strong>.</span>
          </li>
          <li className="flex gap-2">
            <Layers className="h-4 w-4 mt-0.5 shrink-0" style={{ color: AMBER }} />
            <span>Tous les modules premium (Sélection éditeurs, Special Books, Revenus, Distribution, Social, Qualité, Étude de marché…) deviennent des <strong>upsells</strong> — visibles mais désactivés avec badge « Bientôt ».</span>
          </li>
          <li className="flex gap-2">
            <XCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#b04747' }} />
            <span><strong>Pack Full 347€ : désactivé</strong> (les clés <code>v3_full_*</code> renvoient une erreur claire).</span>
          </li>
        </ul>
      </div>

      {/* Paiements */}
      <div className="rounded-2xl border bg-white p-5 sm:p-6" style={{ borderColor: `${AMBER}33` }}>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5" style={{ color: AMBER_DEEP }} />
          <h3 className="text-xl font-semibold" style={{ fontFamily: SERIF, color: INK }}>
            Paiements en plusieurs fois — <span className="text-red-600">JAMAIS d'abonnement mensuel</span>
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border p-4" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44` }}>
            <div className="text-xs uppercase font-bold tracking-wider" style={{ color: AMBER_DEEP }}>Octobre — 97€</div>
            <ul className="mt-2 space-y-1 text-sm" style={{ color: INK }}>
              <li>• 1 × 97€</li>
              <li>• 2 × 49€</li>
              <li>• 3 × 33€</li>
            </ul>
          </div>
          <div className="rounded-xl border p-4 bg-neutral-50">
            <div className="text-xs uppercase font-bold tracking-wider text-neutral-600">Novembre+ — 197€</div>
            <ul className="mt-2 space-y-1 text-sm" style={{ color: INK }}>
              <li>• 1 × 197€</li>
              <li>• 2 × 99€</li>
              <li>• 3 × 66€</li>
            </ul>
          </div>
        </div>
        <p className="mt-3 text-xs italic" style={{ color: '#6f5e47' }}>
          Stripe <code>mode: "payment"</code> uniquement. Chaque option = un prix distinct. Pas de <code>mode: "subscription"</code>.
        </p>
      </div>

      {/* Fichiers impactés */}
      <div className="rounded-2xl border bg-white p-5 sm:p-6" style={{ borderColor: `${AMBER}33` }}>
        <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: SERIF, color: INK }}>
          Fichiers qui seront modifiés le moment venu
        </h3>
        <div className="space-y-4 text-sm" style={{ color: '#4a3f2f' }}>
          <div>
            <div className="font-semibold mb-1" style={{ color: AMBER_DEEP }}>Nouveaux fichiers</div>
            <ul className="space-y-1 pl-4">
              <li>• <code>src/data/v3LaunchPricing.ts</code> — prix dynamique 97€/197€ selon la date</li>
              <li>• <code>src/components/sales/V3LaunchCountdown.tsx</code> — compte à rebours 1er → 31 oct</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-1" style={{ color: AMBER_DEEP }}>Fichiers modifiés</div>
            <ul className="space-y-1 pl-4">
              <li>• <code>src/data/roadmapV3.ts</code> — 30 agents, prix dynamique</li>
              <li>• <code>src/data/v3Launch.ts</code> — une seule offre V3</li>
              <li>• <code>src/data/v3ModuleRegistry.tsx</code> — flag <code>upsell: true</code> + badge « Bientôt »</li>
              <li>• <code>src/components/sales/V3PricingTiers.tsx</code> / <code>PricingLadder497.tsx</code> — 1 tier + section upsells</li>
              <li>• <code>supabase/functions/stripe-checkout/index.ts</code> — clés <code>v3_launch_*</code> puis bascule <code>v3_base_*</code> après le 31/10</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-1 text-neutral-500">Hors périmètre (à faire plus tard)</div>
            <ul className="space-y-1 pl-4 text-neutral-500">
              <li>• Construction des tunnels upsell (le mois suivant)</li>
              <li>• Emails / séquence de lancement</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Note finale */}
      <div className="rounded-2xl border-2 border-dashed p-5 text-sm" style={{ borderColor: `${AMBER}66`, background: AMBER_SOFT, color: AMBER_DEEP }}>
        💡 Dès que vous direz <strong>« on y va »</strong>, tout ce plan sera exécuté d'un bloc.
        Si vous voulez lancer <strong>dès maintenant</strong>, dites-le explicitement.
      </div>
    </section>
  );
}

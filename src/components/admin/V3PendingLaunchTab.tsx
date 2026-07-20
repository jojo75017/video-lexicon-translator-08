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
          EbookStudio V3 — Lancement 1er Octobre 2026
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: '#6f5e47' }}>
          Décision : on attaque <strong>directement</strong> le plan à 3 forfaits (mensuel/annuel)
          le <strong>1er octobre 2026</strong>. Les anciennes offres 97€ / 197€ en 1×/2×/3×
          sont <strong>abandonnées</strong>. Aucune modification de code d'ici là.
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
            <Calendar className="h-4 w-4 mt-0.5 shrink-0" style={{ color: AMBER }} />
            <span><strong>Lancement le 1er octobre 2026</strong> avec le modèle à 3 forfaits (voir ci-dessous).</span>
          </li>
          <li className="flex gap-2">
            <CreditCard className="h-4 w-4 mt-0.5 shrink-0" style={{ color: AMBER }} />
            <span><strong>Abonnements mensuels ou annuels</strong> (l'annuel affiche l'économie).</span>
          </li>
          <li className="flex gap-2">
            <Layers className="h-4 w-4 mt-0.5 shrink-0" style={{ color: AMBER }} />
            <span>Différence entre forfaits = <strong>nombre de livres créés par mois</strong> (5 / 10 / illimités).</span>
          </li>
          <li className="flex gap-2">
            <XCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#b04747' }} />
            <span><strong>Abandonné :</strong> l'ancienne offre 97€ (octobre) / 197€ (novembre+) en 1×/2×/3× et le Pack Full 347€.</span>
          </li>
        </ul>
      </div>



      {/* Piste tarifaire mensuelle/annuelle — modèle ViviBook simplifié, EN ATTENTE */}
      <div className="rounded-2xl border-2 bg-white p-5 sm:p-6" style={{ borderColor: `${AMBER}66` }}>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <BookOpen className="h-5 w-5" style={{ color: AMBER_DEEP }} />
          <h3 className="text-xl font-semibold" style={{ fontFamily: SERIF, color: INK }}>
            Modèle ViviBook simplifié — 3 forfaits (mensuel ou annuel)
          </h3>
          <span
            className="ml-2 rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
            style={{ background: AMBER_SOFT, borderColor: `${AMBER}66`, color: AMBER_DEEP }}
          >
            En attente
          </span>
        </div>
        <p className="text-sm mb-4" style={{ color: '#6f5e47' }}>
          Version <strong>plus réaliste et moins compliquée</strong> : 3 forfaits clairs,
          au choix <strong>mensuel</strong> ou <strong>annuel</strong> (économie affichée).
          Chaque forfait = un nombre de livres par mois.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Débutants */}
          <div className="rounded-xl border p-4 bg-neutral-50 flex flex-col">
            <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-neutral-600">
              <BookOpen className="h-3.5 w-3.5" /> Débutants
            </div>
            <div className="mt-1 text-sm" style={{ color: '#6f5e47' }}>Lisez des histoires illimitées</div>
            <div className="mt-3 text-2xl font-bold" style={{ color: INK }}>5 livres / mois</div>
            <div className="mt-4 rounded-lg bg-white border p-3">
              <div className="text-[11px] uppercase font-bold tracking-wider text-neutral-500">Mensuel</div>
              <div className="text-lg font-bold" style={{ color: INK }}>6,99 € <span className="text-xs font-normal text-neutral-500">+ taxes / mois</span></div>
            </div>
            <div className="mt-2 rounded-lg border p-3" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44` }}>
              <div className="text-[11px] uppercase font-bold tracking-wider" style={{ color: AMBER_DEEP }}>Annuel</div>
              <div className="text-lg font-bold" style={{ color: INK }}>
                <span className="line-through text-sm font-normal text-neutral-400 mr-1">83,88 €</span>
                69,00 € <span className="text-xs font-normal text-neutral-500">+ taxes / an</span>
              </div>
            </div>
          </div>

          {/* Expert */}
          <div className="rounded-xl border p-4 flex flex-col" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44` }}>
            <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider" style={{ color: AMBER_DEEP }}>
              <Sparkles className="h-3.5 w-3.5" /> Expert
            </div>
            <div className="mt-1 text-sm" style={{ color: '#6f5e47' }}>Créez des histoires pour vous</div>
            <div className="mt-3 text-2xl font-bold" style={{ color: INK }}>10 livres / mois</div>
            <div className="mt-4 rounded-lg bg-white border p-3">
              <div className="text-[11px] uppercase font-bold tracking-wider text-neutral-500">Mensuel</div>
              <div className="text-lg font-bold" style={{ color: INK }}>9,99 € <span className="text-xs font-normal text-neutral-500">+ taxes / mois</span></div>
            </div>
            <div className="mt-2 rounded-lg border p-3 bg-white">
              <div className="text-[11px] uppercase font-bold tracking-wider" style={{ color: AMBER_DEEP }}>Annuel</div>
              <div className="text-lg font-bold" style={{ color: INK }}>
                <span className="line-through text-sm font-normal text-neutral-400 mr-1">119,88 €</span>
                79,00 € <span className="text-xs font-normal text-neutral-500">+ taxes / an</span>
              </div>
            </div>
          </div>

          {/* Auteur */}
          <div className="rounded-xl border p-4 flex flex-col" style={{ background: '#141414', borderColor: '#c9a84c' }}>
            <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider" style={{ color: '#c9a84c' }}>
              <Crown className="h-3.5 w-3.5" /> Auteur
            </div>
            <div className="mt-1 text-sm text-neutral-300">Publiez vos propres livres</div>
            <div className="mt-3 text-2xl font-bold text-white">Livres illimités / mois</div>
            <div className="mt-4 rounded-lg p-3" style={{ background: '#1f1f1f', border: '1px solid #333' }}>
              <div className="text-[11px] uppercase font-bold tracking-wider text-neutral-400">Mensuel</div>
              <div className="text-lg font-bold text-white">59,00 € <span className="text-xs font-normal text-neutral-400">+ taxes / mois</span></div>
            </div>
            <div className="mt-2 rounded-lg p-3" style={{ background: '#1f1f1f', border: '1px solid #c9a84c' }}>
              <div className="text-[11px] uppercase font-bold tracking-wider" style={{ color: '#c9a84c' }}>Annuel</div>
              <div className="text-lg font-bold text-white">
                <span className="line-through text-sm font-normal text-neutral-500 mr-1">708,00 €</span>
                597,00 € <span className="text-xs font-normal text-neutral-400">+ taxes / an</span>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs italic" style={{ color: '#6f5e47' }}>
          ⚠️ Modèle par abonnement (mensuel/annuel) — <strong>en conflit</strong> avec la décision actuelle
          « uniquement paiement en 1×/2×/3× ». À trancher avant exécution. Rien n'est codé pour l'instant.
        </p>
      </div>



      {/* Note finale */}
      <div className="rounded-2xl border-2 border-dashed p-5 text-sm" style={{ borderColor: `${AMBER}66`, background: AMBER_SOFT, color: AMBER_DEEP }}>
        💡 Dès que vous direz <strong>« on y va »</strong>, tout ce plan sera exécuté d'un bloc.
        Si vous voulez lancer <strong>dès maintenant</strong>, dites-le explicitement.
      </div>
    </section>
  );
}

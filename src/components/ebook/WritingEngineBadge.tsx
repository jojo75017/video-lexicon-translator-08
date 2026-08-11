import React from 'react';
import { Sparkles, Check, X, ArrowUpRight, Crown } from 'lucide-react';

interface WritingEngineBadgeProps {
  /** Palier actif : 'debutant' | 'expert' | 'auteur' */
  tier?: 'debutant' | 'expert' | 'auteur';
  /** @deprecated conservé pour compat : true = Auteur, false = Débutant */
  isPro?: boolean;
  /** Ouvre la page des offres pour upgrader */
  onUpgrade?: () => void;
}

const TEAL = '#008296';
const AMBER = '#FF9E2D';

type Row = {
  label: string;
  debutant: string | boolean;
  expert: string | boolean;
  auteur: string | boolean;
};

/** Comparatif des 3 abonnements mensuels ebookstudio V3. */
const ROWS: Row[] = [
  { label: 'Livres par mois', debutant: '5', expert: '10', auteur: '20' },
  { label: 'Chapitres maximum', debutant: '20', expert: '40', auteur: '60' },
  { label: 'Longueur des chapitres', debutant: 'jusqu\u2019à 2 500 mots', expert: 'jusqu\u2019à 4 000 mots', auteur: 'jusqu\u2019à ~6 000 mots' },
  { label: 'Studio 30 agents (rédaction + croissance)', debutant: '15 agents', expert: '22 agents', auteur: '30 agents' },
  { label: 'Choix du modèle IA (Claude, Gemini, ChatGPT, DeepSeek, Mistral)', debutant: true, expert: true, auteur: true },
  { label: 'Assistant IA (titre, sous-titre, synopsis, catégories)', debutant: true, expert: true, auteur: true },
  { label: 'Couverture IA (gpt-image-2)', debutant: 'standard', expert: 'pro', auteur: 'signature ultra-pro' },
  { label: 'Passe éditoriale automatique', debutant: false, expert: true, auteur: true },
  { label: 'Édition structurelle Pro (structure, rythme, arcs)', debutant: false, expert: false, auteur: true },
  { label: 'Copy-editing & comité de lecture IA', debutant: false, expert: false, auteur: true },
  { label: 'Label Qualité « Maison d\u2019Édition »', debutant: false, expert: false, auteur: true },
  { label: 'Variantes A/B (titres, descriptions, emails)', debutant: false, expert: true, auteur: true },
  { label: 'Sélection éditeurs & phases marketing avancées', debutant: false, expert: false, auteur: true },
  { label: 'Option audiobook (9,99 €/livre)', debutant: true, expert: true, auteur: true },
];

const Cell: React.FC<{ value: string | boolean; accent?: boolean }> = ({ value, accent }) => {
  if (value === true) {
    return <Check className="mx-auto h-4 w-4" style={{ color: accent ? TEAL : '#16a34a' }} />;
  }
  if (value === false) {
    return <X className="mx-auto h-4 w-4 text-muted-foreground/50" />;
  }
  return (
    <span className={`text-[12px] leading-tight ${accent ? 'font-bold' : 'font-medium'}`} style={{ color: accent ? TEAL : '#4a4a4a' }}>
      {value}
    </span>
  );
};

/**
 * Encart comparatif affiché en tête du parcours de rédaction.
 * Compare les 2 forfaits mensuels : Plume 17 € · Édition 27 €.
 */
export const WritingEngineBadge: React.FC<WritingEngineBadgeProps> = ({ tier, isPro, onUpgrade }) => {
  const activeTier: 'debutant' | 'expert' | 'auteur' =
    tier ?? (isPro ? 'auteur' : 'debutant');

  const isEdition = activeTier === 'auteur';
  const tierLabel = isEdition ? 'Édition 27 €/mois' : 'Plume 17 €/mois';

  const canUpgrade = !isEdition;

  return (
    <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: `${TEAL}33`, background: '#fff' }}>
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3.5" style={{ background: `${TEAL}0d` }}>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: TEAL }}>
            <Sparkles className="h-3.5 w-3.5" />
            Palier actif : {tierLabel}
          </span>
        </div>
        <span className="text-xs font-semibold" style={{ color: TEAL }}>
          Comparatif des 2 forfaits
        </span>
      </div>

      {/* Tableau comparatif */}
      <div className="px-2 sm:px-4 py-3 overflow-x-auto">
        <div className="grid grid-cols-[1fr_100px_110px] sm:grid-cols-[1fr_140px_150px] items-center gap-x-2 gap-y-0 min-w-[440px]">
          {/* En-têtes colonnes */}
          <div />
          <div className={`text-center text-[11px] font-bold uppercase tracking-wide py-2 rounded-t-lg ${isEdition ? 'text-muted-foreground' : 'text-foreground'}`} style={{ background: '#C97A1412', color: '#C97A14' }}>
            ✍️ Plume<br />17 €/mois
          </div>
          <div className="text-center text-[11px] font-black uppercase tracking-wide py-2 rounded-t-lg" style={{ color: TEAL, background: `${TEAL}12` }}>
            <span className="inline-flex items-center gap-1"><Crown className="h-3 w-3" />Édition ⭐</span><br />27 €/mois
          </div>

          {ROWS.map((row, i) => (
            <React.Fragment key={row.label}>
              <div className={`text-[12px] leading-snug text-foreground py-2 ${i > 0 ? 'border-t border-border/50' : ''}`}>
                {row.label}
              </div>
              <div className={`text-center py-2 ${i > 0 ? 'border-t border-border/50' : ''}`}>
                <Cell value={row.expert} />
              </div>
              <div className={`text-center py-2 ${i > 0 ? 'border-t border-border/50' : ''}`} style={{ background: `${TEAL}08` }}>
                <Cell value={row.auteur} accent />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Call to action / statut */}
      {!canUpgrade ? (
        <div className="px-4 sm:px-5 py-3 text-[12px] font-semibold" style={{ background: `${TEAL}0d`, color: TEAL }}>
          ✓ Vous êtes sur le palier <strong>Éditeur</strong> — toutes les capacités ci-dessus sont actives.
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3.5" style={{ background: `${AMBER}12` }}>
          <span className="text-[12px] text-foreground max-w-md">
            <strong>Passez au palier Éditeur (59 €/mois)</strong> pour débloquer les 30 agents, l'édition Pro, le comité de lecture et des livres illimités.
          </span>
          {onUpgrade && (
            <button
              type="button"
              onClick={onUpgrade}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              style={{ background: TEAL }}
            >
              Voir les offres <ArrowUpRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WritingEngineBadge;

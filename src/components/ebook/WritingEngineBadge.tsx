import React from 'react';
import { Sparkles, Check, X, ArrowUpRight, Crown } from 'lucide-react';

interface WritingEngineBadgeProps {
  /** true = Pack Pro 347€ (moteur Pro), false = Base 197€ (moteur Standard) */
  isPro: boolean;
  /** Ouvre le tunnel d'achat du Pack Pro 347€ (affiché uniquement en offre 197€) */
  onUpgrade?: () => void;
}

const TEAL = '#008296';
const AMBER = '#FF9E2D';

type Row = {
  label: string;
  core: string | boolean;
  pro: string | boolean;
};

/** Comparatif concret 197€ vs 347€ pour la rédaction du livre. */
const ROWS: Row[] = [
  { label: 'Longueur des chapitres', core: 'jusqu\u2019à 3 500 mots', pro: 'jusqu\u2019à ~6 000 mots' },
  { label: 'Passe éditoriale automatique (densification, fluidité, exemples)', core: false, pro: true },
  { label: 'Édition structurelle Pro (structure, rythme, arcs)', core: false, pro: true },
  { label: 'Copy-editing & comité de lecture IA', core: false, pro: true },
  { label: 'Label Qualité « Maison d\u2019Édition »', core: false, pro: true },
  { label: 'Couverture Signature Pro (IA gpt-image-2)', core: 'couverture standard', pro: 'couverture ultra-pro' },
  { label: 'Boucle qualité renforcée (score cible + tentatives)', core: 'standard', pro: 'renforcée' },
  { label: 'Sous-sections enrichies et détaillées', core: false, pro: true },
  { label: 'Variantes A/B (titres, descriptions, emails, annonces)', core: false, pro: true },
  { label: 'Étapes du parcours guidé', core: 'idée → publié', pro: '+ livre pro & marketing' },
  { label: 'Phases exclusives (avis, séquences email, série, audio, traduction…)', core: false, pro: 'incluses' },
  { label: 'Choix du modèle IA (Claude, Gemini, ChatGPT, DeepSeek, Mistral)', core: true, pro: true },
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
 * Montre noir sur blanc ce que le Pack Pro 347€ apporte de plus, pour que
 * l'acheteur comprenne exactement la valeur de chaque palier.
 */
export const WritingEngineBadge: React.FC<WritingEngineBadgeProps> = ({ isPro, onUpgrade }) => {
  return (
    <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: `${TEAL}33`, background: '#fff' }}>
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3.5" style={{ background: `${TEAL}0d` }}>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: TEAL }}>
            <Sparkles className="h-3.5 w-3.5" />
            {isPro ? 'Moteur Rédaction Pro activé' : 'Ce que chaque offre débloque'}
          </span>
        </div>
        <span className="text-xs font-semibold" style={{ color: TEAL }}>
          {isPro ? 'Pack Pro 347€' : 'Offre 197€ vs Pack Pro 347€'}
        </span>
      </div>

      {/* Tableau comparatif */}
      <div className="px-2 sm:px-4 py-3">
        <div className="grid grid-cols-[1fr_92px_100px] sm:grid-cols-[1fr_140px_150px] items-center gap-x-2 gap-y-0">
          {/* En-têtes colonnes */}
          <div />
          <div className="text-center text-[11px] font-bold uppercase tracking-wide text-muted-foreground py-2">
            Essentiel<br />197€
          </div>
          <div className="text-center text-[11px] font-black uppercase tracking-wide py-2 rounded-t-lg" style={{ color: TEAL, background: `${TEAL}12` }}>
            <span className="inline-flex items-center gap-1"><Crown className="h-3 w-3" />Pack Pro</span><br />347€
          </div>

          {ROWS.map((row, i) => (
            <React.Fragment key={row.label}>
              <div className={`text-[12px] leading-snug text-foreground py-2 ${i > 0 ? 'border-t border-border/50' : ''}`}>
                {row.label}
              </div>
              <div className={`text-center py-2 ${i > 0 ? 'border-t border-border/50' : ''}`}>
                <Cell value={row.core} />
              </div>
              <div className={`text-center py-2 ${i > 0 ? 'border-t border-border/50' : ''}`} style={{ background: `${TEAL}08` }}>
                <Cell value={row.pro} accent />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Call to action / statut */}
      {isPro ? (
        <div className="px-4 sm:px-5 py-3 text-[12px] font-semibold" style={{ background: `${TEAL}0d`, color: TEAL }}>
          ✓ Toutes les capacités Pro ci-dessus sont actives sur votre parcours.
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3.5" style={{ background: `${AMBER}12` }}>
          <span className="text-[12px] text-foreground max-w-md">
            <strong>Passez au Pack Pro 347€</strong> pour des chapitres plus longs, une passe éditoriale automatique et le lancement de votre livre.
          </span>
          {onUpgrade && (
            <button
              type="button"
              onClick={onUpgrade}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              style={{ background: TEAL }}
            >
              Passer au Pack Pro 347€ <ArrowUpRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WritingEngineBadge;

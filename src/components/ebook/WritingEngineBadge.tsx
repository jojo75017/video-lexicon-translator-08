import React from 'react';
import { Sparkles, Check, ArrowUpRight, Gauge } from 'lucide-react';

interface WritingEngineBadgeProps {
  /** true = Pack Pro 347€ (moteur Pro), false = Base 197€ (moteur Standard) */
  isPro: boolean;
}

/**
 * Encart comparatif affiché en tête de l'outil de rédaction.
 * Objectif : montrer noir sur blanc ce que le Pack Pro 347€ apporte de plus
 * à la rédaction du livre, pour que l'acheteur comprenne la valeur.
 */
const PRO_GAINS = [
  'Chapitres plus longs et plus denses (~5000 mots vs ~3500)',
  'Passe éditoriale automatique sur chaque chapitre (densification, fluidité, exemples)',
  'Boucle qualité renforcée (score cible plus élevé, plus de tentatives)',
  'Sous-sections enrichies et plus détaillées',
];

export const WritingEngineBadge: React.FC<WritingEngineBadgeProps> = ({ isPro }) => {
  if (isPro) {
    return (
      <div className="rounded-xl border-2 border-[#008296]/40 bg-[#008296]/5 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#008296] px-3 py-1 text-xs font-bold text-white">
            <Sparkles className="h-3.5 w-3.5" />
            Moteur Rédaction Pro activé
          </span>
          <span className="text-xs font-semibold text-[#008296]">Pack Pro 347€</span>
        </div>
        <p className="text-sm text-foreground/80 mb-3">
          Votre pack débloque un moteur de rédaction supérieur. Voici concrètement ce que vous obtenez en plus de l'offre à 197€ :
        </p>
        <ul className="space-y-1.5">
          {PRO_GAINS.map((g) => (
            <li key={g} className="flex items-start gap-2 text-sm text-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#008296]" />
              <span>{g}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Le choix du modèle IA (Claude, Gemini, ChatGPT, DeepSeek, Mistral…) reste libre dans tous les paliers.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
          <Gauge className="h-3.5 w-3.5" />
          Moteur Standard
        </span>
        <span className="text-xs text-muted-foreground">Offre 197€</span>
      </div>
      <p className="text-sm text-foreground/80">
        Chapitres ~3500 mots et boucle qualité standard.
      </p>
      <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#FF9E2D]/40 bg-[#FF9E2D]/10 p-3 text-sm">
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[#FF9E2D]" />
        <span className="text-foreground">
          <strong>Passez au Pack Pro 347€</strong> pour des chapitres plus longs (~5000 mots) et une passe éditoriale automatique sur chaque chapitre.
        </span>
      </div>
    </div>
  );
};

export default WritingEngineBadge;

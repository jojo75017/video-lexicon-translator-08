import React from 'react';
import V3PricingTiers from './V3PricingTiers';

/**
 * Module « Échelle de Prix 347€ ».
 * Source unique de vérité = roadmapV3 (V3_PRICE, V3_UPSELL_PACKS, V3_FULL_PACK).
 * On réutilise le bloc tarifaire complet (base 197€ + packs à la carte + Pack
 * Tout Complet 347€) avec ses tunnels de paiement déjà branchés.
 */
const PricingLadder497: React.FC = () => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Le parcours commercial complet menant à <strong>347€</strong> : la base à 197€, les packs upsell
        à la carte, ou le <strong>Pack Tout Complet</strong> en un seul clic (−100€). Chaque CTA ouvre le
        tunnel de paiement avec choix des mensualités.
      </p>
      <V3PricingTiers />
    </div>
  );
};

export default PricingLadder497;

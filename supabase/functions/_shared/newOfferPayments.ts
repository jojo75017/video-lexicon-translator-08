export const NEW_OFFER_PAYMENTS: Record<string, { label: string; total: number; installments: number; monthly: number; first?: number }> = {
  starter27_1x: { label: 'EbookStudio Starter — accès à vie', total: 2700, installments: 1, monthly: 2700 },
  auteur97_1x: { label: 'EbookStudio Auteur — 97 € paiement unique', total: 9700, installments: 1, monthly: 9700 },
  auteur97_2x: { label: 'EbookStudio Auteur — 2 × 48,50 €', total: 9700, installments: 2, monthly: 4850 },
  auteur97_3x: { label: 'EbookStudio Auteur — 3 échéances, total 97 €', total: 9700, installments: 3, monthly: 3233, first: 1 },
  edition247_1x: { label: 'EbookStudio Édition — accès à vie', total: 19700, installments: 1, monthly: 19700 },
  edition247_2x: { label: 'EbookStudio Édition — 2 × 98,50 €', total: 19700, installments: 2, monthly: 9850 },
  edition247_3x: { label: 'EbookStudio Édition — 3 échéances, total 197 €', total: 19700, installments: 3, monthly: 6566, first: 2 },
};

// Old sessions lack this marker: their original annual rights remain unchanged.
export function isOneTimeAuteur(plan: string, purchaseModel?: string): boolean {
  return plan.startsWith('auteur97_') && purchaseModel === 'one_time';
}
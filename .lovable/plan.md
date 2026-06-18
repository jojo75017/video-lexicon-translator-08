# Pack Pro Vendeur : 497€ → 347€ (partout)

## Objectif
Rendre l'offre haute plus cohérente et plus attractive : un écart maîtrisé avec la base 197€ et une vraie économie affichée (200€ au lieu de 50€). **Tous les endroits qui mentionnent 497€ doivent être mis à jour, sans exception.**

## Nouvelle structure tarifaire
- **Base** : 197€ (inchangée) — écrire + publier + lancer.
- **Pack Pro Vendeur** : **347€** (au lieu de 497€).
  - Référence barrée (« à la carte ») : **547€** (197€ + 350€ de packs) — inchangée.
  - **Économie affichée : 200€** (au lieu de 50€).
- **Options à la carte** (Promotion, Transcription) : inchangées.

## Étape 0 — Recensement global (obligatoire)
Lancer `rg -n "497"` sur tout `src/` et `supabase/` pour lister **chaque** occurrence (data, composants, checkout, edge functions Stripe, textes marketing) avant de modifier, puis traiter chacune.

## Modifications techniques

### `src/data/roadmapV3.ts`
- `V3_FULL_PACK.price` : `497` → `347`.
- `saves` : `V3_PRICE + V3_UPSELLS_TOTAL - 347` = **200**.
- `installments` : `['1×497€', '4×129€', '6×85€']` → `['1×347€', '3×119€', '4×89€']`.
- Module `pricing-ladder-497` (l.432) : titre + description « 497€ » → 347€ et recalcul du tunnel (order bump/OTO) pour retomber sur 347€.
- Module `installment-payments` (l.434) : montants échelonnés alignés sur 347€.

### `src/components/admin/V3PricingTiers.tsx`
- Prix / compareAt / économie / facilités déjà lus depuis `V3_FULL_PACK` → automatiques.
- Commentaire d'en-tête (l.23-28) « 497€ » / « −100€ » → « 347€ » / « −200€ ».
- Vérifier qu'aucun « 497 » n'est codé en dur dans les sous-titres.

### Checkout & paiement
- `V3PackCheckout`, `V3UpsellCheckout` : vérifier tout montant/texte « 497 » en dur → 347.
- Edge functions Stripe / création de prix (si un montant 49700 centimes est codé) : aligner sur 34700, sinon créer/mettre à jour le price correspondant.

### Autres mentions
- Tout texte marketing, mémoire ou page publique citant « 497€ » → 347€.

### Mémoire projet
- Mettre à jour `mem://business/pricing/v3-ladder-497-august`, `mem://business/pricing/v3-base-packs-497` et `mem://index.md` : Pack Pro = 347€, économie 200€.

## Vérification finale
- Re-lancer `rg -n "497"` : il ne doit rester aucune référence au prix 497€ (sauf identifiants techniques type `pricing-ladder-497` conservés volontairement, à confirmer).
- Contrôle visuel du bloc Tarifs : 347€, barré 547€, « Tu économises 200€ », facilités cohérentes.

## Résultat
- Base 197€ → Pack Pro 347€ : écart de 150€, économie réelle de 200€ vs achat séparé. Contenu des packs et options à la carte inchangés.

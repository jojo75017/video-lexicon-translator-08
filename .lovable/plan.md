# Plan V3 — Lancement Octobre 2026 (en attente, à exécuter fin septembre)

**Statut : ROADMAP — aucune modification de code à faire maintenant.** Ce plan est prêt à être exécuté le moment venu. Rien ne sera cassé d'ici là. Tu peux l'approuver pour qu'il soit officialisé dans la roadmap, ou demander des ajustements.

## Décisions prises

- **Un seul V3** avec **30 agents** (fusion de l'ancien V3 22 agents + 8 agents des packs Pro). Plus de "V4" ni de "Pack Pro Vendeur" à 347€.
- **Prix de lancement : 97€** du **1er au 31 octobre 2026** (23h59).
- **Prix normal : 197€** à partir du **1er novembre 2026**.
- **Tous les modules premium** (Sélection éditeurs, Special Books, Revenus, Distribution, Social, Qualité, Étude de marché…) deviennent des **upsells** — visibles mais désactivés avec badge "Bientôt", à construire le mois suivant.
- **Paiements en plusieurs fois — one‑shot, JAMAIS d'abonnement mensuel** :
  - **Octobre (97€)** : 1×97€ · 2×49€ · 3×33€
  - **Novembre+ (197€)** : 1×197€ · 2×99€ · 3×66€
  - Stripe `mode: "payment"` uniquement. Chaque option = un prix distinct. Pas de `mode: "subscription"`.
- **Pack Full 347€ : désactivé** (les clés `v3_full_*` renvoient une erreur claire).

## Ce qui sera modifié le moment venu

### Nouveaux fichiers
- `src/data/v3LaunchPricing.ts` — `V3_LAUNCH_PRICE=97`, `V3_REGULAR_PRICE=197`, `currentV3Price()` basé sur la date, tableaux d'échéances.
- `src/components/sales/V3LaunchCountdown.tsx` — compte à rebours 1er → 31 oct, renvoie `null` après.

### Fichiers modifiés
- `src/data/roadmapV3.ts` — 30 agents, prix dynamique.
- `src/data/v3Launch.ts` — une seule offre V3 (plus de `v3-pro`).
- `src/data/v3ModuleRegistry.tsx` — flag `upsell: true` + badge "Bientôt" côté client.
- `src/components/sales/V3PricingTiers.tsx` / `PricingLadder497.tsx` — 1 seul tier + section "upsells à venir".
- `supabase/functions/stripe-checkout/index.ts` — nouvelles clés `v3_launch_1x/2x/3x` (97€, 2×49€, 3×33€) et bascule automatique sur `v3_base_1x/2x/3x` (197€, 2×99€, 3×66€) après le 31/10. `v3_full_*` retourne 400.

### Hors périmètre (à faire plus tard)
- Construction des tunnels upsell (le mois suivant).
- Emails / séquence de lancement.

## Validation prévue

1. Typecheck OK.
2. `/vente-v3` affiche 97€ (197€ barré) + countdown fonctionnel en octobre.
3. Admin `PricingLadder497` : 1 seul tier + upsells "bientôt".
4. Checkout test carte `4242…` → montant 97,00€ pendant octobre.
5. Simulation date > 1er nov → prix revient à 197€ automatiquement.

## Pourquoi rien n'est cliquable ni modifié aujourd'hui

Tu as toi‑même demandé de **mettre ce chantier en attente jusqu'au mois prochain** ("on verra cela le mois prochain à mettre en place"). Le plan est donc **archivé dans la roadmap** (`mem://business/pricing/v3-launch-october`) et prêt à être déclenché dès que tu diras "on y va". Si tu veux au contraire que je l'exécute **dès maintenant**, dis‑le explicitement et je lance l'implémentation dans la foulée.

## Piste alternative — 3 forfaits mensuels par volume (À DISCUTER, en attente)

Inspirée du modèle ViviBook (Reader / Creator / Author), gardée en réserve :

- **Forfait 1** — 10 livres / mois
- **Forfait 2** — 20 livres / mois (le plus populaire, à confirmer)
- **Forfait 3** — 50 livres / mois (Pro / Éditeur)

Tout serait **mensuel récurrent**. ⚠️ Ce modèle est en **conflit direct** avec la décision actuelle « JAMAIS d'abonnement mensuel, uniquement paiement en 1×/2×/3× ». À trancher avant d'exécuter le plan de lancement. Rien à coder tant que la décision n'est pas prise — bloc ajouté à l'onglet « En attente » du Hub V3 pour référence.

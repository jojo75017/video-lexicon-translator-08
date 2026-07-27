# Plan : Grille tarifaire V3 finalisée — 3 forfaits mensuel/annuel

## Décisions validées

| Forfait | Mensuel | Annuel | Livres/mois | Positionnement |
|---|---|---|---|---|
| **Débutant** | 9,99 € | 97 € | 20 | Entrée de gamme, essentiels V3 |
| **Expert** | 12,99 € | 117 € | 50 | Régulier, outils avancés |
| **Auteur** | 59 € | 547 € | Illimité | Tous les modules Pro + upsells inclus |

- Économie annuelle affichée : Débutant ~19 %, Expert ~25 %, Auteur ~23 %.
- **Auteur** inclut tous les upsells Pro (Cover Studio Pro, KDP Pilot renforcé, Sélection éditeurs, Amazon Spy, BD Studio, Audiobook, etc.) et les 10 traductions.
- Les modules "sas" restent payants à l'usage pour Débutant/Expert (ex : BookPerfect reste un achat/add-on séparé).

## Étapes d'implémentation

### 1. Centraliser les données tarifaires
Créer/mettre à jour `src/data/v3Pricing.ts` avec :
- Les 3 plans, leurs quotas, leurs prix mensuels/annuels, les économies.
- Les `price_id` Stripe (lookup keys) pour chaque palier : `debutant_monthly`, `debutant_yearly`, `expert_monthly`, `expert_yearly`, `auteur_monthly`, `auteur_yearly`.
- Les quotas de livres par mois (20 / 50 / illimité).
- Les flags d'accès Pro (upsells inclus).

### 2. Mettre à jour la page admin `/admin/plans-v3`
- Remplacer la grille tarifaire existante par les nouveaux montants confirmés.
- Ajouter une colonne "Quota livres/mois".
- Ajouter une ligne indiquant que BookPerfect/sas reste un add-on payant sauf pour Auteur si applicable.
- Garder la matrice A → Z déjà présente.

### 3. Créer les produits et prix Stripe
Utiliser `payments--batch_create_product` pour créer en sandbox les 3 produits avec leurs 2 prix chacun (mensuel et annuel récurrent).

| Produit Stripe | lookup_key mensuel | lookup_key annuel | Montant |
|---|---|---|---|
| EbookStudio V3 — Débutant | `debutant_monthly` | `debutant_yearly` | 999 cts / 9700 cts |
| EbookStudio V3 — Expert | `expert_monthly` | `expert_yearly` | 1299 cts / 11700 cts |
| EbookStudio V3 — Auteur | `auteur_monthly` | `auteur_yearly` | 5900 cts / 54700 cts |

Tax code : `txcd_10103001` (SaaS / services électroniques).

### 4. Adapter l'edge function de checkout
- Étendre `create-promo-checkout` ou créer `create-subscription-checkout` pour accepter un `plan_id` (`debutant`, `expert`, `auteur`) et un intervalle (`month` / `year`).
- Résoudre le prix Stripe via `lookup_key`.
- Créer une session `mode: "subscription"` pour les forfaits mensuel/annuel.
- Gérer l'order bump séparément si l'utilisateur ajoute BookPerfect/sas en plus.
- Insérer une ligne `funnel_orders` ou `subscription_orders` en pending.

### 5. Mettre à jour la logique d'entitlement côté client
- `useV3Entitlement.ts` : lire le statut d'abonnement actif (via `subscriptions` table) et le `price_id` pour mapper le plan.
- Appliquer les quotas : blocage à 20 / 50 / illimité livres par mois (via table de tracking ou compteur existant).
- Débloquer les modules Pro uniquement pour Auteur (ou selon les flags d'upsell achetés).
- Gérer le plan actuel et le renouvellement annuel.

### 6. Mettre à jour les pages de vente
- `/publication-pro` (ou `/v3/offres`) : afficher les 3 cartes avec mensuel/annuel toggle, économie, quotas.
- `/commande-v3` : passer le `plan_id` et l'intervalle choisis à la fonction de checkout.
- Mettre à jour `V3OrderForm.tsx` pour utiliser les nouveaux prix et forfaits.

### 7. Webhook Stripe et suivi
- `stripe-webhook` : écouter `checkout.session.completed` pour les abonnements et insérer/mettre à jour la table `subscriptions` avec `price_id`, `status`, `current_period_end`, `environment`.
- Gérer `invoice.payment_failed` et `customer.subscription.deleted` pour mettre à jour le statut.

### 8. Tests
- Vérifier que les 6 prix Stripe sont créés en sandbox.
- Tester un checkout test pour chaque plan (mensuel + annuel).
- Vérifier que l'entitlement bloque bien les modules Pro pour Débutant/Expert.
- Vérifier que le quota de livres/mois est respecté.

## Livrables
- `src/data/v3Pricing.ts` (source unique de vérité)
- `src/pages/admin/AdminPlansV3Page.tsx` mis à jour
- 3 produits + 6 prix Stripe créés
- Edge function de checkout étendue ou créée
- `useV3Entitlement.ts` et `V3OrderForm.tsx` mis à jour
- Webhook `stripe-webhooks` gérant les subscriptions

## Notes
- Pas de changement de compte Stripe : on reste sur le compte Robustabarista déjà connecté.
- Les anciens clients lifetime (promo 59 €) restent traités via `funnel_orders` existant ; ce plan ne concerne que les nouveaux abonnements V3.
# Plan V3 — 3 forfaits abonnement par nombre d'agents

## Objectif
Transformer l'offre V3 actuelle (one-time Base/Pro) en 3 forfaits d'abonnement clairs : **18 agents**, **22 agents**, **30 agents**, chacun avec un quota mensuel de livres, des tarifs mensuels et annuels cohérents, et un accès immédiat par abonnement Stripe.

## Grille proposée

| Forfait | Agents | Livres/mois | Chapitres max | Mots/ch | Tarif mensuel | Tarif annuel | Économie |
|---|---|---|---|---|---|---|---|
| **Débutant** | 18 | 20 | 20 | 3 500 | 9,99 € | 97 € | ~19 % |
| **Expert** | 22 | 50 | 40 | 5 000 | 12,99 € | 117 € | ~25 % |
| **Auteur** | 30 | Illimité | 60 | 8 000 | 59 € | 547 € | ~23 % |

Les modules Pro (Cover Studio Pro, KDP Pilot Pro, Sélection éditeurs, Amazon Spy, Audiobook, BD Studio) restent réservés au forfait **Auteur**.

---

## Étape 1 — Refonte de la source unique et de l'admin

- Mettre à jour `src/data/v3Pricing.ts` avec les 3 plans, leurs quotas, leurs agents et leurs prix.
- Actualiser la page admin `/admin/plans-v3` pour afficher la nouvelle grille et les tarifs mensuel/annuel.
- Nettoyer les anciennes offres one-time (`V3_OFFERS` Base 197 € / Pro 347 €) pour ne plus les présenter comme le parcours par défaut.
- Créer un objet `V3Plan` et les helpers (`priceId`, `économie annuelle`) pour être utilisé partout dans l'app.

**Livrable :** une page admin claire qui reflète la nouvelle stratégie et un fichier de données unique, prêt à être branché sur le checkout.

---

## Étape 2 — Création des produits Stripe et du pipeline d'abonnement

- Créer les 3 produits Stripe et leurs 6 prix (mensuel + annuel) via les ID pérennes :
  - `debutant_monthly` / `debutant_yearly`
  - `expert_monthly` / `expert_yearly`
  - `auteur_monthly` / `auteur_yearly`
- Vérifier que la fonction `v3-subscription-checkout` résout bien ces prix via `lookup_key` et crée des sessions `mode: "subscription"` avec `ui_mode: "embedded_page"`.
- S'assurer que `payments-webhook` écoute les événements `customer.subscription.created`, `updated`, `deleted` et écrit dans la table `subscriptions` (avec la bonne colonne `environment` et le `price_id` lisible).

**Livrable :** un flux de paiement abonnement fonctionnel en sandbox, avec webhook actif et stockage fiable des abonnements.

---

## Étape 3 — Câblage du parcours client et des droits d'accès

- Créer une page publique d'offres V3 (`/offres-v3`) présentant les 3 cartes avec bascule mensuel/annuel et économie affichée.
- Remplacer le formulaire one-time `V3OrderForm.tsx` par un checkout d'abonnement (Stripe Embedded Checkout) qui passe le `priceId` et le `userId` à `v3-subscription-checkout`.
- Mettre à jour `useV3Entitlement.ts` pour détecter un abonnement actif dans `subscriptions` (et non plus seulement dans `v3_installment_orders`), en filtrant par `environment` et `status`.
- Adapter `V3Gate` / `SubscriberGate` pour autoriser les utilisateurs avec un abonnement V3 actif (Débutant, Expert ou Auteur).
- Afficher le plan actuel dans le hub V3 et ajouter un lien « Gérer mon abonnement » vers le portail client Stripe.

**Livrable :** un utilisateur peut choisir un plan, payer, accéder au hub V3, et son abonnement est vérifié côté serveur à chaque accès.

---

## Hors périmètre de ce plan (à traiter ensuite)

- Migration des anciens clients one-time (Base/Pro) : ils conservent leur accès via un flag legacy ou une migration manuelle.
- Upsells séparés (BookPerfect, Pack Sérénité) : restent des achats one-time à côté des abonnements.
- Résiliation/upgrade/downgrade automatique : portail Stripe gère la résiliation ; l'upgrade sera traité dans un second temps.

---

**Validation :** une fois ces 3 étapes terminées, on teste un paiement sandbox sur chaque plan (Débutant mensuel, Expert annuel, Auteur mensuel) et on vérifie que l'accès au hub V3 s'ouvre bien après le retour de paiement.
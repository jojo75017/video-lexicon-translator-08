# Tableau de bord Paiements Stripe (Test vs Live)

Nouveau tableau de bord admin, accessible à toi seul, qui combine les vraies transactions Stripe (environnement test ET live) avec les commandes/confirmations déjà enregistrées dans ta base, le tout mis à jour en temps réel.

## Ce que la page affichera

1. **Chiffres clés** (par environnement, deux colonnes Test / Live)
   - Total encaissé, nombre de paiements réussis, paiements en attente, montant moyen.
2. **Statut go-live Stripe** — un panneau qui montre où en est la mise en production (étapes franchies pour accepter les vrais paiements), via le statut Stripe.
3. **Liste des transactions** — tableau détaillé : email, montant, statut, date, méthode, et un badge `TEST` (orange) ou `LIVE` (vert) pour chaque ligne.
4. **Temps réel** — quand un nouveau paiement/confirmation arrive, la liste se rafraîchit automatiquement et une notification s'affiche.

## Sources de données combinées

- **Stripe API** (test + live) : transactions réelles, montants, statuts. Lecture via une nouvelle edge function sécurisée.
- **Base interne** : `funnel_orders` (commandes) + `payment_confirmations` (confirmations manuelles) pour le suivi temps réel et les paiements en attente.

```text
┌─────────────────────────────┐
│  Dashboard Paiements (admin) │
├──────────────┬──────────────┤
│  TEST         │  LIVE         │  ← chiffres clés par env
├──────────────┴──────────────┤
│  Statut go-live Stripe        │
├──────────────────────────────┤
│  Transactions (Stripe + base) │  ← badge TEST/LIVE, temps réel
└──────────────────────────────┘
```

## Détails techniques

### Edge function `get-stripe-payments`
- Vérifie le JWT en code et confirme le rôle admin (`has_role`) avant toute lecture.
- Utilise `createStripeClient(env)` du `_shared/stripe.ts` pour appeler Stripe en **sandbox** et **live** (le live ne renvoie rien tant que les clés live ne sont pas provisionnées — géré proprement).
- Récupère les `charges`/`payment_intents` récents + agrège les totaux par environnement.
- `verify_jwt = false` dans `config.toml`, validation faite en code.

### Statut go-live
- Réutilise le statut renvoyé par le système de go-live Stripe (étapes claim → setup → install → clés → readiness) affiché en lecture seule.

### Frontend
- Nouvelle page `src/pages/admin/AdminPaymentsDashboardPage.tsx`.
- Route `/admin-paiements` protégée par `<AdminGate>` dans `App.tsx`.
- Hook de chargement qui appelle l'edge function + lit `funnel_orders` et `payment_confirmations`.
- Abonnement Realtime sur `funnel_orders` et `payment_confirmations` (souscription dans `useEffect`, nettoyage au démontage) pour le rafraîchissement live + toast.
- Composants UI existants : `Card`, `Table`, `Badge` (badge `TEST` orange / `LIVE` vert), thème KDP existant.

### Base de données
- Activer Realtime sur `funnel_orders` (et confirmer sur `payment_confirmations`) via migration `ALTER PUBLICATION supabase_realtime ADD TABLE ...`.
- Aucune nouvelle table nécessaire.

## Hors périmètre
- Pas de modification des flux de paiement existants.
- Pas d'écriture/remboursement depuis le dashboard (lecture seule).

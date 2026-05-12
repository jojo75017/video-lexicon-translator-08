## Objectif
Te permettre de voir, depuis l'admin, qui s'est inscrit via le formulaire `/promo` (lead magnet 5 niches), qui a commandé (67€ et upsells), et combien chaque affilié a généré de commissions — sans avoir à ouvrir la base de données.

## Ce qui sera ajouté

### 1. Nouvelle page admin `/admin/funnel`
Accessible uniquement aux admins (vérifié via `has_role(uid, 'admin')`), avec 3 onglets :

**Onglet "Leads" (inscriptions formulaire)**
- Tableau : Email · Prénom · Date d'inscription · Code parrain (si présent) · Source UTM · Guide envoyé ✅/❌
- Filtre période : 24h / 7j / 30j / tout
- Recherche par email
- Compteurs en haut : Total leads · Leads 7j · Leads avec parrain
- Bouton export CSV

**Onglet "Commandes"**
- Tableau : Email · Produit (main 67€ / licence 47€ / pack 25€) · Montant · Statut (pending/paid) · Méthode (stripe/paypal) · Date · Affilié
- Filtre statut : tous / payé / en attente
- Compteurs : CA total · CA 7j · Commandes payées · En attente
- Bouton export CSV

**Onglet "Affiliés & Commissions"**
- Tableau par affilié : Email affilié · Code · Nb clics · Nb commandes · Commissions totales · À payer · Payé
- Lien vers détail des commissions de chaque affilié

### 2. Lien d'accès dans l'admin existant
Ajout d'une carte "Tunnel d'acquisition" dans la page admin principale (`AdminPage.tsx`) qui mène vers `/admin/funnel`.

### 3. Test du formulaire en live (recommandé après build)
Une fois la page admin déployée, tu testes toi-même : tu vas sur `/promo`, tu remplis avec ton vrai email, tu valides → tu devrais recevoir le PDF dans ta boîte ET voir ta ligne apparaître dans l'onglet "Leads".

## Détails techniques
- 1 nouveau fichier : `src/pages/admin/AdminFunnelPage.tsx`
- 1 route ajoutée dans `App.tsx` : `/admin/funnel` protégée par `AdminGuard`
- Composants shadcn déjà présents : Tabs, Table, Card, Badge, Input
- Requêtes Supabase directes (RLS admin déjà OK sur les 3 tables)
- Aucune migration nécessaire — les RLS `Admins manage leads/orders` existent déjà

## Hors scope
- Pas de modification du formulaire `/promo` (il fonctionne, juste pas encore testé)
- Pas de notification temps-réel (rafraîchissement manuel)
- Pas de graphiques (juste tableaux + compteurs)

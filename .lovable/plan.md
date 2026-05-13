## Objectif
Créer une page admin **/admin-cockpit** réservée à toi, avec :
1. Liens rapides vers chaque étape du tunnel de lancement
2. Calendrier mensuel de tes lancements à venir (créer / éditer / supprimer)
3. Bouton d'accès depuis le header de `/espace` (visible seulement si tu es admin)

---

## 1. Base de données

Nouvelle table `admin_launches` (migration) :

| Colonne | Type | Notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid | propriétaire (toi) |
| title | text | nom du lancement |
| launch_date | date | jour cible |
| status | text | `planned` / `in_progress` / `done` |
| notes | text nullable | détails |
| color | text nullable | code couleur pastille |
| created_at / updated_at | timestamptz | defaults |

RLS : `ALL` réservé aux admins via `has_role(auth.uid(), 'admin')`.

---

## 2. Page `/admin-cockpit`

Fichier : `src/pages/AdminCockpitPage.tsx`, montée dans `src/App.tsx` derrière `<AdminGate>` (qui existe déjà).

Structure visuelle (charte KDP teal/orange) :

```text
┌─ Header ─────────────────────────────────────┐
│ ← Retour Espace      Cockpit Admin     [⎋]   │
├─ Bloc « Tunnel de lancement » ───────────────┤
│ [Capture] [Bonus] [Découverte] [Vente]       │
│ [Commande] [Paiement] [Merci] [Upsell]       │
│ [Affilié] (+ Funnel admin · CRM · Emails)    │
├─ Bloc « Calendrier des lancements » ─────────┤
│  ◀  Mai 2026  ▶            [+ Nouveau]       │
│  Grille mois : pastille colorée par jour     │
│  Liste latérale : prochains lancements       │
└──────────────────────────────────────────────┘
```

### Tunnel — liens rapides
Tuiles cliquables (réutilise `Card` joy) vers les routes existantes :
- `/promo-capture`, `/promo-bonus`, `/promo-decouverte`, `/promo-paiement`, `/promo-commande`, `/promo-merci`, `/promo-affilie`, `/promo-espace`
- Sales : `/sales`, `/upsell`, `/upsell-paiement`, `/paiement-manuel`
- Outils admin : `/admin-funnel`, `/crm`, `/sales-campaign`, `/email-preview`, `/admin-direct`

Chaque tuile : emoji + label + petit caption ("Étape 1 — Capture email"…).

### Calendrier
- Vue mois en CSS grid 7 colonnes (composant maison léger, pas de lib).
- Navigation `< mois >` avec `date-fns` (déjà installé).
- Chaque jour affiche la pastille de chaque lancement (couleur + titre tronqué).
- Clic sur un jour vide → modal « Nouveau lancement » (titre, date, statut, couleur, notes).
- Clic sur une pastille → modal édition / suppression.
- Bouton `+ Nouveau lancement` aussi en haut.
- Liste « 5 prochains lancements » à droite avec compte à rebours.

CRUD via `supabase.from('admin_launches')`.

---

## 3. Accès depuis `/espace`

Dans `src/pages/EspacePage.tsx` :
- Récupérer `has_role` (déjà fait via AuthContext → `user.role === 'admin'`).
- Si admin, ajouter un 2ᵉ bouton dans le header (à gauche du bouton « Tableau de bord ») :
  - Icône `Shield` + label « Cockpit admin » (caché < sm)
  - Style outline teal pour le distinguer du CTA principal.

---

## 4. Détails techniques

- Route : `<Route path="/admin-cockpit" element={<AdminGate><AdminCockpitPage /></AdminGate>} />`
- `AdminGate` existe déjà (`src/components/auth/AdminGate.tsx`) — bloque les non-admins.
- Pas de nouvelle dépendance, on réutilise `date-fns`, `lucide-react`, shadcn `Dialog`, `Calendar`, `Button`, `Card`, `Input`, `Select`.
- Pas de modification du workflow ebook, ni du planner, ni de l'auth.
- Couleurs : teal `#008296`, orange `#FF9E2D`, fond `#FAFAFA`, accents `joy-cream/peach/mint`.

---

## 5. Fichiers touchés
- **Nouveau** : `src/pages/AdminCockpitPage.tsx`
- **Migration** : table `admin_launches` + RLS admin
- **Modifié** : `src/App.tsx` (ajout route)
- **Modifié** : `src/pages/EspacePage.tsx` (bouton admin conditionnel)

---

## Hors-scope
- Pas de stats live conversions (à ajouter plus tard si besoin).
- Pas de checklist tunnel persistée.
- Pas de drag-and-drop kanban.
- Pas d'onglets perso supplémentaires (tu n'as pas listé lesquels — tous les outils admin existants restent accessibles via les tuiles « Outils admin »).
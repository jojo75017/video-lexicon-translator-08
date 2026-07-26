## Remplacer l'onglet "Ménage" par un "Plans V3" (récap A→Z)

### Objectif
Dans le hub admin, remplacer l'onglet "Ménage" par un nouvel onglet "Plans V3" qui affiche la matrice complète des 3 forfaits (Débutant / Expert / Auteur) de A à Z, avec les quotas et les modules débloqués.

L'ancienne page de ménage reste accessible en archivée temporairement via `/admin/cleanup` pendant le développement, puis sera supprimée dans un second temps si tu le confirmes.

---

### 1. Modifications prévues

#### A. Navigation admin (`src/components/admin/AdminPanelNav.tsx`)
- Remplacer l'item `{ label: 'Ménage', path: '/admin/cleanup', icon: Trash2 }` par `{ label: 'Plans V3', path: '/admin/plans-v3', icon: TableIcon }`.
- Sous-titre actuel inchangé ("Tous les onglets utiles + retour rapide au générateur").

#### B. Nouvelle page admin (`src/pages/admin/AdminPlansV3Page.tsx`)
Créer une page unique avec :
- `AdminPanelNav` en haut.
- Titre : "Plans V3 — Contenu A → Z".
- Tableau comparatif 3 colonnes : Débutant / Expert / Auteur.
- Lignes A → Z organisées par domaine fonctionnel (Accueil, Bibliothèque, Création, Dashboard, Édition, Export, Formatage, Génération couverture, Historique, Import, Journal IA, KDP Spy, Livres spéciaux, Marketing, Niches, Outils, Personnages, Quotas, Résiliation, Sélection éditeurs, TOC, Upgrades, Voix/Audiobook, Workflow, eXport, Yield, Zone support).
- Badges visuels : ✅ inclus · 🔒 verrouillé · (nombre) quota.
- Section récap des 8 modules Pro (P23→P30) réservés au forfait Auteur.
- Section "Tarifs à définir" avec un champ éditable pour stocker les 6 prix (mensuel + annuel × 3 forfaits) dans un `useState` local, prêt à être envoyé vers Supabase/Stripe plus tard.

#### C. Routage (`src/App.tsx`)
- Ajouter la route `/admin/plans-v3` → `AdminPlansV3Page` (lazy import ou import statique).
- Garder `/admin/cleanup` → `AdminCleanupPage` pour ne pas casser le lien si tu veux encore y accéder, mais sans navigation publique.
- (Optionnel) Redirection `/admin/cleanup` → `/admin/plans-v3` si tu confirmes que le ménage ne doit plus être visible du tout.

#### D. Nettoyage
- Si tu confirmes, supprimer `AdminCleanupPage.tsx` et sa route une fois la page "Plans V3" validée en preview.
- Mettre à jour le sitemap si nécessaire (peu impactant en interne).

---

### 2. Contenu affiché dans la page (source de vérité)

Le contenu réutilisé sera le récap A→Z du plan précédent :

- **Débutant** : 15 livres/mois, 22 agents (P1→P22), max 20 chapitres / 3 500 mots/chapitre, modules Pro verrouillés.
- **Expert** : 30 livres/mois, 22 agents (P1→P22), max 40 chapitres / 5 000 mots/chapitre, modules Pro verrouillés.
- **Auteur** : livres illimités, **30 agents** (P1→P30), max 60 chapitres / 8 000 mots/chapitre, tous les modules Pro inclus.

Modules Pro réservés Auteur : Cover Studio Pro (P23), Passe éditoriale (P24), Séries & Tomes (P25), Sélection éditeurs (P26), KDP Spy (P27), Amazon Spy (P28), Audiobook Studio (P29), BD Studio (P30).

---

### 3. Vérification

1. `tsgo` : pas d'erreur d'import.
2. Preview admin : l'onglet "Plans V3" apparaît, cliquable, affichage correct desktop + mobile.
3. L'ancien onglet "Ménage" n'apparaît plus dans la barre de navigation.
4. Aucune route cassée.

---

### 4. Livrables

- `src/pages/admin/AdminPlansV3Page.tsx` (nouveau)
- `src/components/admin/AdminPanelNav.tsx` (modifié)
- `src/App.tsx` (modifié, route ajoutée)
- Optionnel : suppression de `AdminCleanupPage.tsx` et de la route `/admin/cleanup` si tu confirmes.

**Aucune base de données modifiée. Aucun edge function modifié. Uniquement UI admin.**
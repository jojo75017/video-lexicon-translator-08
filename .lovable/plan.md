## Problèmes identifiés

1. **Page Niches** : le bouton "Retour au Générateur d'Ebook" existe mais il est noyé dans le header de la page (haut centre). Sur l'onglet "🏆 30 Best-Sellers" (sous-composant `BestSellersTab`), il n'y a aucun bouton de retour. L'utilisateur se sent piégé.
2. **Générateur d'Ebook** : pas de tableau de bord clair qui explique *où on en est*, *ce qu'on a fait*, et *ce qu'il reste à faire*. Le `EbookGlobalDashboard` actuel est trop technique, sans graphiques de progression visuels ni guidage pédagogique.

## Plan d'action

### 1. Bouton "Retour au Générateur" toujours visible (Niches)

Dans `src/pages/NichesPage.tsx` :
- Ajouter une **barre supérieure sticky** (top-0, z-50, fond blanc/blur) contenant :
  - À gauche : bouton **"← Retour au Générateur d'Ebook"** (teal #008296 KDP, toujours visible quel que soit l'onglet, y compris Best-Sellers)
  - À droite : compteur "X niches disponibles"
- Garder le grand CTA dans le header existant pour la cohérence visuelle.
- Ajouter aussi un **bouton flottant "← Générateur"** en bas à gauche (mobile + desktop) pour accès permanent au scroll.

### 2. Nouveau Tableau de Bord Pédagogique : `EbookProgressDashboard`

Création de `src/components/ebook/EbookProgressDashboard.tsx` — un tableau de bord visuel et pédagogique affiché en tête de l'onglet "Dashboard" du générateur (`EbookPlannerPage.tsx`).

**Sections du tableau de bord** (style Amazon KDP, fond #FAFAFA, accent teal #008296) :

#### A. Bandeau "Où en êtes-vous ?" (statut global)
- Grande barre de progression globale (0 → 100 %) calculée sur 5 jalons : Concept ✓ / Plan chapitres ✓ / Rédaction ✓ / Couverture ✓ / Export KDP ✓
- Badge dynamique : "Phase 1 : Conception" / "Phase 2 : Rédaction" / "Phase 3 : Édition" / "Phase 4 : Publication"
- Sous-titre pédagogique adaptatif : *"Prochaine étape recommandée : générer votre plan de chapitres dans l'onglet Plan."*

#### B. KPI Cards (4 cartes, style `CrmStats`)
- **Mots écrits** / objectif (ex : 12 450 / 25 000) avec icône `FileText`
- **Chapitres complétés** (ex : 4 / 8) avec icône `BookOpen`
- **Temps estimé restant** calculé (ex : ~3 h) avec icône `Clock`
- **Score qualité KDP** (% conformité couverture, description, mots-clés) avec icône `CheckCircle2`

#### C. Graphiques (Recharts, déjà utilisé dans `CrmAnalytics`)
- **Progression chapitres** (BarChart horizontal) : pour chaque chapitre, mots écrits vs objectif, couleur teal si OK, orange #FF9E2D si en retard
- **Répartition des tâches** (PieChart) : Plan / Rédaction / Couverture / Marketing / Export — pourcentage fait vs restant
- **Timeline** (AreaChart 7 derniers jours) : mots écrits par jour pour montrer la régularité

#### D. Bloc "Que faire maintenant ?" (guidage pédagogique)
- 3 cartes d'actions recommandées avec icône, titre, description courte et bouton CTA qui change l'onglet actif :
  - Si pas de plan → *"Créez votre plan de chapitres"* (vers onglet Plan)
  - Si plan OK mais peu rédigé → *"Rédigez votre prochain chapitre"* (vers Rédaction)
  - Si rédaction avancée → *"Générez votre couverture KDP"* (vers Couverture)
  - Si tout OK → *"Préparez votre publication Amazon"* (vers Export)
- Logique adaptative basée sur l'état réel du projet (chapters[], coverImageUrl, kdpDescription...)

#### E. Mini-checklist visuelle
- 8-10 items avec ✓/⚪ pour rassurer l'utilisateur sur tout ce qu'il a déjà accompli (Titre défini, Public cible défini, Préface rédigée, Plan validé, etc.)

### 3. Intégration dans le générateur

Dans `src/pages/EbookPlannerPage.tsx` :
- Importer `EbookProgressDashboard`
- L'afficher en haut de l'onglet "dashboard" (avant le `WorkflowDashboard` existant) avec les props : `chapters`, `title`, `author`, `coverImageUrl`, `kdpDescription`, `kdpKeywords`, `targetWordsPerChapter`, et un callback `onNavigateToTab` pour les CTA contextuels.

## Détails techniques

- **Pas de nouvelles dépendances** : Recharts, framer-motion, lucide-react et shadcn (Card, Progress, Badge, Button) sont déjà installés.
- **Charte respectée** : fond #FAFAFA, accent teal #008296, hover #FF9E2D, texte #232F3E (mémoire `style/charte-graphique-amazon-kdp-reposant`).
- **Pas de données simulées** : tous les graphiques se basent sur l'état réel du projet (chapters, kdpDescription, etc.). Si une donnée est absente → message "À compléter" plutôt qu'un faux chiffre (mémoire Core "No fake data").
- **Aucune modification** des fichiers `EbookAICoverStudio.tsx`, `generate-ai-cover/index.ts`, `client.ts`, `types.ts`.

## Ce qui n'est pas dans ce plan

- Refonte du `WorkflowDashboard` existant (volumineux, 444 lignes — rester additif).
- Nouvelles fonctionnalités back-end ou edge functions.
- Pas de touche aux génériques ebook déjà fonctionnels.

Une fois le plan approuvé, je passerai en mode build pour implémenter ces deux changements.
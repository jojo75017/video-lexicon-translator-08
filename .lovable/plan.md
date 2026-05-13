## Audit UX — pourquoi les abonnés se perdent

J'ai regardé l'app dans son ensemble (App.tsx, Dashboard, EbookPlannerPage, navigation P1‑P15, dossier `pages/`). Voici l'état réel et ce que je propose.

### Constat

1. **80+ pages routables** dans `App.tsx`. Beaucoup d'entrées font des choses proches (génération, marketing, formations, audio, etc.). Il n'existe pas de "porte d'entrée unique" claire pour un abonné qui se connecte.
2. **`EbookPlannerPage` = monolithe de 3 665 lignes** avec une trentaine d'onglets (`workflow-dashboard`, `planner`, `images-generator`, `images-library`, `cover`, P1‑P15…). Le pilier réel (P1→P15) est noyé au milieu d'outils annexes.
3. **Trois "dashboards" différents** coexistent : `Dashboard.tsx` (admin/stats), `EbookHeroDashboard`, `EbookGlobalDashboard`, `EbookJourneyDashboard`, `WorkflowDashboard`. L'abonné ne sait pas lequel est "le sien".
4. **Pas d'écran d'accueil abonné** : après login, on tombe directement dans le planner sur le dernier onglet mémorisé. Aucune vue "Mes projets / Reprendre / Nouveau livre / Audio / Coloriage".
5. **Sous‑outils dispersés** sans regroupement : BD Studio, Coloriage, Audiobook, Audio Express, Recipe, Travel, Coaching VIP, Forum, Niches, KDP Keyword, etc. Chacun a sa route et son look.
6. **Trop de chemins parallèles vers la même action** : "Générer un livre" est accessible depuis le Dashboard, le Hero, le Journey, le menu latéral, le bouton flottant Ebookbot, l'onboarding… ce qui crée de la friction décisionnelle.
7. **Wording incohérent** : "Générateur", "Workflow", "Pipeline 15 agents", "Planner", "Studio" — tout désigne grosso modo la même chose.

### Objectif du chantier

Faire qu'un abonné qui se connecte sache en **moins de 5 secondes** : où il en est, ce qu'il doit faire ensuite, et où aller pour les outils annexes — **sans rien supprimer** de l'existant.

### Plan d'action (3 lots, frontend uniquement)

**Lot 1 — Page d'accueil abonné unique `/espace`**

Créer `src/pages/EspacePage.tsx` : seule page que voit l'abonné après login. Elle remplace la redirection actuelle `/` → `/offres` pour les utilisateurs connectés.

Contenu (4 blocs verticaux, design KDP Amazon existant) :
- **Bloc "Reprendre"** : dernier projet ouvert + bouton "Continuer P‑X" (lit `localStorage.ebook_planner_active_tab` + dernier `project_id`).
- **Bloc "Mes livres"** : liste des `ebook_projects` (3 derniers + lien "Voir tout").
- **Bloc "Créer du neuf"** : 4 grosses cartes — Ebook (P1‑P15) · Audiobook · Coloriage · BD. Chaque carte = 1 phrase + 1 bouton.
- **Bloc "Aller plus loin"** : accordéon discret avec Marketing / KDP Tools / Formations / Forum / Coaching VIP.

**Lot 2 — Simplifier `EbookPlannerPage`**

Sans casser l'existant :
- Réduire la barre d'onglets visible à **3 modes** : `Workflow IA (P1‑P15)` · `Manuscrit` · `Studio Image & Couverture`. Tout le reste passe dans un menu "Plus" (popover).
- Toujours ouvrir par défaut sur `workflow-dashboard` (vue Kanban des 15 agents) au lieu du dernier onglet mémorisé quand le projet est neuf.
- Ajouter un **fil d'Ariane permanent** en haut : `Mon espace › Projet "X" › P4 Rédaction` avec retour 1‑clic.
- Ajouter une **barre de progression P1→P15** sticky en haut (4 phases : Créer / Optimiser / Publier / Bonus) — le composant `WorkflowNavigation` existe déjà, il faut juste le rendre sticky et toujours visible.

**Lot 3 — Cohérence visuelle & wording**

- Renommer dans toute l'UI : "Générateur", "Workflow", "Pipeline" → **"Atelier d'écriture"** (un seul terme).
- Ajouter sur chaque page abonnée un header commun `<EspaceHeader />` avec : logo, "Mon espace" (retour `/espace`), nom du projet, avatar, déconnexion. Supprime la sensation de "pages éparpillées".
- Masquer du menu abonné les pages purement admin/marketing (`/dashboard-marketing`, `/crm`, `/gestion-prospects`, `/apercu-emails`) — déjà protégées par `AdminGate`, mais elles polluent encore l'imaginaire.

### Détails techniques

- Nouveaux fichiers : `src/pages/EspacePage.tsx`, `src/components/layout/EspaceHeader.tsx`, `src/components/espace/ResumeProjectCard.tsx`, `src/components/espace/CreateNewGrid.tsx`.
- Modif `App.tsx` : route `/espace` (sous `SubscriberGate`), rediriger `/` vers `/espace` si `isAuthenticated`, sinon `/offres`.
- Modif `EbookPlannerPage.tsx` : ajouter `EspaceHeader` + barre `WorkflowNavigation` sticky + popover "Plus" pour onglets secondaires. Aucune logique métier touchée.
- Mémoire à mettre à jour : ajouter une règle "L'entrée abonné canonique est `/espace`" dans `mem://index.md`.
- Aucune migration DB, aucun edge function modifié.

### Hors périmètre (pour garder la stabilisation)

- Pas de refactor de `EbookPlannerPage` (juste habillage).
- Pas de suppression de pages.
- Pas de changement du pipeline P1‑P15 ni de l'export.

Si tu valides, je commence par le **Lot 1** (page `/espace`) — c'est ce qui change le plus la perception sans risque technique.
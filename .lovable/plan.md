## Tableau de bord générateur — version "Wow Factor"

Cible : l'onglet **Dashboard** du générateur d'ebook (`workflow-dashboard` dans `EbookPlannerPage.tsx`), pas la page /offres. Aujourd'hui ce dashboard affiche `EbookProgressDashboard` + `WorkflowDashboard` (très techniques). Objectif : ajouter en tête un dashboard inspirant qui combine vrai état du projet + exemples concrets de livres pour donner envie d'agir.

### 1. Nouveau composant `EbookHeroDashboard.tsx`

Placé **au-dessus** de `EbookProgressDashboard` dans le case `workflow-dashboard`. Sections de haut en bas :

**A. Hero animé**
- Grand bandeau dégradé teal→orange (palette KDP mémorisée).
- Titre dynamique :
  - Si projet vide : « Créez votre prochain best-seller Amazon KDP »
  - Sinon : « Votre livre "{title}" est à {progress}% — continuons ! »
- Sous-titre avec compteur animé (mots écrits / objectif), badge "Niveau" (Brouillon → Manuscrit → Prêt KDP).
- 2 CTA : « ▶ Continuer maintenant » (saute à la prochaine étape réelle) et « 🪄 Lancer le Workflow IA 15 Agents ».
- Décor : étoiles SVG flottantes (animate-pulse), petit mockup 3D de couverture (`EbookBookMockup3D` existant) si `coverImageUrl` présent, sinon silhouette placeholder cliquable → onglet Couverture.

**B. Bandeau "Inspirez-vous des best-sellers"**
- Carrousel horizontal (scroll-snap) de 6-8 livres réels tirés de `src/data/bestSellers2026.ts` (déjà en mémoire — *Atomic Habits*, *Psychology of Money*, *Ikigai*, etc.).
- Chaque carte : mini-cover (placeholder coloré + titre stylé), genre, BSR estimé, 1 phrase « Pourquoi ça marche », bouton « 📋 Utiliser cette structure » → préremplit titre/genre/audience et ouvre l'onglet Plan.
- Filtre rapide par catégorie (Business, Dev perso, Santé, Fiction, Enfants).

**C. Grille "3 prochaines étapes pour vous"**
- Calcul intelligent basé sur état réel (titre vide ? plan vide ? <50% rédigé ? pas de couverture ? pas de description KDP ?).
- 3 grandes cartes illustrées (icône + couleur pillar) avec : numéro d'étape, durée estimée, mini-progress bar, bouton « Y aller ».
- Effet hover-scale + halo orange.

**D. Preuves & motivation**
- 4 KPI animés en grand format (CountUp via simple `useEffect`) : mots écrits aujourd'hui, chapitres terminés, score KDP /100, jours d'avance.
- Témoignage rotatif (3 citations utilisateurs ebookstudio.fr) + logos « Disponible sur Amazon KDP / Kobo / Apple Books ».

**E. Galerie "Livres créés avec EbookStudio"** (exemples)
- 6 vignettes de couvertures exemples (titres fictifs réalistes par niche : *La Méthode 90 Jours*, *Recettes Healthy Express*, *L'Atelier Aquarelle*…) générées en CSS pur (gradient + typo) — aucune image externe, conformément aux règles photoréalistes.
- Au clic : ouvre une modale « Voici comment ce livre a été structuré » avec plan + description type, bouton « Démarrer un projet similaire ».

### 2. Données

- Réutiliser `src/data/bestSellers2026.ts` (déjà existant).
- Créer `src/data/ebookExamples.ts` : tableau de 6 exemples de livres "réussis" (titre, sous-titre, niche, plan en 8 chapitres, description KDP type, mots-clés, palette de couverture). Données statiques, aucun fake stat.

### 3. Intégration

Dans `src/pages/EbookPlannerPage.tsx` case `workflow-dashboard` (vue classique), insérer `<EbookHeroDashboard …/>` **avant** `<EbookProgressDashboard …/>`. Props : titre, auteur, chapters, coverImageUrl, kdpDescription, callbacks `onNavigateToTab`, `onApplyExample(example)` (qui setState titre/genre/audience/numberOfChapters et bascule sur l'onglet Plan).

### 4. Style & animations

- Palette mémorisée : `#FAFAFA` fond, `#008296` teal, `#FF9E2D` accent orange hover, `#232F3E` texte.
- Animations Tailwind déjà disponibles : `animate-fade-in`, `animate-scale-in`, `hover-scale`, transitions 300ms.
- Aucune dépendance nouvelle (Recharts, framer-motion, lucide, shadcn déjà installés).

### Ce qui n'est PAS touché

- `/offres`, `EbookGlobalDashboard`, `WorkflowDashboard`, `EbookAICoverStudio`, edge functions, `client.ts`, `types.ts`, `supabase/config.toml`.
- Aucune fausse statistique ni `Math.random` (règle mémoire).

### Fichiers

- **Créer** : `src/components/ebook/EbookHeroDashboard.tsx`, `src/data/ebookExamples.ts`
- **Modifier** : `src/pages/EbookPlannerPage.tsx` (ajout import + insertion ~ligne 1324)

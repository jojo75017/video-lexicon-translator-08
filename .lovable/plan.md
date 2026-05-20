# Refonte premium du générateur (`/ebook-planner`)

Direction choisie : **Magazine archive dense** — palette Cloud White (#fafbfc / #e8ecf1 / teal #008296 / orange #FF9E2D), Instrument Serif + Work Sans, layout magazine éditorial.

## Périmètre (UI uniquement)

Je ne touche **pas** au workflow IA, ni à la logique des 15 agents, ni aux exports. Je refais uniquement l'**en-tête + le hero** de `/ebook-planner` (le bloc sombre actuel "La Belle-sœur" + toutes les barres au-dessus). Le fichier `EbookPlannerPage.tsx` fait 3741 lignes — je n'éditerai que les sections de présentation du haut.

## Ce qui change

1. **Suppression du bandeau sombre actuel** ("La Belle-sœur" sur fond noir) → remplacé par un cadre éditorial clair sur fond `#fafbfc`.
2. **Nouveau hero magazine** (dans un nouveau composant `src/components/ebook/EbookPlannerHero.tsx`) :
   - Cadre `border border-[#e8ecf1] shadow-sm` centré max-w-6xl
   - Header centré : pastille teal `15 AGENTS IA · ÉDITION AMAZON KDP`
   - Titre du projet en **Instrument Serif italique** taille 5xl→7xl (dynamique : reprend `ebookTitle` du projet courant ; fallback "Nouveau manuscrit")
   - Sous-titre éditorial calme
   - CTA unique orange `CRÉER MON EBOOK (WORKFLOW IA)` qui déclenche l'action existante (lancement du workflow)
3. **Grille magazine sous le hero (12 cols)** :
   - **Aside gauche (4 cols)** : "Parcours de Création" → liste verticale numérotée des 15 agents (P1→P15) avec puce teal au hover, libellés tirés de la config existante `WORKFLOW_STEPS`. État courant (P en cours) mis en avant en `bg-[#e8ecf1] font-bold`.
   - **Main droite (8 cols)** :
     - "Projets récents" : cartes 3/4 avec mini-couverture (couleur dérivée du genre), titre italique, badge teal "% complété" ou "Prêt pour KDP" — données réelles de `useEbookDatabase` (pas de mock).
     - Divider hairline.
     - "Modèles & Structures" : boutons outline en small-caps tirés des templates existants (`src/data/ebookTemplates.ts`).
4. **Footer barre de statut** : `EBOOKSTUDIO — SYSTÈME D'ÉDITION ÉDITORIAL` + pastille verte animée "IA Connectée" (basée sur `useOpenAIConfig`).
5. **Nettoyage** : retirer la duplication d'onglets/pillules colorées (Plan/Écrire/Habiller/Publier/Vendre) du *haut* de la page — elles restent disponibles via la sidebar existante (pas de duplication). Les onglets `Tableau de bord IA / Plan du livre / Personnages / Modèles / Importer un doc / Mes projets` sont préservés mais déplacés **sous** le hero, en barre éditoriale fine alignée avec la grille (pas de pillules colorées géantes).

## Préservation

- Toutes les routes, hooks, sauvegardes (`ebook-planner-autosave`), workflow P1→P15, sidebar, breadcrumb "Mon espace" restent intacts.
- Les boutons `Sauvegarder`, `Nouveau`, `Ambiances`, `Retour au tableau de bord` sont **conservés** mais déplacés en barre d'action discrète juste sous le footer du hero, en style éditorial (pas de gradients orange brillants).
- Le bandeau promo "Lancement public le 1er juillet 2026" reste tout en haut (hors scope).
- Le badge IA actif (OpenRouter/GPT-4o) reste mais redessiné en bande plate fine teal sous le bandeau promo (pas un gros bloc vert turquoise).

## Tokens (à ajouter à `src/index.css` si manquants)

```css
--editorial-bg: 210 20% 98%;       /* #fafbfc */
--editorial-surface: 213 20% 92%;  /* #e8ecf1 */
--editorial-accent: 187 100% 26%;  /* #008296 teal KDP */
--editorial-cta: 32 100% 59%;      /* #FF9E2D orange */
--editorial-ink: 215 24% 19%;      /* #232F3E */
```
Polices : ajouter `Instrument Serif` + `Work Sans` à `index.html` (Google Fonts), et tokens Tailwind `font-serif-editorial` / `font-sans-editorial`.

## Détails techniques (pour info)

- Le composant `EbookPlannerHero` reçoit en props : `projectTitle`, `currentStepId`, `onLaunchWorkflow`, `recentProjects`, `templates`, `aiConnected`.
- Les 15 agents sont mappés depuis la constante `WORKFLOW_STEPS` déjà présente dans `EbookCompleteWorkflow.tsx` (j'exporterai juste la liste si elle n'est pas déjà accessible).
- Mocks interdits par la charte projet : si `recentProjects` est vide → afficher une carte CTA "Créer votre premier livre" au lieu de fausses entrées.
- Pas de refactor du monolithe `EbookPlannerPage.tsx` (interdit par memory) — j'extrais juste l'en-tête.

## Hors scope (V3)

- Mockup 3D photoréaliste de la couverture (sera fait après le test vidéo).
- Redesign du bloc workflow lui-même (les cartes P1→P15 actuelles restent inchangées).
- Refonte du panneau "Plan du livre / Personnages / Modèles" (autres onglets).

---

**Tu approuves ?** Une fois validé, je crée `EbookPlannerHero.tsx`, j'ajoute les tokens CSS + les polices, et je remplace uniquement le bloc d'en-tête dans `EbookPlannerPage.tsx`. Pas de touche au workflow IA — tu pourras enchaîner le test des chapitres juste après.

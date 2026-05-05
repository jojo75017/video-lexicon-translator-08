## Contexte

Une page complète de recherche de mots-clés Amazon KDP existe déjà :
- Route : `/kdp-keywords` (protégée membres via SubscriberGate)
- Fichier : `src/pages/KdpKeywordResearchPage.tsx`
- Branchée sur Gemini BYOK (clé personnelle de l'utilisateur)
- Modes : recherche auto, par niche, par titre, longue traîne, "Backend 7 mots-clés Amazon"
- Tri par volume / difficulté / opportunité, export, copier, sélection multiple

Aucune nouvelle page, aucun nouvel edge function, aucune nouvelle clé API n'est nécessaire. Il suffit de **rendre cet outil visible et attractif** depuis le dashboard.

## Ce qui change

### 1. Mini-widget en haut du dashboard (`/ebook-planner`)

Insertion d'un nouveau bloc dans `src/pages/EbookPlannerPage.tsx`, **juste après le bandeau hero "Votre livre Amazon KDP mérite d'être lu"** et avant la vitrine 6 livres Amazon.

Apparence : carte horizontale aux couleurs Amazon KDP (fond blanc, bordure teal `#008296`, accent orange `#FF9E2D` au hover), avec :
- Icône loupe/Sparkles à gauche
- Titre : « Trouvez les mots-clés qui vendent sur Amazon »
- Sous-titre court : « Volume, difficulté, opportunité, longue traîne et backend 7 mots-clés Amazon — généré par IA »
- Champ de saisie rapide (sujet ou titre du livre, pré-rempli avec `ebookTitle` s'il existe)
- Bouton CTA orange : « Rechercher »

Action du bouton : `navigate('/kdp-keywords?title=' + encodeURIComponent(seed))` — la page existante lit déjà le param `title` via `useSearchParams`.

État local : un seul `useState<string>` pour le champ. Pas de logique IA dans ce widget — il sert uniquement de point d'entrée attractif.

### 2. Visible dans les deux modes (Simple et Workflow)

Le widget est placé **au-dessus** du sélecteur Simple/Workflow et du plan, donc affiché identiquement quel que soit le mode choisi.

### 3. Entrée dans la sidebar gauche

Dans la sidebar `Ebook Studio › Suis les 5 étapes`, ajouter sous "Tous les outils" (section AVANCÉ) une ligne dédiée :
- Icône : `Search` (lucide)
- Label : « Mots-clés KDP »
- Cible : `/kdp-keywords`

Localiser le composant qui rend cette sidebar (probablement `src/components/ebook/EbookSidebar.tsx` ou similaire) et y insérer l'item.

## Détails techniques

| Élément | Valeur |
|---|---|
| Fichier principal modifié | `src/pages/EbookPlannerPage.tsx` |
| Sidebar modifiée | composant sidebar du planner (à confirmer à l'implémentation) |
| Page cible | `/kdp-keywords` (déjà existante, déjà SubscriberGate) |
| Param URL | `?title=<sujet>` |
| Couleurs | tokens existants : `bg-card`, `border-primary` (teal), `bg-accent` (orange) |
| Auth | aucun changement (gating déjà actif sur la route cible) |
| Backend | aucun changement (Gemini BYOK déjà en place) |

## Hors scope

- Pas d'édition de la page `KdpKeywordResearchPage` elle-même
- Pas de nouveau widget de résultats inline (l'utilisateur a choisi "mini widget en haut + page complète")
- Pas d'accès visiteur non connecté (réservé membres, conformément au choix utilisateur)
- Pas d'ajout de Perplexity ni Firecrawl

## Résultat attendu

Dès l'arrivée sur le dashboard, le membre voit immédiatement un encart attractif l'invitant à découvrir un outil concret et utile (recherche de mots-clés Amazon KDP), ce qui sert à la fois d'**outil pratique** et d'**aimant marketing** mettant en avant la valeur de la suite.

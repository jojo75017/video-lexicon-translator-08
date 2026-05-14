# Plan — Rendre le haut du Planner plus jovial (sans rien casser)

## Objectif
Donner au haut de `/ebook-planner` (et pages similaires) un ton plus chaleureux : contenu **centré**, **titres plus grands**, et **petits encarts à icônes** pour les infos clés. Aucune logique métier touchée — uniquement présentation.

## Périmètre (UI uniquement)
Trois zones visibles sur la capture :

1. **Bandeau "IA active"** (`src/components/ebook/WorkflowAIProviderBadge.tsx`)
2. **Encart de bienvenue "Bienvenue sur EbookStudio !"** (composant onboarding banner — à localiser : probablement `src/components/onboarding/FirstVisitBanner.tsx`)
3. **Barre du bas Planner** "Retour au tableau de bord / Sauvegarder / + Nouveau" (dans `EbookPlannerPage.tsx`)

Le **bouton flottant orange (4)** et le **bandeau promo "Lancement public 1er juillet"** restent inchangés (ils sont déjà bien identifiés visuellement et utilisés ailleurs).

## Changements visuels

### 1. Bandeau IA active — version "carte joviale"
Avant : ligne fine, texte aligné à gauche, teal pâle.  
Après :
- Carte centrée `max-w-3xl mx-auto`, fond **dégradé doux** `from-[#008296]/8 via-white to-[#FF9E2D]/8`, bordure `border-[#008296]/20`, `rounded-2xl`, `shadow-sm`
- **Icône ronde** à gauche dans une pastille teal (CheckCircle2 ou Sparkles, h-6 w-6)
- **Titre plus gros** : `text-base md:text-lg font-bold text-[#232F3E]` → ex. "✨ IA active : Google Gemini"
- Sous-titre discret `text-xs text-[#5b6675]` → "Tous les agents P1–P15 utiliseront ce modèle"
- Boutons "Tester" et "Changer" conservés à droite, mêmes handlers

### 2. Bandeau bienvenue — encart à icône centré
- Garde le composant existant, mais centre le texte : `text-center` + `mx-auto max-w-2xl`
- Titre passé en `text-lg font-bold` avec emoji 👋 conservé
- Icône Sparkles dans un cercle pastel orange (`bg-[#FF9E2D]/15 rounded-full p-3`)
- CTA "Voir le guide" inchangé

### 3. Barre actions Planner — boutons plus chaleureux
- Conteneur centré `flex justify-center gap-3` au lieu de `justify-between`
- "Retour" → bouton ghost discret à gauche (position absolute) pour garder le centrage visuel
- "Sauvegarder" et "+ Nouveau" : `rounded-full`, `text-base`, `shadow-md`, icônes h-5
- Couleur Sauvegarder : teal solide ; Nouveau : orange (déjà le cas)

## Garde-fous (rien ne casse)
- **Aucune** modification de :
  - `aiWritingService.ts`, `geminiService.ts`, exporters, hooks
  - Logique de test de clé, ouverture du dialog, navigation
  - Props/handlers des boutons existants
- Modifs limitées aux **classes Tailwind** et **structure JSX présentationnelle** dans 3 fichiers
- Couleurs prises sur la charte mémoire (`#008296`, `#FF9E2D`, `#232F3E`, `#FAFAFA`)
- Le composant `WorkflowAIProviderBadge` est déjà partagé : la nouvelle apparence se propage automatiquement aux autres pages (`/kdp`, `/audit-pilot`, etc.) — comportement cohérent voulu

## Fichiers à éditer
1. `src/components/ebook/WorkflowAIProviderBadge.tsx` — refonte visuelle de la carte
2. `src/components/onboarding/FirstVisitBanner.tsx` (à confirmer après lecture) — centrage + icône
3. `src/pages/EbookPlannerPage.tsx` — barre d'actions du bas centrée

## Hors périmètre
- Bouton flottant orange (4) : conservé tel quel
- Bandeau promo haut : conservé tel quel
- Sidebar, navigation, modales : non touchés
- Aucun changement business / data / API

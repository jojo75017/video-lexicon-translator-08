

## Diagnostic

L'utilisateur dit que sur `/offres`, **on ne voit pas les outils** et que les visiteurs sont perdus. Il pointe vers `kdp-rocket.fr/#outils` comme référence : leur section outils est claire, visuelle, immédiatement identifiable.

Sur notre page actuelle, le composant `AgentsShowcase` existe avec mockups, mais il y a 2 problèmes probables :
1. **Visibilité** : la section est noyée dans la page, pas de point d'entrée évident depuis le hero
2. **Lisibilité** : les 15 agents en grille sans regroupement visuel = mur d'info indigeste

## Plan — Rendre les outils ULTRA visibles

### 1. Ancre `#outils` directe + CTA hero
- Ajouter un CTA "Voir les 15 outils" en gros sous le hero qui scroll vers `#outils`
- L'URL `ebookstudio.fr/offres#outils` devient partageable comme chez le concurrent

### 2. Refonte `AgentsShowcase.tsx` en 5 piliers visuels
Au lieu d'une grille plate de 15 cartes, regrouper par **pilier** avec gros titre + couleur :

```
┌─ ✍️ ÉCRIRE (7 outils) ───────────────────┐
│ [P1][P3][P4][P5][P9][P10][P13]          │
└──────────────────────────────────────────┘

┌─ 🎨 VISUELS (2 outils) ──────────────────┐
│ [Couvertures IA][Éditeur Canva]         │
└──────────────────────────────────────────┘

┌─ 🎙️ AUDIO (2 outils) ───────────────────┐
│ [Audiobook TTS][Audio Express]          │
└──────────────────────────────────────────┘

┌─ 📊 KDP (8 outils) ──────────────────────┐
│ [P2][P6][P7][P8][P11][P12][P14][P15]    │
└──────────────────────────────────────────┘

┌─ 🚀 MARKETING (2 outils) ────────────────┐
│ [Plan lancement][Marketing posts]       │
└──────────────────────────────────────────┘
```

Chaque carte garde son mockup screenshot + nom + temps d'exécution.

### 3. Compteur d'outils géant en tête de section
Comme KDP Rocket affiche "12 outils" en énorme, on affiche :

> **21 OUTILS PRO** dans une seule plateforme
> *(15 agents IA + 6 studios visuels/audio/marketing)*

Avec les 5 icônes piliers en sous-titre.

### 4. Mini-nav sticky sous le hero (déjà créée → la rendre VISIBLE)
Le composant `ToolsNavigationBar.tsx` existe déjà. Vérifier qu'il :
- Est bien intégré dans `SalesPage.tsx` juste après le hero
- A un fond contrasté (pas transparent)
- Affiche les 5 piliers cliquables avec compteur (ex: "Écrire (7)")

### 5. Section "Voir tous les outils" avant le pricing
Ajouter un récapitulatif type tableau comparatif :
```
21 outils — 67€ à vie
✍️ 7 outils écriture
🎨 2 studios visuels
🎙️ 2 outils audio
📊 8 outils KDP
🚀 2 outils marketing
```

## Question avant exécution

Souhaitez-vous :
- **A** — Refonte complète des 5 points (1h30) → page beaucoup plus claire
- **B** — Uniquement points 1+2+3 (45 min) → focus sur la visibilité de la section outils
- **C** — Uniquement point 4 (15 min) → juste rendre la barre de nav visible

Si pas de réponse : **A** par défaut.

## Livrables
- **Refonte** : `src/components/sales/AgentsShowcase.tsx` (regroupement par pilier + compteur géant)
- **Vérif/fix** : `src/components/sales/ToolsNavigationBar.tsx` (visibilité)
- **Modifié** : `src/pages/SalesPage.tsx` (CTA hero "Voir les 21 outils" + récap avant pricing)
- **Nouveau** (optionnel) : `src/components/sales/ToolsCounterBanner.tsx` (bannière "21 outils")


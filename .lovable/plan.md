## Constat

Sur `/ebook-planner` tu remontes 4 problèmes :

1. **Workflow peu accessible** — le CTA orange "Créer mon ebook (Workflow IA)" est noyé dans un gros pavé éditorial, on ne voit pas que c'est l'entrée principale.
2. **Compteur jetons figé à 0** — `AITokenHeaderBadge` lit `aiCostTracker`, qui n'est alimenté QUE par `aiWritingService.ts`. Or les 15 agents P1-P15 appellent `geminiService.callGemini` / `callGeminiWithHistory` / `callGeminiJSON` directement → aucune trace, le compteur ne bouge jamais.
3. **Pavé "Nouveau manuscrit" trop gros** — titre 5xl–7xl + sous-titre + statut occupent ~500 px de hauteur avant même de voir le contenu.
4. **FAB "Créer ma couverture KDP"** (orange pulsant, bottom-right) se télescope avec le bouton flottant "Clés API" (`ApiKeysFloatingButton`) au même endroit.

## Plan

### 1. Compacter le hero `EbookPlannerPage.tsx` (lignes 3562-3664)

Passer d'un bloc éditorial centré ~500 px à une bande horizontale ~120 px :

```text
┌────────────────────────────────────────────────────────────────────┐
│ ← TABLEAU DE BORD   │  La Belle-sœur (italic, 2xl)                 │
│  15 AGENTS IA · KDP │  Auteur · 0 chapitre · IA Connectée •        │
│                     │                                              │
│                     │  [🚀 WORKFLOW IA] [🎨 COUVERTURE] [✨ AMB.]  │
│                     │  [💾 SAUVEGARDER] [+ NOUVEAU] [📝 MANUEL]    │
└────────────────────────────────────────────────────────────────────┘
```

- Supprimer le sous-titre long ("Transformez votre intuition…") et la phrase "Accompagnement gratuit en Zoom"
- Titre passe de `text-5xl md:text-7xl` à `text-2xl md:text-3xl` italique Instrument Serif, aligné à gauche
- La barre d'actions et la barre de statut fusionnent dans le même bloc

### 2. Regrouper tous les boutons dans la barre actions

Ordre final, gauche → droite, style hairline `border-[#e8ecf1]` uniforme :

1. **🚀 WORKFLOW IA** (fond `#FF9E2D` — c'est le CTA principal, donc le seul plein)
2. **🎨 COUVERTURE KDP** (border `#FF9E2D` text `#FF9E2D` — remplace le FAB pulsant)
3. **✨ AMBIANCES**
4. **💾 SAUVEGARDER**
5. **+ NOUVEAU**
6. **📝 Formulaire manuel** (lien texte discret à droite)

→ Suppression complète du FAB `🎨 Créer ma couverture KDP` (lignes 3725-3735) qui se chevauchait avec `ApiKeysFloatingButton`.

### 3. Fiabiliser le compteur jetons

Ajouter le tracking dans `src/services/geminiService.ts` :

- Dans `callGemini` (l.99-146) : après réception, calculer `promptChars` (prompt + systemPrompt) et `responseChars` (content), puis appeler `trackAIUsage({ provider: 'gemini', promptChars, responseChars })` via import dynamique pour éviter le cycle.
- Idem dans `callGeminiWithHistory` (l.152+).
- `callGeminiJSON` réutilise `callGemini` → déjà couvert.

Comme ça, dès qu'un agent P1-P15 répond, le badge en haut s'incrémente en temps réel.

### 4. Hors scope

- Pas de refonte sidebar / EspaceHeader (déjà fait).
- Pas de modif workflow / export / agents.
- Pas de modif du `ApiKeysFloatingButton` (il reste flottant, mais sans collision puisque le FAB couverture disparaît).

## Détail technique

| Fichier | Changements |
|---|---|
| `src/pages/EbookPlannerPage.tsx` | Hero compact + barre actions unifiée (boutons workflow, couverture, ambiances, sauver, nouveau, manuel) ; suppression FAB couverture l.3725-3735 |
| `src/services/geminiService.ts` | Ajout `trackAIUsage` après réponse dans `callGemini` et `callGeminiWithHistory` (import dynamique) |

Aucun changement de logique métier, juste UI + télémétrie passive.

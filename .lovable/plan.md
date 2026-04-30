
# Audit UX du générateur EbookStudio

J'ai fait le tour de l'outil (route `/ebook-planner` + `/demo`). L'outil est très puissant mais **visuellement saturé** — un nouvel utilisateur ne sait pas par où commencer. Voici les problèmes identifiés et ce que je propose de corriger.

---

## 🔴 Problèmes identifiés

### 1. Trop de CTA concurrents en haut de page
Sur la page principale, on voit en même temps :
- "Créer mon livre avec le Workflow" (orange, gros)
- "Formulaire manuel" (à côté)
- "Démarrer le Workflow" (plus bas, vert)
- "Workflow complet" (à côté)
- "Voir le guide" (bandeau jaune en haut)

→ **4 boutons "démarrer" différents** sur le même écran. L'utilisateur ne sait pas lequel cliquer.

### 2. Bandeau "Bienvenue sur EbookStudio" persistant
Le bandeau orange en haut "Découvrez le guide des outils en 2 min pour ne pas vous perdre dans les **44 outils disponibles**" reste affiché en permanence et indique lui-même que l'outil est complexe (44 outils !).

### 3. Modal d'intro à chaque visite
Le modal "Bienvenue sur EbookStudio Pro 🎉" (3 étapes) s'ouvre à chaque chargement de `/ebook-planner`. Très intrusif.

### 4. Le Kanban à 5 colonnes (P1→P15) est intimidant
Cinq piliers (Créer / Optimiser / Produire / Publier / Vendre) avec **31 outils** + agents verrouillés (icône cadenas) sans explication claire de l'ordre. On voit "P1 · Zyro — Niche", "P2 · Jano — Marché"… les noms de code (Zyro, Jano, Kiro, Alia) ne disent rien à un débutant.

### 5. Doublons d'entrée
- "Créer mon livre avec le Workflow" ≠ "Démarrer le Workflow" ≠ "Workflow complet" → Trois portes pour la même chose.
- "Formulaire manuel" en haut + "Formulaire manuel" dans la colonne Créer → doublon.

### 6. Indicateurs peu lisibles
- "0/15 agents terminés · 0%" → un débutant ne sait pas ce que sont "les agents".
- "22 projets créés" sur le bandeau Lifetime → info qui n'aide pas pour l'action en cours.

### 7. Bouton flottant IA (orange en bas à droite) + Communauté (orange avec "3" en haut à droite)
Deux pastilles flottantes orange éparpillées qui distraient sans contexte clair.

---

## ✅ Plan de simplification (4 changements)

### Étape 1 — Un seul CTA principal "Démarrer"
Sur le hero du planner, garder **UN SEUL** bouton primaire :
- **"🚀 Créer mon ebook (Workflow IA)"** (gros, orange)
- En dessous, un lien texte discret : *"ou utiliser le formulaire manuel"*

Supprimer les boutons doublons "Démarrer le Workflow" / "Workflow complet" qui apparaissent plus bas dans le bloc "Prêt à créer ton livre ?".

### Étape 2 — Renommer les agents avec des noms parlants
Remplacer les noms de code (Zyro, Jano, Kiro…) par leur **fonction métier** :
- P1 · Zyro → **P1 · Définir la niche**
- P2 · Jano → **P2 · Analyser le marché**
- P3 · Kiro → **P3 · Plan du livre**
- P4 · Alia → **P4 · Rédaction IA**
- … et garder le nom de code en sous-titre petit (`Zyro`) pour le suivi.

### Étape 3 — Modal d'intro en "1-fois seulement" + bandeau désactivable
- Marquer le modal d'intro comme **vu** dans `localStorage` après la 1ère fermeture (ne plus le rouvrir à chaque visite).
- Sur le bandeau jaune "Bienvenue sur EbookStudio", quand l'utilisateur clique sur ✕, le mémoriser définitivement.

### Étape 4 — Réduire la verbosité du Kanban
- Renommer la colonne pillier **"Créer" → "1. Préparer"**, **"Optimiser" → "2. Améliorer"**, etc. (numéroter pour clarifier l'ordre).
- Sous le titre du projet ("Le Loup à la Plage 0/15 agents · 0%"), reformuler en **"Étape 0 / 15 — Commence par P1 ci-dessous"**.
- Cacher par défaut les outils annexes "Formulaire manuel", "Personnages", "Assistant IA" derrière un bouton **"+ Outils avancés"** dans la colonne "1. Préparer" (déjà 8 items, c'est trop).

---

## 📋 Fichiers concernés (technique)

- `src/pages/EbookPlannerPage.tsx` — hero + dédoublonnage CTA
- `src/components/ebook/TrelloBoardView.tsx` & `TrelloBoardColumns.ts` — renommage piliers + agents
- `src/components/ebook/WorkflowDashboard.tsx` ou équivalent — suppression bouton "Démarrer le Workflow" doublon
- `src/components/onboarding/FirstEbookOnboarding.tsx` — flag localStorage "déjà vu"
- `src/components/onboarding/FirstVisitBanner.tsx` — flag localStorage de fermeture définitive

Aucune modification de logique métier, uniquement de l'UX/copy/affichage. Aucun risque sur le backend, les agents IA ou les exports.

---

## ❓ Avant que j'implémente

Tu valides ces 4 changements en bloc ? Ou tu préfères que je commence par **1 seul** (par ex. "1 seul CTA principal") pour voir le résultat avant le reste ?

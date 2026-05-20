## Problème

Dans la bannière orange dégradée (`EbookJourneyDashboard.tsx`, en bas de la capture), deux boutons cohabitent et **n'ont pas la même fonction** :

1. **`▶ Continuer : Idée & niche`** (bouton blanc, en haut) → navigue vers l'étape **manuelle suivante** du parcours (ex. l'éditeur P1 seul).
2. **`🪄 Lancer le Workflow IA 15 Agents`** (bouton outline, en bas) → lance le **vrai pipeline automatique** des 15 agents (`complete-workflow`).

Or c'est le **second** qui correspond au bouton bleu principal `⚡ Workflow IA (15 agents)` de la barre d'action au-dessus — c'est le CTA principal et il doit être **en haut**, plus visible. De plus, les icônes `▶` et `🪄` s'affichent comme des carrés vides (□) car la police système ne les supporte pas → il faut passer aux icônes Lucide.

## Fix dans `src/components/ebook/EbookJourneyDashboard.tsx` (lignes 98-128)

**Inverser l'ordre + harmoniser le style** :

1. **En haut (CTA principal, blanc plein, taille `lg`)** : `Lancer le Workflow IA · 15 agents`
   - `onClick = props.onStartAutoWorkflow`
   - Icône `Zap` (Lucide) à gauche + `ArrowRight` à droite
   - Style : `bg-white text-[#232F3E] hover:bg-white/90 font-semibold shadow-lg`

2. **En dessous (CTA secondaire, outline blanc translucide, taille `sm`)** : `Continuer manuellement : {nextStep.label}`
   - `onClick = handleContinue`
   - Icône `Play` (Lucide) à gauche
   - Style : `bg-white/10 border-white/30 text-white hover:bg-white/20`
   - Si plus de `nextStep` → afficher `Trophy + Parcours complété` désactivé à la place

3. **Remplacer tous les emojis** (`▶`, `🪄`) par des composants Lucide (`Play`, `Zap`, `Sparkles`, `ArrowRight`, `Trophy`) déjà importés dans le fichier — corrige les carrés vides visibles dans la capture.

4. **Largeur des boutons** : ajouter `min-w-[260px]` sur les deux pour qu'ils soient alignés verticalement et lisibles.

## Hors scope

- Pas de changement à la barre d'action au-dessus (`Workflow IA (15 agents)`, `Créer ma couverture KDP`, `Discuter avec l'IA`) — déjà OK.
- Pas de refonte du dégradé orange ni des phases timeline en dessous.
- Aucun changement de logique métier : seules les **étiquettes, l'ordre et le style** des deux boutons changent.

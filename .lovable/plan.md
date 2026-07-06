## Problème constaté

Dans le Hub (`/hub-v3` → onglet **Parcours**), c'est le composant `V3Workflow30.tsx` qui pilote les phases 1 à 7 et rédige le livre via l'edge function **`v3-autopilot-step`**.

Deux causes au "aucune différence 347€" :

1. **Le moteur ne différencie pas la rédaction.** Dans `v3-autopilot-step/index.ts`, l'étape manuscrit (`p20-chat-manuscript`) ignore complètement le flag `quality`/`isPro` : `targetWords`, le prompt et les tokens sont identiques pour 197€ et 347€. Le `isPro` n'agit que sur les étapes annexes (variantes + 12288 vs 8192 tokens), pas sur l'écriture du livre lui-même.
2. **Rien n'est affiché.** L'encart `WritingEngineBadge` a été branché dans `EbookPlannerPage` (autre outil), pas dans `V3Workflow30`. Donc dans le Hub, l'utilisateur ne voit aucun repère visuel de ce que le 347€ apporte.

(La différenciation faite précédemment reste valable, mais uniquement pour l'outil `complete-book-workflow` que le Hub n'utilise pas.)

## Correctifs proposés

### 1. Moteur — `supabase/functions/v3-autopilot-step/index.ts`
Faire agir réellement `isPro` sur l'écriture du manuscrit (`p20-chat-manuscript`) :
- **Chapitres plus longs en Pro** : viser ~5000 mots (au lieu de la valeur du brief ~3500) quand `isPro`, avec `maxTok` relevé en conséquence.
- **Consignes de rédaction enrichies** en Pro : plus de sous-parties développées, exemples concrets, transitions, profondeur — bloc de consignes distinct core vs pro.
- **Passe éditoriale automatique** en Pro : après génération d'un chapitre, un 2ᵉ appel IA de densification/fluidité/enrichissement (fallback silencieux sur le texte initial si l'appel échoue ou dépasse le temps).
- Conserver le comportement core inchangé pour l'offre 197€.

### 2. Interface Hub — `src/components/admin/V3Workflow30.tsx`
- Afficher l'encart comparatif **`WritingEngineBadge`** (déjà existant) en tête du parcours, piloté par `fullMode`/`hasFull`, pour que l'acheteur 347€ voie noir sur blanc les gains rédaction (chapitres plus longs, passe éditoriale, boucle qualité renforcée) — et l'utilisateur 197€ l'incitation à l'upgrade.
- Ajouter un petit repère "Moteur Pro" au niveau de l'étape d'écriture (`p20-chat-manuscript`) quand `fullMode` est actif, pour matérialiser la différence au moment clé.

### 3. Cohérence
- Vérifier que le libellé du sélecteur de parcours (déjà présent) reste aligné avec les gains réels désormais livrés côté moteur.

## Points techniques
- Le palier `pro` n'affecte QUE la qualité/longueur/passe éditoriale ; le choix du modèle IA (Claude, Gemini, ChatGPT, DeepSeek, Mistral via OpenRouter BYOK) reste libre à tous les paliers.
- Aucun changement de schéma, RLS ou droits. `useV3Entitlement` (admin = tout) reste la source des droits.
- Redéploiement de `v3-autopilot-step` après modification ; vérification TypeScript.
</content>
<summary>Corriger la différence 347€ dans le Hub : le moteur d'écriture (v3-autopilot-step) et l'affichage (V3Workflow30) ignoraient le palier Pro.</summary>
</invoke>

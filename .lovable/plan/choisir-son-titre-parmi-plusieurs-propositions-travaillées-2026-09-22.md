# Choisir son titre parmi plusieurs propositions travaillées

Sur la page de création (`/v3/create`), l'assistant ne propose aujourd'hui **qu'un seul** titre, avec son sous-titre et son synopsis. Si le titre ne plaît pas, il faut relancer et l'ancien est perdu.

## Ce qui change

1. **5 propositions au lieu d'une.** L'assistant renvoie 5 ensembles complets : titre, sous-titre, synopsis (150–200 mots), catégories Amazon — plus, pour chaque proposition :
   - un **angle** (ce qui la différencie : pratique, émotionnel, méthode, etc.),
   - un **« pourquoi ce titre »** en une ou deux phrases (le conseil de l'agent),
   - un repère de **lisibilité** (longueur du titre, mots-clés visibles en couverture).
2. **Un conseil d'agent au-dessus des cartes** : laquelle il recommande et pourquoi, en une phrase. Aucune donnée chiffrée inventée (pas de volume de recherche ni de ventes).
3. **Bouton « Chercher d'autres titres »** : relance une recherche plus poussée en excluant les titres déjà proposés, pour obtenir 5 nouvelles pistes réellement différentes. Les propositions précédentes restent consultables (onglet « Série 1 », « Série 2 »…).
4. **Bouton « Choisir ce titre »** sur chaque carte : remplace d'un coup le titre, le titre final, le sous-titre et le synopsis du livre (et la catégorie si elle est encore vide), avec confirmation à l'écran de ce qui a été remplacé. La carte choisie reste marquée « Titre retenu ».
5. **Affinage libre** : un petit champ « Ajuster ce titre » sous la carte retenue (ex. « plus court », « plus émotionnel », « garde le mot méditation ») régénère uniquement titre + sous-titre + synopsis de cette proposition.

Rien d'autre du parcours de création ne change : les étapes, le sommaire, le workflow des agents et les exports restent identiques.

## Détails techniques

- `src/components/v3public/V3CreateWizard.tsx` :
  - `aiResult` devient `aiSeries: TitleIdea[][]` + `activeSerie` et `chosenIdeaId`, où `TitleIdea = { id, title, subtitle, synopsis, categories, angle, pourquoi, longueur }`.
  - `runAIAssistant` : prompt mis à jour pour renvoyer `{ conseil, propositions: [5 objets] }` en JSON strict, français uniquement, sans chiffres inventés ; `callAIWriting(..., { jsonMode: true, temperature: 0.9, maxTokens: 8192 })`, parsing tolérant conservé (`JSON.parse` puis extraction `{…}`).
  - `runMoreTitles()` : même appel avec la liste des titres déjà produits en consigne d'exclusion et une consigne de recherche plus large (angles, promesses, formats concurrents) ; ajoute une série au tableau.
  - `applyIdea(idea)` remplace `title`, `finalTitle`, `subtitle`, `description` (synopsis) et la catégorie si vide — même logique que l'`applyAIResult` actuel, appliquée à l'idée choisie.
  - `refineIdea(idea, consigne)` : appel IA ciblé renvoyant `{ title, subtitle, synopsis }` et mise à jour de l'idée dans la série.
- Rendu : cartes en grille `sm:grid-cols-2` dans le bloc « Assistant IA » existant, charte V3 (ivoire/or, boutons orange texte blanc), badges d'angle, bouton « Choisir ce titre », lien « Ajuster ce titre ».
- Aucune nouvelle table, aucune edge function, aucun changement de tarif. BYOK conservé (`getProvider` / `validateKeyFormat`) avec le même message si la clé manque.

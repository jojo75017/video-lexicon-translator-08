# Ajout des champs "Cible" et "Promesse" au workflow

Oui, c'est tout à fait possible. Aujourd'hui le formulaire d'entrée du workflow (dans `EbookCompleteWorkflow.tsx`) n'a qu'un grand champ "Introduction / Vision du livre" où l'utilisateur doit tout mélanger. On va ajouter deux **onglets dépliables** dédiés juste en dessous, pour structurer l'info envoyée à l'IA et améliorer la qualité des descriptions générées.

## Ce qu'on ajoute

Sous le champ "Introduction", deux blocs `Accordion` (composant déjà disponible dans `src/components/ui/accordion.tsx`) :

### 🎯 Onglet "Cible idéale" (déroulant)
Champs guidés (tous optionnels) :
- **Profil du lecteur** — âge, sexe, situation (ex: "Femmes 35-55 ans, en quête de sens")
- **Besoins / attentes** — ce qu'il cherche
- **Frustrations / douleurs** — ce qu'il veut éviter
- **Niveau** — débutant / intermédiaire / avancé (Select)

### ✨ Onglet "Promesse centrale" (déroulant)
Champs guidés (tous optionnels) :
- **Promesse principale** — la transformation promise en 1 phrase
- **Bénéfices clés** — 3 bullets (textarea libre)
- **Différenciation** — ce qui rend ce livre unique vs concurrence
- **Émotion visée** — ex: rassurer, inspirer, faire rire (Input)

## Comportement

- Les deux accordions sont **fermés par défaut** pour ne pas encombrer le formulaire (tout reste rapide et simple).
- Un petit badge "Recommandé pour un meilleur résultat" sur chaque accordion fermé.
- Les valeurs sont stockées dans deux états locaux (`cibleData`, `promesseData`) puis **concaténées au `bookIntroduction`** envoyé à P1 (l'Éditeur) sous forme structurée :
  ```
  === CIBLE ===
  Profil: ...
  Besoins: ...
  ...
  === PROMESSE ===
  Promesse: ...
  ...
  ```
  → Aucun changement back-end / agents IA nécessaire, juste un enrichissement du prompt.
- Persistance via le mécanisme `useWorkflowSync` existant (mêmes 60s auto-sync que les autres champs).

## Fichier modifié

- `src/components/ebook/EbookCompleteWorkflow.tsx` — ajout des deux blocs Accordion juste après le champ "Introduction" (~ ligne 1444), ajout des states et de la logique de concaténation au moment du lancement du workflow.

## Détails techniques

- Utilisation de `Accordion type="multiple"` Radix (déjà présent) pour pouvoir ouvrir les deux indépendamment.
- Pas de migration BD, pas de nouvelle dépendance.
- Pas de modification des agents P1-P15 : ils reçoivent déjà tout via `bookIntroduction`, on enrichit juste son contenu.

Veux-tu que j'implémente ça tel quel, ou tu préfères ajuster les champs proposés (en ajouter / en retirer) ?

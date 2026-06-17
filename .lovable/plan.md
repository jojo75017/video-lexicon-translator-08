## Objectif

Ajouter un **onglet dédié « Maison Édition »** dans le Hub V3 (`/hub-v3`), contenant un article éditorial soigné **« Réussir la mise en page d'un livre »**, illustré par une **belle image (bannière "Révolution")**, avec des **liens internes** dans le texte qui mènent vers les outils/onglets concernés du générateur.

## Où ça s'intègre

Le Hub V3 (`src/pages/V3HubPage.tsx`) fonctionne déjà avec un système d'onglets via des `FilterChip` (Créer, Roadmap, Mes outils, Tous, + les piliers). J'ajoute un nouvel onglet **« 📕 Maison Édition »** à côté de la Roadmap, qui affiche un composant article au lieu de la grille de modules.

## Ce que je vais construire

### 1. Image bannière « Révolution »
Génération d'une image **photoréaliste premium** (respect de la charte : pas de cartoon) : un livre ouvert élégant sur un bureau d'éditeur, lumière chaude, typographie soignée visible, ambiance « maison d'édition » — avec un traitement permettant d'afficher le mot **« RÉVOLUTION »** en surimpression élégante (texte ajouté en overlay HTML pour rester net et éditable).
Fichier : `src/assets/v3/maison-edition-revolution.jpg`.

### 2. Nouveau composant `MaisonEditionTab.tsx`
`src/components/admin/MaisonEditionTab.tsx` — reprend la charte ambre/crème + serif du Hub V3. Contenu :

- **Hero** avec l'image + badge/mot « Révolution » + titre *« Réussir la mise en page d'un livre »*.
- L'intégralité du **texte fourni** (mise en page, corps du texte, marges, polices, images, gabarit), structuré en sections avec sous-titres (Le corps du texte, Les marges, Les polices, Les images, Télécharger un gabarit).
- **Liens internes contextuels** insérés dans le texte, pointant vers les outils concernés du générateur :

  | Passage du texte | Lien vers |
  |---|---|
  | « feuilleter une première fois » / aperçu rendu | **Kindle Previewer Simulé** (`kindle-previewer`) |
  | couverture / premier contact | **Cover Studio Pro** (`cover-studio-pro`) + **Couverture KDP Exacte** (`cover-pdf-exact`) |
  | marges techniques / gabarits intérieurs | **Checklist Prépublication** (`prepub-checklist`) + **Convertisseur Manuscrit Universel** (`manuscript-converter`) |
  | polices / taille / conformité | **Cockpit Audit Pilot** (conformité KDP) (`cockpit-audit-pilot`) |
  | enregistrer en PDF / publier | **Multi-format Express** (`multi-format-express`) |
  | écrire / mettre en page le manuscrit | **STUDIO — Création de Livres** (`book-creation-studio`) |

  Les liens ouvrent directement la fiche-outil (dialogue module existant) via un callback `onOpenModule`. Quelques liens secondaires (formation, couverture) pointent vers les routes `/formation`, `/couverture-kdp`.

### 3. Branchement dans `V3HubPage.tsx`
- Importer `MaisonEditionTab` et `getModuleById`.
- Ajouter un `FilterChip` **« 📕 Maison Édition »** dans la barre de filtres (près de Roadmap).
- Ajouter la branche d'affichage : `pillar === 'maison-edition'` → `<MaisonEditionTab onOpenModule={(id) => setSelected(getModuleById(id))} />`.

## Détails techniques

- Aucune modification backend / base de données.
- Réutilisation du dialogue module existant (`V3ModuleDialog` + `setSelected`) pour les liens internes → cohérent avec le reste du Hub.
- Style 100 % aligné sur les tokens locaux du Hub (ambre `#E8951E`, crème `#FBF6EC`, serif) — pas de couleurs codées en dur hors charte de la page.
- Le mot « Révolution » et le titre sont du texte HTML par-dessus l'image (netteté garantie, pas de texte gravé dans l'image).
- Accessibilité : `alt` descriptif sur l'image, hiérarchie de titres (un seul H1 dans la section), liens explicites.

## Fichiers touchés
- **Créé** : `src/components/admin/MaisonEditionTab.tsx`
- **Créé** : `src/assets/v3/maison-edition-revolution.jpg` (image générée)
- **Édité** : `src/pages/V3HubPage.tsx` (import + chip + branche d'affichage)

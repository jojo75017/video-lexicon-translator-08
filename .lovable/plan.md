# Maison d’édition de couvertures : synopsis et image plus lumineuse

## Objectif visible

Rendre le Studio de couverture plus clair et plus professionnel, sans toucher aux paiements, aux crédits, à la sécurité ni aux autres outils.

```text
┌─────────────────────────────────────────────────────────────┐
│        VOTRE MAISON D’ÉDITION DE COUVERTURES                │
│  Une couverture guidée par l’histoire réelle de votre livre │
├─────────────────────────────────────────────────────────────┤
│  Livre à habiller                                           │
│  Titre · Sous-titre · Auteur · Genre                         │
│                                                             │
│  SYNOPSIS DU LIVRE                                          │
│  [ Résumez l’histoire, les personnages, le lieu,             │
│    l’époque et l’ambiance importante…                 ]      │
│  Ce synopsis guide l’IA vers une couverture fidèle.         │
├─────────────────────────────────────────────────────────────┤
│  Catégorie · Style d’image · Placement des textes           │
│  [ Générer mes couvertures ]                                │
├─────────────────────────────────────────────────────────────┤
│  APERÇU                                                     │
│  Image plus sombre  ───────●──────  Image plus claire       │
│  [Réinitialiser]                                            │
│                                                             │
│  [Enregistrer] [Ouvrir l’éditeur] [Télécharger]              │
└─────────────────────────────────────────────────────────────┘
```

## Modifications prévues

### 1. Une identité plus professionnelle
- Remplacer le titre technique « Cover Studio Pro — Couvertures Premium IA » par **« Votre maison d’édition de couvertures »**.
- Ajouter une phrase courte expliquant que le Studio transforme le contenu du livre en direction visuelle professionnelle.
- Conserver l’organisation actuelle, les catégories, les styles, les moteurs et les boutons existants.

### 2. Un vrai champ « Synopsis du livre »
- Renommer « Résumé / précisions créatives » en **« Synopsis du livre »** et le rendre beaucoup plus explicite.
- Expliquer sous le champ que ce texte sert à choisir la scène, l’ambiance, les personnages, le lieu et l’époque de la couverture.
- Lorsqu’un livre sauvegardé est sélectionné, reprendre automatiquement son résumé existant dans ce champ, comme le Studio le fait déjà actuellement.
- Laisser le synopsis modifiable avant la génération afin que l’abonné puisse corriger ou préciser la direction artistique.
- Envoyer ce synopsis au moteur de couverture dans la demande existante, sans appel supplémentaire et sans crédit supplémentaire.

### 3. Éclaircir une image trop sombre
- Ajouter sous chaque couverture générée un réglage simple **« Luminosité de l’image »**, avec une position normale au centre.
- Montrer immédiatement le résultat sur la grande couverture et sur la miniature Amazon.
- Ajouter **« Réinitialiser »** pour revenir instantanément à l’image d’origine.
- Appliquer la luminosité choisie à la couverture finale téléchargée, y compris lorsque le titre, le sous-titre et l’auteur sont posés par l’application.
- Garder l’illustration originale intacte : le réglage sera local, réversible et sans nouvel appel IA.
- Le bouton « Télécharger l’illustration seule » continuera à fournir l’original ; le téléchargement de la couverture finale fournira la version éclaircie visible à l’écran.

## Détails techniques

- `src/components/admin/CoverStudioPro.tsx` : nouveau titre, libellé et aide du synopsis, état de luminosité par couverture, curseur, réinitialisation et aperçu immédiat.
- `src/lib/cover-editor/studioProCover.ts` : transmettre le niveau de luminosité dans la composition locale.
- `src/lib/cover-editor/frontComposition.ts` et/ou le rendu local existant : appliquer la luminosité au fond avant les textes et les voiles de contraste, afin de préserver leur lisibilité.
- `src/lib/cover-editor/coverExports.ts` : réutiliser exactement le même rendu pour que l’aperçu et le fichier téléchargé correspondent.
- Vérifier sans génération payante : aperçu local avec une image existante, luminosité normale/éclaircie, réinitialisation, puis export final aux dimensions prévues.

## Ce qui ne change pas

- Aucun nouveau moteur d’image ni nouvelle fonctionnalité payante.
- Aucun changement de base, de sécurité, de calcul KDP, de paiement ou de crédit.
- Aucun remplacement de l’image originale enregistrée.

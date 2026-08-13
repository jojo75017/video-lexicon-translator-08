# Bannière « Moteur multi-modèles » pour la V3

Reprendre l'idée de la capture (un moteur de publication où chaque tâche est confiée à une IA spécialisée), adaptée à EbookStudio V3 et à son identité émeraude/or — pas de copie du style orange d'AmazProfitRobot.

## Ce qui sera ajouté

### 1. Bandeau d'accroche (fin, pleine largeur)
Une ligne premium sur fond émeraude, filet or :
> **EbookStudio V3 n'est pas une seule IA.** C'est un moteur de publication **multi-modèles** : chaque étape est confiée à une IA spécialisée.

Cliquable vers la section détaillée / l'offre.

### 2. Section « Les moteurs IA de la V3 »
Grille de 7 cartes (4 + 3), style V3 (cartes crème, bordure or, icônes) :

| Rôle | Libellé affiché | Moteur |
|---|---|---|
| Recherche | Recherche & niche | Gemini (recherche approfondie) |
| Rédaction | Rédaction du manuscrit | ChatGPT (plume chapitre par chapitre) |
| Visuels | Visuels de couverture | Génération d'images IA |
| Mise en page | Couverture & mise en page | Cover Studio Pro (300 DPI, dos + 4e + bleed) |
| Narration | Livre audio | Synthèse vocale |
| Métadonnées | Métadonnées Amazon | Optimisation KDP (mots-clés, catégories) |
| International | Portée mondiale | Traduction 10 langues |

Chaque carte : titre, une ligne de description, et lien vers le module V3 correspondant quand il existe (Studio Pro, Cover Studio Pro, Audiobook, Traducteur, Espion/Mots-clés).

Sous la grille, 3 puces de bénéfices (autonomie réelle de l'IA, sortie prête pour KDP, un seul enchaînement de l'idée au fichier publiable) puis le CTA principal existant.

## Emplacement
- **/v3 (accueil)** : bandeau + section, placés sous le hero, au-dessus des outils en vedette.
- **/v3/offre** et **/commander** : bandeau + section insérés au-dessus du bloc de prix, pour renforcer la valeur perçue avant le paiement.

Le contenu vit dans un composant unique réutilisé sur les trois pages, donc une seule source à modifier ensuite.

## Détails techniques
- Nouveau `src/components/v3public/V3EngineBanner.tsx` exportant deux composants : `V3EngineStrip` (bandeau) et `V3EngineGrid` (section 7 moteurs).
- Données des 7 moteurs dans un tableau en tête de fichier (titre, sous-titre, icône lucide, lien optionnel).
- Styles alignés sur `src/styles/v3-public.css` (variables `--v3-gold`, classes `v3-serif`, `v3-btn`) — aucune couleur codée en dur hors des tokens/valeurs déjà employées dans les composants V3.
- Insertion dans `V3HomePage.tsx`, `V3OffrePage.tsx` et `V3CommanderPage.tsx` uniquement (imports + rendu).
- Aucune modification de logique métier, de tarifs ni de backend. Aucun crédit supplémentaire nécessaire : pas d'appel IA, pas de génération d'images (icônes vectorielles).
- Textes 100 % en français.

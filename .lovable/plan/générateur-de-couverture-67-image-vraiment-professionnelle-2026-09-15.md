# Générateur de couverture 67 € : image vraiment professionnelle

Objectif : que l'image générée corresponde à ce que vous décrivez, qu'elle soit d'un niveau vendable, sans bandeau ni encart sombre imposé dans l'image, avec quelques réglages simples de retouche comme dans un logiciel photo, mais sans complexité.

## 1. Votre description est vraiment prise en compte

Aujourd'hui votre petite description est envoyée telle quelle au générateur d'images, qui l'interprète mal.

- Avant de créer l'image, une lecture automatique de vos informations (titre, sous-titre, description/synopsis, genre) transforme votre texte en une consigne visuelle précise : sujet principal, lieu, époque, action, ambiance, palette, cadrage.
- Cette étape est une simple analyse de texte, sans crédit image consommé.
- La consigne obtenue s'affiche avant génération, modifiable en un champ, avec un bouton « Régénérer la description visuelle ».
- Si l'analyse échoue, votre description est utilisée directement comme aujourd'hui (aucun blocage).

## 2. Plus jamais d'encart sombre dans l'image

- Suppression de la consigne actuelle qui demande des « zones calmes » : c'est elle qui fait apparaître bandeaux, plaques et rectangles sombres cuits dans l'image.
- Interdiction explicite : aucun bandeau, cartouche, plaque, cadre, vignette sombre, dégradé noir ajouté ni faux emplacement de titre.
- Les fonds derrière le titre restent, si vous le souhaitez, un calque de l'éditeur : vous l'activez ou non, et vous pouvez le retirer.

## 3. Une image de niveau professionnel

- Consignes de qualité resserrées et non contradictoires (une seule consigne qualité au lieu de deux qui se répètent aujourd'hui).
- Exposition claire par défaut, sujet net et bien éclairé, anatomie correcte, point focal fort, finition prête à imprimer.
- Le style artistique choisi et le réglage de lumière sont réellement transmis dans les trois entrées possibles (assistant guidé, éditeur complet, Cover Pro).

## 4. Retouche simple, esprit logiciel photo

Sous l'aperçu de l'éditeur, quatre curseurs clairs, 100 % locaux (aucune IA, aucun crédit, réversibles) :

- Luminosité (déjà en place)
- Contraste
- Saturation
- Chaleur (froid ↔ chaud)

Plus un bouton « Tout remettre à zéro ». Ces réglages s'appliquent à l'aperçu et à l'export.

## Détails techniques

- `supabase/functions/cover-pro-generate/index.ts` : nettoyage de `buildPrompt` (interdits bandeaux/encarts, une seule consigne qualité), prise en compte d'un champ `visualPrompt` fourni par l'appelant.
- Nouvelle génération de consigne visuelle par appel texte (réutilisation du chemin d'analyse existant type `cover-brief`, sans crédit image).
- `src/components/cover-editor/IllustrationGeneratorPanel.tsx` : champ description + consigne visuelle proposée/modifiable, envoi de `visualPrompt`.
- `src/pages/v3/CouvertureExpressPage.tsx` et `src/components/cover-studio-pro/CoverProIllustrationPanel.tsx` : même envoi.
- `src/lib/cover-editor/frontComposition.ts` (+ éditeurs face et dos-quatrième) : ajout de contraste, saturation et chaleur à côté de la luminosité existante, appliqués au rendu et à l'export.

Aucun changement de base de données, de sécurité, de paiement, de crédits, de calculs KDP ni du module V4.

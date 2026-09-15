# Des illustrations plus lumineuses et plus professionnelles

Vos couvertures existantes (Les Flammes du passé, Les Murmures du Profond, l'amour en héritage) sont le bon niveau de référence. Deux défauts reviennent : certaines images sortent trop sombres, et le style demandé n'est pas toujours celui qui est réellement envoyé au générateur.

## Ce qui va changer

1. **Choix du style réellement pris en compte**
   Le style artistique sélectionné dans l'assistant (illustration éditoriale, fantasy dorée, photo cinéma, non-fiction, minimal) n'est aujourd'hui pas transmis à la génération : toutes les images utilisent le même style par défaut. Il sera transmis.

2. **Un réglage de lumière avant génération**
   Nouveau choix simple à trois options, « Lumineuse » par défaut :
   - Lumineuse (recommandé) : image claire, bien exposée, visage et sujet éclairés.
   - Équilibrée : contraste naturel.
   - Sombre et dramatique : pour thriller ou fantasy, volontairement contrastée.
   Ces consignes seront ajoutées à la demande envoyée au générateur (exposition correcte, hautes lumières présentes, pas d'ombres bouchées).

3. **Exigence de qualité renforcée**
   La demande de génération précisera systématiquement : sujet net et bien éclairé, visages et mains corrects, lumière cohérente, rendu comparable aux meilleures couvertures du commerce ; interdiction du rendu terne, plat, sous-exposé ou « image de banque ».

4. **Éclaircir après coup, visible**
   Le réglage de luminosité existe déjà dans l'éditeur mais reste peu visible. Il sera remonté sous l'aperçu, avec un libellé clair « Éclaircir l'image » et un bouton de remise à zéro, pour rattraper une image trop sombre sans regénérer (donc sans crédit).

## Détails techniques

- `supabase/functions/cover-pro-generate/index.ts` : transmettre `artStyle` depuis le corps de la requête, ajouter un champ `lighting` (`bright` | `balanced` | `dark`) et les consignes d'exposition correspondantes dans `buildPrompt`, renforcer la ligne « QUALITÉ EXIGÉE ». Modèle, taille, qualité, sécurité, propriété du projet, crédits et BYOK inchangés.
- `src/components/cover-editor/CoverProIllustrationPanel.tsx` et `src/pages/v3/CouvertureExpressPage.tsx` : sélecteur de style + sélecteur de lumière envoyés à la fonction.
- `src/components/cover-editor/CoverFrontEditor.tsx` : réglage « Éclaircir l'image » rendu visible sous l'aperçu, avec remise à zéro.

## Hors périmètre

Aucun changement de base de données, de sécurité, de paiement, de logique de crédits, de calculs KDP, d'exports ni du module V4.

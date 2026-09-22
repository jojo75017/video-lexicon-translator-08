# Accueil V3 avant-première centré sur la réservation

## Résultat attendu
Le haut de `/v3` devient une vraie page d’avant-première : promesse immédiate, ouverture datée, compte à rebours, un seul appel à l’action pour laisser son email, puis preuve auteur compacte.

## Modifications
1. **Simplifier l’ouverture de la page**
   - Retirer le texte « Vous ne savez pas par où commencer ? », les encarts de démarrage et le gros lien vers les 539 questions.
   - Ne modifier aucune autre section plus bas.

2. **Refondre le premier écran**
   - Garder la charte ivoire, or, émeraude et serif.
   - Afficher le badge « Ouverture le 1er octobre ».
   - Ajouter un compte à rebours sobre jusqu’au 1er octobre 2026 à 00:00, heure de Paris, en jours/heures/minutes.
   - Remplacer le titre, le sous-titre et le paragraphe par les textes fournis.
   - Conserver les cinq pastilles Kindle, Livre broché, Couverture, Livre audio et Métadonnées.
   - Remplacer le bouton de découverte par « Réserver ma place — kit + 10 niches offerts ».

3. **Réutiliser l’inscription existante**
   - Le bouton ouvrira une fenêtre d’inscription email légère utilisant directement le composant existant des 10 niches.
   - L’enregistrement, le suivi et l’accès au cadeau continueront à passer par le flux existant, sans nouvelle base ni nouveau service.
   - Une fois l’email déjà connu, le même flux permet d’accéder directement au cadeau.

4. **Remonter la preuve auteur**
   - Déplacer la section « Auteur invité — Mr Georges Boubet, 71 livres publiés » juste sous le premier écran.
   - La rendre plus compacte tout en conservant les vraies couvertures Amazon et le lien auteur.
   - Retirer sa copie du bas afin d’éviter le doublon.

## Vérification
- Contrôler `/v3` sur ordinateur et mobile.
- Vérifier le compte à rebours, l’ouverture du formulaire, la validation email et la lisibilité des couvertures.
- Confirmer que les sections suivant la preuve auteur restent dans leur ordre et leur état actuels.

## Détails techniques
- Fichiers principaux : `src/pages/v3public/V3HomePage.tsx` et `src/components/v3public/V3HeroBanner.tsx`.
- Date cible explicite : `2026-10-01T00:00:00+02:00`.
- Capture réutilisée : `Niches10Offer` → `funnel-capture-lead` avec le cadeau `10-niches-offertes`.
- Aucun changement de paiement, de tarifs, de droits d’accès ou de logique des sections inférieures.

# Actualiser le tunnel de lancement public

## Résultat attendu
- Remplacer les annonces d’ouverture périmées par le tarif de lancement limité à 15 places, jusqu’au 15 octobre 2026.
- Conserver strictement les prix, le paiement, le formulaire de capture et le suivi existants.
- Garder une présentation éditoriale sobre, élégante et cohérente avec l’orange de la marque.

## Mise en œuvre
1. Centraliser dans `lancementTunnel.ts` les 15 places restantes, la date de fin et son libellé, puis actualiser les textes du haut de page et la FAQ.
2. Créer un bandeau réutilisable avec :
   - état actif avec places, date et compte à rebours réel ;
   - état terminé sans places ni compte à rebours ;
   - conservation du paramètre `source` et ancre `#offres` sur la page des offres ;
   - mise en page adaptée aux petits écrans et animation désactivable.
3. Installer ce bandeau en tête des pages `/lancement` et `/lancement/offres`, puis actualiser leurs badges, encarts, liens et descriptions destinées aux moteurs de recherche.
4. Aligner l’ancien bandeau global sur le nouveau message, tout en le masquant sur ces deux pages pour éviter un doublon.
5. Contrôler qu’aucun ancien message « Ouverture le 1er octobre » ne reste visible, puis vérifier le rendu à 375, 768 et 1280 px.

## Détails techniques
- Les couleurs du nouveau bandeau utiliseront les rôles visuels existants plutôt que des couleurs ajoutées directement dans les pages.
- Le compteur sera calculé depuis `LANCEMENT_FIN_ISO`, sans modifier automatiquement la constante des places.
- Aucun changement dans `v3Pricing.ts`, `funnel-capture-lead`, le paiement ou le suivi.

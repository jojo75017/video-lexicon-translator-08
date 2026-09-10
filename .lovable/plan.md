# Remettre KDP Pilot dans la V3 (sans surcharger l'accueil)

## Constat vérifié
- Le bandeau KDP Pilot existe bien (`KdpPilotPromoBanner`) et le code promo est en place (`PROMO15`, lien partenaire + relais `/go/kdp-pilot`).
- Il est affiché sur la V2 (`/ebook-planner`) et une seule fois sur l'accueil V3, en version compacte, très bas dans la page (après les agents) : c'est pourquoi il passe inaperçu.
- Aucune page dédiée, aucun lien dans le menu ni dans la barre latérale V3.

## Ce qui va changer

### 1. Une vraie page dédiée : `/v3/kdp-pilot`
Page accessible à tous les abonnés (pas de paiement, pas de verrou) :
- Bandeau complet KDP Pilot en haut (version détaillée déjà existante).
- Bloc « Votre code abonné » bien visible : **PROMO15**, avec bouton « Copier le code » et explication de l'endroit où le saisir au moment du paiement.
- Section « À quoi ça sert » : historique BSR, ventes estimées, suivi de niche et de concurrents, quand ajuster son livre.
- Mention claire et honnête : outil indépendant et payant, non inclus dans l'abonnement EbookStudio.
- Bouton principal « Découvrir KDP Pilot » passant par le relais interne `/go/kdp-pilot`.
- Palette émeraude & or, typographie éditoriale, cohérente avec la V3.

### 2. Des accès visibles, mais discrets
- Entrée « KDP Pilot — aller plus loin » dans le menu des catégories, rubrique analyse/vente des données Amazon.
- Entrée dans la barre latérale V3, à côté des outils de données KDP.
- Lien depuis la page Données KDP vers `/v3/kdp-pilot`.

### 3. Désencombrer l'accueil
- Retirer le bandeau KDP Pilot de l'accueil V3.
- Le remplacer par une seule ligne discrète (une phrase + lien) dans le bloc des outils, sans encart ni image.
- La V2 garde son bandeau tel quel.

## Ce qui n'est pas touché
Base de données, sécurité, calculs KDP, paiements, crédits, tarifs Plume/Édition, et le lien partenaire lui-même (inchangé).

## Vérification
- Ouvrir `/v3/kdp-pilot` : page complète, code PROMO15 copiable, bouton qui ouvre bien KDP Pilot.
- Vérifier la présence des entrées menu et barre latérale.
- Vérifier que l'accueil V3 ne contient plus l'encart, seulement la ligne discrète.

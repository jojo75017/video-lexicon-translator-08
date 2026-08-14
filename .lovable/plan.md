# Nouvel email GetResponse — vente avant la coupure du 30 septembre

## Objectif
Un email HTML propre, prêt à coller dans GetResponse, conçu pour vendre l'accès à vie à 47 € avant la fin de l'offre (30/09/2026), avec le cadeau des 10 niches comme déclencheur de clic.

## Ce qui sera fait

### 1. Nouveau modèle d'email
Créer `public/email-templates/derniere-chance-47-getresponse.html` :
- Structure en tableaux (compatible Gmail, Outlook, mobile), largeur 560 px, texte lisible.
- Bandeau date limite : « Offre terminée le 30 septembre ».
- Accroche courte : le risque d'écrire un livre que personne ne cherche.
- Le cadeau immédiat : les 10 niches Amazon offertes (mot-clé, concurrence, potentiel) — c'est le premier appel à l'action.
- Ce que contient l'accès à 47 € : liste courte de 6 livrables réels (livre chapitre par chapitre, sommaire + Word/PDF KDP, couverture KDP complète, livres illustrés 3-7 ans, fiche Amazon, V3 incluse sans repayer).
- Prix affiché : 47 € paiement unique, pas d'abonnement.
- Deux boutons vers `/commander` (haut et bas) + un lien vers la page cadeau `/10-niches-offertes`.
- Signature Georges Boubet, réponse directe à boubetgeorges@gmail.com.
- Mention de désinscription en pied de page.

Textes 100 % français, aucun mot latin ou inventé.

### 2. Panneau admin
Mettre à jour `src/components/admin/AbKitPanel.tsx` pour proposer les deux modèles (l'actuel « Offre 47 € » et le nouveau « Dernière chance ») avec, pour chacun : aperçu, objet, préheader, nom d'expéditeur, lien du bouton, copie du HTML et téléchargement.

Champs prêts à copier pour le nouvel email :
- Objet : « Il reste 6 semaines (47 € puis c'est fini) »
- Préheader : « Vos 10 niches Amazon offertes + l'accès à vie à 47 €. »
- Expéditeur : « Georges — EbookStudio »
- Bouton : « Je prends l'accès à 47 € »

### 3. Liens et suivi
Les liens utilisent le générateur existant (`commanderUrl`) avec la source `getresponse`, pour retrouver les clics dans le suivi.

## Ce qui ne change pas
Aucun envoi automatique n'est activé : l'email est un modèle à copier dans GetResponse. Prix, tunnel de commande et pages existantes restent inchangés.

## Détails techniques
- Fichiers : nouveau HTML statique dans `public/email-templates/`, modification de `AbKitPanel.tsx` (liste de modèles au lieu d'un seul).
- Aucune migration, aucune fonction backend, aucun envoi déclenché.

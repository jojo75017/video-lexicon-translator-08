# Audit V3 + relance des non-ouvreurs / non-cliqueurs + conversion de la page de vente

## 1. Ce que le passage réel a montré (test navigateur, session admin)

Les 23 onglets testés s'ouvrent tous, sans erreur JavaScript : accueil V3, Fonctionnalités, Génie/Créer, Studio Recherche, Tous les outils, Studio Pro, Corriger, Avis clients, Kit de démarrage, Forfaits, Migration V2, Mes livres, Bibliothèque, Nouveautés, Humaniseur, Audiobook, Éditeur, Mockups 3D, Royalties, Traduction, Sommaire ultime, Cover Studio Pro, /commander.

Tous les liens de la barre latérale pointent vers des routes existantes (y compris `/kdp-keywords`, `/niches`, `/niches-600`, `/couverture-kdp`, `/audit-pilot`, `/communaute`, `/formation`, `/masterclass`, `/faq`, `/assistance`).

Donc côté V3 il n'y a plus de page cassée : ce qui reste à corriger est de la cohérence et de la conversion, pas de la panne.

## 2. Ce qui reste à corriger côté V3

1. **Doublons de navigation.** « Mes livres » et « Livres corrigés » ouvrent la même page ; « Nouveautés V3 » et « Tous les outils » et « Outils offerts » se recoupent fortement. À fusionner en une seule entrée par intention, avec onglets internes.
2. **Deux entrées « Créer » concurrentes.** `Ebookstudio-Génie` et `Sommaire IA (dialogue)` mènent à la même page avec un paramètre. À regrouper en une entrée unique avec choix du mode sur la page.
3. **Barre latérale trop longue.** Une seule liste très dense ; regrouper en sections repliées avec les 6 entrées essentielles ouvertes par défaut.
4. **Onglets non gardés.** `/v3/assistant` n'est pas soumis au verrou d'ouverture alors que les autres outils le sont : à aligner.
5. **Alias non signalés.** `/v3/correcteur`, `/v3/traduire`, `/v3/tarifs`, `/v3/offres` sont de simples redirections : à conserver mais à retirer de toute navigation visible pour éviter les doublons d'URL en analytics.

## 3. Pourquoi la page de vente ne convertit pas — chiffres réels

Sur 30 à 45 jours :

- 679 destinataires touchés par email
- 413 ouvreurs, 34 cliqueurs seulement
- 208 adresses n'ont jamais ouvert, 440 ont ouvert sans jamais cliquer
- 552 vues de `/commander`
- 7 leads enregistrés
- **0 commande créée, 0 commande payée**

Lecture : l'ouverture est bonne (~61 %), le clic est très faible (~5 %), et surtout **552 visites de la page d'achat n'ont produit aucune commande**. Le problème n'est donc pas le trafic ni la délivrabilité : c'est la page `/commander` qui ne transforme pas, et le clic dans les emails qui est trop faible.

### Ce qui manque sur `/commander`

- Aucune capture intermédiaire : un visiteur qui n'achète pas repart sans laisser d'email. À ajouter : un seul bloc « Recevez les 10 niches offertes » en milieu de page, qui crée le lead même sans achat.
- Pas de preuve visible immédiate : témoignages et avis existants ne sont pas au-dessus du prix.
- Trop de promesses avant le prix : le bouton d'achat doit apparaître dans le premier écran, puis être répété 3 fois maximum.
- Aucune levée de risque en clair près du bouton (ce qui se passe après paiement, sous combien de temps l'accès arrive, comment vous joindre).
- Échéance peu lisible : l'accès à vie 47 € jusqu'au 30/09/2026 doit être affiché en compte à rebours au même endroit que le bouton.
- Aucun suivi d'abandon : pas d'événement « bouton d'achat cliqué » distinct de « page vue », donc impossible de savoir si l'abandon est avant ou pendant le paiement.

## 4. Relance des non-ouvreurs et des ouvreurs sans clic

Deux segments distincts, deux messages différents, pas un envoi unique :

- **Segment A — 208 jamais ouverts** : nouvel objet plus direct, envoi décalé le matin, contenu très court, un seul lien.
- **Segment B — 440 ouverts sans clic** : ils sont intéressés mais n'ont pas cliqué ; message centré sur le cadeau immédiat (10 niches) et non sur l'offre, le lien d'achat venant en second.

Contraintes respectées : quota 100 envois par jour, marquage `[TEST]` pour vos essais, désabonnés et adresses en rebond exclus, un seul expéditeur valide, aucun lien mort.

## 5. Détails techniques

- Requêtes de segmentation basées sur `email_send_log`, `email_opens`, `email_clicks`, `sales_prospects` (exclusion `unsubscribed`, `status = 'bounced'`).
- Deux nouveaux modèles dans `send-closing-47` : `relance-non-ouvreurs-1` (segment A) et `relance-sans-clic-1` (segment B), enregistrés dans `src/data/canonicalEmailCampaign.ts`.
- `ClosingCampaignPanel.tsx` : ajout des deux segments avec compteur réel avant envoi, mode simulation, et étalement automatique sur plusieurs jours à cause du quota.
- `V3CommanderPage.tsx` : ajout du bloc de capture « 10 niches », remontée du bouton d'achat, compte à rebours au 30/09/2026, bloc « ce qui se passe après paiement », témoignages au-dessus du prix.
- Suivi : événements distincts `view`, `cta_click`, `checkout_start` dans `capture_events` pour localiser l'abandon.
- Aucun changement de tarif : 47 € à vie jusqu'au 30/09/2026, puis Plume 17 €/mois et Édition 27 €/mois.

## 6. Ordre d'exécution

1. Corrections de navigation V3 (points 1 à 5).
2. Refonte de conversion de `/commander` + suivi des clics.
3. Segmentation et création des deux emails de relance.
4. Envoi test vers votre adresse, puis envoi réel étalé par lots de 100.

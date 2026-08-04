# Plan maître — Remise à zéro des emails EbookStudio

## Objectif

Repartir d’un système propre où **une seule séquence commerciale** peut être envoyée, avec une offre cohérente, un parcours clair et des clics mesurables.

Le nettoyage passe avant la rédaction et avant tout nouvel envoi.

## État confirmé

- Trois automatismes sont encore planifiés : l’ancien moteur commercial toutes les 10 minutes, la relance promotionnelle chaque heure et l’onboarding chaque heure.
- L’ancien fichier commercial contient encore des séquences 5/5, une étape 6 et cinq variantes de relance, avec des offres historiques à 67 €.
- Les 647 prospects du moteur commercial sont encore marqués en fin de parcours 5/5 ou 6/6 ; certains portent encore le statut `relance-5`.
- Les anciens journaux contiennent plusieurs générations de campagnes à 67 €, 59 € et 47 €. Ils expliquent ce qui apparaît encore dans le suivi.
- Les deux petites séquences enregistrées dans la base sont terminées et n’ont actuellement aucun message dû, mais leur automatisme reste inutilement actif.
- Le suivi compte beaucoup d’ouvertures mais seulement 36 cliqueurs uniques ; l’objectif doit donc être le **taux de clic utile vers l’offre**, pas seulement l’ouverture.
- Le désabonnement actuel n’est pas encore centralisé pour tous les moteurs : certaines campagnes utilisent un lien par séquence, d’autres demandent de répondre « STOP ».

## Phase 1 — Gel immédiat et sauvegarde de contrôle

1. Couper les trois planifications d’envoi existantes avant de toucher aux contenus.
2. Désactiver les boutons d’envoi liés aux anciennes étapes et relances dans Gestion Prospects.
3. Exporter un inventaire de contrôle : campagnes, destinataires, derniers statuts, clics, désinscriptions et acheteurs.
4. Conserver les journaux historiques comme preuve technique, mais les classer **Archives — jamais renvoyer** et les masquer de la vue active par défaut.

**Résultat attendu :** aucun ancien email ne peut partir pendant le nettoyage.

## Phase 2 — Suppression des anciens systèmes

1. Retirer du code et de l’interface les anciennes séquences commerciales : `standard-*`, `interesse-*`, `relance-*`, onboarding Brevo historique, promo nurture, campagnes 59/67 € et anciens tests ponctuels.
2. Retirer les anciennes fonctions d’envoi devenues inutiles après vérification de leurs dépendances.
3. Supprimer les anciens modèles HTML commerciaux du projet ; garder uniquement les emails indispensables au fonctionnement du compte et des achats.
4. Remettre les prospects commerciaux dans un état neutre : plus de progression 5/5 ou 6/6, plus de prochaine relance, plus de statut d’ancienne campagne.
5. Ne pas réinscrire les acheteurs, désinscrits, adresses supprimées, plaintes ou rebonds.

**Emails conservés hors marketing :** accès/connexion, confirmation de paiement, récupération, livraison et messages de sécurité.

## Phase 3 — Une seule source de vérité

Créer un registre unique qui définit :

- l’offre active : **47 € jusqu’au 30 septembre 2026, puis 59 €** ;
- le seul lien d’achat : `https://www.ebookstudio.fr/commander` avec suivi de campagne ;
- les bénéfices autorisés et vérifiables ;
- les dates, objets, CTA, segments et états de la séquence ;
- les exclusions globales ;
- le moteur d’envoi unique.

Les prix, dates et liens ne seront plus recopiés dans plusieurs fichiers.

## Phase 4 — Nouvelle séquence orientée clic

Construire une séquence courte de **5 emails espacés de 2 à 3 jours**, avec un seul objectif et un seul gros bouton par message.

| Étape | Angle | Promesse du bouton |
|---|---|---|
| 1 | Offre claire | Voir tout ce qui est inclus à 47 € |
| 2 | Bénéfices concrets | Transformer mon idée en livre prêt pour KDP |
| 3 | Démonstration du workflow | Voir comment le livre est créé étape par étape |
| 4 | Réponses aux objections | Vérifier le paiement unique, l’accès à vie et l’accompagnement |
| 5 | Échéance réelle | Profiter du tarif avant le 30 septembre |

Règles éditoriales :

- objet court, préheader complémentaire et texte lisible sur mobile ;
- offre et bénéfice visibles dès le début ;
- bouton contrasté, libellé concret, URL testée ;
- aucun faux témoignage, faux revenu, faux compteur ou fausse urgence ;
- une version texte de secours et un vrai lien de désinscription ;
- arrêt immédiat après achat, désinscription, plainte ou rebond ;
- pas de sixième relance cachée après le dernier email.

## Phase 5 — Segmentation et automatisation sûre

1. Faire entrer uniquement les prospects autorisés dans la nouvelle campagne.
2. Exclure automatiquement les clients payants et les destinataires déjà servis pour chaque étape.
3. Utiliser un identifiant stable par destinataire et par étape pour empêcher tout doublon.
4. Centraliser le désabonnement à l’échelle de tout le marketing, pas seulement d’une séquence.
5. Envoyer d’abord les cinq emails de test à l’administrateur, puis un petit lot contrôlé, avant activation générale.
6. N’activer qu’une seule planification après validation des liens, du prix et du rendu mobile.

## Phase 6 — Tableau de contrôle dans Gestion

Remplacer les anciens indicateurs 5/5, 6/6 et « relance 5 » par une vue simple :

- campagne active / arrêtée / archivée ;
- email prévu, date, segment et nombre de destinataires ;
- envoyé, délivré, ouvert, cliqué, acheté, désinscrit et échoué ;
- taux de clic unique et conversion après clic ;
- bouton **Arrêt d’urgence** ;
- historique séparé des anciennes campagnes, non réactivable.

## Phase 7 — Validation avant lancement

1. Vérifier qu’aucune ancienne planification ne tourne et qu’aucun ancien bouton ne peut envoyer.
2. Contrôler les cinq rendus sur ordinateur et mobile.
3. Cliquer chaque CTA et vérifier l’arrivée sur `/commander`, le tarif affiché et l’ouverture du paiement.
4. Tester achat, désinscription, doublon, adresse supprimée et destinataire déjà client.
5. Vérifier l’enregistrement d’un seul envoi et d’un seul clic par action réelle.
6. Lancer progressivement et comparer les résultats par étape ; améliorer d’abord le message le moins cliqué, sans ajouter de relances sauvages.

## Détails techniques

- Le nettoyage des données opérationnelles sera séparé de l’historique d’audit : on neutralise les anciens états sans perdre les preuves d’envoi utiles au diagnostic.
- Les changements de structure éventuels seront protégés par les règles d’accès administrateur existantes.
- Le nouveau moteur vérifiera côté serveur les destinataires, l’idempotence, les exclusions et les liens.
- Le domaine d’envoi intégré n’est pas encore configuré ; la mise en place du moteur unique inclura sa configuration avant bascule, afin de ne pas dépendre durablement de plusieurs fournisseurs concurrents.

## Critères de réussite

- Zéro ancienne campagne planifiée ou déclenchable.
- Zéro contenu actif mentionnant une ancienne offre.
- Une seule séquence commerciale, un seul moteur et un seul lien d’achat.
- Aucun acheteur ou désinscrit relancé.
- Chaque clic attribué à la bonne étape.
- Le tableau Gestion montre immédiatement ce qui est actif, envoyé, cliqué et converti.
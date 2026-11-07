# Audit V3 du 7 novembre 2026

## État

Audit non clos : la diffusion large n'est pas validée. Les corrections de fonctions ont été déployées pour vérifier leur comportement réel ; les modifications des pages n'ont pas fait l'objet d'une nouvelle publication du site. Aucun email ni paiement réel n'a été déclenché par les vérifications.

## Contrôles réussis

- 79 tests : tarifs mensuels et fidélité, date V2, droits par formule, règles de rédaction, lancement KDP, lecteurs Excel/Word, refus anonymes, clés personnelles, protection des comptes existants, retours de paiement et destinations réseau interdites.
- 15 fonctions déployées refusent réellement les appels anonymes avec un statut 401 avant génération.
- Pages Clés API, Questions-réponses, Mots-clés KDP, Premium et Merci ouvertes dans l'aperçu avec le compte connecté ; contrôle mobile sans débordement horizontal.
- Dernier signal de compilation : OK.
- Aucune génération réelle avec une clé personnelle ni transaction réelle : ces parcours positifs restent non vérifiés par cet audit.

## Corrections

- Accès authentifié avant 15 services IA/recherche signalés comme publics.
- Sommaire V3, cible/promesse et mémoire : clé personnelle exigée pour les abonnés, pas de repli vers les clés de l'opérateur ; privilège serveur réservé au rôle administrateur protégé.
- Inscription essai, démarrage essai et activation bêta : aucune réécriture des comptes existants ; quiz public : aucun écrasement des prospects déjà présents.
- Codes d'accès supprimés des réponses publiques bêta/paiement ; nouveaux codes d'essai cryptographiques plus longs.
- Retour de paiement : comptes existants préservés, achats étrangers au checkout historique reconnus comme non éligibles ; nouveaux forfaits restent gérés par le webhook.
- Documentation : retrait du privilège administrateur issu des métadonnées modifiables par l'utilisateur.
- Téléchargements d'images : validation des adresses publiques et redirects ; DNS indisponible refusé. Risque résiduel de DNS rebinding : les connexions ne sont pas épinglées à l'adresse résolue.
- Textes harmonisés : clés personnelles, quotas, langues, moyens de paiement réellement présentés, déclaration IA KDP, ressources et confirmation de paiement.
- Dépendances inutilisées retirées : Fabric, googleapis, Firecrawl SDK. Versions compatibles mises à jour : Axios 1.21.0, Mammoth 1.13.0, React Router 6.30.4, SheetJS 0.20.3 (distribution officielle épinglée).

## Points ouverts

1. Nouveau scan approfondi après sauvegarde : le rapport précédent (24 erreurs et 35 avertissements) décrit le code avant ces corrections ; aucun décompte de résolution ne peut être certifié sans rescan.
2. Codes bêta historiques courts/prédéfinis : remplacement à faire uniquement après décision de Georges, sans toucher aux droits déjà acquis ni envoyer d'email sans accord. Codes générés par l'administration actuelle également courts : à traiter avec cette décision.
3. Démo publique : email au destinataire fourni non vérifié, textes anciens 47 € et promesse PDF/chapitre non étayée par ce handler. Sécuriser la réception et corriger les promesses implique d'adapter le formulaire/parcours existant ; validation requise.
4. Contrôle de données : 4 avertissements (capture_events en écriture publique, forum_likes en lecture publique, launch_settings public, téléversements testimonials publics). Plusieurs usages sont intentionnels ; modifications à adapter aux visiteurs et aux compteurs avant de resserrer les règles.
5. Bibliothèques : le nouveau scan signale encore des dépendances transitives et des versions sans correctif disponible, notamment PDF, XML, graphiques et validation. Certains avertissements concernent des chemins Node absents du navigateur ; aucune déclaration globale de sécurité.
6. Anciennes clés d'accès à six caractères : aucune rotation générale ni coupure de connexion des anciens clients pendant cet audit.
7. Suivi des emails Resend : clé de signature manquante déjà indiquée dans la roadmap ; aucun suivi réactivé.

## Préservation

Prix 19/29/59 €, fidélité 15,20/23,20/47,20 €, cadeaux 67/47/97/27 € (238 €), fin V2 au 31 décembre 2027 et droits existants inchangés. Les réglages Stripe, produits, abonnements et achats réels n'ont pas été modifiés par les tests.
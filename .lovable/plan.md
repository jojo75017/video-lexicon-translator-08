# Rapports DMARC : rien à changer

Vous gardez les rapports tels quels. Aucune modification n'est nécessaire dans l'application, dans le DNS ou dans vos envois : ces emails sont un signe que votre domaine d'envoi `ebookstudio-mail.fr` est bien surveillé.

## Ce que sont ces emails

- Envoyés automatiquement chaque jour par Microsoft, Google, Yahoo et d'autres.
- Ils résument les emails envoyés en votre nom et si l'authentification est passée.
- Ils arrivent chez vous parce que votre adresse figure dans la balise `rua` du DMARC de `ebookstudio-mail.fr`.

## Pour qu'ils ne gênent plus votre boîte (à faire dans Gmail, 1 minute)

1. Ouvrir Gmail, cliquer sur la flèche de la barre de recherche.
2. Champ « De » : `dmarcreport@microsoft.com OR noreply-dmarc-support@google.com OR dmarc`
3. Cliquer sur « Créer un filtre ».
4. Cocher « Ne jamais envoyer dans le dossier Spam », « Appliquer le libellé » → nouveau libellé `DMARC`, et « Ignorer la boîte de réception ».
5. Enregistrer.

Les rapports continueront d'arriver, rangés dans le libellé `DMARC`, consultables si un jour vous suspectez une usurpation de votre domaine.

## Aucune action côté projet

- Pas de changement de code, de base, de fonction d'envoi ni de DNS.
- Si un jour vous voulez arrêter ces rapports, il suffira de retirer l'adresse de la balise `rua` chez le service qui gère le DNS de `ebookstudio-mail.fr`.

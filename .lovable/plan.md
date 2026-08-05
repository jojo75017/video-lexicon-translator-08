# Plan immédiat : débloquer les emails sans crédits inutiles

## Ce qu'il faut faire maintenant

1. **Ouvrir le dialogue de configuration email** (bouton ci-dessous).
2. **Choisir `notify.ebookstudio.fr`** comme sous-domaine d'envoi.
3. **Laisser le curseur « Afficher tel qu'envoyé depuis @ebookstudio.fr » éteint** (gris).
4. **Copier les 2 enregistrements NS** affichés (ex. `ns1.lovable.cloud`, `ns2.lovable.cloud`).
5. **Les coller dans Hostinger DNS** pour le sous-domaine `notify`.
6. **Attendre la propagation** (de 1 à 72h, souvent 1–4h).
7. **Revenir ici** pour vérifier le statut avant de désactiver le mode « zéro envoi ».

## Ce qui est déjà sécurisé

- Le mode **zéro envoi** est actif : aucun email ne partira avant validation effective du domaine.
- Aucune campagne, code d'accès ou relance ne peut être déclenché par erreur.
- Les inscriptions et paiements restent enregistrés ; seul l'envoi du message est bloqué.

## Ce qu'on ne fait pas tout de suite

- Aucun crédit supplémentaire n'est consommé pour des modifications techniques tant que le domaine n'est pas validé.
- On ne remplace pas GetResponse avant que les emails transactionnels ne soient prouvés fonctionnels.
- On ne réactive pas la séquence marketing de 5 emails avant un test réussi à une adresse admin.

## Après validation du domaine

1. Confirmer le statut `active` côté Lovable.
2. Désactiver le verrou zéro envoi (`EMAIL_SENDING_ENABLED = true`).
3. Scaffolder les emails transactionnels (accès, récupération, confirmation).
4. Envoyer un seul email test à l'administrateur.
5. Si le test est OK, réactiver progressivement les envois indispensables.

## Prochaine action

Cliquer sur le bouton de configuration email ci-dessous pour obtenir les enregistrements NS exacts à copier dans Hostinger.

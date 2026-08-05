# Plan : Réactiver l'envoi d'emails via Resend

## Votre décision

Vous choisissez de **réabonner Resend** (~20 €/mois) et de réactiver le moteur d'envoi actuel. C'est la solution la plus rapide.

## Ce qu'il faut faire de votre côté (obligatoire)

1. **Réabonnez-vous à Resend** sur le plan à 20 €/mois (ou l'équivalent en euros selon votre compte).
2. **Vérifiez (ou re-vérifiez) votre domaine d'envoi** dans Resend : `ebookstudio.fr` ou `notify.ebookstudio.fr` selon ce qui était configuré avant.
3. **Vérifiez que `RESEND_API_KEY` est toujours dans les secrets du projet.** Si vous avez changé de clé en vous réabonnant, il faudra me la donner pour mettre à jour le secret.

## Ce que je vais faire côté technique

1. **Supprimer le verrou « zéro envoi »** (`EMAIL_SENDING_ENABLED`) pour que les emails repartent.
2. **Vérifier que toutes les fonctions d'envoi** (`send-sales-email`, `resend-access-code`, `payments-webhook`, `trial-signup`) reprennent bien via Resend.
3. **Garder Brevo** uniquement pour la synchronisation des contacts, si vous le souhaitez.
4. **Envoyer un email de test** à votre adresse pour confirmer que tout repart.
5. **Mettre à jour le tableau de suivi** CommunicationJourneyTracker pour indiquer que Resend est réactivé.

## Ensuite, si vous le voulez

- On peut relancer une séquence d'emails propre (la nouvelle séquence canonique de 5 emails à 47 €) quand l'envoi est validé.
- On peut nettoyer les anciennes campagnes résiduelles pour éviter que des prospects reçoivent des emails obsolètes.

## Prochaine action

Dites-moi quand vous avez réabonné Resend et vérifié le domaine, puis je retire le verrou et je teste l'envoi.

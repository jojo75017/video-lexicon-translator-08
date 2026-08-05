# Plan : Réactiver l'envoi d'emails via Resend

## État actuel

- Vous êtes encore abonné à Resend **jusqu'au 20 août**.
- Votre **domaine est déjà configuré et vérifié** dans Resend.
- Le verrou « zéro envoi » (`EMAIL_SENDING_ENABLED = false`) bloque toujours les envois dans le projet.

## Ce qu'il faut faire de votre côté

1. **Renouvelez votre abonnement Resend après le 20 août** pour ne pas être coupé.
2. **Ne touchez pas à la configuration du domaine** : elle est déjà bonne.
3. Si vous avez généré une nouvelle clé API Resend, donnez-la-moi pour mettre à jour le secret `RESEND_API_KEY`. Sinon, la clé actuelle reste valide.

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

Je peux **retirer le verrou « zéro envoi »** maintenant et envoyer un email de test. Voulez-vous que je le fasse ?

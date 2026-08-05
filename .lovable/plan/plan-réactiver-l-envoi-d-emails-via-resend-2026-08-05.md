# Plan : Réactiver l'envoi d'emails via Resend

## État actuel

- Vous êtes encore abonné à Resend **jusqu'au 20 août**.
- Votre **domaine est déjà configuré et vérifié** dans Resend.
- Le verrou « zéro envoi » (`EMAIL_SENDING_ENABLED = false`) bloque toujours les envois dans le projet.

## Ce qu'il faut faire de votre côté

1. **Renouvelez votre abonnement Resend après le 20 août** pour ne pas être coupé.
2. **Ne touchez pas à la configuration du domaine** : elle est déjà bonne.
3. Si vous avez généré une nouvelle clé API Resend, donnez-la-moi pour mettre à jour le secret `RESEND_API_KEY`. Sinon, la clé actuelle reste valide.

## Ce que je vais faire côté technique — test minimal, crédits économisés

Le domaine étant validé, on va droit au but en une seule passe, sans exploration inutile :

1. **Passer `EMAIL_SENDING_ENABLED` à `true`** pour lever le verrou « zéro envoi ».
2. **Un seul envoi de test**, vers votre adresse uniquement (`pacheco97223@gmail.com`), via la fonction `resend-access-code` — celle qui compte le plus pour vos abonnés.
3. **Lire le résultat** : statut de la réponse Resend et log de la fonction. Un seul aller-retour, pas de boucle de debug.
4. **Si le test passe** : je confirme et on s'arrête là. Aucune campagne n'est envoyée automatiquement.
5. **Si le test échoue** : je vous donne le message d'erreur exact et je remets le verrou pour éviter tout envoi accidentel.

Pas de refonte, pas de modification des templates, pas d'envoi de masse dans cette étape.

## Ensuite, seulement si vous le demandez

- Réactiver la séquence canonique de 5 emails à 47 €.
- Nettoyer les anciennes campagnes résiduelles.
- Mettre à jour le tableau de suivi des communications.

## Prochaine action

Approuvez ce plan et je lève le verrou, j'envoie l'email de test à votre adresse, et je vous dis simplement si c'est arrivé ou non.

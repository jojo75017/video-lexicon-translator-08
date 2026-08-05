# Plan simple : passer les emails à Hostinger sans coupure

## Objectif

Utiliser une vraie boîte Hostinger pour **envoyer et recevoir** les emails de `ebookstudio.fr`, puis retirer Amazon uniquement lorsqu’il ne sert plus.

## Étapes

1. **Arrêter les essais Lovable Emails**
   - Ne lancer aucune nouvelle configuration de domaine email dans Lovable.
   - Ne modifier ni le site, ni les parcours d’achat, ni les campagnes pendant cette intervention.

2. **Faire l’inventaire avant toute suppression**
   - Relever les enregistrements DNS actuels liés aux emails dans Hostinger.
   - Identifier précisément ce qu’Amazon gère aujourd’hui : réception, envoi de l’application, ou anciens enregistrements inutilisés.
   - Conserver une copie de ces valeurs pour pouvoir revenir en arrière.

3. **Créer la boîte chez Hostinger**
   - Créer ou confirmer une adresse principale, par exemple `contact@ebookstudio.fr`.
   - Récupérer dans Hostinger les valeurs exactes MX, SPF, DKIM et DMARC propres à cette boîte.

4. **Basculer progressivement les DNS**
   - Installer les valeurs fournies par Hostinger sans inventer d’adresse IP ni de CNAME.
   - Éviter plusieurs SPF concurrents : fusionner ou remplacer l’ancien SPF selon l’usage Amazon constaté.
   - Ne retirer les MX et éléments Amazon devenus inutiles qu’après validation de Hostinger.

5. **Vérifier avant de considérer la migration terminée**
   - Envoyer un email depuis la boîte Hostinger vers une adresse extérieure.
   - Répondre depuis cette adresse extérieure et vérifier la réception dans Hostinger.
   - Contrôler que SPF et DKIM passent, et que DMARC ne bloque pas les messages.

6. **Reconnecter ensuite l’application, séparément**
   - Une fois la boîte stable, relier uniquement les emails indispensables de l’application : codes d’accès, récupération et confirmations.
   - Tester ces parcours avant de désactiver leur ancien moyen d’envoi.
   - Garder les campagnes marketing séparées : une boîte Hostinger classique n’est pas adaptée aux envois massifs.

## Ce dont j’aurai besoin

Une capture de la page **Hostinger → Emails** montrant l’offre ou la boîte active, puis une capture de **DNS / Zone DNS** filtrée sur `MX` et `TXT`. Les valeurs sensibles comme le mot de passe de la boîte ne doivent jamais être envoyées dans le chat.

## Protection contre les dégâts

- Aucun DNS Amazon supprimé avant un test réussi d’envoi **et** de réception chez Hostinger.
- Aucun secret demandé avant que la boîte Hostinger existe réellement.
- Une seule modification contrôlée à la fois, avec possibilité de retour arrière.
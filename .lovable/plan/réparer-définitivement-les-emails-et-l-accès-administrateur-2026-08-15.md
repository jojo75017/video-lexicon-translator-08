# Réparer définitivement les emails et l’accès administrateur V2/V3

## Constats vérifiés
- Le forfait Resend montré couvre **50 000 emails/mois** et se renouvelle le **20 août**.
- Aujourd’hui, **100 emails `clic-b1` ont bien été envoyés, sans erreur**. L’arrêt à 100 ne vient pas du forfait : la fonction limite elle-même le lot demandé à 100 par défaut et à 300 maximum.
- Le compte `boubetgeorges@gmail.com` possède bien le rôle **administrateur** dans le backend.
- La barre V2 / Dashboard admin / Prospects / Emails n’est affichée que si la session du navigateur est restaurée et si le rôle admin est reconnu. Le rôle existe donc bien ; le parcours navigateur/session doit être rendu infaillible.

## 1. Envoyer réellement toute la campagne
- Retirer la fausse contrainte de 100 emails par lancement et utiliser des lots adaptés au forfait actif, sans doublons.
- Conserver une cadence prudente entre les requêtes pour respecter les limites techniques du fournisseur.
- Enregistrer chaque destinataire avec un identifiant d’envoi unique et un état réel : **en attente, envoyé, erreur, exclu**.
- Dédupliquer le suivi par identifiant d’envoi afin qu’un même email ne soit jamais compté deux fois.
- Ajouter dans le panneau admin une action **Envoyer tous les destinataires restants** avec progression réelle, nombre restant et erreurs détaillées.
- Reprendre immédiatement les **236 destinataires restants de B1**, puis permettre le lancement contrôlé des séquences A/B/C suivantes.
- Ne jamais renvoyer une séquence déjà reçue et continuer d’exclure acheteurs, désinscrits et contacts inactifs.

## 2. Créer une entrée administrateur fiable et unique
- Tester la restauration réelle de la session sur `/`, `/admin`, `/ebook-planner` et `/v3`, y compris après actualisation complète.
- Attendre la restauration de la session et la validation du rôle backend avant toute décision de redirection ; aucun délai ne doit transformer un état inconnu en visiteur.
- Si la session admin est valide :
  - `/` et `/admin` ouvrent le **vrai Dashboard administrateur** ;
  - `/ebook-planner` ouvre directement la **V2** ;
  - `/v3` ouvre la **V3 en mode administrateur**, jamais la page de vente ni le mode contemplation.
- En cas d’erreur temporaire de validation, afficher une reprise de vérification et conserver la destination demandée au lieu d’envoyer vers `/commander`.
- Nettoyer uniquement une session réellement expirée, puis afficher la connexion admin avec retour automatique vers la destination initiale.

## 3. Garantir les sorties V2/V3 sur toutes les pages admin
- Afficher en permanence pour l’administrateur confirmé :

```text
[V2 — Générateur] [V3 — Tester] [Dashboard admin] [Prospects] [Emails]
```

- Garder cette barre visible sur ordinateur et mobile, y compris en mode « Voir comme un abonné ».
- Ajouter les accès essentiels dans l’en-tête en secours, afin qu’un défaut d’une barre secondaire ne puisse plus bloquer V2 ou le Dashboard.
- Supprimer toute redirection intermédiaire vers `/commander` pour ces liens administrateur.

## 4. Validation avant de déclarer la correction terminée
- Vérifier dans un navigateur avec la session administrateur réelle : arrivée sur le Dashboard, ouverture V2, ouverture V3, présence des onglets et conservation après actualisation.
- Tester également une session abonné et une session déconnectée pour confirmer qu’aucun droit administrateur n’est accordé par erreur.
- Lancer la reprise B1, contrôler les réponses du fournisseur et vérifier dans le journal le total envoyé, restant et les éventuelles erreurs.
- Contrôler dans l’interface le détail par destinataire et vérifier qu’un second lancement n’envoie aucun doublon.

## Détails techniques
- Envoi : corriger la limite et le traitement par lots dans `send-closing-47`, avec reprise idempotente et journal dédupliqué par `message_id`.
- Panneau : mettre à jour `ClosingCampaignPanel` pour lancer/reprendre un segment complet et afficher une progression fiable.
- Accès : consolider `AdminAccessContext`, `adminAccess`, les destinations de `App.tsx` et la mise en page V3 autour d’un seul état serveur `restoring/admin/non-admin/error`.
- Navigation : maintenir `V3AdminQuickAccess` et l’en-tête comme accès permanents, sans fonder les droits sur le stockage local.

# Lever les 2 blocages de délivrabilité

Les deux blocages confirmés par le diagnostic ne sont pas dans le code : l'un est un enregistrement DNS, l'autre une clé d'envoi trop restreinte. Voici exactement quoi faire, et ce que je fais ensuite côté outil pour que tout soit propre.

## Blocage 1 — DMARC invalide sur ebookstudio.fr

Valeur publiée aujourd'hui, illisible pour Gmail :
`v=DMARC1; p = aucun ; rua=mailto:rua@dmarc.brevo.com`

À remplacer chez votre hébergeur DNS (où vous gérez `ebookstudio.fr`, probablement Hostinger) par exactement :

```text
Type  : TXT
Nom   : _dmarc
Valeur: v=DMARC1; p=none; rua=mailto:boubetgeorges@gmail.com; adkim=r; aspf=r; fo=1
```

L'adresse `boubetgeorges@gmail.com` est juste celle qui reçoit les rapports DMARC — elle n'a pas besoin d'être sur le même domaine. Gmail fonctionne très bien pour ça.

C'est le seul enregistrement à changer. SPF et DKIM sont déjà corrects, ne pas y toucher. Propagation : quelques minutes à 24 h.

## Blocage 2 — Clé d'envoi restreinte (aucun statut de livraison)

La clé actuelle est en « envoi seul » : la lecture des évènements renvoie 401, donc 0 livraison confirmée sur 12 663 envois. Il faut une clé **Full access** créée dans votre compte d'envoi, puis me la donner : je la remplace dans le secret `RESEND_API_KEY` (je ne l'affiche jamais).

## Ce que je fais dès que ces deux points sont faits

1. Relancer le diagnostic et vérifier que les 4 contrôles passent au vert (SPF, DKIM, DMARC, clé complète).
2. Synchroniser les livraisons pour remplir livré / rebond / plainte sur les envois des 14 derniers jours.
3. Nettoyer la liste : rebonds durs et jamais-ouvreurs après 5 envois sortis des envois.
4. Test d'arrivée réel marqué `[TEST]` vers Gmail, Outlook et Yahoo, avec affichage du résultat d'authentification.
5. Bandeau rouge dans le panneau admin tant que le taux de livraison n'est pas confirmé, vert ensuite.

Aucun envoi de campagne dans cette étape : on prouve d'abord la livraison.

## Détails techniques

- `email-health-sync` mode `diagnostic` : déjà en place, sert de contrôle de sortie.
- `email_send_log` : remplissage de `status` / `last_event` par la synchronisation, puis alimentation de la table de suppression.
- Ajout d'un mode `deliverability_test` dans `email-health-sync` pour l'envoi `[TEST]` multi-fournisseurs.
- `EmailHealthPanel` : bandeau d'état global + bouton « Test d'arrivée ».
- Rien à redéployer côté DNS ; le changement de secret ne demande pas de modification de code.

## Prochaine action

Publiez le DMARC ci-dessus, créez la clé à accès complet, et donnez-la moi : j'enchaîne les 5 étapes dans la foulée.

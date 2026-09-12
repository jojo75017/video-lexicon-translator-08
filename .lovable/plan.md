# Cadeau 10 niches — PDF réservé à ceux qui cliquent

## Ce qui change

Aujourd'hui, l'email « 10 niches offertes » mentionne le cadeau sans condition. Nouvelle règle : **le PDF Google Drive n'est jamais dans l'email**. Il n'est accessible qu'à ceux qui cliquent.

```text
EMAIL (texte simple)
  « Cliquez ici pour recevoir votre PDF des 10 niches »
        │  lien tracé /r/l5
        ▼
PAGE /10-niches-offertes  (clic enregistré)
  bouton « Télécharger le PDF des 10 niches »
        │
        ▼
  PDF Google Drive
```

## Travaux

1. **Email de la séquence (fonction d'envoi)** : réécrire le texte de l'email cadeau pour dire clairement « cliquez pour recevoir le PDF » ; un seul lien, le lien tracé vers la page du site. Aucun lien Drive direct dans le corps.
2. **Page `/10-niches-offertes`** : le bouton « Télécharger le PDF » devient la récompense du clic, avec une ligne d'explication (« Vous avez cliqué : voici votre PDF »). Le lien Drive reste côté page, jamais côté email.
3. **Admin `/admin/emails-lancement`** : préciser dans le libellé que le PDF n'est délivré qu'aux cliqueurs, pour que ce soit lisible au moment de l'envoi.

## Effet concret

- Celui qui ne clique pas ne reçoit pas le PDF — le cadeau récompense l'engagement.
- Le clic reste tracé : vous voyez dans l'admin qui a effectivement débloqué le PDF.
- Les exclusions, la déduplication et les lots de 100/jour restent inchangés.

## Ce qui ne bouge pas

Aucun changement de tarifs, paiements, base de données, sécurité ou calculs KDP. Le PDF reste hébergé sur Google Drive.

## Vérification

Après déploiement, un email de test vers votre adresse pour vérifier le nouveau texte avant tout envoi aux prospects.

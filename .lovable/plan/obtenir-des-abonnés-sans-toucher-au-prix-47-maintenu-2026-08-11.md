# Obtenir des abonnés sans toucher au prix (47 € maintenu)

## Ce que disent les chiffres lus en base aujourd'hui

| Donnée (14 derniers jours sauf mention) | Valeur |
| --- | --- |
| Affichages des formulaires de capture (sticky / popup / inline) | 537 |
| Clics sur ces formulaires | 1 |
| Emails laissés (leads, total historique) | 23 |
| Prospects actifs | 634 |
| Ouvreurs d'au moins un email | 467 |
| Cliqueurs | 41 |
| Commandes payées | 0 |
| Paniers laissés en « pending » | 1 |
| Témoignages approuvés affichables | 0 |
| Abonnés actifs | 13 |

Lecture : le trafic est là (537 affichages), mais **1 seul clic** et aucun email laissé.
Le blocage n'est donc pas le prix, c'est la capture puis la preuve. Et il n'y a
**aucun témoignage approuvé** disponible pour rassurer sur la page de vente.

## Les leviers, à prix constant

### 1. Réparer la capture (le trou le plus gros)
537 affichages → 1 clic signifie que les encarts sont vus mais n'intéressent pas,
ou qu'ils apparaissent au mauvais moment.

- Une seule promesse par encart, concrète et chiffrée : « Le sommaire complet de
  votre livre, généré en 2 minutes — gratuit, sans carte ».
- Le popup n'apparaît qu'à la sortie de page ou après 40 % de défilement, plus au chargement.
- Le sticky devient un bouton d'action unique vers la démo (pas un champ email froid).
- L'inline est placé juste après une démonstration visible du résultat.
- Champ email unique, bouton « Voir mon sommaire », aucune autre demande.

### 2. Faire de la démo la vraie porte d'entrée
La démo montre déjà le sommaire gratuitement. Elle doit devenir la destination de
tous les liens (emails, réseaux, signature), avec en fin de parcours : couverture,
extrait de chapitre, fichier exporté, puis le bouton 47 €.

### 3. Créer la preuve qui manque (0 témoignage)
- Demander aux 13 abonnés actifs : 3 lignes + prénom + capture de leur livre.
- Un module d'auto-collecte : lien privé envoyé par email, dépôt du témoignage,
  validation par l'admin, affichage sur `/commander` et `/demo`.
- Publier aussi 2 études de cas détaillées (avant / après, temps passé, résultat KDP).

### 4. Augmenter la valeur au lieu de baisser le prix
Le prix reste 47 €, on rend l'offre plus lourde et limitée dans le temps :
- bonus de clôture (guides niches, modèles de couvertures, checklist J-7) rappelés au-dessus du bouton ;
- accompagnement de démarrage offert : « je crée votre premier sommaire avec vous » ;
- garantie 30 jours, paiement en 2 ou 3 fois et « PayPal accepté » affichés au-dessus du bouton, pas en bas de page ;
- rappel du calcul : 47 € une fois contre 204 €/an à partir du 1er octobre.

### 5. Relancer les 41 cliqueurs et les 467 ouvreurs
Séquence déjà en place, à utiliser avec deux angles nouveaux :
- cliqueurs : message individuel, question ouverte « qu'est-ce qui vous retient ? » ;
- ouvreurs : preuve en images d'un livre complet, puis échéance réelle.
- Ajouter une relance panier : toute commande restée « pending » plus de 2 h reçoit un email de reprise.

### 6. Parrainage activé pour de vrai
158 clics d'affiliation existent déjà. Donner aux 13 abonnés leur lien prêt à copier,
un visuel et 3 textes à publier, plus le rappel de la commission de 30 % (14 € par vente).

## Ordre de réalisation

```text
1  Refonte des encarts de capture (promesse, déclenchement, 1 seul champ)
2  Bloc réassurance + bonus + témoignages au-dessus du bouton sur /commander
3  Module de collecte de témoignages + demande aux 13 abonnés
4  Relance panier abandonné (pending > 2 h)
5  Kit de parrainage prêt à copier dans l'espace abonné
6  Envois aux cliqueurs puis aux ouvreurs, suivi par canal
```

## Détails techniques

- Capture : `src/components/marketing/*` (popup, sticky, inline) — nouvelle copie,
  déclencheurs `scroll 40 %` et `mouseleave`, suppression du délai fixe ;
  tracking conservé via `capture_events` (`view`, `click`, `submit`) pour mesurer le gain.
- Page de vente : `V3CommanderPage.tsx` — bloc réassurance (garantie, 2×/3×, PayPal),
  bonus issus de `src/data/v3Launch.ts`, témoignages lus dans `book_testimonials`
  (`approved = true`, sans email affiché).
- Collecte de témoignages : page publique de dépôt écrivant dans `book_testimonials`
  (`approved = false`), validation dans l'admin ; photos dans le bucket `testimonials`.
- Relance panier : fonction planifiée qui lit `funnel_orders` (`status = 'pending'`,
  `created_at < now() - 2h`) et envoie un email via `send-sales-email`, marquage dans
  `metadata` pour ne jamais relancer deux fois.
- Parrainage : `useReferral` + `referral_codes` pour afficher le lien, visuel et textes.
- Suivi : `ChannelPerformancePanel.tsx` étendu avec le taux affichage → clic → email
  des encarts, par surface.
- Aucun changement de tarif : 47 € à vie jusqu'au 30/09/2026, puis Plume 17 € / Édition 27 €.

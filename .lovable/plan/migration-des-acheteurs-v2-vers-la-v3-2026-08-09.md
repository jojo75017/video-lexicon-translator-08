# Migration des acheteurs V2 vers la V3

## Le principe

Les acheteurs V2 (accès à vie) **gardent leur V2 intacte, à vie**, et reçoivent **3 nouveautés V3 offertes** — pas la V3 complète. Pour aller plus loin, ils ont une offre de fidélité réservée : **-20 % à vie** sur Plume ou Édition (mensuel et annuel).

Objectif : qu'ils sentent un vrai bonus (ils n'ont pas payé pour rien) sans que la V3 complète devienne gratuite.

## Ce qu'ils reçoivent gratuitement, à vie

V2 complète, inchangée, **plus** :

1. **Ebookstudio-Génie + Sommaire IA guidé** — décrire son idée, construire le sommaire avec l'IA, corriger ensemble.
2. **Correcteur de livre** (`/v3/corriger`) — import du manuscrit, correction stricte, français garanti.
3. **Export premium** — sommaire stylé (fond crème, filets dorés), titres de chapitres nettoyés, pagination propre.

Limites de la version offerte (pour laisser une marge claire vers les forfaits) :

- 2 livres / mois via les nouveautés
- 20 chapitres max, 3 000 mots / chapitre
- Pas d'audiolivre, pas de Cover Studio Pro, pas de traductions, pas de BD Studio, pas de Recherche Approfondie, pas des outils vendeur (Amazon Spy, Audit ASIN, 600 niches)

## L'offre de fidélité : -20 % à vie

| Forfait | Prix public | Prix ancien client V2 |
| --- | --- | --- |
| Plume mensuel | 29 € | **23,20 €** |
| Plume annuel | 290 € | **232 €** |
| Édition mensuel | 49 € | **39,20 €** |
| Édition annuel | 490 € | **392 €** |

- Remise **permanente** tant que l'abonnement reste actif.
- Réservée aux emails ayant une commande V2 payée : rien à saisir, la remise s'affiche automatiquement quand ils sont connectés.
- Plus jamais d'offre « à vie » : la V2 achetée reste à vie, mais la V3 est en abonnement uniquement.

## Le parcours

0. **Un onglet dédié « Ancien client V2 »** visible dans le header (menu Forfaits) et dans la sidebar V3, avec un badge « -20 % à vie ». Il n'apparaît que pour les acheteurs V2 connectés et mène à `/v3/migration`.
1. Email « Votre V2 évolue » → bouton vers `/v3/migration`.
2. `/v3/migration` (nouvelle page, réservée aux acheteurs V2) :
   - Rappel : « Votre accès V2 reste à vie »
   - Les 3 nouveautés offertes, avec leurs limites affichées honnêtement
   - Le comparatif V2 offerte / Plume / Édition
   - Les 2 cartes de prix remisées (mensuel ⇄ annuel), Stripe + PayPal
3. Dans l'app : bandeau « Ancien client — remise -20 % à vie » sur les pages forfaits, et cadenas explicites sur les outils réservés, avec le prix remisé au lieu du prix public.

## Détails techniques

**Identification de l'acheteur V2** — vérifié en base : les commandes payées vivent dans `v3_installment_orders`, plan `v2_1x` / `v2_3x`, statuts `completed` / `active` (26 lignes restent en `pending` = non payées, donc exclues).

- Étendre `useV3Entitlement` avec `hasV2` (plan commençant par `v2`, statut payé) — même RPC `get_my_v3_installment_orders`, aucune migration nécessaire.
- Nouveau `src/data/v2LegacyAccess.ts` : liste des 3 modules offerts (`genie`, `sommaire-ia`, `corriger`, export premium) + quotas (2 livres/mois, 20 chapitres, 3 000 mots).
- `src/data/v3ToolPlans.ts` : ajouter `LEGACY_V2_UNLOCKED` et une fonction `isUnlockedForLegacyV2(toolId)` utilisée par la sidebar, le hub et les gardes de route.
- `src/config/v3Launch.ts` : ajouter `/v3/migration` aux routes accessibles avant l'ouverture publique, et laisser les 3 modules offerts accessibles aux `hasV2` même avant le 1er octobre.
- Prix remisés : créer 4 prix Stripe dédiés (`v3_plume_monthly_legacy`, `v3_plume_annual_legacy`, `v3_edition_monthly_legacy`, `v3_edition_annual_legacy`) et les résoudre dans `getV3PriceId` selon `hasV2`. Le checkout serveur revérifie le droit V2 côté base avant d'accepter un prix `_legacy` (pas de remise obtenue en trafiquant le front).
- PayPal : plans d'abonnement remisés équivalents dans `PayPalSubscribeButton`.
- Nouvelle page `src/pages/v3public/V3MigrationPage.tsx` + route, redirection des non-V2 vers `/v3/forfaits`.
- Email de migration via la mécanique d'envoi existante (Resend), ciblé sur les emails à commande V2 payée.

## Hors périmètre

- Aucun changement des tarifs publics (29 € / 49 €).
- Aucune migration de schéma.
- Pas de remboursement ni de conversion de l'achat V2 en crédit.

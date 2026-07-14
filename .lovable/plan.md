
# Mise en attente : Lancement V3 « Édition inédite » 30 agents

## Statut
**Pas d'implémentation ce mois-ci.** Ce plan est enregistré comme item de roadmap pour être exécuté **début octobre 2026**.

## Ce qu'on veut obtenir (rappel)
- **Une seule offre V3** (plus de V4 séparée) qui regroupe **30 agents** dans un workflow complet.
- **Tarif de lancement 97€** du **1er octobre au 31 octobre 2026 (23h59)**.
- **Tarif normal 197€** à partir du **1er novembre 2026**.
- **Tous les modules « premium » actuellement dans le Pack Pro 347€** deviennent des **upsells à la carte** après achat de la V3 (on ne les vend plus en bundle 347€).
- Bascule automatique du prix + compte à rebours visible sur la page de vente.

## Principe : une seule source de vérité pour le prix V3
Aujourd'hui V3 = 197€ et Pack Pro = 347€ sont écrits en dur dans `roadmapV3.ts`, `v3Launch.ts`, les pages `/commande-v3`, `/vente-v3`, `V3PricingTiers`, et les 2 edge functions de paiement. On centralisera comme on l'a fait pour la promo d'été.

### Fichier prévu `src/data/v3LaunchPricing.ts`
```text
V3_LAUNCH_PRICE = 97              // prix pendant la fenêtre de lancement
V3_REGULAR_PRICE = 197            // prix normal après la fenêtre
V3_LAUNCH_START = 2026-10-01 00:00 (Europe/Paris)
V3_LAUNCH_END   = 2026-10-31 23:59 (Europe/Paris)
isV3LaunchActive()                // true dans la fenêtre
currentV3Price()                  // 97 ou 197 selon la date
v3Installments()                  // ex. 1×97€ / 2×49€ pendant lancement, sinon 1×197€ / 3×69€
```

Après le 1er novembre, `currentV3Price()` renverra automatiquement 197 : rien à toucher côté affichage. Pour rebasculer le montant réellement débité, il suffira de changer **un seul chiffre** dans l'edge function `stripe-checkout`, commenté à côté.

## Unification V3 / V4 (30 agents)
Aujourd'hui `roadmapV3.ts` définit :
- V3 base = 22 agents / 197€
- V4 « Maison d'Édition » = 30 agents / 347€ (Pack Pro)

Cible future :
- **V3 unique = 30 agents** (les 22 de base + les 8 issus des packs Pro).
- **Suppression de la notion V4** dans `V3_OFFERS` (`src/data/v3Launch.ts`) et dans `V3_FULL_PACK` (`src/data/roadmapV3.ts`) : il ne restera qu'une seule offre.
- Les **modules premium** actuellement inclus dans les packs (Revenus & Scaling, Distribution, Trafic Social, Qualité Éditoriale, Étude de Marché, Sélection éditeurs, Special Books, etc.) seront **conservés dans l'app** mais marqués comme **`upsell: true`** dans `v3ModuleRegistry.tsx`. Ils resteront verrouillés tant que l'upsell correspondant ne sera pas acheté.
- Les tunnels `/commande-v3` et `/vente-v3` n'afficheront plus **qu'une seule carte** (V3 30 agents), au prix courant (`currentV3Price()`).

Note : on **ne construira pas** les tunnels d'upsell dans ce plan — l'utilisateur a dit « on verra cela le mois prochain ». On se contentera de :
- flagger les modules comme upsell dans le registry,
- afficher un badge « Upsell » + CTA « Bientôt disponible » sur les modules concernés,
- garder l'accès admin ouvert (via `useV3Entitlement.isAdmin`) pour préparation.

## Compte à rebours de lancement
Composant prévu `src/components/sales/V3LaunchCountdown.tsx` (calqué sur `SummerPromoCountdown`) :
- **Avant le 1er octobre** : « Lancement le 1er octobre — 97€ au lieu de 197€ » + compte à rebours jusqu'au démarrage.
- **Pendant octobre** : « Offre de lancement — se termine le 31 octobre » + compte à rebours jusqu'à la fin, prix barré 197€ → 97€.
- **Après le 31 octobre** : composant renvoie `null` (retour silencieux au tarif normal 197€).

Affiché sur : `SalesPageV3Launch.tsx`, `V3CommandePage.tsx`, `V3PaiementPage.tsx`, et le hub admin.

## Changements côté paiement (montant réellement débité)
Dans `supabase/functions/stripe-checkout/index.ts`, les lookup keys V3 (`v3_base_1x`, `v3_base_2x`, `v3_base_3x`, `v3_full_1x`, `v3_full_2x`, `v3_full_3x`) :
- **Nouveau plan `v3_launch_1x` = 9700 cts** + option `v3_launch_2x` = 2× 4900 cts.
- Les plans existants `v3_base_*` (197€) resteront en place pour l'après-lancement.
- L'edge function choisira le lookup key à partir d'un paramètre `plan` envoyé par le front, qui dépendra de `isV3LaunchActive()`.
- Le Pack Full 347€ sera **désactivé** (renvoie une erreur claire « offre indisponible ») : on ne veut plus vendre le bundle.

Commentaire dans le fichier : « Pour désactiver le tarif lancement, retirer les lookup keys `v3_launch_*` ci-dessous — le front repassera automatiquement sur `v3_base_*` (197€). »

## Fichiers à modifier (à exécuter en octobre)

### Données / logique
- **`src/data/v3LaunchPricing.ts`** (nouveau) — constantes + helpers de date.
- **`src/data/roadmapV3.ts`** — `V3_PRICE` devient dynamique (`currentV3Price()`), suppression de `V3_FULL_PACK` (ou passage en `deprecated` avec un commentaire), 30 agents listés dans une seule offre.
- **`src/data/v3Launch.ts`** — `V3_OFFERS` réduit à **une seule entrée** (V3 30 agents), `installments` calés sur `v3Installments()`.
- **`src/components/admin/v3ModuleRegistry.tsx`** — ajouter le flag `upsell?: boolean` sur les modules ex-Pack Pro (Sélection éditeurs, Special Books, packs Revenus/Distribution/Social/Qualité, Étude de marché…). Badge « Upsell » + CTA désactivé pour non-admin.

### Affichage prix
- **`src/pages/SalesPageV3Launch.tsx`** — prix, badges, JSON-LD, meta description, hero, FAQ, CTA finaux : tous liés à `currentV3Price()`.
- **`src/pages/V3CommandePage.tsx`** — carte unique V3, prix courant, order bump inchangé.
- **`src/pages/V3PaiementPage.tsx`** — récap, options de paiement (`v3Installments()`), FAQ.
- **`src/components/admin/V3PricingTiers.tsx`** + **`PricingLadder497.tsx`** — suppression du tier « Pack Pro 347€ », tier unique V3 avec prix courant + liste des upsells (« bientôt »).
- **`src/components/sales/V3LaunchCountdown.tsx`** (nouveau).

### Paiement
- **`supabase/functions/stripe-checkout/index.ts`** — ajout des lookup keys `v3_launch_1x` / `v3_launch_2x` (9700 cts), désactivation du Pack Full, choix du plan côté front.

### Mémoire projet
- Mettre à jour la mémoire `business/pricing/v3-base-packs-497` pour refléter la nouvelle logique (V3 unique, packs → upsells), et créer une entrée `business/pricing/v3-launch-october` (rappel de la fenêtre 97€/197€ + date de bascule).

## Hors périmètre (volontairement)
- **Construction des tunnels d'upsell** pour les modules ex-Pack Pro — à faire le mois prochain, comme demandé.
- **Newsletter/emailings d'annonce du lancement** — sera rédigée dans un second temps.
- **Mentions historiques 347€/197€** dans les articles de blog, emails Brevo et scripts vidéo : non modifiées.

## Validation (à faire au moment de l'implémentation)
- Typecheck.
- Vérif visuelle : `/vente-v3` affiche 97€ (barré 197€) + compte à rebours qui tourne, une seule carte, 30 agents.
- Vérif admin : `PricingLadder497` (ou son remplaçant) montre 1 tier + liste des upsells « bientôt ».
- Test checkout en mode test (carte 4242…) : le montant présenté doit être **97,00 €** pendant octobre.
- Simulation post-lancement (mock de `Date.now()` en test) : le prix repasse à 197€ et le countdown disparaît.

## Action immédiate
Aucune. Ce plan reste en attente dans la roadmap et sera réactivé début octobre 2026.

# Cover Studio Pro et Studio Jeunesse redeviennent des upsells payants

Aujourd'hui, l'offre Édition (47 €/mois) annonce « Cover Studio Pro » et « BD Studio Pro + Studio Jeunesse » comme inclus, et Maison d'Édition (97 €/mois) hérite de tout Édition. Décision validée : ces deux modules ne sont **plus inclus dans aucune offre** — ils se vendent à part, en paiement unique : **Cover Studio Pro 67 €** et **Studio Jeunesse 47 €**.

## 1. Textes des offres (ce que voient les visiteurs)

- `src/data/v3Pricing.ts` (offre Édition) : retrait des lignes « Cover Studio Pro (300 DPI…) », « Couvertures Kindle, broché et relié » et « Studio Jeunesse ». « BD Studio Pro » reste inclus dans Édition. Maison d'Édition hérite automatiquement du retrait (« Tout ce que contient Édition »).
- `src/components/v3public/V3PricingOverview.tsx` : cartes Édition et Maison mises à jour (plus de mention Cover Studio Pro ni Studio Jeunesse).
- `src/pages/v3public/V3ForfaitsPage.tsx` : la ligne comparative « BD Studio Pro et Studio Jeunesse » est scindée en deux : « BD Studio Pro » (inclus Édition/Maison) et « Studio Jeunesse » (option 47 € partout) ; ajout d'une ligne « Cover Studio Pro » (option 67 € partout).
- Balayage des autres pages qui annoncent ces modules comme inclus (ex. `AvantPremiereV3Page`, bannières) pour aligner le message.

## 2. Les deux nouveaux upsells achetables à l'unité

- Ajout dans le catalogue des compléments (`V3_ADDON_LIST` / `V3_UPSELL_PACKS`) :
  - **Cover Studio Pro — 67 €** (paiement unique), bouton « Débloquer » qui ouvre le paiement intégré, route `/v3/cover-pro`.
  - **Studio Jeunesse — 47 €** (paiement unique), route du générateur jeunesse.
- Création des 2 produits et prix Stripe (mode test, synchronisés en réel à la publication) : `v3_addon_cover_pro_once` (67 €) et `v3_pack_studio_jeunesse_once` (47 €), quantité fixe 1.
- Branchement sur le checkout upsell existant (`v3-upsell-checkout`) pour que l'achat accorde le droit automatiquement (table `module_entitlements`), comme les autres packs.

## 3. Verrous d'accès (côté application)

- **Studio Jeunesse** (`V3KidsBookCreatePage`) : aujourd'hui le niveau « edition » est accordé dès que le forfait contient « edition ». Nouvelle règle : accès complet uniquement si l'upsell Studio Jeunesse a été acheté (ou admin) ; sinon affichage de l'encart d'achat à 47 €. Les abonnés Édition/Maison existants qui l'utilisaient déjà ne sont pas pénalisés rétroactivement (droit conservé pour les comptes créés avant le changement — à confirmer à l'implémentation, sinon droit acheté uniquement).
- **Cover Studio Pro** : le serveur offre déjà 3 générations gratuites à tout compte connecté, puis clé personnelle. L'upsell 67 € débloque l'usage complet sans clé personnelle (crédits illimités côté `cover-pro-status` / `cover_pro_credits` pour les acheteurs).
- Les acheteurs de l'upsell voient le module marqué « Débloqué » dans la page des compléments.

## 4. Vérifications

- Typecheck + build.
- Test à l'écran : page `/v3/forfaits` (les 2 modules n'apparaissent plus comme inclus), page upsells (2 nouvelles cartes avec prix et bouton d'achat), ouverture du paiement test pour chacun, accès Studio Jeunesse verrouillé sans achat et déverrouillé après achat test.

## Détails techniques

- Aucun changement de prix des abonnements (27/47/97 € inchangés), aucun impact sur les prix Stripe existants.
- Les anciens abonnés Édition/Maison déjà actifs : décision à prendre à l'implémentation — soit ils gardent l'accès acquis (recommandé pour ne léser personne, conforme à la règle « les anciens abonnés ne doivent jamais être lésés »), soit le verrou s'applique à tous. Par défaut : **droit conservé pour les abonnés actifs existants**.
- Mémo pricing mis à jour : Cover Studio Pro 67 € et Studio Jeunesse 47 € rejoignent la liste des upsells à l'unité.

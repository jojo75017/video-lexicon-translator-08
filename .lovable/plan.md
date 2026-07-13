# Promo d'été : offre de base 67€ → 59€ jusqu'au 31 août

## Objectif
Baisser le prix de l'offre de base (accès à vie « EbookStudio Pro ») de 67€ à **59€**, en promo saisonnière **jusqu'au 31 août 2026 (23h59)**, avec un **compte à rebours** visible sur la page de vente. Prix barré 67€ → 59€. Après le 31 août, retour facile à 67€ (une seule constante à changer).

## Principe : une source unique de vérité
Aujourd'hui le prix « 67 » est écrit en dur dans plusieurs fichiers, ce qui rend tout changement risqué. On crée une petite config centrale pour le prix promo et sa date de fin, puis on l'utilise partout.

### Nouveau fichier `src/data/summerPromo.ts`
```text
PROMO_PRICE = 59          // prix de vente actuel
REGULAR_PRICE = 67        // prix barré
PROMO_END = 2026-08-31 23:59 (Europe/Paris)
isPromoActive()           // true tant qu'on est avant la date de fin
```

## Changements côté paiement (montant réellement débité)
1. **`supabase/functions/stripe-checkout/index.ts`** : `pro_lifetime.amount` passe de `6700` à `5900`.
2. **`supabase/functions/create-promo-checkout/index.ts`** : `AMOUNT_EUR` passe de `67` à `59` (et le libellé/lookup key restent cohérents).

Ces deux fonctions couvrent les deux tunnels d'achat existants (page de vente principale + tunnel /promo).

## Changements côté affichage (prix montrés au client)
Remplacer les « 67€ » de vente par le prix promo, avec 67€ barré, dans :
- **`src/pages/SalesPage.tsx`** — hero, bloc pricing (#pricing), FAQ, CTA finaux, JSON-LD (`price`), meta description/OG.
- **`src/pages/UpsellPaiementPage.tsx`** — `LAUNCH_PRICE`, récap, options de paiement, FAQ.
- **`src/pages/UpsellPage.tsx`** — `LAUNCH_PRICE` et libellés.
- **`src/pages/promo/PromoCommandePage.tsx`** — `PRODUCT.amount`.

Tous ces fichiers importeront `PROMO_PRICE`/`REGULAR_PRICE` depuis `summerPromo.ts` au lieu de valeurs en dur (pour la partie « prix de vente » ; on ne touche pas aux mentions historiques dans les articles de blog/emails).

## Compte à rebours
Ajouter un **compte à rebours jusqu'au 31 août** dans le bloc pricing de `src/pages/SalesPage.tsx` (jours/heures/min/sec), avec le message « Offre d'été — se termine le 31 août ». Réutilisation du même style de countdown que celui déjà présent sur la page V3.

## Sécurité anti-oubli après le 31 août
`isPromoActive()` calcule l'état à partir de la date. Après le 31 août, le compte à rebours affiche « Offre terminée » et l'affichage repasse automatiquement à 67€. Pour rétablir réellement le prix débité à 67€, il suffira de remettre `5900→6700` et `59→67` dans les 2 edge functions (indiqué en commentaire). On peut aussi automatiser ce retour si tu veux (optionnel, à décider).

## Hors périmètre (volontairement)
- Les mentions « 67€ » dans les articles de blog, emails Brevo et templates réseaux sociaux **ne sont pas modifiées** (contenu éditorial/historique). On pourra faire une passe séparée si tu veux les aligner.
- La newsletter d'annonce de la promo : à faire dans un second temps une fois la promo en ligne.

## Validation
- Typecheck.
- Vérif visuelle de la page de vente : prix 59€ affiché, 67€ barré, compte à rebours qui tourne.
- Test checkout en mode test (carte 4242…) : le montant présenté doit être **59,00 €**.

Prêt à implémenter dès que tu valides.
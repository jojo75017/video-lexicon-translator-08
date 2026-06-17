# Carte Cadeau Noël — Base V3 à -20% (accès réservé au bénéficiaire)

## Objectif
Offrir le générateur (Base V3, normalement 197€) sous forme de **carte cadeau de Noël** vendue avec **−20%**, soit **158€**. La carte est **mise en évidence** dans le bloc tarifs avec **1 ou 2 visuels de cartes cadeaux** (style Noël, cohérent avec l'image de référence fournie).

La carte débloque **uniquement la Base** (création + publication). Les **packs premium restent payants** → aucune perte sur les ventes de modules.

## Règle d'accès stricte (demande clé)
**Seul le bénéficiaire qui active la carte obtient l'accès — personne d'autre.**
- Code **à usage unique**, lié définitivement à **un seul email** lors de l'activation.
- Accès Base via l'entitlement existant (`useV3Entitlement` → `hasBase`) + portail protégé (`SubscriberGate` / `V3Gate`). Un visiteur non connecté ou un autre email **n'accède à rien**.
- Une fois `redeemed`, le code est **mort**.

```text
Acheteur ──paie 158€──► reçoit 1 CODE unique (NOEL-XXXX-XXXX)
                         │ (offre le code à un proche)
                         ▼
Bénéficiaire ─se connecte/crée son compte─► saisit code ► Base liée à SON email (à vie)
   ▶ Accès verrouillé au seul email activé · Code mort après activation · Packs premium intacts
```

## Visuels (mise en évidence)
- Générer **2 images de cartes cadeaux** photoréalistes (esprit Noël élégant, palette ambre/teal de la marque), sauvegardées dans `src/assets/` :
  1. Carte « cadeau » sombre festive avec ruban.
  2. Carte « Ebookstudio — Carte Cadeau » posée près de livres/cadeaux.
- Affichées dans un **encart dédié et mis en avant** (badge « −20% Noël », prix 197€ barré → 158€) en tête du bloc tarifs `V3PricingTiers.tsx`.

## Étapes

### 1. Données / prix (`src/data/roadmapV3.ts`)
- `V3_GIFT_DISCOUNT = 0.20`
- `V3_GIFT_PRICE = 158` (Base 197€ −20%)

### 2. Table `v3_gift_cards` (migration)
`id`, `code` (unique), `plan` (`'base'`), `amount_paid`, `currency`, `buyer_email`, `recipient_email` (nullable), `status` (`pending_payment` | `active` | `redeemed`), `stripe_session_id`, `redeemed_by_email`, `redeemed_at`, `environment`, `created_at`.
RLS : aucun accès direct anon/authenticated (tout via edge functions service_role). GRANT `ALL` à `service_role` uniquement.

### 3. Edge function `v3-gift-checkout`
- Reçoit `buyerEmail`, `recipientEmail?`, `environment`, `returnUrl`.
- Montant figé serveur à `V3_GIFT_PRICE` (158€).
- Crée la session Stripe embedded (pattern `v3-upsell-checkout`), insère la carte `pending_payment` + code unique.
- `verify_jwt = false` dans `config.toml`.

### 4. Activation paiement
Au paiement confirmé (session `kind='v3_gift'`) → carte `active` + envoi du code par email (Resend) si `recipient_email`.

### 5. Edge function `v3-gift-redeem` (verrou d'accès)
- Reçoit `code`, valide l'utilisateur via `supabase.auth.getUser()` (email tiré du JWT).
- Refuse si carte absente, non `active` ou déjà `redeemed`.
- Crée la commande `v3_installment_orders` `plan='base_gift'`, `status='paid'`, `email` = email authentifié.
- Marque la carte `redeemed` → code mort. Seul cet email obtient `hasBase`.

### 6. UI
- **Encart « Offrir en carte cadeau »** mis en évidence dans `V3PricingTiers.tsx` avec les 2 visuels, prix barré → 158€, badge Noël, bouton ouvrant `V3GiftCheckout.tsx` (calqué sur `V3UpsellCheckout.tsx`).
- **Page `/carte-cadeau`** (`GiftRedeemPage.tsx`) : **protégée, connexion obligatoire**. Champ code → `v3-gift-redeem`. Si non connecté → invite à se connecter/créer un compte (l'accès se lie à ce compte).
- Après achat, le code s'affiche à l'acheteur (+ mention d'envoi email si bénéficiaire renseigné).

## Détails techniques
- Code format `NOEL-XXXX-XXXX`, unicité vérifiée côté fonction.
- Entitlement réutilise `v3_installment_orders` + `useV3Entitlement`.
- Aucun changement aux packs premium ni à leur checkout.

## Hypothèses validées
- Périmètre = **Base seule** (protège les modules).
- Remise = **−20% → 158€**.
- **Accès strictement réservé au bénéficiaire** (code single-use lié à un email authentifié).
- **Mise en évidence avec 1–2 visuels de cartes cadeaux**.

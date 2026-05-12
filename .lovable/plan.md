
# Plan — Paiement CB automatique + PayPal sur /promo

## Objectif
Permettre l'encaissement des 67 € via **carte bancaire (Stripe automatique)** ou **PayPal manuel**, et supprimer l'option virement bancaire.

---

## Étape 1 — Activer Lovable Payments (Stripe intégré)

Pré-requis avant tout code :

1. **Vérifier l'éligibilité** du produit (`recommend_payment_provider`).
2. **Activer Lovable Payments** (`enable_stripe_payments`) — un formulaire Lovable s'ouvrira pour saisir : email de compte, nom, raison sociale. L'environnement **test** est créé immédiatement, le **live** après vérification d'identité (KYC ~24-48 h).
3. Créer le produit **"EbookStudio — Abonnement annuel 67 €"** dans le catalogue Lovable Payments.

> ⚠️ Plan **Pro** requis pour activer les paiements. Lovable Cloud déjà activé ✅.

---

## Étape 2 — Recueillir les infos manquantes

Avant de coder, tu devras me donner :

- **Lien PayPal.me** exact (ex : `https://paypal.me/tonpseudo`)
- **Email de notification PayPal** (pour relier la commande au virement reçu)

---

## Étape 3 — Modifier le tunnel `/promo/commande`

`src/pages/promo/PromoCommandePage.tsx` :

- Remplacer les 2 options actuelles (PayPal / Virement) par **2 nouvelles** :
  - 🟢 **Carte bancaire** (badge "Accès immédiat") → Stripe Checkout auto
  - 🔵 **PayPal** (badge "Validation 1 h") → page instructions
- Retirer toute mention "virement bancaire".
- Le champ `payment_method` accepte désormais : `stripe` | `paypal` (plus de `virement`).

---

## Étape 4 — Nouveau flux Stripe (CB automatique)

1. **Edge function `create-stripe-checkout`** (nouveau) :
   - Reçoit email + first_name + ref_code
   - Crée une `funnel_orders` avec `payment_method = 'stripe'`, `status = 'pending'`
   - Crée une session Stripe Checkout (67 €, mode `payment`) avec `metadata.order_id` + `success_url = /promo/merci?order_id=X` + `cancel_url = /promo/commande`
   - Retourne l'URL Checkout → redirection navigateur
2. **Edge function `stripe-webhook`** (nouveau, public, no JWT) :
   - Écoute `checkout.session.completed`
   - Met à jour `funnel_orders.status = 'paid'`, `paid_at = now()`
   - Le trigger DB existant `handle_funnel_order_paid` se charge déjà de créer la commission affilié 30 % ✅
   - Insère dans `subscribers` (création accès) + envoie email Resend "Bienvenue + accès" via `send-transactional-email`
3. **Page `/promo/merci`** : déjà existante, on enrichit pour afficher confirmation Stripe quand `?order_id=` présent.

---

## Étape 5 — Flux PayPal simplifié

`src/pages/promo/PromoPaiementPage.tsx` :
- Retirer tout le bloc IBAN/BIC/Référence virement.
- Garder uniquement le bloc **PayPal** : bouton vers ton lien `paypal.me/tonpseudo/67`, instruction "indique ton email dans la note".
- Email de confirmation (déjà envoyé par `funnel-create-order`) → adapter le template : retirer le bloc virement, garder PayPal seulement.

`supabase/functions/funnel-create-order/index.ts` :
- Validation : `payment_method` ∈ `['paypal']` (le cas `stripe` passe par l'autre edge function).
- Email Resend : retirer le bloc virement.

---

## Étape 6 — Tunnel d'accès post-paiement

| Méthode | Activation | Délai |
|---|---|---|
| **CB** (Stripe) | Webhook → `subscribers` auto | < 1 min |
| **PayPal** | Manuelle (admin valide depuis `/admin`) | < 1 h ouvré |

Pour PayPal, garder la mécanique actuelle (admin marque `funnel_orders.status = 'paid'` → trigger crée commission + email manuel "Accès activé").

---

## Étape 7 — QA end-to-end (env test)

1. CB test Stripe `4242 4242 4242 4242` → vérifier `funnel_orders.status = 'paid'`, `subscribers` créé, email envoyé, commission affilié si `?ref=…`
2. PayPal → vérifier email instructions, page `/promo/paiement` affiche bien le lien
3. Vérifier que la séquence nurturing s'arrête bien quand `funnel_orders.status = 'paid'` (à ajouter dans `process-promo-nurture`).

---

## Détails techniques (pour info)

- **Secrets utilisés** : Lovable Payments gère sa propre clé Stripe en interne — pas besoin d'ajouter `STRIPE_SECRET_KEY` (l'existant `STRIPE_SECRET_KEY` du compte legacy reste inutilisé pour ce flux).
- **Tables** : aucun changement de schéma nécessaire (`funnel_orders` accepte déjà `payment_method` text libre).
- **Webhook URL** : `https://xvdgazrewsuaqtalqxue.supabase.co/functions/v1/stripe-webhook` (à coller dans le dashboard Lovable Payments après activation).
- **Frais Stripe** : ~1,5 % + 0,25 € par CB EU (≈ 1,25 € sur 67 €).

---

## Hors scope (volontairement)

- Abonnement récurrent automatique → on reste sur paiement unique 67 €/an manuel renouvelé.
- 3D Secure custom → géré nativement par Stripe Checkout.
- Refonte PromoMerciPage existante au-delà du `?order_id=`.

---

## Ordre d'exécution

```text
1. recommend_payment_provider      (vérif éligibilité)
2. enable_stripe_payments          (formulaire utilisateur)
3. Tu me donnes ton lien PayPal.me
4. Création produit 67 € dans catalogue
5. Edge create-stripe-checkout + stripe-webhook
6. Modif PromoCommandePage (CB + PayPal, virement retiré)
7. Modif PromoPaiementPage + funnel-create-order (virement retiré)
8. Test CB 4242 + test PayPal
```

Dis-moi "ok j'implémente" + ton **lien PayPal.me** et je lance.

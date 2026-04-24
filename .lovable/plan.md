## 🎯 Objectif

Créer un **tunnel de vente fluide** avec **paiement par carte bancaire (Stripe)** pour ne plus perdre les acheteurs qui n'utilisent pas PayPal. Tarif : **67€/an** (lancement).

---

## ✅ Bonne nouvelle : tout est déjà là

Votre projet a **déjà** :
- ✅ Stripe configuré (`STRIPE_SECRET_KEY`, `STRIPE_LIFETIME_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`)
- ✅ Edge function `stripe-checkout` qui crée des sessions de paiement avec essai gratuit 7 jours
- ✅ Edge function `stripe-webhook` qui traite les paiements
- ✅ Edge function `stripe-verify-session` pour confirmer l'achat
- ✅ Pages existantes : `/offres`, `/paiement-manuel`, `/paiement-succes`, `/confirmation-paiement`

**On n'a donc QUE 4 choses à faire :** moderniser le tunnel, brancher Stripe sur les bons boutons, ajouter le bouton "Payer par carte" partout, et relier l'extension au tunnel.

---

## 📐 Structure du tunnel (3 étapes)

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  ÉTAPE 1        │      │  ÉTAPE 2        │      │  ÉTAPE 3        │
│  /offres        │ ───► │  Paiement       │ ───► │  /paiement-     │
│                 │      │  (modal Stripe) │      │  succes         │
│  Page de vente  │      │                 │      │                 │
│  + Email + CTA  │      │  💳 Carte       │      │  🎉 Bienvenue   │
│                 │      │  ou             │      │  + Accès outils │
│                 │      │  💰 PayPal      │      │  + Extension    │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

---

## 🛠️ Travaux à effectuer

### 1️⃣ Page `/offres` — Boutons de paiement clairs
- Garder le design actuel
- Remplacer le bouton unique par **2 boutons côte à côte** :
  - 💳 **« Payer par carte (7 jours d'essai gratuit) »** → déclenche Stripe Checkout
  - 💰 **« Payer par PayPal »** → redirige vers `/paiement-manuel`
- Ajouter rassurances sous les boutons : *Sans engagement · Annulable en 1 clic · 7 jours gratuits*
- Champ email obligatoire avant clic (pour Stripe)

### 2️⃣ Composant `StripeCheckoutButton` réutilisable
- Appelle `supabase.functions.invoke('stripe-checkout')` avec `email`, `successUrl`, `cancelUrl`
- Redirige automatiquement vers la page Stripe hébergée (sécurisée, conforme PCI)
- État loading + gestion d'erreurs

### 3️⃣ Page `/paiement-succes` — Page de remerciement premium
- Animation de succès (✓ vert)
- Message : *« Bienvenue dans EbookStudio Pro ! »*
- 3 prochaines étapes claires :
  1. 📧 Vérifie ta boîte mail (code d'accès envoyé)
  2. 🔑 Connecte-toi via le bouton ci-dessous
  3. 📥 Télécharge l'extension Chrome (lien direct)
- Vérifie automatiquement la session Stripe via `stripe-verify-session`
- Crée/active automatiquement le compte abonné

### 4️⃣ Page `/extension-chrome` — Boutons CTA mis à jour
- Bouton principal (orange) : **« Télécharger gratuitement »** (ZIP, comme actuellement)
- Bouton secondaire (noir, sous le principal) : **« Passer Pro — 67€/an »** → redirige vers `/offres`
- Idem dans la section CTA finale en bas de page

---

## 🎨 Détails techniques

| Élément | Valeur |
|---|---|
| Tarif | 67€/an (lancement) |
| Essai gratuit | 7 jours (déjà configuré dans `stripe-checkout`) |
| Mode Stripe | Checkout hébergé Stripe (PCI compliant, pas de carte stockée chez vous) |
| Modes paiement | Carte (Visa, Mastercard, Amex), Apple Pay, Google Pay automatiques |
| Devises | EUR |
| Webhook | Déjà branché — active automatiquement l'abonné après paiement |
| URL succès | `https://www.ebookstudio.fr/paiement-succes?session_id={CHECKOUT_SESSION_ID}` |
| URL annulation | `https://www.ebookstudio.fr/offres` |

---

## 📝 Fichiers modifiés / créés

**Modifiés :**
- `src/pages/SalesPage.tsx` (ou la page `/offres` actuelle) — boutons CTA
- `src/pages/PaymentSuccessPage.tsx` — page de remerciement modernisée
- `src/pages/ExtensionChromePage.tsx` — bouton "Passer Pro" ajouté

**Créés :**
- `src/components/StripeCheckoutButton.tsx` — composant réutilisable carte bancaire

**Aucune fonction backend à créer** — tout existe déjà ✅

---

## 🚀 Résultat attendu

- Augmentation du taux de conversion (+30 à 50% typiquement quand on ajoute la carte)
- Plus aucun abonné perdu à cause du paiement
- Tunnel rapide : un visiteur peut acheter en moins de 90 secondes
- Page de remerciement claire qui guide vers la 1ère utilisation

---

## ⚠️ À vérifier après implémentation

1. Tester un achat en mode test Stripe (carte `4242 4242 4242 4242`)
2. Vérifier que l'email d'accès est bien envoyé (via `send-access-code`)
3. Vérifier la redirection finale vers `/paiement-succes`
4. Publier le site (Publish → Update) pour que les changements soient en ligne sur ebookstudio.fr

Validez ce plan et je passe à l'implémentation. 👇
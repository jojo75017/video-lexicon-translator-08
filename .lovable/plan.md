# Tunnel de vente affilié EbookStudio — Plan révisé

> **Contraintes confirmées :**
> - **Ne PAS toucher** aux pages `/offres`, `/demo` (et autres pages existantes : SalesPage, OfferValuePage, ProductLandingPage, ParrainagePage)
> - Tunnel **dédié aux affiliés** pour vendre EbookStudio et toucher 30% de commission
> - Paiement **manuel** (PayPal / virement) avec validation admin — réutilise `payment_confirmations`
> - Affiliation **étend** le système existant (`referral_codes` + `referrals`)
> - Lead magnet PDF "5 niches rentables 2026" généré 1× via IA puis servi en statique

---

## 1. Vision du tunnel

Un affilié récupère son lien `https://ebookstudio.fr/promo?ref=REF-XXX` depuis son espace, le partage. Chaque visiteur :

1. Atterrit sur **/promo** (capture email + lead magnet)
2. Reçoit le PDF par email + bascule sur **/promo/decouverte** (sales page)
3. Clique sur acheter → **/promo/commande** (checkout manuel)
4. Voit **/promo/bonus** (upsell licence pro / templates)
5. Reçoit accès via **/promo/espace** (espace membre simple)

L'affilié suit ses clics, leads et commissions sur **/promo/affilie**.

Toutes les routes sont préfixées `/promo/*` pour éviter tout conflit avec l'existant.

---

## 2. Routes (toutes neuves, isolées)

```
/promo                  → Landing capture email + lead magnet
/promo/merci            → Confirmation + téléchargement PDF
/promo/decouverte       → Sales page longue (storytelling, FAQ, CTA)
/promo/commande         → Checkout manuel (PayPal / virement)
/promo/bonus            → Upsell après commande
/promo/espace           → Espace membre acheteur (téléchargements, accès)
/promo/affilie          → Programme d'affiliation 30% (génération lien + dashboard)
```

Aucune modification des pages existantes. Aucun lien automatique injecté dans la sidebar/menu actuel — l'accès se fait via le lien affilié `?ref=`.

---

## 3. Base de données (1 migration unique)

### Nouvelles tables

**`funnel_leads`** — visiteurs qui ont laissé leur email
- `email` (unique), `first_name`, `ref_code` (qui a référé), `lead_magnet_sent_at`
- `utm_source`, `utm_medium`, `utm_campaign`, `landing_url`, `ip`, `user_agent`
- RLS : INSERT public (anon), SELECT admin uniquement

**`affiliate_clicks`** — analytics clic affilié
- `ref_code`, `landing_path`, `referrer`, `ip`, `user_agent`, `clicked_at`
- RLS : INSERT public (anon), SELECT admin uniquement

**`funnel_orders`** — commandes du tunnel
- `email`, `first_name`, `product_key` (`main` | `upsell_license` | `upsell_templates`)
- `amount`, `currency`, `payment_method` (`paypal` | `virement`)
- `status` (`pending` | `paid` | `refunded` | `cancelled`)
- `ref_code`, `paid_at`, `admin_notes`
- RLS : INSERT public (anon), SELECT admin OU `email = auth.email()`, UPDATE admin

### Modifications

**`referrals`** : ajouter
- `commission_rate numeric NOT NULL DEFAULT 0.30`
- `funnel_order_id uuid` (FK logique vers `funnel_orders.id`)

**`referral_codes`** : aucune modif (déjà OK)

### Trigger automatique

Quand un `funnel_orders.status` passe à `'paid'` ET que `ref_code` est non-null :
- crée une ligne `referrals` avec `commission_amount = amount × 0.30`, `status = 'converted'`, `converted_at = now()`, `funnel_order_id = NEW.id`
- résout `referrer_id` via `referral_codes.user_id WHERE code = NEW.ref_code`

---

## 4. Lead magnet PDF "5 niches rentables d'ebooks en 2026"

- **Génération** : script one-shot exécuté côté admin (bouton "Régénérer le lead magnet" dans une page admin existante OU script `node scripts/generate-lead-magnet.ts`)
- Le script appelle Gemini (clé serveur `GEMINI_API_KEY`) → JSON structuré (5 niches × {nom, audience cible, mots-clés Amazon, prix moyen, top 3 best-sellers, plan d'ebook type})
- Rendu PDF avec `pdf-lib` (déjà dispo via le projet) : 12 pages A4, charte KDP (teal #008296, orange #FF9E2D, fond #FAFAFA, texte #232F3E)
- Stocké dans `public/lead-magnets/5-niches-rentables-ebooks-2026.pdf` (servi en statique, pas de logique d'auth — déjà gated par la capture email)
- Cover du PDF utilisée comme visuel sur `/promo`

---

## 5. Détail des pages

### `/promo` — Capture
- **Hero** plein écran : titre fort *"Découvrez les 5 niches d'ebooks qui cartonnent sur Amazon en 2026"*
- Sous-titre + mockup 3D du PDF
- **Formulaire** : prénom + email (validation Zod, anti-bot honeypot)
- 3 bénéfices (icônes Lucide)
- Mini bandeau social proof (chiffres réels, pas de faux avis)
- Footer minimal
- **Tracking** : capture `?ref=` → cookie 30j + insert `affiliate_clicks` via edge `track-affiliate-click`
- Sur submit → POST edge `funnel-capture-lead` → redirect `/promo/merci`

### `/promo/merci`
- Animation succès + bouton téléchargement PDF (lien direct)
- "Le PDF arrive aussi par email" (envoi via Resend)
- CTA secondaire : *"Découvrir l'outil qui crée vos ebooks en 7 jours →"* vers `/promo/decouverte`

### `/promo/decouverte` — Sales page longue
Sticky CTA flottant. Sections :
1. Hero émotionnel (problème de l'auteur indé)
2. Storytelling fondateur (Georges Boubet)
3. La promesse + démo vidéo (placeholder iframe)
4. 6 bénéfices détaillés
5. "Tout ce que vous obtenez" : grille features (générateurs ebook/audio/KDP, etc.)
6. Témoignages (composant similaire à `TestimonialsSection`, mais isolé sous `funnel/`)
7. Comparaison avant/après
8. **Pricing** : 1 offre principale 67€/an
9. FAQ (8-10 questions, accordéon)
10. Garantie + CTA final
11. Footer riche
- Bouton acheter → `/promo/commande` (avec `ref_code` du cookie en query)

### `/promo/commande` — Checkout manuel
- Récap commande (produit + prix)
- Form : email pré-rempli si lead, prénom, méthode (PayPal / virement)
- Sur soumission :
  - insert `funnel_orders` (status `pending`)
  - insert `payment_confirmations` (réutilise la table existante pour la validation admin)
  - envoi email "instructions de paiement" via Resend
- Redirige `/promo/bonus`
- Si `?ref=` présent ou cookie → attaché à l'order

### `/promo/bonus` — Upsell
- *"Avant de finaliser, 2 cadeaux à -50%"*
- 2 cartes :
  - **Licence commerciale** (+47€) — vendre les ebooks créés
  - **Pack 50 templates premium** (+27€)
- Boutons "Ajouter" → ajoute un `funnel_orders` lié (product_key correspondant)
- Lien discret "Non merci, accéder à mon espace" → `/promo/espace`

### `/promo/espace` — Espace membre simple
- Affiché si user loggé (sinon CTA login `/auth`)
- Liste des `funnel_orders` payés (filtrés sur `email = auth.email()`)
- Liens téléchargement (lead magnet, templates, accès app)
- Carte "Devenez affilié" → `/promo/affilie`
- Carte "Accéder à l'app complète" → `/dashboard`

### `/promo/affilie` — Programme affiliation
- Hero "Gagnez 30% à vie sur chaque vente"
- **Calculateur** interactif (slider nb ventes/mois × 67€ × 30%)
- "Comment ça marche" en 3 étapes
- Si non-loggé → CTA "Créer un compte affilié" → `/auth?redirect=/promo/affilie`
- Si loggé :
  - Récupère ou crée `referral_codes.code` pour l'utilisateur (fonction RPC `generate_referral_code` existe)
  - Affiche le lien `https://ebookstudio.fr/promo?ref=XXX`
  - Bouton copier + boutons partage (Twitter, LinkedIn, WhatsApp, email pré-remplis)
  - **Dashboard commissions** : utilise `get_referral_stats(user_id)` existante
    - Total clics (depuis `affiliate_clicks WHERE ref_code = mon_code`)
    - Total leads générés (depuis `funnel_leads`)
    - Total commandes & commissions (depuis `referrals`)
    - Tableau détaillé des dernières conversions

---

## 6. Tracking affilié — flow complet

```
Visiteur clique lien affilié
   ↓
/promo?ref=REF-ABC123
   ↓ (useReferralTracking hook)
   - cookie `ref_code` posé (30j)
   - edge `track-affiliate-click` insert affiliate_clicks
   ↓
Capture email
   ↓ funnel_leads.ref_code = cookie
Email envoyé + nurturing 5 emails (Resend, séquence existante)
   ↓
Sales page → Checkout
   ↓ funnel_orders.ref_code = cookie
Admin valide le paiement (status → 'paid')
   ↓ trigger BDD
referrals créé (commission = 30% × montant)
   ↓
Affilié voit la conversion sur /promo/affilie
```

---

## 7. Edge functions (3 nouvelles)

- **`funnel-capture-lead`** : valide payload (Zod : email, prénom, ref_code, utm), upsert `funnel_leads`, déclenche email Resend (PDF + bienvenue), enrôle dans la séquence nurturing
- **`track-affiliate-click`** : insert `affiliate_clicks` (fire-and-forget côté client)
- **`funnel-create-order`** : valide payload, insert `funnel_orders` + `payment_confirmations`, envoie email instructions paiement, notifie admin

Réutilise `send-sales-email` existante pour les emails transactionnels.

---

## 8. Email marketing

- **Resend** déjà configuré (`RESEND_API_KEY`)
- Email immédiat à la capture : sujet "📘 Vos 5 niches rentables 2026" + lien PDF
- Séquence nurturing 5 emails (table `email_sequences` existante, cron actif) — branchée sur `sequence_name = 'promo_funnel'`
- Email transactionnel checkout : instructions PayPal/virement
- Email confirmation paiement (admin valide → trigger envoi via edge existante)
- Lien désinscription standard sur tous

---

## 9. SEO basique

- Composant `<SeoHead>` (helmet) sur chaque page : title <60c, description <160c, canonical, OG, Twitter Card
- JSON-LD `Product` + `Offer` sur `/promo/decouverte`
- H1 unique par page, alt textes
- Sitemap : ajouter `/promo`, `/promo/decouverte`, `/promo/affilie` dans `public/sitemap.xml`
- `robots.txt` : autoriser

---

## 10. Design system

- Strict tokens KDP (teal `#008296`, orange `#FF9E2D`, fond `#FAFAFA`, texte `#232F3E`)
- Photorealisme strict pour toute image AI (mémoire core)
- Composants shadcn déjà en place (Button, Card, Accordion, Dialog…)
- Animations sobres (`animate-in` Tailwind, fade/slide)
- Mobile-first, sticky CTA mobile sur `/promo/decouverte`
- Accessibilité : focus visible, aria, contraste AA

---

## 11. Architecture des fichiers (tout sous `funnel/`)

```
src/components/funnel/
  FunnelLayout.tsx           (header minimal + footer minimal)
  SeoHead.tsx
  CaptureHero.tsx
  CaptureForm.tsx
  LeadMagnetPreview.tsx
  SalesHero.tsx
  SalesStorytelling.tsx
  SalesBenefits.tsx
  SalesFeatures.tsx
  SalesPricing.tsx
  SalesFaq.tsx
  StickyCta.tsx
  CheckoutSummary.tsx
  CheckoutForm.tsx
  UpsellCard.tsx
  AffiliateHero.tsx
  AffiliateCalculator.tsx
  AffiliateLinkBox.tsx
  AffiliateDashboard.tsx
  MemberOrders.tsx

src/hooks/
  useReferralTracking.ts
  useFunnelLead.ts
  useFunnelOrder.ts
  useAffiliateStats.ts

src/pages/promo/
  PromoCapturePage.tsx
  PromoMerciPage.tsx
  PromoDecouvertePage.tsx
  PromoCommandePage.tsx
  PromoBonusPage.tsx
  PromoEspacePage.tsx
  PromoAffiliePage.tsx

supabase/functions/
  funnel-capture-lead/index.ts
  track-affiliate-click/index.ts
  funnel-create-order/index.ts

public/lead-magnets/
  5-niches-rentables-ebooks-2026.pdf

scripts/
  generate-lead-magnet.ts   (one-shot, exécuté manuellement)
```

---

## 12. Ordre d'implémentation

1. **Migration BDD** (3 tables + colonnes referrals + trigger) — j'attends l'approbation
2. **Lead magnet PDF** : génération via script + dépôt dans `public/lead-magnets/`
3. **Edge functions** (3) + tests curl
4. **Layout + SEO + tracking affilié** (socle réutilisé)
5. **Page `/promo` (capture)** + `/promo/merci`
6. **Page `/promo/decouverte`** (sales)
7. **Page `/promo/commande`** + `/promo/bonus` (checkout + upsell)
8. **Page `/promo/affilie`** + `/promo/espace`
9. **Routes dans `App.tsx`** + sitemap update
10. **Smoke test bout-en-bout** : visite avec `?ref=TEST123` → capture → sales → commande → bonus → membre, vérification que `referrals` est créé après passage en `paid`

---

## Garanties

- ✅ Aucune modification de `/offres`, `/demo`, `/sales`, `/parrainage`, `/paiement-manuel`
- ✅ Tunnel 100% isolé sous `/promo/*` et `src/components/funnel/`
- ✅ Pas de fake data ni `Math.random` (mémoire core)
- ✅ Affiliation étend l'existant (`referral_codes` + `referrals`) avec taux 30%
- ✅ Paiement manuel (PayPal/virement) via tables existantes

## Hors scope (à demander si besoin)

- Stripe automatique
- A/B testing
- Pixels Meta/Google Ads (peut s'ajouter en 30 min)
- Refonte des pages existantes
- Multi-niveaux d'affiliation (uniquement direct ici)

## Objectif
Valider de bout en bout le tunnel d'acquisition `/promo` avant le 1er juillet, en exécutant 3 tests réels et en corrigeant les blocages éventuels. Aucun nouveau feature : uniquement validation + corrections ciblées.

---

## Test 1 — Tunnel complet (capture → paiement → confirmation)

**Scénario :**
1. Ouvrir `/promo` en navigation privée
2. Soumettre prénom + email de test
3. Vérifier réception email avec PDF (lead magnet)
4. Cliquer le lien vers `/promo/merci`
5. Suivre `/promo/decouverte` → `/promo/bonus` → `/promo/commande` → `/promo/paiement`
6. Effectuer un paiement test Stripe (mode sandbox, carte 4242…)
7. Vérifier la création dans `funnel_orders` (status = `paid`)
8. Vérifier la redirection sur la page de confirmation
9. Vérifier la réception de l'email de confirmation d'achat

**Points de contrôle :**
- Edge function `funnel-capture-lead` répond 200
- Ligne créée dans `funnel_leads` avec `lead_magnet_sent_at` rempli
- Bouton fallback PDF sur `/promo/merci` fonctionne
- Webhook Stripe sandbox met à jour `funnel_orders.status` à `paid` et stamp `paid_at`
- Email post-achat envoyé via Resend

---

## Test 2 — Attribution affilié `?ref=CODE`

**Scénario :**
1. Se connecter avec un compte test, aller dans `/promo/espace` → onglet Affiliation
2. Générer un code affilié (ex : `REF-ABC123`)
3. En navigation privée, ouvrir `/promo/decouverte?ref=REF-ABC123`
4. Vérifier qu'une ligne apparaît dans `affiliate_clicks` (edge `track-affiliate-click`)
5. Faire un achat test complet avec un autre email
6. Vérifier que `funnel_orders.ref_code = 'REF-ABC123'`
7. Vérifier que le trigger `handle_funnel_order_paid` crée automatiquement une ligne dans `referrals` avec :
   - `referrer_id` = compte affilié
   - `commission_amount` = 20.10€ (30% de 67€)
   - `status` = `converted`
8. Recharger `/promo/espace` du compte affilié → vérifier que la commission s'affiche dans les stats

**Points de contrôle :**
- Cookie + localStorage `ebs_ref` persistent à travers les pages du tunnel
- Le `ref_code` est bien transmis au moment de l'insertion dans `funnel_orders`
- La fonction `get_referral_stats` renvoie les bons totaux

---

## Test 3 — Cas limites & robustesse

**Scénarios à valider :**
1. **Email déjà capturé** : resoumettre `/promo` avec le même email → ne doit pas planter, doit renvoyer le PDF
2. **Code ref invalide** : `/promo/decouverte?ref=INEXISTANT` → click loggé mais pas de commission créée à l'achat
3. **Achat sans `ref_code`** : aucune ligne `referrals` créée (trigger ignore)
4. **Refus paiement Stripe** : `funnel_orders` reste en `pending`, aucune commission

---

## Livrable
- Tableau de résultats (PASS/FAIL) pour chacun des 3 tests
- Liste des bugs trouvés avec niveau de priorité (bloquant 1er juillet vs cosmétique)
- Corrections appliquées immédiatement pour les bloquants
- Note des items cosmétiques renvoyés au sprint "espace affilié v2" (juin)

## Détails techniques (pour info)
- Tables touchées : `funnel_leads`, `funnel_orders`, `affiliate_clicks`, `referral_codes`, `referrals`
- Edge functions impliquées : `funnel-capture-lead`, `track-affiliate-click`, `track-referral`, `stripe-webhooks`
- Trigger SQL clé : `handle_funnel_order_paid` (déjà en place)
- Mode Stripe : sandbox (pas d'impact sur la prod)

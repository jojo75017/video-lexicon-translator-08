Plan de lancement V3 — 1er octobre 2026

Objectif : verrouiller totalement l'accès V3 pour les abonnés V2 (aperçu uniquement : /v3 home + /v3/pourquoi + nouvelle page de présentation), préparer les paiements mensuels/annuels en coulisses, et sortir une page de vente V3 dédiée.

---

## Phase 0 — Verrouillage V3 pour les abonnés V2 (priorité absolue)

1. Créer `src/components/v3/V3LockedGate.tsx`
   - Composant wrapper qui bloque tout accès V3 sauf 3 routes autorisées : `/v3` (home), `/v3/pourquoi`, `/v3/offre` (nouvelle page de présentation).
   - Si l'utilisateur tente d'accéder à une autre route V3, redirection vers `/v3/offre` avec un toast : « La V3 est disponible le 1er octobre 2026 — découvrez ce qui vous attend ».
   - Flag global `V3_LAUNCH_UNLOCKED = false` dans `src/config/v3Launch.ts` pour pouvoir tout débloquer en une variable le jour J.
   - Admin bypass : les admins (`getIsCurrentSessionAdmin`) continuent d'accéder à tout pour préparer.

2. Bannière "Bientôt disponible" sur `/v3` et `/v3/pourquoi`
   - Bandeau doré fixe en haut : « V3 disponible le 1er octobre 2026 — vous êtes déjà abonné V2, aucune action requise ».
   - CTA : « Voir l'offre V3 » → `/v3/offre`.
   - Retirer le bandeau "clé Gemini obligatoire" tant que la V3 n'est pas ouverte.

3. Neutraliser les boutons de paiement `/v3/forfaits`
   - Cacher la page ou la rediriger vers `/v3/offre` tant que `V3_LAUNCH_UNLOCKED = false`.
   - Les boutons Stripe/PayPal restent en place dans le code mais désactivés.

4. Retirer les liens V3 dans la sidebar V2 pour les abonnés
   - Dans `V3MainTabs.tsx` et `V3Sidebar.tsx`, quand `V3_LAUNCH_UNLOCKED = false` : ne garder que 3 entrées visibles : Accueil V3, Pourquoi EbookStudio, Découvrir l'offre V3.
   - Tous les autres onglets (Créer, Écrire, Habiller, Publier, Vendre, Livres spéciaux, Outils, Nouveautés…) sont masqués ou grisés avec badge « 1er octobre ».

---

## Phase 1 — Page de présentation de l'offre V3 (nouvelle page)

5. Créer `src/pages/v3public/V3OffrePage.tsx` sur la route `/v3/offre`
   - Structure inspirée d'une squeeze page + comparateur, alignée avec l'identité Émeraude & Or.
   - Sections :
     1. **Hero** : « La V3 arrive le 1er octobre — la maison d'édition IA repensée » + compte à rebours J-1er octobre + CTA « Je veux être prévenu ».
     2. **Avant / Après V2 → V3** : tableau montrant les nouveautés (30 agents, Cover Studio Pro, KDP Pilot Pro, livres illustrés maternelle, univers multi-volumes, traduction 10 langues, humaniseur IA, mockups 3D, audiobook TTS, forum communauté).
     3. **Les 3 forfaits** : cartes Auteur 9,99 €, Studio 12,99 € ⭐, Éditeur 59 € (mensuel + annuel avec économie affichée). Boutons désactivés « Disponible le 1er octobre ».
     4. **Freemium** : bloc « Testez gratuitement dès l'ouverture — 1 livre offert, 3 chapitres, sans carte ».
     5. **Ce que les abonnés V2 conservent** : rassurer sur la continuité, transition automatique, aucune interruption.
     6. **Bonus fondateur** : réduction ou crédits offerts aux 100 premiers abonnés du 1er octobre.
     7. **FAQ** : « Est-ce que mon abonnement V2 continue ? », « Puis-je basculer vers V3 le jour J ? », « À vie ou mensuel ? », « Freemium = combien de temps ? ».
     8. **Formulaire de pré-inscription** : email → insert dans `funnel_leads` avec `lead_magnet = 'v3_launch_notify'`.

6. SEO
   - Title : « V3 EbookStudio — la maison d'édition IA — Ouverture 1er octobre »
   - Meta description : « Découvrez la V3 EbookStudio : 30 agents IA, forfaits dès 9,99 €/mois, freemium, livres illustrés, KDP Pilot Pro. Ouverture 1er octobre 2026. »

7. Lien vers `/v3/offre` depuis :
   - Le bandeau home V3.
   - `/v3/pourquoi` en bas.
   - Le header V3 (bouton doré « Découvrir l'offre »).

---

## Phase 2 — Préparation invisible de la monétisation (en coulisses, désactivée)

8. Vérifier les prix Stripe existants
   - Confirmer que les 6 lookup_keys sont créés en sandbox : `v3_auteur_monthly` (9,99 €), `v3_auteur_annual` (97 €), `v3_expert_monthly` (12,99 €), `v3_expert_annual` (117 €), `v3_auteur_monthly_pro` (59 €), `v3_auteur_annual_pro` (547 €).
   - Créer ceux qui manquent via l'outil de création de prix.
   - Ne rien publier tant que `V3_LAUNCH_UNLOCKED = false`.

9. Écrire (mais ne pas déployer publiquement) le webhook V3 mensuel/annuel
   - Nouveau `supabase/functions/v3-subscription-webhook/index.ts` qui gère `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted` pour les subscriptions V3.
   - Met à jour `subscribers` avec `plan_type`, `plan_tier`, `expires_at`, `stripe_subscription_id`.
   - Testé en sandbox sur un compte admin uniquement.

10. Aligner `check-quota` sur les plans V3
    - Ajouter les nouvelles limites : Auteur 10 livres/mois, Studio 20 livres/mois, Éditeur illimité.
    - Ne pas activer côté client tant que la V3 est verrouillée.

11. Préparer le freemium
    - Config `src/config/v3Freemium.ts` : 1 livre, 3 chapitres, 1 personnage, pas d'export premium.
    - Composant `<V3FreemiumBlock />` réutilisable avec CTA « Passez à Studio ».
    - Restera inactif jusqu'au 1er octobre.

---

## Phase 3 — Communication en amont

12. Email de pré-lancement aux 653 prospects
    - Sujet : « La V3 arrive le 1er octobre — voici ce que vous obtenez »
    - Corps : lien vers `/v3/offre`, résumé des nouveautés, promesse fondateur.
    - Envoi manuel via `send-sales-email` avec un nouveau template `v3_prelaunch_teaser`.

13. Email dédié aux abonnés V2 actifs
    - Sujet : « Votre abonnement continue — voici comment la V3 vous concerne »
    - Rassurer sur la continuité + inviter à voir `/v3/offre`.

14. Bandeau site global (V2)
    - Sur le dashboard V2 : « La V3 arrive le 1er octobre — [Découvrir l'offre] ».

---

## Phase 4 — Jour J (1er octobre 2026) — checklist à exécuter

15. Basculer `V3_LAUNCH_UNLOCKED = true` dans `src/config/v3Launch.ts`.
16. Activer les vrais boutons de paiement sur `/v3/forfaits`.
17. Enregistrer le webhook V3 dans Stripe live avec `PAYMENTS_LIVE_WEBHOOK_SECRET`.
18. Publier le site.
19. Envoyer l'email de lancement aux prospects et aux V2.
20. Surveiller les logs edge functions + les premiers checkout.

---

## Livrables de ce plan (avant le 1er octobre)

- Composant `V3LockedGate` + flag global `V3_LAUNCH_UNLOCKED`.
- Sidebar/menu V3 réduits aux 3 pages autorisées.
- Nouvelle page `/v3/offre` complète avec compte à rebours, comparateur, forfaits en preview, formulaire pré-inscription.
- Webhook V3 et quotas prêts mais désactivés.
- 2 campagnes email prêtes à envoyer.

## Ce qui reste bloqué (comme demandé)
- `/v3/create`, `/v3/outils`, `/v3/hub`, `/v3/nouveautes`, `/v3/livres/*`, `/v3/forfaits` → redirection vers `/v3/offre`.
- Aucun paiement ne peut être finalisé avant le 1er octobre.
- Les abonnés V2 gardent 100 % de leurs accès V2 actuels sans changement.

Indicateurs à préparer pour le suivi post-lancement
- Nombre de pré-inscriptions collectées sur `/v3/offre`.
- Taux de clic email prospects/V2.
- Conversions Stripe/PayPal J+7, J+30 après ouverture.
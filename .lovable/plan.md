# Finalisation du tunnel /promo

Quatre chantiers à enchaîner pour rendre le tunnel 100% opérationnel.

## 1. PDF lead magnet "5 niches rentables 2026"

- **Génération one-shot** via script `scripts/generate-lead-magnet.ts` utilisant Lovable AI (Gemini) pour produire le contenu structuré (5 niches × {sous-niche, audience, mots-clés Amazon, plan d'ebook, fourchette de prix, exemples best-sellers}).
- **Mise en page PDF** avec ReportLab (Python) ou pdf-lib (Node) — charte KDP : fond #FAFAFA, accents #008296 / #FF9E2D, texte #232F3E, logo EbookStudio en couverture.
- **Sortie** : `public/lead-magnets/5-niches-rentables-2026.pdf` (servi en statique, pas besoin de bucket Storage).
- **QA visuelle** obligatoire : conversion en images, vérification des pages, retouches.

## 2. Tracking des clics affiliés

- Modifier `src/hooks/useReferralTracking.ts` : après écriture cookie/localStorage, appeler `supabase.functions.invoke('track-affiliate-click', { body: { ref_code, landing_path, referrer } })`.
- Ne logguer qu'une fois par session (sessionStorage `ebs_ref_logged`) pour éviter le spam d'inserts à chaque navigation interne.
- Vérifier que le compteur "Clics" du dashboard `/promo/affilie` remonte.

## 3. Instructions de paiement post-checkout

- Nouvelle page `/promo/paiement` (PromoPaiementPage) affichée après `/promo/commande`.
- Affiche selon `payment_method` choisi :
  - **PayPal** : bouton vers `https://paypal.me/ebookstudio/67` (ou lien existant) + rappel email.
  - **Virement** : IBAN/BIC + référence = `EBS-{order.id.slice(0,8)}` à mettre en libellé.
- Récupère la dernière `funnel_orders` de l'email courant pour afficher montant + ref.
- Modifier `funnel-create-order` edge function : envoyer un email Resend "Confirmation de commande" via `LOVABLE_API_KEY` + gateway, contenant le récap + instructions paiement + bouton "Accéder à mon espace".
- Rediriger `/promo/commande` → `/promo/paiement` (au lieu de `/promo/bonus`), et garder le CTA bonus depuis la page paiement.

## 4. Séquence email nurturing pour leads /promo

- Dans `funnel-capture-lead`, après insert lead : créer une ligne dans `email_sequences` avec `sequence_name = 'promo_nurture'`, `email`, `current_step = 0`, `next_email_at = now() + 1 day`, `sequence_started = true` sur `funnel_leads`.
- Nouvelle edge function `process-promo-nurture` (cron toutes les heures via pg_cron) qui :
  - lit `email_sequences` où `sequence_name = 'promo_nurture'`, `completed = false`, `unsubscribed = false`, `next_email_at <= now()`.
  - envoie l'email du `current_step` via Resend (gateway Lovable).
  - incrémente `current_step`, met à jour `last_email_sent_at` et `next_email_at` selon planning, marque `completed = true` à la fin.
- Planning sur 5 emails (cohérent avec [Email Nurture Flow](mem://features/marketing/sales-nurture-sequence)) :
  - J+0 (capture) : confirmation + lien PDF (déjà envoyé via funnel-capture-lead)
  - J+1 : "As-tu lu le guide ? Voici la niche n°1 en détail" → CTA `/promo/decouverte`
  - J+3 : Cas client (témoignage Marie L.) → CTA `/promo/decouverte`
  - J+5 : Levée d'objection (temps/compétences) + démo produit → CTA `/promo/commande`
  - J+7 : Offre dernière chance (rappel garantie 7j) → CTA `/promo/commande`
- Lien désinscription : edge function `unsubscribe?email=...&seq=promo_nurture` qui met `unsubscribed = true`.

## Ordre d'exécution

1. PDF lead magnet (autonome, livrable visible immédiatement)
2. Tracking clics (1 fichier modifié, validation rapide)
3. Page paiement + email confirmation (nouvelle page + edit edge function)
4. Séquence nurturing (nouvelle edge function + cron + 4 templates HTML)

## Hors scope

- Stripe/CB automatique (paiement reste manuel PayPal/virement validé admin)
- A/B testing copywriting
- Connexion ESP externe (Mailchimp/Brevo) — Resend natif suffit
- Refonte des pages `/offres` et `/demo`

## Détails techniques

- Edge functions : `verify_jwt = false` pour `track-affiliate-click`, `process-promo-nurture`, `unsubscribe` (déjà OK pour les autres).
- Cron : enregistré via `supabase--insert` (et non migration) car contient l'URL projet et l'anon key.
- Resend : envoi via `https://connector-gateway.lovable.dev/resend` avec `LOVABLE_API_KEY` + `RESEND_API_KEY` (déjà secrets).
- Templates email : HTML inline-CSS, marque KDP, bouton CTA orange #FF9E2D.

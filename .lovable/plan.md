## Objectif

Augmenter le nombre de visiteurs qui laissent leur email (abonnés) et le nombre de clics vers l'inscription, sur toutes les pages publiques (SEO, blog, expatriés, accueil), avec un suivi clair du taux de conversion.

On s'appuie sur l'existant : `LeadCapturePopup`, `FloatingToolCTA`, l'edge function `funnel-capture-lead`, les séquences `email-sequence-cron`, et la table `funnel_leads`. Aucune nouvelle dépendance lourde.

---

## 1. Pop-up plus malin (`LeadCapturePopup.tsx`)

- **Déclenchement plus efficace** : en plus de l'exit-intent et du timer 30s, ajouter un déclenchement au **scroll à 50 %** de la page (souvent plus rapide sur mobile où l'exit-intent ne marche pas).
- **Délai réduit** : passer le timer de 30s à ~18s pour capter plus tôt.
- **Offre adaptée à la page** : détecter le contexte (page expatrié vs reste) — déjà partiellement fait — et afficher le bon lead magnet + visuel.
- **Champ prénom optionnel** pour personnaliser les emails (déjà géré côté edge function via `first_name`).
- **Anti-frustration** : une seule fois par session, mémorisé (déjà en place), on garde.

## 2. Bandeau / CTA permanent (`StickySignupBar.tsx` — nouveau)

- Barre fine, sticky en bas (mobile) / haut (desktop), toujours visible sur les pages publiques : « Recevez le guide gratuit » + bouton qui ouvre le même formulaire de capture (réutilise l'appel `funnel-capture-lead`).
- Masquée sur l'app interne via la même liste `EXCLUDED_PREFIXES`.
- Refermable (mémorisé en sessionStorage), réapparaît à la session suivante.
- Montée dans `App.tsx` à côté de `LeadCapturePopup`, uniquement si `!isAuthenticated`.

## 3. Bloc de capture réutilisable sur les pages clés (`InlineLeadCapture.tsx` — nouveau)

- Composant compact et réutilisable (titre, bénéfices, champ email, bouton) branché sur `funnel-capture-lead`, avec prop `leadMagnet` pour choisir l'offre.
- Insertion sur les pages à fort trafic :
  - Pages SEO (`SeoCreerEbookIaPage`, `SeoGenerateurEbookPage`, `SeoFrancophonesEtrangerPage`, `SeoGuideKdpEnfantsPage`)
  - Blog (`BlogArticleTemplate` — bloc en milieu/fin d'article)
  - Pages expatriés (offre `publier-kdp-etranger`)
- Suit le thème KDP (fond #FAFAFA, accent teal #008296, hover orange #FF9E2D), pas de couleurs codées en dur hors tokens.

## 4. Relance email automatique

- **Réutiliser les séquences existantes** (`promo_funnel`, `expat_funnel`, `expat_reactivation`) du cron `email-sequence-cron`.
- Vérifier que chaque nouveau point de capture inscrit bien le lead dans la bonne séquence (paramètre `lead_magnet` → séquence) côté `funnel-capture-lead`.
- Ajouter une **relance « curieux non-inscrits »** : pour les leads inscrits mais qui n'ont jamais cliqué le guide (`lead_magnet_sent_at` mais 0 clic), une étape de relance douce dans la séquence promo. Ajustement léger des STEPS, pas de nouvelle infra.

## 5. Mini tableau de bord de conversion (CRM)

- Dans `CrmPage.tsx`, ajouter une carte **« Conversion visiteurs → abonnés »** en haut :
  - **Visiteurs** (30 derniers jours) via `analytics--read_project_analytics`.
  - **Inscrits** = nombre de `funnel_leads` sur la période.
  - **Taux de conversion** = inscrits / visiteurs.
  - **Clics guide** = inscrits avec ouverture/clic (via `email_opens` / `email_clicks` ou `lead_magnet_sent_at`).
  - Répartition par source (utm_source) et par lead magnet (général vs expatrié).
- Affichage immédiat au chargement avec état vide clair (déjà mis en place pour les inscrits).

---

## Détails techniques

- **Capture** : tous les points (pop-up, bandeau, bloc inline) appellent la même edge function `funnel-capture-lead` avec `utm`, `ref_code`, et `lead_magnet` adapté. Validation email côté client + déjà côté serveur.
- **Tracking** : utiliser `trackFormSubmit`, `trackLeadMagnetDownload`, `trackCTAClick` (déjà présents) pour mesurer les clics.
- **Exclusions** : factoriser la liste `EXCLUDED_PREFIXES` (partagée pop-up / bandeau / CTA flottant) pour ne jamais polluer l'app interne.
- **Aucune migration DB requise** (réutilisation de `funnel_leads`, `email_sequences`, `email_opens`, `email_clicks`).
- **Dashboard** : lecture seule (analytics + requêtes existantes), réservé à la page CRM déjà protégée.

## Hors périmètre

- Pas de refonte des pages, pas de nouveau provider email, pas de A/B testing avancé (peut venir plus tard).

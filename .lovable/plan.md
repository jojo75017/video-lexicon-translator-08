## Objectif
Préparer le tunnel pour le lancement affilié du **1er juillet** : corriger le bug PDF, ajuster l'upsell templates à 25€ et y inclure le guide 10 niches en cadeau.

## 1. Fix bug PDF cadeau (urgent — déjà signalé)
Dans `supabase/functions/funnel-capture-lead/index.ts`, la constante `LEAD_MAGNET_URL` pointe vers `5-niches-rentables-ebooks-2026.pdf` mais le fichier réel est `5-niches-rentables-2026.pdf` → 404 sur `/promo/merci` et dans l'email Resend.

**Correctif** : remplacer par `https://ebookstudio.fr/lead-magnets/5-niches-rentables-2026.pdf`.

## 2. Upsell "Pack 50 templates premium" → 25€ + bonus niches
Dans `src/pages/promo/PromoBonusPage.tsx`, modifier l'objet `templates_premium` :

- **Prix** : `27` → `25`
- **Description** : ajouter mention du bonus
- **Bénéfices** : ajouter en tête une ligne `🎁 BONUS offert : Guide PDF "10 niches KDP rentables 2026"`
- **Visuel** : ajouter un petit badge orange "+ Cadeau 10 niches inclus" sur la carte

Note : il n'y a qu'**un seul** upsell templates dans le code, pas deux. L'autre upsell est la "Licence commerciale étendue" à 47€ — on ne la touche pas.

## 3. Livraison du pack templates (Drive)
Le lien Drive partagé (`15Dtc44dPNoy8VImg2CtMBzCvSM7seJa7`) est sur ton compte personnel et n'est pas accessible via le connecteur (qui n'est pas connecté). 

**Question** : comment veux-tu livrer le pack templates après achat ?
- **Option A** (le plus simple) : tu me partages le fichier (download depuis Drive et upload ici), je le mets dans `public/downloads/pack-50-templates.pdf` et l'email de confirmation contient le lien direct
- **Option B** : je laisse le lien Drive public (`https://drive.google.com/file/d/15Dtc44dPNoy8VImg2CtMBzCvSM7seJa7/view`) dans l'email de livraison, en passant le partage en "Toute personne avec le lien"

→ je pars sur **Option A** par défaut (plus pro, pas de risque de fuite/suppression). Si tu préfères B, dis-le moi avant impl.

## 4. Email de livraison du pack
Étendre l'edge function `funnel-confirm-payment` (ou créer `funnel-deliver-upsell` si elle n'existe pas) pour, quand `product_key = 'templates_premium'` est marqué payé, envoyer via Resend un email contenant :
- Lien de téléchargement du pack templates
- Lien de téléchargement du guide 10 niches (cadeau)

## 5. Préparation lancement affilié 1er juillet
- Vérifier que `/promo/affilie` est accessible et que le code affilié se génère bien
- Vérifier que `funnel_orders` → trigger `handle_funnel_order_paid` crée bien la commission 30% sur les ventes (déjà en place, juste tester un flux complet en sandbox)
- Tester le flux complet : `/promo?ref=CODE` → email → `/promo/merci` (PDF) → `/promo/decouverte` → `/promo/commande` → `/promo/bonus` (upsell 25€) → `/promo/espace`

## Hors scope
Pas de redesign, pas de nouveau tunnel, pas de modif sur la licence étendue à 47€.
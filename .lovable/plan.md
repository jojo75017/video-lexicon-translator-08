# V3 — Avantages des 2 forfaits + stratégie upsells

Objectif : figer noir sur blanc ce que contient chaque forfait, et décider quels packs restent payants, lesquels sont offerts dans Édition, et où ils sont proposés.

## Partie 1 — Ce que chacun a

Principe : **aucun onglet amputé**. Les deux forfaits ouvrent tout le studio. Édition = la version professionnelle des mêmes outils + les packs inclus + quota illimité.

### Plume — 29 €/mois ou 290 €/an (2 mois offerts)

- 30 livres par mois
- Tous les onglets : Plan, Écrire, Habiller, Publier, Vendre
- Workflow standard (22 agents)
- 40 chapitres · 5 000 mots/chapitre · 8 personnages
- Sommaire Ultime + validation du plan
- Export PDF / DOCX / EPUB avec sommaire propre
- Couverture complète : recto + tranche + 4e (wrap PDF prêt KDP)
- Audiolivre inclus (voix standard)
- Import de manuscrit : DOCX / PDF / URL
- Livre illustré maternelle + Histoires du soir 3-7 ans
- Traductions 10 langues incluses
- Recherche de niches, mots-clés Amazon, catégories, description KDP
- KDP Pilot : audit complet, BSR quotidien, suggestions de mots-clés
- Forum communauté + support email 24 h

### Édition — 49 €/mois ou 490 €/an (2 mois offerts)

Tout Plume, plus :

- **Livres illimités**
- **Mode Recherche Approfondie** (30 agents, sources élargies)
- 60 chapitres · 8 000 mots/chapitre · personnages illimités
- **Cover Studio Pro** : 300 DPI, gabarits KDP, variantes illimitées, direction artistique IA
- **Audiolivre Pro** : voix premium, chapitrage, export long, prêt ACX
- **BD Studio Pro**
- **KDP Pilot Pro** : scoring 12 critères, BSR live + historique 30 j, comparateur multi-niches, plan d'action 30/60/90 j, rapports PDF/CSV
- Amazon Spy / Audit ASIN / mots-clés avancés
- Pack KDP prêt à publier (ZIP) + checklist pré-publication
- Publication pro + KDP étranger, sélection maisons d'édition
- Centre business : CRM, prospects, affiliation, dashboard marketing, influenceurs
- Masterclass + coaching mensuel + support prioritaire 12 h

Règle d'affichage : sur une fonction pro, un abonné Plume voit toujours l'outil en version standard avec un badge « Version Pro — Édition » et un lien vers les forfaits. Jamais de porte fermée.

## Partie 2 — Les upsells

Le catalogue de packs à l'unité existe déjà côté paiement (Visuel, Marketing, Social, Transcription, Revenus, Qualité éditoriale, Distribution, Promotion, Boost de lancement). On le réorganise en trois familles :

### A. Inclus dans Édition (plus jamais facturés à un abonné Édition)

- Pack Qualité Éditoriale Pro / BookPerfect AI (relecture IA premium)
- Pack Visuel & Conversion (couverture pro, mockups)
- Sélection maisons d'édition / Promotion Éditeur
- Packs marketing de base

Effet : l'abonné Édition voit ces packs marqués « Inclus dans votre forfait », bouton d'achat remplacé par l'accès direct.

### B. Payants à l'unité pour Plume

Mêmes packs, prix inchangés, présentés comme « la version pro à l'unité » avec une comparaison honnête : « ce pack seul à X € — ou tout inclus en passant à Édition à 49 €/mois ». C'est le levier principal de montée en gamme.

### C. Payants pour tout le monde (hors forfait, service ou coût réel)

- Pack Sérénité (session Zoom 1-à-1 + audit) — 30 €
- Distribution Large (Wide) — dépend de partenaires externes
- Transcription audio/vidéo — coût de traitement
- Pack Boost de Lancement 17 € — reste l'upsell d'entrée après une première commande

### Où les upsells sont proposés

1. **Après paiement de l'abonnement** — une page de remerciement avec un seul upsell contextuel (Boost de lancement 17 € pour Plume, Pack Sérénité pour Édition). Un seul, jamais deux.
2. **Dans l'app, au moment de l'usage** — quand un abonné Plume ouvre une fonction pro, encart discret : soit le pack à l'unité, soit passer à Édition.
3. **Page « Packs » unique** — la liste complète avec l'état par pack : « Inclus », « Acheté », « Ajouter ». Une seule source de vérité, plus de pages de packs dispersées.
4. **Email** — relance sur le pack le plus lié à l'usage réel, jamais de catalogue complet en masse.

### Garde-fous

- Un pack déjà acheté à l'unité par un abonné qui passe à Édition ne doit pas être refacturé ; on le marque comme acquis.
- Aucun upsell affiché pendant la génération d'un livre (on n'interrompt pas le travail).
- Les upsells ne remplacent jamais une fonction promise dans le forfait.

## Détails techniques

- Source de vérité forfaits : `src/data/v3Pricing.ts` (déjà en `plume` / `edition`, 29/290/49/490) et `src/data/v3ToolPlans.ts` (`PRO_ONLY`, `PRO_LEVEL_TOOLS`, `powerLevelForPlan`).
- Nouvelle table de correspondance packs → forfait : un fichier `src/data/v3Addons.ts` listant, pour chaque `packId` du catalogue serveur, son statut (`included_edition` / `paid` / `always_paid`) et son prix affiché. Il doit rester aligné avec `PACKS` dans `supabase/functions/v3-upsell-checkout/index.ts` et `V3_UPSELL_PACKS` dans `src/data/roadmapV3.ts`.
- Le serveur reste maître des montants : `v3-upsell-checkout` refuse un achat pour un pack `included_edition` si l'acheteur est abonné Édition.
- `src/hooks/useV3Entitlement.ts` doit exposer le forfait courant (`plume` / `edition`) en plus des accès historiques, pour que l'affichage « Inclus » et les badges pro s'appuient sur une seule source.
- Composant partagé `ProUpsellBadge` réutilisé sur toutes les fonctions pro plutôt qu'un encart recopié par page.
- Prix récurrents fournisseur déjà créés : `v3_plume_monthly`, `v3_plume_annual`, `v3_edition_monthly`, `v3_edition_annual`.

## Hors périmètre

- L'offre accès à vie 47 € sur `/commander` reste inchangée jusqu'au 30/09/2026 ; les abonnements démarrent au 01/10/2026.
- Aucune campagne email dans ce lot.

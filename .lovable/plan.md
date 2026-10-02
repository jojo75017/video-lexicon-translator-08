# Harmonisation de la page d'accueil V3 (/v3)

## Objectif
Garder tout le contenu actuel de la page, mais l'harmoniser dans le style lumineux « Jovial » des nouveaux blocs (Zoom, opportunité KDP, bannière 30 minutes, « EbookStudio change tout ») : fond crème lumineux, cartes claires à bordure orange, titres serif foncés, boutons orange. Des blocs compacts (pas trop haut). La vidéo de présentation est refaite avec un meilleur écrin.

La bannière sombre « moins de 30 minutes » (V3KdpHeroBanner) reste le seul accent sombre volontaire de la page — elle sert de point d'ancrage visuel.

Le style s'applique à toute la page /v3 (abonnés et visiteurs voient la même page harmonisée). Aucun contenu, aucun lien, aucun suivi (tracking) ne change. Les prix, tunnel et formulaires ne sont pas touchés.

## Sections à harmoniser (dans l'ordre de la page)

1. **Bannière Micro-Séries V4** (V3MicroSeriesSurpriseBanner) — actuellement sombre or/encre → carte claire lumineuse, badge et bouton orange, aperçu des 3 épisodes conservé.
2. **Preuve auteur** (section dans V3HomePage, sombre or) → carte blanche à bordure orange, les 6 couvertures Amazon et le bouton « Voir sur Amazon » conservés.
3. **Aperçu des offres** (V3PricingOverview) — déjà clair → reprise dans les mêmes tokens (joy) pour la cohérence.
4. **Vidéo de présentation** (V3PresentationVideo) — refaite : carte lumineuse compacte, titre serif, badge orange « 5 min 12 · voix française et sous-titres », lecteur vidéo arrondi dans une carte claire. La vidéo elle-même (fichier mp4 existant) ne change pas.
5. **Nouveautés** (titre + V3CoverStudioBanner + BdComicNewsBanner) → harmonisées au style clair/orange.
6. **Ce qui a changé + moteurs IA** (V3WhatsNewPanel, V3EngineStrip, V3EngineGrid) — cartes sombres → cartes claires.
7. **Rappel de réservation** (V3ReserveCtaBand, 2 instances) — fond vert foncé → carte lumineuse orange ; le texte périmé « Ouverture le 1er octobre » devient « EbookStudio V3 est ouvert » (le formulaire de capture et son suivi restent identiques).
8. **Pour aller plus loin / présentation longue** (V3GoFurtherPanel, V3AnchorNav, V3WhatIsPanel) → style clair.
9. **Portail email (ReadingGate) et suite** (V3HowItWorksSteps, V3BenefitsPanel, V3DifferenceTable, Niches10Offer, V3CapabilitiesPanel, V3UpsellRotator, V3MarketProofPanel, V3GuaranteePanel) → même harmonisation ; la table comparative sombre devient claire.
10. **Outils vedettes et Blog** — déjà clairs pour l'essentiel → petites retouches pour coller aux mêmes tokens ; le bloc Blog sombre devient une carte claire à liseré orange.

## Règles de style
- Tokens existants « joy » (v3-joy-cream, joy-ink, joy-orange-soft, joy-orange-600, joy-muted) + `v3-btn v3-joy-cta`, comme dans V3SubscriberZoomHelp.
- Cartes : fond blanc/crème, bordure 1px orange doux, coins arrondis, ombre légère.
- Compact : paddings verticaux py-6/py-8 (au lieu de py-12+), pas de nouvelle section haute.
- Textes 100 % en français, aucune couleur codée en dur dans les composants.
- Thème clair forcé déjà en place — rien à changer côté sombre.

## Vérifications
- Build OK.
- Navigation dans l'aperçu : page complète en ordinateur (1280 px) et mobile (390 px), avec la session abonnée restaurée, pour contrôler l'harmonie de bout en bout (des défilants jusqu'au blog).
- Vérifier que la lecture de la vidéo fonctionne.

Rien n'est publié.

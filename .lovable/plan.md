

## Synthese : Onglets a supprimer (fictifs ou sans resultats)

Apres analyse complete du fichier `EbookPlannerPage.tsx` (3786 lignes, ~90 onglets), voici la classification.

### Onglets a GARDER (coeur fonctionnel)

| Onglet | Raison |
|--------|--------|
| `workflow-dashboard` | Tableau Trello principal |
| `complete-workflow` | Generation P1-P15 automatique |
| `editorial-director` (P1) | Niche/cadrage |
| `market-analysis` (P2) | Analyse marche |
| `content-architect` (P3) | Structure chapitres |
| `expert-writing` (P4) | Redaction |
| `natural-rewrite` (P5) | Reecriture |
| `editorial-quality` (P6) | Qualite |
| `editorial-packaging` (P7) | KDP metadata |
| `final-diagnosis` (P8) | Diagnostic |
| `editorial-memory` (P9) | Voix auteur |
| `chapter-coherence` (P10) | Transitions |
| `self-critique` (P11) | Lecteur test |
| `iterative-loop` (P12) | Corrections |
| `style-signature` (P13) | Style |
| `ultimate-verdict` (P14) | Verdict final |
| `humanize-anti-ia` (P15) | Anti-IA |
| `planner` | Formulaire manuel |
| `writing` | Ecriture chapitres |
| `export` | Export PDF/Word |
| `calibre-epub` | Export ePub |
| `cover` | Couverture IA |
| `cover-design-editor` | Editeur couverture |
| `audiobook` | Livre audio |
| `audio-express` | Audio Express |
| `settings` | Parametres/API |
| `projects` | Mes projets |
| `ebook-library` | Bibliotheque |
| `characters` | Personnages |
| `kdp` | Description KDP |
| `backcover` | 4e de couverture |
| `strict-proofread` | Relecture stricte |
| `series` | Gestionnaire tomes |
| `doc-transform` | Import documents |
| `url-import` | Import URL |
| `templates` | Templates |
| `subscription` | Abonnement |

### Onglets a SUPPRIMER (37 onglets fictifs/gadgets/sans vrai resultat)

| Onglet | Probleme |
|--------|----------|
| `niche-analysis` | Doublon avec P2 |
| `dashboard` | Doublon avec workflow-dashboard |
| `manuscript-dashboard` | Doublon dashboard |
| `global-dashboard` | Encore un doublon |
| `analytics` | Mockup 3D + stats superficielles |
| `kdp-analytics` | Donnees fictives (pas de connexion Amazon) |
| `kdp-research` | Recherche KDP fictive |
| `kdp-amazon-research` | Encore une recherche fictive |
| `kdp-explosive` | Simulateur fictif |
| `kdp-revenue-simulator` | Calculs fictifs |
| `market` | Doublon P2 |
| `amazon-simulator` | Fausse page Amazon |
| `amazon-ads` | Simulateur Amazon Ads fictif |
| `competitor-dashboard` | Pas de donnees reelles |
| `competitor-spy` | Pas de donnees reelles |
| `bsr-tracker` | Pas de connexion Amazon |
| `trend-predictor` | Predictions fictives |
| `price-estimator` | Estimations fictives |
| `ab-testing` | Tests A/B fictifs |
| `title-ab-test` | Doublon ab-testing |
| `plagiarism-validator` | Pas de vrai moteur anti-plagiat |
| `readability-analyzer` | Gadget peu utile |
| `rhythm-analyzer` | Gadget |
| `consistency-detector` | Gadget |
| `chapter-word-count` | Info deja dans writing |
| `prompt-library` | Templates prompts statiques |
| `prompt-chain-generator` | Prompts a copier-coller |
| `encyclopedia` | Generateur niche |
| `atlas` | Generateur niche |
| `coloring-book` | Generateur niche |
| `comic-book` | Generateur niche |
| `diary-generator` | Generateur niche |
| `recipe-book` | Generateur niche |
| `travel-guide` | Generateur niche |
| `aquarium-guide` | Generateur niche |
| `bird-guide` | Generateur niche |
| `documentary` | Generateur niche |
| `video-trailer` | Bande-annonce fictive |
| `video-creator` | Createur video fictif |
| `landing-page-generator` | Landing page basique |
| `seo-articles` | Articles SEO hors sujet |
| `beta-reader-hub` | Pas de vrais lecteurs beta |
| `ux-center` | Meta/gadget |
| `editorial-calendar` | Calendrier fictif |
| `publication-planner` | Doublon calendrier |
| `royalty-dashboard` | Donnees fictives |
| `direct-sales` | Vente directe fictive |
| `arc-manager` | ARC fictif |
| `multi-tome-hub` | Doublon series |
| `multi-translator` | Traduction sans API reelle |
| `writing-intelligence` | Doublon writing |
| `focus-mode` | Gadget editeur zen |
| `niche-templates` | Templates niche |
| `back-matter-generator` | Generateur annexes |
| `pdf-reformatter` | Reformateur PDF |
| `pdf-analyzer` | Analyseur PDF |
| `draft-mode` | Doublon writing |
| `rich-editor` | Doublon writing |
| `description-magnet` | Gadget |
| `pen-name` | Generateur noms de plume |
| `imagebank` | Banque images generiques |
| `library` | Doublon imagebank |
| `mockup-studio` | Mockup 3D gadget |
| `price-studio` | Doublon pricing |
| `kdp-cover-studio` | Doublon cover |
| `export-guide` | Guide statique |
| `kdp-guide` | Guide statique |
| `formation-pdf` | Formation statique |
| `formation-audiobook-distribution` | Formation statique |
| `audiobook-library` | Doublon ebook-library |
| `elementor-export` | Export Elementor niche |
| `affiliation` | Redirection |
| `editor-audit` | Gadget |
| `humanizer` | Doublon P15 |
| `ai-detector` | Score IA gadget |
| `ai-cover-studio` | Doublon cover |
| `advanced-export` | Doublon export |
| `presentation` | Page presentation |
| `onboarding` | Optionnel a garder |
| `aichat` | Assistant IA (a garder si fonctionnel) |
| `statistics` | Stats + traduction (garder traduction?) |
| `voice` | Dictee vocale (garder si fonctionne) |
| `marketing` | Posts sociaux (garder si fonctionne) |
| `monetization` | Conseils monetisation (garder si utile) |
| `images` | Images chapitres (garder si fonctionne) |
| `kindle-preview` | Preview Kindle (garder si utile) |

### Plan d'implementation

**Fichiers a modifier :**

1. **`TrelloBoardColumns.ts`** — Retirer les cartes des onglets supprimes des 5 colonnes Trello
2. **`ModernSidebar.tsx`** (ou equivalent) — Retirer les entrees de menu correspondantes
3. **`EbookPlannerPage.tsx`** — Supprimer les `case` du switch + les imports correspondants (environ 70 imports et 200+ lignes de switch)

Cela reduirait l'application de ~90 onglets a ~35-40 onglets fonctionnels, avec une navigation claire et sans elements fictifs.

Voulez-vous que je procede avec cette liste, ou souhaitez-vous ajuster certains onglets (en garder ou en supprimer d'autres) ?


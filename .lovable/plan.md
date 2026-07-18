# Plan validé + ajouts couverture & export

## Bloc 1 — Studio Éditorial (15 agents, automatiques, inclus partout)

Ils s'enchaînent tout seuls après "Générer mon livre". Barre de progression globale (0→15) + carte par agent (⏳ en attente → 🔄 en cours → ✅ terminé) avec le nom qui défile visiblement.

| # | Nom d'agent | Rôle |
|---|---|---|
| 1 | Architecte | Structure et fiche technique du livre |
| 2 | Scénariste | Plan narratif détaillé chapitre par chapitre |
| 3 | Documentaliste | Recherche et sources pour le contenu |
| 4 | Rédacteur | Génération du manuscrit chapitre par chapitre |
| 5 | Dialoguiste | Enrichissement des dialogues et scènes |
| 6 | Continuiste | Vérification de la cohérence narrative |
| 7 | Réviseur | Passe de révision stylistique |
| 8 | Correcteur | Orthographe, grammaire, ponctuation |
| 9 | Styliste | Harmonisation du ton et du rythme |
| 10 | Éditeur | Coupes, ajouts, resserrage éditorial |
| 11 | Metteur en page | Formatage, titres, hiérarchie |
| 12 | Indexeur | Table des matières et navigation |
| 13 | Préfacier | Introduction, préface, quatrième de couverture |
| 14 | Résumeur | Synopsis court + long |
| 15 | Contrôleur qualité | Passe finale et validation avant export |

## Bloc 2 — Studio Croissance (15 agents, à la demande)

**Recherche & positionnement (4)** — Chasseur de niches, Mineur de mots-clés, Cartographe de catégories, Éclaireur concurrence
**Habillage produit (4)** — Illustrateur (Cover Studio), Vitrine A+, Metteur en scène Look Inside, Rédacteur fiche produit
**Marketing & acquisition (4)** — Publicitaire BookBub, Voix newsletter, Community manager, Page de vente
**Distribution (3)** — Éclaireur éditeurs, Exportateur KDP, Exportateur WooCommerce

Cadenas + "Débloquer" selon la formule.

## Matrice des 3 formules d'octobre

| Formule | Éditorial (15) | Croissance |
|---|---|---|
| Débutant 6,99 €/mo | ✅ Tous | Mots-clés, Fiche produit, Illustrateur, Export KDP |
| Expert 9,99 €/mo | ✅ Tous | + Chasseur niches, Cartographe, Vitrine A+, Look Inside, Newsletter, Community |
| Auteur 59 €/mo | ✅ Tous | ✅ Les 15 |

## Nouveaux ajouts

### Couverture — champs auteur + sous-titre
Le wizard `V3CreateWizard` ne demande aujourd'hui que le titre. On ajoute à l'étape 4 (Titre) :
- **Nom d'auteur** (obligatoire, pré-rempli avec le profil utilisateur si dispo)
- **Sous-titre** (optionnel, ~80 caractères)

Ces trois champs (titre, sous-titre, auteur) sont :
- Passés à `generate-front-cover` (les paramètres existent déjà côté edge function, il suffit de les transmettre) pour figurer sur l'illustration.
- Injectés dans le manuscrit : page de titre + entêtes + métadonnées d'export.
- Éditables sur la carte "Refaire la couverture" après génération, sans devoir relancer tout le livre.

### Export — garantir tous les chapitres
Bug connu du Hub V3 précédent : l'export DOCX/PDF sautait des chapitres quand la génération avait été partielle ou reprise.

Corrections dans le flux d'export :
- **Contrôle de complétude avant export** : vérifier que `chapters.length === totalChapters` configurés, sinon afficher un bandeau rouge listant les chapitres manquants avec bouton "Regénérer ce chapitre".
- **Source unique de vérité** : lire tous les chapitres depuis `ebook_workflow_results` triés par `chapter_index ASC`, pas depuis un state React qui peut être partiel.
- **Fallback texte** : si un chapitre est présent en base mais vide, insérer un placeholder visible `[Chapitre X — à regénérer]` plutôt que de le sauter silencieusement.
- **Journal d'export** : afficher en fin d'export "X/Y chapitres exportés" pour que l'utilisateur voie immédiatement s'il en manque.

## Fichiers modifiés

- `src/components/ebook/EbookCompleteWorkflow.tsx` — renommage des 15 agents + barre de progression globale.
- `src/components/v3public/V3CreateWizard.tsx` — étape 4 : ajout sous-titre + auteur ; passage à `generate-front-cover` ; carte "Refaire la couverture" avec champs éditables.
- `src/components/v3public/V3GrowthAgents.tsx` (nouveau) — panneau 15 agents Croissance.
- Module d'export (DOCX/PDF utilisé par le workflow) — contrôle de complétude, source unique, fallback, journal.
- `src/components/admin/V3PendingLaunchTab.tsx` — matrice inclusion/verrouillage des 3 formules.

Aucun changement backend requis — les edge functions concernées acceptent déjà auteur/sous-titre.

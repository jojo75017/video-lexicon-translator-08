# V3 — Nettoyer les forfaits dans le menu + réparer le sommaire à l'export

Deux problèmes concrets, plus le rappel de ce que contient chaque forfait et le traitement des upsells.

## 1. Le menu « Forfaits » affiche encore les 3 anciens plans

Constat vérifié dans `src/data/v3HeaderMenu.ts` : la catégorie « Forfaits » liste encore
« Auteur — 9,99 €/mois », « Studio — 12,99 €/mois », « Éditeur — 59 €/mois » et un lien
« Comparer les 3 forfaits », avec des liens `?plan=debutant|expert|auteur`.

À faire :
- Remplacer par exactement deux entrées : **Plume — 29 €/mois** (badge « 30 livres/mois ») et
  **Édition — 49 €/mois** (badge « Recommandé · illimité »), plus un lien « Comparer les 2 forfaits »
  et un lien « Mensuel ou annuel (2 mois offerts) » vers la page forfaits.
- Les liens pointent sur `?plan=plume` / `?plan=edition` / `?plan=all`.
- Balayer le reste de l'app pour supprimer toute trace de Débutant / Studio / Expert / Auteur /
  9,99 / 12,99 / 59 €/mois dans les menus, sidebars, pieds de page et bandeaux (header espace,
  sidebar moderne, footer V3), afin qu'aucune page n'annonce un tarif mort.

## 2. Le sommaire à l'export part en vrille (40 chapitres demandés → 80)

Constat : sur l'export fourni, la table des matières compte 80 entrées pour 40 chapitres
demandés. Un chapitre sur deux porte un titre de sommaire (« L'appel de Montferrand — Noces de
Vendetta »), l'autre est soit vide (« Chapitre 2 »), soit un titre fabriqué à partir de la
première phrase du texte (« Chapitre 8 — Chapitre 4 Le jour ne s'était pas vraiment levé… »).
Au-delà de 60, les titres du sommaire se répètent avec un suffixe « 2 ».

La cause exacte n'est pas encore prouvée : deux sources de chapitres (le plan validé et le
manuscrit écrit) sont fusionnées et se retrouvent côte à côte au lieu d'être appariées.
**Première étape du chantier : reproduire sur un livre de test et tracer précisément le point de
fusion** (assemblage du livre à partir des résultats d'agents, puis passage à l'export), avant de
corriger. On ne corrige pas à l'aveugle un export de livre.

Ensuite, garanties à mettre en place — une seule fonction de normalisation du manuscrit, utilisée
par l'assemblage **et** par tous les exports :

- **Le nombre de chapitres demandé est un plafond dur.** Jamais plus d'entrées que demandé,
  jamais de remplissage automatique au-delà.
- **Appariement par numéro, pas par accumulation.** Un chapitre = un numéro. Le titre vient du
  sommaire validé ; le texte vient du manuscrit. Deux entrées portant le même numéro fusionnent.
- **Aucun titre fabriqué à partir du corps du texte.** Si un titre manque, on prend celui du
  sommaire ; à défaut « Chapitre N » seul, jamais la première phrase du chapitre.
- **Aucun titre répété avec suffixe.** Si le générateur de secours n'a pas assez de titres
  distincts, il en produit de nouveaux au lieu d'ajouter « 2 ».
- **Suffixe du titre du livre retiré.** Plus de « — Noces de Vendetta » collé à chaque ligne du
  sommaire : le titre du livre est déjà sur la couverture et l'en-tête.
- **Chapitres vides exclus du sommaire final**, avec un avertissement clair à l'export si des
  chapitres n'ont pas été rédigés, au lieu d'une table des matières trouée.
- **Contrôle avant export** : si le nombre de chapitres du manuscrit ne correspond pas au brief,
  l'export s'arrête sur un message explicite plutôt que de produire un fichier illisible.

Objectif de recette : un livre de 40 chapitres donne une table des matières de 40 lignes, toutes
titrées, numérotées 1 à 40, sans doublon ni fragment de texte.

## 3. Rappel — ce que chaque forfait apporte

### Plume — 29 €/mois ou 290 €/an (2 mois offerts)
30 livres/mois · tous les onglets (Plan, Écrire, Habiller, Publier, Vendre) · workflow standard
22 agents · 40 chapitres · 5 000 mots/chapitre · Sommaire Ultime · export PDF/DOCX/EPUB ·
couverture complète recto + tranche + 4e · **audiolivre inclus** · import DOCX/PDF/URL · livre
illustré maternelle et Histoires du soir · traductions 10 langues · niches, mots-clés Amazon,
catégories, description KDP · KDP Pilot (audit complet, BSR quotidien) · forum + support 24 h.

### Édition — 49 €/mois ou 490 €/an (2 mois offerts)
Tout Plume, plus : **livres illimités** · **Recherche Approfondie (30 agents)** · 60 chapitres ·
8 000 mots/chapitre · **Cover Studio Pro** (300 DPI, gabarits KDP, DA IA) · **Audiolivre Pro**
(voix premium, chapitrage, prêt ACX) · **BD Studio Pro** · **KDP Pilot Pro** (scoring 12 critères,
BSR live, comparateur, plan d'action 30/60/90 j) · Amazon Spy / Audit ASIN avancés · pack KDP ZIP +
checklist · publication pro et KDP étranger · centre business (CRM, prospects, affiliation,
marketing) · masterclass + coaching mensuel + support prioritaire 12 h.

Règle d'affichage : un abonné Plume voit toujours l'outil, en version standard, avec un badge
« Version Pro — Édition ». Jamais de porte fermée.

## 4. Les upsells

Trois familles, une seule page « Packs » qui affiche l'état réel de chaque pack :

- **Inclus dans Édition** : Qualité Éditoriale Pro / BookPerfect AI, Pack Visuel & Conversion,
  Promotion Éditeur / sélection maisons d'édition, packs marketing de base. Pour un abonné
  Édition, le bouton d'achat devient « Inclus dans votre forfait ».
- **Payants à l'unité pour Plume** : les mêmes packs, prix inchangés, avec la comparaison
  « ce pack seul à X € — ou tout inclus en passant à Édition à 49 €/mois ». C'est le levier de
  montée en gamme.
- **Payants pour tout le monde** (service ou coût réel) : Pack Sérénité 30 €, Distribution Large,
  Transcription audio/vidéo, Pack Boost de Lancement 17 € (l'upsell d'entrée après commande).

Où ils apparaissent : un seul upsell sur la page de remerciement après paiement ; un encart
discret dans l'app quand un abonné Plume ouvre une fonction pro ; la page « Packs » unique ;
en email, uniquement le pack lié à l'usage réel. Jamais d'upsell pendant la génération d'un livre.
Un pack déjà acheté n'est jamais refacturé après passage à Édition.

## Détails techniques

- `src/data/v3HeaderMenu.ts` : réécrire la catégorie `plans` (2 liens + comparatif) ; les libellés
  et prix viennent de `src/data/v3Pricing.ts` (source unique, déjà en `plume` / `edition`).
- Recherche à faire sur `9,99`, `12,99`, `debutant`, `expert`, `auteur`, `Studio —`, `Éditeur —`
  pour éliminer les tarifs morts (menus, `EspaceHeader`, `ModernSidebar`, `V3Footer`, bandeaux).
- Sommaire : investigation sur `buildBookFromWorkflowResults` dans
  `src/components/v3public/V3CreateWizard.tsx` (fusion `P3.chapitres` / `P4.chapitres` /
  `P5.chapitresFinal` avec un `total` calculé par `Math.max`) et sur `normalizeP3Result` /
  le padding de chapitres dans `supabase/functions/complete-book-workflow/index.ts`.
- Nouvelle fonction unique `normalizeManuscript(chapters, expectedCount, outline)` dans
  `src/utils/` , appelée par l'assemblage du wizard et par `docxExportEngine.ts`,
  `EbookExporter.tsx`, `EbookAdvancedExport.tsx`, `WorkflowExportCompiled.tsx` — plus de logique de
  titre dupliquée par export.
- `buildFallbackOutline` : supprimer le suffixe numérique de répétition et le collage du titre du
  livre à chaque titre de chapitre.
- Test unitaire : 40 chapitres demandés, sources partielles et désordonnées en entrée → 40 entrées
  numérotées, titrées, sans doublon.

## Hors périmètre

- L'offre accès à vie 47 € sur `/commander` reste inchangée jusqu'au 30/09/2026.
- Aucune campagne email dans ce lot.

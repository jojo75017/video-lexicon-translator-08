# Refonte : un vrai atelier d'édition, simple et carré

## Le problème actuel
Le Hub 3 (`V3Workflow30.tsx`, 1706 lignes, ~100 modules répartis en phases repliables) est devenu une usine à gaz : trop d'étapes, trop d'erreurs, les gens se perdent. Et on ne voit jamais les titres des chapitres du livre.

## Ce qu'on construit
Un **parcours unique, linéaire et lisible** qui reprend l'esprit du workflow V2 (une liste d'agents qu'on lance l'un après l'autre) mais en beaucoup plus propre, présenté comme une **maison d'édition** : chaque étape = un métier (agent) avec un nom clair. Deux niveaux :

- **V3 — 197€ : 22 agents** (de l'idée au livre publié sur KDP)
- **V4 — 347€ : 30 agents** (les 22 + 8 métiers pour *vendre* comme un éditeur)

On abandonne l'appellation « Base / Pack Pro » au profit de **V3** et **V4**.

## Les 22 agents V3 (197€)

**Studio Conception**
1. Le Directeur Éditorial — cadre la promesse, le ton, l'angle
2. L'Analyste de Marché — niche, catégories, 7 mots-clés KDP
3. L'Architecte du Livre — **plan détaillé + titres de chapitres**

**Atelier d'Écriture**
4. Le Documentaliste — recherche & sources
5. Le Romancier — rédige **chapitre par chapitre (titre affiché)**
6. Le Styliste — humanise, donne votre voix
7. Le Dialoguiste — dialogues & rythme
8. Le Relieur — transitions et fil rouge

**Bureau de Révision**
9. Le Correcteur — orthographe & grammaire
10. Le Réviseur — cohérence & clarté
11. Le Vérificateur des Faits
12. Le Détecteur de clichés
13. Le Comité de Lecture — avis bêta

**Fabrication**
14. Le Maquettiste — mise en page intérieure
15. Le Rédacteur des pages liminaires — copyright, remerciements, fin
16. Le Directeur Artistique — couverture (dos + 4e + bleed)
17. Le Correcteur d'épreuves — BAT / bon à tirer

**Publication**
18. Le Responsable Métadonnées — titre, sous-titre, mots-clés, catégories KDP
19. Le Rédacteur de 4e de couverture — description de vente
20. Le Chef de Fabrication — export EPUB / PDF / DOCX
21. Le Responsable Conformité KDP — checklist prépublication
22. L'Humanisateur — bonus anti-détection IA

## Les 8 agents V4 en plus (347€) — « Département Commercial »
23. L'Attaché de Presse — kit média & communiqués
24. Le Community Manager — calendrier 30 j, TikTok, Pinterest
25. Le Responsable Amazon Ads
26. Le Responsable Partenariats & Influenceurs
27. Le Responsable Distribution Large — wide, ISBN, dépôt légal
28. Le Directeur Commercial — pricing, royalties, bundles
29. Le Responsable Avis & Réputation — reviews, Goodreads
30. Le Directeur de Collection — saga, séries, back-catalogue

*(Les libellés exacts restent ajustables ; chaque agent est branché sur un module déjà existant du projet.)*

## Correction « on ne voit pas les chapitres »
- L'**Architecte** produit et affiche une **liste numérotée des titres de chapitres**.
- Le **Romancier** affiche, pendant la rédaction, le titre du chapitre en cours et coche chaque chapitre terminé.
- L'**export** (Chef de Fabrication) reprend ces mêmes titres.

## Détails techniques

1. **Nouveau composant propre** `src/components/admin/EditionWorkflow.tsx` — une seule liste d'étapes verticales (pas de phases repliables imbriquées), en-tête de progression, une carte par agent (nom métier, mission courte, bouton « Lancer », résultat déroulant, coche « fait »).
2. **Source unique** `src/data/editionAgents.ts` : tableau des 30 agents `{ id, order, department, role, mission, moduleId, tier: 'v3' | 'v4' }`. Chaque `moduleId` pointe vers un composant/générateur déjà présent (`v3ModuleRegistry`).
3. **Filtre par offre** : V3 affiche les agents `tier === 'v3'` (22) ; V4 affiche tout (30). L'entitlement est déjà géré par `useV3Entitlement` — on ajoute simplement la distinction V3/V4 (347€) via le pack déjà existant.
4. **Titres de chapitres** : lire la structure produite par l'Architecte (résultat P3 / `results`) et afficher les titres ; réutiliser la même liste dans le Romancier et l'export (`V3ExportPanel`).
5. **Nettoyage** : retirer `V3Workflow30.tsx` du Hub et le remplacer par `EditionWorkflow`. On garde les modules sous-jacents (couverture, export, conformité…) intacts — on ne change que l'orchestration/présentation.
6. **Tarifs** : mettre à jour `roadmapV3.ts` / `v3Launch.ts` pour parler de **V3 197€ / V4 347€** au lieu de Base / Pack Pro (mêmes prix, nouveaux libellés).

## Ce qu'on ne touche pas
La logique d'appel IA, les générateurs de chaque module, l'export multi-format et le paiement restent inchangés : on refait uniquement l'orchestration et la présentation (frontend), pour un parcours clair et carré.

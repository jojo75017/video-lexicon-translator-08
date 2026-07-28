
# Feuille de route — Documentaire · Atlas · Cuisine · Voyage

Objectif : moderniser ces 4 modules « livres spéciaux » en **deux niveaux** :
- **Version Standard** : incluse dans les 3 forfaits (Débutant 9,99 € · Expert 12,99 € · Éditeur 59 €)
- **Version Pro avancée** : réservée au forfait **Éditeur 59 €** uniquement

## Matrice Standard vs Pro (par module)

| Fonctionnalité | Standard (3 plans) | Pro (Éditeur 59 €) |
|---|---|---|
| Nb de chapitres/fiches/recettes/étapes | jusqu'à 15 | jusqu'à 60 |
| Longueur par section | 400-800 mots | 1500-2500 mots |
| Illustrations IA | 1 par section (basique) | 2-3 par section HD photoréalistes |
| Structure | linéaire simple | encadrés, sources, index, annexes |
| Format KDP | 1 format par défaut | tous formats KDP + couverture assortie via Cover Studio Pro |
| Export | PDF + DOCX | PDF print-ready (bleed) + DOCX + EPUB |
| Sections obligatoires | Sommaire + Remerciements | + Bibliographie / Index / À propos de l'auteur / Note pour avis |
| Résilience | génération unique | checkpoints localStorage + reprise après crash |
| Métadonnées KDP | manuelles | Fiche produit IA (description, keywords, catégories) |

## Vue d'ensemble des modules

| Module | Route | Composant actuel V2 |
|---|---|---|
| Documentaire | `/v3/livres/documentaire` | `EbookDocumentaryGenerator` |
| Atlas | `/v3/livres/atlas` | `EbookAtlas` |
| Cuisine | `/v3/livres/cuisine` | `EbookRecipeBookGenerator` |
| Voyage | `/v3/livres/voyage` | `EbookTravelGuideGenerator` |

## Jour 1 — Socle commun (matin)

1. Audit rapide des 4 composants existants dans `src/components/ebook/`.
2. Créer un socle partagé `src/components/ebook/pro/` :
   - `ProBookShell.tsx` — layout uniforme (fiche projet, progress bar, bouton lancer)
   - `useProBookGeneration.ts` — hook commun : appel agent → images → checkpoints localStorage → export (calqué sur Kids Book)
   - `ProBookExporter.ts` — PDF/DOCX avec images intégrées HD
   - `useProBookTier.ts` — hook qui lit `useV3Entitlement` et retourne `'standard' | 'pro'` (Pro si plan `editeur` / `lifetime` / `vip`)
3. Badge visuel « Version PRO » / « Version Standard » selon plan, avec CTA d'upsell discret vers `/v3/forfaits` pour les non-Éditeur.

## Jour 1 — Documentaire (après-midi)

4. Edge function `agent-documentary` avec paramètre `tier: 'standard' | 'pro'` :
   - Standard : N chapitres 400-800 mots, structure simple
   - Pro : N chapitres 1500-2500 mots, encadrés « Le saviez-vous », citations sourcées, bibliographie auto
5. Génération images photoréalistes via `generate-illustration` (Gemini) : 1/section en standard, 2-3/section en pro.
6. Format KDP : 15,24 × 22,86 cm (6"×9").
7. Sections finales adaptées au tier.

## Jour 2 — Atlas (matin)

8. Edge function `agent-atlas` avec tiers :
   - Standard : fiches courtes (données clés + description)
   - Pro : fiches longues (géographie, histoire, culture, économie, curiosités, données chiffrées, encadrés)
9. Illustrations : 1 carte stylisée IA par fiche (standard) + 1-2 photos emblématiques additionnelles (pro).
10. Format Standard : portrait 6"×9" · Pro : paysage 25,4 × 20,32 cm avec mise en page 2 colonnes.
11. Pro uniquement : index alphabétique auto + sommaire cliquable enrichi.

## Jour 2 — Cuisine (après-midi)

12. Edge function `agent-recipe` avec tiers :
    - Standard : titre, ingrédients, étapes, temps
    - Pro : + astuces chef, variantes, valeurs nutritionnelles estimées, difficulté, portions ajustables
13. Photo plat photoréaliste : 1/recette (standard), 2/recette + photo pas-à-pas (pro).
14. Format : carré 21,59 × 21,59 cm (KDP).
15. Pro uniquement : index par ingrédient, conversions mesures, page auteur, catégorisation par régime/occasion.

## Jour 3 — Voyage (matin)

16. Edge function `agent-travel` avec tiers :
    - Standard : itinéraire jour par jour + top lieux
    - Pro : + où dormir/manger par gamme, transports, budget estimé, phrases utiles, encart sécurité/santé, checklist voyage
17. Illustrations : 1 photo lieu emblématique par étape (standard) + carte itinéraire stylisée IA globale (pro).
18. Format 15 × 22 cm, encarts pratiques colorés en Pro.

## Jour 3 — Intégration & finitions (après-midi)

19. Sidebar V3 : 4 entrées « Documentaire », « Atlas », « Cuisine », « Voyage » avec badge « PRO disponible » (pas d'exclusivité totale).
20. Bouton « Ouvrir dans Cover Studio Pro » depuis chaque module (préréglage catégorie) — actif pour tous, avec templates Pro exclusifs Éditeur.
21. Persistance cloud dans `ebook_projects` avec `project_type` = `documentary` / `atlas` / `recipe` / `travel` et un flag `tier`.
22. Tests Playwright : pour chaque module × chaque tier (2×4 = 8 scénarios), générer un mini-livre 3 sections et vérifier export PDF avec images.
23. Retirer/rediriger les anciens composants V2 obsolètes une fois validé.

## Aspects techniques

- **Réutilisation** : socle Kids Book (progress bar, checkpoints, export PDF avec images intégrées) = patron directeur.
- **Images** : `generate-illustration` (Gemini 3 Flash Image), prompts spécialisés par module (photoréalisme strict — respect règle mémoire).
- **Gating** : `useV3Entitlement` détermine le tier ; aucun blocage d'accès au module, seule la richesse change.
- **Résilience** : checkpoint localStorage après chaque section (Pro), reprise si crash IA.
- **BYOK** : respect clé Gemini utilisateur si présente.
- **Cover Studio Pro** : templates réservés Éditeur pour les catégories Documentaire / Atlas / Cuisine / Voyage.

## Hors périmètre (à valider ensuite)

- Mockup 3D des livres
- Traduction automatique (upsell 1-clic post-génération)
- Version audio des chapitres

## Points à confirmer avant de coder

1. Valider la matrice Standard/Pro ci-dessus (limites de chapitres, longueurs, nombre d'images) — ces chiffres sont-ils OK ou tu veux ajuster ?
2. En Standard, on garde bien l'accès à **tous les 4 modules** pour les 3 forfaits (Débutant inclus) ou tu veux verrouiller certains sur Expert minimum ?
3. Ordre de traitement : je commence par Documentaire (jour 1) comme prévu, ou tu préfères un autre module en premier ?

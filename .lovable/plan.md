# Audit technique — Module Couvertures EbookStudio

Aucun fichier n'a été modifié. Voici uniquement le constat, puis un plan par étapes.

## 1. Un générateur existe-t-il déjà ?

Oui, et il en existe **plusieurs, en doublon** :

- `/v3/cover-studio-pro` (hub) + `/v3/cover-studio-pro/edit` — éditeur canvas Fabric.js, le plus proche de l'objectif (calques texte, formats, export PNG/PDF).
- `/couverture-kdp` — `KdpCoverStudio.tsx` (732 lignes), wrap KDP + PDF exact via `src/lib/kdpCoverPdf.ts`.
- `EbookAICoverStudio.tsx` (1 574 lignes) — génération IA + sauvegarde bibliothèque.
- `UnifiedCoverStudio.tsx`, `CoverDesignEditor.tsx`, `EbookCoverGenerator.tsx`, `EbookBackCoverGenerator.tsx`, `CoverPdfExact.tsx` (wrapper), `CoverStudioPro.tsx` (admin).

Côté serveur : **7 fonctions de couverture** coexistent (`generate-front-cover`, `generate-premium-cover`, `generate-ai-cover`, `generate-cover-image`, `generate-cover-prompt`, `generate-series-cover`, `cs-generate-cover`).

## 2. Modèles d'image et API utilisés

Pas de stratégie unique — chaque fonction a sa propre cascade :

| Fonction | Cascade actuelle |
|---|---|
| `generate-front-cover` | OpenAI `gpt-image-1` → `dall-e-3` → passerelle Lovable `google/gemini-3-pro-image` |
| `generate-premium-cover` | `gpt-image-2` → `gpt-image-1` → `dall-e-3`, sinon `gemini-2.5-flash-image`, sinon OpenRouter (BYOK) |
| `generate-cover-image` | OpenAI `gpt-image-1`, ou OpenRouter si clé abonné |
| `cs-generate-cover` | passerelle Lovable `openai/gpt-image-2` (consomme des crédits Lovable) |

## 3. Résolution réellement disponible

- Génération IA : **1024 × 1536 px** (portrait) ou 1536 × 1024 (paysage) — plafond des modèles OpenAI ; `dall-e-3` monte à 1024 × 1792.
- Pas de sur-échantillonnage : `normalizeCoverToKdp` recadre vers 1600 × 2560 (Kindle), donc l'image IA est **étirée** depuis 1024 px de large.
- L'éditeur Fabric travaille en revanche bien en **300 DPI réels** (ex. wrap 6×9″ ≈ 3 900 × 2 775 px) : c'est le texte et les calques qui sont nets, pas le fond IA.

## 4. Coût / crédits par génération

- Si `OPENAI_API_KEY` est présente : facturé sur **votre compte OpenAI** (hors crédits Lovable).
- Si clé abonné OpenRouter (BYOK, `aiImageInvoke.ts`) : facturé à l'abonné.
- Sinon repli sur la **passerelle Lovable → consomme vos crédits** (`generate-front-cover`, `cs-generate-cover`). C'est exactement le comportement que vous avez fait retirer pour la BD, il subsiste ici.

## 5. Enregistrement et sécurité des projets

- Aucune table de projets de couverture (`select ... ilike '%cover%'` → **0 table**). Rien n'est versionné, rien n'est réouvrable.
- Sauvegarde = fichiers image dans le bucket `ebook-images`, dossier `<user_id>/Couvertures/` (`src/lib/coverLibrary.ts`).
- Les politiques RLS storage sont correctes (lecture/écriture limitées au dossier `auth.uid()`), **mais le bucket `ebook-images` est public** : toute personne connaissant l'URL peut ouvrir la couverture d'un autre abonné. Risque de confidentialité réel.
- Repli de chemin sur l'email si pas de session → dossiers orphelins possibles.

## 6. Plusieurs couvertures privées par abonné ?

Plusieurs **fichiers** oui (listing 100 max). Plusieurs **projets éditables** non : le JSON Fabric n'est jamais sauvegardé (`exportJSON`/`loadJSON` existent mais ne sont branchés sur aucun stockage).

## 7. Texte séparé de l'image ?

- Dans l'éditeur Pro : **oui**, `AiBackgroundPanel` demande un fond « sans texte, sans lettres » et le texte est ajouté en calques Fabric.
- Dans les autres modules (`generate-front-cover`, `generate-premium-cover`) : **non**, le titre est demandé à l'IA dans l'image → fautes d'orthographe typiques.

## 8. Dimensions exactes KDP broché / relié ?

- Broché : oui. `computeWrapFormat` applique 0,002252 in/page, fond perdu 0,125″, zones dos/tranche/recto, et `kdpCoverPdf.ts` produit un PDF aux dimensions exactes.
- Relié (hardcover) : **non**. Le format existe dans `coverFormats.ts` mais réutilise le calcul broché — pas de rabats, pas de charnière, pas d'épaisseur de carton, pas de facteur papier hardcover.
- Import d'un gabarit officiel KDP : **inexistant**.
- Aucun champ ISBN nulle part : conforme à votre exigence.

## 9. Composants à modifier (le moment venu)

`src/config/coverFormats.ts`, `src/components/cover-studio-pro/*` (Canvas, Toolbar, Templates, AiBackgroundPanel), `src/pages/v3/cover-studio-pro/*`, `src/lib/coverLibrary.ts`, `src/lib/kdpCoverPdf.ts`, `src/lib/kdpCoverNormalize.ts`, + une nouvelle table `cover_projects` et une fonction unique de génération de fond.

## 10. Risques pour l'existant

- Les 6 modules de couverture partagent `coverLibrary` et les fonctions serveur : toucher une fonction impacte le workflow V3, la Maison d'édition et ContentStudio.
- Passer `ebook-images` en privé casserait toutes les URLs publiques déjà enregistrées dans les ebooks → nécessite des URLs signées partout.
- `TrialGate` protège déjà les routes Cover Studio Pro : à conserver.
- `CoverPdfExact.tsx` est un simple wrapper de `KdpCoverStudio` : consolider sans casser cette entrée du cockpit.

---

# Plan de développement (étapes sécurisées, à valider)

**Étape 1 — Base projets privés (sans toucher l'UI)**
Table `cover_projects` (RLS `auth.uid()`, GRANTs) stockant le JSON Fabric, le format, le nombre de pages, les miniatures. Nouveau bucket privé `covers` + URLs signées. Aucune régression : rien n'est encore branché.

**Étape 2 — Onglet « Couverture Pro » unique**
Nouvel onglet dédié (Kindle / Broché / Relié), liste des projets de l'abonné, ouverture/duplication/suppression. Les anciens modules restent accessibles en parallèle.

**Étape 3 — Fond IA sans texte, qualité maximale**
Une seule fonction de génération, prompt strictement « aucun texte », BYOK Gemini/OpenAI/OpenRouter, `allowLovable: false` (plus de consommation de vos crédits), agrandissement propre vers 300 DPI.

**Étape 4 — Calques texte pro**
Titre, sous-titre, auteur en calques : polices éditoriales, interlettrage, ombre, voile dégradé pour la lisibilité, presets « thriller », « romance », « non-fiction ».

**Étape 5 — Géométrie imprimée exacte**
Recto + tranche + verso pour broché ; formule hardcover réelle (rabats, charnière, carton) ; import du gabarit officiel KDP en calque de repère verrouillé.

**Étape 6 — Exports**
JPEG haute qualité pour Kindle, PDF/X print-ready pour broché et relié, contrôle avant export (DPI, texte hors zone sûre, tranche trop fine). Toujours sans ISBN.

**Étape 7 — Nettoyage progressif**
Une fois le nouvel onglet validé par vous, redirection des anciens modules en doublon vers celui-ci, puis suppression.

Je n'ai rien développé ni modifié — dis-moi si je lance à partir de l'étape 1.

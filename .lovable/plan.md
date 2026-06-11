# Plan — Deux parcours V3 (22 / 32 agents) + exports KDP complets

## Objectif
Transformer le parcours V3 en **véritable suite d'auto-édition** différenciée par offre :
- **197€** → parcours essentiel **22 agents**
- **497€** → parcours complet **32 agents** (tout débloqué)
- Remplacer les 2 boutons d'export A4 par le **moteur d'export v2 complet** (6 formats) + un **panneau d'infos KDP** (gabarits, marges, fonds perdus, DPI images).

---

## 1. Deux parcours séparés (22 vs 32)

Aujourd'hui `V3Workflow30.tsx` contient un seul tableau `PHASES` (~31 étapes). On ajoute à chaque `Step` un champ `tier: 'core' | 'premium'` et on filtre le parcours selon l'offre de l'abonné.

### Répartition proposée

**Parcours 197€ — 22 agents essentiels (`core`)**
- Phase 1 Idée (3) : `niche-intelligence`, `p16-competitive`, `p26-commercial-score`
- Phase 2 Écriture (4) : `book-creation-studio`, `p19-author-voice`, `p20-chat-manuscript`, `p23-universe-bible`
- Phase 3 Qualité (3) : `p18-readability`, `ebook-anti-plagiat`, `content-compliance`
- Phase 4 Mise en page (4) : `manuscript-converter`, `back-matter-builder`, `copyright-page`, `cover-studio-pro`
- Phase 5 Publication (5) : `multi-format-express`, `cover-pdf-exact`, `isbn-metadata`, `categories-manager-10`, `prepub-checklist`
- Phase 6 Vente (3) : `sales-description`, `listing-optimizer`, `launch-sequence-j7`

**Parcours 497€ — 32 agents (les 22 + 10 `premium`)**
- Idée : `p22-trend-radar`, `ku-niche-detector`
- Écriture : `p17-series`
- Qualité : `p24-cliche-detector`, `p25-tone-adapter`
- Mise en page : `cover-variants-thumbnail`
- Publication : `kindle-previewer`, `kdp-pack-zip`
- Vente : `sales-tracker`
- **+ 1 nouvel agent premium** : `audiobook-express` (génération audio du livre) pour atteindre 32

### Sélection du parcours
- Détection de l'offre via le statut abonné (réutilise la logique tier existante de `roadmapV3.ts` / contexte d'accès). Tant que la distinction d'offre n'est pas branchée côté compte, on expose un sélecteur d'aperçu pour l'admin (parcours 197 / 497) en s'appuyant sur `useV3Mode`.
- Le 197€ ne voit que ses 22 étapes ; le 497€ voit les 32. La numérotation, la progression (localStorage) et le compteur de chapitres sont recalculés sur le parcours filtré.
- Bandeau en tête indiquant clairement « Parcours Essentiel — 22 agents » ou « Parcours Pro — 32 agents » avec, sur le 197€, un encart « Passez au Pack Tout Complet 497€ pour débloquer 10 agents avancés ».

---

## 2. Export complet façon v2 + infos KDP

On remplace les 2 boutons PDF/DOCX A4 par un **bloc d'export riche** réutilisant le moteur de `EbookAdvancedExport.tsx`.

### Formats proposés (6, comme v2)
DOCX KDP Pro · EPUB 3 · PDF Impression (KDP) · PDF Digital · TXT · HTML.

### Choix de gabarit (trim size) KDP
Sélecteur de format de livre, par défaut **6×9 po (15,24 × 22,86 cm)**, avec les principaux gabarits KDP : 5×8, 5,25×8, 5,5×8,5, 6×9, 7×10, 8,5×11. Le format choisi pilote les dimensions de page du PDF Impression et du DOCX.

### Marges & options
Marges intérieures (reliure) vs extérieures auto-calculées selon le nombre de pages (règle KDP), choix simple/standard/large, justification, interligne — réutilise `ebookExportOptions.ts` (presets typo déjà présents).

### Panneau d'infos KDP (nouveau)
Encart pédagogique repliable affichant :
- Tableau des **gabarits** courants (po + cm).
- **Marges KDP** : extérieures min. 6,4 mm (0,25"), intérieures selon pagination (jusqu'à 0,875" pour gros volumes).
- **Fonds perdus (bleed)** : +3,2 mm pour les images pleine page de la couverture / intérieur illustré.
- **DPI images** : 300 DPI mini pour l'impression, format conseillé.
- **Couverture** : rappel calcul du dos (épaisseur × nb pages) → renvoi vers le module `cover-pdf-exact`.

### Branchement technique
Le manuscrit (`results['p20-chat-manuscript']`) est parsé en chapitres puis transmis au moteur d'export. Le bloc reste « toujours visible » et s'active dès qu'un manuscrit existe (≥ 50 caractères). Conserve titre/sous-titre/auteur du `brief`.

---

## Détails techniques
- **Fichiers modifiés** :
  - `src/components/admin/V3Workflow30.tsx` : champ `tier` sur les steps, filtrage par offre, bandeau d'offre, sélecteur d'aperçu admin, remplacement du bloc export.
  - `src/data/roadmapV3.ts` : ajout de l'entrée module `audiobook-express` si absente + repérage core/premium si utile.
- **Nouveaux fichiers** :
  - `src/components/admin/V3ExportPanel.tsx` : bloc export 6 formats + sélecteur gabarit/marges + panneau infos KDP (extrait/adapté de `EbookAdvancedExport.tsx`).
- **Réutilisé** : `ebookExportOptions.ts`, moteur d'export de `EbookAdvancedExport.tsx`, `manuscriptParser.ts`.
- Progression et compteur de chapitres recalculés sur le tableau d'étapes filtré (évite les écarts de numérotation).
- Aucune modification de base de données.

## Hors périmètre
- Pas de branchement paiement/upgrade réel dans ce lot (le CTA 497€ pointe vers le tunnel existant `PricingLadder497`).
- Génération audio = on relie le nouvel agent au workflow audio existant, sans nouveau moteur TTS.

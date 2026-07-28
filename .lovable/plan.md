
# Refonte Cover Studio Pro V3 — Éditeur Pro type Canva

## Objectif

Transformer Cover Studio Pro V3 en un véritable studio de couvertures professionnelles avec :
- Éditeur visuel multi-calques (Polotno SDK)
- Templates KDP par catégorie (romance, thriller, kids, non-fiction, business…)
- 4 formats natifs : ebook Kindle, wrap broché KDP, carré Kids 21,59 cm, hardcover
- Génération IA + retouche manuelle
- Export PDF print-ready avec bleed 3 mm et PNG haute résolution

## Point de vigilance — Licence Polotno

Polotno SDK est un produit **commercial payant** (à partir de ~200 $/an pour la version React SDK).  
Avant d'installer, il faut :
1. Souscrire un plan sur polotno.com
2. Récupérer la clé API (`REACT_APP_POLOTNO_KEY`)
3. La stocker via `add_secret` en tant que `POLOTNO_API_KEY`

**Si tu n'as pas encore de licence**, on peut :
- Démarrer avec le mode gratuit limité (watermark + fonctionnalités bridées) le temps d'itérer
- Ou basculer sur **Fabric.js** (open source, gratuit) — je peux construire l'éditeur avec calques, templates, export PDF/PNG sans licence

Je te demande de trancher ce point avant de coder.

## Architecture cible

```text
/v3/cover-studio-pro         → Hub (choix format + template)
  ├─ /ebook                  → Éditeur front-only 1600×2560
  ├─ /broche                 → Éditeur wrap 3 zones (dos|tranche|front)
  ├─ /kids                   → Éditeur carré 21,59×21,59 cm
  └─ /hardcover              → Éditeur grand format + jaquette
```

Nouvelle structure de fichiers :
```text
src/pages/v3/cover-studio-pro/
  CoverStudioProHubPage.tsx        (choix format + templates)
  CoverEditorPage.tsx              (éditeur Polotno unifié)
  hooks/useCoverProject.ts         (persistance cloud)
  templates/                       (JSON Polotno par catégorie)
src/components/cover-studio-pro/
  FormatSelector.tsx
  TemplateGallery.tsx
  AIAssistPanel.tsx                (génération image IA intégrée)
  ExportBar.tsx                    (PDF bleed + PNG)
  SpineCalculator.tsx              (calcul auto tranche broché)
supabase/functions/
  cover-templates/                 (sert les templates KDP)
  cover-ai-generate/               (génère image de fond via AI Gateway)
```

## Étapes d'implémentation

### Phase 1 — Fondations (jour 1)
1. Décision licence Polotno / fallback Fabric.js
2. Installer le SDK, configurer la clé
3. Créer `CoverStudioProHubPage` avec sélecteur 4 formats
4. Refactor des routes existantes de Cover Studio → redirection vers nouveau hub

### Phase 2 — Éditeur unifié (jour 2)
5. Composant `CoverEditorPage` embarquant Polotno
6. Presets format (dimensions, DPI 300, bleed 3 mm) :
   - Ebook Kindle : 1600×2560 px
   - Broché : wrap calculé (front + tranche + dos + bleed)
   - Kids carré : 21,59×21,59 cm @ 300 DPI
   - Hardcover : 6×9″ ou personnalisé
7. Calculateur de tranche automatique (nb pages × 0,0025″ pour papier blanc KDP)

### Phase 3 — Templates & IA (jour 3)
8. Bibliothèque de ~20 templates JSON par catégorie (romance, thriller, jeunesse, business, biographie, dev perso, cuisine, SF/fantasy)
9. Panneau `AIAssistPanel` : génération d'illustration de fond via AI Gateway (`google/gemini-3.1-flash-image`, streaming)
10. Import direct des couvertures déjà générées dans les modules Kids Book et livres V3

### Phase 4 — Persistance & export (jour 4)
11. Table `cover_projects` (id, user_id, format, polotno_json, thumbnail_url, created_at) avec RLS + GRANTs
12. Auto-save toutes les 30 s + bouton "Enregistrer" explicite
13. Bouton "Mes couvertures" listant les projets
14. Export :
    - PNG haute résolution (300 DPI)
    - PDF print-ready avec bleed et repères de coupe (via `jspdf` + rendu Polotno)
    - Export séparé front / dos / tranche pour KDP

### Phase 5 — Intégration V3 (jour 5)
15. Bouton "Ouvrir dans Cover Studio Pro" depuis chaque projet livre
16. Sidebar V3 : mettre à jour l'entrée Cover Studio avec badge "PRO"
17. Retirer les anciennes pages Cover Studio V2/V3 obsolètes (audit + suppression sûre)
18. Tests Playwright sur les 4 formats

## Aspects techniques

- **Polotno SDK** : `polotno`, `polotno/store`, `polotno/canvas/workspace` — API React
- **Bleed & repères** : Polotno gère nativement le bleed via `store.setSize(w, h, unit: 'mm')`
- **Export PDF** : `store.saveAsPDF({ dpi: 300, includeBleed: true })`
- **Sécurité** : clé Polotno côté client acceptable (public key), mais template privé stocké côté backend
- **AI Gateway** : réutilisation du pattern streaming déjà en place pour la génération d'images de fond
- **Fonts** : intégration Google Fonts + polices premium (Cormorant, Playfair, Bebas Neue) via Polotno

## Points hors périmètre (à confirmer)

- Marketplace de templates payants (v2)
- Collaboration temps réel multi-utilisateurs (v2)
- Génération de mockup 3D (rendu livre en perspective) — à ajouter en Phase 6 si tu veux
- OCR de couverture concurrente pour analyse — hors sujet

## Décisions à confirmer avant de coder

1. **Licence Polotno** : tu souscris, ou on part sur Fabric.js gratuit ?
2. **Import automatique** des couvertures Kids Book existantes vers le nouveau studio : oui/non ?
3. **Suppression des anciennes pages Cover Studio V3** (celles remplacées) : je liste avant de supprimer, ou tu me fais confiance ?

# V3 — EBOOK ANTI-PLAGIAT + nouvelles idées

## Objectif
Ajouter une nouvelle brique « Ebook Anti-Plagiat » : un ensemble d'outils pour protéger l'auteur contre le plagiat (avant et après publication), plus un PDF téléchargeable à mettre à disposition dans le cockpit. Tout le contenu est rédigé en original (aucun copier-coller du texte source de la formation), seules les idées sont reprises.

## Ce qui sera construit

### 1. Nouveau module cockpit `ebook-anti-plagiat` (pilier Publier)
Un outil unique, ouvert dans le dialog du cockpit comme les autres modules, organisé en 4 onglets :

```
EBOOK ANTI-PLAGIAT
├── 1. Protéger AVANT publication
│     • Générateur de page Copyright renforcée (clause non-fiction + déni de
│       responsabilité financière), multi-langue, prête à coller.
│     • Mini-guide « marquage & traçage » : conseils watermark texte/phrases-pièges.
├── 2. Surveiller (monitoring)
│     • Générateur de requêtes Google Alerts (titre + phrases uniques extraites
│       du manuscrit) avec lien direct vers google.com/alerts.
│     • Checklist hebdomadaire interactive (cochable) du mini-audit 10 min.
├── 3. Réagir en cas de plagiat
│     • Générateur d'email DMCA / retrait à Amazon KDP (champs : titre, date,
│       pseudo, titre copié, lien) → texte prêt à copier.
│     • Checklist des preuves d'antériorité (cochable).
│     • Liens utiles (contact KDP, dépôt légal).
└── 4. Pack de défense (PDF)
      • Bouton « Télécharger le PDF » (voir point 3).
```

Le contenu textuel (clauses, email, checklists) sera **réécrit en formulation originale**.

### 2. Inscription dans la roadmap V3
Ajouter dans `src/data/roadmapV3.ts` une nouvelle entrée module :
`{ id: 'ebook-anti-plagiat', pillar: 'publier', status: 'done', title: 'Ebook Anti-Plagiat — Protection & Défense', description: '...' }`

### 3. PDF téléchargeable (pack de défense)
Générer un PDF propre et professionnel (charte KDP : fond clair, accent teal #008296, texte #232F3E) contenant :
- Page de garde
- Modèle de page Copyright (FR) à insérer dans l'ebook
- Modèle d'email de signalement à Amazon KDP (avec champs à compléter)
- Checklist des preuves d'antériorité
- Routine hebdomadaire de surveillance (10 min)
- Liens utiles (Google Alerts, contact KDP)

Le PDF sera livré comme **artefact téléchargeable** et placé dans `public/` pour être servi par le bouton du module.

### 4. Autres idées V3 proposées (à valider — non construites dans ce plan)
- **Coffre-fort de preuves horodatées** : génère un PDF horodaté du manuscrit + hash SHA-256 comme preuve d'antériorité.
- **Détecteur de similarité** : compare deux textes (le tien vs un suspect) et calcule un % de chevauchement.
- **Générateur de dépôt légal** : fiche pré-remplie pour BNF / équivalents internationaux.

## Détails techniques
- **Nouveau composant** `src/components/admin/EbookAntiPlagiat.tsx` (4 onglets via `Tabs` shadcn), réutilisant les patterns existants (Card, Textarea, Button teal, toast, copie presse-papier). Les générateurs Copyright / email sont **déterministes** (pas d'appel IA nécessaire) ; les extractions de phrases uniques peuvent réutiliser `callAIWriting` si souhaité.
- **Câblage cockpit** dans `src/pages/AdminCockpitPage.tsx` : ajouter l'import, l'id `ebook-anti-plagiat` dans la liste `clickable`, dans la liste des dialogs `max-w-6xl`, et une branche de rendu `selectedModule.id === 'ebook-anti-plagiat'`.
- **PDF** généré via script Python (reportlab) écrit dans `/mnt/documents/` pour livraison, puis copié dans `public/pack-anti-plagiat.pdf` pour le bouton de téléchargement. QA visuelle obligatoire (conversion en images + inspection de chaque page).
- Aucun changement de schéma backend requis.

## Hors périmètre
- Surveillance automatique réelle du web (Google Alerts reste manuel côté utilisateur).
- Dépôt légal automatisé auprès d'organismes officiels.

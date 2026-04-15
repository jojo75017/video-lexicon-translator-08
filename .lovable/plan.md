

# Plan — Nettoyage profond de l'export DOCX + Onglet Audit

## Problème

Le nettoyeur actuel ne capture pas tous les artefacts JSON de l'IA. Le titre du chapitre 1 peut contenir le JSON brut entier de la réponse IA, et des fragments JSON persistent dans le corps du texte. De plus, aucun contrôle qualité n'existe avant l'export.

## Corrections

### 1. Fonction `cleanChapterTitle()` dans `docxExportEngine.ts`

Nouvelle fonction appliquée sur **chaque titre** de chapitre/sous-chapitre avant insertion :
- Si le titre fait plus de 200 caractères → c'est du JSON : extraire le premier segment court (chercher `titre Principal :` ou couper à la première phrase)
- Supprimer les clés JSON (`« préface » :`, `« chapitres Liste » :`, etc.)
- Tronquer à 120 caractères max
- Appliquer sur les lignes 506, 513, 565, 582, 602 (partout où `editorialClean(chapter.title)` ou `editorialClean(sub.title)` est utilisé)

### 2. Renforcer `preCleanJSON()` dans `docxExportEngine.ts`

Ajouter les patterns manquants :
- `« introduction » :`, `« elements » : [`, `« texte Integral :`
- Structures de listes JSON `[ « item1 », « item2 » ]`
- Blocs `{ "clé" : "valeur" }` imbriqués dans du texte narratif
- Guillemets français mixtes avec espaces variables

### 3. Renforcer `cleanGeneratedText()` dans `textCleaner.ts`

- Ajouter `introduction`, `elements`, `texte_integral`, `texte Integral` aux regex de clés JSON (ligne 33)
- Capturer les listes JSON françaises `[ « item1 », « item2 » ]`
- Supprimer les blocs terminaux `, « personnages » : [ {`

### 4. Filtrer les chapitres vides dans `generateProfessionalDocx()`

Dans la boucle `chapters.forEach` (ligne 554), ignorer les chapitres dont :
- Le titre est juste "Chapitre N" sans contenu ET sans sous-chapitres ayant du contenu

### 5. Nouveau service `src/utils/docxAuditService.ts`

Service d'audit pré-export qui analyse le contenu et retourne un rapport :

**Contrôles :**
- JSON résiduel (clés `« ... » :`, crochets, accolades)
- Titres trop longs (> 150 caractères)
- Chapitres vides
- Mots collés après ponctuation
- Artefacts markdown résiduels (`#`, `**`, `` ``` ``)

**Format retour :**
```text
{ score: 0-100, status: 'conforme'|'problèmes'|'critique', 
  issues: [{type, severity, chapter, message}], canExport: boolean }
```

### 6. Onglet Audit dans `EbookExportPreview.tsx`

- Lancer l'audit automatiquement à l'ouverture
- Afficher un bandeau vert/orange/rouge avec le score
- Lister les problèmes avec localisation (chapitre concerné)
- Bloquer l'export si statut "critique"
- Bouton "Nettoyer automatiquement" qui applique les corrections et relance l'audit

## Fichiers modifiés
- `src/utils/textCleaner.ts` — regex JSON renforcées
- `src/utils/docxExportEngine.ts` — `cleanChapterTitle()`, `preCleanJSON()` renforcé, filtre chapitres vides
- Nouveau : `src/utils/docxAuditService.ts` — service d'audit
- `src/components/ebook/EbookExportPreview.tsx` — bandeau d'audit + bouton nettoyage


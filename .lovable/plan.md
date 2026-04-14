

# Plan de correction — Export DOCX propre (sans JSON ni formatage cassé)

## Problème identifié

Le document exporté contient des **artefacts JSON bruts** dans le texte. L'IA génère du contenu structuré en JSON, et le nettoyeur actuel ne capture pas tous les patterns. Exemples visibles dans votre fichier :

- `« jsonpage De Titre » : titre Principal : Maîtriser l'IA...`
- `« préface » : Préface : Le manifeste...`
- `« table Des Matieres » : Table des Matières...`
- `« texte Integral : Le silence...`
- `« elements » : [ « Comprendre l'érosion...`
- `« personnages » : [ {`

Le contenu est aussi parfois **trop gros et en gras** car des fragments JSON sont interprétés comme des titres par le moteur d'export.

## Corrections à appliquer

### 1. Renforcer le nettoyeur JSON dans `textCleaner.ts`

Ajouter des regex ciblant les patterns JSON français qui fuient dans le texte :
- `« clé_json »` suivi de `:` — supprimer la clé, garder la valeur
- Blocs JSON complets `{ "page_de_titre": ..., "préface": ... }` — extraire uniquement le texte narratif
- Patterns `« chapitres Liste » : [`, `« texte Integral :`, `« elements » : [`  — supprimer
- Crochets/accolades orphelins `}, ]` en fin de paragraphe
- Nettoyage des guillemets français autour de clés JSON (`« introduction »` → supprimer)

### 2. Ajouter un nettoyage pré-typographie dans `docxExportEngine.ts`

Dans la fonction `editorialClean`, ajouter une passe de nettoyage JSON **avant** l'appel à `cleanGeneratedText` pour intercepter les structures JSON brutes avant qu'elles ne soient partiellement transformées par la typographie française.

### 3. Corriger le formatage excessif

- S'assurer que les fragments JSON ne sont pas interprétés comme des headings (lignes courtes = titres)
- Ajouter un filtre dans `buildContentParagraphs` pour ignorer les lignes qui ressemblent à des clés JSON

## Fichiers modifiés
- `src/utils/textCleaner.ts` — regex JSON renforcées
- `src/utils/docxExportEngine.ts` — nettoyage pré-typographie + filtre headings


# Livres corrigés : enregistrement automatique et mode d'emploi

## Pourquoi la page est vide

Vérifié en base : aucun projet n'a le type « corrected ». « Noces de Vendetta » existe bien dans **Mes livres** (type ebook), mais aucune correction n'a jamais été enregistrée dans la bibliothèque « Livres corrigés » : l'enregistrement n'a lieu que si on clique manuellement sur **« Enregistrer dans Livres corrigés »** en bas de la page de correction, après l'import. Rien ne l'explique à l'écran, donc l'étape est systématiquement ratée.

## Ce qu'on met en place

### 1. Enregistrement automatique
- Dès que la correction d'un livre est terminée, le manuscrit corrigé est enregistré tout seul dans **Livres corrigés** (le bouton reste, pour forcer une mise à jour).
- Un bandeau de confirmation apparaît : « Livre enregistré dans Livres corrigés » avec un lien direct vers la page.
- Si des passages latins restent signalés, l'enregistrement se fait quand même mais le bandeau prévient des chapitres à revoir (aujourd'hui l'enregistrement est bloqué, ce qui fait perdre le travail).

### 2. Corriger un livre déjà présent dans « Mes livres »
- Nouveau bouton **« Corriger ce livre »** sur chaque livre de **Mes livres** : il envoie le manuscrit directement dans le correcteur, sans réimport de fichier.
- C'est le chemin pour corriger « Noces de Vendetta » en un clic.

### 3. Explications visibles (le point manquant)
- En haut de la page de correction : un encart **« Comment ça marche »** en 3 étapes — 1) importez le manuscrit ou choisissez un livre existant, 2) cliquez sur **Corriger tout le livre**, 3) le livre corrigé est enregistré et exportable en Word / PDF.
- Sur la page **Livres corrigés** vide : message explicite avec le bouton « Corriger un livre » et le rappel qu'un livre apparaît ici après une correction complète.

## Détails techniques

- `src/pages/v3public/V3CorrecteurPage.tsx` : appel de `saveCorrectedBook()` automatiquement à la fin de la boucle de correction (une seule fois, garde anti-doublon via `cloudProjectId`) ; blocage latin transformé en avertissement ; encart d'aide dans l'en-tête ; prise en charge d'un `?projectId=` pour charger les chapitres depuis `ebook_projects` et construire le `Manuscript`.
- `src/pages/v3public/V3BookManagerPage.tsx` : bouton « Corriger ce livre » → `/v3/corriger?projectId=<id>` ; état vide enrichi sur `/v3/livres-corriges`.
- Aucune modification de schéma : on continue d'utiliser `ebook_projects.project_type = 'corrected'`.

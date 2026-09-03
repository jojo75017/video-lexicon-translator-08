# Audit Cover Studio Pro — du prototype à l'outil vendable 67 €

Vous avez raison : dans l'état actuel, la composition est amateur. L'audit ci-dessous répond aux 12 points demandés, sans aucune modification de code, de base, de paiement ni de fonction sécurisée.

## Constat vérifié

Le modèle de composition actuel (`frontComposition.ts`, version 1) ne contient que : position, largeur, police, taille, couleur, alignement, gras, italique, interligne. Il **n'a pas** de champ pour ombre, contour, voile, opacité, bandeau, verrouillage, ni ordre de calques. Aucun fichier de modèles professionnels n'existe (recherche « template » dans `src/lib/cover-editor/` et `src/components/cover-editor/` : zéro résultat). Aucun export n'est branché sur le nouvel éditeur. C'est la cause exacte du rendu amateur : il n'y a pas de règles typographiques, seulement des champs libres.

## Réponses aux 12 points d'audit

**1. Tables et champs des livres EbookStudio**

Deux systèmes coexistent réellement :

- `ebook_projects` (45 lignes) — **la table réellement utilisée par le parcours V3**. Champs utiles pour une couverture : `title`, `author_name`, `book_summary`, `chapters`, `cover_concepts`, `ebook_images`, `kdp_description`, `kdp_keywords`, `kdp_categories`, `target_audience`, `tone`, `writing_style`, `back_cover_data`. Versionnée par `ebook_project_versions`.
- `book_projects` (1 ligne) — parcours Studio Pro hybride, avec `title`, `subtitle`, `genre`, `target_audience`, `tone`, `era`, `places`, `main_characters`. Contenu dans `book_chapters`, `book_chapter_versions`, `book_bibles`.
- `cover_projects` (3 lignes) — cible des couvertures. **Aucune colonne ne relie aujourd'hui une couverture à un livre.**

Conséquence : le sélecteur « choisir un livre » doit lire `ebook_projects` en priorité, et `book_projects` en second.

**2. Routes et composants du parcours de rédaction**

- `src/components/v3public/V3CreateWizard.tsx` — le wizard complet ; il lit et écrit `ebook_projects` (lignes 466, 1014, 1029) et `ebook_project_versions` (487).
- Routes couverture existantes dans `App.tsx` : `/v3/mes-couvertures` (612), `/v3/mes-couvertures/:id` (613), `/v3/cover-pro` (615), `/admin/cover-pro` (616).

**3. Où se trouve l'option actuelle de génération de couverture**

Il n'y a pas de case à cocher : dans `V3CreateWizard.tsx`, la couverture est déclenchée **automatiquement** à la fin du livre (`coverTriggeredRef`, ligne 303) via l'ancienne fonction `generate-front-cover` (ligne 280), et le résultat est stocké en URL dans `ebook_projects.ebook_images` / `cover_concepts` (984, 990). Le libellé visible dit déjà « Générée automatiquement après la fin du livre » (1540). Ce chemin est totalement déconnecté de `cover_projects`.

**4. Fichiers à modifier pour relier un livre à `cover_projects`**

- migration : ajouter `source_kind`, `source_book_id`, `brief` (jsonb) à `cover_projects` ;
- `src/lib/coverProjects.ts` : création d'un projet depuis un livre ;
- `src/components/v3public/V3CreateWizard.tsx` : remplacer l'appel `generate-front-cover` par la création d'un projet `cover_projects` + redirection ;
- `src/pages/v3/mes-couvertures/MesCouverturesPage.tsx` : les 3 sources à la création.

L'ancien `/v3/cover-studio-pro` n'est pas touché.

**5. Extraction PDF et DOCX**

Tout existe déjà côté client, aucune nouvelle dépendance : `pdfjs-dist` via `src/lib/import/importFromPdf.ts` (`extractTextFromPdf`) et `mammoth` via `src/lib/bookperfect/importManuscript.ts` (ligne 75). L'extraction se fait dans le navigateur : le fichier n'est jamais téléversé, donc aucun document n'est stockable ni accessible par un autre compte, et il n'y a pas de fichier temporaire à supprimer. Seul un extrait de texte (début + table des matières, plafonné) partirait à l'analyse.

**6. Modèle IA d'analyse et coût**

`google/gemini-3.6-flash` par la passerelle Lovable pour produire le brief JSON (analyse de texte uniquement, pas d'image). Entrée plafonnée à ~8 000 caractères, sortie ~800 tokens : coût par livre négligeable, de l'ordre du millième d'euro. La génération d'image reste sur le circuit sécurisé existant `cover-pro-generate` (OpenAI `gpt-image-2`, crédits `cover_pro_credits`, BYOK au-delà) — inchangé.

**7. Modèles professionnels**

Nouveau fichier `src/lib/cover-editor/coverTemplates.ts` : 6 modèles (Roman, Thriller, Romance, Développement personnel, Guide pratique, Livre jeunesse), chacun décrivant zones en pourcentage, hiérarchie de tailles, marges de sécurité, interligne, espacement, ombre/contour, voile, et 3 variantes de couleurs. Cela impose d'étendre le modèle de composition en **version 2** avec les champs manquants (ombre, contour, opacité, voile, verrouillage, ordre) et une migration v1→v2 non destructive, comme celle déjà faite pour le wrap. Un ajustement automatique de la taille du titre selon sa longueur, borné par le modèle, supprime le titre mal dimensionné.

**8. JPEG Kindle compressé**

Rendu sur un `<canvas>` hors écran aux dimensions réelles 1600 × 2560, illustration + calques redessinés sans aucun élément d'interface, puis `canvas.toBlob('image/jpeg', q)` avec baisse progressive de la qualité jusqu'à passer sous 5 Mo. Aucune bibliothèque nouvelle.

**9. PDF KDP broché (étape ultérieure)**

`jspdf` est déjà installé et `src/lib/kdpCoverPdf.ts` génère déjà un wrap une page en pouces à 300 DPI avec fond perdu. Il sera réutilisé en le branchant sur la géométrie déjà validée de `kdpPaperbackSpecs.ts`, textes aplatis dans l'image pour éviter tout problème de polices.

**10. Migrations nécessaires**

Une seule, additive : `cover_projects` reçoit `source_kind` (text), `source_book_id` (uuid), `template_id` (text), `brief` (jsonb). Aucune colonne supprimée, RLS et grants existants inchangés.

**11. Risques de régression**

- Passage composition v1 → v2 : les 3 projets existants doivent continuer à s'ouvrir (migration au parsing, comme le wrap).
- Le wizard : couper l'ancien déclenchement automatique peut priver les livres de leur image actuelle ; on conserve la valeur `ebook_images` existante.
- Crédits : aucun changement, le compteur reste sur `cover-pro-generate` (vos 3 inclus sont déjà consommés — il faudra soit recréditer pour tester, soit l'écran de clé OpenAI perso, qui n'existe pas encore).
- Ne pas dupliquer un second système de couverture : les anciens modules restent en place mais ne sont pas branchés au nouvel éditeur.

**12. Découpage en étapes testables**

- **A** — Modèles professionnels : composition v2 + 6 modèles + auto-taille du titre + contraste. Test : ouvrir un projet existant, appliquer chaque modèle, vérifier lisibilité et aucune régression.
- **B** — Export JPEG Kindle : bouton « Télécharger la couverture Kindle ». Test : fichier 1600 × 2560, sous 5 Mo, sans repères.
- **C** — Interface pro : barre supérieure Enregistrer / Aperçu / Exporter, colonne gauche Contenu · Image · Modèles · Calques, canevas central, colonne droite propriétés.
- **D** — Les 3 sources + brief IA modifiable (livre EbookStudio, import PDF/DOCX, résumé manuel) + migration.
- **E** — Liaison avec la rédaction : le wizard crée un projet `cover_projects` et ouvre le nouvel éditeur.
- **F** — Outils avancés : ombre, contour, opacité, bandeau, verrouillage, ordre des calques, aperçu sans repères.
- **G** — PDF KDP broché 300 DPI.

## Note

`roadmap.md` n'est pas modifié dans ce mode ; l'étape A y sera ajoutée dès la validation.

## Question ouverte

Je commence par l'étape A (modèles professionnels, ce qui corrige directement l'aspect amateur), ou vous préférez que je démarre par l'export JPEG Kindle ?

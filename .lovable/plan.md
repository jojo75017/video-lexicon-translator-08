# Réparer l'export Word / PDF : chapitres sans texte et titres génériques

## Ce qui se passe réellement

Vérifié en base et dans le code :

1. **Le texte existe bien.** Exemple « Noces de Vendetta » : 40 chapitres, 10 000 à 17 000 caractères chacun. « La Dernière Chambre » : 25 chapitres pleins + 1 chapitre fantôme vide en 26e position (alors que l'auteur en a demandé 25).
2. **L'export casse le manuscrit en route.** Depuis « Mes livres », les chapitres structurés sont d'abord aplatis en un seul long texte, puis re-découpés par un détecteur de titres beaucoup trop large : **toute ligne du récit qui commence par « Chapitre », « Partie » ou « Section » crée un faux chapitre**. Résultat : le sommaire explose (40 demandés → 80 affichés), le texte est arraché aux vrais chapitres, et le plafond de sécurité (40) coupe la fin. D'où des chapitres vides après le chapitre 1.
3. **Les titres sont perdus à la génération.** En base, seul le chapitre 1 porte un vrai titre (« L'Ombre du Sang ») ; les chapitres 2 à 40 sont enregistrés comme « Chapitre 2 », « Chapitre 3 »… alors que le sommaire validé par l'auteur contenait de vrais titres. Le sommaire validé n'est pas recopié dans le manuscrit sauvegardé.

## Ce qui sera corrigé

### 1. Export : plus de passage par du texte à plat
- « Mes livres » transmettra directement les chapitres structurés (titre + contenu) et le nombre de chapitres demandé au panneau d'export, au lieu d'un texte reconstruit.
- Le panneau d'export accepte désormais soit des chapitres structurés, soit du texte collé (import manuel), et n'applique le découpage automatique que dans le second cas.
- Le découpage automatique est resserré : un titre doit être un vrai titre (ligne courte de type `# Titre` ou « Chapitre 12 – … »), plus une simple phrase du récit commençant par « Chapitre ».
- Les chapitres vides en fin de liste (comme le 26e de « La Dernière Chambre ») sont écartés au lieu de polluer le sommaire.

### 2. Titres réels conservés partout
- À la sauvegarde du manuscrit, chaque chapitre reçoit le titre du sommaire validé par l'auteur (normalisation unique déjà en place, en utilisant l'option « sommaire »).
- L'export utilise ce titre pour le sommaire, les têtes de chapitre Word et les signets PDF ; si un titre reste absent, on affiche « Chapitre N » sans jamais inventer un titre à partir du corps du texte.
- Les livres déjà générés seront réparables : à l'ouverture d'un livre existant, si les titres sont génériques mais que le sommaire sauvegardé contient les vrais titres, ils sont réappliqués puis enregistrés.

### 3. Vérification avant livraison
- Génération d'un DOCX de test à partir du manuscrit réel de « Noces de Vendetta » (40 chapitres) : contrôle que le sommaire contient exactement 40 entrées, avec titres réels, et que chaque chapitre contient son texte.
- Même contrôle sur le PDF (conversion en images et inspection visuelle du sommaire et de 3 chapitres au hasard).

## Détails techniques

- `src/components/admin/V3ExportPanel.tsx` : nouvelle prop `chapters?: DocxChapter[]` + `expectedChapterCount?`, utilisée en priorité ; `manuscriptToChapters` durci (heading = `^#{1,3}\s` ou `^(chapitre|partie|section)\s+\d+` sur une ligne ≤ 90 caractères, hors ponctuation de phrase).
- `src/pages/v3public/V3BookManagerPage.tsx` : passage des chapitres structurés via `normalizeManuscript(book.chapters, { expectedCount: number_of_chapters, bookTitle: title })` ; suppression du round-trip markdown `exportManuscript`.
- `src/components/v3public/V3CreateWizard.tsx` : au moment de la sauvegarde des chapitres, appel de `normalizeManuscript(..., { outline: normalizedOutline })` pour injecter les titres validés ; même traitement à la restauration d'un projet existant.
- `src/utils/docxExportEngine.ts` : suppression du filtre anti-doublon par signature de contenu (redondant avec la normalisation par numéro et risqué sur les chapitres courts) ; le plafond `expectedChapterCount` reste.
- Ajout de cas de test dans `src/utils/docxExportEngine.test.ts` : ligne de récit commençant par « Chapitre », 40 chapitres pleins → 40 entrées de sommaire, chapitre vide final ignoré.

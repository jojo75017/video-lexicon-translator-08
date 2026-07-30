## Constat (vérifié)

- « Écrire un livre » (barre latérale + accueil) pointe sur `/v3/create`, qui rend l'ancienne page : 2 grosses cartes de mode, panneau « Clés API », puis le wizard — sans la fiche du livre ni le sommaire validés sur l'accueil.
- La fiche complète (titre, sous-titre, auteur, catégorie, ton, chapitres, synopsis, Cible & Promesse, sommaire, personnages) existe déjà dans `V3BriefRecap.tsx` sur l'accueil.
- L'auto-remplissage IA « Cible & Promesse » existe déjà **deux fois** dans `V3CreateWizard.tsx` (lignes ~1363 et ~1733) et les 8 champs (profil, niveau, besoins, frustrations, promesse centrale, bénéfices, différenciation, émotion) sont saisis à la main dans la fiche.
- Le voile vert du hero d'accueil est très opaque (0,82 → 0,90) : image sombre et 1re ligne du titre peu lisible.

## Ce que je fais

### 1. `/v3/create` devient la vraie page « Écrire un livre »
Une seule page, dans l'ordre :
1. **Fiche du livre** — titre, sous-titre, auteur, catégorie KDP, ton, chapitres, mots/chapitre, synopsis (pré-remplie avec ce qui a déjà été saisi).
2. **Cible & Promesse — 100 % IA** : plus aucun champ à remplir à la main. Un seul bouton « Générer Cible & Promesse avec l'IA » (à partir du titre + synopsis + catégorie), résultat affiché en lecture dans une carte récapitulative (profil, besoins, frustrations, promesse centrale, bénéfices, différenciation, émotion), avec « Régénérer ». Les doublons du wizard sont supprimés : ce bouton n'existe plus qu'à un seul endroit.
3. **Sommaire** — bloc dédié et visible : génération IA, import du « Sommaire Ultime », collage manuel (texte / markdown / JSON), liste numérotée éditable, et bouton **« Valider le sommaire »** qui verrouille la table des matières utilisée par le workflow (badge « Sommaire validé — N chapitres »).
4. **Lancer le workflow** — actif uniquement si titre + auteur + synopsis + Cible & Promesse générées + sommaire validé. Sinon, liste claire de ce qui manque.
5. Les modes spéciaux (album maternelle, histoires du soir 3-7 ans) deviennent deux liens discrets en haut ; les gros pavés redondants disparaissent. Le panneau « Clés API » est replié par défaut.

### 2. Accueil : plus de formulaire en double
Sur `/v3`, la fiche devient un **récapitulatif en lecture** (titre, catégorie, promesse centrale, état du sommaire) avec « Continuer mon livre » vers `/v3/create`. Toute la saisie se fait au même endroit que le workflow.

### 3. Hero lisible
- Voile allégé (≈0,55 / 0,35 / 0,75) pour que l'image d'atelier ressorte.
- Titre : 1re ligne en blanc crème avec ombre douce, 2e ligne or ; léger halo sombre derrière le bloc texte pour garantir le contraste sans assombrir toute l'image.

## Détails techniques
- Extraction du formulaire en `V3BookBriefForm` (source unique sur `bookBrief`), consommé par `/v3/create`.
- Nouveau `V3TargetPromisePanel` : réutilise l'appel IA existant du wizard (`cibleProfil`…`promesseEmotion`), écrit dans `bookBrief`, affichage lecture seule + régénération. Suppression des deux blocs « Auto-remplir Cible & Promesse » du wizard.
- Nouveau `V3OutlinePanel` : lit/écrit `brief.outline` + `brief.outlineValidated`, réutilise la logique d'import texte/markdown/JSON et le pont « Sommaire Ultime ».
- `V3CreateWizard` démarre pré-alimenté par la fiche, la cible/promesse et le sommaire validé.
- Aucun changement de schéma, d'edge function ni de tarif.

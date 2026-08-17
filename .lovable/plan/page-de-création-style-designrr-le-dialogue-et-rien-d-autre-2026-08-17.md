# Page de création style Designrr : le dialogue et rien d'autre

## Ce qui se passe aujourd'hui

Sur `/v3/create`, sous la conversation avec Ebookstudio-Génie, la page affiche la **fiche complète du livre** (titre, sous-titre, auteur, catégorie, ton, chapitres, mots/chapitre, synopsis) parce que `V3BriefRecap` rouvre automatiquement le formulaire dès qu'un champ essentiel est vide. Résultat : on dialogue en haut, et en dessous on doit encore remplir un formulaire manuel. Ce n'est pas le parcours demandé.

## Ce qui sera construit

### 1. Une seule zone : la conversation
- La page de création devient une page conversationnelle : titre court, encart « Reprendre mon livre » si un livre est en cours, puis le fil de discussion et la zone de saisie (comme Designrr : « Parlez-moi de vous et de ce sur quoi vous aimeriez écrire »).
- Le formulaire manuel disparaît de la page. Il ne reste accessible que par un lien discret « Modifier la fiche à la main » (replié par défaut, jamais ouvert automatiquement).
- Sous la saisie : 3 exemples cliquables + « Importer un document » (Word/PDF), comme dans la référence.

### 2. Le sommaire à côté du dialogue, pas un formulaire
- Panneau « Votre sommaire en cours » : titre du livre, ton, nombre de chapitres, liste numérotée des chapitres — en lecture, mis à jour à chaque réponse du Génie.
- Bandeau des versions du sommaire (v1, v2, v3… avec date) et bouton « Revenir à cette version ».
- Ligne « ✏️ Modifié : … » sous chaque réponse pour voir exactement ce que le Génie a changé par rapport à ce que vous aviez dit.

### 3. Les boutons, tous au même endroit sous le dialogue
Une barre d'actions unique sous la conversation, dans cet ordre :
1. **Valider le sommaire** (ou « Régénérer le sommaire »)
2. **Commencer la rédaction** (lance le workflow)
3. **Enregistrer mon livre**
4. **Corriger mon livre**
5. **Voir mon livre**
6. **Données KDP**
7. **Traduire (10 langues)**
8. **Version audio (9,99 €)**

Les boutons qui ne servent pas encore (corriger, voir, KDP, audio) restent visibles mais désactivés avec une infobulle « disponible après la rédaction », pour que l'abonné voie tout de suite le chemin complet.

### 4. Reprise et relecture de l'échange
- L'encart « Reprendre mon livre » reste en haut : titre, étape en cours, nombre de chapitres, nombre de messages conservés, dernière activité, bouton « Reprendre où je m'étais arrêté ».
- Boutons du fil : « Copier la conversation », « Replier les anciens tours », « Repartir de zéro » (avec confirmation).
- Le fil et les versions de sommaire restent enregistrés côté serveur : reprise possible des semaines plus tard, depuis un autre appareil.

## Détails techniques

- `src/pages/v3public/V3CreatePage.tsx` : retirer `V3BriefRecap variant="full"` du flux principal ; nouvelle composition = `V3ResumeBookCard` → `V3GenieDialog` → `V3GenieOutlinePanel` (lecture) → `V3BookActionsBar`. Le formulaire manuel passe dans un `<details>` replié rendant `V3BriefRecap` uniquement à l'ouverture (prop `hideBookForm` conservée, plus d'auto-ouverture).
- `src/components/v3public/V3BriefRecap.tsx` : supprimer le déclenchement `essentialsMissing` qui force l'affichage du formulaire ; ajouter une prop `forceCollapsed` pour l'usage en `<details>`.
- Nouveau `src/components/v3public/V3GenieOutlinePanel.tsx` : affichage lecture du sommaire courant + sélecteur de versions (`loadOutlineVersions` / restauration via `writeBookBrief`), sans champs de saisie.
- Nouveau `src/components/v3public/V3BookActionsBar.tsx` : les 8 boutons, états activé/désactivé dérivés du `BookBrief` (`outline`, `outlineValidated`, `projectId`), liens vers `/v3/corriger`, `/v3/book/:id`, `/v3/upsells`, traduction, workflow.
- `V3GenieDialog.tsx` : conserver le fil et `describeBriefChanges` ; ajouter « Copier la conversation » et le repli des anciens tours ; la validation du sommaire reste gérée par le panneau, pas par le formulaire.
- Aucun changement de tarif, de quota ni de schéma base (les tables `book_conversations` et `book_outline_versions` existent déjà).

## Vérification avant livraison

- `/v3/create` avec un livre déjà commencé : aucun champ de formulaire visible, seulement conversation + sommaire + boutons.
- Trois messages d'affilée : le fil reste complet après rechargement, la ligne « Modifié » indique bien les changements.
- Restauration d'une version antérieure du sommaire, puis « Commencer la rédaction » : le workflow part avec les chapitres restaurés.

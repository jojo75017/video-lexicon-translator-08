# Le récit visible à côté, et un seul récit — pas trois

Deux problèmes réels sur `/v3/create`, corrigés ensemble.

## 1. « Je me retrouve avec 3 récits »

Aujourd'hui, à chaque message le Génie renvoie une réponse qui répète le titre **et tout le résumé du livre**. Après trois échanges, la conversation contient trois résumés presque identiques empilés. Pire : quand vous ajoutez une précision, l'application renvoie à l'IA l'ancien résumé + votre phrase collés bout à bout, donc le résumé grossit à chaque tour.

Nouveau fonctionnement :

- **Un seul récit, à un seul endroit** : le résumé du livre vit uniquement dans la fiche (colonne de droite / carte « Votre livre en direct »). Il est mis à jour, jamais recopié.
- Dans la conversation, le Génie répond **une ligne** : ce qu'il a changé (« Titre mis à jour · 20 chapitres ») + sa question. Plus de pavé répété.
- Une précision envoyée n'empile plus l'ancien texte : seule votre nouvelle phrase part à l'IA, avec la fiche en contexte.
- Un bouton « Voir le récit complet » sous la fiche, pour ceux qui veulent relire le résumé en entier.

## 2. Le récit écrit n'apparaît pas dans la colonne d'à côté

La colonne existe bien, mais elle n'est alimentée que toutes les 4 secondes, à partir d'un manuscrit reconstruit **complet** : si le livre n'est qu'à moitié écrit, rien ne s'affiche.

Nouveau fonctionnement :

- Dès qu'**un** chapitre est terminé, il apparaît dans la colonne, avec titre, nombre de mots et les premières lignes. Un clic déplie le texte.
- La colonne bascule **automatiquement** sur l'onglet « Déjà écrit » quand la rédaction démarre, et affiche en haut : « chapitre 4 sur 20 en cours · 6 200 mots ».
- Chaque chapitre écrit garde ses deux boutons : **Corriger ce chapitre** et **Réécrire**.
- L'onglet « Sommaire » reste accessible d'un clic, avec l'état écrit / en cours / à écrire.

## 3. Rendre l'écran évident

- La colonne de droite reçoit un titre clair : **« Votre livre en direct »** avec la barre de progression (chapitres écrits / total).
- Sur mobile, cette colonne remonte **au-dessus** du workflow au lieu de finir en bas de page.

## Détails techniques

- `src/components/v3public/V3GenieDialog.tsx` : la réponse assistant devient une ligne (`changes` + question), sans titre/description recopiés ; `refine()` n'envoie plus `description + précision` concaténés mais `{ precision, brief }`.
- `supabase/functions/v3-genie-brief/index.ts` : accepte `precision` + `brief` en contexte et renvoie un `reply` court ; la description retournée remplace la précédente au lieu de s'y ajouter.
- `src/components/v3public/V3CreateWizard.tsx` : appel de `publishWrittenChapters` à chaque chapitre terminé (callback de progression du workflow) au lieu du seul timer de 4 s, et publication d'un `activeIndex` pour l'état « en cours ».
- `src/lib/v3/writtenChapters.ts` : ajout d'un `activeIndex` / `total` dans le payload, seuil de contenu abaissé pour ne plus masquer les chapitres courts.
- `src/components/v3public/V3GenieOutlinePanel.tsx` : bascule auto sur l'onglet « Déjà écrit » à la première publication, compteur « chapitre X sur Y », bouton « Réécrire », lien « Voir le récit complet ».
- `src/pages/v3public/V3CreatePage.tsx` : `order` responsive pour remonter l'`aside` au-dessus du wizard sur mobile.
- Aucun changement de tarif, de quota ni de schéma base.

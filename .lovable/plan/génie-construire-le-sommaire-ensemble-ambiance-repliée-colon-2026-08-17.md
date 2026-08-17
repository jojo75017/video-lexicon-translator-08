# Génie : construire le sommaire ensemble, ambiance repliée, colonne toujours visible

Trois corrections sur `/v3/create`.

## 1. Le sommaire se construit ensemble, chapitre par chapitre

Aujourd'hui, dès le premier message le Génie renvoie une fiche complète et un sommaire tout fait : il ne fait que reformuler ce que vous avez écrit.

Nouveau fonctionnement :

- Le Génie ne produit **plus jamais** un sommaire complet d'un coup.
- Il propose **3 chapitres à la fois** (titre + une ligne d'objectif) et demande : « on garde ces trois-là ? »
- Sur chaque chapitre proposé, trois boutons : **Garder** · **Reformuler** · **Retirer**. Vous pouvez aussi réécrire un titre directement au clavier.
- Après validation d'un bloc, il propose les 3 suivants, en tenant compte des précédents (pas de doublons, progression logique), jusqu'au nombre de chapitres souhaité.
- À tout moment : « Ajouter un chapitre ici », « Fusionner avec le précédent », « Déplacer ». Le sommaire grandit sous vos yeux dans la colonne de droite.
- Boutons de conduite du dialogue : **Continuer** (3 suivants), **Réordonner le sommaire**, **Terminer le sommaire** (active la validation).
- Le sommaire n'est marqué validé que par votre clic sur « Valider le sommaire » — jamais par l'IA.

## 2. L'ambiance ne prend plus la place

- Le sélecteur d'ambiance devient un volet **replié par défaut** : une seule ligne « Ambiance : Ivoire & or — changer ». Ouvert au clic, refermé après le choix.
- Si vous n'y touchez jamais, l'ambiance par défaut s'applique et le bloc reste invisible dans le flux.

## 3. La colonne de droite reste affichée pendant l'écriture, avec le texte déjà écrit

- La colonne sommaire reste **collée à droite y compris quand le workflow de rédaction est ouvert** (aujourd'hui le workflow s'affiche en pleine largeur sous les deux colonnes et la colonne disparaît de l'écran).
- Elle passe en deux onglets :
  - **Sommaire** : les chapitres numérotés, l'état de chacun (à écrire / en cours / écrit), les versions restaurables.
  - **Déjà écrit** : au fur et à mesure de la rédaction, chaque chapitre terminé apparaît avec son titre, son nombre de mots et ses premières lignes ; un clic déplie le texte complet dans la colonne.
- Sur chaque chapitre écrit : **Corriger ce chapitre** (envoie le texte au Génie qui le reprend et remplace la version) et **Réécrire**.
- Compteur en haut de la colonne : « 7 chapitres écrits sur 20 · 11 400 mots ».
- Sur mobile, la colonne devient un bandeau repliable au-dessus de la zone d'écriture.

## Détails techniques

- `supabase/functions/v3-genie-brief/index.ts` : nouveau mode `mode: 'outline-step'` — l'IA renvoie **au plus 3 chapitres** + une question de validation, en recevant les chapitres déjà acceptés. Le mode « fiche complète » ne renvoie plus de `outline`.
- `src/lib/v3/genieInterview.ts` : étape 4 (plan du livre) devient itérative (`outlineCursor` dans le brief) au lieu d'une génération unique.
- `src/components/v3public/V3GenieDialog.tsx` : rendu des chapitres proposés en cartes avec Garder / Reformuler / Retirer, titre éditable, boutons Continuer / Réordonner / Terminer ; `outlineValidated` jamais mis par l'IA.
- `src/components/v3public/V3AmbiancePicker.tsx` : passage en `<details>` replié (résumé = ambiance courante).
- `src/pages/v3public/V3CreatePage.tsx` : le wizard passe **dans la colonne de gauche** de la grille `lg:grid-cols-[1fr_360px]` pour que `aside` reste `sticky` visible pendant la rédaction.
- `src/components/v3public/V3GenieOutlinePanel.tsx` : onglets Sommaire / Déjà écrit, compteur mots, actions Corriger / Réécrire par chapitre.
- Nouveau `src/lib/v3/writtenChapters.ts` : petit pont (localStorage `v3_written_chapters_v1` + événement) alimenté par `V3CreateWizard` à chaque chapitre terminé, lu par la colonne — aucune nouvelle table.
- Correction de chapitre : réutilise l'edge function de relecture existante (`strict-proofread`), pas de nouveau moteur.
- Aucun changement de tarif, de quota ni de schéma base.

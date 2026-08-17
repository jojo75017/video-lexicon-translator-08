# V3 Création : effacer vraiment le livre, changer d'ambiance, sommaire visible pendant l'écriture

Trois corrections sur `/v3/create`.

## 1. « Effacer le livre » qui efface vraiment

Aujourd'hui plusieurs mémoires vivent en parallèle : la fiche du Génie, la config du workflow, le sommaire envoyé au workflow, le fil de conversation et les versions serveur. Le bouton « Nouveau livre » n'en vide qu'une partie — l'ancien projet (« l'enfant cobaye ») revient donc dès qu'on recharge.

À faire :
- Une seule action **« Effacer ce livre et repartir de zéro »**, avec confirmation, qui vide *tout* d'un coup : fiche livre, config workflow, sommaire mis en attente, fil de conversation du Génie (local + serveur), versions de sommaire affichées, et l'idée passée dans l'URL.
- Après effacement : la page revient à l'état vierge immédiatement (titre, chapitres, chips, fil de discussion, boutons désactivés) sans rechargement manuel.
- Le bouton est visible à deux endroits : dans la barre d'actions du livre et dans l'en-tête du dialogue Génie.
- Les livres déjà enregistrés dans « Mes livres » ne sont jamais supprimés : on n'efface que le brouillon en cours.

## 2. Changer d'ambiance à tout moment

À faire :
- Un sélecteur **« Ambiance »** directement sur `/v3/create` (et conservé pendant la rédaction) : liste des 17 ambiances existantes, aperçu de la palette, changement instantané.
- L'ambiance choisie est mémorisée avec le livre et réappliquée à la reprise ; elle reste modifiable après génération (elle ne change que l'apparence, pas le texte).
- Un lien discret vers la galerie complète `/ambiances` pour comparer en grand.

## 3. Voir le sommaire pendant l'écriture

À faire :
- Pendant la rédaction, passer en **deux colonnes** sur écran large : le travail d'écriture à gauche, le **sommaire en cours à droite, collant (sticky)** et défilant.
- Le panneau latéral affiche : titre du livre, chips (catégorie, ton, mots/chapitre), sommaire numéroté, état de chaque chapitre (à écrire / écrit) et les versions restaurables.
- Il se met à jour en direct à chaque modification faite par le Génie ou à la main.
- Sur mobile : le sommaire reste au-dessus de la zone d'écriture, repliable, pour ne pas encombrer.

## Détails techniques

- `src/lib/v3/bookBrief.ts` : nouvelle fonction `resetBookProject()` supprimant `v3_create_wizard_config_v1`, `edition_book_config_v1`, `v3_toc_for_workflow_v1` (+ clés du Sommaire Ultime en attente) et émettant `BOOK_BRIEF_EVENT` ; champ `ambianceId` ajouté au type `BookBrief`.
- `src/lib/v3/genieThread.ts` : réutilisation de `clearLocalThread()` + `clearRemoteThread()` dans le reset global.
- `src/components/v3public/V3BookActionsBar.tsx` et `V3GenieDialog.tsx` : bouton d'effacement complet avec confirmation.
- Nouveau `src/components/v3public/V3AmbiancePicker.tsx` s'appuyant sur `src/data/writingAmbiances.ts` (aucune nouvelle donnée).
- `src/pages/v3public/V3CreatePage.tsx` : layout `lg:grid-cols-[1fr_340px]` quand le workflow est ouvert, avec `V3GenieOutlinePanel` en colonne `sticky top-24`.
- Aucun changement de base de données, de tarif ni d'edge function.

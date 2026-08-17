# V3 Création : entretien guidé, effacement réel, ambiance, sommaire visible

Quatre corrections sur `/v3/create`.

## 0. Le Génie mène un entretien guidé (référence Wordgenie)

Aujourd'hui le Génie répond librement. Dans la référence, l'IA conduit un entretien balisé : « Étape 1 sur 6 – Vous et votre livre », une question à la fois, un exemple dépliable, un bouton « Passer », et une carte de choix (langue du livre) répondue en un clic.

À faire :
- **Parcours en 6 étapes** annoncées dans le fil (séparateur « Étape X sur 6 – … ») : 1. Vous et votre livre · 2. Votre approche · 3. Votre lecteur · 4. Le plan du livre · 5. Ton et style · 6. Validation du sommaire.
- **Une question à la fois**, formulée par le Génie, avec :
  - un lien **« Montrer un exemple »** qui déplie une réponse type,
  - un bouton **« Passer »** (l'IA travaille avec ce qui a déjà été dit),
  - la réponse de l'abonné affichée en bulle à droite, comme aujourd'hui.
- **Cartes de choix cliquables** quand la réponse est un choix : **langue du livre** (les 10 langues déjà gérées), nombre de chapitres, ton, ambiance. Un clic = réponse enregistrée dans la fiche.
- La langue choisie est appliquée à la rédaction et aux exports (champ `language` de la fiche).
- À la fin de l'étape 6, le sommaire est proposé et les boutons d'action s'activent.
- Le parcours reste souple : l'abonné peut à tout moment écrire librement ; le Génie continue là où il en est, et la reprise repart à l'étape en cours.


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

## 3. Rien ne démarre avant la validation du sommaire

Règle unique : **tant que le sommaire n'est pas validé, le workflow ne se lance pas.**

À faire :
- Avant validation : seuls le dialogue Génie, le sommaire en cours et le bouton « Valider le sommaire » sont actifs. Aucun formulaire de workflow, aucun bouton de rédaction, d'export, de correction ou d'audio n'est cliquable (ils restent visibles, grisés, avec « Disponible après validation du sommaire »).
- Au clic sur **« Valider le sommaire »** : la version est enregistrée, puis le workflow s'ouvre juste en dessous et la barre complète des boutons devient active sous le livre.
- Tant que le sommaire est modifié après validation, le workflow reste ouvert mais un rappel invite à revalider pour repartir sur le bon sommaire.

## 4. Voir le sommaire pendant l'écriture

À faire :
- Après validation, passer en **deux colonnes** sur écran large : le travail d'écriture à gauche, le **sommaire à droite, collant (sticky)** et défilant.
- Le panneau latéral affiche : titre du livre, chips (catégorie, ton, langue, mots/chapitre), sommaire numéroté, état de chaque chapitre (à écrire / écrit) et les versions restaurables.
- Il se met à jour en direct à chaque modification faite par le Génie ou à la main.
- Sur mobile : le sommaire reste au-dessus de la zone d'écriture, repliable, pour ne pas encombrer.


## Détails techniques

- `src/lib/v3/bookBrief.ts` : `resetBookProject()` supprimant `v3_create_wizard_config_v1`, `edition_book_config_v1`, `v3_toc_for_workflow_v1` (+ clés Sommaire Ultime en attente) et émettant `BOOK_BRIEF_EVENT` ; champs `ambianceId`, `language`, `interviewStep` ajoutés à `BookBrief`.
- Nouveau `src/lib/v3/genieInterview.ts` : définition des 6 étapes (question, exemple, type de réponse libre/choix, options) et calcul de l'étape courante à partir de la fiche.
- `src/components/v3public/V3GenieDialog.tsx` : séparateurs d'étape, question courante, « Montrer un exemple », « Passer », cartes de choix cliquables, bouton d'effacement complet ; le prompt envoyé à `v3-genie-brief` indique l'étape en cours pour que l'IA pose la question suivante.
- `src/lib/v3/genieThread.ts` : `clearLocalThread()` + `clearRemoteThread()` réutilisés dans le reset global.
- Nouveau `src/components/v3public/V3AmbiancePicker.tsx` basé sur `src/data/writingAmbiances.ts` (aucune nouvelle donnée).
- `src/pages/v3public/V3CreatePage.tsx` : layout `lg:grid-cols-[1fr_340px]` quand le workflow est ouvert, `V3GenieOutlinePanel` en colonne `sticky top-24`.
- Aucun changement de base de données, de tarif ni d'edge function (seul le prompt de `v3-genie-brief` évolue).


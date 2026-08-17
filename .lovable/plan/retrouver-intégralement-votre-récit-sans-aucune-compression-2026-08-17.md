# Retrouver intégralement votre récit, sans aucune compression

## Diagnostic confirmé

Vos trois passages sont encore présents dans l’historique de conversation : ils ne sont donc pas perdus. En revanche, les instantanés enregistrés pour ce livre contiennent une matière brute vide, tandis que la colonne « Votre livre en direct » affiche le synopsis court produit par l’IA. C’est pourquoi vous ne voyez que le paragraphe commençant par « Né en 1952 à Berck-sur-Mer… ».

À la reprise, le fil de discussion est rechargé mais la matière brute du livre n’est pas reconstruite depuis les messages de l’auteur. Lors de la construction du sommaire, seul le synopsis court est envoyé, pas le récit intégral.

## Ce qui sera corrigé

### 1. Récupérer automatiquement tout ce que vous avez déjà raconté
- Au chargement du livre, reconstruire la matière brute à partir de tous les messages de l’auteur déjà sauvegardés, dans leur ordre chronologique.
- Fusionner cette matière avec celle éventuellement présente dans la fiche, sans doublonner les passages identiques.
- Réenregistrer immédiatement le récit reconstruit dans la fiche du livre et dans la sauvegarde distante.
- Votre texte actuel sur Berck-sur-Mer, votre mère, Valloires, votre frère, votre sœur et votre grand-mère sera donc récupéré sans vous demander de le retaper.

### 2. Séparer clairement « Vos souvenirs » et « Résumé du livre »
- La colonne de droite affichera en priorité **Vos souvenirs — texte intégral**, avec le nombre réel de mots et un bouton replier/déplier.
- Le paragraphe court généré par l’IA restera uniquement dans une section secondaire **Résumé du livre** ; il ne sera plus présenté comme votre récit.
- Après chaque nouvel envoi, vos propres phrases apparaîtront immédiatement dans « Vos souvenirs », avant même la réponse de l’IA.

### 3. Ne plus perdre un message en cas d’erreur IA
- Ajouter le nouveau passage à la matière brute et le sauvegarder avant l’appel au Génie.
- Si l’appel IA échoue, le texte de l’auteur restera tout de même conservé.
- La sauvegarde du message utilisateur utilisera la fiche contenant déjà ce nouveau passage, et non l’ancien instantané vide.

### 4. Donner le récit intégral à toutes les étapes
- Envoyer la matière brute complète au Génie lors des échanges suivants.
- Envoyer également cette matière lors de la construction progressive du sommaire, afin que les chapitres suivent les événements réellement racontés plutôt qu’un synopsis compressé.
- Conserver cette matière dans le workflow de rédaction et dans chaque demande de chapitre de 2 500 mots.

### 5. Corriger sans remplacer les mots de l’auteur
- Le Génie pourra proposer une version corrigée séparée (orthographe, grammaire, ponctuation), mais le texte original restera toujours conservé.
- Aucune réponse IA ne pourra écraser la matière brute avec un résumé.
- Les dates, lieux, personnes, liens familiaux et incertitudes exprimées par l’auteur seront transmis tels quels à la rédaction.

### 6. Vous fixez le titre, le sous-titre, les chapitres et les mots
- Dans la colonne « Votre livre en direct », quatre champs directement modifiables : **Titre**, **Sous-titre**, **Nombre de chapitres** (3 à 40) et **Mots par chapitre** (800 à 3 500).
- Enregistrement immédiat à la saisie, sans bouton caché, avec le total de mots estimé du livre affiché.
- Dès que vous modifiez un de ces champs, il est **verrouillé** : le Génie ne pourra plus le remplacer à sa façon lors des échanges suivants.
- Un bouton « Laisser le Génie proposer » par champ permet de rendre la main à l’IA si vous le souhaitez.
- Le nombre de chapitres que vous fixez devient la cible réelle de la construction du sommaire, et les mots par chapitre la cible réelle de la rédaction.

## Détails techniques

- `src/lib/v3/genieThread.ts` : charger aussi le dernier `brief_snapshot` et ajouter une reconstruction ordonnée à partir des messages `role=user`.
- `src/components/v3public/V3GenieDialog.tsx` : persister `sourceText` avant l’appel IA, sauvegarder le bon instantané pour le message utilisateur et restaurer automatiquement les anciens passages.
- `src/components/v3public/V3GenieOutlinePanel.tsx` : afficher `sourceText` comme récit principal, `description` comme simple résumé distinct, et ajouter le bloc « Réglages du livre » avec les quatre champs éditables.
- `src/components/v3public/V3OutlineCoBuilder.tsx` et la fonction IA du Génie : transmettre et exploiter `sourceText` aussi en mode construction du sommaire, et respecter la cible de chapitres fixée.
- `src/lib/v3/bookBrief.ts` : nouveau champ `lockedFields` (réglages fixés par l’auteur) persisté avec la fiche ; la fusion de la réponse IA ignore tout champ verrouillé.
- La reconstruction sera idempotente : recharger la page plusieurs fois ne multipliera pas le même texte.

## Vérification avant livraison

- Recharger le livre actuel : les trois passages de l’auteur réapparaissent intégralement dans « Vos souvenirs ».
- Comparer le nombre de mots affiché avec les messages utilisateur sauvegardés.
- Ajouter un quatrième souvenir : il apparaît immédiatement et reste présent après rechargement et sur un autre appareil.
- Simuler une panne IA : le passage saisi n’est pas perdu.
- Générer trois propositions de chapitres : elles reprennent les faits du récit complet, pas seulement le synopsis court.
- Lancer un chapitre : cible 2 500 mots, matière brute transmise, aucune compression du récit source.
- Fixer titre, sous-titre, 12 chapitres et 2 800 mots, puis envoyer deux messages au Génie : les quatre valeurs restent inchangées.
# Plan — Remettre le récit V3 au propre

## Objectif
Créer un parcours simple et fiable où chaque texte de l’auteur est conservé mot pour mot, comparé à la version retravaillée par l’IA, puis validé explicitement avant d’entrer dans le livre.

## Constats vérifiés
- Le récit dépend actuellement de plusieurs états distincts : conversation locale, fiche locale, instantanés de conversation dans la base et état interne du wizard.
- À la reprise, le fil local et le fil enregistré en ligne ne sont pas fusionnés : le plus long remplace l’autre, ce qui peut masquer des messages présents dans une seule copie.
- Les erreurs d’enregistrement en ligne sont ignorées silencieusement ; l’interface peut donc annoncer une conservation sans l’avoir confirmée.
- La reconstruction écarte tous les messages de moins de 40 caractères et la déduplication remplace certains passages selon une simple comparaison d’inclusion ; ces règles peuvent retirer des précisions légitimes.
- Les moteurs IA ne reçoivent qu’une partie du récit : 14 000 ou 24 000 caractères pour le sommaire, 20 000 pour la rédaction. Un récit long n’est donc pas entièrement pris en compte.
- Le wizard conserve encore sa propre copie du récit et peut transmettre une valeur plus ancienne que celle affichée dans la colonne de droite.
- La comparaison actuelle porte surtout sur les réglages et le nombre de mots ; elle ne permet pas de vérifier passage par passage ce qui a été conservé, corrigé, ajouté ou supprimé.

## Nouveau fonctionnement
```text
Texte saisi par l’auteur
        ↓ sauvegarde confirmée
Original immuable, découpé en passages numérotés
        ↓
Version proposée par l’IA, séparée de l’original
        ↓
Comparaison Original / Proposition
        ↓
Valider — Modifier — Refuser
        ↓
Version validée utilisée pour le sommaire et la rédaction
```

## Travaux prévus

### 1. Installer une seule mémoire fiable du récit
- Enregistrer chaque contribution de l’auteur comme un passage distinct, ordonné et rattaché au projet et au chapitre concerné.
- Faire de la base la source principale pour un abonné connecté ; garder le stockage local uniquement comme secours temporaire.
- Donner à chaque passage un identifiant stable afin de fusionner correctement les données locales et en ligne sans doublon ni remplacement arbitraire.
- Afficher un état réel : `Enregistrement en cours`, `Enregistré`, ou `À resynchroniser`.
- Ne plus ignorer silencieusement une erreur de sauvegarde.

### 2. Séparer clairement les trois textes
- **Vos écrits originaux** : intouchables, mot pour mot.
- **Proposition de l’IA** : correction et développement, jamais enregistrés à la place de l’original.
- **Version validée du livre** : créée uniquement après validation de l’auteur.
- Le synopsis restera un résumé séparé et ne pourra plus être confondu avec le récit.

### 3. Ajouter une vraie comparaison éditoriale
- Afficher côte à côte l’original et la proposition IA.
- Surligner les ajouts, corrections et suppressions.
- Montrer pour les deux versions : nombre de mots, passages couverts et souvenirs non repris.
- Bloquer la validation si un passage original manque ou si la proposition contient moins de mots que l’original validé.
- Proposer trois actions simples : `Valider`, `Demander une modification`, `Garder mon texte original`.

### 4. Supprimer les pertes et les faux doublons
- Retirer la règle qui ignore les messages courts : une date, un prénom ou un lieu peut être essentiel.
- Remplacer la déduplication par inclusion de texte par une détection fondée sur l’identifiant du passage et son empreinte exacte.
- Ne jamais remplacer automatiquement un ancien passage par un message ressemblant ; présenter les deux ou enregistrer une révision explicite.
- Réparer les brouillons existants à partir des messages déjà enregistrés, sans effacer les originaux.

### 5. Garantir la cohérence du sommaire et du livre
- Construire le sommaire à partir des passages validés, et indiquer sous chaque chapitre quels souvenirs lui sont affectés.
- Envoyer aux moteurs IA tous les passages pertinents du chapitre, par lots contrôlés, au lieu de couper arbitrairement le récit au début ou à la fin.
- Faire utiliser la même version validée au Génie, au sommaire, au wizard et au workflow hybride Gemini + ChatGPT.
- Vérifier après chaque chapitre que tous les passages assignés ont été repris et qu’aucun fait, nom, lieu ou date n’a été contredit.

### 6. Simplifier l’écran `/v3/create`
- Colonne gauche : conversation et saisie.
- Colonne droite toujours visible : onglets `Mes écrits`, `Comparaison`, `Sommaire`, `Livre rédigé`.
- Ouvrir automatiquement `Mes écrits` après une saisie, puis `Comparaison` quand la proposition IA est prête.
- Afficher un compteur permanent : `mots originaux / mots proposés / passages couverts`.
- Ne lancer le workflow qu’après validation du récit utile et du sommaire.

## Migration et sécurité des écrits existants
- Conserver les conversations et instantanés actuels en lecture seule pendant la reconstruction.
- Reconstituer les passages dans leur ordre chronologique et signaler les ambiguïtés au lieu de supprimer automatiquement.
- Créer un point de restauration avant toute conversion d’un ancien brouillon.
- Ne jamais modifier un livre déjà sauvegardé sans action explicite de son propriétaire.

## Vérifications obligatoires
- Saisir plusieurs messages, dont des précisions courtes, puis recharger la page et changer d’appareil : aucun passage ne doit disparaître.
- Couper momentanément la connexion : le texte doit rester localement et se resynchroniser avec un statut visible.
- Envoyer deux passages proches mais différents : les deux doivent être conservés.
- Tester un récit dépassant 24 000 caractères : le sommaire et les chapitres doivent tenir compte de tout le contenu pertinent.
- Générer une proposition volontairement incomplète : la validation doit être bloquée et les passages absents listés.
- Corriger, refuser puis valider une version : l’original doit rester récupérable à chaque étape.
- Reprendre le projet après déconnexion/reconnexion : conversation, originaux, validations, comparaison et sommaire doivent être identiques.

## Résultat attendu
L’abonné voit toujours ce qu’il a réellement écrit, ce que l’IA propose de changer et ce qui est finalement utilisé dans son livre. Aucune compression, suppression ou fusion ne peut se produire sans être visible et validée.
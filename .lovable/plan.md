# Script propre + version MP3 « podcast » du lancement

Pas de vidéo : on part sur un **MP3 style podcast** de 2 minutes, généré depuis le script avec la voix de synthèse déjà en place dans l'application. Aucun logo, aucun abonnement Fliki, et le fichier est téléchargeable pour être joint aux emails ou déposé sur les pages.

## Le script à lire (sans horodatage)


Si vous avez toujours voulu publier un livre sur Amazon, écoutez-moi deux minutes. Le 31 août, l'accès à vie à EbookStudio à 47 euros disparaît définitivement. Ensuite, ce sera un abonnement mensuel. Je vous explique pourquoi, et surtout ce que vous obtenez.

La plupart des gens n'échouent pas parce qu'ils manquent d'idées. Ils échouent au moment de publier. Le sommaire part dans tous les sens. Les chapitres se répètent. La couverture n'est jamais au bon format. Et les données Amazon, les mots-clés, les catégories, la description, restent une énigme. Résultat : le livre ne sort jamais.

Voilà ce que fait EbookStudio. J'écris mon idée en une seule phrase. Les agents me proposent le titre, le sous-titre, la description commerciale et un sommaire complet. Je valide. Ils rédigent chapitre par chapitre en gardant la mémoire de l'histoire, sans se répéter.

Ensuite vient la partie que personne ne fait correctement. Une correction professionnelle en quatre passes. Une couverture au gabarit exact d'Amazon, avec le dos et la quatrième de couverture. Un fichier prêt à téléverser. Et la fiche Amazon entièrement remplie : mots-clés, catégories, description avec les mots importants en gras. Si vous le souhaitez, vous obtenez même une version audio de votre livre.

Jusqu'au 31 août à minuit : 47 euros, une seule fois, accès à vie. Payable en une, deux ou trois fois. Le 1er septembre, cette offre disparaît pour de bon. À partir du 1er septembre, vous pourrez réserver votre place pour la nouvelle version, qui ouvre le 1er octobre, avec le premier mois offert.

Vous avez deux choix. Le premier : vous testez gratuitement et vous écrivez votre premier chapitre en quelques minutes, sans carte bancaire. Le second : vous prenez l'accès à vie à 47 euros avant le 31 août. Le lien est juste en dessous. Une question ? Écrivez-moi directement, je réponds personnellement. À très vite, et bonne écriture.

## Version courte (si le MP3 dépasse deux minutes)

Le 31 août, l'accès à vie à EbookStudio à 47 euros disparaît. Ensuite, ce sera un abonnement.

La plupart des gens n'échouent pas par manque d'idées, mais au moment de publier : sommaire brouillon, chapitres qui se répètent, couverture au mauvais format, données Amazon incompréhensibles.

EbookStudio fait tout cela pour vous. Une phrase suffit : les agents proposent le titre, la description et le sommaire, puis rédigent chapitre par chapitre. Correction professionnelle, couverture au gabarit Amazon, fichier prêt à téléverser, fiche Amazon complète, et même une version audio.

Jusqu'au 31 août à minuit : 47 euros une seule fois, accès à vie, payable en trois fois. Après, uniquement l'abonnement. La nouvelle version ouvre le 1er octobre avec le premier mois offert.

Testez gratuitement votre premier chapitre, sans carte bancaire, ou prenez l'accès à vie avant le 31 août. Le lien est en dessous.

## Ce que j'ajoute dans `/admin/lancement`

Un bloc « Message audio du lancement » :

- Le script en **diapositives** (une phrase par carte, flèches gauche/droite) si vous préférez l'enregistrer avec votre propre voix.
- Deux boutons de copie : *script complet* et *version courte*, en texte nu.
- Choix de la version (longue ou courte) et de la voix, puis **« Générer le MP3 »** : la voix de synthèse lit le script, un lecteur audio apparaît, et un bouton **« Télécharger le MP3 »**.
- Un champ existant réutilisé : au lieu d'un lien vidéo, vous pouvez enregistrer le lien du MP3 (ou le fichier hébergé) — il s'affichera alors automatiquement dans les emails, sur `/essai`, `/commander` et `/v3/attente`, avec un lecteur audio au lieu du bloc vidéo.

## Détails techniques

- `src/data/launchVideoScript.ts` : script découpé en phrases, deux variantes (longue, courte).
- `src/components/admin/LaunchAudioScriptPanel.tsx` : diapositives, boutons de copie, sélection de version/voix, génération MP3 et téléchargement. Intégré dans `AdminLancementPage.tsx`.
- Génération audio : réutilisation de l'existant (`requestTtsAudioChunks` + fonction `elevenlabs-tts`), découpage automatique du script en segments puis assemblage en un seul MP3 côté navigateur.
- Stockage : le MP3 est déposé dans un bucket public du backend, et son URL enregistrée dans `launch_settings` (clé `launch_video`, réutilisée, avec un indicateur `kind: 'audio'`).
- `LaunchVideoBlock.tsx` : affiche un lecteur `<audio>` quand l'URL est un MP3, sinon garde le comportement vidéo actuel.
- Emails (`send-sales-email`) : le bloc média devient « Écouter le message (2 min) » avec un lien direct vers le MP3 — les clients mail ne lisent pas l'audio en ligne, donc un lien reste la seule option fiable.


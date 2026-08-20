# Mettre en ligne votre message audio de lancement (MP3 podcast)

Vous m'avez envoyé le MP3 (1 min 40, qualité 320 kbps). Je l'héberge sur votre backend et je le branche partout : lecteur audio sur les pages publiques et lien « Écouter le message » dans les 5 emails de rappel. Le script ci-dessous reste disponible en copier-coller, sans horodatage, si vous voulez réenregistrer une version plus longue.


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

## Ce que je mets en place

1. **Hébergement du MP3** : votre fichier est déposé dans un espace de stockage public du backend, avec une adresse fixe réutilisable partout.
2. **Lecteur audio sur les pages** : sur `/essai`, `/commander`, l'accueil V3 et `/v3/attente`, le bloc média actuel devient un vrai lecteur « Écoutez le message — 2 minutes » (vert/or, dans l'identité V3), avec un bouton de téléchargement.
3. **Emails de rappel R1 à R5** : chaque email reçoit un encart « Écouter le message (2 min) » qui pointe vers une page d'écoute — les clients mail ne lisent pas l'audio en ligne, donc un lien reste la seule option fiable.
4. **Page d'écoute dédiée** `/message` : le lecteur, le rappel de l'échéance du 31 août et un seul bouton vers `/commander`.
5. **Panneau admin** : dans `/admin/lancement`, le champ média accepte désormais un MP3 ou un lien vidéo, avec aperçu immédiat et interrupteur pour l'afficher ou le masquer partout d'un clic.
6. **Script en copier-coller** : le texte ci-dessus est affiché dans l'admin avec un bouton *Copier*, en texte nu, sans minutage, pour réenregistrer facilement.

## Détails techniques

- Stockage : bucket public `launch-media`, fichier `message-lancement.mp3` (migration + politique de lecture publique).
- `launch_settings` : la clé `launch_video` est réutilisée avec `{ url, kind: 'audio' | 'video', enabled }`, sans migration de schéma (colonne `value` en JSON).
- `src/components/launch/LaunchVideoBlock.tsx` : rendu conditionnel — lecteur `<audio controls>` + bouton de téléchargement pour un MP3, bloc lien pour une vidéo.
- Nouvelle page `src/pages/launch/MessageAudioPage.tsx` + route `/message` dans `App.tsx`.
- `supabase/functions/send-sales-email/index.ts` : `videoBlock` renommé en bloc média, texte « Écouter le message (2 min) », lien vers `/message`.
- `src/data/launchVideoScript.ts` : script (version longue et courte) pour l'affichage et la copie dans l'admin.
- `src/pages/admin/AdminLancementPage.tsx` : champ média (URL + type), aperçu, interrupteur, bloc script avec bouton *Copier*.



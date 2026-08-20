# Script vidéo 2 minutes — version propre (sans horodatage)

Fliki lit tout ce qui est dans le texte, y compris « 0:00 — 0:15 ». Voici donc le script en texte continu, prêt à coller d'un bloc. Aucune indication technique, aucun chiffre de minutage, uniquement les phrases à dire.

## Le script à coller dans Fliki

Si vous avez toujours voulu publier un livre sur Amazon, écoutez-moi deux minutes. Le 31 août, l'accès à vie à EbookStudio à 47 euros disparaît définitivement. Ensuite, ce sera un abonnement mensuel. Je vous explique pourquoi, et surtout ce que vous obtenez.

La plupart des gens n'échouent pas parce qu'ils manquent d'idées. Ils échouent au moment de publier. Le sommaire part dans tous les sens. Les chapitres se répètent. La couverture n'est jamais au bon format. Et les données Amazon, les mots-clés, les catégories, la description, restent une énigme. Résultat : le livre ne sort jamais.

Voilà ce que fait EbookStudio. J'écris mon idée en une seule phrase. Les agents me proposent le titre, le sous-titre, la description commerciale et un sommaire complet. Je valide. Ils rédigent chapitre par chapitre en gardant la mémoire de l'histoire, sans se répéter.

Ensuite vient la partie que personne ne fait correctement. Une correction professionnelle en quatre passes. Une couverture au gabarit exact d'Amazon, avec le dos et la quatrième de couverture. Un fichier prêt à téléverser. Et la fiche Amazon entièrement remplie : mots-clés, catégories, description avec les mots importants en gras. Si vous le souhaitez, vous obtenez même une version audio de votre livre.

Jusqu'au 31 août à minuit : 47 euros, une seule fois, accès à vie. Payable en une, deux ou trois fois. Le 1er septembre, cette offre disparaît pour de bon. À partir du 1er septembre, vous pourrez réserver votre place pour la nouvelle version, qui ouvre le 1er octobre, avec le premier mois offert.

Vous avez deux choix. Le premier : vous testez gratuitement et vous écrivez votre premier chapitre en quelques minutes, sans carte bancaire. Le second : vous prenez l'accès à vie à 47 euros avant le 31 août. Le lien est juste en dessous. Une question ? Écrivez-moi directement, je réponds personnellement. À très vite, et bonne écriture.

## Version courte (si Fliki dépasse deux minutes)

Le 31 août, l'accès à vie à EbookStudio à 47 euros disparaît. Ensuite, ce sera un abonnement.

La plupart des gens n'échouent pas par manque d'idées, mais au moment de publier : sommaire brouillon, chapitres qui se répètent, couverture au mauvais format, données Amazon incompréhensibles.

EbookStudio fait tout cela pour vous. Une phrase suffit : les agents proposent le titre, la description et le sommaire, puis rédigent chapitre par chapitre. Correction professionnelle, couverture au gabarit Amazon, fichier prêt à téléverser, fiche Amazon complète, et même une version audio.

Jusqu'au 31 août à minuit : 47 euros une seule fois, accès à vie, payable en trois fois. Après, uniquement l'abonnement. La nouvelle version ouvre le 1er octobre avec le premier mois offert.

Testez gratuitement votre premier chapitre, sans carte bancaire, ou prenez l'accès à vie avant le 31 août. Le lien est en dessous.

## Ce que je peux ajouter dans l'application

Un onglet « Script vidéo » dans `/admin/lancement` :

- Le script affiché en diapositives (une phrase par carte, flèches gauche/droite) pour lire face caméra sans perdre le fil.
- Un bouton « Copier le script complet » et « Copier la version courte », qui copient un texte nu, sans titres ni minutage — donc directement collable dans Fliki.
- Un curseur de vitesse de lecture pour le mode diapositives, si vous voulez enregistrer en lisant à l'écran.

## Détails techniques

- Nouveau fichier `src/data/launchVideoScript.ts` : le script découpé en phrases, deux variantes (longue, courte).
- Nouveau composant `src/components/admin/LaunchVideoScriptPanel.tsx` : lecteur en diapositives + boutons de copie, intégré dans `AdminLancementPage.tsx` sous le champ du lien vidéo.
- Aucune modification de base de données ni d'email.

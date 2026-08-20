# Rendre le lancement visible + derniers rappels « 47 € jusqu'au 31 août »

## Où en est le lancement aujourd'hui

Tout est déjà construit, mais sans aucun lien visible depuis vos pages :

- `/essai` — chapitre 1 gratuit
- `/essai/inscription` — création de compte + forfait avec 1er mois offert
- `/v3/attente` — salon des membres fondateurs (compte à rebours, 3 cadeaux)
- `/admin/lancement` — tableau de bord admin (essais, conversions, interrupteurs)

C'est pour cela que vous « ne voyez rien » : les pages existent, rien ne les met en avant.

## 1. Mettre le lancement en évidence

- Bandeau haut de page (accueil V3 + page `/commander`) : « 47 € à vie jusqu'au 31 août — V3 le 1er octobre, 1er mois offert » avec 2 boutons : *Essayer le chapitre 1 gratuit* et *Réserver ma place*.
- Barre latérale V3 : nouvelle section « Lancement » → Essai gratuit, Salon d'attente, Données du lancement (admin uniquement).
- Accès rapide admin : bouton « Lancement V3 » dans la barre d'accès rapide admin, en plus de l'onglet existant.
- Compte à rebours réel jusqu'au 31 août 23h59 (Paris) sur le bandeau et sur `/commander`.

## 2. Derniers emails de rappel (fin du 47 € le 31 août)

Nous sommes le 20 août : la séquence actuelle de 5 jours est calée sur un départ immédiat, elle finirait trop tôt. Nouveau calendrier de rappels, un envoi par étape déclenché depuis l'admin :

| Envoi | Date | Angle |
|---|---|---|
| R1 | 21 août | « Plus que 10 jours : 47 € à vie, puis abonnement » |
| R2 | 24 août | La vidéo démo (votre vidéo) : un livre complet du sommaire au fichier Amazon |
| R3 | 27 août | Objections : « je n'écris pas bien », « c'est trop technique » |
| R4 | 29 août | Ce qui change le 1er octobre + inscription dès le 1er septembre, 1er mois offert |
| R5 | 31 août | Dernier jour, ce soir minuit |

- Chaque email : bloc vidéo (vignette cliquable vers votre lien YouTube), un seul bouton vers `/commander`, mention « inscriptions V3 dès le 1er septembre, 1er mois offert ».
- Segment : les 627 contacts actifs, désinscrits exclus, suivi envoyé / en attente / erreur par destinataire comme aujourd'hui.
- Une relance des ouvreurs non-cliqueurs le 30 août, en un clic.

## 3. Emplacement de la vidéo

Un champ « Lien de la vidéo de lancement » dans `/admin/lancement` : dès que vous collez l'URL, elle apparaît dans les emails, sur `/essai`, `/commander` et `/v3/attente`. Si le champ est vide, le bloc vidéo est simplement masqué.

## Détails techniques

- Bandeau : nouveau composant `V3LaunchBanner.tsx` intégré dans l'accueil V3 et `V3CommanderPage.tsx`, dates lues depuis `launch_settings`.
- Liens barre latérale : ajout dans le composant de navigation V3 existant, entrée admin conditionnée par `useIsAdmin`.
- Emails : réécriture des 5 étapes de `supabase/functions/send-sales-email/index.ts` (templates `rappel-47-1` à `-5`) et mise à jour de `src/data/canonicalEmailCampaign.ts` + `CampaignSequencePanel.tsx` avec les nouvelles dates.
- Vidéo : colonne `launch_video_url` dans `launch_settings` (migration + GRANT), lecture via `useLaunchSettings.ts`.

## Script vidéo — 2 minutes (annonce fin du 47 € + V3 le 1er octobre)

Format : vous face caméra, quelques captures d'écran en incrustation. Durée cible 2 min (~330 mots).

**0:00 — 0:15 | Accroche**
« Si vous avez toujours voulu publier un livre sur Amazon, écoutez-moi 2 minutes : le 31 août, l'accès à vie à EbookStudio à 47 € disparaît définitivement. Après, ce sera un abonnement mensuel. Je vous explique pourquoi, et ce que vous obtenez. »

**0:15 — 0:40 | Le problème**
« La plupart des gens n'échouent pas parce qu'ils manquent d'idées. Ils échouent au moment de la publication : le sommaire part dans tous les sens, les chapitres se répètent, la couverture n'est pas au bon format, et les données KDP — mots-clés, catégories, description — restent une énigme. Résultat : le livre ne sort jamais. »

**0:40 — 1:15 | La démonstration (captures d'écran)**
« Voilà ce que fait EbookStudio V3. J'écris une idée en une phrase. Les agents me proposent le titre, le sous-titre, la description commerciale et un sommaire complet. Je valide. Ils rédigent chapitre par chapitre, en gardant la mémoire de l'histoire. Ensuite : correction professionnelle en 4 passes, couverture au gabarit KDP, fichier prêt à téléverser, données KDP remplies — mots-clés, catégories BISAC, description avec les mots importants en gras. Et si je veux, une version audio. »

**1:15 — 1:40 | L'offre et l'échéance**
« Jusqu'au 31 août à minuit : 47 €, une seule fois, accès à vie. Payable en 1, 2 ou 3 fois. Le 1er septembre, cette offre disparaît. À partir du 1er septembre vous pourrez réserver votre place pour la V3, qui ouvre le 1er octobre — avec le premier mois offert. »

**1:40 — 2:00 | Appel à l'action**
« Deux choix. Un : vous testez gratuitement, vous écrivez votre premier chapitre en quelques minutes, sans carte bancaire. Deux : vous prenez l'accès à vie à 47 € avant le 31 août. Le lien est juste en dessous. Une question ? Vous m'écrivez directement à boubetgeorges@gmail.com, je réponds. À très vite — et bonne écriture. »

**Incrustations à préparer** : compte à rebours « fin le 31 août », capture du sommaire généré, capture de la couverture, capture des données KDP, écran « 1er mois offert ».

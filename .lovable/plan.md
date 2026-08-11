# Corriger la V3 + démo Génie et campagne 47 € (objectif 20-30 abonnés)

## Partie 1 — Corrections V3 constatées

1. `/v3/hub` : ajouter un vrai titre en haut de page et déplacer l'avertissement « Clé IA manquante » sous le titre, en encart discret (il est aujourd'hui le premier élément visible).
2. Bandeau header « Offre V3 · 1er oct. » : le remplacer par le message unique de campagne — « Accès à vie 47 € jusqu'au 30/09 » — pour ne plus contredire `/commander`.
3. Liens du menu : « Marketing & Emails » pointera vers la page marketing réelle et non `/v3/outils` ; suppression du doublon « Signature email » / « Signature auteur ».
4. Anciens liens : `/v3/import` redirige vers `/v3/create?import=1`, `/v3/traduire` vers `/v3/outils/traduction` (aujourd'hui page « introuvable »).
5. Vérifié et sain : create, studio, corriger, cover-studio-pro, forfaits, migration, outils, commander — aucune erreur bloquante, et le paiement est bien en mode réel en production.

## Partie 2 — Démo guidée du Génie (le vrai formulaire d'inscription)

Nouveau parcours public `/demo` :

```text
Page /demo
 ├─ 1. Le visiteur décrit son livre en une phrase (aucun compte demandé)
 ├─ 2. Le Génie propose titre + sous-titre + 8 premiers chapitres (gratuit)
 ├─ 3. Pour voir le sommaire complet + le 1er chapitre rédigé :
 │      formulaire email + prénom (une ligne, un bouton)
 ├─ 4. Écran résultat : sommaire complet, 1er chapitre lisible
 └─ 5. Paywall : « Écrire les 39 autres chapitres et exporter » → /commander (47 €)
```

- L'email est enregistré comme lead avec la source `demo-genie`, le titre de livre généré et la niche.
- Le lead reçoit immédiatement un email contenant son sommaire personnalisé + le lien vers l'offre 47 €.
- Le contenu déjà produit est conservé : après achat, le livre commencé se retrouve dans « Mes livres ».
- Les blocs d'inscription existants (pop-up, barre collante, encart inline) basculent sur cette promesse « Testez le Génie sur votre idée de livre » au lieu du PDF.

## Partie 3 — Séquence email de la démo

4 emails automatiques, déclenchés par l'inscription à la démo :

| Jour | Contenu |
| --- | --- |
| J0 | « Voici votre sommaire » + lien démo + offre 47 € |
| J1 | Le 1er chapitre écrit par l'IA, en entier, dans l'email |
| J3 | Marie & Rachel (preuve) + rappel 47 € à vie |
| J6 | Dernière relance : ce que coûte l'abonnement après le 30/09 |

Tous les liens passent par le relais `/r` déjà en place, vers `ebookstudio.fr/commander`.

## Partie 4 — Contenus prêts à publier (Facebook groupes KDP + Pinterest)

Nouvelle page admin « Kit de publication » regroupant, copiables en un clic :

- **Facebook / groupes KDP** : 10 posts rédigés (démo du Génie, avant/après sommaire, correction d'un manuscrit, couverture pro, résultat d'un livre publié), avec règles anti-spam par groupe et 5 modèles de commentaires utiles.
- **Pinterest** : 15 épingles verticales (2:3) générées avec titre lisible + visuel de couverture, toutes vers `/demo`, avec titres et descriptions optimisés (« sommaire de livre IA », « publier sur Amazon KDP », « couverture KDP gratuite »).
- Suivi : chaque lien porte son UTM, et un tableau montre inscriptions démo / clics vers `/commander` / ventes par canal, pour savoir où sont les 20-30 abonnés.

## Détails techniques

- `src/pages/DemoGeniePage.tsx` + route publique `/demo` ; réutilise `v3-genie-brief` pour l'étape 2 et `v3-generate-outline` pour le sommaire complet.
- Edge function `demo-genie-capture` : validation de l'email, insertion dans `funnel_leads` (`lead_magnet = 'demo-genie'`, stockage du brief), envoi de l'email J0 via Resend.
- Séquence : réutilise la mécanique `send-sales-email` / `CampaignSequencePanel` avec un nouveau jeu de gabarits `demo-genie-1..4`.
- Corrections V3 : `src/pages/v3/V3HubPage.tsx` (titre + ordre des blocs), `src/data/v3HeaderMenu.ts` (liens et doublons), `src/App.tsx` (2 redirections), bandeau dans `V3LaunchGlobalBanner.tsx`.
- Kit de publication : `src/pages/admin/AdminPublishingKitPage.tsx` + `src/data/socialLaunchKit.ts` ; visuels Pinterest générés en 1024x1536.
- Aucune modification des tarifs ni du tunnel de paiement existant.

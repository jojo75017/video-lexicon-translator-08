# Ebook Comic Agent — page exclusive 47 € (au lieu de 97 €)

Offre **externe**, indépendante de vos produits EbookStudio : la page présente Ebook Comic Agent et envoie vers votre lien de vente `trafic-affiliation.com/comic_agent_ia`. Aucun paiement n'est encaissé par EbookStudio, aucun accès n'est déverrouillé dans l'application.

## 1. Nouvelle page `/comic-agent`

Contenu tiré de votre script vidéo, en français, structure page de vente complète :

- Bandeau haut « En exclusivité — lancement » avec date de fin et compte à rebours.
- Accroche : « Créez et vendez des bandes dessinées avec l'IA — aucun talent de dessin requis ».
- Votre vidéo de présentation, dans un cadre éditorial (celle que vous venez d'envoyer).
- Le problème (des mois de travail, savoir dessiner, publier, traduire) puis la solution.
- Les 7 modules : Agent BD, Créateur de couvertures, Cohérence des personnages, Studio de coloriage, Packs d'activités, Suite marketing, Traducteur 12 langues.
- Les 3 bonus de lancement (100 prompts 197 €, 50 couvertures 297 €, formation KDP & Etsy 397 € — total 891 €).
- Prix : **97 € barré → 47 €**, paiement unique, accès à vie, garantie 30 jours.
- « Pour qui ? » : débutants, auteurs indépendants, vendeurs e-commerce, illustrateurs (+ « plus de 2 400 créateurs »).
- FAQ, licence commerciale 100 % des droits, boutons d'achat répétés vers le tunnel externe.
- Mention claire « offre partenaire, paiement et accès sur le site de l'éditeur ».

Palette et typographie du site (émeraude & or, éditoriale premium), pas de couleurs en dur.

## 2. Visuels enfants

6 images générées, mélange des deux styles demandés :
- 3 albums jeunesse : aquarelle douce, pastel, enfants et animaux souriants (3-7 ans).
- 3 planches / personnages style BD franco-belge, traits nets et couleurs vives.

Utilisées en héros, en galerie « exemples de rendus » et dans les cartes de modules. Aucun texte inventé dans les images.

## 3. Page d'accueil — encart discret

Petit encart sobre (une ligne + une vignette), placé sous le bloc principal, sans casser la mise en page :
« Très grosse nouveauté pour vos enfants — Ebook Comic Agent, 47 € au lieu de 97 € » + lien vers `/comic-agent`.

## 4. Nouveautés

Ajout dans la source unique des nouveautés : « Ebook Comic Agent — 47 € au lieu de 97 € », lien `/comic-agent`, marqué offre partenaire. Le badge NOUVEAU apparaît automatiquement.

## Détails techniques

- Nouveaux fichiers : `src/pages/comic/ComicAgentPage.tsx`, `src/data/comicAgentOffer.ts` (source unique : prix, modules, bonus, FAQ, lien du tunnel, date de fin), `src/components/comic/ComicAgentTeaser.tsx` (encart accueil).
- Route publique `/comic-agent` dans `App.tsx` + entrée dans `v3Nouveautes.ts`.
- Vidéo envoyée déposée en asset CDN (`.asset.json`), pas de binaire dans le code.
- Métadonnées de page (titre, description) pour le référencement.
- Aucune modification des offres existantes (`/bd-offre` 17 €, option Pro 47 €), de la base, des paiements ni de la sécurité.

## À me confirmer ensuite

- La date de fin exacte de l'exclusivité de lancement (sinon je mets le 30 septembre 2026).

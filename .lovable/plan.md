# Vidéo 21 — Clôture de la série + offre d'accompagnement Zoom

## Objectif
Ajouter une 21ᵉ vidéo à l'onglet « Scripts tutoriels Loom » (/admin/scripts-tutoriels) : la vidéo de clôture, à enregistrer après les 20 tutoriels, qui renvoie vers les ressources d'aide et propose l'accompagnement individuel (upsell Zoom).

## Contenu de la vidéo 21 (≈ 3-4 min, visage + écran)

1. **Clôture de la visite** — « Vous avez vu les onglets principaux. Il y en a beaucoup d'autres à découvrir : prenez le temps de les ouvrir un par un. »
2. **En cas de question, trois portes** (écran : on les montre une à une) :
   - **Ecobot** — discutez avec lui directement dans l'atelier, il répond aux questions d'usage.
   - **Les outils eux-mêmes** — chaque onglet s'explique en l'ouvrant.
   - **Les 500 questions** — la FAQ : « vous trouverez sûrement ce que vous recherchez ».
3. **Si vous êtes bloqué** — « un simple message et je vous débloque » (contact depuis l'atelier).
4. **L'accompagnement individuel (upsell)** :
   - **30 minutes de Zoom offertes** avec Georges pour démarrer (une séance par personne).
   - Ensuite : **27 € les 30 minutes** de Zoom, sur réservation.
   - Formulation honnête : c'est une option, pas une obligation ; l'atelier se suffit à lui-même.
5. **Mot de la fin** — remerciement, invitation à commencer par l'onglet qui concerne le spectateur aujourd'hui.

## Modifications techniques

- `src/data/scriptsTutorielsLoom.ts` : ajout d'un objet `ScriptTutoriel` numéro 21 (titre « Mot de la fin — où trouver de l'aide et l'accompagnement Zoom », type `visage+ecran`, durée 4 min, route « Caméra, puis Ecobot, la FAQ et la page contact ») avec les 5 sections ci-dessus, texte intégral rédigé en français. Le commentaire d'en-tête du fichier passe de « 20 tutoriels » à « 20 tutoriels + la vidéo de clôture ».
- Aucune autre modification : la page admin affiche automatiquement la nouvelle vidéo (bouton copier, case « enregistrée »), et `scriptToText` / `tousLesScriptsTexte` l'incluent sans changement.
- Pas de nouvelle page de vente Zoom dans cette étape : le script mentionne l'offre ; la page de réservation/paiement pourra venir plus tard sur demande.

## Vérification
- TypeScript passe.
- /admin/scripts-tutoriels affiche 22 scripts (0 à 21), la vidéo 21 en dernier.

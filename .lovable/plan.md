# Outil « Ebook Version Longue » réel, relié au bouton 47 €

## Objectif

Livrer un véritable outil (pas une promesse V4) qui produit un livre long : plan détaillé, chapitres rédigés un par un, couverture, puis export. Il s'ouvre uniquement pour les personnes qui ont payé les 47 € (ou un abonnement Pro/Édition, ou l'administrateur).

## Parcours

```text
/v3/offre-version-longue ── 47 € payé ──► /v3/version-longue (mes livres longs)
                                                │
                                                ▼
                                   /v3/version-longue/:id
                       1. Plan  →  2. Chapitres  →  3. Couverture  →  4. Export
```

- Sans achat, `/v3/version-longue` affiche un écran de présentation avec le bouton qui ramène à la page d'offre.
- Sur la page d'offre, si l'accès est déjà acquis, le bloc de paiement est remplacé par un bouton « Ouvrir l'outil Version Longue ».
- Après un paiement réussi, retour direct sur l'outil.

## Écran 1 — Créer le livre et son plan

Formulaire court : titre, sous-titre, public visé, ton, langue, nombre de chapitres (3 à 40, avertissement au-delà de 30) et longueur visée par chapitre (standard 1 500-2 500 mots, longue 2 500-4 000 mots).
Un bouton « Générer le plan » produit le sommaire hiérarchisé (chapitres + points clés), affiché et modifiable : renommer un chapitre, réordonner, supprimer, ajouter.

## Écran 2 — Chapitres

Liste des chapitres avec état (à écrire / en cours / rédigé) et nombre de mots.
- « Rédiger ce chapitre » un par un, et « Tout rédiger » qui enchaîne les chapitres en séquence avec reprise possible en cas d'interruption.
- Chaque chapitre reçoit le contexte du chapitre précédent pour garder la cohérence.
- Lecture et modification du texte dans la page, enregistrement automatique.
- Compteur global : mots totaux et estimation de pages.

## Écran 3 — Couverture

Réutilise la génération de couverture déjà en place, puis lien direct vers l'éditeur de couverture existant pour ajuster titre, sous-titre et auteur.

## Écran 4 — Export

Téléchargement du manuscrit complet en Word et PDF avec les mêmes outils d'export que le reste de l'application, plus une copie Markdown. Rien de nouveau côté serveur.

## Vérité affichée

Sur la page d'offre, les cartes de modules passent de « Disponible avec la V4 » à « Inclus » uniquement pour ce qui fonctionne réellement à la livraison (plan, chapitres, couverture, exports). La suite marketing garde sa mention V4 si elle n'est pas branchée.

## Détails techniques

- Réutilisation de l'infrastructure existante `cs_projects` / `cs_chapters` et des fonctions `cs-generate-outline`, `cs-write-chapter`, `cs-generate-cover` : aucune nouvelle table, aucune migration.
- Marquage des projets longs par un champ existant libre (`tone`/métadonnées du projet) ou un préfixe de projet, afin de séparer la bibliothèque Version Longue du ContentStudio sans toucher au schéma.
- Nouveau hook `useEbookLongFormAccess` calqué sur `useBdComicAccess` : admin (hors aperçu abonné), plans Pro/Édition, ou droit `module_entitlements` du module Version Longue.
- Ajout de la correspondance explicite `ebook_version_longue → ebook-version-longue` dans `UPSELL_PACK_MODULES` du webhook de paiement (le repli actuel fonctionne déjà, la correspondance rend le droit lisible), puis redéploiement de cette fonction.
- Nouvelles pages `src/pages/v3/version-longue/` (bibliothèque + projet) et routes `/v3/version-longue` et `/v3/version-longue/:id` derrière la même protection que les autres outils V3.
- Ajout d'un paramètre de longueur visée à `cs-write-chapter` (valeur par défaut inchangée pour ContentStudio), et redéploiement.
- Entrée de barre latérale « Version Longue » sous l'entrée d'offre existante.
- Aucun changement aux prix, à la sécurité, aux calculs KDP, aux couvertures existantes, à la BD ou aux autres modules.

## Contrôles avant livraison

- Compte sans achat : l'outil reste verrouillé et renvoie vers l'offre.
- Compte avec droit : création d'un projet, plan généré, un chapitre rédigé réellement vérifié en base, couverture générée, exports téléchargés.
- Vérification que le bouton 47 € ouvre toujours le paiement et mène à l'outil après succès.
- Contrôle ordinateur et mobile, plus deux captures.

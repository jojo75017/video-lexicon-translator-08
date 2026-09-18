# Vos 21 scripts Loom : la présentation + 20 tutoriels de 5 minutes

## Ce que vous obtenez

Un nouvel onglet réservé à vous, « Scripts tutoriels Loom », dans votre espace d'administration. Il contient 21 scripts prêts à lire à voix haute, chacun calibré pour 5 minutes maximum (environ 650 mots, débit calme).

Chaque script est présenté dans une carte avec :
- la durée visée et le type de vidéo (« visage + écran » ou « écran seul »),
- l'adresse de la page à ouvrir avant d'enregistrer,
- le texte à lire, découpé en accroche / démonstration / conclusion,
- les indications « À l'écran : … » pour savoir quoi cliquer et quand,
- un bouton « Copier » par script, et un bouton « Copier tout ».

Un petit tableau en haut récapitule l'ordre d'enregistrement et l'avancement (vidéo faite / à faire), coché depuis votre navigateur.

## Vidéo 0 — Votre présentation (5 minutes, visage)

Plan en 5 temps, une minute chacun :
1. Qui vous êtes : auteur KDP, pourquoi vous avez fabriqué l'outil.
2. Le problème réel : un manuscrit écrit n'est pas un livre publiable.
3. Ce qu'est EbookStudio : un atelier, de l'idée au fichier accepté par Amazon.
4. Ce que vous allez montrer : les onglets dans l'ordre de fabrication.
5. La transition : « Voilà ma présentation. Place aux onglets : on passe sur mon écran, je vous les présente dans l'ordre, à vous ensuite de faire comme vous voulez. »

## Les 20 tutoriels prioritaires (ordre d'enregistrement)

Ordre calé sur votre menu : Créer, Écrire, Habiller, Publier, Vendre, Réglages.

```text
 1. Par où commencer + la page d'accueil V3            visage + écran
 2. Ebookstudio-Génie : créer mon livre                écran
 3. Le sommaire construit avec l'IA                    écran
 4. Studio Pro : la Bible du livre puis la rédaction   écran
 5. Personnages et importation d'un manuscrit          écran
 6. Le parcours des agents : écrire le livre entier    visage + écran
 7. Corriger mon livre (manuscrit terminé)             écran
 8. BookPerfect et l'assistant Ebookstudio             écran
 9. Traduction en 10 langues                           écran
10. Mes livres : reprendre, sauvegarder, avancer       écran
11. Studio de couverture : l'illustration              visage + écran
12. Couverture : textes, dos, quatrième, export        écran
13. Illustrations, BD et mockup 3D                     écran
14. Données KDP et export du fichier final            visage + écran
15. Fiche Audit : description, mots-clés, contenu A+   écran
16. Mots-clés percutants (7 mots-clés KDP)             écran
17. Publicité Amazon : vos campagnes prêtes            écran
18. Radar de niches : un thème, 10 idées               écran
19. Plan de lancement : vos 30 premiers jours          écran
20. Réglages, clés API et forfaits (Plume / Édition)   visage + écran
```

## Règles de rédaction appliquées

- Français naturel, vouvoiement, ton « maison d'édition », sans promesse d'argent facile.
- Uniquement des onglets et fonctions qui existent réellement dans le projet.
- Tarifs conformes : Plume 27 €/mois (270 €/an), Édition 47 €/mois (470 €/an), 2 mois offerts en annuel, ancien client V2 −20 % à vie, ouverture le 1er octobre.
- Modules payants signalés comme tels quand ils apparaissent à l'écran.
- Chaque script tient en 5 minutes : phrases courtes, une seule idée par paragraphe.

## Les robots (plus tard)

Chaque script prévoit un emplacement « présentateur » (nom + tête de robot) laissé vide pour l'instant, afin d'ajouter les visuels sans réécrire les textes.

## Détails techniques

- Nouveau fichier de contenu `src/data/scriptsTutorielsLoom.ts` : 21 entrées typées (numéro, titre, durée, type visage/écran, route, sections, notes écran).
- Nouvelle page `src/pages/admin/AdminScriptsTutorielsPage.tsx`, route `/admin/scripts-tutoriels` protégée par `AdminGate`, ajoutée au menu d'administration à côté du script Loom existant.
- Avancement stocké dans le navigateur (`localStorage`), aucune table ni fonction serveur.
- Aucun appel IA, aucun crédit consommé : les textes sont écrits à la main.
- Aucune modification des paiements, de la base de données, de la sécurité, des calculs KDP ni du Cover Studio.

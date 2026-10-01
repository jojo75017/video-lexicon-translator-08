# Studio Album Illustré 3–6 ans

## Objectif
Ajouter un module distinct de « Histoires courtes » pour créer une seule histoire continue, illustrée de la première à la dernière page, jusqu’à 30 pages.

## Parcours proposé
1. L’auteur choisit 16, 20, 24, 28 ou 30 pages et décrit son histoire.
2. Il crée un ou plusieurs personnages : apparence, vêtements, couleurs et signes distinctifs.
3. Le studio génère une fiche visuelle de référence pour chaque personnage. L’auteur la valide avant de poursuivre.
4. L’histoire est découpée page par page avec 1 à 3 phrases et une scène précise.
5. Les illustrations sont produites avec les mêmes références visuelles sur toutes les pages.
6. Chaque texte et chaque image reste modifiable ou régénérable séparément.
7. Le livre est exporté au format album carré pour KDP.

## « Commence ici »
Ajouter un nouvel encart indépendant :
- **Léonie — Créatrice d’albums illustrés**
- Mission : « Une histoire suivie, jusqu’à 30 pages, avec vos personnages verrouillés. »
- Livrables : scénario page par page, personnages cohérents, album KDP.
- Bouton : **Commencer avec Léonie**.

L’encart de Noémie reste inchangé pour les recueils d’histoires courtes.

## Interface du nouveau studio
- Étape 1 : livre, âge, sujet, morale, nombre de pages et style graphique.
- Étape 2 : personnages verrouillés et images de référence à valider.
- Étape 3 : chemin de fer des 16 à 30 pages, éditable avant illustration.
- Étape 4 : génération et contrôle visuel page par page.
- Étape 5 : couverture, quatrième de couverture et export KDP.
- Indicateurs clairs : pages écrites, personnages validés, images terminées.

## Détails techniques
- Nouvelle route dédiée `/v3/create/album-illustre`, sans modifier le module Histoires courtes.
- Nouveau brouillon et nouveau type de projet afin qu’un album ne remplace jamais un recueil existant.
- Génération du récit structurée en scènes continues, avec contrôle du nombre exact de pages.
- Chaque demande d’image transmet la fiche du personnage et son image de référence ; une page peut être relancée sans toucher aux autres.
- Sauvegarde progressive pour reprendre un album interrompu.
- Réutilisation des exports jeunesse existants, adaptés à l’histoire continue et au nombre de pages choisi.

## Vérification
- Tester un album de 30 pages avec un héros présent du début à la fin.
- Vérifier la continuité du récit, le nombre exact de pages et la conservation des vêtements/couleurs.
- Vérifier l’encart Léonie depuis « Commence ici » sur ordinateur et mobile.
- Vérifier que « Histoires courtes » fonctionne toujours séparément.

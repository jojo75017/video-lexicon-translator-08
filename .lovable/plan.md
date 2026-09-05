# Plan — Clarifier et mettre en avant le Studio de couverture V4

## Objectif
Donner à l’abonné un point d’entrée évident vers la création de couverture, réduire fortement la bannière d’accueil et expliquer clairement ce que fait chaque choix.

## Schéma du parcours

```text
BARRE LATÉRALE
│
├── Bouton spécial orange, toujours visible
│   « Créer ma couverture » — badge V4
│   Explication courte : « Assistant guidé en 3 étapes »
│   └── ouvre /v3/couverture-express
│
└── Rubrique « Habiller & exporter »
    └── « Mes couvertures »
        Explication : « Retrouver et modifier mes projets »
        └── ouvre /v3/mes-couvertures

ACCUEIL V3
│
└── Bannière compacte « Studio de couverture V4 »
    ├── Une image éditoriale plus petite
    ├── Une promesse courte et lisible
    └── Trois choix expliqués
        │
        ├── 1. « Créer ma couverture »
        │      Pour être guidé du titre jusqu’au téléchargement
        │      └── /v3/couverture-express
        │
        ├── 2. « Mes couvertures »
        │      Pour retrouver, modifier ou télécharger un projet existant
        │      └── /v3/mes-couvertures
        │
        └── 3. « Découvrir l’offre 67 € »
               Pour voir ce qui est inclus avant l’achat
               └── tunnel de paiement actuel
```

## 1. Bouton spécial dans la barre latérale
- Installer le bouton juste sous l’en-tête « Espace auteur », avant les rubriques repliables : il ne sera plus caché dans une longue liste.
- Utiliser un traitement orange distinctif, une icône de couverture et un badge « V4 ».
- Afficher le libellé complet lorsque la barre est ouverte et conserver l’icône avec une info-bulle lorsqu’elle est repliée.
- Faire pointer ce bouton directement vers l’assistant simple `/v3/couverture-express`.
- Renommer l’entrée actuelle de la rubrique en « Mes couvertures » pour éviter deux boutons qui semblent mener au même endroit.

## 2. Bannière d’accueil plus professionnelle
- Remplacer le grand bloc actuel par un bandeau éditorial compact, environ deux fois moins haut.
- Conserver l’univers maison d’édition, mais avec moins d’effets, moins de texte et une hiérarchie plus sobre.
- Garder une vraie couverture comme signal visuel, dans un format contenu qui ne repousse plus le reste de la page.
- Résumer la promesse en une phrase : création guidée, illustration, textes et téléchargement.

## 3. Explication de chaque bouton
- Chaque bouton aura un titre d’action explicite et une courte phrase visible juste dessous ; l’utilisateur ne devra pas deviner la différence.
- Ordre recommandé :
  1. **Créer ma couverture** — choix principal orange.
  2. **Mes couvertures** — choix secondaire pour les projets existants.
  3. **Découvrir l’offre 67 €** — choix commercial clairement séparé des outils.
- Ne plus employer « Éditeur avancé » sur la bannière d’accueil : ce terme fait peur aux débutants. L’éditeur détaillé restera accessible depuis chaque projet.

## 4. Cohérence des autres accès
- Sur la page « Mes couvertures », harmoniser les deux actions actuelles :
  - « Créer avec l’assistant » devient « Créer ma couverture » ;
  - « Créer une couverture » devient « Créer un projet manuellement », avec une courte explication.
- Ne modifier aucune fonction de création, génération, export ou paiement : uniquement les intitulés, la hiérarchie et les accès visibles.

## 5. Vérification
- Tester le bouton spécial avec la barre ouverte puis repliée.
- Vérifier les trois destinations de la bannière.
- Vérifier que les explications restent lisibles sur ordinateur et mobile.
- Fournir une capture de l’accueil avec la nouvelle bannière et une capture de la barre latérale avec le bouton V4.

## Périmètre technique
- Présentation et navigation uniquement.
- Aucun changement de base de données, sécurité, crédits IA, génération d’image, export, calcul KDP ou paiement.

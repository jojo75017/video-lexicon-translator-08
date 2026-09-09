# Rendre le livre visible en permanence et simplifier les indices

Le livre **« L’Enfant de Valloires »** contient actuellement **5 textes enregistrés**, **10 échanges avec le Génie** et **34 indices**, mais **aucune correction n’est encore validée**. L’aperçu crème n’affiche aujourd’hui que les corrections validées : c’est pourquoi il paraît vide.

## Le nouvel écran, simplement

```text
┌──────────────────────────────────────────────────────────────┐
│ ÉCRIRE OU COLLER UN NOUVEAU PASSAGE                         │
│ [ Votre texte…                                             ] │
│                                      [ Envoyer au Génie ]     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ VOTRE LIVRE EN COURS                         5 textes · X mots│
│ Fond crème                                                   │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Texte 1 — votre texte actuel                            │▲│ │
│ │ Texte 2 — votre texte actuel                            │█│ │
│ │ Texte 3 — version corrigée si elle existe               │█│ │
│ │ Texte 4…                                                │▼│ │
│ └──────────────────────────────────────────────────────────┘ │
│ Le livre reste visible même avant toute validation.          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ TEXTE SÉLECTIONNÉ                                            │
│ Vos mots              →       Proposition corrigée           │
│ [Modifier]                    [Modifier] [Valider pour livre] │
│                              [Ajouter un emoji]               │
└──────────────────────────────────────────────────────────────┘

Repères à respecter (replié) : Michel = frère · Anne = sœur…
```

## 1. Afficher réellement le livre

- Remplacer le petit aperçu caché derrière « Lire mon livre » par un grand bloc **« Votre livre en cours »**, directement visible sous la zone d’écriture.
- Afficher immédiatement les 5 textes déjà enregistrés, même s’ils ne sont pas encore corrigés ou validés.
- Pour chaque passage : montrer la version corrigée et validée quand elle existe ; sinon montrer les mots d’origine, sans rien masquer.
- Garder le fond crème pour toute la lecture du livre afin que l’auteur reconnaisse clairement son manuscrit.
- Indiquer discrètement l’état de chaque passage : `Vos mots`, `Correction à valider` ou `Validé dans le livre`.

## 2. Ajouter un ascenseur adapté aux livres longs

- Donner au bloc crème une hauteur confortable mais limitée à l’écran.
- Ajouter un ascenseur vertical à l’intérieur du livre pour parcourir des dizaines de textes sans allonger toute la page.
- Conserver la position de lecture pendant une correction ou une validation, afin d’éviter de revenir en haut.
- Garder le compteur de textes et de mots toujours visible au-dessus de la zone de lecture.

## 3. Rendre les indices compréhensibles et discrets

- Renommer « indices » en **« Repères que le Génie doit respecter »**.
- Ajouter une phrase courte : « Ils empêchent le Génie de changer ou d’oublier vos prénoms, liens familiaux, lieux, dates et faits. »
- Replier cette longue liste par défaut dans un seul bouton avec son nombre : `Voir les 34 repères`.
- Ne pas afficher ces repères au milieu du livre : ils servent seulement de garde-fou pendant la correction.
- Conserver la possibilité de corriger un repère erroné, sans modifier le récit automatiquement.

## 4. Les emojis, au choix, jamais en excès

- Garder un interrupteur clair, mémorisé par livre : **« Quelques emojis dans mon texte »**.
- Quand il est allumé, le Génie peut en placer lui-même, car il sait où ils tombent bien : **au maximum un par passage**, jamais plusieurs de suite, jamais dans un passage grave (deuil, maladie, accident), jamais en début de phrase.
- Quand il est éteint, aucun emoji n'est ajouté par le Génie.
- Ajouter aussi un bouton **« Retirer les emojis de ce texte »** sur chaque passage, pour les enlever d'un clic sans relancer de correction.
- Ajouter un petit bouton **« Ajouter un emoji »** dans les zones de modification, pour en placer soi-même où l'on veut.
- Tout emoji conservé apparaît dans le livre crème et dans les exports.


## 5. Ne rien perdre et reprendre au même endroit

- Réutiliser les textes déjà enregistrés dans le brouillon actuel : aucune nouvelle saisie ne sera demandée.
- Conserver la sauvegarde automatique après modification, correction, validation ou ajout manuel d’un emoji.
- Garder visibles `Enregistrer maintenant` et `Reprendre ce livre plus tard` sous le livre en cours.

## Détails techniques

- `V3PassageCorrector` affichera `narrativeForBook()` en permanence, avec une zone crème à défilement vertical ; les passages non validés resteront inclus grâce à leur version source.
- La liste d’édition des textes recevra elle aussi une hauteur maximale et un défilement pour éviter une page interminable.
- Les `factMemory` seront déplacés dans un panneau replié et renommés sans changer leur rôle dans les demandes envoyées au Génie.
- Le champ `emojis` existant sera ignoré/désactivé dans l’interface ; aucune nouvelle correction IA ne sera lancée pour ajouter un emoji.
- L’insertion manuelle se fera dans les zones de modification existantes et sera sauvegardée comme le reste du texte.
- Aucun changement de base, sécurité, paiement, tarif, calcul KDP ou crédit IA.

## Vérification

- Ouvrir le projet actuel et confirmer que ses 5 textes apparaissent immédiatement sur fond crème.
- Faire défiler le livre et la liste des textes avec leurs ascenseurs respectifs.
- Vérifier que les 34 repères sont repliés et que leur utilité est expliquée.
- Ajouter manuellement un emoji dans un texte, enregistrer, recharger puis reprendre le livre.
- Confirmer que le Génie n’ajoute aucun emoji automatiquement.

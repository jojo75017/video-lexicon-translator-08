# Bouton « Effacer la correction et repartir à zéro »

## Problème confirmé

Le correcteur sauvegarde automatiquement l’avancement après chaque chapitre et le restaure à l’ouverture. Cette sauvegarde existe à la fois dans le stockage local du navigateur et dans sa base de stockage interne pour les gros manuscrits.

Aujourd’hui, il n’existe aucune fonction pour supprimer ces deux copies ensemble. Résultat : une correction interrompue ou bloquée réapparaît et le bouton « Reprendre la correction » repart de cet ancien état.

## Ce qu’on va ajouter

### 1. Vrai effacement de la sauvegarde du correcteur

Ajouter au système de sauvegarde une fonction dédiée qui supprime, pour le correcteur uniquement :

- la copie locale ;
- la copie pour gros manuscrits ;
- l’éventuel document temporaire en attente d’import.

Cette action ne touche jamais :

- au fichier original sur votre ordinateur ;
- au livre d’origine dans « Mes livres » ;
- aux livres déjà terminés dans « Livres corrigés » ;
- aux autres projets EbookStudio.

### 2. Bouton rouge visible

À côté de « Corriger tout le livre / Reprendre la correction », ajouter :

**Effacer la correction et repartir à zéro**

Le bouton est disponible dès qu’un manuscrit ou une ancienne progression est chargé. Il est désactivé pendant qu’un appel IA est encore en cours ; le bouton « Interrompre » reste utilisé d’abord pour arrêter proprement la requête.

### 3. Confirmation claire avant effacement

Afficher une confirmation :

> Effacer toute la correction en cours ?
>
> Les chapitres corrigés, les erreurs et la progression seront supprimés. Votre manuscrit original et vos livres enregistrés resteront intacts.

Boutons : **Annuler** / **Oui, repartir à zéro**.

### 4. Remise à zéro complète de l’écran

Après confirmation :

- supprimer les deux sauvegardes du correcteur ;
- remettre tous les chapitres à l’état « à corriger » avec leur texte original ;
- vider les corrections, erreurs, mots latins détectés, fins complétées et validations ;
- remettre la progression à 0 % ;
- fermer les chapitres et l’éditeur manuel ouverts ;
- effacer les anciens messages « livre retrouvé » / « livre enregistré » ;
- conserver le manuscrit importé à l’écran ;
- afficher : **« Correction effacée. Vous pouvez relancer tout le livre depuis le chapitre 1. »**

Le nouvel état vierge devient ensuite la seule sauvegarde. Une actualisation ne doit donc plus faire revenir l’ancienne correction.

### 5. Redémarrage réellement depuis le chapitre 1

Après la remise à zéro, le bouton principal redevient **Corriger tout le livre**. Le moteur retraitera chaque chapitre, y compris ceux auparavant marqués comme terminés ou en échec.

## Vérifications

1. Lancer quelques chapitres puis interrompre.
2. Cliquer sur « Effacer la correction et repartir à zéro ».
3. Vérifier la progression à 0 et tous les chapitres à l’état initial.
4. Actualiser la page : l’ancienne progression ne doit pas revenir.
5. Relancer : le chapitre 1 doit être le premier traité.
6. Vérifier que le manuscrit original et les livres déjà enregistrés n’ont pas été supprimés.
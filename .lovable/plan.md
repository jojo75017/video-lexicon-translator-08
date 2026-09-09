# Un récit fidèle, modifiable et réellement sauvegardé

## Diagnostic confirmé

Le texte saisi aujourd’hui n’est pas perdu : le dernier envoi contient **858 caractères** et il est bien conservé dans l’historique avec un instantané du récit de même longueur.

En revanche, ce brouillon n’est relié à **aucun livre enregistré** : son identifiant de livre est vide. La page « Mes livres » ne peut donc pas le retrouver, et la promesse « reprendre quand vous voulez » est actuellement fausse à ce stade.

L’écran explique aussi la confusion actuelle :
- le texte original et la proposition corrigée sont affichés en lecture seule ;
- on ne peut ni corriger un prénom ni insérer un oubli dans un texte déjà envoyé ;
- le premier envoi sert d’abord à créer une fiche et à poser une autre question ;
- la véritable correction se trouve plus bas, dans un autre bloc ;
- le récit destiné au livre est replié dans « Votre livre en direct », donc l’auteur ne voit pas clairement ce qui entre réellement dans son manuscrit.

## Nouveau parcours simple

```text
┌──────────────────────────────────────────────────────────────────────┐
│ MON RÉCIT — sauvegardé automatiquement                               │
│                                                                      │
│  Question du Génie : « Comment s’appellent votre frère et votre      │
│  sœur ? »                                                            │
│                                                                      │
│  [ J’écris ma réponse, un nouveau souvenir ou un passage oublié… ]  │
│  [ Enregistrer mon texte ]                                           │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│ TEXTE 3 — MES MOTS                                                   │
│                                                                      │
│  Zone entièrement modifiable : noms, dates, lieux, oublis, ordre…   │
│                                                                      │
│  [ Modifier ]  [ Ajouter un passage ici ]  [ Corriger avec le Génie ]│
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│ PROPOSITION CORRIGÉE                                                 │
│                                                                      │
│  Comparaison avec l’original + faits conservés                       │
│                                                                      │
│  [ Modifier ] [ Refaire ] [ Garder mon original ] [ Valider ]        │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│ MON LIVRE EN COURS                                                   │
│  Texte 1 ✓  Texte 2 ✓  Texte 3 ✓                                    │
│  Le contenu réellement retenu est visible ici, dans l’ordre.         │
│                                                                      │
│  [ Continuer mon récit ]  [ Construire le sommaire quand j’ai fini ] │
└──────────────────────────────────────────────────────────────────────┘
```

## 1. Écrire d’abord, corriger ensuite

- Le bouton principal devient **« Enregistrer mon texte »**, pas « Envoyer au Génie ».
- Chaque réponse, souvenir ou passage oublié est immédiatement ajouté au récit et sauvegardé avant tout appel IA.
- Le Génie peut continuer à poser une question utile, mais cette question reste au-dessus de la même zone de saisie : la réponse rejoint automatiquement le livre.
- Ajouter un bouton visible **« Ajouter un passage oublié »** entre deux textes ou à la fin, sans devoir recommencer le livre.
- Ne jamais transformer automatiquement le texte au moment de l’envoi : l’auteur relit d’abord ses propres mots.

## 2. Rendre chaque texte entièrement modifiable

- Afficher chaque envoi sous la forme **Texte 1, Texte 2, Texte 3…**, dans son ordre réel.
- Transformer « Vos mots » en véritable zone modifiable avant correction.
- Enregistrer immédiatement toute modification apportée à un prénom, une date, un lieu, un lien familial ou un événement.
- Après modification, invalider uniquement l’ancienne proposition corrigée de ce texte, jamais les autres textes.
- La proposition du Génie reste elle aussi modifiable avant validation.
- Conserver toujours les deux versions : **mes mots d’origine** et **version retenue pour le livre**.

## 3. Obliger le Génie à suivre les personnes et les faits

- Construire une **mémoire factuelle du récit** à partir des informations confirmées : personnes, liens familiaux, dates, lieux et événements.
- Afficher cette mémoire dans un petit bloc « Ce que le Génie doit respecter », avec les prénoms du frère, de la sœur et les autres faits déjà donnés.
- Permettre à l’auteur de corriger directement une information de cette mémoire.
- Transmettre cette mémoire complète à chaque correction, question, sommaire et chapitre, même lorsque le récit devient très long.
- Si deux informations se contredisent, le Génie pose une question au lieu de choisir ou d’inventer.
- Avant de proposer une correction, vérifier que tous les prénoms, lieux, dates et liens familiaux du texte original sont encore présents. Une proposition qui en perd un est refusée et signalée.

## 4. Montrer immédiatement ce qui entre dans le livre

- Remonter **« Mon livre en cours »** juste sous les textes ; ne plus cacher le récit principal dans un bloc replié.
- Après validation, le texte corrigé apparaît immédiatement dans le livre en cours.
- Si l’auteur choisit « Garder mon original », c’est l’original qui apparaît immédiatement.
- Afficher pour chaque texte un état sans ambiguïté : **à relire**, **correction proposée**, **validé dans le livre**.
- Ajouter **« Revenir à l’écriture »** depuis le sommaire et la rédaction afin d’insérer un oubli à tout moment.
- Lorsqu’un ajout est fait après le sommaire, signaler précisément quels nouveaux textes doivent encore être rattachés à un chapitre.

## 5. Sauvegarder un vrai brouillon dès le premier texte

- Dès le premier enregistrement, créer automatiquement un brouillon privé dans « Mes livres » et lui attribuer un identifiant stable.
- Relier immédiatement à cet identifiant : récit original, corrections, validations, mémoire des personnes, conversation, étape en cours et sommaire.
- Enregistrer après chaque action importante et afficher un état réel : **Enregistrement…**, **Sauvegardé à 15:42**, ou **Échec — réessayer**.
- Ne plus ignorer silencieusement une erreur de sauvegarde distante.
- Garder la copie du navigateur comme secours, mais considérer le brouillon du compte comme source principale.
- À l’ouverture depuis « Mes livres », restaurer l’intégralité du brouillon, pas seulement le titre et les chapitres terminés.
- Le bouton **« Reprendre mon livre »** doit ouvrir l’identifiant exact du brouillon, et non un brouillon local anonyme.

## 6. Simplifier l’écran

- Une seule zone de saisie pour raconter, répondre au Génie ou ajouter un oubli.
- Une seule liste chronologique des textes.
- Une seule action IA par texte : **« Corriger avec le Génie »**.
- Une seule décision ensuite : **valider la correction** ou **garder l’original**.
- Le sommaire reste l’étape suivante, seulement lorsque l’auteur clique **« J’ai fini de raconter »**.
- Les réglages techniques, la fiche commerciale et les options avancées restent repliés.

## Détails techniques

- Ajouter au livre enregistré un instantané privé du brouillon de création : fiche, `sourceText`, textes corrigés, validations, mémoire factuelle, étape active et sommaire.
- Créer ou mettre à jour le livre dès le premier texte, puis propager son identifiant à toutes les conversations et versions de sommaire.
- Remplacer les sauvegardes silencieuses par des opérations contrôlées avec remontée d’erreur et nouvelle tentative.
- Ajouter des opérations stables pour modifier, insérer et réordonner les textes sans casser leur identité ; ne plus indexer les corrections uniquement par leur position numérique.
- Faire produire au Génie une mémoire factuelle structurée en même temps que son analyse, puis faire corriger/rédiger à partir du texte complet et de cette mémoire.
- La validation factuelle reste déterministe : comparer les entités du texte source avec celles de la proposition avant de l’accepter.
- Conserver les règles existantes : français uniquement, aucune invention, aucun résumé, maximum 40 chapitres, et aucune modification des prix, paiements, accès, sécurité ou calculs KDP.

## Vérification avant livraison

1. Saisir un premier récit court, puis confirmer qu’il apparaît comme **Texte 1**, modifiable et sauvegardé.
2. Ajouter les prénoms du frère et de la sœur, corriger une faute dans un prénom avant l’appel IA, puis vérifier que les deux prénoms restent dans la proposition et dans « Mon livre en cours ».
3. Ajouter un passage oublié entre deux textes et vérifier que l’ordre du récit est conservé.
4. Répondre à une question du Génie et vérifier que la réponse apparaît aussi dans le livre, pas seulement dans la conversation.
5. Fermer puis rouvrir la page depuis « Mes livres » : retrouver les originaux, corrections, validations, personnes, conversation, sommaire et étape exacte.
6. Simuler une erreur IA : le texte original reste sauvegardé et modifiable.
7. Simuler une erreur d’enregistrement : afficher clairement l’échec et permettre de réessayer, sans prétendre que le livre est sauvegardé.
8. Faire les vérifications sans lancer de génération de chapitre ni de test consommant inutilement des crédits.

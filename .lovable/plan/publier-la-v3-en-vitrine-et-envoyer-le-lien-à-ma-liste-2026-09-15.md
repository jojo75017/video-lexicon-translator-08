# Publier la V3 en « vitrine » et envoyer le lien à ma liste

Objectif : les futurs abonnés voient la V3 en vrai, sans pouvoir rien lancer ni acheter.

## 1. Ce qui existe déjà (vérifié)

- L'interrupteur d'ouverture en base est bien sur **fermé** (ouverture prévue le 1er octobre 2026, 8 h).
- Tant qu'il est fermé, un visiteur est en **mode contemplation** : il peut lire les pages
  de présentation, mais chaque clic sur un bouton d'outil affiche
  « La V3 ouvre le 1er octobre 2026 » au lieu d'agir.
- Les pages libres à la visite : accueil V3, Pourquoi, Réalité KDP, L'offre, Nouveautés,
  Commence ici, Workflow, Fonctionnalités, Contact.

## 2. Ce que je fais

1. **Publier le site** tel quel : rien à débloquer, la V3 devient visible en ligne pour
   tout le monde, en lecture seule.
2. **Vérifier après publication**, en visiteur non connecté, sur le site public :
   la page V3 s'affiche, la bannière du 1er octobre est là, et un clic sur un bouton
   d'outil ne fait rien d'autre qu'afficher le message d'ouverture.
3. **Préparer le message pour ma liste** : un texte court prêt à copier, avec un lien de
   suivi `ebookstudio.fr/r/...` qui mène à la V3, pour compter les clics.
   Le lien est ajouté aux messages de la séquence de lancement déjà en place ; je ne
   déclenche aucun envoi — c'est vous qui envoyez quand vous voulez.

## 3. Points de vigilance

- Aucun prix, paiement, calcul KDP, base de données ni sécurité n'est modifié.
- Les abonnés existants continuent d'arriver sur leur V2 comme aujourd'hui.
- Vous gardez l'accès complet en tant qu'admin ; seuls les visiteurs sont en lecture seule.
- Le 1er octobre, il suffira de basculer l'interrupteur depuis votre tableau de bord
  « Lancement V3 » : aucune republication nécessaire.

## 4. Détails techniques

- `launch_settings.v3_open = { enabled: false }` : source unique de l'état d'ouverture,
  lue par `useV3Open` / `v3OpenState.ts`.
- Verrous existants réutilisés sans changement : `V3ContemplationMode` (interception des
  clics en phase capture), `V3LockedGate`, `V3_PUBLIC_PREVIEW_PATHS`.
- Publication via l'outil de publication du projet ; vérification Playwright sur l'URL
  publique en session anonyme.
- Lien de suivi : nouvelle entrée dans la table de redirections `/r/...` déjà utilisée
  pour les emails, pointant vers `/v3`.

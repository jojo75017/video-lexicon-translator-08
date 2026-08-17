# Mémoire de conversation + « Reprendre mon livre »

## Le problème constaté

Dans le Génie (dialogue IA) et le Sommaire IA, chaque envoi remplace tout : la zone de saisie se vide, les questions précédentes disparaissent et seule la dernière fiche reste affichée. Rien ne conserve l'historique de ce que vous avez dit ni des corrections apportées par l'IA. Résultat : impossible de relire l'échange, et impossible de revenir des jours plus tard là où on s'était arrêté — bloquant pour un livre de vie qui s'écrit sur des semaines.

## Ce qui sera construit

### 1. Fil de conversation visible et conservé
- Le Génie devient un vrai fil : vos messages à droite, les réponses de l'IA à gauche, dans l'ordre, avec l'heure.
- À chaque tour, l'IA affiche ce qu'elle a compris et **ce qu'elle a changé** (« titre modifié », « 24 chapitres au lieu de 20 »), sous forme de courte ligne de suivi.
- Le fil reste affiché après rechargement de la page et après plusieurs jours.
- Boutons du fil : « Copier la conversation », « Repartir de zéro » (avec confirmation), et repli/dépli des anciens tours pour ne pas surcharger l'écran.

### 2. Sommaire visible en permanence à côté du dialogue
- Un panneau « Votre sommaire en cours » affiché en même temps que la conversation : liste numérotée des chapitres, mise à jour à chaque tour.
- Chaque version validée du sommaire est conservée : bandeau « Versions du sommaire » (v1, v2, v3…) avec date, et bouton « Revenir à cette version ».
- Ainsi vous voyez toujours ce que vous avez demandé, ce que l'IA a produit, et l'évolution entre les versions.

### 3. Bouton « Reprendre mon livre »
- En haut de la page d'accueil V3 et de la page de création : un encart « Reprenez là où vous vous êtes arrêté » avec le titre du livre, la date du dernier travail, l'étape en cours (idée / sommaire / rédaction / export) et l'avancement (ex. « 12 chapitres sur 25 rédigés »).
- Un bouton unique remet la fiche, le fil de conversation et le sommaire en place, à l'étape exacte.
- Un onglet « Mes livres en cours » liste tous les projets reprenables, y compris ceux commencés il y a des mois, avec bouton « Reprendre » sur chaque ligne.
- Tout est enregistré côté serveur (compte abonné), pas seulement sur l'ordinateur : on peut reprendre depuis un autre appareil.

### 4. Annonce V3 « Rédigez votre vie avec l'IA »
- Nouveau bloc sur la page d'accueil V3 et la page de vente : l'IA vous accompagne semaine après semaine, se souvient de tout ce que vous lui avez raconté, et vous reprenez votre récit de vie quand vous voulez.
- Argument central : mémoire longue durée + reprise à tout moment, ce que les outils concurrents ne font pas.

## Détails techniques

- Nouvelle table `book_conversations` : `id`, `user_id`, `project_id`, `role` (`user` / `assistant`), `content`, `brief_snapshot` (jsonb), `outline_snapshot` (jsonb), `created_at`. RLS par `auth.uid()` + GRANT `authenticated` / `service_role`.
- Nouvelle table `book_outline_versions` : `id`, `user_id`, `project_id`, `version`, `chapters` (jsonb), `created_at`, mêmes règles d'accès.
- `V3GenieDialog.tsx` : remplacement de l'état ponctuel (`brief` + `questions`) par un fil `messages[]` ; chaque `ask()`/`refine()` ajoute le message utilisateur puis la réponse, écrit en base et calcule le diff de la fiche pour la ligne « ce qui a changé ». Historique local en secours (clé `v3_genie_thread_v1`) quand l'abonné n'est pas connecté.
- `V3OutlinePanel.tsx` : à chaque validation, insertion d'une ligne dans `book_outline_versions` ; ajout d'un sélecteur de versions qui rappelle `onChange({ outline, chapters })`.
- Reprise : hook `useResumableBooks` lisant `ebook_projects` (déjà utilisé par le wizard) + dernier message de `book_conversations` ; composant `V3ResumeBookCard.tsx` inséré dans `V3HomePage.tsx` et `V3CreatePage.tsx`, et liste complète dans `V3BookManagerPage.tsx`.
- Édge function `v3-genie-brief` : accepte désormais `history` (12 derniers tours) afin que l'IA tienne compte du contexte antérieur au lieu de repartir du seul dernier message.
- Aucun changement de tarif ni de quota.

## Vérification avant livraison

- Un aller-retour de 3 messages dans le Génie : le fil reste complet après rechargement, et le sommaire affiche la bonne version.
- Fermeture puis réouverture du navigateur : l'encart « Reprendre mon livre » apparaît avec la bonne étape.
- Retour à une version antérieure du sommaire puis relance : le workflow utilise bien les chapitres restaurés.

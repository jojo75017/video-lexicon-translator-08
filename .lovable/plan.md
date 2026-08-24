# Essai gratuit 7 jours : limiter l'accès (aujourd'hui il ouvre toute la V3)

## Constat
Le palier « essai » est bien détecté (bandeau d'essai, filigrane sur les exports), mais aucune route V3 n'est restreinte pour lui : un inscrit à l'essai atteint aujourd'hui tous les modules (Cover Studio Pro, audiobook, traduction, mockup 3D, KDP Pilot, livres de jeux, histoires courtes, outils marketing…) exactement comme un abonné payant.

## Ce que l'essai doit permettre (liste blanche)
- Créer et écrire **1 seul livre** (fiche + workflow des agents)
- Voir son livre, le sauvegarder, le corriger (correction professionnelle)
- Exporter en **filigrané** (déjà en place)
- Consulter accueil V3, fonctionnalités, clés API, coordonnées, questions, forfaits, upsells, contact, kit de démarrage

## Ce que l'essai ne doit pas permettre
- 2ᵉ livre et plus (blocage au moment de la création)
- Cover Studio Pro et éditeur de couverture
- Audiobook, traduction 10 langues, mockup 3D, humanizer
- KDP Pilot / données KDP, AMS keywords, espion concurrents, catégories, royalties
- Livres spéciaux (jeux & énigmes, cherche & trouve, histoires courtes, livre illustré, biographie)
- Studio Pro hybride, posts sociaux, acquisition, avis clients, galerie/profil auteur public

## Mise en œuvre
1. **Garde d'essai** : nouveau composant de garde qui, pour un utilisateur en essai (non admin, non abonné payant), affiche un écran « Réservé aux abonnés » au lieu de la page — titre clair, rappel de ce qui est inclus dans l'essai, bouton vers l'offre. Aucune page n'est supprimée : l'utilisateur voit ce qu'il rate.
2. **Application aux routes** : enrober les routes V3 de la liste « non permise » ci-dessus avec cette garde, en gardant intactes les routes de la liste blanche.
3. **Limite d'un livre** : à la création d'un nouveau livre, si l'utilisateur en essai possède déjà un livre, message + redirection vers son livre existant et vers l'offre.
4. **Sidebar et grille des fonctionnalités** : afficher un cadenas discret sur les entrées réservées aux abonnés pendant l'essai, plutôt que des liens qui semblent disponibles.
5. **Fin d'essai (J+7)** : lecture seule déjà gérée ; on ajoute que la création et la correction sont aussi bloquées après expiration, avec le même écran d'offre.
6. **Vérification** : parcours en navigateur avec un compte d'essai — une route autorisée s'ouvre, une route réservée affiche l'écran d'offre, l'export reste filigrané.

## Détails techniques
- Nouveau `src/components/auth/TrialGate.tsx` s'appuyant sur `useTrialAccess` + `useAdminAccess` (admin et abonnés payants passent toujours).
- Tant que `loading` est vrai, on patiente : jamais de blocage d'un abonné payant sur un retard de session.
- Enrobage à l'intérieur des `V3LockedGate` existants dans `src/App.tsx` (pas de nouvelle logique de routage).
- Écran d'offre réutilisable pointant vers `/v3/forfaits`.

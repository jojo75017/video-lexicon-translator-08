# Accueil « maison d'édition » — plan en image

## L'esquisse

Voici la maquette dessinée de la nouvelle page d'accueil :

![Esquisse de la page d'accueil](.lovable/esquisse-accueil.png)

## Ce que l'esquisse montre (de haut en bas)

```text
┌──────────────────────────────────────────────┐
│ Bandeau supérieur fin (menu + logo)          │  discret, encre douce
├──────────────────────────────────────────────┤
│ Bannière haute : Studio de couverture        │  carte ivoire, livre doré,
│                                              │  plus de grand vert saturé
├──────────────────────────────────────────────┤
│ Barre fine « Lancement V3 »                  │  sombre, texte clair, accent doré
├──────────────────────────────────────────────┤
│ Héro centré : « Votre maison d'édition IA »  │  grand titre éditorial,
│   Écrivez. Publiez. Rayonnez.                │  2 boutons sobres
├──────────────────────────────────────────────┤
│ Encart vidéo encadré                         │  cadre fin, coins discrets
└──────────────────────────────────────────────┘
   Contenu centré, largeur maximale ~1100 px
```

## Ce qui change concrètement

1. **Couleurs douces** : fond ivoire/papier, encre profonde presque noire, or discret.
   Le vert vif du haut de page devient un vert foncé désaturé, beaucoup plus reposant.
2. **Bannière couverture** : transformée en carte claire avec l'icône livre dorée —
   les 3 boutons (Créer / Mes couvertures / Offre 67 €) restent, juste plus sobres.
3. **Barre de lancement** : plus fine, sombre avec accent doré, compte à rebours conservé.
4. **Héro** : titre « Votre maison d'édition IA » avec la promesse « Écrivez. Publiez. Rayonnez. »
5. **Vidéo** : encadrée d'un filet fin façon édition.
6. **Barre latérale** : déjà masquée par défaut sur l'accueil (bouton « Afficher le menu » en haut) — inchangé.

## Réponse à votre question : tout est-il prêt pour le 1er octobre ?

- Oui, le basculement V3 est pilotable par un interrupteur en base (page Pilotage du lancement).
- Les anciens prix (197 €/547 €) ont disparu des pages visibles ; un seul tunnel de commande.
- Les modules payants restent visibles mais verrouillés tant que la V3 n'est pas ouverte.
- Les abonnés V2 actuels conservent leur V2 à vie et leur page « Ancien client V2 » (-20 %).

## Ce qui ne change PAS

- Aucune fonctionnalité supprimée : tout reste accessible via les onglets.
- Ni les paiements, ni la base de données, ni les calculs KDP, ni le module V4 (couvertures).

## Détails techniques

- Couleurs définies comme jetons dans `src/styles/v3-public.css` (variables `--v3-*`),
  valables en mode clair et sombre — aucune couleur écrite en dur dans les pages.
- Fichiers concernés : `v3-public.css`, `V3HomePage.tsx`, `V3CoverStudioBanner.tsx`,
  `V3LaunchBanner.tsx`, `V3PresentationVideo.tsx`.
- Vérification : compilation + tests + contrôle visuel navigateur avant livraison.

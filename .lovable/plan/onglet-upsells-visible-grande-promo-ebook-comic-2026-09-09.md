# Onglet UPSELLS visible + grande promo Ebook Comic

## Ce que vous obtenez

1. Un onglet **UPSELLS** toujours visible dans la barre d'onglets du haut (à côté de « Offre V3 »), cliquable sur ordinateur et sur mobile. Aujourd'hui les upsells n'existent que dans la barre latérale et dans le menu déroulant « Vendre ».
2. Le petit encart Ebook Comic devient un **grand bandeau promo** avec une mention « SUPERBE PROMO » qui clignote doucement, placé **juste sous la bannière de lancement V3** de la page d'accueil.

## Schéma de la page d'accueil

```text
┌──────────────────────────────────────────────────────────┐
│ EN-TÊTE V3 (logo, compte)                                │
├──────────────────────────────────────────────────────────┤
│ 🏠 Accueil │ ✨ Offre V3 │ ★ UPSELLS │ Créer │ Vendre …   │  ← nouvel onglet
├──────────────────────────────────────────────────────────┤
│ Maison d'édition de couvertures (nouveauté V4)           │
├──────────────────────────────────────────────────────────┤
│ BANNIÈRE LANCEMENT V3 — 1er octobre                      │
├──────────────────────────────────────────────────────────┤
│ ╔══════════════════════════════════════════════════════╗ │
│ ║  ✦ SUPERBE PROMO  (flash)      47 € au lieu de 97 € ║ │  ← nouveau
│ ║  EBOOK COMIC AGENT — BD et albums jeunesse avec l'IA ║ │     grand
│ ║  [image jeunesse]   [ Découvrir l'offre → ]          ║ │     bandeau
│ ╚══════════════════════════════════════════════════════╝ │
├──────────────────────────────────────────────────────────┤
│ Bandeau d'accroche + vidéo de présentation               │
│ Studio BD & Jeunesse … (suite inchangée)                 │
└──────────────────────────────────────────────────────────┘
```

## Onglet UPSELLS

- Libellé : **UPSELLS**, icône étincelles, badge « 18 tarifs », destination `/v3/upsells`.
- Style doré premium, distinct du bouton orange « Offre V3 » pour ne pas se concurrencer.
- Version mobile : bouton pleine largeur en haut de l'accordéon « Catégories ».
- L'entrée existante dans le menu « Vendre » et dans la barre latérale reste en place.

## Grande promo Ebook Comic

- Le composant de teaser passe en version large : image jeunesse à gauche, titre, prix barré 97 € → 47 €, bouton d'action, et pastille « SUPERBE PROMO » animée par un clignotement lent (pulsation d'opacité, pas de stroboscope).
- Destination inchangée : la page `/comic-agent` déjà en ligne.
- Placé sous la bannière de lancement ; l'ancien petit encart plus bas est retiré pour éviter le doublon.

## Détails techniques

- `V3MainTabs.tsx` : ajout du lien `/v3/upsells` (desktop + accordéon mobile).
- `ComicAgentTeaser.tsx` : nouvelle variante `large` (mise en page, prix, animation `animate-pulse` sur la pastille).
- `V3HomePage.tsx` : déplacement de l'encart Comic juste après `V3LaunchBanner`.
- Aucun changement de prix, de paiement, de base de données ni de sécurité. Le module V4 couvertures n'est pas touché.

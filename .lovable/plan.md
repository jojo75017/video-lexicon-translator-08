## Objectif

Afficher une page d'accueil "intro" avant d'entrer dans le lecteur de la Masterclass. Elle présente la formation (résumé), les bénéfices, et un bouton qui lance le Module 1.

## Comportement

```text
Visiteur arrive sur /masterclass
        │
        ▼
┌─────────────────────────────┐
│   PAGE INTRO (nouvelle)     │
│   - Titre + résumé 5h/5 mod │
│   - Liste des bénéfices     │
│   - Aperçu des 5 modules    │
│   - Bouton "Commencer le    │
│     Module 1 (gratuit)"     │
└─────────────────────────────┘
        │ clic
        ▼
   Lecteur Masterclass (vue actuelle, Module 1 actif)
```

- L'intro s'affiche par défaut à l'arrivée.
- Le bouton **« Commencer le Module 1 (gratuit) »** fait passer à la vue lecteur existante, Module 1 sélectionné.
- Un visiteur ayant déjà commencé (progression ou déblocage en `localStorage`) arrive directement sur le lecteur, sans repasser par l'intro — avec tout de même un petit lien « Revoir l'introduction » pour y revenir.

## Contenu de l'intro

- **Hero** : badge « Formation gratuite · 5h », H1 « Masterclass EbookStudio Pro V2 », sous-titre/résumé (créer, designer et vendre un ebook rentable sur Amazon KDP).
- **Bénéfices** (4-5 puces avec icônes) : générer le contenu par IA, couverture pro, métadonnées & SEO KDP, automatisation & marketing, Module 1 offert sans inscription.
- **Aperçu des 5 modules** : liste reprenant `MASTERCLASS_MODULES` (numéro, titre, durée, badge Gratuit/🔒).
- **CTA principal** : bouton « Commencer le Module 1 (gratuit) » → ouvre le lecteur.
- Mention rassurante : « Module 1 100% gratuit · les suivants débloqués par email ».

## Détails techniques

- Modifier `src/pages/MasterclassPage.tsx` : ajouter un état `view` (`'intro' | 'player'`).
  - Au montage, si `localStorage` contient une progression (`masterclass-progress`) ou un déblocage (`masterclass-unlocked`), démarrer en `'player'`, sinon `'intro'`.
  - `Commencer le Module 1` → `setView('player')` + `setActiveId(1)`.
- Nouveau composant `src/components/masterclass/MasterclassIntro.tsx` (présentation pure, props : `onStart`). Réutilise `MASTERCLASS_MODULES`, `MASTERCLASS_CTA_URL`.
- Garder le `Helmet` (SEO) au niveau de la page, valable pour les deux vues.
- Styles via tokens du thème (Dark Mode, accent teal/orange KDP), responsive, aucune couleur codée en dur.
- Aucun changement backend, route, ou base de données.

## Hors périmètre

- Pas de modification du mur email, du lecteur, des onglets ni du pop-up de fin.
- Pas de nouvelle route (tout reste sur `/masterclass`).

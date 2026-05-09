# Plan — Section Démo Joyeuse sur /offres

## Contexte
La page `/offres` (qui sert aussi de `/`) a été refondue dans un style "joyeux" pastel. L'ancienne démo interactive (`InteractiveDemo.tsx`, style KDP Rocket orange/sombre) n'apparaît plus. Tu veux que les visiteurs puissent **voir comment ça marche** directement sur la page offres, sans bouton "/demo" séparé.

## Objectif
Créer une nouvelle section démo immersive et conforme à la charte joyeuse (pêche, mint, soleil, lavande, crème) qui simule visuellement la création d'un ebook en 3 étapes — sans formulaire réel ni génération IA, juste une mise en scène animée pour donner envie.

## Ce qui sera fait

### 1. Nouveau composant `JoyfulLiveDemo.tsx`
Dans `src/components/sales/joyful/`, un composant unique avec :

- **Titre joyeux** : "Regarde ton premier livre prendre vie" + sous-titre rassurant
- **Carte simulateur** style "écran d'app" sur fond crème, bords arrondis 32px, ombre douce
- **Champ d'entrée pré-rempli défilant** : 3 sujets qui s'écrivent automatiquement en boucle (ex : "Le jeûne intermittent", "Méditation pour débutants", "Recettes véganes faciles") effet machine à écrire
- **Bouton "Lancer la magie"** (peach + wiggle au survol) qui déclenche l'animation
- **3 étapes animées** apparaissant en cascade :
  1. Plan généré (mint) — liste de chapitres qui se cochent un par un
  2. Chapitre rédigé (sun) — texte qui se "tape" avec curseur clignotant
  3. Couverture créée (lavender) — mockup de couverture qui apparaît avec léger float
- **Compteur de temps** "27 secondes ⚡" en badge pop
- **CTA final** "Moi aussi je veux essayer →" qui scrolle vers `OffreUnique67`

Animations : Framer Motion (déjà utilisé), variantes `joy-pop`, `joy-float`, `joy-wiggle` déjà dans `index.css`.

### 2. Insertion dans `SalesPage.tsx`
Placer `<JoyfulLiveDemo />` juste après `<JoyfulJourney />` et avant `<AgentsShowcaseFun />` — c'est le moment idéal après avoir présenté la promesse, le visiteur est curieux de voir.

### 3. Lien footer
Le footer pointe vers `/demo` (route morte). Remplacer par un scroll vers la section démo (`#demo-live`) ou retirer le lien.

### 4. Mockup couverture
Réutiliser un visuel existant si disponible dans `src/assets/`, sinon générer une couverture pastel simple (livre stylisé inclinable).

## Ce qui ne change pas
- Aucune logique métier, aucun appel IA réel
- Le tunnel de paiement, l'auth et les autres sections restent intacts
- L'ancien `InteractiveDemo.tsx` reste en place (utilisé ailleurs ?) — à vérifier avant suppression éventuelle

## Détails techniques
```text
src/components/sales/joyful/
├── JoyfulLiveDemo.tsx     ← nouveau
└── (existants inchangés)

src/pages/SalesPage.tsx    ← +1 import, +1 balise, lien footer corrigé
```

Pas de migration DB, pas de nouvelle dépendance.

## Question ouverte
Veux-tu que la démo soit **purement visuelle** (animations scriptées, c'est ce que je propose) ou **réellement interactive** (l'utilisateur tape un sujet et on appelle Gemini en mode aperçu limité) ? La version visuelle est plus rapide, plus sûre, et zéro coût IA — recommandée pour une page d'accueil grand public.

# Accueil V3 : schéma « Avant / Après » multi-IA

## Objectif
Ajouter sur l'accueil V3 un bloc de conviction en deux temps : ce que donnent les anciens outils KDP (une seule IA généraliste), puis ce que donne Ebookstudio V3 (plusieurs IA spécialisées, une par étape du livre). Aucune autre marque n'apparaît : la section parle uniquement d'Ebookstudio V3.

## Règle de nommage
- Nom affiché partout : **Ebookstudio V3**.
- Aucune mention d'un outil concurrent ni d'un nom emprunté, ni dans les titres, ni dans les textes, ni dans les commentaires du code.
- Vocabulaire retenu : « anciens outils KDP », « une IA généraliste », « équipe d'IA spécialisées ».

## Partie 1 — Section « Avant / Après »

### Schéma

```text
┌──────────────────────────────────────────────────────────────────────┐
│  Chapeau centré                                                      │
│  « Les anciens outils KDP séduisent cinq minutes,                    │
│    puis lâchent au moment de publier »                               │
└──────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────┐  ┌───────────────────────────────┐
│ AVANT — UNE SEULE IA          │  │ APRÈS — EBOOKSTUDIO V3        │
│ (colonne sobre, ton éteint)   │  │ PLUSIEURS IA SPÉCIALISÉES     │
│                               │  │ (colonne émeraude + or)       │
│ • Un texte, pas un flux       │  │ Écrire un livre demande       │
│   de travail d'édition        │  │ plusieurs intelligences,      │
│ • Du contenu, pas de          │  │ chacune confiée à l'IA la     │
│   positionnement              │  │ plus douée pour l'étape :     │
│ • Un classeur à livres,       │  │                               │
│   outil d'édition incomplet   │  │ 1 Recherche & niche           │
│ • Un modèle d'IA unique,      │  │ 2 Écriture du manuscrit       │
│   pas une équipe d'édition    │  │ 3 Création des visuels        │
│                               │  │ 4 Conception de couverture    │
│ → Résultat : un brouillon     │  │ 5 Voix (livre audio)          │
│   à retravailler pendant      │  │ 6 SEO & mots-clés KDP         │
│   des semaines                │  │ 7 Traduction                  │
│                               │  │ 8 Publication & métadonnées   │
└───────────────────────────────┘  └───────────────────────────────┘
                    ↓  séparateur or  ↓
┌──────────────────────────────────────────────────────────────────────┐
│ Chute pleine largeur, fond émeraude :                                │
│ « Pas une seule IA qui tente de tout faire.                          │
│   Une IA spécialisée pour chaque étape de votre livre. »             │
│                     [ Voir les moteurs IA ]                          │
└──────────────────────────────────────────────────────────────────────┘
```

### Contenu rédigé (français, tel qu'affiché)

Colonne AVANT — « L'ancienne voie : une seule IA » :
- Ils vous fournissent un texte, pas un flux de travail d'édition.
- Ils vous fournissent du contenu, pas de positionnement.
- Ils vous donnent un classeur à livres, un outil d'édition incomplet.
- Ils vous fournissent un modèle d'IA, pas une équipe d'édition spécialisée.

Colonne APRÈS — « Ebookstudio V3 : automatisation KDP multi-IA », huit intelligences :
Recherche, Écriture, Création, Conception, Voix, SEO, Traduction, Publication.

Chute : « Pas une seule IA qui tente de tout faire. Une IA spécialisée pour chaque étape de votre livre. »

### Comportement
- Bloc informatif non cliquable, sauf le bouton final qui descend vers la grille « Les moteurs IA de la V3 » déjà présente sur la page.
- Les huit intelligences correspondent aux modules réellement livrés (recherche, studio d'écriture, visuels, couverture, audio, mots-clés, traduction, métadonnées) — rien d'inexistant n'est promis.
- Deux colonnes sur ordinateur, empilement sur mobile, hauteur contenue.

### Emplacement
Juste au-dessus du bandeau et de la grille des moteurs IA : problème → promesse multi-IA → détail des moteurs.

## Partie 2 — Correctifs d'affichage à finir
1. Bandeau compact KDP Pilot remonté en tête de l'accueil V3, code `PROMO15` conservé.
2. Champs « Commencez votre livre » resserrés : une ligne sur ordinateur, paddings et historique réduits.
3. Entrées générales `/`, `/dashboard`, `/espace` renvoyant l'abonné sur `/v3` ; accès V2 conservé via son bouton dédié.
4. Rafraîchissement propre après reconnexion : purge unique des service workers et de Cache Storage, ouverture de `/v3` versionnée, garde-fou anti-boucle, sans toucher aux livres, clés API ni profils.

## Vérification
- Déconnexion puis reconnexion : arrivée sur `/v3`, bandeau KDP Pilot et champs réduits visibles au premier écran.
- Section « Avant / Après » lisible sur ordinateur et mobile, 100 % en français, aucune marque étrangère.
- Aucun rechargement en boucle.

## Détails techniques
- Nouveau composant `src/components/v3public/V3BeforeAfterPanel.tsx`, inséré dans `V3HomePage.tsx` au-dessus de `V3EngineStrip`.
- Styles alignés sur `src/styles/v3-public.css` (émeraude, or, `v3-serif`), cohérents avec `V3EngineBanner.tsx`.
- Icônes vectorielles uniquement : aucun appel IA, aucune génération d'image, donc aucun crédit IA consommé.

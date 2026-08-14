# Accueil V3 : section « Avant / Après » + accueil réellement à jour

## Objectif
Ajouter sur l’accueil V3 un bloc de conviction « Avant / Après » qui oppose les anciens outils KDP à l’automatisation multi-modèles d’Ebookstudio V3, et terminer les correctifs d’affichage (bandeau KDP Pilot visible, champs réduits, arrivée systématique sur `/v3`).

## Partie 1 — Nouvelle section « Avant / Après »

### Structure visuelle (schéma)

```text
┌──────────────────────────────────────────────────────────────────────┐
│  Chapeau centré                                                      │
│  « Pourquoi les anciens outils KDP s'essoufflent au moment de        │
│    publier »                                                         │
└──────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────┐  ┌───────────────────────────────┐
│ AVANT — L'ANCIENNE VOIE       │  │ APRÈS — LA NOUVELLE VOIE      │
│ (colonne sobre, ton éteint)   │  │ (colonne émeraude + or)       │
│                               │  │  AUTOMATISATION KDP           │
│ Excitant 5 minutes.           │  │  MULTIMODÈLE                  │
│ Inutile au moment de publier. │  │                               │
│                               │  │ Un vrai flux d'édition        │
│ • Un texte, pas un flux       │  │ demande plusieurs types       │
│   de travail d'entreprise     │  │ d'intelligence :              │
│ • Du contenu, pas de          │  │                               │
│   positionnement              │  │ 1 Recherche                   │
│ • Un classeur à livres,       │  │ 2 Écriture                    │
│   outil d'édition incomplet   │  │ 3 Création                    │
│ • Un modèle d'IA, pas une     │  │ 4 Conception                  │
│   équipe d'édition            │  │ 5 Voix                        │
│                               │  │ 6 SEO                         │
│ → « Ebookstudio V3 a été      │  │ 7 Traduction                  │
│   créé pour remédier à cela » │  │ 8 Publication                 │
└───────────────────────────────┘  └───────────────────────────────┘
                    ↓  flèche / séparateur or  ↓
┌──────────────────────────────────────────────────────────────────────┐
│ Phrase de chute, pleine largeur, fond émeraude :                     │
│ « Pas une seule IA qui tente de tout faire.                          │
│   Une IA spécialisée pour chaque étape. »                            │
│                     [ Découvrir les moteurs IA ]                     │
└──────────────────────────────────────────────────────────────────────┘
```

### Contenu rédigé (français, tel qu'affiché)

Colonne AVANT — « L'ancienne voie » :
- Ils vous fournissent un texte, pas un flux de travail d'édition.
- Ils vous fournissent du contenu, pas de positionnement.
- Ils vous donnent un classeur à livres, un outil d'édition incomplet.
- Ils vous fournissent un modèle d'IA, pas une équipe d'édition spécialisée.

Colonne APRÈS — « La nouvelle voie : automatisation KDP multimodèle », huit intelligences :
Recherche, Écriture, Création, Conception, Voix, SEO, Traduction, Publication.

Chute : « Pas une seule IA qui tente de tout faire. Une IA spécialisée pour chaque étape. »

### Comportement
- Section informative, non cliquable, sauf le bouton final qui mène à la section des moteurs IA déjà présente sur la page.
- Les huit intelligences reprennent exactement les rôles réellement livrés dans la V3, pour ne rien promettre d'inexistant.
- Compacte : deux colonnes sur ordinateur, empilement sur mobile, sans allonger excessivement le premier écran.

### Emplacement
Juste au-dessus du bandeau et de la grille « Les moteurs IA de la V3 », de façon à enchaîner problème → solution → détail technique.

## Partie 2 — Correctifs d'affichage à finir

1. **KDP Pilot visible immédiatement** : bandeau compact remonté en tête de l'accueil V3, avant les grands blocs, avec le code `PROMO15` conservé.
2. **Champs de démarrage réduits** : « Commencez votre livre » sur une ligne quand l'écran le permet, paddings, hauteurs et historique resserrés.
3. **Arrivée systématique sur `/v3`** : les entrées générales `/`, `/dashboard`, `/espace` renvoient l'abonné vers l'accueil V3 ; l'accès V2 reste disponible via le bouton dédié.
4. **Rafraîchissement propre après reconnexion** : purge unique des service workers et de Cache Storage, ouverture de `/v3` avec un paramètre de version, garde-fou anti-boucle, sans toucher aux livres, clés API ni profils enregistrés.

## Vérification
- Déconnexion puis reconnexion : arrivée sur `/v3`, bandeau KDP Pilot et barre de titre réduite visibles au premier écran.
- Section « Avant / Après » lisible sur ordinateur et mobile, texte intégralement en français.
- Aucun rechargement en boucle.

## Détails techniques
- Nouveau composant `src/components/v3public/V3BeforeAfterPanel.tsx`, inséré dans `V3HomePage.tsx` au-dessus de `V3EngineStrip`.
- Styles alignés sur `src/styles/v3-public.css` (émeraude, or, `v3-serif`), même vocabulaire visuel que `V3EngineBanner.tsx`.
- Aucun appel IA, aucune génération d'image : icônes vectorielles uniquement, donc aucun crédit IA consommé.

# Un point de départ clair : « Je n'ai pas encore d'idée »

## Le problème

Sur la page **Kit de démarrage**, il n'y a que le PDF. Rien n'invite à parler avec l'assistant IA ni à consulter les niches proposées. Quelqu'un qui arrive sans idée de livre ne sait pas où cliquer.

## Ce qui est ajouté

Un grand bloc bien visible, placé **tout en haut** de la page Kit de démarrage, juste avant le PDF :

```text
┌──────────────────────────────────────────────────────┐
│  VOUS N'AVEZ PAS ENCORE D'IDÉE DE LIVRE ?            │
│  Deux façons de commencer, choisissez la vôtre.      │
│                                                      │
│  ┌────────────────────────┐ ┌─────────────────────┐  │
│  │ Parler avec l'IA       │ │ Voir les niches     │  │
│  │ Elle vous pose des     │ │ Des sujets qui se   │  │
│  │ questions et trouve    │ │ vendent déjà sur    │  │
│  │ votre sujet avec vous  │ │ Amazon              │  │
│  │  [ Commencer ]  (or)   │ │  [ Voir la liste ]  │  │
│  └────────────────────────┘ └─────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

- **Parler avec l'IA** : gros bouton doré, mène à la page de création où la discussion avec l'assistant s'ouvre directement.
- **Voir les niches proposées** : bouton secondaire, mène à la page des niches rentables déjà existante.

Le même bloc, en version courte sur une seule ligne, est rappelé en bas de la page après le PDF, pour ceux qui viennent de le lire.

## Détails techniques

- Nouveau composant `src/components/v3public/V3StartIdeaCTA.tsx` (présentation seule, deux variantes : `full` et `compact`).
- Inséré dans `src/pages/v3/V3KitDemarragePage.tsx` au-dessus de l'en-tête PDF et en bas de page.
- Liens vers les routes existantes `/v3/create` (assistant Génie, bureau 1 « J'écris ») et `/niches`.
- Palette et typographie déjà en place sur la page : émeraude `#064e3b`, or `#c9a84c`, ivoire `#fdf6e3`.
- Aucune modification de la base, de la sécurité, des paiements, des calculs KDP, ni du module V4.

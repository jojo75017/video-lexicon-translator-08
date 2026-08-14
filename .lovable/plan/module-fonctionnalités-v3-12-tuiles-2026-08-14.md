# Module « Fonctionnalités » V3 — 12 tuiles

Un nouveau bouton dans la barre latérale V3 ouvre une page-module `/v3/fonctionnalites` : une grille de 12 tuiles (3 lignes × 4), style LearnyBox (carte blanche, icône colorée en pastille, titre court, sous-titre), sur fond crème V3. Sous la grille, un bloc « Besoin d'aide ? » avec le lien support.

## Schéma de la grille

```text
┌──────────────── /v3/fonctionnalites ─────────────────────────────┐
│  Titre : Toutes les fonctionnalités  ·  sous-titre               │
│                                                                  │
│ LIGNE 1 — Mon compte (privé, visible par l'abonné seul)          │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐      │
│ │ 1 Clés API │ │ 2 Mes      │ │ 3 Mes      │ │ 4 Intégra- │      │
│ │ Gemini/    │ │ coordonnées│ │ réseaux    │ │ tions      │      │
│ │ OpenAI/OR  │ │ (privé)    │ │ sociaux    │ │ Brevo/     │      │
│ │            │ │            │ │ (privé)    │ │ Systeme.io │      │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘      │
│                                                                  │
│ LIGNE 2 — Le parcours du livre (reprise du header)               │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐      │
│ │ 5 Créer 📘 │ │ 6 Écrire ✍│ │ 7 Habiller │ │ 8 Vendre 💛│      │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘      │
│                                                                  │
│ LIGNE 3 — Aller plus loin                                        │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐      │
│ │ 9 Livres   │ │10 Forfaits │ │11 Parrai-  │ │12 300 Q/R  │      │
│ │  spéciaux  │ │            │ │   nage     │ │  → outils  │      │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘      │
│                                                                  │
│  ── Une question, un bug ? →  Contacter le support  ──           │
└──────────────────────────────────────────────────────────────────┘
```

## Où va chaque tuile

| # | Tuile | Destination |
|---|---|---|
| 1 | Paramétrage des clés | `/v3/fonctionnalites/cles` (réutilise le panneau clés existant) |
| 2 | Mes coordonnées | `/v3/fonctionnalites/coordonnees` (nouvelle page privée) |
| 3 | Mes réseaux sociaux | `/v3/fonctionnalites/reseaux` (nouvelle page privée) |
| 4 | Intégrations | `/v3/fonctionnalites/integrations` (nouvelle page privée) |
| 5 | Créer | sous-menu « Créer » du header (10 liens) |
| 6 | Écrire | sous-menu « Écrire » |
| 7 | Habiller | sous-menu « Habiller » |
| 8 | Vendre | sous-menu « Vendre » |
| 9 | Livres spéciaux | sous-menu « Livres spéciaux » |
| 10 | Forfaits | `/v3/forfaits` |
| 11 | Parrainage | `/mon-parrainage` |
| 12 | 300 questions-réponses | `/v3/fonctionnalites/questions` (nouvelle page) |
| — | Support | `/v3/contact` |

Les tuiles 5 à 9 n'ouvrent pas une autre page : un clic déplie un panneau sous la grille listant les liens de la catégorie (mêmes libellés, badges et descriptions que le menu du header), donc aucun outil orphelin.

## Pages à créer

- **Mes coordonnées** : nom, prénom, adresse, ville, pays, téléphone, e-mail de facturation, nom d'auteur/pseudo. Visible et modifiable par l'abonné uniquement.
- **Mes réseaux sociaux** : site web, Facebook, Instagram, X, TikTok, YouTube, LinkedIn, Pinterest, page auteur Amazon. Privé également, avec une case « autoriser l'affichage sur ma page auteur publique » (décochée par défaut).
- **Intégrations** : Brevo, Systeme.io, GetResponse, MailerLite, webhook générique — champ clé API + « Tester la connexion » + état. Les clés sont stockées côté abonné, jamais visibles par les autres.
- **300 questions-réponses** : catalogue de Q/R groupées par thème (Créer, Écrire, Corriger, Couverture, Export/KDP, Mots-clés, Forfaits, Compte), avec recherche instantanée et, sur chaque réponse, un bouton qui ouvre l'outil concerné. Départ sur la base de questions déjà présente dans l'assistant, puis complétée par thème pour atteindre le catalogue complet.
- **Clés API** : réutilise le panneau existant, présenté en page plein écran (aucune duplication de logique).

## Détails techniques

- Nouveau `src/pages/v3public/V3FeaturesPage.tsx` + `src/components/v3/features/FeatureTile.tsx` et `FeatureCategoryPanel.tsx` ; données des 12 tuiles dans `src/data/v3Features.ts`.
- Lignes 2-3 alimentées par `V3_HEADER_MENU` (`src/data/v3HeaderMenu.ts`) — pas de duplication de liens.
- Routes ajoutées sous `/v3` dans `src/App.tsx`, encapsulées comme les autres (`V3LockedGate`), et un item « Fonctionnalités » ajouté en tête de la section « Mon espace » de `V3Sidebar.tsx`.
- Stockage : nouvelle table `subscriber_profiles` (coordonnées + réseaux, RLS `auth.uid()` strict, GRANT authenticated/service_role) et `subscriber_integrations` (fournisseur + clé, RLS propriétaire seul, clés jamais exposées à un autre utilisateur). Test de connexion via une edge function, jamais depuis le navigateur.
- Tokens de couleur V3 existants (émeraude/or, fond crème) — aucune couleur codée en dur.

## Ensuite

Une fois ce module validé, on enchaîne sur l'allègement de la page d'accueil V3 (trop chargée) — plan séparé.

## Objectif

Refaire un header V3 clair, propre et hiérarchisé, avec **catégories principales + sous-catégories au survol (mega-menu)**, et supprimer les doublons avec la barre latérale (notamment "Livres spéciaux").

## Nouveau header — 2 lignes seulement

### Ligne 1 — Barre de marque (fine, sobre)
```text
[Logo ebookstudio V3]   [Recherche outils…]        [Passer V2] [Compte] [S'abonner]
```

### Ligne 2 — Menu principal (6 catégories, chacune avec sous-menu déroulant)

```text
📘 Créer ▾   ✍️ Écrire ▾   🎨 Habiller ▾   🚀 Publier ▾   💛 Vendre ▾   📚 Livres spéciaux ▾
                                                                          [ Tous les outils ]
```

Chaque catégorie ouvre un **panneau (mega-menu)** au hover/click, avec ses sous-catégories groupées :

**📘 Créer**
- Plan du livre → `/v3/create`
- Personnages → `/v3/create?step=3`
- Importer un document → `/v3/create?import=1`
- Modèles / Templates → `/fiches-pratiques`
- Sommaire ultime → `/v3/outils/sommaire-ultime`

**✍️ Écrire**
- Générateur V2 (Écrire) → `/ebook-planner`
- Parcours 30 agents → `/v3/hub?tab=parcours`
- Outils V3 → `/v3/hub?tab=outils`
- BookPerfect AI → `/v3/hub?tab=bookperfect`
- Assistant IA → `/v3/hub?tab=assistant`

**🎨 Habiller**
- Couverture KDP Studio → `/couverture-kdp`
- Cover Studio Pro V3 → `/v3/hub?tab=cover-pro`
- Illustrations intérieures → `/v3/outils/illustrations`
- Documentation Studio → `/v3/hub?tab=documentation`

**🚀 Publier**
- KDP Pilot / Audit → `/audit-pilot`
- Mots-clés Amazon (KDSpy) → `/kdp-keywords`
- 600 Niches → `/niches-600`
- Amazon Spy → `/v3/outils/amazon-spy`
- Export livre → `/v3/hub?tab=export`

**💛 Vendre**
- Galerie communauté → `/v3/gallery`
- Ma page auteur → `/v3/auteur`
- Signature email → `/v3/outils/signature`
- Marketing / Emails → `/v3/hub?tab=marketing`

**📚 Livres spéciaux** (les 14 slugs de `specialBookTabs.ts`)
- Roman · Cuisine · Voyage · Coloriage · BD / Manga · Documentaire · Atlas · Encyclopédie · Agenda · Journal · Scolaire · Aquariophilie · Fiches oiseaux · Saga multi-tomes

Bouton final compact **"Tous les outils"** → `/v3/outils` (grille complète, cherchable).

## Suppression des doublons avec la sidebar

La sidebar `V3Sidebar.tsx` conserve UNIQUEMENT ce qui n'est pas dans le header :
- Accueil / Tableau de bord / Ma bibliothèque / Mes livres
- Formation & Guides (Formation vidéo, Blog, Script vidéo, Guides Hub)
- Communauté (Galerie, Page auteur) *(gardés — accès rapide)*
- Support (Contact, FAQ, Assistance)
- Compte (Paramètres, Abonnement, Passer V2)

À retirer de la sidebar :
- **Toute la section "Livres spéciaux"** (déplacée dans le header)
- Les entrées Outils V3 / Tous les outils / BookPerfect / Export (déjà dans header)

## Comportement UX

- Desktop : sous-menus au **hover** avec petit délai + fermeture au click à l'extérieur.
- Mobile : le header se replie en **menu hamburger** avec accordéons par catégorie.
- Onglet actif : pastille couleur de la catégorie (garde le codage : orange = Écrire/Créer, violet = Livres spéciaux, teal = Publier, etc.).
- Aucun scroll horizontal, aucune ligne 3 additionnelle.
- Badges "NEW" petits, à droite du label dans le sous-menu.

## Fichiers impactés

- `src/components/v3public/V3MainTabs.tsx` → refonte complète en `V3Header` mega-menu (2 lignes).
- `src/components/v3public/V3Header.tsx` → devient la ligne 1 (marque + recherche + actions).
- `src/components/v3public/V3PublicLayout.tsx` → n'affiche plus les 3 lignes actuelles.
- `src/components/v3public/V3Sidebar.tsx` → suppression du groupe "Livres spéciaux" + dédoublonnage Hub.
- `src/data/v3HeaderMenu.ts` *(nouveau)* → source unique des catégories + sous-catégories.
- Mobile : petit composant `V3HeaderMobile.tsx` avec accordéons.

## Validation

- Vérifier via Playwright sur `/v3` : header 2 lignes, hover sur chaque catégorie ouvre le bon panneau, tous les liens répondent, aucune duplication avec sidebar, mobile OK à 375px.

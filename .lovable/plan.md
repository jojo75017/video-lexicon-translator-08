# Restructuration des offres V3 pour le 1er octobre

## Le problème actuel
- Le **197€** paraît « léger » : il s'arrête à « publier » et n'inclut ni la couverture premium, ni rien pour **lancer/vendre**. C'est ce qui crée la frustration (couverture introuvable, parcours qui renvoie vers des onglets verrouillés).
- Le **497€** empile **7 packs** = trop de modules, illisible, et le tarif n'est pas toujours plus avantageux que l'achat à la carte.

## La nouvelle structure (2 offres claires + options)

### 1️⃣ Offre 197€ — « De l'idée au livre publié ET lancé »
La base actuelle (création IA, pipeline P1-P15, publication KDP, niches) **+ on intègre dedans** :
- **Couverture premium** : Cover Studio Pro + 6 variantes / test miniature (ce qui manquait).
- **Tout le Pack Lancement & Visibilité (ex-147€)** : optimiseur d'annonces, séquence J-7, Amazon Ads, prix de lancement, media kit, Look Inside, avis éditoriaux, BookBub/Facebook, page auteur.

➡️ Résultat : avec le 197€, le client **écrit, publie ET lance** son livre. Offre complète et autonome.

**Prix recommandé : on garde 197€.** Le contenu devient bien plus riche mais on conserve le prix → argument de lancement très fort (« tout pour publier ET lancer, à vie, 197€ »). On peut monter plus tard.

### 2️⃣ Offre 497€ — « Pro Vendeur / Maison d'Édition »
Tout le 197€ **+ seulement 4 packs à forte valeur** (au lieu de 7) :
- 💰 **Revenus & Scaling** (auto-pricing, royalties, bundles, KU, lead magnet…)
- 🌍 **Distribution Large** (Kobo, Apple, Google Play, ISBN, EPUB normé)
- 📣 **Trafic Social & Viralité** (Pinterest, TikTok, calendrier 30j, book trailer, kit influenceurs)
- 📕 **Qualité Éditoriale Pro** (comité de lecture, édition structurelle, copy-editing, label qualité)

Valeur à la carte = 197 + 99 + 97 + 87 + 67 = **547€** → le 497€ fait économiser **50€** et reste un vrai deal, sans être surchargé.

### 3️⃣ Options à la carte (au-dessus, facultatives)
Les packs « rares / spécialistes » restent disponibles séparément, hors des 2 offres principales :
- 📰 **Promotion Éditeur** (97€) — presse, salons, droits étrangers, précommandes
- 🎙️ **Transcription Audio/Vidéo → Texte** (67€)

```text
197€  ──►  ÉCRIRE + PUBLIER + LANCER + COUVERTURE   (offre complète autonome)
497€  ──►  197€  +  Revenus  +  Distribution  +  Social  +  Éditorial Pro
À la carte ─► Promotion Éditeur 97€  •  Transcription 67€
```

## Détails techniques (modifications de code)

**Fichier `src/data/roadmapV3.ts`** (source unique de vérité) :
- Ajouter dans `V3_BASE_MODULE_IDS` (liste blanche du 197€) les modules : `cover-studio-pro`, `cover-variants-thumbnail`, et les 9 modules du pack Lancement (`listing-optimizer`, `launch-sequence-j7`, `amazon-ads`, `launch-pricing`, `media-kit`, `look-inside-optimizer`, `editorial-reviews`, `bookbub-ad-builder`, `author-page-optimizer`).
- Retirer les packs `cover` et `marketing` de `V3_UPSELL_PACKS` (désormais inclus dans la base).
- Garder dans `V3_UPSELL_PACKS` les 4 packs du 497€ (`monetisation`, `distribution`, `social`, `editorial`) + marquer `promotion` et `transcription` comme options « à la carte » (nouveau champ `alacarte: true`).
- Mettre à jour `V3_FULL_PACK` : `price: 497`, `compareAt: 547`, `saves: 50`, et n'inclure que les 4 packs essentiels.

**Fichier `src/components/admin/V3PricingTiers.tsx`** :
- Mettre à jour le descriptif de la Base (mentionner couverture + lancement inclus).
- La section « Pack Tout Complet » devient « Pro Vendeur 497€ » avec les 4 packs.
- Ajouter une petite section « Options à la carte » pour Promotion + Transcription.

**Fichier `src/components/admin/V3Workflow30.tsx`** :
- Vérifier que le parcours 197€ ne renvoie plus vers des étapes verrouillées (couverture + lancement désormais débloqués), pour supprimer les « trous » signalés.

**Mémoire projet** : mettre à jour les fiches pricing V3 pour refléter la nouvelle structure (197€ enrichi, 497€ à 4 packs, options à la carte).

## Points à confirmer
- OK pour **garder le prix à 197€** malgré l'enrichissement (plutôt que monter à 247€) ?
- OK pour mettre **Promotion Éditeur** et **Transcription** en options à la carte (et non dans le 497€) ?

# Encarts Upsells V3 — récapitulatif + figures avec prénoms

## Objectif
Rendre les upsells visibles partout dans le parcours abonné avec des **encarts dédiés**, chacun illustré par un **personnage avec un prénom** (style Marie/Rachel) qui incarne le bénéfice du pack — pas de copie d'avatars existants, figures originales (illustrations sobres façon maison d'édition ou avatars SVG colorés comme `AgentAvatar`).

## Récapitulatif des upsells existants

### Packs essentiels (inclus dans le Pack Pro 547 €)
| Pack | Prix | Contenu clé |
|---|---|---|
| Revenus & Scaling | 99 € | auto-pricing, royalties, bundles, KU detector |
| Distribution Large (Wide) | 97 € | Kobo/Apple/Google Play, ISBN, EPUB |
| Trafic Social & Viralité | 87 € | Pinterest, TikTok hooks, book trailer IA |
| Qualité Éditoriale Pro | 67 € | comité de lecture, copy-editing, label qualité |
| Étude de Marché Pro | 97 € | BSR, reverse ASIN, mots-clés, niches |

### Options à la carte
| Option | Prix | Accroche |
|---|---|---|
| Pack Promotion Éditeur | 97 € | presse, libraires, droits étrangers |
| Transcription Audio/Vidéo | 67 € | podcast/vidéo → livre (99 langues) |
| Documentation Studio AI | 197 € | doc complète produit numérique |
| Pack Boost de Lancement | 17 € | offre découverte nouveaux inscrits |
| Livres de Jeux & Énigmes | 27 €/à vie | générateur KDP |
| Cherche & Trouve | 27 €/à vie | coloriages KDP |
| Histoires Courtes & Contes | 27 €/à vie | contes illustrés KDP |
| **Pack Pro Vendeur** | **547 €** (au lieu de ~935 €) | tout inclus, 1×/3×/4× |

## Attention : ce qui est DÉJÀ inclus d'office (pas d'encart de vente)

Un encart upsell ne doit jamais s'afficher pour un droit déjà acquis. Répartition réelle
(source : `src/data/v3Pricing.ts` → `V3_PLANS` + `V3_ADDON_LIST.inEdition`, et
`src/data/v2LegacyAccess.ts`).

### Forfait 1 — Plume (27 €/mois · 270 €/an)
| Élément | Statut |
|---|---|
| Sommaire IA guidé, 10 langues, tous les onglets | Inclus |
| 30 livres/mois · 40 chapitres · 5 000 mots/ch | Inclus |
| Export PDF/DOCX/EPUB + sommaire stylé | Inclus |
| Couverture complète (recto + tranche + 4e) | Inclus |
| Audiolivre standard, import manuscrit, correction pro | Inclus |
| BookPerfect AI 97 € | **Upsell** |
| Traductions relues 97 €, Audiolivre Premium 67 €, Audio/livre 9,99 € | **Upsell** |
| Cover Studio Pro, BD Studio Pro, Amazon Spy / Audit ASIN | **Upsell** (ou passage Édition) |
| Packs roadmap (Revenus 99 €, Wide 97 €, Social 87 €, Éditorial 67 €, Marché 97 €) | **Upsell** |
| Modules à la carte 27 € (Jeux, Cherche & Trouve, Histoires courtes) | **Upsell** |
| Boost Lancement 17 €, Transcription 67 €, Documentation Studio 197 €, Promotion 97 € | **Upsell** |

### Forfait 2 — Édition (47 €/mois · 470 €/an)
| Élément | Statut |
|---|---|
| Tout Plume en version pro · livres illimités · 60 ch · 8 000 mots | Inclus |
| Sommaire IA avancé + ambiances | Inclus |
| Cover Studio Pro 300 DPI, BD Studio Pro | Inclus |
| Audiolivre pro, Mode Recherche Approfondie | Inclus |
| Amazon Spy / Audit ASIN / mots-clés avancés, Pack KDP ZIP | Inclus |
| **BookPerfect AI 97 €** (`inEdition: true`) | Inclus |
| Traductions relues 97 €, Audiolivre Premium 67 €, Audio/livre 9,99 € | **Upsell** |
| Sélection maisons d'édition 77 €, Pack Sérénité 30 € | **Upsell** |
| Packs roadmap (Revenus, Wide, Social, Éditorial, Marché) | **Upsell** |
| Modules à la carte 27 €, Boost 17 €, Transcription 67 €, Documentation 197 €, Promotion 97 € | **Upsell** |

### Studio Pro (97 €/mois) — `allAddonsIncluded: true`
Aucun encart upsell affiché : tout est inclus. On affiche seulement « Inclus · Ouvrir ».

### Abonnés V2 (accès à vie conservé)
| Élément | Statut |
|---|---|
| Génie + Sommaire IA (`/v3/create`) | Offert à vie |
| Correcteur de livre (`/v3/corriger`) | Offert à vie |
| Export premium (sommaire stylé) | Offert à vie |
| Quotas : 2 livres/mois · 20 chapitres · 3 000 mots/ch | Limite |
| Audiolivre, Cover Studio Pro, Traductions 10 langues, BD Studio Pro, Recherche approfondie, Amazon Spy / Audit ASIN / 600 niches | **Upsell** ou forfait |
| Plume / Édition | **−20 % à vie** affiché dans chaque encart (18,40 € / 21,60 € équivalent selon prix appliqué) |

Règle d'affichage unique : un encart n'apparaît que si `!isIncluded(pack, plan)`, et pour un
abonné V2 il affiche systématiquement le prix remisé −20 % + le lien `/v3/migration`.

### Points à confirmer avant implémentation
- Le code applique Plume 27 € / Édition 47 € ; la note de tarifs V3 « en attente »
  mentionne 17 € / 27 €, et un autre plan en attente parle d'un tarif unique 297 €.
  Les encarts afficheront les prix présents dans `v3Pricing.ts` tant que vous ne validez
  pas un nouveau barème — aucun prix ne sera modifié par ce chantier.

## Avis sur les tarifs + grille de comparaison couleur

### Avis honnête
À 27 €/47 €/97 € par mois, les forfaits ne sont **pas chers** — ils sont même plutôt
positionnés « entrée de gamme » face au marché :
- **Publisher Rocket** : 97 $/mo (≈ 89 €) — seulement la recherche de mots-clés/niches.
- **AIZYBOOK** : 149 €/mo — publication assistée, sans le studio IA complet.
- **Jasper / Copy.ai** (IA générique) : 20–60 €/mo, mais zéro outil KDP.

EbookStudio à 27 € livre déjà 30 livres/mois + 10 langues + sommaire IA + couverture +
audiolivre + correction. **Plume est trop bas** pour la valeur perçue (risque de
doute sur la qualité). **Édition à 47 € est bien calibrée** pour le pro. **Studio Pro
à 97 € est correct** vu que tout est inclus.

Recommandation tarifaire (hors ce chantier — à valider séparément) :
- Plume → **29 €/mo** (295 €/an) : psychologiquement plus « vrai outil pro ».
- Édition → **47 €/mo** (inchangé) : bon rapport perçu.
- Studio Pro → **97 €/mo** (inchangé) : reste l'offre « tout inclus ».

### Grille de comparaison couleur (rendu côte à côte)

```text
┌──────────────────────────────┬──────────────────────────────┐
│  FORFAIT 1 — PLUME            │  FORFAIT 2 — ÉDITION           │
│  ████ VERT (#0d7a5f)          │  ████ POURPRE (#5B21B6)       │
│                              │                              │
│  27 €/mo · 270 €/an           │  47 €/mo · 470 €/an           │
│  2 mois offerts en annuel     │  2 mois offerts en annuel     │
├──────────────────────────────┼──────────────────────────────┤
│  ✓ 30 livres / mois           │  ✓ Livres illimités           │
│  ✓ Sommaire IA guidé          │  ✓ Sommaire IA avancé          │
│  ✓ 40 chapitres · 5 000 mots  │  ✓ 60 chapitres · 8 000 mots  │
│  ✓ 10 langues incluses        │  ✓ 10 langues incluses        │
│  ✓ Export PDF/DOCX/EPUB       │  ✓ Export + Pack KDP ZIP       │
│  ✓ Couverture complète        │  ✓ Cover Studio Pro 300 DPI    │
│  ✓ Audiolivre standard        │  ✓ Audiolibre pro + BD Studio  │
│  ✓ Correction pro             │  ✓ BookPerfect AI inclus (97€) │
│  ✓ Import manuscrit           │  ✓ Amazon Spy / Audit ASIN     │
│                              │  ✓ Mode Recherche Approfondie │
├──────────────────────────────┼──────────────────────────────┤
│  ✗ BookPerfect AI (97 €)      │  ✗ Traductions relues (97 €)  │
│  ✗ Cover Studio Pro / BD      │  ✗ Audiolibre Premium (67 €)  │
│  ✗ Amazon Spy / Audit ASIN    │  ✗ Maisons d'édition (77 €)   │
│  ✗ Packs Revenus/Wide/Social  │  ✗ Packs Revenus/Wide/Social  │
│  ✗ Traductions relues (97 €)  │  ✗ Modules à la carte (27 €)  │
├──────────────────────────────┼──────────────────────────────┤
│  CTA : « Commencer »          │  CTA : « Passer en pro » (★)   │
│  bouton vert plein            │  bouton pourpre plein          │
└──────────────────────────────┴──────────────────────────────┘
```

Rendu visuel cible (deux cartes côte à côte sur la page `/v3/forfaits`) :
- Carte Plume : fond `--v3-emerald-50`, accent `#0d7a5f`, bouton « Commencer » vert plein.
- Carte Édition : fond `--v3-gold-soft`, accent `#5B21B6` (pourpre), badge « ★ Recommandé »,
  bouton pourpre plein — déjà le `featured` actuel dans `V3ForfaitsPage`.
- Studio Pro : conserve son bandeau or `#b4831f` « 👑 Tout inclus » (grille existante).

Aucune modification des prix dans ce chantier ; la grille couleur est un rendu de
présentation pour valider l'arbitrage tarifaire séparément.



## Ce qui sera construit

### 1. Figure + prénom par upsell
Chaque encart porte un personnage original avec un prénom français différent des agents existants (Camille, Victor… déjà pris) et de Marie/Rachel (déjà utilisés en emailing) :
- **Revenus & Scaling** → « Étienne » (« ses royalties ont doublé »)
- **Distribution Wide** → « Hélène » (« son livre vendu sur 5 plateformes »)
- **Trafic Social** → « Yanis » (« 12 000 vues sur son book trailer »)
- **Qualité Éditoriale** → « Margaux » (« zéro faute, avis 5 étoiles »)
- **Étude de Marché** → « Karim » (« a trouvé sa niche en 10 minutes »)
- **Promotion Éditeur** → « Sophie » (« son livre en librairie »)
- **Transcription** → « Mehdi » (« ses podcasts devenus un livre »)
- **Documentation Studio** → « Claire » (« toute sa doc en une journée »)
- **Boost Lancement** → « Lina » (« 50 ventes la première semaine »)
- Figures : avatars SVG colorés originaux (composant réutilisable type `AgentAvatar`), aucune copie de style existant.

### 2. Composant `V3UpsellPromoCard.tsx`
Encart compact réutilisable : figure + prénom, mini-témoignage d'une phrase, titre du pack, prix, badge, CTA « Débloquer » (ouvre le tunnel de paiement existant) ou « Ouvrir » si déjà acheté (via `useV3Entitlement`).

### 3. Placement des encarts
- **Page `/v3/upsells`** : refonte avec la grille complète des encarts personnifiés (packs essentiels + à la carte + Pack Pro 547 € en tête).
- **Page d'accueil V3** : bandeau rotatif « Ils ont boosté leur livre » (1 encart aléatoire parmi 3, sous le panneau capacités).
- **Sous un livre terminé** (`V3BookActionsBar`) : encart contextuel — ex. livre terminé → Boost Lancement 17 € ou Trafic Social.
- **Modules verrouillés** (`V3LockedGate`) : encart du pack correspondant avec sa figure au lieu du simple cadenas.
- Exclusions marketing respectées : aucun encart sur `/commander`, `/commande`, checkout (règle existante).

### 4. Aucune donnée fictive trompeuse
Les prénoms illustrent des cas d'usage pédagogiques, présentés comme des exemples (« Comme Étienne, maximise tes revenus »), pas comme de faux témoignages clients.

## Détails techniques
- `src/components/v3public/V3UpsellPromoCard.tsx` (nouveau)
- `src/data/v3UpsellFigures.ts` (nouveau) : mapping pack → prénom, couleur, phrase
- Modifications : `V3UpsellsPage.tsx` (ou page packs roadmap), `V3HomePage.tsx`, `V3BookActionsBar.tsx`, `V3LockedGate.tsx`
- Aucune modification des prix ni des edge functions de paiement
- Tokens du thème V3 (or/émeraude/crème), pas de couleurs en dur

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

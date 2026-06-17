# Proposition : 3 nouveaux packs upsell « Maison d'édition »

## Philosophie tarifaire

La base 197€ et les 4 packs existants restent inchangés. On ajoute **3 nouveaux packs** en upsell pour les 3 pôles que tu as retenus. L'objectif : un auteur qui veut vraiment professionnaliser son catalogue paie à la pièce, ou prend le **Pack Tout Complet 497€** (ancrage) qui les débloque tous — créant un écart psychologique fort avec le prix à la pièce.

---

## Les 3 nouveaux packs

### Pack 5 — « Qualité Éditoriale Pro » — 67€
**Positionnement** : ce que fait un éditeur avant d'accepter un manuscrit.

| Module | Description |
|--------|-------------|
| Comité de lecture IA | Fiche de lecture pro : synopsis, forces/faiblesses, potentiel commercial, verdict « accepté / à retravailler / refusé » |
| Édition structurelle (developmental edit) | Analyse de la structure narrative : rythme, cohérence, promesses tenues, suggestions de réorganisation |
| Copy-editing & ligne éditoriale | Passe d'édition phrase à phrase (style, registre, répétitions) sans toucher au fond |
| Charte de collection | Définition d'une collection éditoriale cohérente (ton, format, gabarit couverture, mentions) réutilisable sur plusieurs titres |
| Label qualité maison d'édition | Checklist certifiante « niveau édition pro » + badge une fois tous les contrôles validés |

### Pack 6 — « Distribution Large (Wide) » — 97€
**Positionnement** : sortir de l'exclusivité Amazon, diffuser comme un éditeur.

| Module | Description |
|--------|-------------|
| Assistant distribution multi-plateformes | Guide + métadonnées formatées pour Kobo, Apple Books, Google Play, Fnac/ePagine, via Draft2Digital / StreetLib |
| Dépôt légal & ISBN | Accompagnement dépôt légal BNF, gestion registre ISBN par titre/collection, ISSN pour séries |
| Export EPUB normé | Vérification conformité EPUB 3 pour les plateformes wide (au-delà du flux KDP actuel) |
| Tableau de bord catalogue | Vue d'ensemble du catalogue : titres, collections, statut de diffusion par canal, ISBN, dépôt légal |

### Pack 7 — « Promotion Éditeur » — 97€
**Positionnement** : les leviers promo que seuls les éditeurs utilisent (hors marketing KDP déjà couvert).

| Module | Description |
|--------|-------------|
| Service de presse (SP) | Génération dossier de presse, communiqué, liste-types journalistes/blogueurs littéraires, e-mails d'envoi SP |
| Libraires & salons | Argumentaire libraire, fiche office, préparation salons/dédicaces |
| Droits étrangers | Pitch de cession de droits de traduction, repérage marchés porteurs par genre |
| Précommandes | Stratégie et calendrier de précommande multi-plateformes |

---

## Grille tarifaire complète mise à jour

| Offre | Prix | Économie |
|-------|------|----------|
| Base V3 (Publication Assistée Pro) | 197€ | — |
| Pack Visuel & Conversion | 67€ | — |
| Pack Lancement & Visibilité | 147€ | — |
| Pack Trafic Social & Viralité | 87€ | — |
| Pack Revenus & Scaling | 99€ | — |
| **Pack Qualité Éditoriale Pro** | **67€** | — |
| **Pack Distribution Large** | **97€** | — |
| **Pack Promotion Éditeur** | **97€** | — |
| **À la pièce (total)** | **761€** | — |
| **Pack Tout Complet** | **497€** | **264€** |

> Le Pack Tout Complet passe de 497€ (ancrage) vs 761€ à la pièce. Économie de 264€, message : « pour 300€ de plus que la base, tu as tout ».

---

## Ce que ça implique techniquement (par phase)

### Phase 1 — Grille tarifaire et roadmap (immédiat)
- Ajouter les 3 `V3PackId` (`editorial`, `distribution`, `promotion`) dans `src/data/roadmapV3.ts`
- Ajouter les modules avec `status: 'todo'` dans `V3_MODULES`
- Mettre à jour `V3_UPSELL_PACKS`, `V3_FULL_PACK`, `MODULE_TO_PACK`, `V3_UPSELLS_TOTAL`
- Mettre à jour `V3PricingTiers` et `PricingLadder497` pour afficher les 7 packs

### Phase 2 — Packs à construire (priorisé)
Je te recommande de lancer dans cet ordre :
1. **Qualité Éditoriale Pro** (67€) — 100% génération IA, aucune base de données complexe, rapide à déployer
2. **Distribution Large** (97€) — guides + métadonnées + tables légères (ISBN, dépôt légal)
3. **Promotion Éditeur** (97€) — templates + stratégie IA, similaire aux séquences marketing déjà existantes

### Phase 3 — Intégration V3 Hub
- Nouvelles sections dans le cockpit V3 (Kanban ou liste) pour les 3 piliers `edition`, `distribution`, `promotion`
- Couleurs de pilier : `edition` (bordeaux/rouge éditorial), `distribution` (bleu wide), `promotion` (or/jaune éditeur)
- Droits d'accès via `useV3Entitlement` avec les nouveaux `plan` prefixes

---

## Questions ouvertes

1. **Nom du Pack Tout Complet** : on le garde à 497€ malgré les 3 nouveaux packs ? Ça crée une économie de 264€ (très vendeur). Ou tu veux remonter à 597€ pour aligner sur le coût réel ?
2. **Qualité éditoriale dans la base ?** Mon choix est upsell (67€) car c'est un vrai service éditorial. Tu veux quand même le mettre en base 197€ pour différencier V3 ?
3. **Par quoi on commence** : tu veux que je lance la Phase 1 (grille) + la construction du Pack Qualité Éditoriale Pro (le plus rapide) tout de suite ?
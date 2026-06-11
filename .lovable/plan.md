# Clarifier ce à quoi l'abonné V3 a droit

## Objectif
Rendre limpide, malgré le grand nombre d'onglets, ce que l'abonné peut utiliser selon ce qu'il a réellement payé.

## Règles de droits (décidées)

**Base 197€ — INCLUS (à volonté) :**
- Écrire et publier autant de **livres / ebooks texte** que voulu (Studio, 30 agents IA, pipeline complet)
- **Livres low-content** (carnets, journaux, planners)
- Tous les outils KDP de publication : couverture exacte, pack KDP ZIP, conformité, métadonnées, export multi-format, checklist, etc. (= modules `tier: 'core'`)

**PAYANT — packs premium (497€ Tout Complet, ou pack à la carte) :**
- **Audiobooks** (Audiobook Express) → déjà `tier: 'upsell'`
- Couvertures premium IA, marketing/lancement, réseaux sociaux, monétisation avancée (les 4 packs existants)

**Hors générateur (à part) :** Blog (BlogCluster) et guides avancés — ne font pas partie de la base, restent signalés comme externes.

> La distinction technique existe déjà : `getModuleTier(id)` renvoie `'core'` (inclus 197€) ou `'upsell'` (pack). On s'appuie dessus, on ne refait pas la taxonomie.

## Ce qu'on construit

### 1. Source de vérité des droits (par module)
Dans `src/data/roadmapV3.ts`, ajouter une petite fonction `getModuleAccess(moduleId)` qui renvoie :
- `'included'` → module `core` (compris dans la base 197€)
- `'pack'` → module `upsell` (nécessite un pack / le Tout Complet)

(Dérivé de `getModuleTier`, aucune donnée dupliquée.)

### 2. Hook de droits → décision d'affichage
Réutiliser `useV3Entitlement()` (déjà existant : `hasBase`, `hasFull`, `isAdmin`).
Règle d'« débloqué » par module :
- module `included` → débloqué si `hasBase` (ou admin)
- module `pack` → débloqué si `hasFull` (ou admin)

(Le suivi par pack individuel n'existe pas en base ; on traite `core` = base, `upsell` = Tout Complet, ce qui couvre les deux formules réelles.)

### 3. Badge clair sur chaque carte (`V3HubPage.tsx` → `ModuleCard`)
Remplacer l'actuel badge « Option » par un badge explicite et systématique :
- **« Inclus 197€ »** (vert) pour les modules `included`
- **« Option / Pack »** (ambre, cadenas) pour les modules `pack`
- Quand l'abonné a débloqué le module : pastille **« Débloqué »** ; sinon, sur un module pack non payé, **« À débloquer »** + clic ouvre le checkout (comportement déjà présent).

### 4. Filtre « Mes outils » (demande principale)
Ajouter un chip de filtre dans la barre de filtres du Hub, à côté de « Tous » :
- **« Mes outils »** → n'affiche que les modules réellement débloqués pour cet abonné (selon §2).
- État dynamique via `useV3Entitlement`. Pour un visiteur non connecté / non payé : affiche les modules `included` en aperçu, le reste verrouillé.
- Petite légende discrète sous la barre : « 🟢 Inclus dans votre formule · 🔒 Disponible en pack ».

### 5. Cohérence des compteurs
La carte stat « 197€ / Accès à vie » du hero gagne une ligne de contexte : « Livres & ebooks illimités inclus ». Le filtre « Mes outils » affiche le nombre d'outils réellement accessibles.

## Fichiers touchés
- `src/data/roadmapV3.ts` — ajout `getModuleAccess()` (dérivé, non destructif)
- `src/pages/V3HubPage.tsx` — badges Inclus/Option/Débloqué sur `ModuleCard`, chip « Mes outils », légende, branchement `useV3Entitlement`
- (lecture seule) `src/hooks/useV3Entitlement.ts`, `src/components/admin/V3PricingTiers.tsx`

## Hors périmètre
- Pas de nouvelle table ni de suivi d'achat par pack individuel (on garde base vs Tout Complet).
- Pas de changement des prix ni de la logique de paiement.
- Le blog et les guides restent hors générateur (simple mention « externe »).

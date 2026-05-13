## Constat

Tu as raison : le planner a ~56 `case` (tous les outils accessibles via `activeTab`). Le popover « Tous les outils » actuel n'en liste que **36**. Voici les **20 manquants** :

**Plan**
- (rien à ajouter ici, tout y est)

**Écrire**
- `tools` (boîte à outils)
- `atlas`, `encyclopedia`, `documentary`, `agenda`, `scolaire` (formats KDP spécialisés)
- `content-architect` (agent P3)

**Habiller**
- (complet)

**Publier**
- `audit-pilot` (audit pré-publication)
- `kdp-keywords-pro` (recherche mots-clés KDP)

**Vendre**
- `kdp-ads-guide` (guide Amazon Ads)
- `chrome-extension` (extension)

**Mon Compte / Communauté** (nouvelle famille à créer dans le popover seulement, pas dans la barre)
- `parrainage`, `communaute`, `admin`, `admin-subscribers`, `subscription`, `settings`

## Plan d'action

### 1. Compléter `ALL_TOOLS` dans `src/components/layout/EspaceHeader.tsx`

Ajouter les 14 entrées manquantes dans les 5 groupes existants (Écrire +6, Publier +2, Vendre +2) + créer un 6ᵉ groupe **« Mon Compte »** (6 entrées : Mes projets *(déjà ailleurs, on garde)*, Abonnement, Paramètres, Parrainage, Communauté, Admin).

→ On passe de **36 → 56 outils** dans le popover. Plus rien ne disparaît.

### 2. Compléter `PLANNER_SUBTABS` (sous-barre contextuelle)

Ajouter les outils utiles dans la 2ᵉ rangée :
- **Écrire** : ajouter `tools` (« Boîte à outils »)
- **Publier** : ajouter `audit-pilot` (« Audit pré-publication »), `kdp-keywords-pro` (« Mots-clés KDP »)
- **Vendre** : ajouter `kdp-ads-guide` (« Amazon Ads »)

### 3. Étendre les `match[]` de `PLANNER_TABS`

Pour que la bonne famille s'illumine quand on clique sur ces outils :
- `writing.match` += `tools, atlas, encyclopedia, documentary, agenda, scolaire, content-architect`
- `export.match` += `audit-pilot, kdp-keywords-pro`
- `marketing.match` += `kdp-ads-guide, chrome-extension`

### 4. Ajouter un groupe « Mon Compte » dans le popover

Le bouton « Mon espace » (à gauche) reste pour revenir à `/espace`. Mais `subscription`, `settings`, `parrainage`, `communaute`, `admin` sont accessibles depuis le planner — on les liste donc dans le popover sous une 6ᵉ colonne « Mon Compte ». La grille passe à `lg:grid-cols-6` (ou wrap propre).

### 5. Hors périmètre (laissés volontairement)

- `onboarding`, `coloring` (dédiées, pleines pages)
- `bd-studio` (route séparée, pas dans `activeTab`)

## Résultat attendu

- 5 onglets familles (inchangés)
- Sous-barre contextuelle qui couvre les outils courants de la famille
- Popover « Tous les outils » qui liste **les 56 outils** organisés en 6 colonnes avec recherche → l'abonné retrouve **tout**, en ≤ 2 clics, sans sidebar.

## Fichier modifié

- `src/components/layout/EspaceHeader.tsx` (uniquement)

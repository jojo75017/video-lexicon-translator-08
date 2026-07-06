# Enrichir le Pack 347€ avec une suite « Étude de Marché » (équivalent BookBeam)

## Constat
Le Pack Pro 347€ paraît vide car la base 197€ a absorbé la couverture, le lancement, l'IA de création, etc. Le 347€ ne rajoute aujourd'hui que 4 packs (Revenus, Distribution, Social, Édition). Il manque tout le volet **data / étude de marché façon BookBeam** — c'est justement ce qui justifie un tier « Pro ».

Décision retenue : **d'abord enrichir le catalogue** (ajout des modules comme cartes dans le hub, statut « à construire »), source de données prévue = **Amazon réel (Firecrawl / Amazon PA-API déjà configurés) + estimation IA clairement étiquetée**. Aucun code d'outil fonctionnel dans cette étape ; on rééquilibre la valeur perçue, puis on codera chaque outil ensuite.

## Ce que j'ajoute
Un nouveau pilier **« Étude de Marché »** et un nouveau pack essentiel **« Pack Étude de Marché Pro »**, inclus dans le Pack Pro 347€ (donc débloqué automatiquement par l'achat 347€, comme les autres packs essentiels).

### Nouveaux modules (inspirés de BookBeam, sans plagiat, adaptés au marché francophone)
1. **Base de Données Livres Amazon** — recherche de produits avec filtres (BSR, prix, avis, date, format) via Firecrawl.
2. **Estimateur de Ventes (BSR → ventes/revenus)** — conversion BSR → ventes mensuelles + revenus estimés (données Amazon réelles + modèle d'estimation IA étiqueté).
3. **Recherche de Mots-clés Amazon** — volume, concurrence, suggestions autocomplétion Amazon réelles.
4. **Suivi de Positions (Rank Tracker)** — suivi dans le temps du classement d'un livre sur ses mots-clés.
5. **Reverse ASIN** — extraire les mots-clés sur lesquels un livre concurrent se positionne.
6. **Analyse & Score de Niche** — rentabilité, saturation, demande vs offre, verdict chiffré.
7. **Explorateur de Catégories & BSR** — arborescence des catégories Amazon + seuils de BSR par bestseller.
8. **Analyse d'Avis Concurrents** — extraction des points de douleur / attentes récurrentes depuis les avis (Firecrawl + IA).
9. **Suivi de Concurrents** — évolution prix / rang / avis d'une liste de titres surveillés.
10. **Recherche Mots-clés Amazon Ads** — mots-clés publicitaires et estimation d'enchères.
11. **Vérification Marques Déposées** — contrôle qu'un titre/nom n'est pas une marque protégée.

## Détails techniques
Tout se fait dans **`src/data/roadmapV3.ts`** (source unique de vérité), donc les hubs (`V3AccessRecap`, `V3PricingTiers`, workflow, gates) se mettent à jour automatiquement.

1. **Type** : ajouter `'data'` à `V3Pillar` et `'market-research'` à `V3PackId`.
2. **`V3_PILLAR_META`** et **`V3_PILLAR_COLORS`** : entrée `data` (label « Étude de Marché », emoji 📊, couleur cohérente KDP + variante indigo).
3. **`V3_UPSELL_PACKS`** : ajouter l'objet pack `market-research` (non `alacarte` → inclus dans le Pack Pro 347€) listant les 11 IDs ci-dessus, avec un prix indicatif (ex. 97€) et un `desc`.
4. **`V3_MODULES`** : ajouter les 11 modules avec `status: 'todo'`, `pillar: 'data'`, titres/descriptions ci-dessus. Comme ils appartiennent à un pack et ne sont PAS dans `V3_BASE_MODULE_IDS`, `getModuleAccess` les classe automatiquement en `pack` → ils s'affichent bien côté 347€, pas 197€.

### Effets automatiques (aucune autre modif nécessaire)
- `V3_UPSELLS_TOTAL`, `V3_FULL_PACK.compareAt` et `.saves` se recalculent : le Pack Pro 347€ affiche une valeur barrée plus élevée (meilleure perception).
- `V3AccessRecap` affiche les 11 nouveaux outils dans la colonne « Pack premium 347€ ».
- Le compteur « X/Y outils débloqués » et les gates fonctionnent sans changement.

## Hors périmètre (étapes suivantes)
- Codage réel de chaque outil (edge functions Firecrawl/PA-API + UI). On les branchera un par un après validation du catalogue.
- Aucun changement de prix du Pack Pro (reste 347€) ni de la base 197€.

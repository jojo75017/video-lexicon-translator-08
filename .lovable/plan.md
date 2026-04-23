
## Ajouter un module d’audit type “KDP Pilot” dans EbookStudio

### Objectif
Créer dans EbookStudio un outil proche du principe de KDP Pilot, sans dépendre directement de leur plateforme : l’utilisateur pourra renseigner un ASIN Amazon ou importer ses propres données KDP/Ads, puis obtenir un audit clair du livre avec les modifications à effectuer.

### Point important
On ne peut pas aspirer les données privées de KDP Pilot ni copier leur interface interne. En revanche, on peut construire dans EbookStudio une fonctionnalité équivalente avec :
- données publiques Amazon via ASIN
- données personnelles importées par l’utilisateur depuis KDP / Amazon Ads
- analyse IA pour recommander les corrections à faire

---

## Ce qui existe déjà dans le projet

EbookStudio possède déjà une bonne base :

```text
Recherche KDP Amazon
- récupération ASIN
- prix
- note
- avis
- BSR
- catégories
- description
- ventes estimées
- extraction de mots-clés
- audit IA de fiche produit
```

Fichiers déjà en place :
```text
src/components/ebook/KdpAmazonResearch.tsx
supabase/functions/kdp-asin-scraper/index.ts
supabase/functions/kdp-book-audit/index.ts
```

La stratégie la plus efficace est donc d’améliorer ce module existant au lieu de créer un outil séparé.

---

## Fonctionnalité à construire

### 1. Audit livre par ASIN
L’utilisateur entre un ASIN Amazon.

Le système récupère :
- titre
- auteur
- prix
- note
- nombre d’avis
- BSR
- catégories
- description
- nombre de pages
- URL Amazon
- estimation ventes / mois
- estimation revenus / mois

Puis l’IA génère un audit structuré.

### 2. Recommandations de modifications
Pour chaque livre, l’audit indiquera :

```text
Titre
- score
- problème détecté
- suggestion de titre amélioré
- mots-clés à intégrer

Sous-titre
- clarté de la promesse
- niveau SEO
- suggestion de reformulation

Description Amazon
- points faibles
- sections manquantes
- version améliorée prête à copier

Catégories
- pertinence
- opportunités
- catégorie plus adaptée si détectable

Mots-clés backend
- 7 mots-clés suggérés
- mots-clés concurrents repérés
- mots-clés à éviter

Prix
- cohérence avec le marché
- recommandation de prix

Avis / réputation
- résumé des signaux positifs
- freins probables à la conversion

Positionnement
- diagnostic global
- actions prioritaires
```

### 3. Score global de correction
Ajouter un score clair :

```text
Score commercial KDP : 72/100
Priorité : À optimiser avant publicité
Potentiel : Moyen / Bon / Fort
```

Avec une liste d’actions :

```text
À corriger en premier :
1. Réécrire le sous-titre avec le mot-clé principal
2. Ajouter une promesse chiffrée dans la description
3. Repositionner le prix entre 2,99€ et 4,99€
4. Ajouter 7 mots-clés backend plus ciblés
```

---

## Ajouter un import de données KDP / Ads

Pour se rapprocher davantage de KDP Pilot, on peut ajouter un deuxième mode :

```text
Importer mes données KDP
```

L’utilisateur pourra importer un fichier CSV exporté depuis :
- rapports KDP
- rapports Amazon Ads
- ventes mensuelles
- royalties
- campagnes publicitaires

Le système analysera :
- livres qui vendent peu
- livres avec bon trafic mais mauvaise conversion
- livres avec ventes mais prix mal optimisé
- livres avec dépenses Ads non rentables
- titres à prioriser

Exemple de sortie :

```text
Livre A
Statut : Sous-performant
Problème probable : conversion faible
Action : refaire description + couverture + mots-clés

Livre B
Statut : bon potentiel
Problème probable : manque de visibilité
Action : campagne Ads + optimisation catégories
```

---

## Interface proposée

Dans `Recherche KDP Amazon`, ajouter un nouvel onglet :

```text
Audit Pilot
```

Il contiendra 2 blocs :

```text
1. Audit par ASIN
[Champ ASIN] [Analyser]

2. Audit par fichier KDP / Ads
[Importer CSV] [Analyser mes performances]
```

Puis une section résultat :

```text
Diagnostic global
Score
Priorités
Corrections recommandées
Titres / sous-titres suggérés
Description optimisée
Mots-clés backend
Plan d’action 7 jours
```

---

## Modifications techniques prévues

### Frontend
Modifier :

```text
src/components/ebook/KdpAmazonResearch.tsx
```

Ajouter :
- un onglet `Audit Pilot`
- un formulaire ASIN
- un import CSV
- une carte de résultats détaillée
- boutons copier pour les suggestions
- badges de priorité : critique, important, recommandé

### Backend IA
Améliorer :

```text
supabase/functions/kdp-book-audit/index.ts
```

Le prompt IA sera renforcé pour retourner plus de données :

```json
{
  "globalScore": 72,
  "verdict": "...",
  "priorityLevel": "important",
  "titleAudit": {
    "score": 65,
    "problems": [],
    "suggestedTitles": []
  },
  "descriptionAudit": {
    "score": 70,
    "improvedDescription": "..."
  },
  "keywordsAudit": {
    "backendKeywords": [],
    "missingKeywords": []
  },
  "pricingAudit": {},
  "conversionAudit": {},
  "actionPlan": []
}
```

### Scraping Amazon
Conserver et améliorer :

```text
supabase/functions/kdp-asin-scraper/index.ts
```

Ajouter si possible :
- meilleure détection des catégories
- meilleure extraction BSR
- meilleure extraction des avis
- meilleure extraction de description
- fallback plus propre si Amazon bloque partiellement la page

### Import CSV
Créer un petit parser côté frontend pour lire les CSV importés.

Si les données doivent être conservées dans le temps, ajouter ensuite une table backend. Pour une première version simple, l’analyse peut rester temporaire sans stockage.

---

## Données utilisées

### Données publiques
- page Amazon du livre
- ASIN
- titre
- description
- avis visibles
- BSR
- catégories
- prix

### Données privées uniquement si l’utilisateur les importe
- ventes KDP
- royalties
- dépenses Ads
- clics
- impressions
- commandes
- ACOS
- ROAS

Aucune connexion directe au compte KDP n’est prévue au départ, car Amazon KDP ne fournit pas facilement une API publique complète pour ce type d’usage.

---

## Résultat final attendu

L’utilisateur pourra faire ceci :

```text
1. Entrer l’ASIN d’un livre
2. Cliquer sur “Auditer”
3. Voir ce qui bloque les ventes
4. Obtenir les corrections concrètes
5. Copier les nouveaux titres, descriptions et mots-clés
6. Prioriser les livres à améliorer
```

Ce module donnera à EbookStudio une fonction très proche de l’esprit KDP Pilot, mais intégrée directement dans votre workflow existant.

---

## Ordre d’implémentation

1. Améliorer le format de réponse de `kdp-book-audit`
2. Ajouter l’onglet `Audit Pilot` dans `KdpAmazonResearch.tsx`
3. Créer l’affichage détaillé des recommandations
4. Ajouter les boutons copier
5. Ajouter l’import CSV KDP/Ads en version simple
6. Tester sur plusieurs ASIN Amazon
7. Ajuster les prompts IA pour obtenir des recommandations plus précises

---

## Version courte recommandée

Pour limiter les risques et stabiliser rapidement, je recommande de faire d’abord :

```text
Version 1 :
Audit Pilot par ASIN uniquement
```

Puis ensuite :

```text
Version 2 :
Import CSV KDP / Amazon Ads
```

Cela permet d’avoir rapidement un outil fonctionnel sans casser le module KDP actuel.

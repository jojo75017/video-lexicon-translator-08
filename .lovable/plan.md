
## Rendre visibles “Mots-Clés KDP Pro” et “Audit Pilot” dans l’application

### Problème identifié
Les pages existent bien :
- `/kdp-keywords`
- `/audit-pilot`

Mais elles restent pratiquement invisibles pour l’utilisateur parce que :
1. Elles ne sont pas déclarées dans la navigation principale `ModernSidebar.tsx`.
2. Elles ne sont pas incluses dans les outils essentiels de `modernSidebarSections.ts`.
3. Le bouton vers Audit Pilot n’est visible que depuis la page mots-clés.
4. Vous êtes actuellement sur `/offres`, qui n’affiche pas la sidebar du générateur, donc aucun accès direct n’y apparaît.

---

## Ce qui sera corrigé

### 1. Ajouter les 2 outils dans la sidebar principale
Dans `src/components/layout/ModernSidebar.tsx`, ajouter dans le groupe **📦 Publier** :

```text
- Mots-Clés KDP Pro  -> /kdp-keywords
- Audit Pilot KDP   -> /audit-pilot
```

Configuration prévue :
- `isLink: true`
- `href: '/kdp-keywords'`
- `href: '/audit-pilot'`
- badge `isNew: true` pour bien les distinguer

Ajouter aussi leurs tooltips :
- Mots-Clés KDP Pro : recherche avancée de mots-clés Amazon KDP
- Audit Pilot KDP : audit d’un livre par ASIN + recommandations IA

---

### 2. Les rendre visibles par défaut
Dans `src/components/layout/modernSidebarSections.ts` :

- ajouter `kdp-keywords-pro`
- ajouter `audit-pilot`

dans :
- `SIDEBAR_SUBSECTIONS['📦 Publier']`, sous une sous-section `KDP`
- `ESSENTIAL_TOOL_IDS['📦 Publier']`

Résultat :
- ils apparaîtront immédiatement
- ils ne seront plus cachés derrière “Voir outils avancés”

---

### 3. Renforcer visuellement la sidebar
Dans `src/components/layout/ModernSidebar.tsx`, améliorer la lisibilité :

- état actif plus visible
  - fond plus contrasté
  - bordure gauche colorée
  - ombre légère
- labels plus lisibles
  - texte un peu plus foncé
  - poids typographique renforcé
- meilleur hover
  - léger déplacement horizontal
  - fond plus net
- groupe actif plus évident
  - séparation visuelle du pilier ouvert
  - contraste renforcé sur le badge du groupe

Objectif :
que l’utilisateur voie immédiatement où cliquer dans **📦 Publier**.

---

### 4. Ajouter un accès direct depuis la page /offres
Comme vous êtes sur `/offres` et que cette page n’utilise pas la sidebar, ajouter un accès visible depuis la page d’offres vers les outils abonnés.

Dans la page `/offres` :
- ajouter une zone ou une carte “Accéder aux outils KDP”
- avec deux boutons :
  - `Mots-Clés KDP Pro`
  - `Audit Pilot KDP`

Comportement :
- si l’utilisateur est connecté/abonné : navigation directe
- sinon : redirection vers le flux d’accès existant

Cela évite que ces outils soient “introuvables” depuis la page que vous consultez actuellement.

---

### 5. Mieux mettre Audit Pilot en avant dans la page mots-clés
Dans `src/pages/KdpKeywordResearchPage.tsx` :

- agrandir le bouton `Audit Pilot KDP`
- ajouter un badge `Nouveau`
- ajouter une carte CTA en haut de page avec texte clair :

```text
Auditer un livre Amazon
Diagnostic complet par ASIN + plan d’action
[ Lancer Audit Pilot ]
```

---

## Fichiers à modifier

```text
src/components/layout/ModernSidebar.tsx
- Ajouter les entrées sidebar
- Ajouter les tooltips
- Renforcer contraste et visibilité

src/components/layout/modernSidebarSections.ts
- Ajouter kdp-keywords-pro et audit-pilot
- Les placer dans les essentiels visibles

src/pages/KdpKeywordResearchPage.tsx
- Rendre Audit Pilot beaucoup plus visible

src/pages/SalesPage.tsx
- Ajouter un accès direct vers les 2 outils depuis /offres
```

---

## Résultat attendu

Après implémentation :

```text
Depuis la sidebar :
📦 Publier
- Mots-Clés KDP Pro
- Audit Pilot KDP
```

et depuis `/offres` :
```text
Une zone visible permettra d’ouvrir directement
- Mots-Clés KDP Pro
- Audit Pilot KDP
```

Donc vous pourrez les voir :
1. dans le générateur via la sidebar
2. depuis la page d’offres que vous consultez actuellement

---

## Priorité d’exécution
1. Ajouter les 2 liens dans la sidebar
2. Les rendre essentiels donc visibles
3. Ajouter les raccourcis sur `/offres`
4. Renforcer le contraste de la barre latérale
5. Mettre davantage en avant Audit Pilot dans la page mots-clés

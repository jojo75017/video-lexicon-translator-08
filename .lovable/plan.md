

## Objectif
Créer un nouveau module pédagogique "Maîtriser KDP Ads sans se faire arnaquer" — pas de vraies pubs, juste un guide éducatif premium pour aider tes abonnés à éviter les pièges classiques d'Amazon Ads.

## Faisabilité
100% possible. C'est un contenu statique enrichi (texte + tableaux + checklists + simulateurs simples) qui ne nécessite aucune API Amazon Ads. On reste dans le cadre légal et éthique : on **explique**, on ne **gère** pas les campagnes.

## Ce que je vais créer

### 1. Nouvelle page `/kdp-ads-guide` (accès abonnés)
Structure en 6 onglets pédagogiques :

**Onglet 1 — Les 7 Arnaques à Éviter**
- Le piège du "Ciblage Automatique" qui brûle ton budget
- Les enchères par défaut trop élevées (Amazon suggère toujours plus haut)
- Les mots-clés "broad match" qui matchent n'importe quoi
- Le ACOS qui ment (différence ACOS vs TACOS expliquée)
- Les campagnes "Lock & Leave" abandonnées qui saignent
- Les "agences KDP Ads" à 500€/mois qui font ce que tu peux faire
- Le mythe "plus je dépense, plus je vends"

**Onglet 2 — Les 3 Types de Campagnes (Quand & Pourquoi)**
- Sponsored Products (manuel vs auto) — le seul vraiment utile pour débuter
- Sponsored Brands — réservé aux séries de 3+ livres
- Lockscreen Ads — à éviter (ROI quasi nul pour 95% des niches)

**Onglet 3 — Stratégie d'Enchères Sécurisée**
- Calculateur simple : "Mon livre vaut X€ → enchère max = ?"
- Formule : `Enchère max = (Royalty × Taux conversion estimé) / 2`
- Tableau de référence : non-fiction vs fiction vs low-content
- Quand monter / quand baisser (règles 7-14-30 jours)

**Onglet 4 — Les Mots-Clés qui Marchent (sans payer 0,80€ le clic)**
- Long-tail vs head terms
- Les 50 mots-clés "défensifs" (ton propre nom + titre)
- Comment voler les mots-clés des concurrents (légalement)
- Les "negative keywords" indispensables (liste de 30 à exclure d'office)

**Onglet 5 — Lecture des Rapports (sans se faire avoir)**
- Décrypter le Search Term Report
- Les 4 KPI qui comptent vraiment (CTR, CVR, ACOS, TACOS)
- Quand une campagne est "morte" et qu'il faut la tuer
- Tableau de bord type à recopier dans Excel

**Onglet 6 — Checklist Lancement Ads (J-1 à J+30)**
- J-1 : prérequis avant la 1ère pub (description optimisée, 5 reviews mini, A+ Content)
- J+0 à J+7 : phase d'apprentissage, ne touche à rien
- J+8 à J+14 : premières optimisations
- J+15 à J+30 : scaling intelligent
- Budget de test recommandé : 5€/jour × 14 jours = 70€ max

### 2. Intégration dans `/offres`
Nouvelle section "🎯 Bonus Inclus : Guide Anti-Arnaque KDP Ads" entre `KdpRocketParityTable` et la FAQ, avec CTA vers `/kdp-ads-guide`.

### 3. Entrée sidebar
Ajout dans la section "📣 Vendre" → nouveau bouton **"Guide KDP Ads"** (id: `kdp-ads-guide`).

## Fichiers à créer/modifier

**Créer**
- `src/pages/KdpAdsGuidePage.tsx` (page principale avec les 6 onglets)
- `src/components/sales/KdpAdsTeaser.tsx` (encart sur `/offres`)

**Modifier**
- `src/App.tsx` — nouvelle route `/kdp-ads-guide` (gated abonnés)
- `src/pages/SalesPage.tsx` — insérer `<KdpAdsTeaser />`
- `src/components/layout/modernSidebarSections.ts` — ajouter `kdp-ads-guide` dans Marketing

## Ce que je NE fais PAS (pour rester clean)
- Aucune connexion API Amazon Ads (pas autorisée par Amazon pour ce cas d'usage)
- Aucune simulation de "vraies stats" (pas de Math.random — règle projet)
- Aucune promesse de ROI — uniquement de la pédagogie
- Pas de contenu copié de KDP Rocket / Publisher Rocket — rédigé à partir de tes connaissances métier

## Style visuel
Charte Amazon KDP existante (bg #FAFAFA, accent #008296, hover #FF9E2D). Onglets en haut, cartes pédagogiques avec icônes d'alerte rouges pour les pièges, vertes pour les bonnes pratiques.


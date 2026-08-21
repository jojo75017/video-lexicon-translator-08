# Page d'accueil V3 — version longue « comprendre la V3 »

## Objectif
Transformer `/v3` (V3HomePage) en une vraie page longue de présentation : le lecteur doit comprendre **ce qu'est concrètement la V3**, **ce que ça lui apporte**, **comment ça marche étape par étape** et **pourquoi c'est différent**, avec de **vraies captures d'écran de l'application** (pas de maquettes fictives).

## Structure de la nouvelle page (ordre des sections)

1. **Haut de page inchangé** : V3LaunchBanner, V3HeroBanner, V3EngineStrip/Grid (on garde l'existant).
2. **NOUVEAU — « Qu'est-ce que la V3, concrètement ? »**
   - Section longue en 3 blocs alternés (texte + capture d'écran réelle) :
     - Le studio complet : tableau de bord, onglets Plan / Écrire / Habiller / Publier / Vendre.
     - Le Génie Copilot : interview guidée, sommaire construit avec l'IA, validation chapitre par chapitre.
     - Le workflow des 15 agents : pipeline visible P1→P15 avec suivi en direct.
3. **NOUVEAU — « Comment ça marche, étape par étape »**
   - Frise numérotée en 6 étapes, chacune avec capture réelle :
     1. Décrire son idée (Génie / formulaire)
     2. Valider le sommaire IA
     3. La rédaction par les 15 agents (livre en direct)
     4. La couverture (Cover Studio Pro)
     5. La correction professionnelle (4 passes)
     6. L'export KDP (ZIP prêt à publier, métadonnées, BISAC)
4. **NOUVEAU — « Ce que la V3 vous apporte »**
   - 4 bénéfices orientés résultat : un livre complet prêt pour Amazon, un texte corrigé niveau maison d'édition, une couverture pro, des métadonnées KDP optimisées (mots-clés, catégories).
   - Rappel des 16 livrables (lien vers le panneau existant).
5. **NOUVEAU — « Pourquoi c'est différent des autres outils »**
   - Tableau comparatif : Outils IA classiques vs EbookStudio V3 (sommaire validé avant rédaction, mémoire de l'univers, correction 4 passes, export KDP complet, multimodèle Gemini + ChatGPT, vos propres clés = pas de surcoût caché).
6. **Sections existantes conservées**, dans cet ordre après les nouvelles : bandeau migration V2, KDP Pilot compact, actions rapides, pipeline 15 agents (lien), démarrage livre, pack 10 niches, capabilities panel, MarketProof, BeforeAfter, Audience, Guarantee, Licence commerciale, blog, outils vedettes, auteur invité, CTA final.
7. **Sommaire ancré en haut de page** (« Découvrir la V3 ») : liens d'ancrage vers les 4 nouvelles sections pour naviguer dans la page longue.

## Captures d'écran réelles (étape préalable)
- Lancer l'app en local (localhost:8080), restaurer la session, capturer via Playwright 6 à 8 écrans réels : tableau de bord V3, Génie/interview, workflow 15 agents, éditeur de livre, Cover Studio Pro, page données KDP.
- Sauvegarde dans `src/assets/v3-showcase/` (jpg), importées en ES modules, `loading="lazy"`, textes `alt` descriptifs.
- Si un écran exige des données inexistantes, on capture l'état vide réel (jamais de fausses données) ; les captures sont recadrées en 1280×800 avec un cadre « navigateur » stylisé (barre d'onglets) cohérent avec la charte émeraude/or.

## Détails techniques
- Nouveaux composants dans `src/components/v3public/` : `V3WhatIsPanel.tsx`, `V3HowItWorksSteps.tsx`, `V3BenefitsPanel.tsx`, `V3DifferenceTable.tsx`, `V3AnchorNav.tsx` — insérés dans `src/pages/v3public/V3HomePage.tsx`.
- Design tokens existants uniquement : `--v3-emerald`, `--v3-gold`, `--v3-cream`, `--v3-line`, classes `v3-serif`, `v3-card`, `v3-chip`, `v3-btn` — aucune couleur codée en dur hors tokens existants du fichier.
- Titres en serif, alternance de fonds crème / blanc / émeraude nuit (section « Pourquoi c'est différent » en fond sombre).
- Responsive mobile-first : blocs texte/capture empilés sur mobile.
- SEO : un seul H1 (dans le hero existant), H2 par nouvelle section, ancres avec `id`.
- Aucune nouvelle route, aucune modification backend, aucune donnée fictive.

## Vérification
- Navigation `/v3` en navigateur (Playwright) : contrôle visuel des 4 nouvelles sections, des captures, des ancres et du responsive (mobile + desktop), console sans erreur.


# Plan — /espace tout-en-un, jovial, sans renvoi vers les offres

## Objectif
Faire de `/espace` un vrai cockpit abonné : tout est accessible depuis cette page via une grille de boutons colorés et chaleureux. Aucun bouton ne doit ramener un abonné sur une page de vente (offres, PayPal Coaching VIP, etc.). On en profite pour retirer la `QuickModeBar` redondante dans le planner.

## Constats actuels (à corriger)
- `EspacePage` mélange "Reprendre" + 4 cartes "Créer du neuf" + 6 liens secondaires "Aller plus loin" → manque de joie, hiérarchie tiède.
- Les 6 liens "Aller plus loin" mènent à des pages partiellement publiques :
  - `/coaching-vip` = page de vente PayPal → **à retirer** côté abonné.
  - `/plan-marketing`, `/niches`, `/communaute`, `/formation` ne sont pas gated → peuvent afficher du contenu commercial. À conserver mais clairement présentés comme outils internes (et plus tard à protéger).
- `QuickModeBar` (sticky barre rapide dans `EbookPlannerPage`) doublonne ce que l'espace va offrir → à retirer pour soulager le planner.

## Lots

### Lot 1 — `src/pages/EspacePage.tsx` : la grande grille jovial
Remplacer "Créer du neuf" + "Aller plus loin" par **une seule grille "Mon atelier"** de 12 grosses tuiles colorées, regroupées par bandes :

**Bande "Créer"** (4 tuiles, fond pastel, emoji XL, ring couleur au hover, micro-animation `joy-wiggle` sur l'emoji) :
- 📖 Écrire un ebook → `/ebook-planner` (tab `workflow-dashboard`) — `joy-peach`, badge "Recommandé"
- 🎧 Audiobook → `/ebook-planner` (tab `audio`) — `joy-mint`
- 🎨 Coloriage KDP → `/ebook-planner` (tab `coloring`) — `joy-lavender`
- 💬 BD / Comic → `/bd-studio` — `joy-sun`

**Bande "Booster mes ventes"** (3 tuiles) :
- 🔑 Mots-clés KDP → `/kdp-keywords` — `joy-mint`
- 📊 Plan marketing → `/plan-marketing` — `joy-peach`
- 🎯 Niches porteuses → `/niches` — `joy-sun`

**Bande "Apprendre & échanger"** (3 tuiles) :
- 🎓 Formation → `/formation` — `joy-lavender`
- 🤝 Communauté → `/communaute` — `joy-mint`
- 🛠️ Guide des outils → `/guide-outils` — `joy-peach`

**Bande "Compte"** (2 mini-tuiles, taille réduite) :
- 🪪 Mon code & accès → `/mon-code`
- ❓ FAQ & assistance → `/faq`

Ce qui disparaît : la section "Aller plus loin", le lien "Coaching VIP", le lien "Niches" en doublon. Le bloc "Reprendre" et "Mes livres" restent intacts.

Touches "jovial" :
- Hero : taille +1 cran (`text-4xl sm:text-5xl`), garder `animate-joy-wiggle` sur 👋, ajouter sous-titre rotatif léger ("Belle journée pour publier ✨").
- Tuiles : `rounded-3xl`, ombre `--shadow-soft`, hover : `-translate-y-1.5`, ring 2px de la couleur, emoji passe en `scale-110`.
- En-tête de bande : petit titre tracking-wide + ligne fine pleine largeur.
- Suppression de l'icône `LogOut` solo au profit d'un menu compact (avatar email + bouton déconnexion dans un popover).

### Lot 2 — `EbookPlannerPage.tsx` : retirer la QuickModeBar
- Retirer l'import et le rendu de `QuickModeBar` (sticky bar sous le header).
- Conserver `EspaceHeader` (logo + titre projet + retour `/espace`).
- Aucun changement aux modes/tabs internes du planner (les liens `/ebook-planner` envoyant un `ebook_planner_active_tab` continuent de fonctionner via `localStorage`).
- Supprimer le fichier `src/components/ebook/QuickModeBar.tsx` (plus utilisé).

### Lot 3 — Garde-fou anti "renvoi offres"
- Vérifier qu'aucun bouton de la nouvelle grille ne pointe vers `/offres`, `/coaching-vip`, `/upsell`, `/paiement-manuel`, `/promo/*`.
- Conserver le lien direct vers Coaching VIP **uniquement** dans le footer (texte discret "Coaching VIP sur rendez-vous"), pas comme tuile.

## Hors scope (volontairement)
- Pas de gating supplémentaire sur `/niches`, `/plan-marketing`, `/formation`, `/communaute` (ferait l'objet d'une passe sécurité dédiée).
- Pas de refonte du planner monolithique (mémoire `refactoring-monolithe-ebook-planner` respectée).
- Pas de nouvelle route, pas de changement back-end.

## Fichiers touchés
- `src/pages/EspacePage.tsx` — refonte de la grille + footer.
- `src/pages/EbookPlannerPage.tsx` — retrait `<QuickModeBar />` et de son import.
- `src/components/ebook/QuickModeBar.tsx` — supprimé.

## Vérifications après build
- Capture `/espace` desktop (1502px) → 4 bandes visibles, tuiles colorées et alignées.
- Capture `/espace` mobile (≤640px) → grille 1 colonne, tuiles ≥ 96px de haut.
- Capture `/ebook-planner` → plus de double barre sticky, juste `EspaceHeader`.
- Cliquer chaque tuile et vérifier qu'aucune n'amène sur `/offres`.

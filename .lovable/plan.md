## Objectif

Appliquer la même charte joyeuse (palette `joy-cream`, `joy-peach`, `joy-mint`, `joy-sun`, `joy-lavender`, `joy-bubblegum`, texte `joy-ink`, ombres `shadow-joy`, animation `animate-joy-float`, coins très arrondis, typographie black) à la page `/dashboard` (`src/pages/Dashboard.tsx`), pour qu'elle soit cohérente avec `/offres`.

Aucune logique métier ne change : mêmes requêtes Supabase, mêmes données, mêmes onglets, mêmes routes de navigation. C'est purement un travail de présentation.

## Plan visuel section par section

### 1. Fond + ambiance
- Remplacer `bg-background` par `bg-joy-cream text-joy-ink`.
- Ajouter 2-3 blobs SVG décoratifs flottants (peach, mint, sun) en arrière-plan, façon `/offres`.

### 2. Header "Tableau de bord"
- Titre en `font-black` avec un mot en surligné `joy-bubblegum` ou `joy-sun` (genre "Ton **studio** ✨").
- Sous-titre chaleureux : "Bienvenue, voilà ce qui se passe aujourd'hui 🌈".
- Bouton "Actualiser" → pilule arrondie `rounded-full` bordure `joy-ink/20`.
- Bouton "Générateur" → `bg-joy-ink text-joy-cream rounded-full shadow-joy` (même que CTA `/offres`).

### 3. KPI Cards (5 cartes)
- Remplacer les dégradés sombres par des cartes pastel pleines :
  - Projets ebook → `bg-joy-peach`
  - Abonnés actifs → `bg-joy-mint`
  - Total abonnés → `bg-joy-lavender`
  - Audiobooks → `bg-joy-sun`
  - Résultats IA → `bg-[hsl(var(--joy-bubblegum)/0.4)]`
- `rounded-3xl border-2 border-joy-ink/10 shadow-joy`, hover : léger `rotate-1` et `shadow-joy-lg`.
- Icônes dans une bulle blanche `rounded-2xl` avec `text-joy-ink`.
- Valeur en `text-4xl font-black`.

### 4. Tabs "Vue d'ensemble" / "Mes Abonnés"
- `TabsList` → `bg-white rounded-full p-1 shadow-joy`.
- Trigger actif → `bg-joy-ink text-joy-cream rounded-full font-black`.
- Trigger inactif → `text-joy-ink/60`.

### 5. Cartes "Projets récents" et "Derniers abonnés"
- Carte blanche `rounded-3xl border-2 border-[hsl(var(--joy-peach))] shadow-joy` (mint pour la 2e).
- Header : pastille icône colorée + titre `font-black`.
- Bouton "Voir tout" → texte `joy-ink/70` + flèche.
- Items de liste : `rounded-2xl hover:bg-joy-cream/50`, avatar pastel, badges plan repensés (VIP = `bg-joy-sun`, PRO = `bg-joy-lavender`, sinon `bg-joy-mint`).
- État vide : émoji 📚 / 🎉 + texte doux.

### 6. Carte "Actions rapides"
- Carte blanche `rounded-3xl shadow-joy border-2 border-[hsl(var(--joy-lavender))]`.
- 4 boutons en pastel rotatifs (peach, mint, sun, lavender), `rounded-2xl`, icône grande, label `font-bold`, légère rotation au hover.

### 7. Onglet "Mes Abonnés"
- Le composant `SubscribersTable` reste tel quel (table dense). On l'enveloppe simplement dans une carte `bg-white rounded-3xl shadow-joy border-2 border-joy-ink/10 p-2` pour qu'il s'intègre visuellement, sans toucher à son code interne.

### 8. AdminPanelNav
- Laissé tel quel (composant partagé). Si visuellement trop sombre, ajouter `className` wrapper avec un fond `bg-white/60 rounded-2xl p-1` — sinon ne pas y toucher pour éviter d'impacter d'autres pages admin.

## Détails techniques

- **Fichier modifié** : `src/pages/Dashboard.tsx` uniquement.
- **Tokens** : tous déjà définis dans `index.css` / `tailwind.config.ts` (`joy-cream`, `joy-ink`, `joy-peach`, `joy-mint`, `joy-sun`, `joy-lavender`, `joy-bubblegum`, `shadow-joy`, `shadow-joy-lg`, `animate-joy-float`).
- **Aucune** modification de :
  - logique de fetch (`fetchStats`, `fetchAllSubscribers`)
  - routes de navigation (`/ebook-planner`, `/admin`, `/dashboard-marketing`, `/offres`)
  - structure des données / typages
  - composants enfants (`SubscribersTable`, `SubscriberActivityPopup`, `AdminPanelNav`)
- **Aucune** dépendance ajoutée, **aucune** migration DB, **aucun** edge function touché.

## Hors-scope (à confirmer si tu veux qu'on les fasse plus tard)

- `/ebook-planner` (la vraie console de production) : très grosse page, refonte séparée.
- `/admin` (gestion abonnés) : page outil dense, peut rester sobre.
- Pages Formation / Blog / Forum : refontes ciblées sur demande.

## Résultat attendu

Le `/dashboard` aura la même âme que `/offres` : crème, pastels, bulles arrondies, typographie black, micro-animations float — tout en gardant 100 % de ses fonctionnalités actuelles.
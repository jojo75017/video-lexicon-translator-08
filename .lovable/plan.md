

## Objectif
Créer un récapitulatif clair et visuel de tous les onglets/outils pour que les abonnés sachent quoi utiliser, quand, et dans quel ordre — sans se noyer.

## Analyse rapide
Tu as ~44 outils répartis dans 5 piliers (Workflow IA, Écriture, Publier, Vendre, Mon Compte). Le problème : un nouvel abonné arrive et voit 44 boutons dans la sidebar → paralysie.

## Solution proposée

### Page unique `/guide-outils` (accès abonnés)
Un **mode d'emploi visuel** qui sert de "carte au trésor" pour naviguer dans EbookStudio.

### Structure en 4 sections

**Section 1 — Parcours recommandé (le chemin "happy path")**
Un schéma visuel en 5 étapes numérotées :
1. **Idée** → Recherche Niche KDP + Mots-clés
2. **Création** → Workflow IA P1-P15 (le seul à utiliser pour écrire)
3. **Habillage** → Studio Couverture + Description Magnet
4. **Publication** → Export KDP + Checklist Pré-publication
5. **Vente** → Guide KDP Ads + Marketing

Chaque étape = 1 carte cliquable qui amène directement à l'outil.

**Section 2 — Les 5 piliers expliqués**
Pour chaque pilier (Workflow IA, Écriture, Publier, Vendre, Mon Compte) :
- Couleur sémantique (déjà existante)
- À quoi ça sert en 1 phrase
- Liste compacte des outils-clés (pas les 44, juste les essentiels)
- Bouton "Voir tous les outils de ce pilier"

**Section 3 — "Je veux faire X" (FAQ pratique)**
Tableau de mappings cas d'usage → outil :
- *"Je débute, je veux écrire mon 1er livre"* → Workflow IA P1-P15
- *"Je veux trouver une niche rentable"* → Recherche KDP + Analyse de marché
- *"J'ai un livre déjà écrit, je veux l'améliorer"* → Réécriture Naturelle + Correcteur Strict
- *"Je veux créer une couverture"* → Studio Couverture IA
- *"Je veux faire de la pub Amazon"* → Guide KDP Ads
- *"Je veux convertir mon livre en audio"* → Audio Express
- *"Je veux exporter pour KDP"* → Export Pro KDP
*(8-10 cas d'usage max)*

**Section 4 — Outils avancés (à découvrir plus tard)**
Liste discrète des outils niches/experts (Pinterest Generator, SEO Generator, Site Cloner, etc.) avec mention *"À explorer une fois les bases maîtrisées"*.

### Intégrations
1. **Sidebar** : Ajouter en TOUT EN HAUT de la sidebar un bouton 🗺️ **"Guide des outils"** (avant les piliers) — ça devient le 1er réflexe.
2. **Page Hierarchy/Dashboard** : Bandeau d'accueil pour les nouveaux abonnés *"Première visite ? Découvre le guide des outils →"*.
3. **Onboarding** : Lien dans l'email de bienvenue (mention seulement, pas de modif email auto).

## Fichiers à créer/modifier

**Créer**
- `src/pages/ToolsGuidePage.tsx` (la page récap complète)
- `src/components/layout/ToolsGuideButton.tsx` (bouton sidebar dédié, style highlighté)

**Modifier**
- `src/App.tsx` — route `/guide-outils` (gated abonnés via `SubscriberGate`)
- `src/components/layout/ModernSidebar.tsx` — insérer le bouton "Guide des outils" en tête de sidebar
- `src/pages/HierarchyPage.tsx` (ou page d'accueil app) — bandeau d'accueil discret avec CTA vers le guide

## Style visuel
- Charte Amazon KDP existante (#FAFAFA, #008296, #FF9E2D)
- Cartes numérotées pour le parcours (gros chiffres style "1, 2, 3...")
- Icônes Lucide cohérentes avec la sidebar
- Responsive mobile friendly (l'utilisateur voyage)

## Ce que je NE fais PAS
- Pas de refonte de la sidebar (juste l'ajout d'un bouton en tête)
- Pas de suppression d'outils (tout reste accessible)
- Pas de tutoriel vidéo (texte + visuel uniquement)
- Pas de système d'onboarding multi-étapes intrusif (juste un bandeau dismissible)


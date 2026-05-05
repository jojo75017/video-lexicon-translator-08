# Onglet Tutoriels — Actions principales pas-à-pas

## Objectif

Créer une page **Tutoriels** dédiée qui liste les principales actions à faire dans EbookStudio, sous forme de fiches pas-à-pas avec captures, durée estimée et bouton "Lancer l'action". Différent de `/guide-outils` (vue d'ensemble marketing) : ici, c'est **opérationnel et actionnable**.

## Structure de la page `/tutoriels`

Header sobre (charte KDP : fond `#FAFAFA`, accent teal `#008296`, hover orange `#FF9E2D`) avec :
- Titre "Tutoriels — Actions principales"
- Sous-titre "Les 10 actions essentielles pour réussir votre ebook avec EbookStudio"
- Barre de recherche/filtre par catégorie

### Catégories (onglets `Tabs` shadcn)

1. **Démarrage** (3 tutos)
   - Configurer ma clé Gemini (BYOK) → `/parametres-api`
   - Créer mon premier ebook → `/ebook-planner` mode Simple
   - Comprendre le workflow 15 agents → `/ebook-planner` mode Workflow

2. **Création contenu** (4 tutos)
   - Lancer le pipeline P1→P15 (génération automatique)
   - Recherche mots-clés Amazon KDP → `/kdp-keywords`
   - Importer un manuscrit Word existant → Document Transformer
   - Générer une couverture KDP avec IA → KDP Cover Studio

3. **Audio & Audiobook** (2 tutos)
   - Lancer l'Audio Express (TTS automatique)
   - Publier mon audiobook (page publique + checkout)

4. **Export & Publication** (2 tutos)
   - Exporter au format KDP (PDF intérieur + epub)
   - Publier sur Amazon KDP (checklist conformité)

### Format d'une fiche tutoriel

Chaque tuto = `Card` avec :
- Icône + titre + badge durée (ex : "5 min")
- Description courte (1 phrase)
- Liste numérotée des étapes (3 à 6 étapes max)
- Bouton CTA "Lancer cette action" → navigate vers la page concernée
- Lien optionnel "Voir la vidéo" (si formation existante dans `/formation-videos`)

## Points d'accès

1. **Sidebar** (`SimpleSidebar.tsx` + `MagazineSidebar.tsx`) : ajouter entrée "Tutoriels" (icône `GraduationCap` lucide) en haut, juste sous le logo / au-dessus de "Mots-clés KDP".
2. **Dashboard `/ebook-planner`** : ajouter un petit widget compact "Nouveau ? Voir les tutoriels" à côté du widget mots-clés existant, ou un lien discret dans le hero.
3. **Route** : `/tutoriels` ajoutée dans `src/App.tsx` (lazy import, protégée par `SubscriberGate` comme les autres outils membres).

## Fichiers à créer / modifier

**Créer**
- `src/pages/TutorielsPage.tsx` — page principale avec Tabs et data inline (pas de table DB, contenu statique éditable)
- `src/components/tutoriels/TutorialCard.tsx` — composant fiche réutilisable
- `src/data/tutoriels.ts` — array typé des 11 tutos (titre, étapes, route cible, durée, catégorie, icône)

**Modifier**
- `src/App.tsx` — ajouter la route `/tutoriels`
- `src/components/layout/SimpleSidebar.tsx` — ajouter entrée Tutoriels
- `src/components/layout/MagazineSidebar.tsx` — ajouter entrée Tutoriels
- `src/pages/EbookPlannerPage.tsx` — ajouter mini-lien "Voir les tutoriels" dans le hero

## Hors scope

- Pas de vidéos hébergées (on réutilise `/formation-videos` existant via liens)
- Pas de système de progression / "tuto complété" sauvegardé en DB (peut être ajouté plus tard)
- Pas de modification de `/guide-outils` existant (les deux pages cohabitent : guide = vue marketing, tutoriels = mode d'emploi opérationnel)
- Pas de nouvelle table Supabase

## Détails techniques

- Données 100% statiques dans `src/data/tutoriels.ts` (TypeScript const) → faciles à éditer sans migration
- Type : `{ id, category, title, description, durationMin, icon, steps: string[], targetRoute: string, videoRoute?: string }`
- Navigation : `useNavigate()` de `react-router-dom`
- Style : composants `Card`, `Tabs`, `Badge`, `Button` shadcn déjà présents
- Charte : conformité memory `style/charte-graphique-amazon-kdp-reposant` (teal #008296, orange hover #FF9E2D, fond #FAFAFA)

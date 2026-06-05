# Tableau de bord V3 — Hub de lancement « Noir & Or » (effet wouhou)

## Objectif
Créer une nouvelle page d'accueil premium pour la V3 « Publication Assistée Pro » : un **hub de lancement** élégant et spectaculaire qui regroupe les ~60 modules existants, organisés par pilier (Publier / Monétiser / Marketing / IA avancée), avec recherche instantanée et ouverture directe de chaque outil. La roadmap actuelle du cockpit reste en place ; ce hub vient s'ajouter comme nouvelle expérience d'entrée V3.

Direction visuelle retenue : **Noir & Or luxe** (fond #0d0d0d → #1a1a1a, accents or #c9a84c / #f0d78c), animations **spectaculaires**.

## Ce qui sera construit

### 1. Nouvelle page `V3HubPage` (route `/hub-v3`)
Accès réservé admin (comme `/tableau-de-bord`) via `AdminGate`, pour préparer le lancement.

Structure de la page :
```text
┌──────────────────────────────────────────────┐
│  HÉRO « édition limitée »                      │
│  Logo/titre or • « Publication Assistée Pro »  │
│  Badge 197€ à vie • compteur modules • CTA     │
│  (fond particules/beams animés, halo doré)     │
├──────────────────────────────────────────────┤
│  Barre de recherche instantanée + filtres      │
│  [Tous] [Publier] [Monétiser] [Marketing] [IA] │
├──────────────────────────────────────────────┤
│  4 sections pilier (or par pilier)             │
│   → grille de cartes module (glassmorphism)    │
│     hover : tilt 3D + glow doré + scale         │
│     clic : ouvre le module dans un dialog       │
└──────────────────────────────────────────────┘
```

### 2. Cartes module premium
- Chaque carte = un module de `V3_MODULES` (titre, description, pilier, statut).
- Effet : bordure dégradé or, halo lumineux au survol, légère inclinaison 3D (tilt), apparition en cascade (`stagger` fade-in).
- Badge statut discret (Fait / En cours / À faire).
- Clic → ouvre le **même dialog** et le **même mapping de composants** que le cockpit actuel (réutilisation totale, aucun outil réécrit).

### 3. Recherche + filtres
- Champ de recherche filtrant par titre/description en temps réel.
- Onglets pilier pour filtrer la grille.
- Compteur dynamique « X outils disponibles ».

### 4. Réutilisation du moteur d'ouverture des modules
Le cockpit contient déjà : la liste `clickable`, la logique de largeur de dialog, et la longue branche `selectedModule.id === '...'` qui rend chaque composant. Pour éviter la duplication :
- Extraire cette logique dans un composant partagé `V3ModuleDialog` (props : `module`, `onClose`) + un helper `getV3ModuleRenderer(id)`.
- Le cockpit ET le nouveau hub utilisent ce composant partagé.

### 5. Accès au hub
- Bouton « Hub V3 » ajouté dans l'en-tête du cockpit (`AdminCockpitPage`) à côté de « Tableau de bord V3 ».
- Lien depuis le toggle V3.

### 6. Autres briques V3 que je recommande de finaliser ensuite (hors de ce plan, à valider)
Idées pour compléter la valeur perçue des 197€ :
- **Coffre-fort de preuves horodatées** (déjà évoqué) : PDF horodaté + hash SHA-256.
- **Détecteur de similarité** : compare ton texte vs un suspect, % de chevauchement.
- **Centre de progression auteur** : suivre l'avancement livre par livre (étape sur les 60 outils).
- **Mode V3 visible pour les abonnés** (aujourd'hui réservé admin) — à activer au lancement.
- **Onboarding guidé** « par où commencer » dans le hub.

## Détails techniques
- **Nouveau fichier** `src/pages/V3HubPage.tsx` + route dans `src/App.tsx` sous `AdminGate`.
- **Composant partagé** `src/components/admin/V3ModuleDialog.tsx` : déplace la branche de rendu + la logique de largeur de dialog depuis `AdminCockpitPage.tsx`. Le cockpit est refactoré pour l'importer (pas de régression).
- **Style Noir & Or** : tokens locaux (or `#c9a84c`/`#f0d78c`, fonds `#0d0d0d`/`#1a1a1a`) appliqués sur la page hub ; on n'altère pas la charte KDP globale (`index.css`) pour ne pas casser le reste de l'app. Couleurs en HSL via classes utilitaires locales.
- **Animations spectaculaires** : particules/beams en arrière-plan (composant léger maison ou MagicUI Particles/Meteors), `animate-fade-in` + `scale-in` en cascade sur les cartes, tilt 3D au survol (CSS transform sur mousemove), halo doré (box-shadow animé). Respect de `prefers-reduced-motion`.
- **Source de données** : `V3_MODULES` de `src/data/roadmapV3.ts` (aucune nouvelle donnée).
- Aucun changement backend, aucune migration.

## Hors périmètre
- Aucune réécriture des 60 outils existants (réutilisation telle quelle).
- Pas de modification de la charte KDP globale ni du cockpit roadmap actuel (juste ajout d'un bouton + refacto interne du dialog).
- Activation du hub pour les abonnés non-admin : repoussée au lancement V3.

# Chantier 1 — Grille des 3 formules (Starter 27 € / Auteur 97 € / Édition 197 €)

## Objectif
Créer la grille complète et précise des onglets par formule, pour que Georges valide chaque ligne avant toute mise en place des cadenas. Rien n'est publié sans son feu vert explicite.

## Ce qui est déjà décidé (rappel)
- **Option B** : tous les onglets restent visibles ; ceux hors forfait portent un cadenas 🔒 qui ouvre une fenêtre d'upgrade au clic.
- Un forfait a accès à son niveau **et à tous les niveaux inférieurs** (Édition = tout, Auteur = Starter + Auteur).
- Admin (Georges) = passe-partout, voit tout sans cadenas.
- **BD Studio** = Auteur (97 €) et Édition (197 €), jamais Starter.
- **Studio Couverture Broché KDP** (tranche calculée, 4e de couverture, PDF 300 DPI) = Édition (197 €) uniquement.
- **Couverture Ebook simple 2D** (face avant, titre, auteur, visuel) = incluse dès Starter (27 €).
- L'onglet « KDP » sera renommé **« Ebookstudio KDP »** (nom affiché seulement, les adresses web ne changent pas).
- Starter = livres illimités, rédaction complète, sommaire, exports, fiche KDP de base, 5 niches offertes.

## Étape 1 — Inventaire exhaustif (lecture seule, aucune modification)
Lire tous les fichiers qui déclarent les onglets et outils :
- `src/data/v3HeaderMenu.ts` (menu principal V3)
- `src/components/layout/modernSidebarSections.ts` (sidebar : Préparer / Écrire / Publier / Vendre / Mon Compte)
- `src/data/v3Features.ts`, `src/data/v2ToolsRegistry.ts`
- `src/data/kdpTabPages.ts`, `src/data/specialBookTabs.ts`
- `src/data/v3ModuleAccess.ts` (compléments payants existants)
- `src/data/v3ToolPlans.ts` (répartition Plume/Édition actuelle)
- Déclaration des routes dans `src/App.tsx`

**Livrable :** la liste complète de chaque onglet/outil avec son nom affiché, son adresse, et ce qu'il fait en une phrase simple.

## Étape 2 — La grille des 3 formules (document à valider)
Pour chaque onglet de l'inventaire, une ligne du tableau :

| Onglet / Outil | Starter 27 € | Auteur 97 € | Édition 197 € |
| --- | :---: | :---: | :---: |
| Exemple : Écrire un livre | ✅ | ✅ | ✅ |
| Exemple : BD Studio | 🔒 | ✅ | ✅ |
| Exemple : Studio Couverture Broché | 🔒 | 🔒 | ✅ |

La proposition initiale suit les règles déjà fixées :
- **Starter** : création/rédaction de livres illimités, sommaire, exports PDF/DOCX/EPUB, couverture ebook 2D simple, fiche KDP de base (titre, sous-titre, auteur, description, mots-clés, catégories), guide KDP pas à pas, bibliothèque, 5 niches offertes, tutoriels essentiels.
- **Auteur** : tout Starter + Je raconte un livre, Guides pratiques, Histoires courtes / micro-séries, BD Studio, correction éditoriale, HumanizeAI, avatars lecteurs, recherche de niches avancée, fiches KDP enrichies.
- **Édition** : tout Auteur + Studio Couverture Broché KDP complet, Studio Album Illustré jeunesse, audiolivres, KDP étranger / multi-traductions, Brand Book, outils d'éditeur.

**Points laissés au choix de Georges dans la grille** (marqués « à trancher ») :
- EPUB dans Starter : oui ou non ?
- Périmètre exact d'« Ebookstudio KDP » dans Starter : fiche texte seule, ou aussi gabarit de mise en page ?
- Brand Book et outils marketing : Édition, ou options indépendantes ?
- Albums jeunesse : Édition uniquement (recommandé) ?

La grille est livrée dans le chat (et en fichier si souhaité). **Georges la relit ligne par ligne et corrige avant l'étape 3.**

## Étape 3 — Mise en place technique (SEULEMENT après validation écrite de la grille)
1. Créer une source unique `src/data/v3PlanTiers.ts` : chaque onglet → niveau minimal requis (`starter` / `auteur` / `edition`).
2. Cadenas 🔒 dans le menu et la sidebar : onglet hors forfait = badge cadenas + clic → fenêtre d'upgrade (« Cette fonction est réservée au Pack Auteur (97 €)… » avec boutons vers /commander).
3. Verrou de page (`PlanGuard`) : accès direct par l'adresse web → redirection polie vers la fenêtre d'upgrade.
4. Renommage de l'onglet « KDP » en « Ebookstudio KDP ».
5. Vérifier que la couverture ebook simple 2D fonctionne bien pour un compte Starter (moteur inclus, sans Cover Studio Pro).
6. Tests : un compte Starter ne peut pas ouvrir la BD ni le Studio Broché ; un compte Auteur ouvre la BD mais pas le Broché ; Édition ouvre tout ; admin ouvre tout.

## Ce qui ne sera JAMAIS touché
- Les prix, paiements, webhooks Stripe/JVZoo, tunnels de vente, formulaires.
- Les droits des clients existants (abonnés actuels, acheteurs 47 €, JVZoo) : la grille s'applique aux **nouvelles** formules, les anciens gardent leurs accès.
- Aucune publication sans le mot « publie » de Georges.

## Vérification
- Tests automatisés sur la logique d'accès (un test par règle : BD interdite à Starter, Broché interdit à Auteur, etc.).
- Vérification dans l'aperçu avec les 3 niveaux de compte avant toute publication.

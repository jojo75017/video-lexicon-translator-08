## Objectif

Quatre chantiers : (1) une fiche livre professionnelle avant de lancer le workflow, (2) un sommaire validé — généré ou importé du « Sommaire Ultime » — obligatoire avant démarrage, (3) des projets rouvrables depuis « Mes projets », (4) un sommaire d'export fiable (l'aperçu n'affiche qu'un seul numéro).

---

## 1. Fiche du livre (avant workflow)

L'étape 1 de `/v3/create` demande aujourd'hui titre, sous-titre, catégorie (14 choix) et synopsis, et « Auto-remplir Cible & Promesse » est enfoui dans un panneau replié. Refonte en un bloc « Fiche du livre » ordonné :

1. **Titre du livre** (obligatoire)
2. **Sous-titre** (optionnel, mention explicite)
3. **Catégorie Amazon KDP** — liste portée à 25+ catégories réelles (Roman, Thriller/Policier, Romance, Fantasy, Science-fiction, Horreur, Aventure, Historique, Biographie/Mémoires, Développement personnel, Business/Entrepreneuriat, Finance/Investissement, Marketing, Santé/Bien-être, Nutrition/Fitness, Cuisine/Recettes, Voyage/Guide, Enfants/Jeunesse, Éducation/Pédagogie, Spiritualité/Religion, Psychologie, Sciences/Nature, Informatique/IA, Arts/Loisirs créatifs, Sport, Animaux, Parentalité, Autre), en liste déroulante scrollable + champ libre pour « Autre »
4. **Nom de l'auteur** (remonté ici)
5. **Synopsis** (compteur de mots)
6. Juste en dessous : bouton **« Auto-remplir Cible & Promesse »** bien visible, avec les 8 champs relisables/éditables après remplissage
7. « Continuer » actif seulement si Titre + Auteur + Catégorie + Synopsis sont remplis

## 2. Sommaire validé obligatoire avant le workflow

Étape dédiée « Sommaire » entre les réglages et la génération, avec trois entrées possibles :

- **Générer** le sommaire par l'IA à partir de la fiche (comportement actuel, amélioré)
- **Injecter mon Sommaire Ultime** : reprise du sommaire produit par l'outil « Sommaire Ultime » (`/v3/toc-ultime`) — bouton « Envoyer vers le workflow » côté outil (le composant expose déjà un `onApply`), et côté wizard un bouton « Importer mon Sommaire Ultime » qui récupère le dernier sommaire enregistré
- **Coller / éditer à la main** : zone de texte ou liste éditable (ajouter, renommer, réordonner, supprimer un chapitre), collage d'un sommaire Markdown/TXT/JSON accepté

Règles :
- Le nombre de chapitres de la fiche se synchronise avec le sommaire validé (avertissement si écart)
- Le sommaire validé est marqué « à respecter strictement » dans le brief envoyé aux agents (déjà le cas techniquement, rendu explicite dans l'UI)
- Le workflow ne peut pas démarrer sans sommaire validé

## 3. Page d'accueil : tout voir avant de démarrer

Sur `/v3` (accueil V3), un bloc récapitulatif « Votre livre en préparation » affiché dès qu'un brouillon ou un projet en cours existe :

- Titre, sous-titre, auteur, catégorie, synopsis (extrait)
- Nombre de chapitres / mots par chapitre / total estimé et pages
- **Le sommaire complet** (liste des chapitres numérotés, repliable)
- Cible & Promesse si remplies
- Personnages si renseignés
- Actions : « Modifier la fiche », « Modifier le sommaire », « Lancer le workflow »
- Rappel de la clé Gemini si absente (bannière existante conservée)

## 4. Projets sauvegardés et rouvrables

État vérifié : le wizard enregistre bien dans `ebook_projects` (création puis mises à jour pendant la génération) et `/v3/library` liste ces projets. Mais un clic mène à `/v3/book/:id`, simple lecteur, sans reprise possible, et le wizard ne sait pas charger un projet existant (il ne lit qu'un brouillon local).

- Le wizard accepte `?projectId=…` : rechargement cloud de la fiche (titre, sous-titre, catégorie, auteur, synopsis, chapitres/mots, sommaire, personnages) et des chapitres déjà écrits, puis sauvegarde sur le même projet (pas de doublon)
- Cartes « Mes projets » : actions **Ouvrir / Reprendre la rédaction / Exporter**
- `/v3/book/:id` : boutons « Reprendre dans le workflow » et « Exporter (DOCX/PDF/EPUB) »
- Le brouillon local reste un filet de sécurité ; le cloud devient la source de vérité

## 5. Sommaire d'export — aperçu incomplet

Cause probable identifiée (à confirmer d'abord sur le manuscrit réel) : l'onglet Export du hub ne lit pas les chapitres du projet. Il prend une seule sortie d'agent (`P20`, sinon `P10`/`P4`/`P3`) stockée en local et la redécoupe par expression régulière sur les lignes « Chapitre / # ». Si cette sortie ne contient qu'une portion du livre (ex. le chapitre 9), le sommaire ne contient qu'une entrée — exactement le symptôme observé.

- L'export prend en source les **chapitres du projet** (cloud `ebook_projects` ou résultats complets du workflow) ; le découpage texte devient un dernier recours
- Recollement ordonné et dédoublonné de toutes les sorties de chapitres du workflow
- Aperçu DOCX et sommaire DOCX sur la même source, avec avertissement si chapitres détectés < chapitres prévus (« 1 chapitre détecté sur 12 — relancer la rédaction »)
- Test automatisé : manuscrit multi-chapitres → numérotation continue 1..N, sans trou ni chapitre fantôme

---

## Détails techniques

- `src/components/v3public/V3CreateWizard.tsx` : refonte étape 1, `CATEGORIES` étendu, étape Sommaire (générer / importer Sommaire Ultime / éditer), chargement par `projectId`, garde-fous de validation
- `src/components/tools/TocUltimateGenerator.tsx` + `src/pages/v3public/V3TocUltimatePage.tsx` : persistance du dernier sommaire et bouton « Envoyer vers le workflow »
- `src/pages/v3public/V3HomePage.tsx` : bloc récapitulatif « Votre livre en préparation » avec sommaire replié
- `src/pages/v3public/V3LibraryPage.tsx`, `src/pages/v3public/V3BookPage.tsx` : actions Ouvrir / Reprendre / Exporter
- `src/pages/V3HubPage.tsx` + `src/components/admin/V3ExportPanel.tsx` : source d'export basée sur les chapitres du projet, fusion des sorties d'agents, bannière de cohérence
- `src/utils/docxExportEngine.ts` + `docxExportEngine.test.ts` : numérotation continue vérifiée, tests ajoutés
- Aucun changement de tarifs, de plans ni de schéma de base (la table `ebook_projects` existe déjà)

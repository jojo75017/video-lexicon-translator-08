# Problème

La sidebar a été retirée. Il ne reste que 5 onglets (Plan · Écrire · Habiller · Publier · Vendre) en haut du planner. Or, chaque "famille" contient en réalité 5 à 15 sous-outils (workflow IA, personnages, templates, AI chat, proofread, cover designer, back-cover, KDP checklist, export Calibre, marketing, etc.). L'abonné ne peut plus y accéder.

# Objectif

Que l'abonné retrouve TOUT, simplement, depuis le haut de l'écran, sans sidebar.

# Solution : navigation à 2 niveaux + menu "Tous les outils"

## 1. Barre principale (déjà en place)
5 onglets de familles, comme aujourd'hui : **Plan · Écrire · Habiller · Publier · Vendre**.

## 2. Sous-barre contextuelle (NOUVEAU)
Sous la barre principale, une 2ᵉ ligne discrète (chips arrondies, plus petites, fond blanc, texte gris→teal actif) qui change selon l'onglet sélectionné.

```text
[Plan]   [Écrire]   [Habiller]   [Publier]   [Vendre]        ← principale (teal pill)
  ↓
 Tableau de bord IA · Plan du livre · Personnages · Templates · Importer doc      ← contextuelle
```

Mapping proposé (par famille) :

- **Plan** : Tableau de bord IA · Plan du livre · Personnages · Templates · Importer un doc
- **Écrire** : Workflow complet · Chapitre par chapitre · AI Chat · Proofread strict · Table des matières · Anti-IA / humaniser
- **Habiller** : Studio image · Couverture IA · Éditeur de couverture · 4ᵉ de couverture · Bibliothèque d'images
- **Publier** : Export KDP · Checklist pré-publication · Export EPUB (Calibre) · Audiobook · Audio Express
- **Vendre** : Plan marketing · Plan de lancement · Mots-clés KDP · Niches · Stratégie avancée

## 3. Bouton "Tous les outils" (overflow, à droite de la barre)
Un bouton `⋯ Tous les outils` qui ouvre un **popover** structuré en colonnes (les 5 familles) listant 100% des sous-outils, plus une recherche en haut. Filet de sécurité pour les outils rarement utilisés (séries, encyclopedia, atlas, multi-translator, doc-transform, url-import, etc.).

## 4. Bouton "Mon espace" (déjà en place, à gauche)
Reste le retour rapide vers /espace.

# Pourquoi cette structure

- **Pas de sidebar** : conforme à la demande utilisateur.
- **Toujours 1 clic** pour accéder aux 25 outils principaux (sous-barre contextuelle).
- **Toujours ≤ 2 clics** pour les outils rares (popover "Tous les outils").
- **Cohérent avec /espace** : les tuiles de l'espace pointent vers le bon `?tab=` et la bonne famille s'illumine.

# Détails techniques (pour info)

Fichier concerné : `src/components/layout/EspaceHeader.tsx`

- Ajouter un objet `PLANNER_SUBTABS: Record<familyId, Array<{id,label}>>` listant les sous-outils par famille.
- Calculer la `currentFamily` depuis `activeTab` (déjà via `match[]`).
- Rendre une 2ᵉ rangée (sous la rangée principale) quand `showTabBar` est vrai, qui mappe `PLANNER_SUBTABS[currentFamily]` → chips cliquables (`onTabChange(subId)`).
- Ajouter un bouton overflow `Tous les outils` à droite, qui ouvre un `<Popover>` shadcn avec un `<Input>` de recherche et 5 colonnes scrollables (toutes les entrées du `case` du planner).
- Aucun changement dans `EbookPlannerPage.tsx` au-delà de ce qui existe déjà (les `case 'xxx'` du switch gèrent déjà tous ces ids).
- Aucun retour de la sidebar.

# Hors périmètre

- Pas de refonte du contenu des sous-écrans.
- Pas de changement sur `/espace`, `/bd-studio`, `/kdp-keywords`, etc.
- Pas de touche raccourci clavier (peut venir plus tard).

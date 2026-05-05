# Ajouter 2 tutoriels KDP dans la page /tutoriels

Objectif : aider l'abonné à savoir **quel contenu mettre dans la fiche KDP d'Amazon** et **dans quel ordre publier**. Les deux tutoriels redirigent vers l'onglet `kdp` du dashboard (déjà existant et accessible via SubscriberGate).

## Tutoriel 1 — « Que mettre dans chaque champ KDP »

Carte qui détaille, champ par champ, ce qu'Amazon KDP demande et où le récupérer dans l'outil.

Étapes affichées sur la carte :
1. Titre & sous-titre — récupérer depuis l'onglet **Planner** (titre validé par l'agent éditorial).
2. Nom d'auteur / contributeurs — depuis l'onglet **Settings** (profil auteur).
3. Description (4000 caractères max, HTML autorisé) — générée dans l'onglet **kdp** (bloc « description marketing »).
4. 7 mots-clés backend — copier depuis l'outil **Mots-clés KDP** (`/kdp-keywords`).
5. 2 catégories BISAC — depuis l'onglet **kdp** (bloc « catégories suggérées »).
6. Tranche d'âge / public — laisser vide pour non-jeunesse.
7. Fichier manuscrit (PDF) + couverture (JPG) — depuis l'onglet **Export**.

CTA : « Ouvrir la fiche KDP » → `/ebook-planner?tab=kdp`

## Tutoriel 2 — « Workflow complet de publication KDP »

Carte qui décrit l'enchaînement bout à bout.

Étapes :
1. Préparer le manuscrit (Planner → 15 agents P1-P15).
2. Générer la couverture (onglet **Cover**).
3. Exporter PDF intérieur + epub (onglet **Export**).
4. Récupérer description, catégories et mots-clés (onglet **kdp**).
5. Créer le livre sur kdp.amazon.com → coller chaque champ (renvoi au tuto 1).
6. Lancer l'aperçu KDP, corriger les erreurs éventuelles.
7. Publier et programmer la sortie.

CTA : « Préparer ma fiche KDP » → `/ebook-planner?tab=kdp`

## Détails techniques

Fichier modifié : `src/data/tutoriels.ts`
- Ajouter deux entrées dans le tableau `TUTORIELS` :
  - `id: 'kdp-champs'`, `targetRoute: '/ebook-planner'`, `targetTab: 'kdp'`, `pillar` cohérent avec les autres tutoriels KDP.
  - `id: 'kdp-workflow'`, `targetRoute: '/ebook-planner'`, `targetTab: 'kdp'`.
- Les deux passeront automatiquement la validation (`/ebook-planner` ∈ `SUBSCRIBER_TUTORIAL_ROUTES`, `kdp` ∈ `EBOOK_PLANNER_TABS`) — aucun changement à la logique de validation ni au composant `TutorialCard`.
- Ordonner les nouvelles cartes juste avant la checklist de conformité (`checklist-kdp`) pour conserver une progression logique : champs → workflow → checklist finale.

Aucune modification de routes, d'onglets ou d'autres pages.

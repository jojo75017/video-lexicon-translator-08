# Studio Éditorial Hybride — Gemini (architecte) + ChatGPT (plume)

Analyse faite. Le plan ci-dessous ajoute un **nouveau parcours « Studio Pro »** à côté de l'existant : aucun workflow actuel n'est modifié ni supprimé en phase 1.

## Recommandation sur la clé ChatGPT

Tu m'as demandé quel choix est le meilleur : **passerelle Lovable AI** pour les modèles OpenAI, avec BYOK en option.

Raisons :
- Zéro friction — l'abonné n'a rien à coller, il paie son forfait et ça écrit. Demander une 2e clé (OpenAI, avec carte bancaire obligatoire chez OpenAI) ferait perdre une grande partie des abonnés d'entrée de gamme.
- Le coût est prévisible : la rédaction passe sur un modèle mini pour les brouillons et un modèle haut de gamme uniquement pour la passe stylistique du forfait Édition.
- La clé Gemini BYOK existante reste utilisée telle quelle pour la partie architecture/contrôle : ton coût crédits ne concerne donc que la rédaction.
- Un abonné qui possède déjà une clé OpenAI pourra la coller (champ optionnel) et ne rien consommer de tes crédits.

Répartition retenue : **Gemini = plan, contrôle, mémoire** (clé de l'abonné en priorité) · **ChatGPT = rédaction et style** (passerelle Lovable, BYOK optionnel).

## Ce que couvre la phase 1 (ce que tu as choisi)

La **Bible du livre par Gemini + l'écran de validation**, de bout en bout et réellement utilisable :

1. **Fiche maître** — un formulaire complet (titre, sous-titre, type, genre, public, objectif, nombre de chapitres, longueur, ton, style, niveau de langage, point de vue, époque, lieux, personnages, contraintes, documents sources). Enregistrée en base, consultable et modifiable pendant toute la vie du projet.
2. **Bible générée par Gemini** — concept, promesse, synopsis, structure en parties/chapitres/sous-chapitres, objectif de chaque chapitre, éléments à planter puis récolter. Pour la fiction : fiches personnages (âge, psychologie, motivations, relations, secrets), arcs, lieux, chronologie, indices, révélations, résolution. Pour le pratique/guide : progression pédagogique, absence de doublons, équilibre entre chapitres.
3. **Écran de validation** — l'utilisateur lit, modifie tout au clavier, régénère une section, ajoute / supprime / déplace / fusionne un chapitre. **Aucune rédaction ne démarre sans validation explicite.**
4. **Tableau de bord du livre** — compteurs (prévus / rédigés / validés / à contrôler, % de progression) et liste des chapitres avec statut (Terminé, Correction nécessaire, Brouillon, À écrire). En phase 1 tous les chapitres sont « À écrire » : le tableau est en place pour les phases suivantes.
5. **Bandeau moteur** — indication permanente de qui travaille : 🟣 Gemini — Architecture / Analyse · 🟢 ChatGPT — Rédaction / Style.
6. **Historique** — chaque validation de la Bible crée une version conservée ; rien n'est écrasé, retour arrière possible.

Les phases 2 à 5 (rédaction chapitre par chapitre avec mémoire persistante, rapport de cohérence Gemini, passe stylistique, audit final) sont décrites plus bas et seront construites après validation de la phase 1.

## Détails techniques

### Existant réutilisé (rien n'est cassé)
- `supabase/functions/v3-generate-outline` (Gemini direct + repli passerelle, BYOK déjà géré) : sert de modèle pour la nouvelle fonction Bible.
- `supabase/functions/complete-book-workflow` (P1→P15), `v3-autopilot-step`, `v3-generate-chapter-titles`, `strict-proofread` : **inchangés**.
- `src/hooks/useOpenAIConfig.ts` + `src/services/aiProviderKeyTest.ts` : récupération de la clé Gemini de l'abonné, réutilisés tels quels.
- `src/utils/manuscriptNormalizer.ts`, `src/utils/docxExportEngine.ts` : réutilisés pour l'export à la phase 5.
- `series_bibles` existe mais est réservé aux séries multi-tomes : on ne le détourne pas.

### Nouvelles tables (approbation de migration requise)
- `book_projects` — la fiche maître : tous les champs de l'étape 1 + `book_kind` (roman / thriller / pratique / guide / biographie / éducatif), `mode` (guidé / automatique), `status`, `with_images`.
- `book_bibles` — une ligne par version de Bible : `project_id`, `version`, `synopsis`, `structure jsonb`, `characters jsonb`, `timeline jsonb`, `places jsonb`, `plot_threads jsonb`, `validated_at`. Jamais d'écrasement : chaque validation insère une nouvelle version.
- `book_chapters` — un chapitre = une ligne (fini le gros blob JSON) : `project_id`, `position`, `title`, `objective`, `status` (a_ecrire / brouillon / a_corriger / valide), `word_target`.
- `book_chapter_versions` — `chapter_id`, `kind` (originale / corrigée / finale), `content`, `engine` (gemini / chatgpt), `created_at`. Base de l'historique et du retour arrière.
- `book_memory` — mémoire persistante par chapitre (phase 2) : résumé, événements, personnages présents, informations révélées, lieux, dates, objets, indices, décisions, évolutions de relations, questions ouvertes.
- RLS par `user_id` + GRANT sur chaque table, comme le reste du projet.

### Nouvelles fonctions backend
- `book-bible-generate` (Gemini) — génère la Bible depuis la fiche maître ; clé de l'abonné en priorité, repli passerelle.
- `book-bible-revise` (Gemini) — régénère une section ciblée sans toucher au reste.
- Phases suivantes : `book-chapter-write` (ChatGPT, un chapitre à la fois, contexte assemblé depuis `book_memory`), `book-chapter-audit` (Gemini, rapport chiffré sans réécriture auto), `book-chapter-polish` (ChatGPT, style seul, avec liste noire des tics IA), `book-final-audit` (Gemini, manuscrit complet), `book-final-pass` (ChatGPT, corrections ciblées uniquement).

### Nouveaux fichiers front (parcours isolé)
- `src/pages/v3public/V3StudioProPage.tsx` — coquille du parcours, route `/v3/studio`.
- `src/components/v3/studio/` — `MasterSheetForm.tsx`, `BibleReview.tsx` (édition + ajouter/supprimer/déplacer/fusionner), `BookDashboard.tsx`, `EngineBadge.tsx`, `ChapterList.tsx`.
- `src/hooks/useBookProject.ts` — chargement/sauvegarde projet, Bible, chapitres.
- Entrées : lien « Studio Pro » dans `V3Sidebar.tsx` et le menu Créer de `src/data/v3HeaderMenu.ts`, réservé au forfait Édition (via le gate existant).

### Économie d'appels
Un rôle = un appel. Plan → Gemini. Rédaction → ChatGPT. Contrôle → Gemini. Style → ChatGPT. Jamais les deux moteurs sur la même tâche. La Bible n'est régénérée que sur demande explicite ; le contrôle de cohérence ne tourne qu'une fois par chapitre livré.

### Risques identifiés
- **Migration des projets existants** : les livres actuels vivent dans `ebook_projects.chapters` (JSON). En phase 1 aucune reprise n'est faite — le Studio Pro démarre sur des projets neufs. Un import « ancien projet → Studio Pro » sera ajouté en phase 5 si tu le souhaites.
- **Coût crédits de la rédaction** : maîtrisé par un modèle mini pour les brouillons et un plafond de chapitres par mois selon le forfait (quotas déjà en place).
- **Longueur de contexte sur livres longs** : c'est précisément le rôle de `book_memory` — on n'envoie jamais le manuscrit entier, seulement la fiche maître, le plan, la mémoire des chapitres concernés et le résumé du précédent.
- **Latence** : la génération d'une Bible complète dure 1 à 3 minutes ; l'écran affiche une progression par section plutôt qu'un simple sablier.

## Phases suivantes (après validation de la phase 1)

- **Phase 2 — Rédaction + mémoire** : ChatGPT écrit chapitre par chapitre, chaque chapitre est sauvegardé séparément, `book_memory` est alimenté après chaque chapitre et réinjecté dans le suivant.
- **Phase 3 — Contrôle Gemini** : rapport par chapitre (cohérence /100, chronologie, personnages, répétitions, contradictions inter-chapitres, rythme), corrections acceptées une par une. Contrôles spécifiques fiction (continuité des blessures, savoir des personnages, indices) et non-fiction (progression pédagogique, doublons).
- **Phase 4 — Passe stylistique + audit global** : passe ChatGPT style uniquement, puis audit Gemini du manuscrit entier avec tableau de contrôle, puis passe éditoriale finale ciblée qui conserve le texte validé comme base.
- **Phase 5 — Mode automatique, export, reprise** : enchaînement plan → rédaction → analyse → correction avec sauvegarde par chapitre, reprise après interruption, branchement sur l'export DOCX/PDF et la couverture existants, import des anciens projets.

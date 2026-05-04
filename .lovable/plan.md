# Guide campagne « Écrire un livre avec EbookStudio » — onglet par onglet

## Objectif
Produire **un document markdown** (`/mnt/documents/CAMPAGNE_WORKFLOW_LIVRE.md`) qui te donne, **pour chacun des 15 onglets du workflow** (P1 Zyro → P15 Orin), un bloc copier-coller standardisé contenant :

1. **Nom de l'agent + numéro** (ex: `P4 — Alia (Rédaction)`)
2. **Où aller** : route exacte + chemin de clic (ex: `/ebook-planner` → onglet `Créer` → bouton `Alia`)
3. **Pré-requis** : ce qui doit être fait avant (étapes verrouillées sinon)
4. **Ce qu'il faut remplir** : champs à saisir (titre, sous-titre, niche, etc.)
5. **L'action à faire** : sur quel bouton cliquer
6. **Capture d'écran à prendre** : 1 à 3 emplacements précis (ex: « capturer la carte agent en haut + le résultat généré »)
7. **Texte de campagne prêt à coller** : 2-3 phrases pédagogiques style email/post réseau, dans ton ton (KDP, simple, rassurant)
8. **Durée estimée** + tip de l'agent

## Format de chaque bloc (exemple P1)

```
═══════════════════════════════════════════
P1 — ZYRO (Vision & Niche)        ⏱️ ~2 min
═══════════════════════════════════════════

📍 OÙ ALLER
Route : /ebook-planner
Onglet : Créer ✍️ → cliquer sur "Zyro"

✅ PRÉ-REQUIS
Aucun — c'est le point de départ.

📝 À REMPLIR (carte "Configuration du livre")
- Titre provisoire
- Sous-titre
- Auteur
- Niche / catégorie
- Public cible
- Petite intro (3-5 lignes)

🎯 ACTION
Cliquer sur "Lancer Zyro" → l'IA propose 5 titres
percutants notés sur 100 (score KDP).
Le meilleur titre est sélectionné automatiquement.

📸 CAPTURES D'ÉCRAN À PRENDRE
1. Carte "Configuration du livre" remplie
2. Bouton "Lancer Zyro" (avant clic)
3. Résultat : les 5 titres avec scores KDP
4. Badge vert "Terminé" en haut

📣 TEXTE CAMPAGNE (à coller dans email/post)
"Étape 1 — Tu donnes juste ton idée et ta niche.
Zyro, ton directeur éditorial IA, te propose
5 titres optimisés Amazon KDP, notés sur 100.
Tu choisis. 2 minutes chrono."

💡 TIP : Définis ta niche et ton angle.
```

Le même bloc est répété pour P2 → P15, en s'appuyant sur les données déjà présentes dans `WorkflowNavigation.tsx` (label, description, requiredSteps, estimatedMinutes, tip, phase) et dans `STEP_TO_TAB` pour la route exacte.

## Découpage par phase (groupement campagne)

Le doc sera organisé en 4 sections, comme dans l'app, pour que tu puisses faire **4 emails de campagne** (1 par phase) ou **15 posts** (1 par agent) :

| Phase | Étapes | Usage campagne suggéré |
|---|---|---|
| ✍️ Créer | P1, P2, P3, P4 | Email 1 « De l'idée au manuscrit » |
| ⚡ Optimiser | P5, P6, P8–P13 | Email 2 « Du brouillon au pro » |
| 📦 Publier | P7, P14 | Email 3 « Prêt pour Amazon KDP » |
| 🎁 Bonus | P15 | Email 4 « 100% indétectable IA » |

## Sections supplémentaires du document

À la fin du markdown, j'ajoute :

- **Checklist captures globale** (les 16 captures les plus importantes, à cocher au tournage — sur le modèle de `ChecklistTournagePage.tsx`)
- **Glossaire des 15 agents** (1 ligne par agent : nom + rôle + super-pouvoir)
- **Script d'accroche campagne** : 3 hooks courts pour démarrer (« 47 minutes pour un livre de 150 pages », etc.)
- **CTA final** : invitation à tester sur ebookstudio.fr

## Détails techniques

- Source de vérité : `src/components/ebook/WorkflowNavigation.tsx` (WORKFLOW_STEPS, STEP_TO_TAB, PHASES)
- Source de vérité noms agents : `src/components/ebook/workflow/workflowAgents.ts` (lecture pour récupérer agentTitle / agentMission)
- Génération : un script Node `/tmp/build_campagne.mjs` qui lit ces deux fichiers et produit le markdown final dans `/mnt/documents/CAMPAGNE_WORKFLOW_LIVRE.md`
- Aucun changement dans le code de l'app (read-only sur le code applicatif)
- Livrable final servi via `<lov-artifact>` pour téléchargement immédiat

## Ce que tu obtiens
Un seul fichier `.md` que tu ouvres, et **chaque bloc P1…P15 est prêt à copier-coller** dans ton outil de campagne (Mailchimp, Brevo, post LinkedIn, script Loom…), avec à côté la liste exacte des captures à faire et où les faire.

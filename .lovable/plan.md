# Un 16e agent : la correction automatique avant l'export

## L'idée

Aujourd'hui, quand le livre est rédigé, il faut aller soi-même dans le correcteur pour le faire relire. On ajoute une dernière étape automatique : dès que le manuscrit est terminé, un 16e agent relit et corrige tout le livre, chapitre par chapitre, avec une barre de progression, puis on voit le livre corrigé avant de l'exporter.

## Le nom de l'agent

Proposition retenue : **Agent 16 — Lior, Le Relecteur final** (les 15 agents existants ont déjà un prénom court : Zyro, Kiro, Alia, Orin…). Autres options si tu préfères : **CorrectAgent**, **Nolan**, **Sacha**.
Dis-moi le nom voulu, je l'applique.

## Ce que verra l'abonné

```text
... Agent 15 (Orin)  ->  Agent 16 : Lior, Le Relecteur final
                          [ Relecture automatique du livre ]

                          Chapitre 7 / 24 corrige
                          [##########--------------]  42 %

                          - Fautes corrigees : 318
                          - Chapitres relus  : 7
                          - Qualite moyenne  : 92 %

                          [ Voir le livre corrige ]  [ Exporter ]
```

- Le 16e agent démarre tout seul dès que la rédaction est finie : aucune action à faire.
- Barre de progression réelle : elle avance chapitre par chapitre pendant la relecture.
- À la fin : le nombre de corrections, la qualité, et le livre corrigé affiché (avant / après par chapitre).
- Un bouton pour tout accepter, ou pour garder l'original d'un chapitre.
- L'export (Word, PDF, KDP) utilise ensuite le texte corrigé, pas le brouillon.
- Si un chapitre échoue (limite du service IA), il est signalé et relançable seul, sans bloquer les autres.

## Détails techniques

- Nouvelle étape `P16` ajoutée à `src/components/ebook/workflow/workflowAgents.ts` (nom, mission, icône, codename), donc elle apparaît automatiquement dans la grille des agents, la navigation et le tableau de bord du workflow.
- Réutilisation du correcteur existant : `proofreadChapters()` de `src/lib/correcteur/proofreadBook.ts`, qui appelle l'edge function `strict-proofread` déjà déployée. Aucune nouvelle fonction serveur, aucun nouveau modèle IA.
- Nouveau composant `src/components/ebook/workflow/WorkflowFinalProofread.tsx` : lance la relecture séquentielle, expose `onProgress` (chapitre courant / total) pour la barre, agrège corrections et score qualité, et affiche le comparatif avant/après.
- Branchement dans `EbookCompleteWorkflow.tsx` : à la fin de P15, l'étape P16 démarre automatiquement sur les chapitres rédigés (source déjà disponible via `writtenChapters`/contexte P4). Le résultat est stocké dans `stepResults.P16` et sauvegardé comme les autres étapes, donc la progression survit à un rechargement.
- L'export compilé (`WorkflowExportCompiled.tsx`) prend le texte corrigé via `effectiveText()` quand P16 est terminé, sinon le texte d'origine (comportement actuel inchangé).
- Fonctionne avec la clé IA de l'abonné déjà configurée (Gemini / OpenRouter), comme le correcteur actuel.

## Ce qui n'est pas touché

Base de données, sécurité, calculs KDP, paiements, tarifs, couvertures et V4 restent inchangés.

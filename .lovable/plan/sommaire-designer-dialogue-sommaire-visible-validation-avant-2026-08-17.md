# Sommaire designer : dialogue, sommaire visible, validation avant workflow

## Réponse à vos deux remarques

1. **La clé API n'a plus rien à faire sur la page de création.** Elle est déjà gérée dans **Fonctionnalités > Clés API**. L'encart `V3ApiKeysGate` sera retiré de `/v3/create`. À la place, une seule ligne discrète apparaîtra **uniquement si aucune clé n'est enregistrée**, avec un lien vers Fonctionnalités — pas de formulaire, pas de champ.
2. **Rien ne sera présenté comme « une IA unique ».** Le parcours réel reste multi-passes et multi-modèles : Gemini = architecte (bible, mémoire, cohérence), ChatGPT = plume (rédaction chapitre par chapitre), plus les agents du parcours P1-P15 pour recherche, KDP, couverture, audio. Le bandeau des moteurs (`V3EngineBanner`) est conservé sur la page et un bloc « Comment votre livre est écrit » listera les passes réelles, dans l'ordre, sans rien inventer.

## Ce qui change sur /v3/create

```text
┌───────────────────────────── /v3/create ─────────────────────────────┐
│  Bandeau moteurs (Gemini architecte · ChatGPT plume · agents P1-P15)  │
├──────────────────────────────┬───────────────────────────────────────┤
│  DIALOGUE (Génie)            │  SOMMAIRE EN DIRECT (colonne collée)  │
│  Étape 3 sur 6 – Votre lecteur│  1. ...  2. ...  3. ...              │
│  question · exemple · Passer  │  versions + ambiance                  │
│  cartes cliquables (langue…)  │  [ Valider le sommaire ]              │
├──────────────────────────────┴───────────────────────────────────────┤
│  Ambiance (17 choix, modifiable à tout moment)                        │
├───────────────────────────────────────────────────────────────────────┤
│  8 boutons d'action — GRISÉS tant que le sommaire n'est pas validé    │
├───────────────────────────────────────────────────────────────────────┤
│  Workflow de rédaction — n'apparaît qu'APRÈS validation du sommaire   │
└───────────────────────────────────────────────────────────────────────┘
```

1. **Entretien guidé en 6 étapes** (déjà posé) : une question à la fois, séparateur « Étape X sur 6 », « Montrer un exemple », « Passer », cartes cliquables pour la langue (10 langues) et le ton.
2. **Sommaire toujours visible pendant l'écriture** : passage en deux colonnes sur grand écran, la colonne sommaire reste collée (sticky) quand on fait défiler le dialogue et le workflow.
3. **Effacer ce livre** : remise à zéro complète (fiche, config workflow, sommaire en attente, conversation) — plus de retour de « l'enfant cobaye ».
4. **Ambiance modifiable à tout moment**, y compris après génération ; elle ne touche jamais le texte.
5. **Rien ne démarre avant la validation du sommaire** : avant, seuls le dialogue, le sommaire et le bouton « Valider le sommaire » sont actifs ; les 8 boutons sont visibles mais désactivés avec l'info « validez d'abord votre sommaire ». Après validation, tout s'active et le workflow multi-passes s'ouvre dessous.
6. **Bloc « Comment votre livre est écrit »** : les passes réelles, honnêtes (plan Gemini → bible/mémoire → rédaction ChatGPT chapitre par chapitre → contrôle de cohérence → correction pro 4 passes → KDP/couverture/audio).

## Détails techniques

- `src/lib/v3/bookBrief.ts` : `resetBookProject()`, champs `language`, `ambianceId`, `interviewSkipped` (fait).
- `src/lib/v3/genieInterview.ts` : les 6 étapes, exemples, choix, `currentInterviewStep()` (fait).
- `src/components/v3public/V3GenieDialog.tsx` : étape en cours, exemple, Passer, cartes de choix, « Effacer ce livre » (fait).
- `src/components/v3public/V3AmbiancePicker.tsx` : sélecteur d'ambiance (fait).
- `src/pages/v3public/V3CreatePage.tsx` : grille `lg:grid-cols-[1fr_360px]`, sommaire `sticky top-24`, suppression de `V3ApiKeysGate`, wizard monté seulement si `outlineValidated`.
- `src/components/v3public/V3BookActionsBar.tsx` : prop `locked` → boutons `disabled` + tooltip tant que le sommaire n'est pas validé.
- Nouveau `src/components/v3public/V3PipelinePanel.tsx` : liste des passes réelles (Gemini / ChatGPT / agents), sans promesse fausse.
- Aucun changement de tarifs, de base de données ni d'edge function.

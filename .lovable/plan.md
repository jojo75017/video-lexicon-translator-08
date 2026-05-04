
## Objectif

Deux problèmes utilisateurs à corriger :

1. **Sidebar ambiguë** : "Démarrer un livre / Écrire / Habiller / Publier / Vendre" ne dit pas si on travaille en **Workflow IA (P1→P15 automatique)** ou en **Mode simple (manuel)**.
2. **Limite chapitres** : actuellement bridée à **30**, on veut **40**.

---

## 1. Clarifier la sidebar : Workflow IA vs Mode simple

Dans `src/components/layout/SimpleSidebar.tsx`, ajouter en haut de la liste un **sélecteur de mode** clair (2 cartes/boutons) qui guide l'utilisateur dès l'arrivée :

```text
┌─────────────────────────────┐
│  Comment veux-tu créer ?    │
├─────────────────────────────┤
│ ⚡ Workflow IA (recommandé) │  → ouvre /ebook-planner avec onglet "complete-workflow"
│   15 agents automatiques    │
│   P1 → P15, ~30 min         │
├─────────────────────────────┤
│ ✍️  Mode simple (manuel)    │  → ouvre /ebook-planner avec onglet "planner"
│   Plan + écriture libre     │
│   À ton rythme              │
└─────────────────────────────┘
```

Puis sous ce sélecteur, garder les 5 étapes actuelles (Démarrer / Écrire / Habiller / Publier / Vendre) avec un **petit badge** sur chaque étape qui précise la nature de l'outil par défaut :
- "Démarrer un livre" → badge `Workflow` (envoie sur le planner connecté au workflow)
- "Écrire" → badge `Manuel` (éditeur libre) + sous-tip "Le Workflow IA écrit pour toi"
- "Habiller", "Publier", "Vendre" → pas de badge (étapes communes)

Mettre à jour le `hint` des étapes pour lever toute ambiguïté :
- "Démarrer un livre" → "Plan, idée, personnages — manuel ou IA"
- "Écrire" → "Rédaction manuelle (l'IA est dans Workflow)"

Visuel : utiliser le teal `#008296` pour le mode actif, hover orange `#FF9E2D` (charte KDP existante).

## 2. Passer le nombre max de chapitres de 30 → 40

Fichier : `src/components/ebook/WorkflowBookConfigForm.tsx`
- Ligne 144 : `max="30"` → `max="40"`
- Ligne ~148 : `Math.min(val, 30)` → `Math.min(val, 40)`
- Ligne 154 : texte d'aide → "Au-delà de 30 chapitres, des timeouts peuvent survenir. Maximum : 40."

Vérifier également :
- `src/components/ebook/EbookContentArchitect.tsx` (P3 — architecte de structure) : si un cap implicite limite la TOC à 30, le passer à 40.
- `supabase/functions/check-quota/` : la limite quota est par projet/abonnement, pas par chapitre — pas de changement nécessaire.

## 3. Mémoire à mettre à jour

`mem://constraints/workflow/chapter-limit-guideline` actuel : "maximum de 30 chapitres"
→ remplacer par : "maximum de 40 chapitres (au-delà de 30, risque de timeout sur P4)".

---

## Détails techniques

- Aucune migration DB.
- Aucune edge function modifiée (le P4 itère sur le tableau de chapitres reçu, pas de borne dure côté serveur).
- Pas d'impact sur le workflow P1→P15 stabilisé précédemment ; on ne touche qu'à l'UI sidebar et à 3 lignes du formulaire de config.

## Fichiers modifiés

- `src/components/layout/SimpleSidebar.tsx` — ajout sélecteur de mode + badges + hints clarifiés
- `src/components/ebook/WorkflowBookConfigForm.tsx` — limite 30 → 40
- `src/components/ebook/EbookContentArchitect.tsx` — vérifier/aligner sur 40 si besoin
- `mem://constraints/workflow/chapter-limit-guideline` — mise à jour de la règle

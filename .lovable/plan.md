

User wants Phase C: unification of data sources + splitting the 3185-line monolith. Let me keep this concise and pragmatic.

Phase C scope from previous audit:
1. Unify the 4 parallel data sources (React state, `ebook_workflow_progress` localStorage, `ebook_workflow_results` localStorage, cloud `workflow_results`) → reduce to 2 (React + cloud, localStorage = read cache)
2. Remove duplicate `ebook_workflow_progress` ↔ `ebook_workflow_results`
3. Split `EbookPlannerPage.tsx` (3185 lines) into modules

Risk: the memory `mem://contraintes/technique/refactoring-monolithe-ebook-planner` explicitly warns that refactoring the monolith is complex and was deferred. I should be cautious — propose a SAFE incremental split, not a big-bang rewrite.

Plan structure: keep it short, propose 2 sub-phases (data first, split second), with safety guarantees.


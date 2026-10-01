# Architecture

- HumanizeAI conserve la route `/v3/outils/humanizer` et centralise humanisation et audit stylométrique, afin de préserver les liens existants et une seule porte d’entrée.
- Studio Micro-Séries utilise le pack `micro_series` et le droit `micro-series`, vendus séparément de tous les forfaits, afin que la précommande V4 ouvre automatiquement l'accès futur.
- Le Studio Album Illustré 3–6 ans reste un module séparé des Histoires courtes et utilise un brouillon dédié, afin de préserver les recueils existants et la continuité d’une histoire unique jusqu’à 30 pages.
- The V3 home page exposes “Commence ici” as the primary subscriber entry point, so users reach specialist selection without searching through tools.
- V3 specialist cards use a shared editorial-android portrait set through `AgentPortrait`, so the team stays visually consistent with Hector and Margaux.
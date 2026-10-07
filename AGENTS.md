# Architecture
- Separate wrap image exports crop the shared full-cover renderer at each zone’s finished dimensions, preserving artwork and text without printing editor guides.
- Wrap layout templates transform existing text elements locally and preview through the export renderer, preserving content, private images, image adjustments and KDP geometry.
- Cover brightness limits must match controls, persistence and export filters, so stronger brightening survives reload and printing.
- Wrap text formatting uses a shared canvas renderer for justification and underline across exports and thumbnails, so printable output retains editable block styles.

- Full-wrap illustrations use an optional persisted imageCoverage field and the same placement calculation in previews and exports, preserving legacy front-only covers.

- HumanizeAI conserve la route `/v3/outils/humanizer` et centralise humanisation et audit stylométrique, afin de préserver les liens existants et une seule porte d’entrée.
- Studio Micro-Séries utilise le pack `micro_series` et le droit `micro-series`, vendus séparément de tous les forfaits, afin que la précommande V4 ouvre automatiquement l'accès futur.
- Le Studio Album Illustré 3–6 ans reste un module séparé des Histoires courtes et utilise un brouillon dédié, afin de préserver les recueils existants et la continuité d’une histoire unique jusqu’à 30 pages.
- The V3 home page exposes “Commence ici” as the primary subscriber entry point, so users reach specialist selection without searching through tools.
- V3 specialist cards use a shared editorial-android portrait set through `AgentPortrait`, so the team stays visually consistent with Hector and Margaux.
- “Écrire un livre” uses the dedicated `/v3/lancer` direct-writing flow, while “Je raconte un livre” uses `/v3/create`, so their steps never appear identical.
- The launch email sequence tracks the V3 preview PDF click and repeats the PDF only until each recipient has clicked it, so follow-ups stay relevant without repeatedly showing an already-viewed document.
- The authenticated V3 home excludes acquisition content and groups every paid add-on after the useful studio sections, so subscribers see a workspace overview before optional purchases.
- The header library loads ownership-filtered metadata through a security-invoker function, excluding manuscript bodies and embedded image blobs to prevent timeouts without weakening RLS.
- The legacy /v3/hub page is admin-only via V3HubAdminOnly, redirecting clients to the equivalent current page so old links never expose the technical workshop.
- The subscriber cover studio (Studio V4) lives at /v3/studio-v4 as a standalone page reusing CoverStudioPro, so subscribers reach it without the legacy hub or the paid /v3/cover-pro offer.

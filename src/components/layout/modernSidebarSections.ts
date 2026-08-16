export interface SidebarSectionConfig {
  label: string;
  itemIds: string[];
}

// Liste des 15 agents du workflow IA (P1 → P15)
// Repliés dans un sous-groupe dédié pour ne pas écraser la sidebar.
export const WORKFLOW_AGENT_IDS: string[] = [
  'editorial-director', 'market-analysis', 'content-architect', 'expert-writing',
  'natural-rewrite', 'editorial-quality', 'editorial-packaging', 'final-diagnosis',
  'editorial-memory', 'chapter-coherence', 'self-critique', 'iterative-loop',
  'style-signature', 'ultimate-verdict', 'humanize-anti-ia',
];

export const SIDEBAR_SUBSECTIONS: Record<string, SidebarSectionConfig[]> = {
  '1️⃣ Préparer': [
    { label: 'Plan & univers', itemIds: ['planner', 'characters', 'series'] },
    { label: 'Imports', itemIds: ['doc-transform', 'url-import'] },
    { label: 'Modèles', itemIds: ['templates'] },
  ],
  '2️⃣ Écrire': [
    { label: 'Rédaction', itemIds: ['writing', 'aichat', 'strict-proofread'] },
    { label: 'Workflow IA', itemIds: ['workflow-dashboard', 'complete-workflow'] },
    { label: 'Formats KDP', itemIds: ['atlas', 'encyclopedia', 'coloring', 'documentary'] },
    { label: 'Outils', itemIds: ['multi-translator'] },
  ],
  '3️⃣ Publier': [
    { label: 'Couverture', itemIds: ['cover-design-editor', 'cover', 'backcover'] },
    { label: 'Export', itemIds: ['export', 'workflow-export', 'calibre-epub'] },
    { label: 'KDP', itemIds: ['kdp', 'kdp-prepublish-checklist', 'kdp-keywords-pro', 'audit-pilot', 'bookperfect'] },
    { label: 'Audio', itemIds: ['audiobook', 'audio-express'] },
  ],
  '4️⃣ Vendre': [
    { label: 'Marketing', itemIds: ['marketing', 'launch-plan'] },
    { label: 'Amazon Ads', itemIds: ['kdp-ads-guide'] },
    { label: 'Bonus', itemIds: ['chrome-extension'] },
  ],
  '⚙️ Mon Compte': [
    { label: 'Espace', itemIds: ['projects', 'ebook-library', 'settings', 'subscription'] },
    { label: 'Communauté', itemIds: ['parrainage', 'communaute'] },
    { label: 'Admin', itemIds: ['admin', 'admin-subscribers', 'admin-prospects'] },
  ],
};

/**
 * Outils "essentiels" affichés par défaut dans chaque étape.
 * Volontairement réduits à 3-4 outils max pour aérer la sidebar.
 * Les autres outils restent accessibles via "+ Voir avancés".
 */
export const ESSENTIAL_TOOL_IDS: Record<string, string[]> = {
  '1️⃣ Préparer': ['planner', 'characters', 'doc-transform'],
  '2️⃣ Écrire': ['writing', 'aichat', 'strict-proofread'],
  '3️⃣ Publier': ['export', 'cover-design-editor', 'kdp', 'audit-pilot'],
  '4️⃣ Vendre': ['marketing', 'launch-plan', 'kdp-ads-guide'],
  '⚙️ Mon Compte': ['projects', 'subscription'],
};

export interface SidebarSectionConfig {
  label: string;
  itemIds: string[];
}

export const SIDEBAR_SUBSECTIONS: Record<string, SidebarSectionConfig[]> = {
  '🤖 Workflow IA': [
    { label: 'Pipeline', itemIds: ['workflow-dashboard', 'complete-workflow'] },
    { label: 'Créer', itemIds: ['editorial-director', 'market-analysis', 'content-architect', 'expert-writing'] },
    { label: 'Optimiser', itemIds: ['natural-rewrite', 'editorial-quality', 'editorial-memory', 'chapter-coherence', 'self-critique', 'iterative-loop', 'style-signature'] },
    { label: 'Publier', itemIds: ['editorial-packaging', 'final-diagnosis', 'ultimate-verdict'] },
    { label: 'Bonus', itemIds: ['humanize-anti-ia'] },
  ],
  '✍️ Écriture': [
    { label: 'Essentiel', itemIds: ['planner', 'writing', 'aichat'] },
    { label: 'Univers', itemIds: ['characters', 'series'] },
    { label: 'Formats KDP', itemIds: ['atlas', 'encyclopedia', 'coloring', 'documentary'] },
    { label: 'Imports', itemIds: ['doc-transform', 'url-import'] },
    { label: 'Outils', itemIds: ['templates', 'strict-proofread'] },
  ],
  '📦 Publier': [
    { label: 'Exports', itemIds: ['export', 'workflow-export', 'calibre-epub'] },
    { label: 'Couverture', itemIds: ['cover-design-editor', 'cover', 'backcover'] },
    { label: 'KDP', itemIds: ['kdp', 'kdp-prepublish-checklist'] },
    { label: 'Audio', itemIds: ['audiobook', 'audio-express'] },
  ],
  '📣 Vendre': [
    { label: 'Marketing', itemIds: ['marketing', 'launch-plan'] },
  ],
  '⚙️ Mon Compte': [
    { label: 'Espace', itemIds: ['projects', 'ebook-library', 'settings', 'subscription'] },
    { label: 'Admin', itemIds: ['admin', 'admin-panel'] },
  ],
};

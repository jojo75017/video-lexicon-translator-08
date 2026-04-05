export interface SidebarSectionConfig {
  label: string;
  itemIds: string[];
}

export const SIDEBAR_SUBSECTIONS: Record<string, SidebarSectionConfig[]> = {
  '🤖 Workflow IA': [
    { label: 'Pipeline', itemIds: ['workflow-dashboard', 'complete-workflow'] },
    { label: 'Créer', itemIds: ['editorial-director', 'market-analysis', 'content-architect', 'expert-writing'] },
    { label: 'Optimiser', itemIds: ['natural-rewrite', 'editorial-quality', 'final-diagnosis', 'editorial-memory', 'chapter-coherence', 'self-critique', 'iterative-loop', 'style-signature'] },
    { label: 'Publier', itemIds: ['editorial-packaging', 'ultimate-verdict'] },
    { label: 'Bonus', itemIds: ['humanize-anti-ia'] },
  ],
  '✍️ Écriture': [
    { label: 'Essentiel', itemIds: ['onboarding', 'presentation', 'planner', 'writing', 'rich-editor', 'aichat'] },
    { label: 'Univers', itemIds: ['characters', 'series', 'multi-tome-hub', 'voice', 'writing-intelligence'] },
    { label: 'Imports', itemIds: ['doc-transform', 'url-import', 'pdf-analyzer', 'pdf-reformatter'] },
    { label: 'Idées', itemIds: ['niche-templates', 'templates', 'niches', 'niche-analysis', 'draft-mode', 'focus-mode', 'chapter-word-count', 'prompt-library', 'prompt-chain-generator'] },
    { label: 'Formats', itemIds: ['recipe-book', 'coloring-book', 'diary-generator', 'travel-guide', 'bird-guide', 'aquarium-guide', 'documentary', 'encyclopedia', 'comic-book', 'atlas'] },
  ],
  '📦 Publier': [
    { label: 'Exports', itemIds: ['export', 'workflow-export', 'advanced-export', 'calibre-epub', 'elementor-export', 'export-guide'] },
    { label: 'Couverture', itemIds: ['cover-design-editor', 'cover', 'ai-cover-studio', 'kdp-cover-studio', 'backcover', 'back-matter-generator', 'mockup-studio', 'imagebank', 'images'] },
    { label: 'KDP', itemIds: ['kdp', 'kdp-keywords', 'kdp-prepublish-checklist', 'kdp-guide', 'kdp-amazon-research', 'kdp-research', 'kdp-explosive', 'kindle-preview', 'pen-name', 'description-magnet', 'title-ab-test', 'multi-translator', 'manuscript-dashboard', 'publication-planner'] },
    { label: 'Audio & Vidéo', itemIds: ['audiobook', 'audiobook-library', 'audio-direct', 'audio-express', 'formation-audiobook-distribution', 'video-creator', 'video-trailer'] },
    { label: 'Qualité', itemIds: ['strict-proofread', 'readability-analyzer', 'consistency-detector', 'rhythm-analyzer', 'plagiarism-validator', 'ai-detector', 'humanizer', 'editor-audit'] },
  ],
  '📣 Vendre': [
    { label: 'Marketing', itemIds: ['marketing', 'launch-plan', 'amazon-ads', 'seo-articles', 'landing-page-generator', 'editorial-calendar', 'direct-sales'] },
    { label: 'Revenus', itemIds: ['monetization', 'kdp-revenue-simulator', 'price-estimator', 'price-studio', 'royalty-dashboard'] },
    { label: 'Analyse', itemIds: ['kdp-analytics', 'bsr-tracker', 'competitor-spy', 'competitor-dashboard', 'trend-predictor', 'amazon-simulator', 'ab-testing'] },
    { label: 'Audience', itemIds: ['affiliation', 'beta-reader-hub'] },
  ],
  '⚙️ Mon Compte': [
    { label: 'Espace', itemIds: ['projects', 'ebook-library', 'library', 'dashboard', 'global-dashboard', 'statistics', 'analytics', 'subscription', 'settings', 'tools', 'ux-center', 'arc-manager', 'assistant', 'market'] },
    { label: 'Communauté', itemIds: ['communaute'] },
    { label: 'Formations', itemIds: ['formation-complete', 'formation-pdf'] },
    { label: 'Admin', itemIds: ['admin', 'admin-panel', 'crm-page', 'prospect-manager'] },
  ],
};
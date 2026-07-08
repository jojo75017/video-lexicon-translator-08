// Documentation Studio AI — constantes (types de produit, templates, livrables, aide)
import type { ProductType } from './types';

// Palette « Clair Ambre » (cohérente avec le Hub V3)
export const DS = {
  AMBER: '#E8951E',
  AMBER_DEEP: '#C97A14',
  AMBER_SOFT: '#FFF3DF',
  CREAM: '#FBF6EC',
  INK: '#2A2118',
  MUTED: '#7c6b54',
  BORDER: '#eadfc9',
  SERIF: "'Instrument Serif', Georgia, 'Times New Roman', serif",
  SANS: "'Inter', system-ui, sans-serif",
};

export interface ProductTypeMeta {
  id: ProductType;
  label: string;
  icon: string;
  desc: string;
}

export const PRODUCT_TYPES: ProductTypeMeta[] = [
  { id: 'saas', label: 'Logiciel / SaaS', icon: '🖥️', desc: 'Application web en abonnement ou licence.' },
  { id: 'plugin', label: 'Plugin WordPress', icon: '🔌', desc: 'Extension pour WordPress ou WooCommerce.' },
  { id: 'app', label: 'Application mobile', icon: '📱', desc: 'App iOS / Android ou cross-platform.' },
  { id: 'ai', label: 'Outil IA', icon: '🤖', desc: 'Produit basé sur l\'intelligence artificielle.' },
  { id: 'chrome', label: 'Extension Chrome', icon: '🧩', desc: 'Extension de navigateur.' },
  { id: 'api', label: 'API / Service', icon: '🔗', desc: 'API développeur ou service backend.' },
  { id: 'shopify', label: 'App Shopify', icon: '🛍️', desc: 'Application pour l\'écosystème Shopify.' },
  { id: 'crm', label: 'CRM / ERP', icon: '📇', desc: 'Outil de gestion d\'entreprise.' },
  { id: 'elearning', label: 'Plateforme e-learning', icon: '🎓', desc: 'Formation ou cours en ligne.' },
  { id: 'digital', label: 'Produit numérique', icon: '💾', desc: 'Template, thème, pack ou ressource.' },
  { id: 'other', label: 'Autre', icon: '✨', desc: 'Un autre type de produit numérique.' },
];

export interface TemplateMeta {
  id: string;
  label: string;
  desc: string;
  swatch: string[]; // aperçu couleurs
}

export const DOC_TEMPLATES: TemplateMeta[] = [
  { id: 'apple', label: 'Apple', desc: 'Épuré, blanc, typographie élégante.', swatch: ['#ffffff', '#1d1d1f', '#0071e3'] },
  { id: 'figma', label: 'Figma', desc: 'Coloré, moderne, orienté design.', swatch: ['#ffffff', '#0d99ff', '#f24e1e'] },
  { id: 'notion', label: 'Notion', desc: 'Sobre, lisible, orienté contenu.', swatch: ['#ffffff', '#37352f', '#eb5757'] },
  { id: 'stripe', label: 'Stripe', desc: 'Premium, dégradés, corporate tech.', swatch: ['#0a2540', '#635bff', '#00d4ff'] },
  { id: 'startup', label: 'Startup Tech', desc: 'Dynamique, punchy, orienté vente.', swatch: ['#0f172a', '#22d3ee', '#a855f7'] },
  { id: 'corporate', label: 'Corporate', desc: 'Institutionnel, rassurant, structuré.', swatch: ['#1e293b', '#0ea5e9', '#e2e8f0'] },
  { id: 'minimal', label: 'Minimaliste', desc: 'Noir & blanc, espace, essentiel.', swatch: ['#ffffff', '#000000', '#f5f5f5'] },
  { id: 'api', label: 'Documentation API', desc: 'Technique, mono, blocs de code.', swatch: ['#111827', '#10b981', '#f59e0b'] },
];

export interface DeliverableMeta {
  id: string;
  label: string;
  desc: string;
}

export interface DeliverableGroup {
  id: string;
  label: string;
  icon: string;
  items: DeliverableMeta[];
}

export const DELIVERABLE_GROUPS: DeliverableGroup[] = [
  {
    id: 'documentation',
    label: 'Documentation',
    icon: '📚',
    items: [
      { id: 'brandbook', label: 'Brand Book', desc: 'Vision, mission, valeurs, design system, blueprint produit.' },
      { id: 'user-manual', label: 'Manuel utilisateur', desc: 'Guide pas à pas de toutes les fonctionnalités.' },
      { id: 'technical-doc', label: 'Documentation technique', desc: 'Architecture, intégration, référence développeur.' },
      { id: 'faq', label: 'FAQ', desc: 'Questions fréquentes et réponses claires.' },
      { id: 'help-center', label: 'Centre d\'aide', desc: 'Base de connaissances organisée par thèmes.' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: '📣',
    items: [
      { id: 'landing', label: 'Landing Page', desc: 'Page de vente complète, orientée conversion.' },
      { id: 'onepage', label: 'One Page', desc: 'Présentation produit condensée sur une page.' },
      { id: 'media-kit', label: 'Kit Média', desc: 'Assets, descriptions et visuels pour la presse.' },
      { id: 'affiliate-kit', label: 'Kit Affiliés', desc: 'Arguments et supports pour les affiliés.' },
      { id: 'partner-kit', label: 'Kit Partenaires', desc: 'Dossier de présentation pour partenaires.' },
      { id: 'product-hunt', label: 'Product Hunt', desc: 'Fiche de lancement optimisée Product Hunt.' },
      { id: 'appsumo', label: 'AppSumo', desc: 'Fiche deal optimisée AppSumo.' },
      { id: 'sales-deck', label: 'Présentation commerciale', desc: 'Deck de vente structuré.' },
      { id: 'pitch-deck', label: 'Pitch investisseur', desc: 'Pitch deck pour lever des fonds.' },
      { id: 'launch-emails', label: 'Emails de lancement', desc: 'Séquence email de lancement produit.' },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: '💬',
    items: [
      { id: 'video-scripts', label: 'Scripts vidéo', desc: 'Scripts de démo, teaser et tutoriels.' },
      { id: 'linkedin', label: 'Publications LinkedIn', desc: 'Posts prêts à publier sur LinkedIn.' },
      { id: 'facebook', label: 'Publications Facebook', desc: 'Posts prêts à publier sur Facebook.' },
      { id: 'twitter', label: 'Publications X (Twitter)', desc: 'Threads et posts prêts à publier sur X.' },
    ],
  },
];

export const ALL_DELIVERABLES: DeliverableMeta[] = DELIVERABLE_GROUPS.flatMap((g) => g.items);

export const EXPORT_FORMATS = [
  { id: 'docx', label: 'Word (.docx)', icon: '📝' },
  { id: 'pdf', label: 'PDF Premium', icon: '📄' },
  { id: 'html', label: 'HTML', icon: '🌐' },
  { id: 'markdown', label: 'Markdown', icon: '⬇️' },
  { id: 'pptx', label: 'PowerPoint', icon: '📊' },
];

// Étapes du wizard (Étape 0 + 7 étapes)
export interface StepMeta {
  key: string;
  label: string;
  icon: string;
  help: string;
}

export const STEPS: StepMeta[] = [
  { key: 'type', label: 'Type de produit', icon: '🎯', help: 'Choisissez le type de produit à documenter. L\'IA adaptera les questions et les modèles à ce choix.' },
  { key: 'project', label: 'Projet', icon: '📁', help: 'Renseignez les informations de base : nom, version, entreprise. Rien de compliqué, juste l\'identité du produit.' },
  { key: 'positioning', label: 'Positionnement', icon: '🎪', help: 'Expliquez la valeur de votre produit : à qui il s\'adresse, quel problème il résout et sa promesse unique.' },
  { key: 'identity', label: 'Identité visuelle', icon: '🎨', help: 'Définissez le style visuel et choisissez un modèle premium. Ce sera l\'apparence de vos documents.' },
  { key: 'modules', label: 'Modules', icon: '🧱', help: 'Listez les grands modules de votre produit. Ajoutez-en autant que nécessaire, réorganisez-les librement.' },
  { key: 'features', label: 'Fonctionnalités', icon: '⚙️', help: 'Détaillez les fonctionnalités clés avec un exemple et une astuce pour chaque.' },
  { key: 'agents', label: 'Agents IA', icon: '🤖', help: 'Si votre produit inclut des assistants IA, décrivez-les ici. Sinon, passez cette étape.' },
  { key: 'exports', label: 'Exports', icon: '📤', help: 'Sélectionnez les documents à générer et leurs formats. Vous obtiendrez une estimation avant de lancer.' },
];

export const MODULE_ICONS = ['📦', '🧱', '⚙️', '🚀', '📊', '🔐', '🔔', '💬', '🗂️', '🎨', '🧠', '🔗', '📈', '🛠️', '📱', '🌐'];

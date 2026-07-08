// Documentation Studio AI — modèle de données (V1)
// Aucune donnée simulée : tout est saisi par l'utilisateur ou généré par l'IA réelle.

export type ProductType =
  | 'saas'
  | 'plugin'
  | 'app'
  | 'ai'
  | 'chrome'
  | 'api'
  | 'shopify'
  | 'crm'
  | 'elearning'
  | 'digital'
  | 'other';

export interface DocModuleItem {
  id: string;
  name: string;
  description: string;
  fonction: string;
  audience: string;
  capture: string; // URL capture (optionnel)
  icon: string;    // emoji
}

export interface DocFeatureItem {
  id: string;
  name: string;
  description: string;
  example: string;
  tip: string;
  capture: string;
}

export interface DocAgentItem {
  id: string;
  name: string;
  mission: string;
  personality: string;
  skills: string;
  workflow: string;
  systemPrompt: string;
  useCases: string;
}

export interface DocProject {
  id: string;
  productType: ProductType | null;
  project: {
    name: string;
    version: string;
    company: string;
    website: string;
    slogan: string;
    language: string;
    logo: string;
  };
  positioning: {
    vision: string;
    mission: string;
    values: string;
    audience: string;
    problem: string;
    promise: string;
    advantages: string;
  };
  identity: {
    logo: string;
    colors: string;
    typography: string;
    style: string;
    template: string; // id template
  };
  modules: DocModuleItem[];
  features: DocFeatureItem[];
  agents: DocAgentItem[];
  exports: string[]; // ids des livrables sélectionnés
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'ready' | 'generated';
}

export function emptyProject(): DocProject {
  const now = new Date().toISOString();
  return {
    id: `doc_${Date.now().toString(36)}`,
    productType: null,
    project: { name: '', version: '1.0', company: '', website: '', slogan: '', language: 'Français', logo: '' },
    positioning: { vision: '', mission: '', values: '', audience: '', problem: '', promise: '', advantages: '' },
    identity: { logo: '', colors: '', typography: '', style: '', template: 'apple' },
    modules: [],
    features: [],
    agents: [],
    exports: [],
    createdAt: now,
    updatedAt: now,
    status: 'draft',
  };
}

export function newModule(): DocModuleItem {
  return { id: `m_${Math.random().toString(36).slice(2, 8)}`, name: '', description: '', fonction: '', audience: '', capture: '', icon: '📦' };
}
export function newFeature(): DocFeatureItem {
  return { id: `f_${Math.random().toString(36).slice(2, 8)}`, name: '', description: '', example: '', tip: '', capture: '' };
}
export function newAgent(): DocAgentItem {
  return { id: `a_${Math.random().toString(36).slice(2, 8)}`, name: '', mission: '', personality: '', skills: '', workflow: '', systemPrompt: '', useCases: '' };
}

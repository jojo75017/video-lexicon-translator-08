// Roadmap V3 — EbookStudio "Publication Assistée Pro"
// Prix cible : 197€ à vie (vs 67€ pour V2 actuelle)
// La liste reste éditable : on peut ajouter/retirer des modules.

export type V3Pillar = 'publier' | 'monetiser' | 'marketing' | 'ia';
export type V3Status = 'todo' | 'in_progress' | 'done';

export interface V3Module {
  id: string;
  title: string;
  pillar: V3Pillar;
  status: V3Status;
  description: string;
}

export const V3_PRICE = 197;
export const V2_PRICE = 67;

export const V3_PILLAR_META: Record<V3Pillar, { label: string; color: string; emoji: string }> = {
  publier:    { label: 'Publier',    color: '#008296', emoji: '📦' },
  monetiser:  { label: 'Monétiser',  color: '#FF9E2D', emoji: '💰' },
  marketing:  { label: 'Marketing',  color: '#7C3AED', emoji: '📣' },
  ia:         { label: 'IA avancée', color: '#10B981', emoji: '🧠' },
};

export const V3_MODULES: V3Module[] = [
  // PUBLIER
  { id: 'kdp-pack-zip',        pillar: 'publier',   status: 'todo', title: 'Pack KDP ZIP',
    description: 'Export bundle PDF intérieur + couverture + métadonnées prêt upload Amazon.' },
  { id: 'cockpit-audit-pilot', pillar: 'publier',   status: 'todo', title: 'Cockpit Audit Pilot',
    description: 'Score de conformité KDP (marges, polices, ISBN, bleed, Modulo 10).' },
  { id: 'prepub-checklist',    pillar: 'publier',   status: 'todo', title: 'Checklist Prépublication',
    description: '25 points cochables avant clic "Publier" sur KDP.' },
  { id: 'kindle-previewer',    pillar: 'publier',   status: 'todo', title: 'Kindle Previewer Simulé',
    description: 'Aperçu visuel Kindle / tablette / phone avec rendu typographique fidèle.' },

  // MONÉTISER
  { id: 'sales-tracker',       pillar: 'monetiser', status: 'todo', title: 'Tracker Ventes KDP',
    description: 'Import CSV royalties Amazon + graphes revenus mensuels / par titre.' },
  { id: 'aplus-generator',     pillar: 'monetiser', status: 'todo', title: 'Générateur Page A+',
    description: 'Génère le HTML Amazon A+ Content avec visuels et blocs prêts à coller.' },
  { id: 'auto-pricing',        pillar: 'monetiser', status: 'todo', title: 'Auto-Pricing IA',
    description: 'Suggère le prix optimal selon niche, concurrence et longueur.' },

  // MARKETING
  { id: 'launch-sequence-j7',  pillar: 'marketing', status: 'todo', title: 'Séquence Lancement J-7',
    description: 'Emails + posts sociaux pré-programmés sur 7 jours avant publication.' },
  { id: 'amazon-ads',          pillar: 'marketing', status: 'todo', title: 'Amazon Ads Generator',
    description: 'Campagnes Sponsored Products / Brands avec mots-clés ciblés.' },
  { id: 'pinterest-pins',      pillar: 'marketing', status: 'todo', title: 'Pinterest Auto-Pins',
    description: '20 pins générés automatiquement depuis la couverture du livre.' },

  // IA AVANCÉE
  { id: 'p16-competitive',     pillar: 'ia',        status: 'todo', title: 'Agent P16 — Analyse Concurrentielle',
    description: 'Scan top 10 Amazon de la niche pour positionnement et angles.' },
  { id: 'p17-series',          pillar: 'ia',        status: 'todo', title: 'Agent P17 — Architecte de Série',
    description: 'Plan cohérent des tomes 2 / 3 / 4 (arcs, persos, cliffhangers).' },
];

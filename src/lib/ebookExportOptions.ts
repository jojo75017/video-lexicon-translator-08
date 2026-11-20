// Options de mise en page partagées entre les exports DOCX et PDF
// pour les Livres Pédagogiques (et autres exports rich-block).

export type ExportFontFamily =
  | 'Calibri' | 'Georgia' | 'Garamond' | 'Helvetica'
  | 'Baskerville' | 'Book Antiqua' | 'Palatino Linotype' | 'Cambria' | 'Times New Roman'
  | 'Lora' | 'Merriweather' | 'EB Garamond' | 'Crimson Text' | 'Libre Baskerville'
  | 'Playfair Display' | 'Cinzel' | 'Cormorant Garamond' | 'Bebas Neue' | 'Oswald'
  | 'Montserrat' | 'Raleway' | 'Open Sans' | 'Arial' | 'Verdana' | 'Fredoka' | 'Rye';

/** Polices proposées pour les titres et le corps du livre. */
export const FONT_CHOICES: { value: ExportFontFamily; label: string; serif: boolean; css: string; heading?: boolean }[] = [
  { value: 'Garamond', label: 'Garamond (édition classique)', serif: true, css: 'Garamond, "EB Garamond", serif' },
  { value: 'EB Garamond', label: 'EB Garamond', serif: true, css: '"EB Garamond", Garamond, serif' },
  { value: 'Georgia', label: 'Georgia', serif: true, css: 'Georgia, serif' },
  { value: 'Baskerville', label: 'Baskerville', serif: true, css: 'Baskerville, "Libre Baskerville", serif' },
  { value: 'Libre Baskerville', label: 'Libre Baskerville', serif: true, css: '"Libre Baskerville", Baskerville, serif' },
  { value: 'Book Antiqua', label: 'Book Antiqua', serif: true, css: '"Book Antiqua", Palatino, serif' },
  { value: 'Palatino Linotype', label: 'Palatino', serif: true, css: '"Palatino Linotype", Palatino, serif' },
  { value: 'Times New Roman', label: 'Times New Roman', serif: true, css: '"Times New Roman", Times, serif' },
  { value: 'Cambria', label: 'Cambria', serif: true, css: 'Cambria, Georgia, serif' },
  { value: 'Lora', label: 'Lora (roman moderne)', serif: true, css: 'Lora, Georgia, serif' },
  { value: 'Merriweather', label: 'Merriweather', serif: true, css: 'Merriweather, Georgia, serif' },
  { value: 'Crimson Text', label: 'Crimson Text', serif: true, css: '"Crimson Text", Georgia, serif' },
  { value: 'Playfair Display', label: 'Playfair Display (prestige)', serif: true, css: '"Playfair Display", Georgia, serif', heading: true },
  { value: 'Cinzel', label: 'Cinzel (historique, épique)', serif: true, css: 'Cinzel, Georgia, serif', heading: true },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond (romance)', serif: true, css: '"Cormorant Garamond", Garamond, serif', heading: true },
  { value: 'Rye', label: 'Rye (western)', serif: true, css: 'Rye, Georgia, serif', heading: true },
  { value: 'Bebas Neue', label: 'Bebas Neue (thriller, action)', serif: false, css: '"Bebas Neue", Oswald, sans-serif', heading: true },
  { value: 'Oswald', label: 'Oswald (policier)', serif: false, css: 'Oswald, Arial, sans-serif', heading: true },
  { value: 'Fredoka', label: 'Fredoka (jeunesse)', serif: false, css: 'Fredoka, Arial, sans-serif', heading: true },
  { value: 'Montserrat', label: 'Montserrat (moderne)', serif: false, css: 'Montserrat, Arial, sans-serif' },
  { value: 'Raleway', label: 'Raleway', serif: false, css: 'Raleway, Arial, sans-serif' },
  { value: 'Open Sans', label: 'Open Sans', serif: false, css: '"Open Sans", Arial, sans-serif' },
  { value: 'Calibri', label: 'Calibri', serif: false, css: 'Calibri, system-ui, sans-serif' },
  { value: 'Helvetica', label: 'Helvetica', serif: false, css: 'Helvetica, Arial, sans-serif' },
  { value: 'Arial', label: 'Arial', serif: false, css: 'Arial, sans-serif' },
  { value: 'Verdana', label: 'Verdana (grande lisibilité)', serif: false, css: 'Verdana, sans-serif' },
];
export const fontCss = (f?: ExportFontFamily) => FONT_CHOICES.find(c => c.value === f)?.css ?? 'Calibri, system-ui, sans-serif';
/** Police des titres effective (retombe sur la police du corps si aucune n'est choisie). */
export const headingFontOf = (t: Pick<EbookExportTypography, 'fontFamily' | 'headingFontFamily'>) => t.headingFontFamily || t.fontFamily;
export type ExportLineHeight = 1.15 | 1.5 | 2.0;
export type ExportMargin = 'tight' | 'standard' | 'wide';

export interface EbookExportTypography {
  /** Police du corps de texte (et des titres si headingFontFamily est vide) */
  fontFamily: ExportFontFamily;
  /** Police des titres (facultative) */
  headingFontFamily?: ExportFontFamily;
  /** Taille des titres de chapitre (en pt) — 14 ou 16 */
  headingSize: 14 | 16 | 18 | 20;
  /** Taille du corps de texte (en pt) — 11, 12 ou 14 */
  bodySize: 11 | 12 | 14 | 16;
  /** Justifie le corps de texte (sinon aligné à gauche) */
  justify: boolean;
  /** Couleur des titres (hex avec #) */
  headingColor: string;
  /** Couleur du corps (hex avec #) */
  bodyColor: string;
  /** Italique automatique pour les blockquotes (>) et encadrés type Citation/Anecdote */
  italicQuotes: boolean;
  /** Interligne du corps */
  lineHeight: ExportLineHeight;
  /** Marges PDF */
  margin: ExportMargin;
}

export const DEFAULT_TYPOGRAPHY: EbookExportTypography = {
  fontFamily: 'Calibri',
  headingSize: 14,
  bodySize: 12,
  justify: true,
  headingColor: '#232F3E',
  bodyColor: '#111111',
  italicQuotes: true,
  lineHeight: 1.5,
  margin: 'standard',
};

/** Presets rapides de couleurs */
export const COLOR_PRESETS = [
  { id: 'standard', label: 'Standard', headingColor: '#1F2937', bodyColor: '#111111' },
  { id: 'doux',     label: 'Doux (lecture longue)', headingColor: '#374151', bodyColor: '#4B5563' },
  { id: 'kdp',      label: 'KDP Pro (teal)', headingColor: '#008296', bodyColor: '#232F3E' },
] as const;

/** Presets globaux complets (police + tailles + couleurs + interligne + marges).
 *  Permet à l'abonné d'appliquer un style cohérent en 1 clic. */
export const TYPO_PRESETS: { id: string; label: string; description: string; values: Partial<EbookExportTypography> }[] = [
  {
    id: 'lecture-confort',
    label: '📖 Mode lecture confort',
    description: 'Texte plus grand, gris doux, marges larges — idéal KDP papier',
    values: { fontFamily: 'Georgia', headingSize: 16, bodySize: 14, justify: true, headingColor: '#374151', bodyColor: '#4B5563', italicQuotes: true, lineHeight: 1.5, margin: 'wide' },
  },
  {
    id: 'kdp-pro',
    label: '⭐ KDP Pro',
    description: 'Charte EbookStudio · teal + Calibri · prêt à publier',
    values: { fontFamily: 'Calibri', headingSize: 14, bodySize: 12, justify: true, headingColor: '#008296', bodyColor: '#232F3E', italicQuotes: true, lineHeight: 1.5, margin: 'standard' },
  },
  {
    id: 'roman-classique',
    label: '📚 Roman classique',
    description: 'Garamond · texte serré · style édition française',
    values: { fontFamily: 'Garamond', headingSize: 14, bodySize: 12, justify: true, headingColor: '#1F2937', bodyColor: '#111111', italicQuotes: true, lineHeight: 1.5, margin: 'standard' },
  },
  {
    id: 'compact',
    label: '⚡ Compact (économique)',
    description: 'Moins de pages — utile pour les guides courts',
    values: { fontFamily: 'Calibri', headingSize: 14, bodySize: 11, justify: true, headingColor: '#1F2937', bodyColor: '#111111', italicQuotes: true, lineHeight: 1.15, margin: 'tight' },
  },
  { id: 'duo-roman', label: '🖋️ Roman littéraire', description: 'Titres Cinzel · corps Garamond', values: { headingFontFamily: 'Cinzel', fontFamily: 'Garamond' } },
  { id: 'duo-thriller', label: '🔪 Thriller & polar', description: 'Titres Oswald · corps Georgia', values: { headingFontFamily: 'Oswald', fontFamily: 'Georgia' } },
  { id: 'duo-moderne', label: '✨ Moderne & épuré', description: 'Titres Montserrat · corps Calibri', values: { headingFontFamily: 'Montserrat', fontFamily: 'Calibri' } },
  { id: 'duo-prestige', label: '🏛️ Historique & prestige', description: 'Titres Playfair · corps Baskerville', values: { headingFontFamily: 'Playfair Display', fontFamily: 'Baskerville' } },
  { id: 'duo-western', label: '🐎 Western & aventure', description: 'Titres Rye · corps Book Antiqua', values: { headingFontFamily: 'Rye', fontFamily: 'Book Antiqua' } },
  { id: 'duo-jeunesse', label: '🧸 Jeunesse', description: 'Titres Fredoka · corps Verdana', values: { headingFontFamily: 'Fredoka', fontFamily: 'Verdana' } },
];

const TYPO_LS = 'ebook_export_typography_v1';

/** Charge les options typo depuis localStorage (utilisé par défaut par les exporters). */
export const loadTypography = (): EbookExportTypography => {
  if (typeof window === 'undefined') return DEFAULT_TYPOGRAPHY;
  try {
    const raw = localStorage.getItem(TYPO_LS);
    if (raw) return { ...DEFAULT_TYPOGRAPHY, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_TYPOGRAPHY;
};

export const saveTypography = (t: EbookExportTypography) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TYPO_LS, JSON.stringify(t));
};

const OPENROUTER_LS = 'openrouter_image_api_key';
export const getOpenRouterImageKey = (): string => {
  if (typeof window === 'undefined') return '';
  for (const k of [OPENROUTER_LS, 'cover_openrouter_key']) { const v = (localStorage.getItem(k) || '').trim(); if (v.startsWith('sk-or-')) return v; }
  return (localStorage.getItem(OPENROUTER_LS) || '').trim();
};
export const setOpenRouterImageKey = (k: string) => {
  if (typeof window === 'undefined') return;
  const v = (k || '').trim();
  if (v) localStorage.setItem(OPENROUTER_LS, v);
  else localStorage.removeItem(OPENROUTER_LS);
};

/** Clé Ideogram (BYOK) — rendu typographique professionnel des couvertures. */
const IDEOGRAM_LS = 'ideogram_api_key';
export const getIdeogramKey = (): string => {
  if (typeof window === 'undefined') return '';
  return (localStorage.getItem(IDEOGRAM_LS) || '').trim();
};
export const setIdeogramKey = (k: string) => {
  if (typeof window === 'undefined') return;
  const v = (k || '').trim();
  if (v) localStorage.setItem(IDEOGRAM_LS, v);
  else localStorage.removeItem(IDEOGRAM_LS);
};



/** Famille jsPDF acceptée (helvetica / times / courier).
 *  jsPDF ne supporte pas Calibri/Garamond → fallback raisonnable. */
export const pdfFontFor = (f: ExportFontFamily): 'helvetica' | 'times' | 'courier' => {
  return FONT_CHOICES.find(c => c.value === f)?.serif ? 'times' : 'helvetica';
};

/** Marges PDF en points (1 inch = 72pt) */
export const marginToPt = (m: ExportMargin): number => {
  switch (m) {
    case 'tight':    return 36; // 1.27cm ≈ 0.5"
    case 'wide':     return 64; // 2.26cm ≈ 0.9"
    case 'standard':
    default:         return 50; // 1.76cm
  }
};

/** Marges DOCX en DXA (1 inch = 1440 dxa) */
export const marginToDxa = (m: ExportMargin): number => {
  switch (m) {
    case 'tight':    return 1080; // 0.75"
    case 'wide':     return 1800; // 1.25"
    case 'standard':
    default:         return 1440; // 1.0"
  }
};

/** Convertit "#RRGGBB" en [r,g,b] */
export const hexToRgb = (hex: string): [number, number, number] => {
  const h = (hex || '').replace('#', '').padEnd(6, '0').slice(0, 6);
  const r = parseInt(h.slice(0, 2), 16) || 0;
  const g = parseInt(h.slice(2, 4), 16) || 0;
  const b = parseInt(h.slice(4, 6), 16) || 0;
  return [r, g, b];
};

/** Retourne les 6 hex sans '#', utile pour docx-js */
export const hexNoHash = (hex: string): string => (hex || '').replace('#', '').padEnd(6, '0').slice(0, 6).toUpperCase();

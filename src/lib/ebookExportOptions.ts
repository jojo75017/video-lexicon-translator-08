// Options de mise en page partagées entre les exports DOCX et PDF
// pour les Livres Pédagogiques (et autres exports rich-block).

export type ExportFontFamily = 'Calibri' | 'Georgia' | 'Garamond' | 'Helvetica';
export type ExportLineHeight = 1.15 | 1.5 | 2.0;
export type ExportMargin = 'tight' | 'standard' | 'wide';

export interface EbookExportTypography {
  /** Police principale (titres + corps) */
  fontFamily: ExportFontFamily;
  /** Taille des titres de chapitre (en pt) — 14 ou 16 */
  headingSize: 14 | 16;
  /** Taille du corps de texte (en pt) — 11, 12 ou 14 */
  bodySize: 11 | 12 | 14;
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
  switch (f) {
    case 'Georgia':
    case 'Garamond':
      return 'times';
    case 'Calibri':
    case 'Helvetica':
    default:
      return 'helvetica';
  }
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

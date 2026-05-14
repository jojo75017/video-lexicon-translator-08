// Options de mise en page partagées entre les exports DOCX et PDF
// pour les Livres Pédagogiques (et autres exports rich-block).

export type ExportFontFamily = 'Calibri' | 'Georgia' | 'Garamond' | 'Helvetica';

export interface EbookExportTypography {
  /** Police principale (titres + corps) */
  fontFamily: ExportFontFamily;
  /** Taille des titres de chapitre (en pt) — 14 ou 16 */
  headingSize: 14 | 16;
  /** Taille du corps de texte (en pt) — 11, 12 ou 14 */
  bodySize: 11 | 12 | 14;
  /** Justifie le corps de texte (sinon aligné à gauche) */
  justify: boolean;
}

export const DEFAULT_TYPOGRAPHY: EbookExportTypography = {
  fontFamily: 'Calibri',
  headingSize: 14,
  bodySize: 12,
  justify: true,
};

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

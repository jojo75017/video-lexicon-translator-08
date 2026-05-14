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

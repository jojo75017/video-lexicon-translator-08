/**
 * Formats de couverture Cover Studio Pro V3
 * Toutes les dimensions sont exprimées en pixels @ 300 DPI (print-ready).
 * Bleed KDP standard : 3 mm ≈ 36 px.
 */

export type CoverFormatId = 'ebook-kindle' | 'broche-wrap' | 'kids-square' | 'hardcover';

export interface CoverFormat {
  id: CoverFormatId;
  label: string;
  description: string;
  category: 'ebook' | 'print';
  /** Dimensions du canvas (px @ 300 DPI) */
  width: number;
  height: number;
  bleed: number;
  /** Zones de mise en page (wrap uniquement) */
  zones?: {
    back: { x: number; y: number; w: number; h: number };
    spine: { x: number; y: number; w: number; h: number };
    front: { x: number; y: number; w: number; h: number };
  };
  /** Nombre de pages requis pour calculer la tranche */
  requiresPageCount?: boolean;
  /** Épaisseur papier KDP blanc 60# : 0.002252" par page (US letter) */
  spinePerPageInch?: number;
  displayCm?: string;
}

/** Calcule la largeur de tranche (px @ 300 DPI) pour une couverture broché KDP */
export function computeSpineWidth(pageCount: number): number {
  // Papier blanc KDP : 0.002252" par page, minimum 24 pages
  const pages = Math.max(24, pageCount);
  const inches = pages * 0.002252;
  return Math.round(inches * 300); // → pixels @ 300 DPI
}

/** Génère les dimensions et zones pour un wrap KDP 6x9" */
export function computeWrapFormat(pageCount: number, trimWidthIn = 6, trimHeightIn = 9, bleedIn = 0.125): {
  width: number;
  height: number;
  bleed: number;
  spineWidth: number;
  zones: NonNullable<CoverFormat['zones']>;
} {
  const dpi = 300;
  const spineWidth = computeSpineWidth(pageCount);
  const trimW = Math.round(trimWidthIn * dpi);
  const trimH = Math.round(trimHeightIn * dpi);
  const bleed = Math.round(bleedIn * dpi);

  const totalWidth = trimW * 2 + spineWidth + bleed * 2;
  const totalHeight = trimH + bleed * 2;

  return {
    width: totalWidth,
    height: totalHeight,
    bleed,
    spineWidth,
    zones: {
      back: { x: bleed, y: bleed, w: trimW, h: trimH },
      spine: { x: bleed + trimW, y: bleed, w: spineWidth, h: trimH },
      front: { x: bleed + trimW + spineWidth, y: bleed, w: trimW, h: trimH },
    },
  };
}

export const COVER_FORMATS: Record<CoverFormatId, CoverFormat> = {
  'ebook-kindle': {
    id: 'ebook-kindle',
    label: 'Ebook Kindle',
    description: 'Format standard KDP Kindle • 1600×2560 px • ratio 1.6:1',
    category: 'ebook',
    width: 1600,
    height: 2560,
    bleed: 0,
    displayCm: '13,5 × 21,6 cm équiv.',
  },
  'broche-wrap': {
    id: 'broche-wrap',
    label: 'Broché KDP (wrap complet)',
    description: 'Couverture broché 6×9" avec dos, tranche et front • bleed 3 mm',
    category: 'print',
    width: 3900,
    height: 2775,
    bleed: 38,
    requiresPageCount: true,
    spinePerPageInch: 0.002252,
    displayCm: '15,24 × 22,86 cm par face',
  },
  'kids-square': {
    id: 'kids-square',
    label: 'Livre carré Kids 21,59 cm',
    description: 'Format carré KDP livre illustré • 21,59×21,59 cm @ 300 DPI',
    category: 'print',
    width: 2550,
    height: 2550,
    bleed: 38,
    displayCm: '21,59 × 21,59 cm',
  },
  hardcover: {
    id: 'hardcover',
    label: 'Hardcover KDP',
    description: 'Couverture rigide grand format • jaquette avec rabats • 6×9"',
    category: 'print',
    width: 4200,
    height: 2775,
    bleed: 38,
    requiresPageCount: true,
    spinePerPageInch: 0.002252,
    displayCm: '15,24 × 22,86 cm par face + rabats',
  },
};

export const COVER_FORMAT_LIST = Object.values(COVER_FORMATS);

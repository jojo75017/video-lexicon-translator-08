/**
 * Étape 4B — moteur de calcul et configuration KDP pour les livres BROCHÉS.
 *
 * Source de vérité = les POUCES. Les pixels ne servent qu'à l'affichage et au
 * futur rendu 300 DPI. Aucun recalcul de pouces depuis des pixels arrondis.
 *
 * Règles Amazon KDP vérifiées le 03/09/2026 :
 *  - https://kdp.amazon.com/en_US/help/topic/G201953020 (formats de coupe)
 *  - https://kdp.amazon.com/en_US/help/topic/G201834180 (dimensions de couverture)
 *  - https://kdp.amazon.com/en_US/help/topic/G201857950 (épaisseur du dos / papier)
 *
 * Périmètre : calculs + validation uniquement. Aucun dos éditable, aucune 4ᵉ de
 * couverture, aucun export, aucun ISBN, aucun code-barres réel, aucun appel IA.
 */

export const KDP_RULES_VERSION = '2026-09-03' as const;
export const KDP_CONFIG_VERSION = 1 as const;

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type InkType = 'bw' | 'standard-color' | 'premium-color';
export type PaperType = 'white' | 'cream' | 'groundwood';
export type CoverFinish = 'matte' | 'glossy';
export type ReadingDirection = 'ltr';

export interface KdpPaperbackConfig {
  version: typeof KDP_CONFIG_VERSION;
  rulesVersion: string;
  /** Identifiant de format de coupe, ou 'custom'. */
  trimId: string;
  /** Utilisés uniquement si trimId === 'custom'. */
  customTrimWidthIn?: number;
  customTrimHeightIn?: number;
  pageCount: number;
  ink: InkType;
  paper: PaperType;
  finish: CoverFinish;
  readingDirection: ReadingDirection;
}

export interface KdpTrimSize {
  id: string;
  widthIn: number;
  heightIn: number;
  label: string;
}

/* ------------------------------------------------------------------ */
/* Formats de coupe standard KDP (pouces)                             */
/* ------------------------------------------------------------------ */

export const KDP_TRIM_SIZES: KdpTrimSize[] = [
  { id: '5x8', widthIn: 5, heightIn: 8, label: '5 × 8 po' },
  { id: '5.06x7.81', widthIn: 5.06, heightIn: 7.81, label: '5,06 × 7,81 po' },
  { id: '5.25x8', widthIn: 5.25, heightIn: 8, label: '5,25 × 8 po' },
  { id: '5.5x8.5', widthIn: 5.5, heightIn: 8.5, label: '5,5 × 8,5 po' },
  { id: '6x9', widthIn: 6, heightIn: 9, label: '6 × 9 po (le plus courant)' },
  { id: '6.14x9.21', widthIn: 6.14, heightIn: 9.21, label: '6,14 × 9,21 po' },
  { id: '6.69x9.61', widthIn: 6.69, heightIn: 9.61, label: '6,69 × 9,61 po' },
  { id: '7x10', widthIn: 7, heightIn: 10, label: '7 × 10 po' },
  { id: '7.44x9.69', widthIn: 7.44, heightIn: 9.69, label: '7,44 × 9,69 po' },
  { id: '7.5x9.25', widthIn: 7.5, heightIn: 9.25, label: '7,5 × 9,25 po' },
  { id: '8x10', widthIn: 8, heightIn: 10, label: '8 × 10 po' },
  { id: '8.25x6', widthIn: 8.25, heightIn: 6, label: '8,25 × 6 po' },
  { id: '8.25x8.25', widthIn: 8.25, heightIn: 8.25, label: '8,25 × 8,25 po' },
  { id: '8.5x8.5', widthIn: 8.5, heightIn: 8.5, label: '8,5 × 8,5 po' },
  { id: '8.5x11', widthIn: 8.5, heightIn: 11, label: '8,5 × 11 po' },
  { id: '8.27x11.69', widthIn: 8.27, heightIn: 11.69, label: '8,27 × 11,69 po (A4)' },
];

/** Bornes du format personnalisé accepté par KDP (pouces). */
export const KDP_CUSTOM_TRIM_LIMITS = {
  minWidthIn: 4,
  maxWidthIn: 8.5,
  minHeightIn: 6,
  maxHeightIn: 11.69,
} as const;

/** Fond perdu ajouté sur chaque bord extérieur de la couverture complète. */
export const KDP_BLEED_IN = 0.125;
/** Marge de sécurité conseillée pour tout élément important. */
export const KDP_SAFETY_MARGIN_IN = 0.25;
/** Zone réservée au code-barres sur la quatrième de couverture. */
export const KDP_BARCODE_ZONE_IN = { widthIn: 2, heightIn: 1.2, marginIn: 0.25 } as const;
/** Le texte sur le dos n'est autorisé qu'à partir de ce nombre de pages. */
export const KDP_SPINE_TEXT_MIN_PAGES = 80;

/* ------------------------------------------------------------------ */
/* Combinaisons encre / papier autorisées + limites de pages          */
/* ------------------------------------------------------------------ */

export interface InkPaperCombination {
  ink: InkType;
  paper: PaperType;
  /** Multiplicateur officiel d'épaisseur du dos (pouces par page). */
  thicknessPerPageIn: number;
  minPages: number;
  maxPages: number;
}

export const KDP_INK_PAPER_COMBINATIONS: InkPaperCombination[] = [
  { ink: 'bw', paper: 'white', thicknessPerPageIn: 0.002252, minPages: 24, maxPages: 828 },
  { ink: 'bw', paper: 'cream', thicknessPerPageIn: 0.0025, minPages: 24, maxPages: 776 },
  { ink: 'bw', paper: 'groundwood', thicknessPerPageIn: 0.00235, minPages: 24, maxPages: 828 },
  {
    ink: 'standard-color',
    paper: 'white',
    thicknessPerPageIn: 0.002252,
    minPages: 72,
    maxPages: 600,
  },
  {
    ink: 'premium-color',
    paper: 'white',
    thicknessPerPageIn: 0.002347,
    minPages: 24,
    maxPages: 828,
  },
];

export const INK_LABEL: Record<InkType, string> = {
  bw: 'Noir et blanc',
  'standard-color': 'Couleur standard',
  'premium-color': 'Couleur premium',
};

export const PAPER_LABEL: Record<PaperType, string> = {
  white: 'Papier blanc',
  cream: 'Papier crème',
  groundwood: 'Papier groundwood',
};

export const FINISH_LABEL: Record<CoverFinish, string> = {
  matte: 'Finition mate',
  glossy: 'Finition brillante',
};

export const findCombination = (
  ink: InkType,
  paper: PaperType,
): InkPaperCombination | undefined =>
  KDP_INK_PAPER_COMBINATIONS.find((c) => c.ink === ink && c.paper === paper);

export const allowedPapersFor = (ink: InkType): PaperType[] =>
  KDP_INK_PAPER_COMBINATIONS.filter((c) => c.ink === ink).map((c) => c.paper);

/* ------------------------------------------------------------------ */
/* Configuration par défaut                                           */
/* ------------------------------------------------------------------ */

export function defaultPaperbackConfig(pageCount = 120): KdpPaperbackConfig {
  return {
    version: KDP_CONFIG_VERSION,
    rulesVersion: KDP_RULES_VERSION,
    trimId: '6x9',
    pageCount,
    ink: 'bw',
    paper: 'white',
    finish: 'matte',
    readingDirection: 'ltr',
  };
}

/** Relecture défensive d'une configuration venant de la base. */
export function parsePaperbackConfig(
  raw: unknown,
  fallbackPageCount = 120,
): KdpPaperbackConfig {
  const base = defaultPaperbackConfig(fallbackPageCount);
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Record<string, unknown>;

  const num = (v: unknown, fb: number) =>
    typeof v === 'number' && Number.isFinite(v) ? v : fb;

  const ink = (['bw', 'standard-color', 'premium-color'] as InkType[]).includes(o.ink as InkType)
    ? (o.ink as InkType)
    : base.ink;
  const paper = (['white', 'cream', 'groundwood'] as PaperType[]).includes(o.paper as PaperType)
    ? (o.paper as PaperType)
    : base.paper;

  return {
    version: KDP_CONFIG_VERSION,
    rulesVersion: typeof o.rulesVersion === 'string' ? o.rulesVersion : KDP_RULES_VERSION,
    trimId: typeof o.trimId === 'string' ? o.trimId : base.trimId,
    customTrimWidthIn:
      typeof o.customTrimWidthIn === 'number' ? o.customTrimWidthIn : undefined,
    customTrimHeightIn:
      typeof o.customTrimHeightIn === 'number' ? o.customTrimHeightIn : undefined,
    pageCount: Math.round(num(o.pageCount, base.pageCount)),
    ink,
    paper,
    finish: o.finish === 'glossy' ? 'glossy' : 'matte',
    readingDirection: 'ltr',
  };
}

/* ------------------------------------------------------------------ */
/* Géométrie calculée                                                 */
/* ------------------------------------------------------------------ */

export interface KdpZoneIn {
  xIn: number;
  widthIn: number;
}

export interface KdpPaperbackGeometry {
  rulesVersion: string;
  trimWidthIn: number;
  trimHeightIn: number;
  /** pages × multiplicateur officiel, sans arrondi. */
  spineWidthIn: number;
  fullWidthIn: number;
  fullHeightIn: number;
  bleedIn: number;
  safetyMarginIn: number;
  /** Position horizontale des zones dans le fichier complet (pouces). */
  zones: { back: KdpZoneIn; spine: KdpZoneIn; front: KdpZoneIn };
  barcodeZone: { xIn: number; yIn: number; widthIn: number; heightIn: number };
  spineTextAllowed: boolean;
  thicknessPerPageIn: number;
  /** Indicatif uniquement (affichage / futur rendu). */
  px300: { fullWidth: number; fullHeight: number; spineWidth: number };
  mm: { fullWidth: number; fullHeight: number; spineWidth: number };
}

export interface KdpValidationIssue {
  field: 'trim' | 'pages' | 'inkPaper';
  message: string;
}

export interface KdpPaperbackResult {
  valid: boolean;
  issues: KdpValidationIssue[];
  geometry: KdpPaperbackGeometry | null;
}

const inToMm = (inches: number) => inches * 25.4;
const inToPx300 = (inches: number) => Math.round(inches * 300);

export function resolveTrim(config: KdpPaperbackConfig): { widthIn: number; heightIn: number } | null {
  if (config.trimId === 'custom') {
    const w = config.customTrimWidthIn;
    const h = config.customTrimHeightIn;
    if (typeof w !== 'number' || typeof h !== 'number') return null;
    return { widthIn: w, heightIn: h };
  }
  const trim = KDP_TRIM_SIZES.find((t) => t.id === config.trimId);
  return trim ? { widthIn: trim.widthIn, heightIn: trim.heightIn } : null;
}

/**
 * Calcule la géométrie complète d'une couverture brochée KDP.
 * Formules officielles :
 *   dos = pages × multiplicateur(encre, papier)
 *   largeur = 0,125 + première + dos + quatrième + 0,125
 *   hauteur = 0,125 + hauteur finie + 0,125
 */
export function computePaperbackGeometry(config: KdpPaperbackConfig): KdpPaperbackResult {
  const issues: KdpValidationIssue[] = [];
  const combo = findCombination(config.ink, config.paper);
  const trim = resolveTrim(config);

  if (!combo) {
    issues.push({
      field: 'inkPaper',
      message: `Combinaison non autorisée par KDP : ${INK_LABEL[config.ink]} + ${PAPER_LABEL[config.paper]}.`,
    });
  }

  if (!trim) {
    issues.push({
      field: 'trim',
      message: 'Format de coupe manquant ou invalide.',
    });
  } else if (config.trimId === 'custom') {
    const L = KDP_CUSTOM_TRIM_LIMITS;
    if (trim.widthIn < L.minWidthIn || trim.widthIn > L.maxWidthIn) {
      issues.push({
        field: 'trim',
        message: `Largeur personnalisée hors limites KDP (${L.minWidthIn} à ${L.maxWidthIn} po).`,
      });
    }
    if (trim.heightIn < L.minHeightIn || trim.heightIn > L.maxHeightIn) {
      issues.push({
        field: 'trim',
        message: `Hauteur personnalisée hors limites KDP (${L.minHeightIn} à ${L.maxHeightIn} po).`,
      });
    }
  }

  if (!Number.isInteger(config.pageCount) || config.pageCount <= 0) {
    issues.push({ field: 'pages', message: 'Le nombre de pages doit être un entier positif.' });
  } else if (combo) {
    if (config.pageCount < combo.minPages) {
      issues.push({
        field: 'pages',
        message: `Minimum ${combo.minPages} pages pour ${INK_LABEL[config.ink]} + ${PAPER_LABEL[config.paper]}.`,
      });
    }
    if (config.pageCount > combo.maxPages) {
      issues.push({
        field: 'pages',
        message: `Maximum ${combo.maxPages} pages pour ${INK_LABEL[config.ink]} + ${PAPER_LABEL[config.paper]}.`,
      });
    }
  }

  if (issues.length || !combo || !trim) {
    return { valid: false, issues, geometry: null };
  }

  const spineWidthIn = config.pageCount * combo.thicknessPerPageIn;
  const fullWidthIn = KDP_BLEED_IN + trim.widthIn + spineWidthIn + trim.widthIn + KDP_BLEED_IN;
  const fullHeightIn = KDP_BLEED_IN + trim.heightIn + KDP_BLEED_IN;

  const backX = KDP_BLEED_IN;
  const spineX = backX + trim.widthIn;
  const frontX = spineX + spineWidthIn;

  return {
    valid: true,
    issues: [],
    geometry: {
      rulesVersion: KDP_RULES_VERSION,
      trimWidthIn: trim.widthIn,
      trimHeightIn: trim.heightIn,
      spineWidthIn,
      fullWidthIn,
      fullHeightIn,
      bleedIn: KDP_BLEED_IN,
      safetyMarginIn: KDP_SAFETY_MARGIN_IN,
      zones: {
        back: { xIn: backX, widthIn: trim.widthIn },
        spine: { xIn: spineX, widthIn: spineWidthIn },
        front: { xIn: frontX, widthIn: trim.widthIn },
      },
      barcodeZone: {
        xIn: backX + trim.widthIn - KDP_BARCODE_ZONE_IN.marginIn - KDP_BARCODE_ZONE_IN.widthIn,
        yIn:
          fullHeightIn - KDP_BLEED_IN - KDP_BARCODE_ZONE_IN.marginIn - KDP_BARCODE_ZONE_IN.heightIn,
        widthIn: KDP_BARCODE_ZONE_IN.widthIn,
        heightIn: KDP_BARCODE_ZONE_IN.heightIn,
      },
      spineTextAllowed: config.pageCount >= KDP_SPINE_TEXT_MIN_PAGES,
      thicknessPerPageIn: combo.thicknessPerPageIn,
      px300: {
        fullWidth: inToPx300(fullWidthIn),
        fullHeight: inToPx300(fullHeightIn),
        spineWidth: inToPx300(spineWidthIn),
      },
      mm: {
        fullWidth: inToMm(fullWidthIn),
        fullHeight: inToMm(fullHeightIn),
        spineWidth: inToMm(spineWidthIn),
      },
    },
  };
}

/** Formatage français court des pouces (précision conservée en interne). */
export const formatIn = (value: number, digits = 5) =>
  `${value.toFixed(digits).replace(/0+$/, '').replace(/\.$/, '').replace('.', ',')} po`;

export const formatMm = (value: number) => `${value.toFixed(1).replace('.', ',')} mm`;

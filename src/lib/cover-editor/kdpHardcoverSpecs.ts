/**
 * Géométrie des couvertures RELIÉES (hardcover / case laminate) KDP.
 *
 * Le moteur broché (`kdpPaperbackSpecs.ts`) reste la référence pour le broché ;
 * ce module produit exactement la même structure de géométrie afin que
 * l'éditeur de couverture complète et les exports fonctionnent sans changement.
 *
 * Particularités du relié KDP :
 *  - formats de coupe limités ;
 *  - 75 à 550 pages ;
 *  - épaisseur de dos donnée par paliers (carton), pas par page ;
 *  - retour de couvrure (« wrap ») de 0,625 po sur les bords extérieurs ;
 *  - charnière (« hinge ») de 0,55 po de chaque côté du dos.
 *
 * Aucun calcul broché existant n'est modifié.
 */
import {
  KDP_BARCODE_ZONE_IN,
  KDP_RULES_VERSION,
  KDP_SAFETY_MARGIN_IN,
  KDP_SPINE_TEXT_MIN_PAGES,
  KDP_TRIM_SIZES,
  computePaperbackGeometry,
  findCombination,
  resolveTrim,
  type KdpPaperbackConfig,
  type KdpPaperbackResult,
  type KdpValidationIssue,
} from '@/lib/cover-editor/kdpPaperbackSpecs';
import type { CoverType } from '@/lib/coverProjects';

/** Retour de couvrure sur chaque bord extérieur (haut, bas, gouttières). */
export const HARDCOVER_WRAP_IN = 0.625;
/** Charnière de chaque côté du dos (pli du carton). */
export const HARDCOVER_HINGE_IN = 0.55;
/** Pages acceptées par KDP pour le relié. */
export const HARDCOVER_MIN_PAGES = 75;
export const HARDCOVER_MAX_PAGES = 550;

/** Formats de coupe autorisés pour le relié KDP. */
export const HARDCOVER_TRIM_IDS = ['5.5x8.5', '6x9', '6.14x9.21', '7x10', '8.25x11'] as const;

export const HARDCOVER_TRIM_SIZES = KDP_TRIM_SIZES.filter((t) =>
  (HARDCOVER_TRIM_IDS as readonly string[]).includes(t.id),
);

/** Paliers officiels d'épaisseur de dos relié (pouces). */
const HARDCOVER_SPINE_STEPS: { maxPages: number; spineIn: number }[] = [
  { maxPages: 108, spineIn: 0.25 },
  { maxPages: 168, spineIn: 0.5 },
  { maxPages: 208, spineIn: 0.625 },
  { maxPages: 328, spineIn: 0.75 },
  { maxPages: 448, spineIn: 0.875 },
  { maxPages: 550, spineIn: 1 },
];

export function hardcoverSpineWidthIn(pageCount: number): number {
  const step = HARDCOVER_SPINE_STEPS.find((s) => pageCount <= s.maxPages);
  return step ? step.spineIn : 1;
}

export function defaultHardcoverConfig(pageCount = 150): KdpPaperbackConfig {
  const pages = Math.min(
    HARDCOVER_MAX_PAGES,
    Math.max(HARDCOVER_MIN_PAGES, Math.round(pageCount) || HARDCOVER_MIN_PAGES),
  );
  return {
    version: 1,
    rulesVersion: KDP_RULES_VERSION,
    trimId: '6x9',
    pageCount: pages,
    ink: 'bw',
    paper: 'white',
    finish: 'matte',
    readingDirection: 'ltr',
  };
}

/**
 * Géométrie complète d'une couverture reliée.
 * largeur = wrap + quatrième + charnière + dos + charnière + première + wrap
 * hauteur = wrap + hauteur finie + wrap
 */
export function computeHardcoverGeometry(config: KdpPaperbackConfig): KdpPaperbackResult {
  const issues: KdpValidationIssue[] = [];
  const trim = resolveTrim(config);
  const combo = findCombination(config.ink, config.paper);

  if (!trim) {
    issues.push({ field: 'trim', message: 'Format de coupe manquant ou invalide.' });
  } else if (!(HARDCOVER_TRIM_IDS as readonly string[]).includes(config.trimId)) {
    issues.push({
      field: 'trim',
      message:
        'Ce format n’existe pas en relié chez KDP. Choisissez 5,5 × 8,5 · 6 × 9 · 6,14 × 9,21 · 7 × 10 ou 8,25 × 11 po.',
    });
  }

  if (!combo) {
    issues.push({ field: 'inkPaper', message: 'Combinaison encre / papier non autorisée par KDP.' });
  }

  if (!Number.isInteger(config.pageCount) || config.pageCount < HARDCOVER_MIN_PAGES) {
    issues.push({
      field: 'pages',
      message: `Un livre relié demande au moins ${HARDCOVER_MIN_PAGES} pages.`,
    });
  } else if (config.pageCount > HARDCOVER_MAX_PAGES) {
    issues.push({
      field: 'pages',
      message: `Un livre relié accepte au maximum ${HARDCOVER_MAX_PAGES} pages.`,
    });
  }

  if (issues.length || !trim || !combo) return { valid: false, issues, geometry: null };

  const boardSpineIn = hardcoverSpineWidthIn(config.pageCount);
  // Le dos visible dans l'éditeur inclut les deux charnières : elles font partie
  // du fichier de couverture et ne doivent recevoir aucun texte important.
  const spineWidthIn = boardSpineIn + HARDCOVER_HINGE_IN * 2;
  const fullWidthIn = HARDCOVER_WRAP_IN * 2 + trim.widthIn * 2 + spineWidthIn;
  const fullHeightIn = HARDCOVER_WRAP_IN * 2 + trim.heightIn;

  const backX = HARDCOVER_WRAP_IN;
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
      bleedIn: HARDCOVER_WRAP_IN,
      safetyMarginIn: KDP_SAFETY_MARGIN_IN,
      zones: {
        back: { xIn: backX, widthIn: trim.widthIn },
        spine: { xIn: spineX, widthIn: spineWidthIn },
        front: { xIn: frontX, widthIn: trim.widthIn },
      },
      barcodeZone: {
        xIn: backX + trim.widthIn - KDP_BARCODE_ZONE_IN.marginIn - KDP_BARCODE_ZONE_IN.widthIn,
        yIn:
          fullHeightIn -
          HARDCOVER_WRAP_IN -
          KDP_BARCODE_ZONE_IN.marginIn -
          KDP_BARCODE_ZONE_IN.heightIn,
        widthIn: KDP_BARCODE_ZONE_IN.widthIn,
        heightIn: KDP_BARCODE_ZONE_IN.heightIn,
      },
      spineTextAllowed: config.pageCount >= KDP_SPINE_TEXT_MIN_PAGES,
      thicknessPerPageIn: combo.thicknessPerPageIn,
      px300: {
        fullWidth: Math.round(fullWidthIn * 300),
        fullHeight: Math.round(fullHeightIn * 300),
        spineWidth: Math.round(spineWidthIn * 300),
      },
      mm: {
        fullWidth: fullWidthIn * 25.4,
        fullHeight: fullHeightIn * 25.4,
        spineWidth: spineWidthIn * 25.4,
      },
    },
  };
}

/**
 * Point d'entrée unique pour l'éditeur de couverture complète :
 * broché = moteur 4B inchangé, relié = moteur ci-dessus.
 */
export function computeCoverGeometry(
  config: KdpPaperbackConfig,
  coverType: CoverType,
): KdpPaperbackResult {
  return coverType === 'hardcover'
    ? computeHardcoverGeometry(config)
    : computePaperbackGeometry(config);
}

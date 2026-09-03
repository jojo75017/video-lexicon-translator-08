/**
 * Étape 4C — modèle de composition COMPLÈTE pour les couvertures brochées KDP.
 *
 * `version: 2`, `documentType: 'paperback_wrap'`.
 *
 * Principes défensifs :
 *  - la géométrie physique vient EXCLUSIVEMENT de `computePaperbackGeometry`
 *    (étape 4B). Rien n'est recalculé ici ;
 *  - aucun élément n'est stocké en coordonnées absolues sur la couverture
 *    complète : chaque élément appartient à une zone (`front` | `spine` | `back`)
 *    et ses positions sont NORMALISÉES (0 → 1) dans cette zone. Changer le
 *    nombre de pages modifie donc la largeur du dos sans déplacer ni déformer
 *    la première ni la quatrième ;
 *  - les tailles de police sont exprimées en POUCES (source de vérité physique),
 *    ce qui permet d'appliquer la règle KDP des 7 points minimum ;
 *  - aucune URL (signée ou non) et aucun token ne sont jamais persistés :
 *    seul le chemin privé stable de l'illustration est conservé ;
 *  - aucun appel IA, aucun crédit consommé, aucun export.
 */

import {
  computePaperbackGeometry,
  type KdpPaperbackConfig,
  type KdpPaperbackGeometry,
} from './kdpPaperbackSpecs';
import {
  getFrontCanvasSize,
  type FrontComposition,
  type TextAlign,
} from './frontComposition';

export const WRAP_COMPOSITION_VERSION = 2 as const;
export const WRAP_DOCUMENT_TYPE = 'paperback_wrap' as const;

/** Marge minimale imposée de chaque côté du dos (pouces). */
export const SPINE_SIDE_MARGIN_IN = 0.0625;
/** Police minimale exigée par KDP sur le dos : 7 points. */
export const MIN_SPINE_FONT_PT = 7;
export const MIN_SPINE_FONT_IN = MIN_SPINE_FONT_PT / 72;

export const ptToIn = (pt: number) => pt / 72;
export const inToPt = (inches: number) => inches * 72;

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type WrapZone = 'front' | 'spine' | 'back';

export type WrapRole =
  | 'title'
  | 'subtitle'
  | 'author'
  | 'spine-title'
  | 'spine-author'
  | 'back-blurb'
  | 'back-about'
  | 'back-extra';

export interface WrapTextElement {
  id: string;
  zone: WrapZone;
  role: WrapRole;
  text: string;
  /** Position normalisée (0 → 1) DANS la zone. */
  nx: number;
  ny: number;
  /** Largeur du bloc normalisée dans la zone (longueur pour le dos). */
  nWidth: number;
  /** Taille physique de la police, en pouces. */
  fontSizeIn: number;
  fontFamily: string;
  color: string;
  align: TextAlign;
  bold: boolean;
  italic: boolean;
  lineHeight: number;
  hidden: boolean;
}

export type WrapBackgroundMode = 'full-color' | 'back-spine-color';

export interface WrapBackground {
  mode: WrapBackgroundMode;
  /** Couleur unie appliquée à toute la couverture (mode `full-color`). */
  fullColor: string;
  /** Couleurs distinctes quatrième / dos (mode `back-spine-color`). */
  backColor: string;
  spineColor: string;
}

export interface WrapComposition {
  version: typeof WRAP_COMPOSITION_VERSION;
  documentType: typeof WRAP_DOCUMENT_TYPE;
  /** Chemin privé stable du bucket `covers` — JAMAIS une URL. */
  illustrationPath: string | null;
  background: WrapBackground;
  elements: WrapTextElement[];
}

export const ROLE_LABEL_WRAP: Record<WrapRole, string> = {
  title: 'Titre',
  subtitle: 'Sous-titre',
  author: 'Nom de l’auteur',
  'spine-title': 'Dos — titre',
  'spine-author': 'Dos — auteur',
  'back-blurb': 'Résumé du livre',
  'back-about': 'À propos de l’auteur',
  'back-extra': 'Texte libre',
};

export const ZONE_LABEL: Record<WrapZone, string> = {
  back: 'Quatrième',
  spine: 'Dos',
  front: 'Première',
};

/** Rôles facultatifs (masquables / supprimables). */
export const OPTIONAL_ROLES: WrapRole[] = [
  'subtitle',
  'spine-title',
  'spine-author',
  'back-blurb',
  'back-about',
  'back-extra',
];

/* ------------------------------------------------------------------ */
/* Zones physiques (pouces) déduites de la géométrie 4B               */
/* ------------------------------------------------------------------ */

export interface ZoneBoxIn {
  xIn: number;
  yIn: number;
  widthIn: number;
  heightIn: number;
}

/**
 * Boîte de contenu d'une zone, exprimée en pouces sur la couverture complète.
 * Pour `front` et `back`, la boîte correspond au format fini (hors fond perdu) :
 * les positions normalisées restent donc stables quel que soit le nombre de pages.
 */
export function zoneBox(geometry: KdpPaperbackGeometry, zone: WrapZone): ZoneBoxIn {
  const z = geometry.zones[zone];
  return {
    xIn: z.xIn,
    yIn: geometry.bleedIn,
    widthIn: z.widthIn,
    heightIn: geometry.trimHeightIn,
  };
}

/** Largeur réellement utilisable pour du texte de dos (pouces). */
export const spineUsableWidthIn = (geometry: KdpPaperbackGeometry) =>
  Math.max(0, geometry.spineWidthIn - SPINE_SIDE_MARGIN_IN * 2);

/**
 * Le texte de dos est autorisé seulement si KDP l'autorise (pages) ET si la
 * largeur utilisable permet au moins 7 points. Aucune réduction automatique
 * sous 7 points n'est jamais effectuée.
 */
export function spineTextConform(geometry: KdpPaperbackGeometry): {
  allowed: boolean;
  reason: string | null;
  usableIn: number;
} {
  const usableIn = spineUsableWidthIn(geometry);
  if (!geometry.spineTextAllowed) {
    return {
      allowed: false,
      reason: 'Le texte de dos exige au moins 80 pages selon KDP.',
      usableIn,
    };
  }
  if (usableIn < MIN_SPINE_FONT_IN) {
    return { allowed: false, reason: 'Dos trop étroit pour un texte conforme', usableIn };
  }
  return { allowed: true, reason: null, usableIn };
}

/* ------------------------------------------------------------------ */
/* Création / valeurs par défaut                                      */
/* ------------------------------------------------------------------ */

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `w-${Math.random().toString(36).slice(2)}-${Date.now()}`;

const SERIF = 'Georgia, serif';
const SANS = 'Arial, Helvetica, sans-serif';

interface DefaultSpec {
  zone: WrapZone;
  nx: number;
  ny: number;
  nWidth: number;
  /** Taille exprimée en points typographiques pour rester lisible. */
  pt: number;
  fontFamily: string;
  color: string;
  align: TextAlign;
  bold: boolean;
  lineHeight: number;
}

const DEFAULTS: Record<WrapRole, DefaultSpec> = {
  title: {
    zone: 'front', nx: 0.1, ny: 0.1, nWidth: 0.8, pt: 48,
    fontFamily: SERIF, color: '#FFFFFF', align: 'center', bold: true, lineHeight: 1.15,
  },
  subtitle: {
    zone: 'front', nx: 0.1, ny: 0.31, nWidth: 0.8, pt: 22,
    fontFamily: SANS, color: '#FFFFFF', align: 'center', bold: false, lineHeight: 1.2,
  },
  author: {
    zone: 'front', nx: 0.1, ny: 0.85, nWidth: 0.8, pt: 24,
    fontFamily: SERIF, color: '#FFFFFF', align: 'center', bold: false, lineHeight: 1.2,
  },
  'spine-title': {
    zone: 'spine', nx: 0.5, ny: 0.35, nWidth: 0.5, pt: 12,
    fontFamily: SERIF, color: '#FFFFFF', align: 'center', bold: true, lineHeight: 1,
  },
  'spine-author': {
    zone: 'spine', nx: 0.5, ny: 0.78, nWidth: 0.3, pt: 10,
    fontFamily: SERIF, color: '#FFFFFF', align: 'center', bold: false, lineHeight: 1,
  },
  'back-blurb': {
    zone: 'back', nx: 0.1, ny: 0.12, nWidth: 0.8, pt: 11,
    fontFamily: SANS, color: '#FFFFFF', align: 'left', bold: false, lineHeight: 1.4,
  },
  'back-about': {
    zone: 'back', nx: 0.1, ny: 0.55, nWidth: 0.8, pt: 10,
    fontFamily: SANS, color: '#FFFFFF', align: 'left', bold: false, lineHeight: 1.4,
  },
  'back-extra': {
    zone: 'back', nx: 0.1, ny: 0.74, nWidth: 0.8, pt: 10,
    fontFamily: SANS, color: '#FFFFFF', align: 'left', bold: false, lineHeight: 1.4,
  },
};

const DEFAULT_TEXT: Record<WrapRole, string> = {
  title: 'Titre du livre',
  subtitle: 'Sous-titre',
  author: 'Nom de l’auteur',
  'spine-title': 'Titre du livre',
  'spine-author': 'Nom de l’auteur',
  'back-blurb':
    'Résumé du livre : présentez en quelques phrases la promesse, le problème résolu et ce que le lecteur va gagner.',
  'back-about': 'À propos de l’auteur : présentez votre parcours en deux ou trois phrases.',
  'back-extra': 'Texte libre facultatif.',
};

export function defaultElement(role: WrapRole, text?: string): WrapTextElement {
  const spec = DEFAULTS[role];
  return {
    id: newId(),
    zone: spec.zone,
    role,
    text: text ?? DEFAULT_TEXT[role],
    nx: spec.nx,
    ny: spec.ny,
    nWidth: spec.nWidth,
    fontSizeIn: ptToIn(spec.pt),
    fontFamily: spec.fontFamily,
    color: spec.color,
    align: spec.align,
    bold: spec.bold,
    italic: false,
    lineHeight: spec.lineHeight,
    hidden: false,
  };
}

export function defaultBackground(): WrapBackground {
  return {
    mode: 'back-spine-color',
    fullColor: '#111827',
    backColor: '#111827',
    spineColor: '#111827',
  };
}

export function createWrapComposition(params: {
  illustrationPath: string | null;
  bookTitle?: string | null;
  authorName?: string | null;
}): WrapComposition {
  const title = params.bookTitle?.trim() || DEFAULT_TEXT.title;
  return {
    version: WRAP_COMPOSITION_VERSION,
    documentType: WRAP_DOCUMENT_TYPE,
    illustrationPath: params.illustrationPath ?? null,
    background: defaultBackground(),
    elements: [
      defaultElement('title', title),
      defaultElement('subtitle'),
      defaultElement('author', params.authorName?.trim() || undefined),
      defaultElement('spine-title', title),
      defaultElement('spine-author', params.authorName?.trim() || undefined),
      defaultElement('back-blurb'),
      defaultElement('back-about'),
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Migration défensive version 1 → version 2                          */
/* ------------------------------------------------------------------ */

/**
 * Convertit une composition de PREMIÈRE `version: 1` (pixels absolus sur le
 * canevas de la première) en composition complète `version: 2`.
 *
 * La première doit rester VISUELLEMENT IDENTIQUE : les pixels sont divisés par
 * les dimensions du canevas d'origine, donc les proportions sont conservées.
 * Les projets eBook ne sont jamais touchés (cette fonction n'est appelée que
 * pour `cover_type = 'paperback'`).
 */
export function migrateFrontToWrap(
  front: FrontComposition,
  options: { formatId: string; trimWidthIn: number; bookTitle?: string | null },
): WrapComposition {
  const size =
    front.canvas && front.canvas.width > 0 && front.canvas.height > 0
      ? front.canvas
      : getFrontCanvasSize(options.formatId);

  const elements: WrapTextElement[] = front.layers.map((layer) => {
    const base = defaultElement(layer.role as WrapRole, layer.text);
    return {
      ...base,
      zone: 'front',
      nx: layer.x / size.width,
      ny: layer.y / size.height,
      nWidth: layer.width / size.width,
      // px → pouces : proportion de la largeur de la première × largeur finie.
      fontSizeIn: (layer.fontSize / size.width) * options.trimWidthIn,
      fontFamily: layer.fontFamily,
      color: layer.color,
      align: layer.align,
      bold: layer.bold,
      italic: layer.italic,
      lineHeight: layer.lineHeight,
      hidden: false,
    };
  });

  const title =
    front.layers.find((l) => l.role === 'title')?.text || options.bookTitle?.trim() || DEFAULT_TEXT.title;

  return {
    version: WRAP_COMPOSITION_VERSION,
    documentType: WRAP_DOCUMENT_TYPE,
    illustrationPath: front.illustrationPath ?? null,
    background: defaultBackground(),
    elements: [
      ...(elements.length ? elements : createWrapComposition({ illustrationPath: null }).elements.filter((e) => e.zone === 'front')),
      defaultElement('spine-title', title),
      defaultElement('spine-author'),
      defaultElement('back-blurb'),
      defaultElement('back-about'),
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Lecture / écriture défensives                                      */
/* ------------------------------------------------------------------ */

const ROLES: WrapRole[] = [
  'title', 'subtitle', 'author',
  'spine-title', 'spine-author',
  'back-blurb', 'back-about', 'back-extra',
];
const ZONES: WrapZone[] = ['front', 'spine', 'back'];
const ALIGNS: TextAlign[] = ['left', 'center', 'right'];

const num = (v: unknown, fb: number) => (typeof v === 'number' && Number.isFinite(v) ? v : fb);
const clamp01 = (v: number) => Math.min(1.5, Math.max(-0.5, v));
const HEX = /^#[0-9a-f]{3,8}$/i;
const color = (v: unknown, fb: string) => (typeof v === 'string' && HEX.test(v) ? v : fb);

/** Interdit toute URL ou token dans les valeurs persistées. */
export const containsUrl = (value: string) =>
  /https?:\/\//i.test(value) || /token=/i.test(value) || /^data:/i.test(value);

export function isWrapComposition(raw: unknown): boolean {
  if (!raw || typeof raw !== 'object') return false;
  const o = raw as Record<string, unknown>;
  return o.version === WRAP_COMPOSITION_VERSION && o.documentType === WRAP_DOCUMENT_TYPE;
}

export function parseWrapComposition(
  raw: unknown,
  fallback: { illustrationPath: string | null; bookTitle?: string | null },
): WrapComposition {
  const fresh = createWrapComposition(fallback);
  if (!raw || typeof raw !== 'object') return fresh;
  const o = raw as Record<string, unknown>;

  const bgRaw = (o.background ?? {}) as Record<string, unknown>;
  const background: WrapBackground = {
    mode: bgRaw.mode === 'full-color' ? 'full-color' : 'back-spine-color',
    fullColor: color(bgRaw.fullColor, fresh.background.fullColor),
    backColor: color(bgRaw.backColor, fresh.background.backColor),
    spineColor: color(bgRaw.spineColor, fresh.background.spineColor),
  };

  const rawElements = Array.isArray(o.elements) ? o.elements : [];
  const elements: WrapTextElement[] = rawElements
    .filter((e): e is Record<string, unknown> => Boolean(e) && typeof e === 'object')
    .map((e) => {
      const role = ROLES.includes(e.role as WrapRole) ? (e.role as WrapRole) : 'title';
      const base = defaultElement(role);
      const zone = ZONES.includes(e.zone as WrapZone) ? (e.zone as WrapZone) : base.zone;
      const text = typeof e.text === 'string' ? e.text : base.text;
      return {
        ...base,
        id: typeof e.id === 'string' && e.id.length ? e.id : base.id,
        role,
        zone,
        text: containsUrl(text) ? '' : text,
        nx: clamp01(num(e.nx, base.nx)),
        ny: clamp01(num(e.ny, base.ny)),
        nWidth: Math.min(2, Math.max(0.02, num(e.nWidth, base.nWidth))),
        fontSizeIn: Math.min(6, Math.max(0.01, num(e.fontSizeIn, base.fontSizeIn))),
        fontFamily: typeof e.fontFamily === 'string' && e.fontFamily.length ? e.fontFamily : base.fontFamily,
        color: color(e.color, base.color),
        align: ALIGNS.includes(e.align as TextAlign) ? (e.align as TextAlign) : base.align,
        bold: Boolean(e.bold),
        italic: Boolean(e.italic),
        lineHeight: Math.min(3, Math.max(0.8, num(e.lineHeight, base.lineHeight))),
        hidden: Boolean(e.hidden),
      };
    });

  const illustrationPath =
    typeof o.illustrationPath === 'string' && !containsUrl(o.illustrationPath)
      ? o.illustrationPath
      : fallback.illustrationPath ?? null;

  return {
    version: WRAP_COMPOSITION_VERSION,
    documentType: WRAP_DOCUMENT_TYPE,
    illustrationPath,
    background,
    elements: elements.length ? elements : fresh.elements,
  };
}

/** Payload sérialisable : structure validée, aucune URL, aucun token. */
export function serializeWrapComposition(
  composition: WrapComposition,
  illustrationPath: string | null,
): WrapComposition {
  return {
    version: WRAP_COMPOSITION_VERSION,
    documentType: WRAP_DOCUMENT_TYPE,
    illustrationPath:
      illustrationPath && !containsUrl(illustrationPath) ? illustrationPath : null,
    background: { ...composition.background },
    elements: composition.elements.map((e) => ({
      ...e,
      text: containsUrl(e.text) ? '' : e.text,
    })),
  };
}

/** Contrôle final avant envoi : structure `version: 2` stricte et sans URL. */
export function validateWrapPayload(payload: unknown): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!isWrapComposition(payload)) {
    return { ok: false, errors: ['Structure attendue : version 2 / paperback_wrap.'] };
  }
  const o = payload as unknown as WrapComposition;
  if (o.illustrationPath !== null && typeof o.illustrationPath !== 'string') {
    errors.push('Chemin d’illustration invalide.');
  }
  if (o.illustrationPath && containsUrl(o.illustrationPath)) errors.push('URL interdite dans le chemin.');
  if (!Array.isArray(o.elements)) errors.push('Liste d’éléments manquante.');
  else {
    for (const e of o.elements) {
      if (!ROLES.includes(e.role)) errors.push(`Rôle inconnu : ${String(e.role)}`);
      if (!ZONES.includes(e.zone)) errors.push(`Zone inconnue : ${String(e.zone)}`);
      if (!Number.isFinite(e.nx) || !Number.isFinite(e.ny) || !Number.isFinite(e.nWidth)) {
        errors.push('Coordonnées normalisées invalides.');
      }
      if (!Number.isFinite(e.fontSizeIn) || e.fontSizeIn <= 0) errors.push('Taille de police invalide.');
      if (!HEX.test(e.color)) errors.push(`Couleur invalide : ${String(e.color)}`);
      if (typeof e.text !== 'string' || containsUrl(e.text)) errors.push('Texte invalide ou contenant une URL.');
    }
  }
  for (const key of ['fullColor', 'backColor', 'spineColor'] as const) {
    if (!HEX.test(o.background?.[key] ?? '')) errors.push(`Couleur de fond invalide (${key}).`);
  }
  if (JSON.stringify(o).match(/https?:\/\/|token=/i)) errors.push('URL ou token détecté dans la composition.');
  return { ok: errors.length === 0, errors };
}

/* ------------------------------------------------------------------ */
/* Recentrage des éléments de dos                                     */
/* ------------------------------------------------------------------ */

/**
 * Après un changement du nombre de pages, seuls les éléments du DOS sont
 * recentrés. Première et quatrième conservent leurs positions relatives.
 */
export function recenterSpineElements(composition: WrapComposition): WrapComposition {
  return {
    ...composition,
    elements: composition.elements.map((e) => (e.zone === 'spine' ? { ...e, nx: 0.5 } : e)),
  };
}

/**
 * Taille de police de dos par défaut : jamais sous 7 points, jamais plus large
 * que la zone réellement disponible. Utilisée uniquement à la création d'un
 * élément de dos, jamais pour corriger un choix explicite de l'abonné.
 */
export function fitSpineFontSize(
  geometry: KdpPaperbackGeometry,
  desiredIn: number,
): number {
  const usable = spineUsableWidthIn(geometry);
  if (usable < MIN_SPINE_FONT_IN) return MIN_SPINE_FONT_IN;
  return Math.max(MIN_SPINE_FONT_IN, Math.min(desiredIn, usable));
}

/** Applique `fitSpineFontSize` aux éléments de dos nouvellement créés. */
export function fitSpineElements(
  composition: WrapComposition,
  geometry: KdpPaperbackGeometry,
): WrapComposition {
  return {
    ...composition,
    elements: composition.elements.map((e) =>
      e.zone === 'spine' ? { ...e, fontSizeIn: fitSpineFontSize(geometry, e.fontSizeIn) } : e,
    ),
  };
}



/* ------------------------------------------------------------------ */
/* Avertissements de conformité (non bloquants)                        */
/* ------------------------------------------------------------------ */

export type WarningLevel = 'warning' | 'info';

export interface WrapWarning {
  id: string;
  level: WarningLevel;
  elementId?: string;
  message: string;
}

const relativeLuminance = (hex: string): number => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

export const contrastRatio = (a: string, b: string): number => {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
};

/** Boîte absolue en pouces d'un élément (utile pour les contrôles). */
export function elementBoxIn(
  element: WrapTextElement,
  geometry: KdpPaperbackGeometry,
): { xIn: number; yIn: number; widthIn: number; heightIn: number } {
  const box = zoneBox(geometry, element.zone);
  if (element.zone === 'spine') {
    const lengthIn = element.nWidth * box.heightIn;
    const centerX = box.xIn + element.nx * box.widthIn;
    const centerY = box.yIn + element.ny * box.heightIn;
    return {
      xIn: centerX - element.fontSizeIn / 2,
      yIn: centerY - lengthIn / 2,
      widthIn: element.fontSizeIn,
      heightIn: lengthIn,
    };
  }
  const widthIn = element.nWidth * box.widthIn;
  const lines = Math.max(1, element.text.split('\n').length);
  return {
    xIn: box.xIn + element.nx * box.widthIn,
    yIn: box.yIn + element.ny * box.heightIn,
    widthIn,
    heightIn: element.fontSizeIn * element.lineHeight * lines,
  };
}

const overlaps = (
  a: { xIn: number; yIn: number; widthIn: number; heightIn: number },
  b: { xIn: number; yIn: number; widthIn: number; heightIn: number },
) =>
  a.xIn < b.xIn + b.widthIn &&
  a.xIn + a.widthIn > b.xIn &&
  a.yIn < b.yIn + b.heightIn &&
  a.yIn + a.heightIn > b.yIn;

export function computeWrapWarnings(
  composition: WrapComposition,
  geometry: KdpPaperbackGeometry,
  illustration?: { width: number; height: number } | null,
): WrapWarning[] {
  const warnings: WrapWarning[] = [];
  const spine = spineTextConform(geometry);

  // Zone sûre commune (format fini réduit de la marge de sécurité).
  const safe = {
    xIn: geometry.bleedIn + geometry.safetyMarginIn,
    yIn: geometry.bleedIn + geometry.safetyMarginIn,
    rightIn: geometry.fullWidthIn - geometry.bleedIn - geometry.safetyMarginIn,
    bottomIn: geometry.fullHeightIn - geometry.bleedIn - geometry.safetyMarginIn,
  };

  for (const el of composition.elements) {
    if (el.hidden || !el.text.trim()) continue;
    const box = elementBoxIn(el, geometry);
    const label = ROLE_LABEL_WRAP[el.role];

    if (el.zone === 'spine') {
      if (!spine.allowed) {
        warnings.push({
          id: `${el.id}-spine-blocked`,
          level: 'warning',
          elementId: el.id,
          message: `${label} : ${spine.reason ?? 'Dos trop étroit pour un texte conforme'}.`,
        });
        continue;
      }
      if (el.fontSizeIn < MIN_SPINE_FONT_IN - 1e-9) {
        warnings.push({
          id: `${el.id}-min-pt`,
          level: 'warning',
          elementId: el.id,
          message: `${label} : police sous ${MIN_SPINE_FONT_PT} points, non conforme à KDP.`,
        });
      }
      if (el.fontSizeIn > spine.usableIn + 1e-9) {
        warnings.push({
          id: `${el.id}-spine-wide`,
          level: 'warning',
          elementId: el.id,
          message: `${label} : texte trop large pour le dos (maximum ${inToPt(spine.usableIn).toFixed(1)} pt avec ${SPINE_SIDE_MARGIN_IN} po de marge).`,
        });
      }
      continue;
    }

    // Zone sûre première / quatrième.
    if (
      box.xIn < safe.xIn - 1e-9 ||
      box.yIn < safe.yIn - 1e-9 ||
      box.xIn + box.widthIn > safe.rightIn + 1e-9 ||
      box.yIn + box.heightIn > safe.bottomIn + 1e-9
    ) {
      warnings.push({
        id: `${el.id}-safe`,
        level: 'warning',
        elementId: el.id,
        message: `${label} : dépasse la zone de sécurité de ${geometry.safetyMarginIn} po.`,
      });
    }

    // Réserve du code-barres (quatrième uniquement).
    if (el.zone === 'back' && overlaps(box, geometry.barcodeZone)) {
      warnings.push({
        id: `${el.id}-barcode`,
        level: 'warning',
        elementId: el.id,
        message: `${label} : chevauche la réserve du code-barres (2 × 1,2 po).`,
      });
    }

    // Contraste approximatif contre le fond de la zone.
    const bg =
      composition.background.mode === 'full-color'
        ? composition.background.fullColor
        : el.zone === 'back'
          ? composition.background.backColor
          : composition.background.fullColor;
    if (!(el.zone === 'front' && composition.illustrationPath)) {
      const ratio = contrastRatio(el.color, bg);
      if (ratio < 3) {
        warnings.push({
          id: `${el.id}-contrast`,
          level: 'warning',
          elementId: el.id,
          message: `${label} : contraste faible (${ratio.toFixed(1)}:1) sur ce fond.`,
        });
      }
    }
  }

  // Résolution de l'illustration pour la zone d'impression de la première.
  if (illustration && illustration.width > 0) {
    const neededWidthIn = geometry.trimWidthIn + geometry.bleedIn;
    const dpi = illustration.width / neededWidthIn;
    if (dpi < 300) {
      warnings.push({
        id: 'illustration-dpi',
        level: 'warning',
        message: `Illustration à ${Math.round(dpi)} DPI pour la première : KDP recommande 300 DPI.`,
      });
    }
  }

  if (!spine.allowed) {
    warnings.push({
      id: 'spine-disabled',
      level: 'info',
      message: spine.reason ?? 'Texte de dos indisponible.',
    });
  }

  return warnings;
}

/* ------------------------------------------------------------------ */
/* Géométrie prête à afficher                                         */
/* ------------------------------------------------------------------ */

export function geometryFor(config: KdpPaperbackConfig): KdpPaperbackGeometry | null {
  return computePaperbackGeometry(config).geometry;
}

/* ------------------------------------------------------------------ */
/* Miniature — PREMIÈRE de couverture uniquement                      */
/* ------------------------------------------------------------------ */

const wrapLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push('');
      continue;
    }
    let current = words[0];
    for (let i = 1; i < words.length; i += 1) {
      const candidate = `${current} ${words[i]}`;
      if (ctx.measureText(candidate).width <= maxWidth) current = candidate;
      else {
        lines.push(current);
        current = words[i];
      }
    }
    lines.push(current);
  }
  return lines;
};

/**
 * Miniature de bibliothèque : uniquement la PREMIÈRE de couverture, verticale,
 * sans aucun repère. Jamais l'image horizontale de la couverture complète.
 */
export async function renderWrapFrontThumbnail(
  composition: WrapComposition,
  geometry: KdpPaperbackGeometry,
  backgroundUrl: string | null,
  targetWidth = 500,
): Promise<Blob> {
  const ratio = geometry.trimHeightIn / geometry.trimWidthIn;
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = Math.round(targetWidth * ratio);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canevas indisponible dans ce navigateur.');

  const pxPerIn = canvas.width / geometry.trimWidthIn;

  ctx.fillStyle = composition.background.fullColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (backgroundUrl) {
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.crossOrigin = 'anonymous';
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('image'));
        el.src = backgroundUrl;
      });
      const cover = Math.max(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * cover;
      const h = img.height * cover;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    } catch {
      /* fond uni conservé */
    }
  }

  ctx.textBaseline = 'top';
  for (const el of composition.elements) {
    if (el.zone !== 'front' || el.hidden || !el.text.trim()) continue;
    const fontPx = el.fontSizeIn * pxPerIn;
    ctx.font = `${el.italic ? 'italic' : 'normal'} ${el.bold ? 700 : 400} ${fontPx}px ${el.fontFamily}`;
    ctx.fillStyle = el.color;
    ctx.textAlign = el.align === 'center' ? 'center' : el.align === 'right' ? 'right' : 'left';

    const boxX = el.nx * canvas.width;
    const boxWidth = el.nWidth * canvas.width;
    const anchorX =
      el.align === 'center' ? boxX + boxWidth / 2 : el.align === 'right' ? boxX + boxWidth : boxX;

    let y = el.ny * canvas.height;
    for (const line of wrapLines(ctx, el.text, boxWidth)) {
      ctx.fillText(line, anchorX, y);
      y += fontPx * el.lineHeight;
    }
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Miniature illisible.'))),
      'image/jpeg',
      0.85,
    );
  });
}

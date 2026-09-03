/**
 * Modèles professionnels de première de couverture (styleVersion 1).
 *
 * Un modèle ne change QUE la mise en page et les styles :
 * l'illustration, le titre, le sous-titre et le nom de l'auteur sont conservés.
 * Aucun appel IA, aucun crédit, aucune écriture en base ici.
 */
import {
  FRONT_COMPOSITION_VERSION,
  FRONT_STYLE_VERSION,
  type FrontComposition,
  type FrontOverlay,
  type FrontTextLayer,
  type TextRole,
} from '@/lib/cover-editor/frontComposition';

export type CoverTemplateId = 'roman-elegant' | 'thriller-cinema' | 'guide-moderne';

export interface CoverTemplate {
  id: CoverTemplateId;
  label: string;
  description: string;
  /** Aperçu approximatif de la composition (classes Tailwind du dégradé). */
  preview: {
    gradient: string;
    titleClass: string;
    subtitleClass: string;
    authorClass: string;
    bandClass?: string;
  };
}

export const COVER_TEMPLATES: CoverTemplate[] = [
  {
    id: 'roman-elegant',
    label: 'Roman élégant',
    description: 'Serif raffiné, titre dans le tiers supérieur, voile dégradé discret.',
    preview: {
      gradient: 'bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900',
      titleClass: 'font-serif text-[13px] leading-tight tracking-wide',
      subtitleClass: 'font-serif text-[8px] italic opacity-90',
      authorClass: 'font-serif text-[8px] tracking-[0.2em] uppercase',
    },
  },
  {
    id: 'thriller-cinema',
    label: 'Thriller cinématographique',
    description: 'Titre puissant, voile sombre, contour et ombre pour un contraste fort.',
    preview: {
      gradient: 'bg-gradient-to-b from-zinc-900 via-zinc-800 to-black',
      titleClass: 'font-sans font-black text-[13px] uppercase leading-none tracking-tight',
      subtitleClass: 'font-sans text-[7px] uppercase tracking-[0.3em] opacity-90',
      authorClass: 'font-sans font-bold text-[8px] uppercase tracking-[0.2em]',
      bandClass: 'bg-black/60',
    },
  },
  {
    id: 'guide-moderne',
    label: 'Guide moderne',
    description: 'Sans serif net, bandeau semi-transparent, structure claire.',
    preview: {
      gradient: 'bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900',
      titleClass: 'font-sans font-bold text-[12px] leading-tight',
      subtitleClass: 'font-sans text-[7px] opacity-90',
      authorClass: 'font-sans text-[8px] font-semibold',
      bandClass: 'bg-white/15',
    },
  },
];

/* ------------------------------------------------------------------ */
/* Taille automatique du titre selon sa longueur                      */
/* ------------------------------------------------------------------ */

/** Largeur moyenne d'un caractère par rapport à la taille de police. */
const AVG_CHAR_RATIO = 0.52;

/** Estime le nombre de lignes d'un texte pour une taille donnée. */
export function estimateLines(text: string, fontSize: number, boxWidth: number): number {
  const perLine = Math.max(1, Math.floor(boxWidth / (fontSize * AVG_CHAR_RATIO)));
  return text
    .split('\n')
    .reduce((total, paragraph) => total + Math.max(1, Math.ceil(paragraph.trim().length / perLine)), 0);
}

/**
 * Taille du titre adaptée à sa longueur : plus le titre est long,
 * plus la police est réduite, dans les bornes du modèle.
 */
export function autoTitleFontSize(
  text: string,
  boxWidth: number,
  bounds: { min: number; max: number },
  maxLines = 3,
): number {
  const clean = text.trim() || 'Titre';
  let size = bounds.max;
  while (size > bounds.min && estimateLines(clean, size, boxWidth) > maxLines) {
    size -= 4;
  }
  return Math.round(size);
}

/* ------------------------------------------------------------------ */
/* Application d'un modèle                                            */
/* ------------------------------------------------------------------ */

const textOf = (composition: FrontComposition, role: TextRole, fallback: string) =>
  composition.layers.find((l) => l.role === role)?.text?.trim() || fallback;

const idOf = (composition: FrontComposition, role: TextRole) =>
  composition.layers.find((l) => l.role === role)?.id;

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `l-${Math.random().toString(36).slice(2)}-${Date.now()}`;

interface RoleStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
  lineHeight: number;
  letterSpacing: number;
  opacity: number;
  shadow?: FrontTextLayer['shadow'];
  outline?: FrontTextLayer['outline'];
  band?: FrontTextLayer['band'];
}

/**
 * Applique un modèle : conserve les textes et l'illustration, remplace
 * uniquement positions et styles. Aucun chevauchement : le sous-titre est
 * positionné après les lignes réelles estimées du titre, et l'auteur reste
 * dans les marges de sécurité.
 */
export function applyTemplate(
  composition: FrontComposition,
  templateId: CoverTemplateId,
): FrontComposition {
  const { width: W, height: H } = composition.canvas;
  const margin = Math.round(W * 0.09); // marge de sécurité
  const boxWidth = W - margin * 2;

  const title = textOf(composition, 'title', 'Titre du livre');
  const subtitle = textOf(composition, 'subtitle', '');
  const author = textOf(composition, 'author', '');

  let overlay: FrontOverlay;
  let titleTop: number;
  let titleStyle: RoleStyle;
  let subtitleStyle: RoleStyle;
  let authorStyle: RoleStyle;
  let gapAfterTitle: number;

  if (templateId === 'roman-elegant') {
    overlay = { type: 'both', color: '#000000', opacity: 0.4 };
    titleTop = Math.round(H * 0.13);
    gapAfterTitle = Math.round(H * 0.035);
    titleStyle = {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontSize: autoTitleFontSize(title, boxWidth, { min: 62, max: 168 }),
      color: '#F8F5EF',
      bold: false,
      italic: false,
      lineHeight: 1.1,
      letterSpacing: Math.round(W * 0.004),
      opacity: 1,
      shadow: { enabled: true, color: '#000000', blur: 34, offsetY: 6 },
    };
    subtitleStyle = {
      fontFamily: 'Georgia, serif',
      fontSize: Math.round(W * 0.042),
      color: '#EADFCF',
      bold: false,
      italic: true,
      lineHeight: 1.3,
      letterSpacing: Math.round(W * 0.002),
      opacity: 0.95,
      shadow: { enabled: true, color: '#000000', blur: 20, offsetY: 4 },
    };
    authorStyle = {
      fontFamily: 'Georgia, serif',
      fontSize: Math.round(W * 0.038),
      color: '#FFFFFF',
      bold: false,
      italic: false,
      lineHeight: 1.2,
      letterSpacing: Math.round(W * 0.012),
      opacity: 1,
      shadow: { enabled: true, color: '#000000', blur: 18, offsetY: 4 },
    };
  } else if (templateId === 'thriller-cinema') {
    overlay = { type: 'bottom', color: '#000000', opacity: 0.55 };
    titleTop = Math.round(H * 0.11);
    gapAfterTitle = Math.round(H * 0.045);
    titleStyle = {
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      fontSize: autoTitleFontSize(title, boxWidth, { min: 70, max: 186 }),
      color: '#FFFFFF',
      bold: true,
      italic: false,
      lineHeight: 1.02,
      letterSpacing: 0,
      opacity: 1,
      shadow: { enabled: true, color: '#000000', blur: 40, offsetY: 10 },
      outline: { enabled: true, color: '#000000', width: Math.round(W * 0.004) },
      band: { enabled: true, color: '#000000', opacity: 0.5, padY: Math.round(H * 0.02) },
    };
    subtitleStyle = {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: Math.round(W * 0.034),
      color: '#F1F1F1',
      bold: false,
      italic: false,
      lineHeight: 1.45,
      letterSpacing: Math.round(W * 0.008),
      opacity: 0.95,
      shadow: { enabled: true, color: '#000000', blur: 22, offsetY: 4 },
    };
    authorStyle = {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: Math.round(W * 0.04),
      color: '#FFFFFF',
      bold: true,
      italic: false,
      lineHeight: 1.2,
      letterSpacing: Math.round(W * 0.01),
      opacity: 1,
      shadow: { enabled: true, color: '#000000', blur: 24, offsetY: 6 },
    };
  } else {
    overlay = { type: 'full', color: '#0B1220', opacity: 0.28 };
    titleTop = Math.round(H * 0.12);
    gapAfterTitle = Math.round(H * 0.04);
    titleStyle = {
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      fontSize: autoTitleFontSize(title, boxWidth, { min: 64, max: 156 }),
      color: '#FFFFFF',
      bold: true,
      italic: false,
      lineHeight: 1.12,
      letterSpacing: 0,
      opacity: 1,
      band: { enabled: true, color: '#000000', opacity: 0.42, padY: Math.round(H * 0.022) },
    };
    subtitleStyle = {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: Math.round(W * 0.036),
      color: '#E8F4F5',
      bold: false,
      italic: false,
      lineHeight: 1.35,
      letterSpacing: Math.round(W * 0.003),
      opacity: 1,
    };
    authorStyle = {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: Math.round(W * 0.038),
      color: '#FFFFFF',
      bold: true,
      italic: false,
      lineHeight: 1.2,
      letterSpacing: Math.round(W * 0.006),
      opacity: 1,
      band: { enabled: true, color: '#000000', opacity: 0.35, padY: Math.round(H * 0.012) },
    };
  }

  // Positions sans chevauchement, calculées sur les lignes réellement estimées.
  const titleLines = estimateLines(title, titleStyle.fontSize, boxWidth);
  const titleHeight = titleLines * titleStyle.fontSize * titleStyle.lineHeight;
  const subtitleTop = Math.round(titleTop + titleHeight + gapAfterTitle);

  const authorTop = Math.round(H * 0.86);
  const authorMax = H - margin - authorStyle.fontSize * authorStyle.lineHeight;

  const build = (role: TextRole, text: string, y: number, style: RoleStyle): FrontTextLayer => ({
    id: idOf(composition, role) ?? newId(),
    role,
    text,
    x: margin,
    y: Math.max(margin, Math.min(y, H - margin - style.fontSize)),
    width: boxWidth,
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    color: style.color,
    align: 'center',
    bold: style.bold,
    italic: style.italic,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    opacity: style.opacity,
    shadow: style.shadow,
    outline: style.outline,
    band: style.band,
  });

  const layers: FrontTextLayer[] = [build('title', title, titleTop, titleStyle)];
  if (subtitle) layers.push(build('subtitle', subtitle, subtitleTop, subtitleStyle));
  if (author) layers.push(build('author', author, Math.min(authorTop, authorMax), authorStyle));

  return {
    ...composition,
    version: FRONT_COMPOSITION_VERSION,
    styleVersion: FRONT_STYLE_VERSION,
    templateId,
    overlay,
    layers,
  };
}

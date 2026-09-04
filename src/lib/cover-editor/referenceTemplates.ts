/**
 * Trois modèles de RÉFÉRENCE de première de couverture.
 *
 * Contrairement aux préréglages typographiques, chaque modèle construit de
 * vrais calques : illustration, voile, formes, cadres, ornements, bandeaux,
 * titre, sous-titre, auteur et textes complémentaires. Chaque calque reste
 * sélectionnable, déplaçable, modifiable, masquable, verrouillable et
 * supprimable dans l'éditeur.
 *
 * Aucun appel IA, aucun crédit consommé, aucune écriture en base ici.
 */
import demoGuide from '@/assets/cover-demo-guide.jpg';
import demoNonfiction from '@/assets/cover-demo-nonfiction.jpg';
import demoRoman from '@/assets/cover-demo-roman.jpg';
import {
  FRONT_COMPOSITION_VERSION,
  FRONT_STYLE_VERSION,
  type FrontComposition,
  type FrontShapeLayer,
  type FrontTextLayer,
  type IconGlyph,
  type TextRole,
} from '@/lib/cover-editor/frontComposition';

export type ReferenceTemplateId = 'ref-guide-pro' | 'ref-nonfiction' | 'ref-roman-premium';

export interface ReferenceTemplate {
  id: ReferenceTemplateId;
  label: string;
  description: string;
  /** Image de démonstration utilisée uniquement pour la miniature du modèle. */
  demoImage: string;
  build: (input: BuildInput) => FrontComposition;
}

interface BuildInput {
  composition: FrontComposition;
  title: string;
  subtitle: string;
  author: string;
}

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `l-${Math.random().toString(36).slice(2)}-${Math.round(Math.random() * 1e6)}`;

const SANS = '"Montserrat", "Helvetica Neue", Arial, sans-serif';
const SANS_ALT = '"Oswald", "Arial Narrow", Arial, sans-serif';
const SERIF = '"Playfair Display", Georgia, serif';

const shape = (s: Omit<FrontShapeLayer, 'id'>): FrontShapeLayer => ({ id: newId(), ...s });

const text = (
  role: TextRole,
  name: string,
  t: Partial<FrontTextLayer> & { text: string; x: number; y: number; width: number; fontSize: number },
): FrontTextLayer => ({
  id: newId(),
  role,
  name,
  color: '#FFFFFF',
  fontFamily: SANS,
  align: 'left',
  bold: false,
  italic: false,
  lineHeight: 1.1,
  opacity: 1,
  letterSpacing: 0,
  ...t,
});

/**
 * Réduit la taille d'un grand titre pour qu'il tienne dans sa zone,
 * en tenant compte du mot le plus long et de la longueur totale.
 */
/** Estime le nombre de lignes d'un texte dans une largeur donnée. */
const estimateLines = (textValue: string, width: number, fontSize: number): number => {
  // largeur moyenne d'un caractère : les capitales et les serif sont plus larges
  const upperRatio =
    textValue.replace(/[^A-ZÀ-Ý]/g, '').length / Math.max(1, textValue.replace(/\s/g, '').length);
  const charWidth = fontSize * (0.56 + upperRatio * 0.12);
  const perLine = Math.max(4, Math.floor(width / charWidth));
  const words = textValue.trim().split(/\s+/).filter(Boolean);
  let lines = 1;
  let current = 0;
  for (const word of words) {
    const add = current ? current + 1 + word.length : word.length;
    if (add > perLine && current) {
      lines += 1;
      current = word.length;
    } else current = add;
  }
  return lines;
};

const fitTitleSize = (base: number, title: string): number => {
  const words = title.trim().split(/\s+/).filter(Boolean);
  const longest = words.reduce((m, w) => Math.max(m, w.length), 1);
  const factor = Math.min(1, 10 / longest, 30 / Math.max(title.trim().length, 1));
  return Math.max(Math.round(base * 0.45), Math.round(base * factor));
};

/* ------------------------------------------------------------------ */
/* Modèle 1 — Guide professionnel                                     */
/* ------------------------------------------------------------------ */

const GUIDE_BULLETS: Array<{ label: string; icon: IconGlyph }> = [
  { label: 'Méthode pas à pas', icon: 'check' },
  { label: 'Modèles prêts à l’emploi', icon: 'book' },
  { label: 'Cas concrets détaillés', icon: 'target' },
  { label: 'Résultats mesurables', icon: 'bolt' },
];

const buildGuidePro = ({ composition, title, subtitle, author }: BuildInput): FrontComposition => {
  const { width: W, height: H } = composition.canvas;
  const m = Math.round(W * 0.07);
  const box = W - m * 2;

  const shapes: FrontShapeLayer[] = [
    shape({
      kind: 'rect',
      name: 'Fond dégradé bleu nuit',
      x: 0,
      y: 0,
      width: W,
      height: H,
      color: '#0B1B33',
      gradientTo: '#16375F',
      opacity: 1,
    }),
    shape({
      kind: 'rect',
      name: 'Halo lumineux',
      x: Math.round(-W * 0.15),
      y: Math.round(H * 0.42),
      width: Math.round(W * 1.3),
      height: Math.round(H * 0.3),
      color: '#1B4E86',
      gradientTo: '#0B1B33',
      opacity: 0.55,
    }),
    shape({
      kind: 'rect',
      name: 'Zone géométrique du titre',
      x: m,
      y: Math.round(H * 0.05),
      width: box,
      height: Math.round(H * 0.33),
      color: '#0E2C50',
      gradientTo: '#17456F',
      opacity: 1,
      radius: Math.round(W * 0.012),
    }),
    shape({
      kind: 'rect',
      name: 'Barre dorée verticale',
      x: m,
      y: Math.round(H * 0.05),
      width: Math.round(W * 0.014),
      height: Math.round(H * 0.33),
      color: '#E0B457',
      opacity: 1,
    }),
    shape({
      kind: 'rect',
      name: 'Filet doré du titre',
      x: m,
      y: Math.round(H * 0.385),
      width: box,
      height: Math.round(H * 0.005),
      color: '#E0B457',
      gradientTo: '#8C6B21',
      gradientDirection: 'horizontal',
      opacity: 1,
    }),
    shape({
      kind: 'diagonal',
      name: 'Séparation diagonale',
      x: 0,
      y: Math.round(H * 0.4),
      width: W,
      height: Math.round(H * 0.1),
      color: '#071626',
      opacity: 0.95,
      corner: 'br',
    }),
    shape({
      kind: 'rect',
      name: 'Cadre doré de la photographie',
      x: Math.round(W * 0.335) - Math.round(W * 0.008),
      y: Math.round(H * 0.5) - Math.round(W * 0.008),
      width: Math.round(W * 0.6) + Math.round(W * 0.016),
      height: Math.round(H * 0.315) + Math.round(W * 0.016),
      color: '#E0B457',
      opacity: 0.9,
      radius: Math.round(W * 0.018),
    }),
    shape({
      kind: 'photo',
      name: 'Photographie',
      x: Math.round(W * 0.335),
      y: Math.round(H * 0.5),
      width: Math.round(W * 0.6),
      height: Math.round(H * 0.315),
      color: '#0B1B33',
      opacity: 1,
      radius: Math.round(W * 0.015),
      strokeWidth: 0,
    }),
  ];

  GUIDE_BULLETS.forEach((bullet, index) => {
    const by = Math.round(H * (0.5 + index * 0.079));
    shapes.push(
      shape({
        kind: 'rect',
        name: `Bloc ${index + 1}`,
        x: m,
        y: by,
        width: Math.round(W * 0.245),
        height: Math.round(H * 0.064),
        color: '#153C66',
        gradientTo: '#0D2846',
        opacity: 0.96,
        radius: Math.round(W * 0.008),
      }),
      shape({
        kind: 'icon',
        name: `Pictogramme ${index + 1}`,
        icon: bullet.icon,
        x: m + Math.round(W * 0.014),
        y: by + Math.round(H * 0.014),
        width: Math.round(W * 0.036),
        height: Math.round(W * 0.036),
        color: '#E0B457',
        opacity: 1,
        strokeWidth: Math.round(W * 0.0045),
      }),
    );
  });

  shapes.push(
    shape({
      kind: 'rect',
      name: 'Bandeau inférieur',
      x: 0,
      y: Math.round(H * 0.87),
      width: W,
      height: Math.round(H * 0.13),
      color: '#E5BD62',
      gradientTo: '#C79A3C',
      opacity: 1,
    }),
    shape({
      kind: 'rect',
      name: 'Filet du bandeau',
      x: 0,
      y: Math.round(H * 0.87),
      width: W,
      height: Math.round(H * 0.004),
      color: '#FFF0C6',
      opacity: 0.9,
    }),
  );

  const guideTitleY = Math.round(H * 0.132);
  const guideTitleX = m + Math.round(W * 0.05);
  const guideTitleW = box - Math.round(W * 0.09);
  const guideTitleSize = fitTitleSize(Math.round(W * 0.105), title);
  const guideTitleLines = estimateLines(title, guideTitleW, guideTitleSize);
  const guideSubtitleY = Math.max(
    Math.round(H * 0.245),
    guideTitleY + Math.round(guideTitleLines * guideTitleSize * 1.02 + H * 0.025),
  );

  const layers: FrontTextLayer[] = [
    text('custom', 'Surtitre', {
      text: 'GUIDE PROFESSIONNEL',
      x: guideTitleX,
      y: Math.round(H * 0.085),
      width: guideTitleW,
      fontSize: Math.round(W * 0.032),
      fontFamily: SANS,
      color: '#E0B457',
      bold: true,
      letterSpacing: Math.round(W * 0.009),
    }),
    text('title', 'Titre', {
      text: title,
      x: guideTitleX,
      y: guideTitleY,
      width: guideTitleW,
      fontSize: guideTitleSize,
      fontFamily: SANS_ALT,
      color: '#FFFFFF',
      bold: true,
      lineHeight: 1.02,
      shadow: {
        enabled: true,
        color: '#04101E',
        blur: Math.round(W * 0.014),
        offsetY: Math.round(W * 0.003),
      },
    }),
    text('subtitle', 'Sous-titre', {
      text: subtitle || 'Le sous-titre qui promet un résultat clair',
      x: guideTitleX,
      y: guideSubtitleY,
      width: guideTitleW,
      fontSize: Math.round(W * 0.037),
      fontFamily: SANS,
      color: '#F3D89A',
      lineHeight: 1.25,
    }),
  ];

  GUIDE_BULLETS.forEach((bullet, index) => {
    layers.push(
      text('custom', `Texte bloc ${index + 1}`, {
        text: bullet.label,
        x: m + Math.round(W * 0.062),
        y: Math.round(H * (0.5 + index * 0.079)) + Math.round(H * 0.019),
        width: Math.round(W * 0.175),
        fontSize: Math.round(W * 0.02),
        fontFamily: SANS,
        color: '#FFFFFF',
        bold: true,
        lineHeight: 1.1,
      }),
    );
  });

  layers.push(
    text('author', 'Auteur', {
      text: author || 'Nom de l’auteur',
      x: m,
      y: Math.round(H * 0.905),
      width: box,
      fontSize: Math.round(W * 0.045),
      fontFamily: SANS,
      color: '#0B1B33',
      align: 'center',
      bold: true,
      letterSpacing: Math.round(W * 0.005),
    }),
  );

  return {
    ...composition,
    version: FRONT_COMPOSITION_VERSION,
    styleVersion: FRONT_STYLE_VERSION,
    templateId: 'ref-guide-pro',
    backgroundColor: '#0B1B33',
    illustrationMode: 'slot',
    overlay: { type: 'none', color: '#000000', opacity: 0 },
    shapes,
    layers,
  };
};

/* ------------------------------------------------------------------ */
/* Modèle 2 — Non-fiction spectaculaire                               */
/* ------------------------------------------------------------------ */

/** Découpe le titre en trois lignes équilibrées (au plus). */
const splitInThree = (value: string): string[] => {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return [value.trim()];
  if (words.length === 2) return words;
  const target = Math.ceil(words.length / 3);
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += target) lines.push(words.slice(i, i + target).join(' '));
  return lines.slice(0, 3);
};

const buildNonfiction = ({ composition, title, subtitle, author }: BuildInput): FrontComposition => {
  const { width: W, height: H } = composition.canvas;
  const m = Math.round(W * 0.06);
  const box = W - m * 2;

  const lines = splitInThree(title);
  const bandH = Math.round(H * 0.082);
  const bandTop = Math.round(H * 0.055);
  const bandGap = Math.round(bandH * 1.06);
  const bandWidths = [box, Math.round(box * 0.93), Math.round(box * 0.84)];
  const lineColors = ['#FFFFFF', '#F6C244', '#FFFFFF'];

  const shapes: FrontShapeLayer[] = [
    shape({
      kind: 'rect',
      name: 'Voile dégradé haut',
      x: 0,
      y: 0,
      width: W,
      height: Math.round(H * 0.5),
      color: '#04120A',
      gradientTo: '#04120A',
      opacity: 0.42,
    }),
    shape({
      kind: 'rect',
      name: 'Voile dégradé bas',
      x: 0,
      y: Math.round(H * 0.62),
      width: W,
      height: Math.round(H * 0.38),
      color: '#04120A',
      gradientTo: '#04120A',
      opacity: 0.35,
    }),
  ];

  lines.forEach((_, index) => {
    shapes.push(
      shape({
        kind: 'rect',
        name: `Bandeau ${index + 1}`,
        x: m,
        y: bandTop + index * bandGap,
        width: bandWidths[index] ?? box,
        height: bandH,
        color: index === 1 ? '#0C2418' : '#0F2C1E',
        gradientTo: index === 1 ? '#123726' : '#08190F',
        opacity: 0.88,
        radius: Math.round(W * 0.006),
      }),
    );
  });

  const subtitleBandY = bandTop + lines.length * bandGap + Math.round(H * 0.012);
  shapes.push(
    shape({
      kind: 'rect',
      name: 'Bandeau du sous-titre',
      x: m,
      y: subtitleBandY,
      width: Math.round(box * 0.76),
      height: Math.round(bandH * 0.7),
      color: '#C7412F',
      gradientTo: '#8E2A1D',
      opacity: 0.96,
      radius: Math.round(W * 0.006),
    }),
    shape({
      kind: 'rect',
      name: 'Bandeau auteur',
      x: 0,
      y: Math.round(H * 0.9),
      width: W,
      height: Math.round(H * 0.1),
      color: '#0F2C1E',
      gradientTo: '#061309',
      opacity: 0.9,
    }),
    shape({
      kind: 'rect',
      name: 'Filet doré auteur',
      x: 0,
      y: Math.round(H * 0.9),
      width: W,
      height: Math.round(H * 0.0035),
      color: '#F6C244',
      opacity: 0.95,
    }),
  );

  const layers: FrontTextLayer[] = lines.map((line, index) =>
    text('title', `Titre — ligne ${index + 1}`, {
      text: line.toLocaleUpperCase('fr-FR'),
      x: m,
      y: bandTop + index * bandGap + Math.round(bandH * 0.13),
      width: bandWidths[index] ?? box,
      fontSize: fitTitleSize(Math.round(W * 0.108), line),
      fontFamily: SANS_ALT,
      color: lineColors[index] ?? '#FFFFFF',
      align: 'center',
      bold: true,
      lineHeight: 1,
      shadow: {
        enabled: true,
        color: '#000000',
        blur: Math.round(W * 0.022),
        offsetY: Math.round(W * 0.004),
      },
      outline: { enabled: true, color: '#08190F', width: Math.round(W * 0.006) },
    }),
  );

  layers.push(
    text('subtitle', 'Sous-titre', {
      text: subtitle || 'Tout ce qu’il faut savoir, étape par étape',
      x: m,
      y: subtitleBandY + Math.round(bandH * 0.16),
      width: Math.round(box * 0.76),
      fontSize: Math.round(W * 0.034),
      fontFamily: SANS,
      color: '#FFFFFF',
      align: 'center',
      bold: true,
      letterSpacing: Math.round(W * 0.002),
    }),
    text('author', 'Auteur', {
      text: author || 'Nom de l’auteur',
      x: m,
      y: Math.round(H * 0.928),
      width: box,
      fontSize: Math.round(W * 0.044),
      fontFamily: SANS,
      color: '#FFFFFF',
      align: 'center',
      bold: true,
      letterSpacing: Math.round(W * 0.005),
    }),
  );

  return {
    ...composition,
    version: FRONT_COMPOSITION_VERSION,
    styleVersion: FRONT_STYLE_VERSION,
    templateId: 'ref-nonfiction',
    illustrationMode: 'cover',
    backgroundColor: '#123322',
    overlay: { type: 'both', color: '#04120A', opacity: 0.32 },
    shapes,
    layers,
  };
};

/* ------------------------------------------------------------------ */
/* Modèle 3 — Roman premium                                           */
/* ------------------------------------------------------------------ */

const buildRomanPremium = ({ composition, title, subtitle, author }: BuildInput): FrontComposition => {
  const { width: W, height: H } = composition.canvas;
  const inset = Math.round(W * 0.05);
  const orn = Math.round(W * 0.15);
  const gold = '#D8B86A';

  const cornerShape = (
    name: string,
    corner: 'tl' | 'tr' | 'bl' | 'br',
  ): FrontShapeLayer =>
    shape({
      kind: 'ornament',
      name,
      x:
        corner === 'tl' || corner === 'bl'
          ? inset + Math.round(W * 0.028)
          : W - inset - Math.round(W * 0.028) - orn,
      y:
        corner === 'tl' || corner === 'tr'
          ? inset + Math.round(W * 0.028)
          : H - inset - Math.round(W * 0.028) - orn,
      width: orn,
      height: orn,
      color: gold,
      opacity: 0.95,
      strokeWidth: Math.round(W * 0.0035),
      corner,
    });

  const shapes: FrontShapeLayer[] = [
    shape({
      kind: 'rect',
      name: 'Voile général assombrissant',
      x: 0,
      y: 0,
      width: W,
      height: H,
      color: '#020704',
      gradientTo: '#0B1710',
      opacity: 0.42,
    }),
    shape({
      kind: 'frame',
      name: 'Double cadre doré',
      x: inset,
      y: inset,
      width: W - inset * 2,
      height: H - inset * 2,
      color: gold,
      opacity: 0.95,
      strokeWidth: Math.round(W * 0.007),
      double: true,
      gap: Math.round(W * 0.016),
    }),
    shape({
      kind: 'frame',
      name: 'Filet intérieur',
      x: inset + Math.round(W * 0.045),
      y: inset + Math.round(W * 0.045),
      width: W - (inset + Math.round(W * 0.045)) * 2,
      height: H - (inset + Math.round(W * 0.045)) * 2,
      color: gold,
      opacity: 0.35,
      strokeWidth: Math.round(W * 0.0022),
    }),
    cornerShape('Ornement haut gauche', 'tl'),
    cornerShape('Ornement haut droit', 'tr'),
    cornerShape('Ornement bas gauche', 'bl'),
    cornerShape('Ornement bas droit', 'br'),
    shape({
      kind: 'rect',
      name: 'Voile derrière le titre',
      x: Math.round(W * 0.1),
      y: Math.round(H * 0.1),
      width: Math.round(W * 0.8),
      height: Math.round(H * 0.24),
      color: '#04100A',
      gradientTo: '#04100A',
      opacity: 0.35,
      radius: Math.round(W * 0.01),
    }),
    shape({
      kind: 'rect',
      name: 'Filet doré central',
      x: Math.round(W * 0.36),
      y: Math.round(H * 0.815),
      width: Math.round(W * 0.28),
      height: Math.round(H * 0.0028),
      color: gold,
      opacity: 0.9,
    }),
    shape({
      kind: 'icon',
      name: 'Losange décoratif',
      icon: 'diamond',
      x: Math.round(W * 0.475),
      y: Math.round(H * 0.788),
      width: Math.round(W * 0.05),
      height: Math.round(W * 0.05),
      color: gold,
      opacity: 0.9,
      strokeWidth: Math.round(W * 0.003),
    }),
  ];

  const boxX = Math.round(W * 0.12);
  const boxW = W - boxX * 2;
  const romanTitleY = Math.round(H * 0.135);
  const romanTitleSize = fitTitleSize(Math.round(W * 0.115), title);
  const romanTitleLines = estimateLines(title, boxW, romanTitleSize);
  const romanSubtitleY =
    romanTitleY + Math.round(romanTitleLines * romanTitleSize * 1.06 + H * 0.03);

  const layers: FrontTextLayer[] = [
    text('title', 'Titre', {
      text: title,
      x: boxX,
      y: romanTitleY,
      width: boxW,
      fontSize: romanTitleSize,
      fontFamily: SERIF,
      color: '#F3DCA4',
      align: 'center',
      lineHeight: 1.06,
      letterSpacing: Math.round(W * 0.003),
      shadow: {
        enabled: true,
        color: '#000000',
        blur: Math.round(W * 0.028),
        offsetY: Math.round(W * 0.003),
      },
      glow: { enabled: true, color: '#E9C877', blur: Math.round(W * 0.03) },
    }),
    text('subtitle', 'Sous-titre', {
      text: (subtitle || 'Roman').toLocaleUpperCase('fr-FR'),
      x: boxX,
      y: romanSubtitleY,
      width: boxW,
      fontSize: Math.round(W * 0.03),
      fontFamily: SERIF,
      color: '#EADFC8',
      align: 'center',
      letterSpacing: Math.round(W * 0.012),
    }),
    text('author', 'Auteur', {
      text: author || 'Nom de l’auteur',
      x: boxX,
      y: Math.round(H * 0.845),
      width: boxW,
      fontSize: Math.round(W * 0.05),
      fontFamily: SERIF,
      color: '#F3DCA4',
      align: 'center',
      letterSpacing: Math.round(W * 0.008),
      shadow: {
        enabled: true,
        color: '#000000',
        blur: Math.round(W * 0.02),
        offsetY: Math.round(W * 0.002),
      },
    }),
  ];

  return {
    ...composition,
    version: FRONT_COMPOSITION_VERSION,
    styleVersion: FRONT_STYLE_VERSION,
    templateId: 'ref-roman-premium',
    illustrationMode: 'cover',
    backgroundColor: '#0A140F',
    overlay: { type: 'full', color: '#040A07', opacity: 0.32 },
    shapes,
    layers,
  };
};

export const REFERENCE_TEMPLATES: ReferenceTemplate[] = [
  {
    id: 'ref-guide-pro',
    label: 'Guide professionnel',
    description:
      'Fond bleu nuit, zone géométrique du titre, séparation diagonale, photographie cadrée, quatre blocs à pictogramme et bandeau auteur.',
    demoImage: demoGuide,
    build: buildGuidePro,
  },
  {
    id: 'ref-nonfiction',
    label: 'Non-fiction spectaculaire',
    description:
      'Illustration plein écran, trois bandeaux superposés, titre géant sur deux lignes bicolores, contour et ombre puissants.',
    demoImage: demoNonfiction,
    build: buildNonfiction,
  },
  {
    id: 'ref-roman-premium',
    label: 'Roman premium',
    description:
      'Illustration assombrie, double cadre doré, ornements dans les quatre angles, grand titre serif doré et voile automatique.',
    demoImage: demoRoman,
    build: buildRomanPremium,
  },
];

/**
 * Récupère le texte d'un rôle. Un titre peut être réparti sur plusieurs
 * calques `title` (modèle bicolore) : on les rassemble pour ne jamais perdre
 * de mots en passant d'un modèle à l'autre.
 */
const textOf = (composition: FrontComposition, role: TextRole, fallback: string) => {
  const parts = composition.layers
    .filter((l) => l.role === role)
    .map((l) => l.text?.trim() ?? '')
    .filter(Boolean);
  return parts.join(' ') || fallback;
};


/**
 * Applique un modèle de référence : les textes existants sont conservés,
 * tous les calques (formes + textes) sont reconstruits.
 */
export function applyReferenceTemplate(
  composition: FrontComposition,
  id: ReferenceTemplateId,
): FrontComposition {
  const tpl = REFERENCE_TEMPLATES.find((t) => t.id === id) ?? REFERENCE_TEMPLATES[0];
  return tpl.build({
    composition,
    title: textOf(composition, 'title', 'Titre du livre'),
    subtitle: textOf(composition, 'subtitle', ''),
    author: textOf(composition, 'author', ''),
  });
}

/** Composition de démonstration utilisée pour la miniature d'un modèle. */
export function buildReferencePreview(
  tpl: ReferenceTemplate,
  canvas = { width: 1600, height: 2560 },
): FrontComposition {
  const base: FrontComposition = {
    version: FRONT_COMPOSITION_VERSION,
    styleVersion: FRONT_STYLE_VERSION,
    illustrationPath: null,
    canvas,
    backgroundColor: '#0B1B33',
    layers: [],
    shapes: [],
  };
  return tpl.build({
    composition: base,
    title: tpl.id === 'ref-roman-premium' ? 'Les Flammes du Passé' : 'Réussir son entretien',
    subtitle:
      tpl.id === 'ref-roman-premium'
        ? 'Roman'
        : 'La méthode complète en sept étapes',
    author: 'Georges Boubet',
  });
}

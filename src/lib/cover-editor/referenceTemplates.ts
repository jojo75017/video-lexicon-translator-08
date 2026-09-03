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
const fitTitleSize = (base: number, title: string): number => {
  const words = title.trim().split(/\s+/).filter(Boolean);
  const longest = words.reduce((m, w) => Math.max(m, w.length), 1);
  const factor = Math.min(1, 10 / longest, 30 / Math.max(title.trim().length, 1));
  return Math.max(Math.round(base * 0.45), Math.round(base * factor));
};

/* ------------------------------------------------------------------ */
/* Modèle 1 — Guide professionnel                                     */
/* ------------------------------------------------------------------ */

const buildGuidePro = ({ composition, title, subtitle, author }: BuildInput): FrontComposition => {
  const { width: W, height: H } = composition.canvas;
  const m = Math.round(W * 0.07);
  const box = W - m * 2;

  const bullets = ['Méthode pas à pas', 'Modèles prêts à l’emploi', 'Cas concrets détaillés', 'Résultats mesurables'];

  const shapes: FrontShapeLayer[] = [
    shape({
      kind: 'rect',
      name: 'Zone géométrique du titre',
      x: m,
      y: Math.round(H * 0.05),
      width: box,
      height: Math.round(H * 0.33),
      color: '#123A63',
      opacity: 1,
      radius: Math.round(W * 0.01),
    }),
    shape({
      kind: 'rect',
      name: 'Filet doré du titre',
      x: m,
      y: Math.round(H * 0.38),
      width: box,
      height: Math.round(H * 0.006),
      color: '#E0B457',
      opacity: 1,
    }),
    shape({
      kind: 'diagonal',
      name: 'Séparation diagonale',
      x: 0,
      y: Math.round(H * 0.4),
      width: W,
      height: Math.round(H * 0.09),
      color: '#0E2544',
      opacity: 1,
      corner: 'br',
    }),
    shape({
      kind: 'photo',
      name: 'Photographie',
      x: Math.round(W * 0.34),
      y: Math.round(H * 0.5),
      width: Math.round(W * 0.59),
      height: Math.round(H * 0.31),
      color: '#0B1B33',
      opacity: 1,
      radius: Math.round(W * 0.015),
      strokeWidth: Math.round(W * 0.004),
    }),
  ];

  bullets.forEach((_, index) => {
    shapes.push(
      shape({
        kind: 'rect',
        name: `Bloc ${index + 1}`,
        x: m,
        y: Math.round(H * (0.5 + index * 0.078)),
        width: Math.round(W * 0.24),
        height: Math.round(H * 0.062),
        color: '#173F69',
        opacity: 1,
        radius: Math.round(W * 0.008),
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
      color: '#E0B457',
      opacity: 1,
    }),
  );

  const layers: FrontTextLayer[] = [
    text('custom', 'Surtitre', {
      text: 'GUIDE PROFESSIONNEL',
      x: m + Math.round(W * 0.04),
      y: Math.round(H * 0.085),
      width: box - Math.round(W * 0.08),
      fontSize: Math.round(W * 0.033),
      fontFamily: SANS,
      color: '#E0B457',
      bold: true,
      letterSpacing: Math.round(W * 0.008),
    }),
    text('title', 'Titre', {
      text: title,
      x: m + Math.round(W * 0.04),
      y: Math.round(H * 0.13),
      width: box - Math.round(W * 0.08),
      fontSize: Math.round(W * 0.105),
      fontFamily: SANS_ALT,
      color: '#FFFFFF',
      bold: true,
      lineHeight: 1.02,
    }),
    text('subtitle', 'Sous-titre', {
      text: subtitle || 'Le sous-titre qui promet un résultat clair',
      x: m + Math.round(W * 0.04),
      y: Math.round(H * 0.305),
      width: box - Math.round(W * 0.08),
      fontSize: Math.round(W * 0.038),
      fontFamily: SANS,
      color: '#CFE1F5',
      lineHeight: 1.25,
    }),
  ];

  bullets.forEach((label, index) => {
    layers.push(
      text('custom', `Pictogramme ${index + 1}`, {
        text: '◆',
        x: m + Math.round(W * 0.015),
        y: Math.round(H * (0.5 + index * 0.078) + H * 0.015),
        width: Math.round(W * 0.05),
        fontSize: Math.round(W * 0.028),
        fontFamily: SANS,
        color: '#E0B457',
      }),
      text('custom', `Texte bloc ${index + 1}`, {
        text: label,
        x: m + Math.round(W * 0.06),
        y: Math.round(H * (0.5 + index * 0.078) + H * 0.017),
        width: Math.round(W * 0.18),
        fontSize: Math.round(W * 0.021),
        fontFamily: SANS,
        color: '#FFFFFF',
        bold: true,
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
      letterSpacing: Math.round(W * 0.004),
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

const buildNonfiction = ({ composition, title, subtitle, author }: BuildInput): FrontComposition => {
  const { width: W, height: H } = composition.canvas;
  const m = Math.round(W * 0.06);
  const box = W - m * 2;

  const words = title.trim().split(/\s+/).filter(Boolean);
  const cut = Math.max(1, Math.ceil(words.length / 2));
  const line1 = words.slice(0, cut).join(' ') || title;
  const line2 = words.slice(cut).join(' ');

  const bandH = Math.round(H * 0.085);
  const bandY = [0.06, 0.155, 0.25].map((r) => Math.round(H * r));

  const shapes: FrontShapeLayer[] = [
    shape({
      kind: 'rect',
      name: 'Bandeau 1',
      x: m,
      y: bandY[0],
      width: box,
      height: bandH,
      color: '#0F2C1E',
      opacity: 0.82,
      radius: Math.round(W * 0.006),
    }),
    shape({
      kind: 'rect',
      name: 'Bandeau 2',
      x: m,
      y: bandY[1],
      width: Math.round(box * 0.92),
      height: bandH,
      color: '#0F2C1E',
      opacity: 0.82,
      radius: Math.round(W * 0.006),
    }),
    shape({
      kind: 'rect',
      name: 'Bandeau 3',
      x: m,
      y: bandY[2],
      width: Math.round(box * 0.78),
      height: Math.round(bandH * 0.78),
      color: '#C7412F',
      opacity: 0.95,
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
      opacity: 0.88,
    }),
  ];

  const layers: FrontTextLayer[] = [
    text('title', 'Titre — ligne 1', {
      text: line1.toLocaleUpperCase('fr-FR'),
      x: m,
      y: bandY[0] + Math.round(bandH * 0.14),
      width: box,
      fontSize: Math.round(W * 0.108),
      fontFamily: SANS_ALT,
      color: '#FFFFFF',
      align: 'center',
      bold: true,
      lineHeight: 1,
      shadow: { enabled: true, color: '#000000', blur: Math.round(W * 0.02), offsetY: Math.round(W * 0.004) },
      outline: { enabled: true, color: '#0A1F14', width: Math.round(W * 0.006) },
    }),
    text('title', 'Titre — ligne 2', {
      text: (line2 || '').toLocaleUpperCase('fr-FR'),
      hidden: !line2,
      x: m,
      y: bandY[1] + Math.round(bandH * 0.14),
      width: Math.round(box * 0.92),
      fontSize: Math.round(W * 0.098),
      fontFamily: SANS_ALT,
      color: '#F6C244',
      align: 'center',
      bold: true,
      lineHeight: 1,
      shadow: { enabled: true, color: '#000000', blur: Math.round(W * 0.02), offsetY: Math.round(W * 0.004) },
      outline: { enabled: true, color: '#0A1F14', width: Math.round(W * 0.006) },
    }),

    text('subtitle', 'Sous-titre', {
      text: subtitle || 'Tout ce qu’il faut savoir, étape par étape',
      x: m,
      y: bandY[2] + Math.round(bandH * 0.16),
      width: Math.round(box * 0.78),
      fontSize: Math.round(W * 0.036),
      fontFamily: SANS,
      color: '#FFFFFF',
      align: 'center',
      bold: true,
    }),
    text('author', 'Auteur', {
      text: author || 'Nom de l’auteur',
      x: m,
      y: Math.round(H * 0.925),
      width: box,
      fontSize: Math.round(W * 0.044),
      fontFamily: SANS,
      color: '#FFFFFF',
      align: 'center',
      bold: true,
      letterSpacing: Math.round(W * 0.004),
    }),
  ];

  return {
    ...composition,
    version: FRONT_COMPOSITION_VERSION,
    styleVersion: FRONT_STYLE_VERSION,
    templateId: 'ref-nonfiction',
    illustrationMode: 'cover',
    backgroundColor: '#123322',
    overlay: { type: 'top', color: '#04120A', opacity: 0.35 },
    shapes,
    layers,
  };
};

/* ------------------------------------------------------------------ */
/* Modèle 3 — Roman premium                                           */
/* ------------------------------------------------------------------ */

const buildRomanPremium = ({ composition, title, subtitle, author }: BuildInput): FrontComposition => {
  const { width: W, height: H } = composition.canvas;
  const inset = Math.round(W * 0.055);
  const orn = Math.round(W * 0.14);

  const shapes: FrontShapeLayer[] = [
    shape({
      kind: 'frame',
      name: 'Double cadre doré',
      x: inset,
      y: inset,
      width: W - inset * 2,
      height: H - inset * 2,
      color: '#D8B86A',
      opacity: 0.95,
      strokeWidth: Math.round(W * 0.006),
      double: true,
      gap: Math.round(W * 0.018),
    }),
    shape({
      kind: 'ornament',
      name: 'Ornement haut gauche',
      x: inset + Math.round(W * 0.03),
      y: inset + Math.round(W * 0.03),
      width: orn,
      height: orn,
      color: '#D8B86A',
      opacity: 0.95,
      strokeWidth: Math.round(W * 0.004),
      corner: 'tl',
    }),
    shape({
      kind: 'ornament',
      name: 'Ornement haut droit',
      x: W - inset - Math.round(W * 0.03) - orn,
      y: inset + Math.round(W * 0.03),
      width: orn,
      height: orn,
      color: '#D8B86A',
      opacity: 0.95,
      strokeWidth: Math.round(W * 0.004),
      corner: 'tr',
    }),
    shape({
      kind: 'ornament',
      name: 'Ornement bas gauche',
      x: inset + Math.round(W * 0.03),
      y: H - inset - Math.round(W * 0.03) - orn,
      width: orn,
      height: orn,
      color: '#D8B86A',
      opacity: 0.95,
      strokeWidth: Math.round(W * 0.004),
      corner: 'bl',
    }),
    shape({
      kind: 'ornament',
      name: 'Ornement bas droit',
      x: W - inset - Math.round(W * 0.03) - orn,
      y: H - inset - Math.round(W * 0.03) - orn,
      width: orn,
      height: orn,
      color: '#D8B86A',
      opacity: 0.95,
      strokeWidth: Math.round(W * 0.004),
      corner: 'br',
    }),
  ];

  const boxX = Math.round(W * 0.12);
  const boxW = W - boxX * 2;

  const layers: FrontTextLayer[] = [
    text('title', 'Titre', {
      text: title,
      x: boxX,
      y: Math.round(H * 0.13),
      width: boxW,
      fontSize: Math.round(W * 0.115),
      fontFamily: SERIF,
      color: '#F0D79A',
      align: 'center',
      lineHeight: 1.06,
      letterSpacing: Math.round(W * 0.003),
      shadow: { enabled: true, color: '#000000', blur: Math.round(W * 0.03), offsetY: Math.round(W * 0.003) },
      band: { enabled: true, color: '#08110C', opacity: 0.4, padY: Math.round(H * 0.02) },
    }),
    text('subtitle', 'Sous-titre', {
      text: subtitle || 'Roman',
      x: boxX,
      y: Math.round(H * 0.33),
      width: boxW,
      fontSize: Math.round(W * 0.036),
      fontFamily: SERIF,
      color: '#EADFC8',
      align: 'center',
      italic: true,
      letterSpacing: Math.round(W * 0.006),
    }),
    text('author', 'Auteur', {
      text: author || 'Nom de l’auteur',
      x: boxX,
      y: Math.round(H * 0.855),
      width: boxW,
      fontSize: Math.round(W * 0.05),
      fontFamily: SERIF,
      color: '#F0D79A',
      align: 'center',
      letterSpacing: Math.round(W * 0.008),
      band: { enabled: true, color: '#08110C', opacity: 0.35, padY: Math.round(H * 0.014) },
    }),
  ];

  return {
    ...composition,
    version: FRONT_COMPOSITION_VERSION,
    styleVersion: FRONT_STYLE_VERSION,
    templateId: 'ref-roman-premium',
    illustrationMode: 'cover',
    backgroundColor: '#0A140F',
    overlay: { type: 'full', color: '#040A07', opacity: 0.4 },
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

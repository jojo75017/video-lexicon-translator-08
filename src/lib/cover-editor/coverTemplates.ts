/**
 * Modèles professionnels de première de couverture (styleVersion 1).
 *
 * Un modèle ne change QUE la mise en page et les styles : l'illustration, le
 * titre, le sous-titre et le nom de l'auteur sont toujours conservés.
 * Chaque modèle propose 3 variantes de couleurs et impose ses marges de
 * sécurité, sa hiérarchie de tailles, son interligne, son voile et ses effets.
 *
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

export type CoverGenre =
  | 'roman'
  | 'thriller'
  | 'romance'
  | 'fantasy'
  | 'developpement'
  | 'guide'
  | 'business'
  | 'jeunesse'
  | 'cuisine'
  | 'biographie';

export const GENRE_LABEL: Record<CoverGenre, string> = {
  roman: 'Roman',
  thriller: 'Thriller / Polar',
  romance: 'Romance',
  fantasy: 'Fantasy',
  developpement: 'Développement personnel',
  guide: 'Guide pratique',
  business: 'Business',
  jeunesse: 'Jeunesse',
  cuisine: 'Cuisine',
  biographie: 'Biographie',
};

/** Palette d'une variante : couleurs de textes et du voile. */
export interface TemplateVariant {
  label: string;
  title: string;
  subtitle: string;
  author: string;
  overlayColor: string;
  bandColor: string;
  /** Aperçu du dégradé (classes Tailwind). */
  gradient: string;
}

interface RoleSpec {
  fontFamily: string;
  /** Taille relative à la largeur du canevas. */
  sizeRatio: number;
  bold: boolean;
  italic: boolean;
  lineHeight: number;
  /** Espacement des lettres relatif à la largeur. */
  trackingRatio: number;
  uppercase?: boolean;
  opacity?: number;
  shadow?: { blur: number; offsetY: number };
  outline?: { widthRatio: number };
  band?: { opacity: number; padRatio: number };
}

export interface CoverTemplate {
  id: string;
  label: string;
  genre: CoverGenre;
  description: string;
  /** Marge de sécurité relative à la largeur. */
  marginRatio: number;
  /** Position verticale du titre (0 → 1). */
  titleTopRatio: number;
  /** Position verticale du nom de l'auteur (0 → 1). */
  authorTopRatio: number;
  gapRatio: number;
  align: 'left' | 'center' | 'right';
  overlay: { type: FrontOverlay['type']; opacity: number };
  /** Bornes de la taille du titre, relatives à la largeur. */
  titleBounds: { min: number; max: number };
  title: RoleSpec;
  subtitle: RoleSpec;
  author: RoleSpec;
  variants: TemplateVariant[];
  preview: {
    titleClass: string;
    subtitleClass: string;
    authorClass: string;
    bandClass?: string;
  };
}

/* ------------------------------------------------------------------ */
/* Palettes réutilisables                                             */
/* ------------------------------------------------------------------ */

const V = (
  label: string,
  title: string,
  subtitle: string,
  author: string,
  overlayColor: string,
  bandColor: string,
  gradient: string,
): TemplateVariant => ({ label, title, subtitle, author, overlayColor, bandColor, gradient });

const IVORY = V('Ivoire', '#F8F5EF', '#EADFCF', '#FFFFFF', '#000000', '#000000', 'bg-gradient-to-b from-stone-600 via-stone-800 to-stone-950');
const GOLD = V('Or', '#F3D9A4', '#E7C989', '#FFF7E6', '#0B0B0B', '#000000', 'bg-gradient-to-b from-amber-900 via-stone-900 to-black');
const NIGHT = V('Nuit', '#FFFFFF', '#C9D6E8', '#FFFFFF', '#050B18', '#050B18', 'bg-gradient-to-b from-slate-700 via-slate-900 to-black');
const BLOOD = V('Rouge sang', '#FFFFFF', '#F3B4B4', '#FF5A5A', '#0A0A0A', '#000000', 'bg-gradient-to-b from-red-900 via-zinc-900 to-black');
const ICE = V('Glace', '#EAF6FF', '#BBD9EE', '#FFFFFF', '#07131F', '#07131F', 'bg-gradient-to-b from-sky-800 via-slate-900 to-black');
const ROSE = V('Rose poudré', '#FFF1F5', '#F6CBD9', '#FFFFFF', '#3A0E20', '#3A0E20', 'bg-gradient-to-b from-rose-400 via-rose-700 to-rose-950');
const TEAL = V('Sarcelle', '#FFFFFF', '#D8F2F4', '#FFFFFF', '#04262B', '#04262B', 'bg-gradient-to-br from-teal-600 via-teal-800 to-slate-900');
const SUN = V('Soleil', '#FFF8E1', '#FFE2A8', '#FFFFFF', '#2A1A02', '#2A1A02', 'bg-gradient-to-br from-amber-400 via-orange-600 to-stone-900');
const FOREST = V('Forêt', '#F2FFF4', '#C7E9CF', '#FFFFFF', '#04200F', '#04200F', 'bg-gradient-to-b from-emerald-700 via-emerald-900 to-black');
const VIOLET = V('Violet', '#F7F2FF', '#D9C9F5', '#FFFFFF', '#160A2A', '#160A2A', 'bg-gradient-to-b from-violet-600 via-violet-900 to-black');
const INK = V('Encre', '#FFFFFF', '#D5DAE2', '#FFFFFF', '#0C0F14', '#0C0F14', 'bg-gradient-to-b from-zinc-700 via-zinc-900 to-black');
const CANDY = V('Bonbon', '#FFFFFF', '#FFF0B8', '#FFFFFF', '#12224A', '#1D3A8A', 'bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500');

/* ------------------------------------------------------------------ */
/* Les 15 modèles                                                     */
/* ------------------------------------------------------------------ */

const serifTitle = (family: string, ratio: number): RoleSpec => ({
  fontFamily: family,
  sizeRatio: ratio,
  bold: false,
  italic: false,
  lineHeight: 1.08,
  trackingRatio: 0.004,
  shadow: { blur: 34, offsetY: 6 },
});

const smallCaps = (family: string): RoleSpec => ({
  fontFamily: family,
  sizeRatio: 0.038,
  bold: false,
  italic: false,
  lineHeight: 1.2,
  trackingRatio: 0.012,
  uppercase: true,
  shadow: { blur: 18, offsetY: 4 },
});

export const COVER_TEMPLATES: CoverTemplate[] = [
  {
    id: 'roman-elegant',
    label: 'Roman élégant',
    genre: 'roman',
    description: 'Serif raffiné, titre haut, voile dégradé discret.',
    marginRatio: 0.09,
    titleTopRatio: 0.13,
    authorTopRatio: 0.86,
    gapRatio: 0.035,
    align: 'center',
    overlay: { type: 'both', opacity: 0.4 },
    titleBounds: { min: 0.04, max: 0.105 },
    title: serifTitle('"Playfair Display", Georgia, serif', 0.1),
    subtitle: { fontFamily: '"Cormorant Garamond", Georgia, serif', sizeRatio: 0.042, bold: false, italic: true, lineHeight: 1.3, trackingRatio: 0.002, opacity: 0.95, shadow: { blur: 20, offsetY: 4 } },
    author: smallCaps('"Cormorant Garamond", Georgia, serif'),
    variants: [IVORY, GOLD, NIGHT],
    preview: { titleClass: 'font-serif text-[13px] leading-tight tracking-wide', subtitleClass: 'font-serif text-[8px] italic opacity-90', authorClass: 'font-serif text-[8px] uppercase tracking-[0.2em]' },
  },
  {
    id: 'roman-litteraire',
    label: 'Roman littéraire',
    genre: 'roman',
    description: 'Titre bas, grande respiration, sobriété de maison d’édition.',
    marginRatio: 0.11,
    titleTopRatio: 0.56,
    authorTopRatio: 0.88,
    gapRatio: 0.03,
    align: 'left',
    overlay: { type: 'bottom', opacity: 0.5 },
    titleBounds: { min: 0.038, max: 0.088 },
    title: serifTitle('"Libre Baskerville", Georgia, serif', 0.082),
    subtitle: { fontFamily: '"EB Garamond", Georgia, serif', sizeRatio: 0.036, bold: false, italic: true, lineHeight: 1.35, trackingRatio: 0.001, opacity: 0.9 },
    author: smallCaps('"EB Garamond", Georgia, serif'),
    variants: [IVORY, INK, FOREST],
    preview: { titleClass: 'font-serif text-[12px] leading-tight text-left', subtitleClass: 'font-serif text-[8px] italic text-left opacity-90', authorClass: 'font-serif text-[8px] uppercase tracking-[0.2em] text-left' },
  },
  {
    id: 'thriller-cinema',
    label: 'Thriller cinématographique',
    genre: 'thriller',
    description: 'Titre massif, contour et ombre, contraste maximal.',
    marginRatio: 0.08,
    titleTopRatio: 0.11,
    authorTopRatio: 0.87,
    gapRatio: 0.045,
    align: 'center',
    overlay: { type: 'bottom', opacity: 0.55 },
    titleBounds: { min: 0.044, max: 0.118 },
    title: { fontFamily: '"Archivo Black", Impact, sans-serif', sizeRatio: 0.112, bold: true, italic: false, lineHeight: 1.02, trackingRatio: 0, uppercase: true, shadow: { blur: 40, offsetY: 10 }, outline: { widthRatio: 0.004 }, band: { opacity: 0.5, padRatio: 0.02 } },
    subtitle: { fontFamily: 'Oswald, Impact, sans-serif', sizeRatio: 0.034, bold: false, italic: false, lineHeight: 1.45, trackingRatio: 0.008, uppercase: true, opacity: 0.95, shadow: { blur: 22, offsetY: 4 } },
    author: { fontFamily: 'Oswald, Impact, sans-serif', sizeRatio: 0.04, bold: true, italic: false, lineHeight: 1.2, trackingRatio: 0.01, uppercase: true, shadow: { blur: 24, offsetY: 6 } },
    variants: [INK, BLOOD, ICE],
    preview: { titleClass: 'font-sans font-black text-[13px] uppercase leading-none', subtitleClass: 'font-sans text-[7px] uppercase tracking-[0.3em] opacity-90', authorClass: 'font-sans font-bold text-[8px] uppercase tracking-[0.2em]', bandClass: 'bg-black/60' },
  },
  {
    id: 'polar-nordique',
    label: 'Polar nordique',
    genre: 'thriller',
    description: 'Titre condensé en bas, voile froid, ambiance glaciale.',
    marginRatio: 0.09,
    titleTopRatio: 0.6,
    authorTopRatio: 0.9,
    gapRatio: 0.03,
    align: 'center',
    overlay: { type: 'both', opacity: 0.5 },
    titleBounds: { min: 0.042, max: 0.1 },
    title: { fontFamily: '"Bebas Neue", Impact, sans-serif', sizeRatio: 0.1, bold: false, italic: false, lineHeight: 1.0, trackingRatio: 0.006, uppercase: true, shadow: { blur: 30, offsetY: 8 } },
    subtitle: { fontFamily: 'Montserrat, Arial, sans-serif', sizeRatio: 0.03, bold: false, italic: false, lineHeight: 1.4, trackingRatio: 0.01, uppercase: true, opacity: 0.9 },
    author: { fontFamily: 'Montserrat, Arial, sans-serif', sizeRatio: 0.036, bold: true, italic: false, lineHeight: 1.2, trackingRatio: 0.012, uppercase: true },
    variants: [ICE, INK, NIGHT],
    preview: { titleClass: 'font-sans text-[13px] uppercase tracking-wide leading-none', subtitleClass: 'font-sans text-[7px] uppercase tracking-[0.3em] opacity-90', authorClass: 'font-sans font-bold text-[8px] uppercase tracking-[0.2em]' },
  },
  {
    id: 'romance-douce',
    label: 'Romance douce',
    genre: 'romance',
    description: 'Serif fin, titre centré haut, voile rosé lumineux.',
    marginRatio: 0.1,
    titleTopRatio: 0.14,
    authorTopRatio: 0.87,
    gapRatio: 0.03,
    align: 'center',
    overlay: { type: 'top', opacity: 0.35 },
    titleBounds: { min: 0.042, max: 0.1 },
    title: serifTitle('"Cormorant Garamond", Georgia, serif', 0.098),
    subtitle: { fontFamily: '"Josefin Sans", Arial, sans-serif', sizeRatio: 0.032, bold: false, italic: false, lineHeight: 1.4, trackingRatio: 0.014, uppercase: true, opacity: 0.95 },
    author: smallCaps('"Josefin Sans", Arial, sans-serif'),
    variants: [ROSE, IVORY, GOLD],
    preview: { titleClass: 'font-serif text-[13px] leading-tight', subtitleClass: 'font-sans text-[7px] uppercase tracking-[0.3em] opacity-90', authorClass: 'font-sans text-[8px] uppercase tracking-[0.2em]' },
  },
  {
    id: 'romance-moderne',
    label: 'Romance moderne',
    genre: 'romance',
    description: 'Titre italique manuscrit, bandeau clair, sous-titre discret.',
    marginRatio: 0.1,
    titleTopRatio: 0.52,
    authorTopRatio: 0.88,
    gapRatio: 0.028,
    align: 'center',
    overlay: { type: 'bottom', opacity: 0.4 },
    titleBounds: { min: 0.044, max: 0.104 },
    title: { fontFamily: 'Lora, Georgia, serif', sizeRatio: 0.1, bold: false, italic: true, lineHeight: 1.1, trackingRatio: 0.002, shadow: { blur: 26, offsetY: 6 }, band: { opacity: 0.3, padRatio: 0.016 } },
    subtitle: { fontFamily: 'Raleway, Arial, sans-serif', sizeRatio: 0.03, bold: false, italic: false, lineHeight: 1.4, trackingRatio: 0.012, uppercase: true, opacity: 0.95 },
    author: { fontFamily: 'Raleway, Arial, sans-serif', sizeRatio: 0.036, bold: true, italic: false, lineHeight: 1.2, trackingRatio: 0.01, uppercase: true },
    variants: [ROSE, VIOLET, IVORY],
    preview: { titleClass: 'font-serif italic text-[13px] leading-tight', subtitleClass: 'font-sans text-[7px] uppercase tracking-[0.3em]', authorClass: 'font-sans font-bold text-[8px] uppercase tracking-[0.2em]', bandClass: 'bg-white/15' },
  },
  {
    id: 'fantasy-epique',
    label: 'Fantasy épique',
    genre: 'fantasy',
    description: 'Titrage gravé, majuscules espacées, voile profond.',
    marginRatio: 0.09,
    titleTopRatio: 0.1,
    authorTopRatio: 0.89,
    gapRatio: 0.035,
    align: 'center',
    overlay: { type: 'both', opacity: 0.45 },
    titleBounds: { min: 0.04, max: 0.098 },
    title: { fontFamily: 'Cinzel, Georgia, serif', sizeRatio: 0.096, bold: true, italic: false, lineHeight: 1.12, trackingRatio: 0.01, uppercase: true, shadow: { blur: 36, offsetY: 8 } },
    subtitle: { fontFamily: '"EB Garamond", Georgia, serif', sizeRatio: 0.034, bold: false, italic: true, lineHeight: 1.35, trackingRatio: 0.006, opacity: 0.92 },
    author: smallCaps('Cinzel, Georgia, serif'),
    variants: [GOLD, FOREST, VIOLET],
    preview: { titleClass: 'font-serif font-bold text-[12px] uppercase tracking-[0.15em] leading-tight', subtitleClass: 'font-serif italic text-[8px] opacity-90', authorClass: 'font-serif text-[8px] uppercase tracking-[0.2em]' },
  },
  {
    id: 'developpement-lumineux',
    label: 'Développement lumineux',
    genre: 'developpement',
    description: 'Grand titre net, bandeau contrasté, promesse lisible.',
    marginRatio: 0.09,
    titleTopRatio: 0.12,
    authorTopRatio: 0.88,
    gapRatio: 0.032,
    align: 'center',
    overlay: { type: 'full', opacity: 0.28 },
    titleBounds: { min: 0.042, max: 0.102 },
    title: { fontFamily: 'Montserrat, Arial, sans-serif', sizeRatio: 0.098, bold: true, italic: false, lineHeight: 1.12, trackingRatio: 0, band: { opacity: 0.42, padRatio: 0.022 } },
    subtitle: { fontFamily: '"Work Sans", Arial, sans-serif', sizeRatio: 0.034, bold: false, italic: false, lineHeight: 1.35, trackingRatio: 0.003 },
    author: { fontFamily: '"Work Sans", Arial, sans-serif', sizeRatio: 0.036, bold: true, italic: false, lineHeight: 1.2, trackingRatio: 0.006, band: { opacity: 0.35, padRatio: 0.012 } },
    variants: [SUN, TEAL, VIOLET],
    preview: { titleClass: 'font-sans font-bold text-[12px] leading-tight', subtitleClass: 'font-sans text-[7px] opacity-90', authorClass: 'font-sans text-[8px] font-semibold', bandClass: 'bg-white/15' },
  },
  {
    id: 'developpement-minimal',
    label: 'Développement minimal',
    genre: 'developpement',
    description: 'Typographie fine, alignement à gauche, beaucoup de vide.',
    marginRatio: 0.12,
    titleTopRatio: 0.16,
    authorTopRatio: 0.9,
    gapRatio: 0.03,
    align: 'left',
    overlay: { type: 'full', opacity: 0.2 },
    titleBounds: { min: 0.038, max: 0.09 },
    title: { fontFamily: 'Inter, Arial, sans-serif', sizeRatio: 0.086, bold: true, italic: false, lineHeight: 1.14, trackingRatio: -0.001 },
    subtitle: { fontFamily: 'Inter, Arial, sans-serif', sizeRatio: 0.03, bold: false, italic: false, lineHeight: 1.45, trackingRatio: 0.004, opacity: 0.9 },
    author: { fontFamily: 'Inter, Arial, sans-serif', sizeRatio: 0.032, bold: false, italic: false, lineHeight: 1.2, trackingRatio: 0.012, uppercase: true },
    variants: [IVORY, TEAL, INK],
    preview: { titleClass: 'font-sans font-bold text-[12px] leading-tight text-left', subtitleClass: 'font-sans text-[7px] text-left opacity-90', authorClass: 'font-sans text-[8px] uppercase tracking-[0.2em] text-left' },
  },
  {
    id: 'guide-moderne',
    label: 'Guide moderne',
    genre: 'guide',
    description: 'Sans serif net, bandeau semi-transparent, structure claire.',
    marginRatio: 0.09,
    titleTopRatio: 0.12,
    authorTopRatio: 0.87,
    gapRatio: 0.04,
    align: 'center',
    overlay: { type: 'full', opacity: 0.28 },
    titleBounds: { min: 0.04, max: 0.098 },
    title: { fontFamily: 'Montserrat, Arial, sans-serif', sizeRatio: 0.094, bold: true, italic: false, lineHeight: 1.12, trackingRatio: 0, band: { opacity: 0.42, padRatio: 0.022 } },
    subtitle: { fontFamily: '"Work Sans", Arial, sans-serif', sizeRatio: 0.036, bold: false, italic: false, lineHeight: 1.35, trackingRatio: 0.003 },
    author: { fontFamily: '"Work Sans", Arial, sans-serif', sizeRatio: 0.038, bold: true, italic: false, lineHeight: 1.2, trackingRatio: 0.006, band: { opacity: 0.35, padRatio: 0.012 } },
    variants: [TEAL, INK, SUN],
    preview: { titleClass: 'font-sans font-bold text-[12px] leading-tight', subtitleClass: 'font-sans text-[7px] opacity-90', authorClass: 'font-sans text-[8px] font-semibold', bandClass: 'bg-white/15' },
  },
  {
    id: 'guide-pratique-etapes',
    label: 'Guide pratique',
    genre: 'guide',
    description: 'Titre en deux temps, bandeau plein largeur, très lisible.',
    marginRatio: 0.08,
    titleTopRatio: 0.5,
    authorTopRatio: 0.9,
    gapRatio: 0.026,
    align: 'center',
    overlay: { type: 'bottom', opacity: 0.5 },
    titleBounds: { min: 0.042, max: 0.1 },
    title: { fontFamily: '"Work Sans", Arial, sans-serif', sizeRatio: 0.096, bold: true, italic: false, lineHeight: 1.1, trackingRatio: 0, band: { opacity: 0.55, padRatio: 0.024 } },
    subtitle: { fontFamily: '"Work Sans", Arial, sans-serif', sizeRatio: 0.032, bold: false, italic: false, lineHeight: 1.4, trackingRatio: 0.008, uppercase: true },
    author: { fontFamily: '"Work Sans", Arial, sans-serif', sizeRatio: 0.034, bold: true, italic: false, lineHeight: 1.2, trackingRatio: 0.008, uppercase: true },
    variants: [TEAL, FOREST, INK],
    preview: { titleClass: 'font-sans font-bold text-[12px] leading-tight', subtitleClass: 'font-sans text-[7px] uppercase tracking-[0.2em]', authorClass: 'font-sans font-bold text-[8px] uppercase', bandClass: 'bg-black/50' },
  },
  {
    id: 'business-autorite',
    label: 'Business autorité',
    genre: 'business',
    description: 'Bloc titre à gauche, majuscules serrées, ton corporate.',
    marginRatio: 0.09,
    titleTopRatio: 0.15,
    authorTopRatio: 0.89,
    gapRatio: 0.03,
    align: 'left',
    overlay: { type: 'full', opacity: 0.34 },
    titleBounds: { min: 0.04, max: 0.096 },
    title: { fontFamily: 'Oswald, Impact, sans-serif', sizeRatio: 0.094, bold: true, italic: false, lineHeight: 1.06, trackingRatio: 0.002, uppercase: true, band: { opacity: 0.4, padRatio: 0.018 } },
    subtitle: { fontFamily: 'Inter, Arial, sans-serif', sizeRatio: 0.03, bold: false, italic: false, lineHeight: 1.45, trackingRatio: 0.006 },
    author: { fontFamily: 'Inter, Arial, sans-serif', sizeRatio: 0.032, bold: true, italic: false, lineHeight: 1.2, trackingRatio: 0.01, uppercase: true },
    variants: [INK, TEAL, GOLD],
    preview: { titleClass: 'font-sans font-bold text-[12px] uppercase leading-none text-left', subtitleClass: 'font-sans text-[7px] text-left opacity-90', authorClass: 'font-sans font-bold text-[8px] uppercase text-left', bandClass: 'bg-black/40' },
  },
  {
    id: 'jeunesse-joyeuse',
    label: 'Jeunesse joyeuse',
    genre: 'jeunesse',
    description: 'Titre arrondi, contour épais, couleurs franches.',
    marginRatio: 0.08,
    titleTopRatio: 0.08,
    authorTopRatio: 0.9,
    gapRatio: 0.03,
    align: 'center',
    overlay: { type: 'none', opacity: 0 },
    titleBounds: { min: 0.05, max: 0.125 },
    title: { fontFamily: '"Baloo 2", "Comic Sans MS", cursive', sizeRatio: 0.12, bold: true, italic: false, lineHeight: 1.05, trackingRatio: 0.002, outline: { widthRatio: 0.007 }, shadow: { blur: 18, offsetY: 8 } },
    subtitle: { fontFamily: '"Baloo 2", "Comic Sans MS", cursive', sizeRatio: 0.04, bold: false, italic: false, lineHeight: 1.3, trackingRatio: 0.004, outline: { widthRatio: 0.003 } },
    author: { fontFamily: '"Baloo 2", "Comic Sans MS", cursive', sizeRatio: 0.042, bold: true, italic: false, lineHeight: 1.2, trackingRatio: 0.004, outline: { widthRatio: 0.003 } },
    variants: [CANDY, SUN, ROSE],
    preview: { titleClass: 'font-sans font-black text-[13px] leading-none', subtitleClass: 'font-sans text-[8px]', authorClass: 'font-sans font-bold text-[8px]' },
  },
  {
    id: 'cuisine-gourmande',
    label: 'Cuisine gourmande',
    genre: 'cuisine',
    description: 'Bandeau bas généreux, serif chaleureux, appétit garanti.',
    marginRatio: 0.09,
    titleTopRatio: 0.62,
    authorTopRatio: 0.9,
    gapRatio: 0.026,
    align: 'center',
    overlay: { type: 'bottom', opacity: 0.45 },
    titleBounds: { min: 0.044, max: 0.104 },
    title: { fontFamily: '"Abril Fatface", Georgia, serif', sizeRatio: 0.1, bold: false, italic: false, lineHeight: 1.08, trackingRatio: 0.002, shadow: { blur: 24, offsetY: 6 }, band: { opacity: 0.45, padRatio: 0.02 } },
    subtitle: { fontFamily: 'Raleway, Arial, sans-serif', sizeRatio: 0.032, bold: false, italic: false, lineHeight: 1.4, trackingRatio: 0.012, uppercase: true },
    author: { fontFamily: 'Raleway, Arial, sans-serif', sizeRatio: 0.034, bold: true, italic: false, lineHeight: 1.2, trackingRatio: 0.01, uppercase: true },
    variants: [SUN, FOREST, IVORY],
    preview: { titleClass: 'font-serif text-[13px] leading-tight', subtitleClass: 'font-sans text-[7px] uppercase tracking-[0.25em]', authorClass: 'font-sans font-bold text-[8px] uppercase', bandClass: 'bg-black/45' },
  },
  {
    id: 'biographie-portrait',
    label: 'Biographie portrait',
    genre: 'biographie',
    description: 'Nom en vedette, titre secondaire, élégance documentaire.',
    marginRatio: 0.1,
    titleTopRatio: 0.68,
    authorTopRatio: 0.14,
    gapRatio: 0.026,
    align: 'center',
    overlay: { type: 'both', opacity: 0.42 },
    titleBounds: { min: 0.038, max: 0.09 },
    title: serifTitle('"Crimson Pro", Georgia, serif', 0.086),
    subtitle: { fontFamily: '"Crimson Pro", Georgia, serif', sizeRatio: 0.03, bold: false, italic: true, lineHeight: 1.4, trackingRatio: 0.004, opacity: 0.92 },
    author: { fontFamily: 'Cinzel, Georgia, serif', sizeRatio: 0.05, bold: true, italic: false, lineHeight: 1.15, trackingRatio: 0.014, uppercase: true, shadow: { blur: 26, offsetY: 6 } },
    variants: [IVORY, GOLD, INK],
    preview: { titleClass: 'font-serif text-[11px] leading-tight', subtitleClass: 'font-serif italic text-[7px] opacity-90', authorClass: 'font-serif font-bold text-[10px] uppercase tracking-[0.2em]' },
  },
];

export const getTemplate = (id: string): CoverTemplate | undefined =>
  COVER_TEMPLATES.find((t) => t.id === id);

/** Ancien type conservé pour compatibilité des appels existants. */
export type CoverTemplateId = string;

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

/**
 * Applique un modèle et une variante de couleurs : conserve les textes et
 * l'illustration, remplace uniquement positions et styles. Le titre est
 * dimensionné automatiquement, le sous-titre placé après les lignes réelles du
 * titre, et tout reste dans les marges de sécurité (aucun chevauchement).
 */
export function applyTemplate(
  composition: FrontComposition,
  templateId: string,
  variantIndex = 0,
): FrontComposition {
  const tpl = getTemplate(templateId) ?? COVER_TEMPLATES[0];
  const variant = tpl.variants[variantIndex] ?? tpl.variants[0];
  const { width: W, height: H } = composition.canvas;
  const margin = Math.round(W * tpl.marginRatio);
  const boxWidth = W - margin * 2;

  const rawTitle = textOf(composition, 'title', 'Titre du livre');
  const rawSubtitle = textOf(composition, 'subtitle', '');
  const rawAuthor = textOf(composition, 'author', '');

  const titleSize = autoTitleFontSize(rawTitle, boxWidth, {
    min: Math.round(W * tpl.titleBounds.min),
    max: Math.round(W * tpl.titleBounds.max),
  });

  const build = (
    role: TextRole,
    rawText: string,
    spec: RoleSpec,
    fontSize: number,
    y: number,
    color: string,
  ): FrontTextLayer => ({
    id: idOf(composition, role) ?? newId(),
    role,
    text: spec.uppercase ? rawText.toLocaleUpperCase('fr-FR') : rawText,
    x: margin,
    y: Math.max(margin, Math.min(Math.round(y), H - margin - fontSize)),
    width: boxWidth,
    fontFamily: spec.fontFamily,
    fontSize,
    color,
    align: tpl.align,
    bold: spec.bold,
    italic: spec.italic,
    lineHeight: spec.lineHeight,
    letterSpacing: Math.round(W * spec.trackingRatio),
    opacity: spec.opacity ?? 1,
    shadow: spec.shadow
      ? { enabled: true, color: '#000000', blur: spec.shadow.blur, offsetY: spec.shadow.offsetY }
      : undefined,
    outline: spec.outline
      ? { enabled: true, color: variant.overlayColor, width: Math.round(W * spec.outline.widthRatio) }
      : undefined,
    band: spec.band
      ? {
          enabled: true,
          color: variant.bandColor,
          opacity: spec.band.opacity,
          padY: Math.round(H * spec.band.padRatio),
        }
      : undefined,
  });

  const titleTop = H * tpl.titleTopRatio;
  const titleLines = estimateLines(rawTitle, titleSize, boxWidth);
  const titleHeight = titleLines * titleSize * tpl.title.lineHeight;
  const subtitleSize = Math.round(W * tpl.subtitle.sizeRatio);
  const authorSize = Math.round(W * tpl.author.sizeRatio);
  const subtitleTop = titleTop + titleHeight + H * tpl.gapRatio;
  const authorTop = Math.min(
    H * tpl.authorTopRatio,
    H - margin - authorSize * tpl.author.lineHeight,
  );

  const layers: FrontTextLayer[] = [
    build('title', rawTitle, tpl.title, titleSize, titleTop, variant.title),
  ];
  if (rawSubtitle) {
    layers.push(build('subtitle', rawSubtitle, tpl.subtitle, subtitleSize, subtitleTop, variant.subtitle));
  }
  if (rawAuthor) {
    layers.push(build('author', rawAuthor, tpl.author, authorSize, authorTop, variant.author));
  }

  return {
    ...composition,
    version: FRONT_COMPOSITION_VERSION,
    styleVersion: FRONT_STYLE_VERSION,
    templateId: tpl.id,
    overlay:
      tpl.overlay.type === 'none'
        ? { type: 'none', color: variant.overlayColor, opacity: 0 }
        : { type: tpl.overlay.type, color: variant.overlayColor, opacity: tpl.overlay.opacity },
    layers,
  };
}

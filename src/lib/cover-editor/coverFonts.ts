/**
 * Bibliothèque de polices professionnelles du studio de couverture.
 *
 * Les polices sont chargées depuis Google Fonts uniquement quand elles sont
 * réellement utilisées, avec une pile de repli sûre. Avant chaque export, on
 * attend `document.fonts.ready` afin que le JPEG / PNG / PDF utilise bien la
 * police affichée dans l'éditeur.
 *
 * Aucun appel IA, aucun crédit, aucune écriture en base ici.
 */

export type FontCategory = 'serif' | 'sans' | 'display';

export interface CoverFont {
  /** Pile CSS complète, stockée telle quelle dans la composition. */
  value: string;
  label: string;
  category: FontCategory;
  /** Nom Google Fonts (absent = police système). */
  google?: string;
  /** Graisses chargées. */
  weights?: number[];
}

export const COVER_FONTS: CoverFont[] = [
  // ---- Serif ----
  { value: '"Playfair Display", Georgia, serif', label: 'Playfair Display', category: 'serif', google: 'Playfair+Display', weights: [400, 700, 900] },
  { value: '"Cormorant Garamond", Georgia, serif', label: 'Cormorant Garamond', category: 'serif', google: 'Cormorant+Garamond', weights: [400, 600, 700] },
  { value: '"Libre Baskerville", Georgia, serif', label: 'Libre Baskerville', category: 'serif', google: 'Libre+Baskerville', weights: [400, 700] },
  { value: '"EB Garamond", Georgia, serif', label: 'EB Garamond', category: 'serif', google: 'EB+Garamond', weights: [400, 600, 700] },
  { value: 'Lora, Georgia, serif', label: 'Lora', category: 'serif', google: 'Lora', weights: [400, 600, 700] },
  { value: '"Crimson Pro", Georgia, serif', label: 'Crimson Pro', category: 'serif', google: 'Crimson+Pro', weights: [400, 600, 700] },
  { value: 'Georgia, serif', label: 'Georgia (système)', category: 'serif' },

  // ---- Sans ----
  { value: 'Montserrat, Arial, sans-serif', label: 'Montserrat', category: 'sans', google: 'Montserrat', weights: [400, 600, 800, 900] },
  { value: 'Raleway, Arial, sans-serif', label: 'Raleway', category: 'sans', google: 'Raleway', weights: [400, 600, 800] },
  { value: '"Work Sans", Arial, sans-serif', label: 'Work Sans', category: 'sans', google: 'Work+Sans', weights: [400, 600, 700] },
  { value: 'Inter, Arial, sans-serif', label: 'Inter', category: 'sans', google: 'Inter', weights: [400, 600, 800] },
  { value: '"Josefin Sans", Arial, sans-serif', label: 'Josefin Sans', category: 'sans', google: 'Josefin+Sans', weights: [400, 600, 700] },
  { value: 'Arial, Helvetica, sans-serif', label: 'Arial (système)', category: 'sans' },

  // ---- Display / titrage ----
  { value: '"Bebas Neue", Impact, sans-serif', label: 'Bebas Neue', category: 'display', google: 'Bebas+Neue', weights: [400] },
  { value: '"Archivo Black", Impact, sans-serif', label: 'Archivo Black', category: 'display', google: 'Archivo+Black', weights: [400] },
  { value: 'Oswald, Impact, sans-serif', label: 'Oswald', category: 'display', google: 'Oswald', weights: [400, 600, 700] },
  { value: '"Abril Fatface", Georgia, serif', label: 'Abril Fatface', category: 'display', google: 'Abril+Fatface', weights: [400] },
  { value: 'Cinzel, Georgia, serif', label: 'Cinzel', category: 'display', google: 'Cinzel', weights: [400, 700, 900] },
  { value: '"Baloo 2", "Comic Sans MS", cursive', label: 'Baloo 2 (jeunesse)', category: 'display', google: 'Baloo+2', weights: [400, 600, 800] },
];

export const FONT_CATEGORY_LABEL: Record<FontCategory, string> = {
  serif: 'Serif — romans, biographies',
  sans: 'Sans serif — guides, business',
  display: 'Titrage — thriller, jeunesse',
};

const loaded = new Set<string>();

/** Injecte (une seule fois) la feuille Google Fonts d'une police. */
export function loadCoverFont(value: string): void {
  if (typeof document === 'undefined') return;
  const font = COVER_FONTS.find((f) => f.value === value);
  if (!font?.google || loaded.has(font.google)) return;
  loaded.add(font.google);
  const weights = (font.weights ?? [400, 700]).join(';');
  const href = `https://fonts.googleapis.com/css2?family=${font.google}:wght@${weights}&display=swap`;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.dataset.coverFont = font.google;
  document.head.appendChild(link);
}

/** Précharge toutes les polices de la bibliothèque (aperçus du sélecteur). */
export function loadAllCoverFonts(): void {
  COVER_FONTS.forEach((f) => loadCoverFont(f.value));
}

/**
 * Attend que les polices utilisées par la composition soient réellement
 * disponibles. Indispensable avant tout export canevas.
 */
export async function ensureFontsReady(families: string[]): Promise<void> {
  if (typeof document === 'undefined') return;
  families.forEach(loadCoverFont);
  const fontSet = (document as Document & { fonts?: FontFaceSet }).fonts;
  if (!fontSet) return;
  try {
    await Promise.all(
      families.map((family) => fontSet.load(`700 96px ${family}`).catch(() => undefined)),
    );
    await fontSet.ready;
  } catch {
    /* police indisponible : le repli système est utilisé */
  }
}

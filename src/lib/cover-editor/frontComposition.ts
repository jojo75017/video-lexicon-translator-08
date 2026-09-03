/**
 * Étape 4A — modèle de composition de la PREMIÈRE de couverture.
 *
 * Module totalement isolé : il ne dépend d'aucun ancien générateur de couverture
 * et n'utilise aucun code Fabric historique.
 *
 * Règles strictes :
 *  - aucune URL signée n'est jamais stockée dans la composition (uniquement le
 *    chemin privé stable de l'illustration) ;
 *  - aucun appel IA, aucun crédit consommé ;
 *  - pas de dos, pas de 4ᵉ de couverture, pas de calcul KDP, pas d'ISBN.
 */

export const FRONT_COMPOSITION_VERSION = 1 as const;

/**
 * Version des STYLES (indépendante de `version`, déjà utilisée par la
 * composition brochée). Permet d'ajouter ombre / contour / opacité / voile
 * sans casser les deux types de documents.
 */
export const FRONT_STYLE_VERSION = 1 as const;

export type TextRole = 'title' | 'subtitle' | 'author';
export type TextAlign = 'left' | 'center' | 'right';

/** Voile (bandeau) dessiné derrière un texte pour garantir la lisibilité. */
export interface LayerBand {
  enabled: boolean;
  color: string;
  /** 0 → 1 */
  opacity: number;
  /** marge intérieure verticale, en pixels du canevas */
  padY: number;
}

export interface FrontTextLayer {
  id: string;
  role: TextRole;
  text: string;
  /** Coordonnées et largeur exprimées en pixels du canevas réel. */
  x: number;
  y: number
  ;
  width: number;
  fontFamily: string;
  fontSize: number;
  color: string;
  align: TextAlign;
  bold: boolean;
  italic: boolean;
  lineHeight: number;
  /* ---- styles optionnels (styleVersion 1) ---- */
  /** 0 → 1 */
  opacity?: number;
  /** espacement des lettres en pixels du canevas */
  letterSpacing?: number;
  shadow?: { enabled: boolean; color: string; blur: number; offsetY: number };
  outline?: { enabled: boolean; color: string; width: number };
  band?: LayerBand;
}

/** Voile global appliqué au-dessus de l'illustration. */
export interface FrontOverlay {
  type: 'none' | 'top' | 'bottom' | 'both' | 'full';
  color: string;
  /** 0 → 1 */
  opacity: number;
}

export interface FrontComposition {
  version: typeof FRONT_COMPOSITION_VERSION;
  /** Version des styles, sans lien avec `version`. */
  styleVersion?: typeof FRONT_STYLE_VERSION;
  /** Chemin privé stable (bucket `covers`) — JAMAIS une URL signée. */
  illustrationPath: string | null;
  canvas: { width: number; height: number };
  /** Couleur de fond visible sous l'illustration (ou seule si aucune image). */
  backgroundColor: string;
  overlay?: FrontOverlay;
  /** Identifiant du dernier modèle appliqué (informatif). */
  templateId?: string | null;
  layers: FrontTextLayer[];
}

export const DEFAULT_FRONT_BACKGROUND = '#111827';


/* ------------------------------------------------------------------ */
/* Dimensions réelles (première de couverture uniquement)             */
/* ------------------------------------------------------------------ */

export interface FrontCanvasSize {
  width: number;
  height: number;
  label: string;
}

const FRONT_SIZES: Record<string, FrontCanvasSize> = {
  'ebook-kindle': { width: 1600, height: 2560, label: 'eBook Kindle · 1600 × 2560 px' },
  'broche-wrap': { width: 1800, height: 2700, label: 'Broché · 1800 × 2700 px (recto)' },
  hardcover: { width: 1800, height: 2700, label: 'Relié · 1800 × 2700 px (recto)' },
};

export const getFrontCanvasSize = (formatId: string): FrontCanvasSize =>
  FRONT_SIZES[formatId] ?? FRONT_SIZES['ebook-kindle'];

/* ------------------------------------------------------------------ */
/* Polices proposées                                                  */
/* ------------------------------------------------------------------ */

export const FRONT_FONTS = [
  { value: 'Georgia, serif', label: 'Georgia (serif)' },
  { value: '"Times New Roman", serif', label: 'Times New Roman' },
  { value: '"Playfair Display", Georgia, serif', label: 'Playfair Display' },
  { value: 'Arial, Helvetica, sans-serif', label: 'Arial' },
  { value: '"Helvetica Neue", Arial, sans-serif', label: 'Helvetica Neue' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: '"Courier New", monospace', label: 'Courier New' },
] as const;

export const ROLE_LABEL: Record<TextRole, string> = {
  title: 'Titre',
  subtitle: 'Sous-titre',
  author: 'Nom de l’auteur',
};

/* ------------------------------------------------------------------ */
/* Création / normalisation                                           */
/* ------------------------------------------------------------------ */

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `l-${Math.random().toString(36).slice(2)}-${Date.now()}`;

export function defaultLayer(
  role: TextRole,
  canvas: { width: number; height: number },
  text?: string,
): FrontTextLayer {
  const margin = Math.round(canvas.width * 0.1);
  const width = canvas.width - margin * 2;
  const base: Record<TextRole, Partial<FrontTextLayer>> = {
    title: {
      y: Math.round(canvas.height * 0.1),
      fontSize: Math.round(canvas.width * 0.11),
      bold: true,
      fontFamily: 'Georgia, serif',
    },
    subtitle: {
      y: Math.round(canvas.height * 0.31),
      fontSize: Math.round(canvas.width * 0.05),
      fontFamily: 'Arial, Helvetica, sans-serif',
    },
    author: {
      y: Math.round(canvas.height * 0.85),
      fontSize: Math.round(canvas.width * 0.055),
      fontFamily: 'Georgia, serif',
    },
  };
  return {
    id: newId(),
    role,
    text: text ?? ROLE_LABEL[role],
    x: margin,
    width,
    color: '#FFFFFF',
    align: 'center',
    bold: false,
    italic: false,
    lineHeight: 1.15,
    y: 0,
    fontSize: 64,
    fontFamily: 'Georgia, serif',
    ...base[role],
  } as FrontTextLayer;
}

export function createComposition(params: {
  formatId: string;
  illustrationPath: string | null;
  bookTitle?: string | null;
}): FrontComposition {
  const size = getFrontCanvasSize(params.formatId);
  return {
    version: FRONT_COMPOSITION_VERSION,
    illustrationPath: params.illustrationPath ?? null,
    canvas: { width: size.width, height: size.height },
    backgroundColor: DEFAULT_FRONT_BACKGROUND,
    layers: [
      defaultLayer('title', size, params.bookTitle?.trim() || 'Titre du livre'),
      defaultLayer('subtitle', size, 'Sous-titre'),
      defaultLayer('author', size, 'Nom de l’auteur'),
    ],
  };
}

const num = (v: unknown, fallback: number) =>
  typeof v === 'number' && Number.isFinite(v) ? v : fallback;

const str = (v: unknown, fallback: string) =>
  typeof v === 'string' && v.length ? v : fallback;

/** Interdit toute URL (signée ou non) dans les valeurs textuelles persistées. */
const looksLikeUrl = (value: string) => /https?:\/\//i.test(value) || /token=/i.test(value);

/**
 * Relit une composition venant de la base sans jamais faire confiance au contenu.
 * Toute URL éventuellement présente est supprimée.
 */
export function parseComposition(
  raw: unknown,
  fallback: { formatId: string; illustrationPath: string | null; bookTitle?: string | null },
): FrontComposition {
  const size = getFrontCanvasSize(fallback.formatId);
  if (!raw || typeof raw !== 'object') return createComposition(fallback);

  const obj = raw as Record<string, unknown>;
  const canvasRaw = (obj.canvas ?? {}) as Record<string, unknown>;
  const canvas = {
    width: num(canvasRaw.width, size.width),
    height: num(canvasRaw.height, size.height),
  };

  const layersRaw = Array.isArray(obj.layers) ? obj.layers : [];
  const layers: FrontTextLayer[] = layersRaw
    .filter((l): l is Record<string, unknown> => Boolean(l) && typeof l === 'object')
    .map((l) => {
      const role = (['title', 'subtitle', 'author'] as TextRole[]).includes(l.role as TextRole)
        ? (l.role as TextRole)
        : 'title';
      const base = defaultLayer(role, canvas);
      const text = str(l.text, base.text);
      return {
        ...base,
        id: str(l.id, base.id),
        role,
        text: looksLikeUrl(text) ? '' : text,
        x: num(l.x, base.x),
        y: num(l.y, base.y),
        width: num(l.width, base.width),
        fontFamily: str(l.fontFamily, base.fontFamily),
        fontSize: num(l.fontSize, base.fontSize),
        color: str(l.color, base.color),
        align: (['left', 'center', 'right'] as TextAlign[]).includes(l.align as TextAlign)
          ? (l.align as TextAlign)
          : base.align,
        bold: Boolean(l.bold),
        italic: Boolean(l.italic),
        lineHeight: num(l.lineHeight, base.lineHeight),
      };
    });

  const illustrationPath =
    typeof obj.illustrationPath === 'string' && !looksLikeUrl(obj.illustrationPath)
      ? obj.illustrationPath
      : fallback.illustrationPath ?? null;

  return {
    version: FRONT_COMPOSITION_VERSION,
    illustrationPath,
    canvas,
    backgroundColor:
      typeof obj.backgroundColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(obj.backgroundColor)
        ? obj.backgroundColor
        : DEFAULT_FRONT_BACKGROUND,
    layers: layers.length ? layers : createComposition(fallback).layers,
  };
}

/** Version sérialisable : aucune URL, uniquement des chemins privés. */
export function serializeComposition(
  composition: FrontComposition,
  illustrationPath: string | null,
): FrontComposition {
  return {
    version: FRONT_COMPOSITION_VERSION,
    illustrationPath: illustrationPath && !looksLikeUrl(illustrationPath) ? illustrationPath : null,
    canvas: { ...composition.canvas },
    backgroundColor: /^#[0-9a-fA-F]{6}$/.test(composition.backgroundColor ?? '')
      ? composition.backgroundColor
      : DEFAULT_FRONT_BACKGROUND,
    layers: composition.layers.map((l) => ({
      ...l,
      text: looksLikeUrl(l.text) ? '' : l.text,
    })),
  };
}

/* ------------------------------------------------------------------ */
/* Rendu canevas (miniature privée)                                   */
/* ------------------------------------------------------------------ */

const wrapLines = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] => {
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
 * Dessine la composition (fond + textes) puis renvoie un JPEG de miniature.
 * `backgroundUrl` est une URL signée temporaire utilisée uniquement en mémoire.
 */
export async function renderCompositionThumbnail(
  composition: FrontComposition,
  backgroundUrl: string | null,
  targetWidth = 500,
): Promise<Blob> {
  const { width, height } = composition.canvas;
  const scale = targetWidth / width;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canevas indisponible dans ce navigateur.');

  ctx.fillStyle = composition.backgroundColor || DEFAULT_FRONT_BACKGROUND;
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
      // couverture façon object-fit: cover
      const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    } catch {
      /* fond uni conservé si l'image n'est pas lisible */
    }
  }

  ctx.textBaseline = 'top';
  for (const layer of composition.layers) {
    if (!layer.text.trim()) continue;
    const fontSize = layer.fontSize * scale;
    const weight = layer.bold ? '700' : '400';
    const style = layer.italic ? 'italic' : 'normal';
    ctx.font = `${style} ${weight} ${fontSize}px ${layer.fontFamily}`;
    ctx.fillStyle = layer.color;
    ctx.textAlign = layer.align === 'center' ? 'center' : layer.align === 'right' ? 'right' : 'left';

    const boxX = layer.x * scale;
    const boxWidth = layer.width * scale;
    const anchorX =
      layer.align === 'center' ? boxX + boxWidth / 2 : layer.align === 'right' ? boxX + boxWidth : boxX;

    const lines = wrapLines(ctx, layer.text, boxWidth);
    let y = layer.y * scale;
    for (const line of lines) {
      ctx.fillText(line, anchorX, y);
      y += fontSize * layer.lineHeight;
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

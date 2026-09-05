/**
 * Assistant « Couverture en 3 étapes » — construction des propositions.
 *
 * Aucune nouveauté technique : on réutilise strictement les modèles de
 * référence déjà validés (`referenceTemplates.ts`) et le moteur de rendu
 * partagé (`frontComposition.ts`). Aucun appel réseau ici, aucun crédit.
 */
import {
  createComposition,
  type FrontComposition,
} from '@/lib/cover-editor/frontComposition';
import {
  applyReferenceTemplate,
  REFERENCE_TEMPLATES,
  type ReferenceTemplateId,
} from '@/lib/cover-editor/referenceTemplates';

export interface ExpressGenre {
  id: string;
  label: string;
  /** Modèle recommandé, proposé en premier. */
  template: ReferenceTemplateId;
  /** Brief d'illustration prérempli (aucun terme technique visible). */
  brief: { genre: string; mood: string; palette: string; artStyle: string };
}

export const EXPRESS_GENRES: ExpressGenre[] = [
  {
    id: 'roman',
    label: 'Roman',
    template: 'ref-roman-premium',
    brief: { genre: 'roman littéraire', mood: 'intense et romanesque', palette: 'bleu nuit et or', artStyle: 'illustration-editoriale' },
  },
  {
    id: 'thriller',
    label: 'Thriller / Polar',
    template: 'ref-roman-premium',
    brief: { genre: 'thriller', mood: 'sombre et tendue', palette: 'noir, gris acier et rouge', artStyle: 'photo-cinema' },
  },
  {
    id: 'romance',
    label: 'Romance',
    template: 'ref-roman-premium',
    brief: { genre: 'romance', mood: 'douce et lumineuse', palette: 'rose poudré, crème et or', artStyle: 'illustration-editoriale' },
  },
  {
    id: 'fantasy',
    label: 'Fantasy',
    template: 'ref-roman-premium',
    brief: { genre: 'fantasy', mood: 'épique et mystérieuse', palette: 'vert profond, violet et or', artStyle: 'fantasy-doree' },
  },
  {
    id: 'developpement',
    label: 'Développement personnel',
    template: 'ref-nonfiction',
    brief: { genre: 'développement personnel', mood: 'inspirante et lumineuse', palette: 'bleu clair, blanc et or', artStyle: 'non-fiction-pro' },
  },
  {
    id: 'guide',
    label: 'Guide pratique',
    template: 'ref-guide-pro',
    brief: { genre: 'guide pratique', mood: 'claire et rassurante', palette: 'bleu marine et or', artStyle: 'non-fiction-pro' },
  },
  {
    id: 'business',
    label: 'Business',
    template: 'ref-guide-pro',
    brief: { genre: 'business', mood: 'sérieuse et premium', palette: 'anthracite, bleu et or', artStyle: 'non-fiction-pro' },
  },
  {
    id: 'jeunesse',
    label: 'Jeunesse',
    template: 'ref-nonfiction',
    brief: { genre: 'livre jeunesse', mood: 'joyeuse et colorée', palette: 'couleurs vives et chaudes', artStyle: 'illustration-editoriale' },
  },
  {
    id: 'cuisine',
    label: 'Cuisine',
    template: 'ref-nonfiction',
    brief: { genre: 'cuisine', mood: 'chaleureuse et gourmande', palette: 'bois, crème et vert', artStyle: 'photo-cinema' },
  },
  {
    id: 'biographie',
    label: 'Biographie',
    template: 'ref-roman-premium',
    brief: { genre: 'biographie', mood: 'sobre et élégante', palette: 'sépia, ivoire et or', artStyle: 'illustration-editoriale' },
  },
];

export const getExpressGenre = (id: string): ExpressGenre =>
  EXPRESS_GENRES.find((g) => g.id === id) ?? EXPRESS_GENRES[0];

/** Ordre des trois propositions : le modèle recommandé d'abord. */
export function proposalOrder(genreId: string): ReferenceTemplateId[] {
  const recommended = getExpressGenre(genreId).template;
  const others = REFERENCE_TEMPLATES.map((t) => t.id).filter((id) => id !== recommended);
  return [recommended, ...others];
}

/** Éclaircit ou assombrit une couleur hexadécimale. */
export function shiftColor(hex: string, amount: number): string {
  const clean = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : '#111827';
  const channels = [1, 3, 5].map((i) => parseInt(clean.slice(i, i + 2), 16));
  const out = channels.map((c) => {
    const next = amount >= 0 ? c + (255 - c) * amount : c * (1 + amount);
    return Math.max(0, Math.min(255, Math.round(next)));
  });
  return `#${out.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

export interface ExpressInput {
  formatId: string;
  title: string;
  subtitle: string;
  author: string;
  illustrationPath: string | null;
  templateId: ReferenceTemplateId;
  /** -1 → plus foncé, 0 → tel quel, 1 → plus clair (par paliers de 0,12). */
  lightness?: number;
}

/**
 * Construit une composition complète prête à afficher ou à exporter :
 * textes de l'abonné + modèle de référence + réglage de luminosité.
 */
export function buildExpressComposition(input: ExpressInput): FrontComposition {
  const base = createComposition({
    formatId: input.formatId,
    illustrationPath: input.illustrationPath,
    bookTitle: input.title || 'Titre du livre',
  });

  base.layers = base.layers.map((layer) => {
    if (layer.role === 'title') return { ...layer, text: input.title || 'Titre du livre' };
    if (layer.role === 'subtitle') return { ...layer, text: input.subtitle };
    if (layer.role === 'author') return { ...layer, text: input.author };
    return layer;
  });

  const composed = applyReferenceTemplate(base, input.templateId);
  composed.illustrationPath = input.illustrationPath;
  composed.templateId = input.templateId;

  const step = (input.lightness ?? 0) * 0.12;
  if (step !== 0) {
    composed.backgroundColor = shiftColor(composed.backgroundColor, step);
    if (composed.overlay) {
      composed.overlay = {
        ...composed.overlay,
        opacity: Math.max(0, Math.min(1, composed.overlay.opacity - step)),
      };
    }
    composed.shapes = (composed.shapes ?? []).map((s) => ({
      ...s,
      color: /^#[0-9a-fA-F]{6}$/.test(s.color) ? shiftColor(s.color, step) : s.color,
      gradientTo:
        s.gradientTo && /^#[0-9a-fA-F]{6}$/.test(s.gradientTo)
          ? shiftColor(s.gradientTo, step)
          : s.gradientTo,
    }));
  }

  return composed;
}

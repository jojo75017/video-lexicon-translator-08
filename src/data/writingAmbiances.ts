// Ambiances d'écriture - 17 thèmes visuels originaux pour l'éditeur Ebookstudio Pro V2
// Inspiration: créer un confort visuel adapté au genre du livre.
// Toutes les couleurs et noms sont originaux (pas de reprise d'un produit tiers).

export type AmbianceCategory = 'claire' | 'sombre' | 'vibrante' | 'classique';

export interface WritingAmbiance {
  id: string;
  name: string;
  tagline: string;
  category: AmbianceCategory;
  recommendedFor: string;
  palette: {
    bg: string;          // fond éditeur
    surface: string;     // carte/zone de texte
    surfaceAlt: string;  // alt blocks
    text: string;        // texte principal
    textMuted: string;   // texte secondaire
    accent: string;      // couleur accent (titres, liens)
    accentText: string;  // texte sur fond accent
    headerBg: string;    // bandeau d'en-tête de la card
    headerText: string;  // texte sur bandeau
  };
  fonts: {
    headingFamily: string;
    bodyFamily: string;
    googleFontUrl?: string; // lazy-load
  };
}

export const WRITING_AMBIANCES: WritingAmbiance[] = [
  {
    id: 'atelier',
    name: 'Atelier',
    tagline: 'Le confort Ebookstudio Pro V2 par défaut',
    category: 'claire',
    recommendedFor: 'Tout type de livre · usage quotidien',
    palette: {
      bg: '#FAFAFA', surface: '#FFFFFF', surfaceAlt: '#F3F4F6',
      text: '#232F3E', textMuted: '#6B7280',
      accent: '#008296', accentText: '#FFFFFF',
      headerBg: '#008296', headerText: '#FFFFFF',
    },
    fonts: { headingFamily: 'Inter', bodyFamily: 'Inter',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap' },
  },
  {
    id: 'sepia',
    name: 'Sépia',
    tagline: 'Chaleur vintage, lecture longue',
    category: 'claire',
    recommendedFor: 'Romans, mémoires, biographies',
    palette: {
      bg: '#F4ECD8', surface: '#FBF6E8', surfaceAlt: '#EDE0C2',
      text: '#3E2C1C', textMuted: '#7A5C3A',
      accent: '#8B5A2B', accentText: '#FBF6E8',
      headerBg: '#8B5A2B', headerText: '#FBF6E8',
    },
    fonts: { headingFamily: 'Lora', bodyFamily: 'Lora',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap' },
  },
  {
    id: 'nocturne',
    name: 'Nocturne',
    tagline: 'Écrire la nuit, sans fatigue oculaire',
    category: 'sombre',
    recommendedFor: 'Sessions tardives · tout genre',
    palette: {
      bg: '#0F172A', surface: '#1E293B', surfaceAlt: '#27364D',
      text: '#E2E8F0', textMuted: '#94A3B8',
      accent: '#60A5FA', accentText: '#0F172A',
      headerBg: '#1E293B', headerText: '#E2E8F0',
    },
    fonts: { headingFamily: 'Inter', bodyFamily: 'Inter',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap' },
  },
  {
    id: 'bibliotheque',
    name: 'Bibliothèque',
    tagline: 'Bois sombre, cuir, vieux livres',
    category: 'sombre',
    recommendedFor: 'Essais, philosophie, littérature classique',
    palette: {
      bg: '#1C140D', surface: '#2A1F15', surfaceAlt: '#3A2C1E',
      text: '#F0E6D2', textMuted: '#B8A584',
      accent: '#C9A24C', accentText: '#1C140D',
      headerBg: '#3A2C1E', headerText: '#C9A24C',
    },
    fonts: { headingFamily: 'Playfair Display', bodyFamily: 'Lora',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lora:wght@400;600&display=swap' },
  },
  {
    id: 'polaire',
    name: 'Polaire',
    tagline: 'Blanc glace, ultra-net',
    category: 'claire',
    recommendedFor: 'Guides pratiques, contenus tech, minimalisme',
    palette: {
      bg: '#F8FAFC', surface: '#FFFFFF', surfaceAlt: '#E2E8F0',
      text: '#0F172A', textMuted: '#64748B',
      accent: '#0EA5E9', accentText: '#FFFFFF',
      headerBg: '#E0F2FE', headerText: '#0369A1',
    },
    fonts: { headingFamily: 'Space Grotesk', bodyFamily: 'Inter',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;600&display=swap' },
  },
  {
    id: 'coquelicot',
    name: 'Coquelicot',
    tagline: 'Rouge passion, énergie',
    category: 'vibrante',
    recommendedFor: 'Romans d\'amour, thrillers, motivation',
    palette: {
      bg: '#FFF5F2', surface: '#FFFFFF', surfaceAlt: '#FFE4DC',
      text: '#2D0F08', textMuted: '#7A2E1D',
      accent: '#DC2626', accentText: '#FFFFFF',
      headerBg: '#DC2626', headerText: '#FFFFFF',
    },
    fonts: { headingFamily: 'Playfair Display', bodyFamily: 'Inter',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap' },
  },
  {
    id: 'emeraude',
    name: 'Émeraude',
    tagline: 'Vert profond, nature et croissance',
    category: 'vibrante',
    recommendedFor: 'Bien-être, écologie, développement personnel',
    palette: {
      bg: '#F0FDF4', surface: '#FFFFFF', surfaceAlt: '#DCFCE7',
      text: '#052E1A', textMuted: '#3F6E54',
      accent: '#059669', accentText: '#FFFFFF',
      headerBg: '#065F46', headerText: '#D1FAE5',
    },
    fonts: { headingFamily: 'Cormorant Garamond', bodyFamily: 'Karla',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Karla:wght@400;600&display=swap' },
  },
  {
    id: 'aurore',
    name: 'Aurore',
    tagline: 'Lever de soleil, optimisme',
    category: 'vibrante',
    recommendedFor: 'Livres jeunesse, lifestyle, créativité',
    palette: {
      bg: '#FFF7ED', surface: '#FFFFFF', surfaceAlt: '#FFEDD5',
      text: '#431407', textMuted: '#9A3412',
      accent: '#F97316', accentText: '#FFFFFF',
      headerBg: '#F97316', headerText: '#FFFFFF',
    },
    fonts: { headingFamily: 'Outfit', bodyFamily: 'Figtree',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&family=Figtree:wght@400;600&display=swap' },
  },
  {
    id: 'velours',
    name: 'Velours',
    tagline: 'Pourpre profond, mystère',
    category: 'sombre',
    recommendedFor: 'Fantasy, mystère, ésotérisme',
    palette: {
      bg: '#1A0B2E', surface: '#2C1850', surfaceAlt: '#3D2364',
      text: '#EDE9FE', textMuted: '#A78BFA',
      accent: '#C084FC', accentText: '#1A0B2E',
      headerBg: '#2C1850', headerText: '#C084FC',
    },
    fonts: { headingFamily: 'Cormorant Garamond', bodyFamily: 'Inter',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Inter:wght@400;600&display=swap' },
  },
  {
    id: 'encre',
    name: 'Encre',
    tagline: 'Noir d\'encre et or, éditorial',
    category: 'classique',
    recommendedFor: 'Beaux livres, presse, manifestes',
    palette: {
      bg: '#0D0D0D', surface: '#1A1A1A', surfaceAlt: '#262626',
      text: '#F5F0E0', textMuted: '#A8A29E',
      accent: '#C9A84C', accentText: '#0D0D0D',
      headerBg: '#0D0D0D', headerText: '#C9A84C',
    },
    fonts: { headingFamily: 'DM Serif Display', bodyFamily: 'Fira Sans',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Fira+Sans:wght@400;600&display=swap' },
  },
  {
    id: 'lavande',
    name: 'Lavande',
    tagline: 'Mauve doux, sérénité',
    category: 'claire',
    recommendedFor: 'Méditation, poésie, journal intime',
    palette: {
      bg: '#F5F3FF', surface: '#FFFFFF', surfaceAlt: '#E9D5FF',
      text: '#2E1065', textMuted: '#6D28D9',
      accent: '#7C3AED', accentText: '#FFFFFF',
      headerBg: '#A78BFA', headerText: '#FFFFFF',
    },
    fonts: { headingFamily: 'Cormorant Garamond', bodyFamily: 'Karla',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Karla:wght@400;600&display=swap' },
  },
  {
    id: 'terracuite',
    name: 'Terre Cuite',
    tagline: 'Argile chaude, artisanat',
    category: 'classique',
    recommendedFor: 'Cuisine, voyage, art de vivre',
    palette: {
      bg: '#FBF5EE', surface: '#FFFFFF', surfaceAlt: '#F5E6D3',
      text: '#3E1D0A', textMuted: '#8B4513',
      accent: '#C2410C', accentText: '#FFFFFF',
      headerBg: '#9A3412', headerText: '#FED7AA',
    },
    fonts: { headingFamily: 'Abril Fatface', bodyFamily: 'Cabin',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Cabin:wght@400;600&display=swap' },
  },
  {
    id: 'ocean',
    name: 'Océan',
    tagline: 'Bleu profond, voyage',
    category: 'claire',
    recommendedFor: 'Aventure, récits de voyage, marine',
    palette: {
      bg: '#F0F9FF', surface: '#FFFFFF', surfaceAlt: '#DBEAFE',
      text: '#0C2340', textMuted: '#1E40AF',
      accent: '#0369A1', accentText: '#FFFFFF',
      headerBg: '#0C2340', headerText: '#E0F2FE',
    },
    fonts: { headingFamily: 'Sora', bodyFamily: 'Manrope',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Manrope:wght@400;600&display=swap' },
  },
  {
    id: 'papyrus',
    name: 'Papyrus',
    tagline: 'Papier ancien, érudition',
    category: 'classique',
    recommendedFor: 'Histoire, mythologie, érudition',
    palette: {
      bg: '#F5EFDC', surface: '#FAF6E8', surfaceAlt: '#E8DDB8',
      text: '#3B2A14', textMuted: '#7A5C2C',
      accent: '#A0522D', accentText: '#FAF6E8',
      headerBg: '#3B2A14', headerText: '#E8DDB8',
    },
    fonts: { headingFamily: 'Cormorant Garamond', bodyFamily: 'Lora',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Lora:wght@400;600&display=swap' },
  },
  {
    id: 'foret',
    name: 'Forêt',
    tagline: 'Vert mousse, ancrage',
    category: 'sombre',
    recommendedFor: 'Nature, contes, fantasy douce',
    palette: {
      bg: '#1A2E1F', surface: '#243A2A', surfaceAlt: '#2F4A36',
      text: '#E8F0E2', textMuted: '#A0C49D',
      accent: '#84CC16', accentText: '#1A2E1F',
      headerBg: '#2F4A36', headerText: '#A0C49D',
    },
    fonts: { headingFamily: 'Lora', bodyFamily: 'Lora',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap' },
  },
  {
    id: 'brume',
    name: 'Brume',
    tagline: 'Gris doux, neutralité',
    category: 'claire',
    recommendedFor: 'Essais, journalisme, rapports',
    palette: {
      bg: '#F1F5F9', surface: '#FFFFFF', surfaceAlt: '#E2E8F0',
      text: '#1E293B', textMuted: '#64748B',
      accent: '#475569', accentText: '#FFFFFF',
      headerBg: '#334155', headerText: '#F1F5F9',
    },
    fonts: { headingFamily: 'Archivo', bodyFamily: 'Inter',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Archivo:wght@600;700&family=Inter:wght@400;600&display=swap' },
  },
  {
    id: 'neon',
    name: 'Néon',
    tagline: 'Cyberpunk, futur proche',
    category: 'vibrante',
    recommendedFor: 'Science-fiction, tech, gaming',
    palette: {
      bg: '#0A0A1A', surface: '#16162E', surfaceAlt: '#1F1F3D',
      text: '#E0E7FF', textMuted: '#A5B4FC',
      accent: '#22D3EE', accentText: '#0A0A1A',
      headerBg: '#16162E', headerText: '#22D3EE',
    },
    fonts: { headingFamily: 'Space Grotesk', bodyFamily: 'JetBrains Mono',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=JetBrains+Mono:wght@400;600&display=swap' },
  },
];

export const AMBIANCE_STORAGE_KEY = 'ebookstudio_writing_ambiance';

export function getAmbianceById(id: string): WritingAmbiance | undefined {
  return WRITING_AMBIANCES.find((a) => a.id === id);
}

export function getStoredAmbianceId(): string {
  if (typeof window === 'undefined') return 'atelier';
  return localStorage.getItem(AMBIANCE_STORAGE_KEY) || 'atelier';
}

/** Événement diffusé à chaque changement d'ambiance (toutes les vues se resynchronisent). */
export const AMBIANCE_EVENT = 'ebookstudio:ambiance-changed';

export function setStoredAmbianceId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AMBIANCE_STORAGE_KEY, id);
  applyAmbiance(id);
  window.dispatchEvent(new CustomEvent(AMBIANCE_EVENT, { detail: id }));
}

const loadedFonts = new Set<string>();
export function ensureAmbianceFont(ambiance: WritingAmbiance): void {
  if (typeof document === 'undefined') return;
  if (!ambiance.fonts.googleFontUrl) return;
  if (loadedFonts.has(ambiance.fonts.googleFontUrl)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = ambiance.fonts.googleFontUrl;
  document.head.appendChild(link);
  loadedFonts.add(ambiance.fonts.googleFontUrl);
}

/**
 * Applique réellement l'ambiance : variables CSS `--amb-*` posées sur la racine
 * (ou sur un conteneur), plus chargement de la police. Les surfaces d'écriture
 * portant la classe `.v3-ambiance` suivent immédiatement.
 */
export function applyAmbiance(id: string, target?: HTMLElement): WritingAmbiance | undefined {
  if (typeof document === 'undefined') return undefined;
  const amb = getAmbianceById(id) || WRITING_AMBIANCES[0];
  if (!amb) return undefined;
  ensureAmbianceFont(amb);
  const el = target || document.documentElement;
  const p = amb.palette;
  const vars: Record<string, string> = {
    '--amb-bg': p.bg,
    '--amb-surface': p.surface,
    '--amb-surface-alt': p.surfaceAlt,
    '--amb-text': p.text,
    '--amb-muted': p.textMuted,
    '--amb-accent': p.accent,
    '--amb-accent-text': p.accentText,
    '--amb-header-bg': p.headerBg,
    '--amb-header-text': p.headerText,
    '--amb-heading-font': `'${amb.fonts.headingFamily}'`,
    '--amb-body-font': `'${amb.fonts.bodyFamily}'`,
  };
  Object.entries(vars).forEach(([k, v]) => el.style.setProperty(k, v));
  el.setAttribute('data-ambiance', amb.id);
  return amb;
}


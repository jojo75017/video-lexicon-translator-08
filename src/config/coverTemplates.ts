/**
 * Templates prêts à l'emploi pour Cover Studio Pro V3.
 * Chaque template est décrit de façon relative (0..1) pour s'adapter à tout format.
 */

export type CoverTemplateCategory =
  | 'romance'
  | 'thriller'
  | 'fantasy'
  | 'business'
  | 'jeunesse'
  | 'developpement'
  | 'polar'
  | 'minimal';

export interface CoverTemplateText {
  text: string;
  /** Position relative 0..1 */
  x: number;
  y: number;
  /** Largeur relative 0..1 */
  w: number;
  fontFamily: string;
  fontWeight?: string;
  fontStyle?: string;
  /** Taille de police en fraction de la hauteur du canvas */
  fontSizeRatio: number;
  fill: string;
  textAlign?: 'left' | 'center' | 'right';
  role: 'title' | 'subtitle' | 'author' | 'tagline';
}

export interface CoverTemplateShape {
  type: 'rect';
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  opacity?: number;
}

export interface CoverTemplate {
  id: string;
  label: string;
  category: CoverTemplateCategory;
  /** Couleur de fond du canvas */
  background: string;
  /** Prompt IA suggéré pour générer un visuel de fond assorti */
  aiPromptSuggestion?: string;
  shapes?: CoverTemplateShape[];
  texts: CoverTemplateText[];
}

export const COVER_TEMPLATES: CoverTemplate[] = [
  {
    id: 'romance-elegant',
    label: 'Romance élégante',
    category: 'romance',
    background: '#f5e6e8',
    aiPromptSuggestion:
      'Aquarelle douce couple sous un ciel étoilé, tons rose poudré et or, ambiance romantique, minimaliste',
    shapes: [
      { type: 'rect', x: 0.08, y: 0.42, w: 0.84, h: 0.002, fill: '#8b3a4a' },
      { type: 'rect', x: 0.08, y: 0.58, w: 0.84, h: 0.002, fill: '#8b3a4a' },
    ],
    texts: [
      { role: 'title', text: 'TITRE DU LIVRE', x: 0.5, y: 0.46, w: 0.85, fontFamily: 'Georgia', fontWeight: 'bold', fontSizeRatio: 0.07, fill: '#5a1a2a', textAlign: 'center' },
      { role: 'subtitle', text: 'Un roman inoubliable', x: 0.5, y: 0.6, w: 0.7, fontFamily: 'Georgia', fontStyle: 'italic', fontSizeRatio: 0.028, fill: '#8b3a4a', textAlign: 'center' },
      { role: 'author', text: 'NOM DE L\'AUTEUR', x: 0.5, y: 0.9, w: 0.85, fontFamily: 'Georgia', fontSizeRatio: 0.03, fill: '#5a1a2a', textAlign: 'center' },
    ],
  },
  {
    id: 'thriller-dark',
    label: 'Thriller sombre',
    category: 'thriller',
    background: '#0b0b0f',
    aiPromptSuggestion:
      'Silhouette urbaine sombre, ombre menaçante, lumière rouge, brouillard, ambiance polar noir, cinématique',
    shapes: [
      { type: 'rect', x: 0, y: 0.65, w: 1, h: 0.02, fill: '#c62828' },
    ],
    texts: [
      { role: 'title', text: 'LE SUSPECT', x: 0.5, y: 0.5, w: 0.9, fontFamily: 'Impact, Arial Black', fontWeight: 'bold', fontSizeRatio: 0.11, fill: '#f5f5f5', textAlign: 'center' },
      { role: 'subtitle', text: 'UN THRILLER HALETANT', x: 0.5, y: 0.71, w: 0.7, fontFamily: 'Arial', fontWeight: 'bold', fontSizeRatio: 0.028, fill: '#c62828', textAlign: 'center' },
      { role: 'author', text: 'AUTEUR', x: 0.5, y: 0.92, w: 0.8, fontFamily: 'Arial', fontWeight: 'bold', fontSizeRatio: 0.035, fill: '#f5f5f5', textAlign: 'center' },
    ],
  },
  {
    id: 'fantasy-epic',
    label: 'Fantasy épique',
    category: 'fantasy',
    background: '#1a1a3a',
    aiPromptSuggestion:
      'Paysage fantastique épique, montagnes brumeuses, dragon lointain, aurore boréale violette, style peinture numérique',
    shapes: [],
    texts: [
      { role: 'title', text: 'LES CHRONIQUES', x: 0.5, y: 0.28, w: 0.9, fontFamily: 'Georgia', fontWeight: 'bold', fontSizeRatio: 0.09, fill: '#e6c86e', textAlign: 'center' },
      { role: 'subtitle', text: '~ Tome I ~', x: 0.5, y: 0.4, w: 0.5, fontFamily: 'Georgia', fontStyle: 'italic', fontSizeRatio: 0.03, fill: '#e6c86e', textAlign: 'center' },
      { role: 'author', text: 'NOM DE L\'AUTEUR', x: 0.5, y: 0.92, w: 0.85, fontFamily: 'Georgia', fontWeight: 'bold', fontSizeRatio: 0.032, fill: '#e6c86e', textAlign: 'center' },
    ],
  },
  {
    id: 'business-corporate',
    label: 'Business corporate',
    category: 'business',
    background: '#0f2942',
    aiPromptSuggestion:
      'Fond dégradé bleu marine vers or, graphiques abstraits, ambiance corporate premium, minimaliste',
    shapes: [
      { type: 'rect', x: 0, y: 0, w: 1, h: 0.18, fill: '#d4a24a' },
      { type: 'rect', x: 0.08, y: 0.82, w: 0.15, h: 0.006, fill: '#d4a24a' },
    ],
    texts: [
      { role: 'title', text: 'RÉUSSIR EN 2026', x: 0.5, y: 0.42, w: 0.85, fontFamily: 'Helvetica, Arial', fontWeight: 'bold', fontSizeRatio: 0.085, fill: '#ffffff', textAlign: 'center' },
      { role: 'subtitle', text: 'Les 7 principes des leaders qui gagnent', x: 0.5, y: 0.56, w: 0.8, fontFamily: 'Helvetica, Arial', fontSizeRatio: 0.03, fill: '#d4a24a', textAlign: 'center' },
      { role: 'author', text: 'AUTEUR EXPERT', x: 0.08, y: 0.86, w: 0.5, fontFamily: 'Helvetica, Arial', fontWeight: 'bold', fontSizeRatio: 0.028, fill: '#ffffff', textAlign: 'left' },
    ],
  },
  {
    id: 'jeunesse-fun',
    label: 'Jeunesse coloré',
    category: 'jeunesse',
    background: '#ffe08a',
    aiPromptSuggestion:
      'Illustration enfantine mignonne, animaux souriants, couleurs vives, style aquarelle album jeunesse',
    shapes: [
      { type: 'rect', x: 0.05, y: 0.05, w: 0.9, h: 0.9, fill: '#ffffff', opacity: 0.15 },
    ],
    texts: [
      { role: 'title', text: 'Les Aventures\nde Léo', x: 0.5, y: 0.15, w: 0.9, fontFamily: 'Comic Sans MS, Chalkboard', fontWeight: 'bold', fontSizeRatio: 0.09, fill: '#c2410c', textAlign: 'center' },
      { role: 'author', text: 'Écrit par L\'AUTEUR', x: 0.5, y: 0.9, w: 0.85, fontFamily: 'Comic Sans MS, Chalkboard', fontSizeRatio: 0.032, fill: '#7c2d12', textAlign: 'center' },
    ],
  },
  {
    id: 'developpement-inspire',
    label: 'Développement perso',
    category: 'developpement',
    background: '#f7f3ec',
    aiPromptSuggestion:
      'Illustration minimaliste, silhouette qui gravit une montagne au lever du soleil, tons chauds pastels',
    shapes: [
      { type: 'rect', x: 0.5, y: 0.5, w: 0.5, h: 0.003, fill: '#c2410c' },
    ],
    texts: [
      { role: 'title', text: 'DEVIENS\nCELUI QUE TU ES', x: 0.5, y: 0.34, w: 0.9, fontFamily: 'Georgia', fontWeight: 'bold', fontSizeRatio: 0.075, fill: '#1c1917', textAlign: 'center' },
      { role: 'subtitle', text: 'La méthode en 21 jours pour transformer ta vie', x: 0.5, y: 0.62, w: 0.78, fontFamily: 'Georgia', fontStyle: 'italic', fontSizeRatio: 0.028, fill: '#57534e', textAlign: 'center' },
      { role: 'author', text: 'AUTEUR INSPIRANT', x: 0.5, y: 0.92, w: 0.85, fontFamily: 'Georgia', fontWeight: 'bold', fontSizeRatio: 0.03, fill: '#1c1917', textAlign: 'center' },
    ],
  },
  {
    id: 'polar-noir',
    label: 'Polar noir',
    category: 'polar',
    background: '#111111',
    aiPromptSuggestion:
      'Pluie nocturne sur pavés parisiens, réverbère solitaire, silhouette d\'inspecteur, style noir et blanc contrasté',
    shapes: [
      { type: 'rect', x: 0, y: 0.44, w: 1, h: 0.003, fill: '#f5f5f5' },
    ],
    texts: [
      { role: 'title', text: 'MEURTRE\nÀ PARIS', x: 0.5, y: 0.22, w: 0.9, fontFamily: 'Times New Roman, serif', fontWeight: 'bold', fontSizeRatio: 0.1, fill: '#f5f5f5', textAlign: 'center' },
      { role: 'subtitle', text: 'Un polar signé', x: 0.5, y: 0.5, w: 0.6, fontFamily: 'Times New Roman, serif', fontStyle: 'italic', fontSizeRatio: 0.028, fill: '#a8a29e', textAlign: 'center' },
      { role: 'author', text: 'NOM DE L\'AUTEUR', x: 0.5, y: 0.55, w: 0.85, fontFamily: 'Times New Roman, serif', fontWeight: 'bold', fontSizeRatio: 0.04, fill: '#f5f5f5', textAlign: 'center' },
    ],
  },
  {
    id: 'minimal-typo',
    label: 'Minimal typographique',
    category: 'minimal',
    background: '#fafafa',
    aiPromptSuggestion:
      'Fond crème texturé papier, formes géométriques minimalistes noires, style éditorial premium',
    shapes: [
      { type: 'rect', x: 0.1, y: 0.44, w: 0.8, h: 0.004, fill: '#111111' },
    ],
    texts: [
      { role: 'title', text: 'TITRE', x: 0.5, y: 0.3, w: 0.9, fontFamily: 'Helvetica, Arial', fontWeight: 'bold', fontSizeRatio: 0.14, fill: '#111111', textAlign: 'center' },
      { role: 'subtitle', text: 'un essai libre', x: 0.5, y: 0.48, w: 0.6, fontFamily: 'Helvetica, Arial', fontSizeRatio: 0.028, fill: '#111111', textAlign: 'center' },
      { role: 'author', text: 'AUTEUR', x: 0.5, y: 0.92, w: 0.85, fontFamily: 'Helvetica, Arial', fontSizeRatio: 0.03, fill: '#111111', textAlign: 'center' },
    ],
  },
];

export const TEMPLATE_CATEGORIES: { id: CoverTemplateCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'romance', label: 'Romance' },
  { id: 'thriller', label: 'Thriller' },
  { id: 'fantasy', label: 'Fantasy' },
  { id: 'polar', label: 'Polar' },
  { id: 'business', label: 'Business' },
  { id: 'developpement', label: 'Dév. perso' },
  { id: 'jeunesse', label: 'Jeunesse' },
  { id: 'minimal', label: 'Minimal' },
];

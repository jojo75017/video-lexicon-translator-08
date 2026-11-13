export interface CoverGenre {
  id: string; label: string; bg: string; titleColor: string; subColor: string;
  titleFont: string; titleUpper: boolean; titlePos: 'top' | 'bottom'; overlay: string; badges: string[];
}
export const COVER_GENRES: CoverGenre[] = [
  { id: 'guide', label: 'Guide pratique', bg: '#F5F1E8', titleColor: '#0F172A', subColor: '#008296', titleFont: '800 {s}px Montserrat, Arial, sans-serif', titleUpper: true, titlePos: 'top', overlay: 'rgba(255,255,255,0.0)', badges: ['Méthode prouvée', 'Exercices inclus', 'Guide complet'] },
  { id: 'jeunesse', label: 'Jeunesse / Pédagogique', bg: '#FFF4D6', titleColor: '#1E3A8A', subColor: '#C2410C', titleFont: '900 {s}px "Comic Neue", "Trebuchet MS", sans-serif', titleUpper: true, titlePos: 'top', overlay: 'rgba(255,255,255,0.0)', badges: ['Dès 6 ans', 'Approuvé par les parents', 'Sans stress'] },
  { id: 'thriller', label: 'Thriller / Polar', bg: '#0B0F17', titleColor: '#FFFFFF', subColor: '#FACC15', titleFont: '900 {s}px Impact, "Arial Black", sans-serif', titleUpper: true, titlePos: 'bottom', overlay: 'rgba(0,0,0,0.35)', badges: ['Suspense haletant', 'Impossible à lâcher', 'N°1 des ventes'] },
  { id: 'romance', label: 'Roman / Romance', bg: '#3B1F2B', titleColor: '#FDE68A', subColor: '#FBCFE8', titleFont: 'italic 700 {s}px Georgia, "Times New Roman", serif', titleUpper: false, titlePos: 'bottom', overlay: 'rgba(40,10,30,0.25)', badges: ['Coup de cœur', 'Une histoire bouleversante'] },
  { id: 'devperso', label: 'Développement personnel', bg: '#E0F2F1', titleColor: '#004D57', subColor: '#FF9E2D', titleFont: '800 {s}px Montserrat, Arial, sans-serif', titleUpper: false, titlePos: 'top', overlay: 'rgba(255,255,255,0.0)', badges: ['Plus de 10 000 lecteurs', 'Changez votre vie'] },
  { id: 'sf', label: 'Science-fiction / Fantasy', bg: '#0A0A2A', titleColor: '#67E8F9', subColor: '#E9D5FF', titleFont: '900 {s}px "Arial Black", sans-serif', titleUpper: true, titlePos: 'top', overlay: 'rgba(0,0,30,0.3)', badges: ['Une saga épique', 'Tome 1'] },
];
export const BADGE_STYLES = [
  { id: 'or', label: 'Cercle doré', fill: '#D4A017', text: '#1A1200' },
  { id: 'rouge', label: 'Rouge Amazon', fill: '#C8102E', text: '#FFFFFF' },
  { id: 'noir', label: 'Pastille noire', fill: '#111111', text: '#FFFFFF' },
  { id: 'turquoise', label: 'Turquoise', fill: '#008296', text: '#FFFFFF' },
];

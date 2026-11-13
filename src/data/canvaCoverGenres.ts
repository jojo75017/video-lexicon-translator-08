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
  { id: 'business', label: 'Business / Finance', bg: '#0F1E33', titleColor: '#FFFFFF', subColor: '#D4A017', titleFont: '800 {s}px Montserrat, Arial, sans-serif', titleUpper: true, titlePos: 'top', overlay: 'rgba(0,0,0,0.2)', badges: ['Stratégie gagnante', 'Méthode pas à pas', 'Guide complet'] },
  { id: 'cuisine', label: 'Cuisine / Recettes', bg: '#FBF3E4', titleColor: '#5B3A1E', subColor: '#6B8E23', titleFont: 'italic 800 {s}px Georgia, serif', titleUpper: false, titlePos: 'top', overlay: 'rgba(255,255,255,0.0)', badges: ['Recettes rapides', '100 % fait maison', 'Facile et gourmand'] },
  { id: 'sante', label: 'Santé / Bien-être', bg: '#EEF3EC', titleColor: '#2F4F3A', subColor: '#8A9A5B', titleFont: '700 {s}px Montserrat, Arial, sans-serif', titleUpper: false, titlePos: 'top', overlay: 'rgba(255,255,255,0.0)', badges: ['Naturel', 'Conseils pratiques', 'Sérénité au quotidien'] },
  { id: 'biographie', label: 'Biographie / Mémoires', bg: '#2A2118', titleColor: '#F3E5C0', subColor: '#C9A45C', titleFont: '700 {s}px Georgia, "Times New Roman", serif', titleUpper: false, titlePos: 'bottom', overlay: 'rgba(30,20,10,0.3)', badges: ['Témoignage exclusif', 'Une histoire vraie'] },
  { id: 'historique', label: 'Roman historique / Aventure', bg: '#3A2A17', titleColor: '#E8C872', subColor: '#F3E5C0', titleFont: '700 {s}px "Times New Roman", Georgia, serif', titleUpper: true, titlePos: 'bottom', overlay: 'rgba(40,25,10,0.3)', badges: ['Une fresque épique', 'Inspiré de faits réels'] },
  { id: 'humour', label: 'Humour / Décalé', bg: '#FFD93D', titleColor: '#1A1A1A', subColor: '#D93025', titleFont: '900 {s}px "Arial Black", Impact, sans-serif', titleUpper: true, titlePos: 'top', overlay: 'rgba(255,255,255,0.0)', badges: ['Fous rires garantis', 'À offrir !'] },
  { id: 'spiritualite', label: 'Spiritualité / Méditation', bg: '#1B1640', titleColor: '#F5D77A', subColor: '#C4B5FD', titleFont: '600 {s}px Georgia, serif', titleUpper: false, titlePos: 'top', overlay: 'rgba(10,5,40,0.3)', badges: ['Éveil intérieur', 'Paix et lumière'] },
  { id: 'carnet', label: 'Carnet / Journal', bg: '#F7E8E4', titleColor: '#4A4A4A', subColor: '#B07D8C', titleFont: '300 {s}px Montserrat, Arial, sans-serif', titleUpper: true, titlePos: 'top', overlay: 'rgba(255,255,255,0.0)', badges: ['120 pages', 'Format pratique'] },
  { id: 'policier', label: 'Policier / Enquête', bg: '#111418', titleColor: '#F2F2F2', subColor: '#D93025', titleFont: '900 {s}px Impact, "Arial Black", sans-serif', titleUpper: true, titlePos: 'bottom', overlay: 'rgba(0,0,0,0.4)', badges: ['Enquête haletante', 'Impossible à lâcher'] },
];
export const BADGE_STYLES = [
  { id: 'or', label: 'Cercle doré', fill: '#D4A017', text: '#1A1200' },
  { id: 'rouge', label: 'Rouge Amazon', fill: '#C8102E', text: '#FFFFFF' },
  { id: 'noir', label: 'Pastille noire', fill: '#111111', text: '#FFFFFF' },
  { id: 'turquoise', label: 'Turquoise', fill: '#008296', text: '#FFFFFF' },
];

import { PinterestDesign, PinterestImage } from '@/types/pinterest';

export const worldImages: PinterestImage[] = [
  {
    id: 'world-1',
    url: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=2071&auto=format&fit=crop',
    title: 'Explorez le monde',
    category: 'monde',
    tags: ['voyage', 'monde', 'aventure'],
    country: 'Global',
    verified: true
  },
  {
    id: 'world-2',
    url: 'https://images.unsplash.com/photo-1506973035872-25bf1e9c138c?q=80&w=2073&auto=format&fit=crop',
    title: 'Aventures autour du monde',
    category: 'monde',
    tags: ['voyage', 'monde', 'aventure'],
    country: 'Global',
    verified: true
  },
  {
    id: 'world-3',
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2072&auto=format&fit=crop',
    title: 'Destinations de rêve',
    category: 'monde',
    tags: ['voyage', 'monde', 'aventure'],
    country: 'Global',
    verified: true
  },
  {
    id: 'world-4',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop',
    title: 'Les plus beaux endroits',
    category: 'monde',
    tags: ['voyage', 'monde', 'aventure'],
    country: 'Global',
    verified: true
  },
  {
    id: 'world-5',
    url: 'https://images.unsplash.com/photo-1476514524981-bb8f04e62e18?q=80&w=2070&auto=format&fit=crop',
    title: 'Voyagez à travers le monde',
    category: 'monde',
    tags: ['voyage', 'monde', 'aventure'],
    country: 'Global',
    verified: true
  },
];

export const europeImages: PinterestImage[] = [
  {
    id: 'europe-1',
    url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop',
    title: 'Découvrez l\'Europe',
    category: 'europe',
    tags: ['voyage', 'europe', 'culture'],
    country: 'Europe',
    verified: true
  },
  {
    id: 'europe-2',
    url: 'https://images.unsplash.com/photo-1518546305927-4d9b79dee37f?q=80&w=2070&auto=format&fit=crop',
    title: 'Les joyaux de l\'Europe',
    category: 'europe',
    tags: ['voyage', 'europe', 'culture'],
    country: 'Europe',
    verified: true
  },
  {
    id: 'europe-3',
    url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop',
    title: 'Escapade européenne',
    category: 'europe',
    tags: ['voyage', 'europe', 'culture'],
    country: 'Europe',
    verified: true
  },
  {
    id: 'europe-4',
    url: 'https://images.unsplash.com/photo-1501127122-7cb56035ca5d?q=80&w=2070&auto=format&fit=crop',
    title: 'L\'Europe à votre portée',
    category: 'europe',
    tags: ['voyage', 'europe', 'culture'],
    country: 'Europe',
    verified: true
  },
  {
    id: 'europe-5',
    url: 'https://images.unsplash.com/photo-1470770841072-f978cf4aa3eb?q=80&w=2073&auto=format&fit=crop',
    title: 'Un voyage inoubliable',
    category: 'europe',
    tags: ['voyage', 'europe', 'culture'],
    country: 'Europe',
    verified: true
  },
];

export const franceImages: PinterestImage[] = [
  {
    id: 'france-1',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
    title: 'La beauté de la France',
    category: 'france',
    tags: ['voyage', 'france', 'paris'],
    country: 'France',
    region: 'Paris',
    verified: true
  },
  {
    id: 'france-2',
    url: 'https://images.unsplash.com/photo-1493571774187-8c99e25ca1c2?q=80&w=2074&auto=format&fit=crop',
    title: 'Explorez la France',
    category: 'france',
    tags: ['voyage', 'france', 'paris'],
    country: 'France',
    region: 'Paris',
    verified: true
  },
  {
    id: 'france-3',
    url: 'https://images.unsplash.com/photo-1471741907058-a93c49669a44?q=80&w=2070&auto=format&fit=crop',
    title: 'La France authentique',
    category: 'france',
    tags: ['voyage', 'france', 'paris'],
    country: 'France',
    region: 'Paris',
    verified: true
  },
  {
    id: 'france-4',
    url: 'https://images.unsplash.com/photo-1505005426693-ec6d33e92829?q=80&w=2070&auto=format&fit=crop',
    title: 'Les trésors de la France',
    category: 'france',
    tags: ['voyage', 'france', 'paris'],
    country: 'France',
    region: 'Paris',
    verified: true
  },
  {
    id: 'france-5',
    url: 'https://images.unsplash.com/photo-1482822684348-e38998a4860c?q=80&w=2070&auto=format&fit=crop',
    title: 'Un séjour en France',
    category: 'france',
    tags: ['voyage', 'france', 'paris'],
    country: 'France',
    region: 'Paris',
    verified: true
  },
];

export const allImages: PinterestImage[] = [...worldImages, ...europeImages, ...franceImages];

export const pinterestDesigns: PinterestDesign[] = [
  {
    id: 'design-1',
    name: 'Élégant',
    primaryColor: '#E91E63',
    secondaryColor: '#F8BBD0',
    textColor: '#FFFFFF',
    accentColor: '#000000',
    overlayStyle: 'gradient',
    titleFont: 'serif',
    descriptionFont: 'sans-serif'
  },
  {
    id: 'design-2',
    name: 'Moderne',
    primaryColor: '#3F51B5',
    secondaryColor: '#C5CAE9',
    textColor: '#FFFFFF',
    accentColor: '#FFEB3B',
    overlayStyle: 'solid',
    titleFont: 'sans-serif',
    descriptionFont: 'serif'
  },
  {
    id: 'design-3',
    name: 'Minimaliste',
    primaryColor: '#607D8B',
    secondaryColor: '#CFD8DC',
    textColor: '#FFFFFF',
    accentColor: '#A5D6A7',
    overlayStyle: 'none',
    titleFont: 'sans-serif',
    descriptionFont: 'sans-serif'
  },
  {
    id: 'design-4',
    name: 'Classique',
    primaryColor: '#795548',
    secondaryColor: '#D7CCC8',
    textColor: '#FFFFFF',
    accentColor: '#90A4AE',
    overlayStyle: 'frame',
    titleFont: 'serif',
    descriptionFont: 'serif'
  },
  {
    id: 'design-5',
    name: 'Vibrant',
    primaryColor: '#009688',
    secondaryColor: '#B2DFDB',
    textColor: '#FFFFFF',
    accentColor: '#FFC107',
    overlayStyle: 'gradient',
    titleFont: 'sans-serif',
    descriptionFont: 'serif'
  },
  {
    id: 'design-6',
    name: 'Pastel',
    primaryColor: '#9C27B0',
    secondaryColor: '#E1BEE7',
    textColor: '#FFFFFF',
    accentColor: '#673AB7',
    overlayStyle: 'solid',
    titleFont: 'serif',
    descriptionFont: 'sans-serif'
  },
  {
    id: 'design-7',
    name: 'Naturel',
    primaryColor: '#4CAF50',
    secondaryColor: '#C8E6C9',
    textColor: '#FFFFFF',
    accentColor: '#8BC34A',
    overlayStyle: 'frame',
    titleFont: 'sans-serif',
    descriptionFont: 'serif'
  },
  {
    id: 'design-8',
    name: 'Sombre',
    primaryColor: '#212121',
    secondaryColor: '#616161',
    textColor: '#FFFFFF',
    accentColor: '#757575',
    overlayStyle: 'none',
    titleFont: 'serif',
    descriptionFont: 'sans-serif'
  },
  {
    id: 'design-9',
    name: 'Créatif',
    primaryColor: '#FF5722',
    secondaryColor: '#FFCCBC',
    textColor: '#FFFFFF',
    accentColor: '#FF9800',
    overlayStyle: 'gradient',
    titleFont: 'sans-serif',
    descriptionFont: 'serif'
  }
];

export const callToActions = [
  'Découvrir',
  'Visiter',
  'En savoir plus',
  'Explorer',
  'Réserver',
  'Planifier',
  'Voir les détails',
  'Commencer',
  'S\'inspirer',
  'Regarder',
  'Télécharger'
];

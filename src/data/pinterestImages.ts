export interface PinterestImage {
  id: string;
  src: string;
  title: string;
  tags: string[];
}

export interface PinterestDesign {
  id: string;
  name: string;
  textColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  titleFont: string;
  descriptionFont: string;
  overlayStyle: 'none' | 'gradient' | 'solid' | 'frame';
}

export const pinterestDesigns: PinterestDesign[] = [
  {
    id: 'design1',
    name: 'Élégant Moderne',
    textColor: '#000000',
    primaryColor: '#FFFFFF',
    secondaryColor: '#F0F0F0',
    accentColor: '#FF4081',
    titleFont: 'Arial, sans-serif',
    descriptionFont: 'Helvetica, sans-serif',
    overlayStyle: 'none'
  },
  {
    id: 'design2',
    name: 'Naturel Chic',
    textColor: '#FFFFFF',
    primaryColor: '#4CAF50',
    secondaryColor: '#388E3C',
    accentColor: '#8BC34A',
    titleFont: 'Georgia, serif',
    descriptionFont: 'Verdana, sans-serif',
    overlayStyle: 'gradient'
  },
  {
    id: 'design3',
    name: 'Minimaliste',
    textColor: '#333333',
    primaryColor: '#E0E0E0',
    secondaryColor: '#BDBDBD',
    accentColor: '#757575',
    titleFont: 'Roboto, sans-serif',
    descriptionFont: 'Open Sans, sans-serif',
    overlayStyle: 'solid'
  },
  {
    id: 'design4',
    name: 'Vintage Retro',
    textColor: '#FFFFFF',
    primaryColor: '#795548',
    secondaryColor: '#5D4037',
    accentColor: '#A1887F',
    titleFont: 'Times New Roman, serif',
    descriptionFont: 'Courier New, monospace',
    overlayStyle: 'frame'
  },
  {
    id: 'design5',
    name: 'Vibrant Artistique',
    textColor: '#FFFFFF',
    primaryColor: '#9C27B0',
    secondaryColor: '#7B1FA2',
    accentColor: '#E040FB',
    titleFont: 'Impact, sans-serif',
    descriptionFont: 'Comic Sans MS, cursive',
    overlayStyle: 'gradient'
  }
];

export const worldImages: PinterestImage[] = [
  {
    id: 'world1',
    src: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Aventure au cœur de la forêt amazonienne',
    tags: ['amazonie', 'forêt', 'nature', 'aventure']
  },
  {
    id: 'world2',
    src: 'https://images.pexels.com/photos/33045/lion-wild-africa-african.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Safari inoubliable dans la savane africaine',
    tags: ['safari', 'afrique', 'animaux', 'nature']
  },
  {
    id: 'world3',
    src: 'https://images.pexels.com/photos/775201/pexels-photo-775201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Exploration des temples anciens de Kyoto, Japon',
    tags: ['kyoto', 'japon', 'temples', 'culture']
  },
  {
    id: 'world4',
    src: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Randonnée spectaculaire dans les Andes, Pérou',
    tags: ['andes', 'pérou', 'montagnes', 'randonnée']
  },
  {
    id: 'world5',
    src: 'https://images.pexels.com/photos/417252/pexels-photo-417252.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Plongée dans la Grande Barrière de Corail, Australie',
    tags: ['australie', 'corail', 'plongée', 'océan']
  }
];

export const europeImages: PinterestImage[] = [
  {
    id: 'europe1',
    src: 'https://images.pexels.com/photos/730896/pexels-photo-730896.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Romance et histoire à Rome, Italie',
    tags: ['rome', 'italie', 'histoire', 'romance']
  },
  {
    id: 'europe2',
    src: 'https://images.pexels.com/photos/1850619/pexels-photo-1850619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Découverte de la beauté sauvage de l\'Écosse',
    tags: ['écosse', 'nature', 'paysages', 'châteaux']
  },
  {
    id: 'europe3',
    src: 'https://images.pexels.com/photos/1559181/pexels-photo-1559181.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Exploration urbaine à Berlin, Allemagne',
    tags: ['berlin', 'allemagne', 'urbain', 'culture']
  },
  {
    id: 'europe4',
    src: 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Aurores boréales en Islande',
    tags: ['islande', 'aurores boréales', 'nature', 'hiver']
  },
  {
    id: 'europe5',
    src: 'https://images.pexels.com/photos/372398/pexels-photo-372398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Charme et élégance à Paris, France',
    tags: ['paris', 'france', 'romance', 'ville']
  }
];

export const franceImages: PinterestImage[] = [
  {
    id: 'france1',
    src: 'https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Escapade ensoleillée sur la Côte d\'Azur',
    tags: ['côte d\'azur', 'france', 'plage', 'soleil']
  },
  {
    id: 'france2',
    src: 'https://images.pexels.com/photos/1462124/pexels-photo-1462124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Dégustation de vin dans les vignobles de Bordeaux',
    tags: ['bordeaux', 'vin', 'vignobles', 'gastronomie']
  },
  {
    id: 'france3',
    src: 'https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Exploration des châteaux de la Loire',
    tags: ['châteaux de la loire', 'histoire', 'france', 'architecture']
  },
  {
    id: 'france4',
    src: 'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Randonnée dans les montagnes des Pyrénées',
    tags: ['pyrénées', 'montagnes', 'randonnée', 'nature']
  },
  {
    id: 'france5',
    src: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Découverte de la culture bretonne en Bretagne',
    tags: ['bretagne', 'culture bretonne', 'france', 'traditions']
  }
];

export const allImages: PinterestImage[] = [
  ...worldImages,
  ...europeImages,
  ...franceImages
];

// Ajout de plus d'options de Call to Action
export const callToActions = [
  'Découvrir',
  'En savoir plus',
  'Explorer',
  'Visiter',
  'Télécharger',
  'Réserver maintenant',
  'Acheter',
  'S\'inscrire',
  'Commencer',
  'Voir plus',
  'Contacter',
  'Lire l\'article',
  'Obtenir l\'offre',
  'Essayer gratuitement'
];

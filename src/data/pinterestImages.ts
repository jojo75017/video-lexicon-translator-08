
import { PinterestImage, PinterestDesign } from '@/types/pinterest';

// 30 images de pays du monde
export const worldImages: PinterestImage[] = [
  { id: 'w1', url: 'https://cdn.pixabay.com/photo/2016/07/30/08/13/moscow-1556561_1280.jpg', title: 'Moscou, Russie', category: 'monde', country: 'Russie' },
  { id: 'w2', url: 'https://cdn.pixabay.com/photo/2019/09/11/03/31/chureito-pagoda-4467515_1280.jpg', title: 'Mont Fuji, Japon', category: 'monde', country: 'Japon' },
  { id: 'w3', url: 'https://cdn.pixabay.com/photo/2016/01/13/17/48/machupicchu-1138641_1280.jpg', title: 'Machu Picchu, Pérou', category: 'monde', country: 'Pérou' },
  { id: 'w4', url: 'https://cdn.pixabay.com/photo/2016/11/08/05/15/hot-air-balloons-1807521_1280.jpg', title: 'Cappadoce, Turquie', category: 'monde', country: 'Turquie' },
  { id: 'w5', url: 'https://cdn.pixabay.com/photo/2018/03/12/20/07/maldives-3220702_1280.jpg', title: 'Maldives', category: 'monde', country: 'Maldives' },
  { id: 'w6', url: 'https://cdn.pixabay.com/photo/2016/08/17/15/08/uluru-1600672_1280.jpg', title: 'Uluru, Australie', category: 'monde', country: 'Australie' },
  { id: 'w7', url: 'https://cdn.pixabay.com/photo/2016/01/08/18/00/antelope-canyon-1128815_1280.jpg', title: 'Antelope Canyon, États-Unis', category: 'monde', country: 'États-Unis' },
  { id: 'w8', url: 'https://cdn.pixabay.com/photo/2016/05/21/15/26/cuba-1407212_1280.jpg', title: 'La Havane, Cuba', category: 'monde', country: 'Cuba' },
  { id: 'w9', url: 'https://cdn.pixabay.com/photo/2014/05/20/06/09/bangkok-348026_1280.jpg', title: 'Bangkok, Thaïlande', category: 'monde', country: 'Thaïlande' },
  { id: 'w10', url: 'https://cdn.pixabay.com/photo/2015/07/13/14/40/rush-hour-843309_1280.jpg', title: 'Tokyo, Japon', category: 'monde', country: 'Japon' },
  { id: 'w11', url: 'https://cdn.pixabay.com/photo/2017/08/12/10/12/dahab-2634729_1280.jpg', title: 'Dahab, Égypte', category: 'monde', country: 'Égypte' },
  { id: 'w12', url: 'https://cdn.pixabay.com/photo/2017/01/28/02/24/china-2014639_1280.jpg', title: 'Grande Muraille, Chine', category: 'monde', country: 'Chine' },
  { id: 'w13', url: 'https://cdn.pixabay.com/photo/2021/11/26/02/39/moorea-6824828_1280.jpg', title: 'Moorea, Polynésie française', category: 'monde', country: 'France (Outre-mer)' },
  { id: 'w14', url: 'https://cdn.pixabay.com/photo/2014/08/12/00/01/santorini-416136_1280.jpg', title: 'Santorin, Grèce', category: 'monde', country: 'Grèce' },
  { id: 'w15', url: 'https://cdn.pixabay.com/photo/2020/01/31/21/25/way-4809757_1280.jpg', title: 'Désert de sel, Bolivie', category: 'monde', country: 'Bolivie' },
  { id: 'w16', url: 'https://cdn.pixabay.com/photo/2015/03/02/02/42/taj-mahal-655451_1280.jpg', title: 'Taj Mahal, Inde', category: 'monde', country: 'Inde' },
  { id: 'w17', url: 'https://cdn.pixabay.com/photo/2019/08/19/09/17/geiranger-4416354_1280.jpg', title: 'Geiranger, Norvège', category: 'monde', country: 'Norvège' },
  { id: 'w18', url: 'https://cdn.pixabay.com/photo/2014/04/22/05/40/marina-bay-sands-329998_1280.jpg', title: 'Singapore', category: 'monde', country: 'Singapore' },
  { id: 'w19', url: 'https://cdn.pixabay.com/photo/2021/09/15/08/34/cenote-6626798_1280.jpg', title: 'Cenote, Mexique', category: 'monde', country: 'Mexique' },
  { id: 'w20', url: 'https://cdn.pixabay.com/photo/2017/10/28/07/47/morocco-2896291_1280.jpg', title: 'Marrakech, Maroc', category: 'monde', country: 'Maroc' },
  { id: 'w21', url: 'https://cdn.pixabay.com/photo/2015/10/12/15/46/foz-do-iguacu-984039_1280.jpg', title: 'Chutes d\'Iguazu, Brésil', category: 'monde', country: 'Brésil' },
  { id: 'w22', url: 'https://cdn.pixabay.com/photo/2013/02/21/19/06/drink-84533_1280.jpg', title: 'Rio de Janeiro, Brésil', category: 'monde', country: 'Brésil' },
  { id: 'w23', url: 'https://cdn.pixabay.com/photo/2017/04/08/10/42/burj-khalifa-2212978_1280.jpg', title: 'Dubaï, Émirats Arabes Unis', category: 'monde', country: 'Émirats Arabes Unis' },
  { id: 'w24', url: 'https://cdn.pixabay.com/photo/2019/03/27/15/24/bora-bora-4085078_1280.jpg', title: 'Bora Bora, Polynésie française', category: 'monde', country: 'France (Outre-mer)' },
  { id: 'w25', url: 'https://cdn.pixabay.com/photo/2018/11/17/07/10/cape-town-3820157_1280.jpg', title: 'Cape Town, Afrique du Sud', category: 'monde', country: 'Afrique du Sud' },
  { id: 'w26', url: 'https://cdn.pixabay.com/photo/2020/03/26/22/15/petra-4971956_1280.jpg', title: 'Pétra, Jordanie', category: 'monde', country: 'Jordanie' },
  { id: 'w27', url: 'https://cdn.pixabay.com/photo/2020/06/05/16/18/temple-5263765_1280.jpg', title: 'Angkor Wat, Cambodge', category: 'monde', country: 'Cambodge' },
  { id: 'w28', url: 'https://cdn.pixabay.com/photo/2019/05/02/18/13/volcano-4173848_1280.jpg', title: 'Volcan Arenal, Costa Rica', category: 'monde', country: 'Costa Rica' },
  { id: 'w29', url: 'https://cdn.pixabay.com/photo/2017/08/24/01/12/mount-roraima-2674921_1280.jpg', title: 'Mont Roraima, Venezuela', category: 'monde', country: 'Venezuela' },
  { id: 'w30', url: 'https://cdn.pixabay.com/photo/2017/08/07/23/50/mountains-2608866_1280.jpg', title: 'Machu Picchu, Pérou', category: 'monde', country: 'Pérou' },
];

// 30 images de pays européens
export const europeImages: PinterestImage[] = [
  { id: 'e1', url: 'https://cdn.pixabay.com/photo/2013/03/02/02/41/alley-89197_1280.jpg', title: 'Prague, République tchèque', category: 'europe', country: 'République tchèque' },
  { id: 'e2', url: 'https://cdn.pixabay.com/photo/2016/07/11/21/23/water-1510591_1280.jpg', title: 'Venise, Italie', category: 'europe', country: 'Italie' },
  { id: 'e3', url: 'https://cdn.pixabay.com/photo/2015/12/08/00/30/budapest-1081698_1280.jpg', title: 'Budapest, Hongrie', category: 'europe', country: 'Hongrie' },
  { id: 'e4', url: 'https://cdn.pixabay.com/photo/2014/11/13/23/34/london-530055_1280.jpg', title: 'Londres, Royaume-Uni', category: 'europe', country: 'Royaume-Uni' },
  { id: 'e5', url: 'https://cdn.pixabay.com/photo/2017/08/03/13/38/people-2576110_1280.jpg', title: 'Barcelone, Espagne', category: 'europe', country: 'Espagne' },
  { id: 'e6', url: 'https://cdn.pixabay.com/photo/2018/07/18/20/25/channel-3547224_1280.jpg', title: 'Amsterdam, Pays-Bas', category: 'europe', country: 'Pays-Bas' },
  { id: 'e7', url: 'https://cdn.pixabay.com/photo/2018/08/26/23/55/woman-3633737_1280.jpg', title: 'Santorin, Grèce', category: 'europe', country: 'Grèce' },
  { id: 'e8', url: 'https://cdn.pixabay.com/photo/2019/05/01/13/29/hallstatt-4171426_1280.jpg', title: 'Hallstatt, Autriche', category: 'europe', country: 'Autriche' },
  { id: 'e9', url: 'https://cdn.pixabay.com/photo/2016/10/30/05/43/pomegranate-1782220_1280.jpg', title: 'Porto, Portugal', category: 'europe', country: 'Portugal' },
  { id: 'e10', url: 'https://cdn.pixabay.com/photo/2014/11/01/18/44/dubrovnik-513799_1280.jpg', title: 'Dubrovnik, Croatie', category: 'europe', country: 'Croatie' },
  { id: 'e11', url: 'https://cdn.pixabay.com/photo/2017/08/07/16/39/berlin-2605523_1280.jpg', title: 'Berlin, Allemagne', category: 'europe', country: 'Allemagne' },
  { id: 'e12', url: 'https://cdn.pixabay.com/photo/2021/03/28/14/01/irish-landscape-6131528_1280.jpg', title: 'Falaises de Moher, Irlande', category: 'europe', country: 'Irlande' },
  { id: 'e13', url: 'https://cdn.pixabay.com/photo/2018/03/17/10/05/warsaw-3233965_1280.jpg', title: 'Varsovie, Pologne', category: 'europe', country: 'Pologne' },
  { id: 'e14', url: 'https://cdn.pixabay.com/photo/2013/06/12/21/39/bran-castle-139494_1280.jpg', title: 'Château de Bran, Roumanie', category: 'europe', country: 'Roumanie' },
  { id: 'e15', url: 'https://cdn.pixabay.com/photo/2017/12/27/14/02/friends-3042751_1280.jpg', title: 'Suisse', category: 'europe', country: 'Suisse' },
  { id: 'e16', url: 'https://cdn.pixabay.com/photo/2021/11/09/12/16/sea-6781567_1280.jpg', title: 'Algarve, Portugal', category: 'europe', country: 'Portugal' },
  { id: 'e17', url: 'https://cdn.pixabay.com/photo/2017/07/15/13/56/castle-2506704_1280.jpg', title: 'Château de Neuschwanstein, Allemagne', category: 'europe', country: 'Allemagne' },
  { id: 'e18', url: 'https://cdn.pixabay.com/photo/2017/08/10/08/25/sweden-2620133_1280.jpg', title: 'Stockholm, Suède', category: 'europe', country: 'Suède' },
  { id: 'e19', url: 'https://cdn.pixabay.com/photo/2020/07/23/21/34/copenhagen-5432792_1280.jpg', title: 'Copenhague, Danemark', category: 'europe', country: 'Danemark' },
  { id: 'e20', url: 'https://cdn.pixabay.com/photo/2015/03/26/10/07/cyprus-691379_1280.jpg', title: 'Chypre', category: 'europe', country: 'Chypre' },
  { id: 'e21', url: 'https://cdn.pixabay.com/photo/2017/12/16/22/22/iceland-3023638_1280.jpg', title: 'Islande', category: 'europe', country: 'Islande' },
  { id: 'e22', url: 'https://cdn.pixabay.com/photo/2019/03/08/20/14/florence-4043227_1280.jpg', title: 'Florence, Italie', category: 'europe', country: 'Italie' },
  { id: 'e23', url: 'https://cdn.pixabay.com/photo/2018/04/25/09/26/eiffel-tower-3349075_1280.jpg', title: 'Paris, France', category: 'europe', country: 'France' },
  { id: 'e24', url: 'https://cdn.pixabay.com/photo/2014/09/07/21/52/city-438393_1280.jpg', title: 'Bruxelles, Belgique', category: 'europe', country: 'Belgique' },
  { id: 'e25', url: 'https://cdn.pixabay.com/photo/2015/10/30/18/33/rome-1014894_1280.jpg', title: 'Rome, Italie', category: 'europe', country: 'Italie' },
  { id: 'e26', url: 'https://cdn.pixabay.com/photo/2020/01/31/22/50/veliko-tarnovo-4810033_1280.jpg', title: 'Veliko Tarnovo, Bulgarie', category: 'europe', country: 'Bulgarie' },
  { id: 'e27', url: 'https://cdn.pixabay.com/photo/2016/09/02/08/32/blue-sky-1638925_1280.jpg', title: 'Alicante, Espagne', category: 'europe', country: 'Espagne' },
  { id: 'e28', url: 'https://cdn.pixabay.com/photo/2022/09/11/11/53/helsinki-cathedral-7447107_1280.jpg', title: 'Helsinki, Finlande', category: 'europe', country: 'Finlande' },
  { id: 'e29', url: 'https://cdn.pixabay.com/photo/2022/04/13/14/45/old-town-7130690_1280.jpg', title: 'Tallinn, Estonie', category: 'europe', country: 'Estonie' },
  { id: 'e30', url: 'https://cdn.pixabay.com/photo/2017/02/24/02/37/ljubljana-2093459_1280.jpg', title: 'Ljubljana, Slovénie', category: 'europe', country: 'Slovénie' },
];

// 30 images de régions françaises
export const franceImages: PinterestImage[] = [
  { id: 'f1', url: 'https://cdn.pixabay.com/photo/2021/09/30/08/53/abbey-6669533_1280.jpg', title: 'Mont-Saint-Michel, Normandie', category: 'france', region: 'Normandie' },
  { id: 'f2', url: 'https://cdn.pixabay.com/photo/2016/11/18/19/01/paris-1836415_1280.jpg', title: 'Paris, Île-de-France', category: 'france', region: 'Île-de-France' },
  { id: 'f3', url: 'https://cdn.pixabay.com/photo/2018/07/17/14/43/chateau-de-chenonceau-3544991_1280.jpg', title: 'Château de Chenonceau, Centre-Val de Loire', category: 'france', region: 'Centre-Val de Loire' },
  { id: 'f4', url: 'https://cdn.pixabay.com/photo/2013/04/11/19/46/louvre-102840_1280.jpg', title: 'Musée du Louvre, Paris', category: 'france', region: 'Île-de-France' },
  { id: 'f5', url: 'https://cdn.pixabay.com/photo/2019/06/25/13/59/city-4298285_1280.jpg', title: 'Strasbourg, Grand Est', category: 'france', region: 'Grand Est' },
  { id: 'f6', url: 'https://cdn.pixabay.com/photo/2016/11/23/15/14/côte-dazur-1853522_1280.jpg', title: 'Côte d\'Azur, Provence-Alpes-Côte d\'Azur', category: 'france', region: 'Provence-Alpes-Côte d\'Azur' },
  { id: 'f7', url: 'https://cdn.pixabay.com/photo/2016/11/21/15/42/agriculture-1846358_1280.jpg', title: 'Lavande en Provence', category: 'france', region: 'Provence-Alpes-Côte d\'Azur' },
  { id: 'f8', url: 'https://cdn.pixabay.com/photo/2017/07/24/20/08/old-town-2535815_1280.jpg', title: 'Lyon, Auvergne-Rhône-Alpes', category: 'france', region: 'Auvergne-Rhône-Alpes' },
  { id: 'f9', url: 'https://cdn.pixabay.com/photo/2017/09/09/18/25/obernai-2732991_1280.jpg', title: 'Obernai, Alsace', category: 'france', region: 'Grand Est' },
  { id: 'f10', url: 'https://cdn.pixabay.com/photo/2017/05/27/15/56/chamonix-2349021_1280.jpg', title: 'Chamonix-Mont-Blanc, Auvergne-Rhône-Alpes', category: 'france', region: 'Auvergne-Rhône-Alpes' },
  { id: 'f11', url: 'https://cdn.pixabay.com/photo/2014/09/21/17/56/canyon-455298_1280.jpg', title: 'Gorges du Verdon, Provence-Alpes-Côte d\'Azur', category: 'france', region: 'Provence-Alpes-Côte d\'Azur' },
  { id: 'f12', url: 'https://cdn.pixabay.com/photo/2013/09/16/16/00/castle-182835_1280.jpg', title: 'Château de Chambord, Centre-Val de Loire', category: 'france', region: 'Centre-Val de Loire' },
  { id: 'f13', url: 'https://cdn.pixabay.com/photo/2019/06/29/14/22/brittany-4306457_1280.jpg', title: 'Saint-Malo, Bretagne', category: 'france', region: 'Bretagne' },
  { id: 'f14', url: 'https://cdn.pixabay.com/photo/2016/11/14/05/29/children-1822704_1280.jpg', title: 'Dune du Pilat, Nouvelle-Aquitaine', category: 'france', region: 'Nouvelle-Aquitaine' },
  { id: 'f15', url: 'https://cdn.pixabay.com/photo/2021/11/14/19/21/port-6795500_1280.jpg', title: 'Marseille, Provence-Alpes-Côte d\'Azur', category: 'france', region: 'Provence-Alpes-Côte d\'Azur' },
  { id: 'f16', url: 'https://cdn.pixabay.com/photo/2015/10/25/16/52/colmar-1006169_1280.jpg', title: 'Colmar, Grand Est', category: 'france', region: 'Grand Est' },
  { id: 'f17', url: 'https://cdn.pixabay.com/photo/2017/06/11/13/36/etretat-2392357_1280.jpg', title: 'Étretat, Normandie', category: 'france', region: 'Normandie' },
  { id: 'f18', url: 'https://cdn.pixabay.com/photo/2018/10/19/10/24/albi-3758253_1280.jpg', title: 'Albi, Occitanie', category: 'france', region: 'Occitanie' },
  { id: 'f19', url: 'https://cdn.pixabay.com/photo/2016/09/01/13/52/annecy-1636868_1280.jpg', title: 'Annecy, Auvergne-Rhône-Alpes', category: 'france', region: 'Auvergne-Rhône-Alpes' },
  { id: 'f20', url: 'https://cdn.pixabay.com/photo/2018/11/20/13/02/port-3826131_1280.jpg', title: 'Bonifacio, Corse', category: 'france', region: 'Corse' },
  { id: 'f21', url: 'https://cdn.pixabay.com/photo/2013/04/13/20/05/mont-blanc-103442_1280.jpg', title: 'Mont Blanc, Auvergne-Rhône-Alpes', category: 'france', region: 'Auvergne-Rhône-Alpes' },
  { id: 'f22', url: 'https://cdn.pixabay.com/photo/2016/11/01/08/36/brittany-1787717_1280.jpg', title: 'Phare de Bretagne', category: 'france', region: 'Bretagne' },
  { id: 'f23', url: 'https://cdn.pixabay.com/photo/2016/12/09/06/59/vineyard-1893138_1280.jpg', title: 'Vignobles, Bourgogne', category: 'france', region: 'Bourgogne-Franche-Comté' },
  { id: 'f24', url: 'https://cdn.pixabay.com/photo/2019/05/12/15/11/dijon-4198411_1280.jpg', title: 'Dijon, Bourgogne', category: 'france', region: 'Bourgogne-Franche-Comté' },
  { id: 'f25', url: 'https://cdn.pixabay.com/photo/2016/03/17/16/42/bordeaux-1263606_1280.jpg', title: 'Bordeaux, Nouvelle-Aquitaine', category: 'france', region: 'Nouvelle-Aquitaine' },
  { id: 'f26', url: 'https://cdn.pixabay.com/photo/2015/11/18/15/57/castle-1049296_1280.jpg', title: 'Château de Carcassonne, Occitanie', category: 'france', region: 'Occitanie' },
  { id: 'f27', url: 'https://cdn.pixabay.com/photo/2019/08/21/15/12/old-town-4421603_1280.jpg', title: 'Lille, Hauts-de-France', category: 'france', region: 'Hauts-de-France' },
  { id: 'f28', url: 'https://cdn.pixabay.com/photo/2017/05/21/13/16/viaduct-2331312_1280.jpg', title: 'Viaduc de Millau, Occitanie', category: 'france', region: 'Occitanie' },
  { id: 'f29', url: 'https://cdn.pixabay.com/photo/2014/09/08/17/31/avignon-439013_1280.jpg', title: 'Avignon, Provence-Alpes-Côte d\'Azur', category: 'france', region: 'Provence-Alpes-Côte d\'Azur' },
  { id: 'f30', url: 'https://cdn.pixabay.com/photo/2022/10/18/07/06/cordes-sur-ciel-7530078_1280.jpg', title: 'Cordes-sur-Ciel, Occitanie', category: 'france', region: 'Occitanie' },
];

// Combiner toutes les images
export const allImages: PinterestImage[] = [
  ...worldImages,
  ...europeImages,
  ...franceImages
];

// Designs prédéfinis
export const pinterestDesigns: PinterestDesign[] = [
  {
    id: 'design1',
    name: 'Rouge Passion',
    primaryColor: '#e63946',
    secondaryColor: '#f1faee',
    textColor: '#1d3557',
    accentColor: '#a8dadc',
    overlayStyle: 'gradient',
    titleFont: 'Montserrat',
    descriptionFont: 'Open Sans'
  },
  {
    id: 'design2',
    name: 'Bleu Océan',
    primaryColor: '#1a535c',
    secondaryColor: '#f7fff7',
    textColor: '#4ecdc4',
    accentColor: '#ff6b6b',
    overlayStyle: 'frame',
    titleFont: 'Playfair Display',
    descriptionFont: 'Roboto'
  },
  {
    id: 'design3',
    name: 'Minimaliste',
    primaryColor: '#fffcf2',
    secondaryColor: '#403d39',
    textColor: '#252422',
    accentColor: '#eb5e28',
    overlayStyle: 'none',
    titleFont: 'Raleway',
    descriptionFont: 'Lato'
  },
  {
    id: 'design4',
    name: 'Nature Verte',
    primaryColor: '#606c38',
    secondaryColor: '#fefae0',
    textColor: '#283618',
    accentColor: '#dda15e',
    overlayStyle: 'solid',
    titleFont: 'Oswald',
    descriptionFont: 'Nunito'
  },
  {
    id: 'design5',
    name: 'Pastel Dream',
    primaryColor: '#f8edeb',
    secondaryColor: '#fcd5ce',
    textColor: '#9b5de5',
    accentColor: '#f1a8a5',
    overlayStyle: 'gradient',
    titleFont: 'Dancing Script',
    descriptionFont: 'Quicksand'
  },
  {
    id: 'design6',
    name: 'Dark Mode',
    primaryColor: '#0b090a',
    secondaryColor: '#161a1d',
    textColor: '#ffffff',
    accentColor: '#e5383b',
    overlayStyle: 'solid',
    titleFont: 'Bebas Neue',
    descriptionFont: 'Roboto Condensed'
  }
];

// Call-to-action prédéfinis
export const callToActions = [
  'Découvrir',
  'En savoir plus',
  'Explorer',
  'Voir maintenant',
  'Visiter',
  'Réserver',
  'Planifier',
  'S\'inspirer',
  'Lire l\'article',
  'Télécharger le guide'
];

// Hashtags prédéfinis
export const popularHashtags = [
  'voyage', 'travel', 'vacation', 'explore', 'wanderlust', 'travelgram', 'adventure', 
  'photography', 'nature', 'beautiful', 'landscape', 'travelphotography', 'vacation', 
  'photooftheday', 'instatravel', 'holiday', 'trip', 'tourism', 'explorer', 'visitfrance',
  'travelblogger', 'traveling', 'naturephotography', 'picoftheday', 'paris', 'europe', 
  'france', 'traveler', 'tourist', 'roadtrip', 'vacances', 'découverte', 'voyageur'
];

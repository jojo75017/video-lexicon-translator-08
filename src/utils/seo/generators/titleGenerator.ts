
// Utility to detect if a keyword is geographic or related to travel
export const detectGeographicKeyword = (keyword: string): string | null => {
  // Common country names
  const countries = ['france', 'italie', 'espagne', 'japon', 'thaïlande', 'usa', 'états-unis', 'angleterre', 'allemagne', 'australie', 'canada', 'chine', 'inde', 'brésil', 'mexique', 'maroc', 'tunisie', 'égypte', 'turquie', 'grèce', 'portugal', 'indonésie', 'bali', 'vietnam'];
  
  // Common city names
  const cities = ['paris', 'londres', 'rome', 'barcelone', 'new york', 'tokyo', 'kyoto', 'bangkok', 'sydney', 'berlin', 'amsterdam', 'venise', 'florence', 'madrid', 'lisbonne', 'istanbul', 'athènes', 'prague', 'vienne', 'budapest', 'dubrovnik', 'marrakech', 'fès', 'hong kong', 'singapour', 'dubai', 'rio', 'buenos aires', 'los angeles', 'san francisco', 'miami', 'las vegas', 'hawaii', 'tahiti', 'bora bora', 'ubud', 'canggu'];

  // Travel-related terms
  const travelTerms = ['voyage', 'tourisme', 'visiter', 'séjour', 'excursion', 'vacances', 'circuit', 'road trip', 'croisière', 'backpacking', 'digital nomad', 'nomade', 'plage', 'montagne', 'randonnée', 'trekking', 'safari', 'culture', 'gastronomie', 'hébergement', 'hôtel', 'restaurant', 'activités', 'monuments', 'musées', 'histoire'];

  const lowercaseKeyword = keyword.toLowerCase();

  // Check if keyword contains a country name
  for (const country of countries) {
    if (lowercaseKeyword.includes(country)) {
      return country.charAt(0).toUpperCase() + country.slice(1);
    }
  }

  // Check if keyword contains a city name
  for (const city of cities) {
    if (lowercaseKeyword.includes(city)) {
      return city.charAt(0).toUpperCase() + city.slice(1);
    }
  }

  // Check if it's a travel-related keyword
  for (const term of travelTerms) {
    if (lowercaseKeyword.includes(term)) {
      return keyword;
    }
  }

  // If no matches found, it's not a geographic or travel keyword
  return null;
};

// Generate a SEO-optimized title based on a keyword
export const generateSeoTitle = (keyword: string): string => {
  const geoLocation = detectGeographicKeyword(keyword);
  
  if (geoLocation) {
    // Geographic or travel-related titles
    const travelTitles = [
      `Guide Complet: Voyage à ${geoLocation} - Top 10 Expériences`,
      `${geoLocation}: Le Guide Ultime pour Découvrir cette Destination`,
      `Explorer ${geoLocation}: Conseils, Activités et Bonnes Adresses`,
      `Que Faire à ${geoLocation}? Le Guide Complet du Voyageur`,
      `${geoLocation} - Itinéraire, Budget et Conseils Pratiques`,
      `Visiter ${geoLocation} en 2024: Le Guide des Incontournables`,
      `${geoLocation}: Notre Guide de Voyage et Conseils d'Experts`,
      `Découverte de ${geoLocation}: Les Incontournables et Trésors Cachés`,
      `Voyage à ${geoLocation}: Tout ce que vous devez savoir`
    ];
    
    return travelTitles[Math.floor(Math.random() * travelTitles.length)];
  } else {
    // Generic titles for non-geographic keywords
    const genericTitles = [
      `Guide Complet: ${keyword} - Tout ce que vous devez savoir`,
      `${keyword}: Conseils d'experts et bonnes pratiques`,
      `Comment maîtriser ${keyword} - Guide étape par étape`,
      `Découvrez ${keyword}: Le guide ultime pour réussir`,
      `${keyword}: Les meilleures stratégies et conseils pratiques`
    ];
    
    return genericTitles[Math.floor(Math.random() * genericTitles.length)];
  }
};

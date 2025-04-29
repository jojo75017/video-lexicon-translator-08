
import { detectGeographicKeyword } from './titleGenerator';

/**
 * Génère une liste de hashtags pertinents pour un mot-clé donné
 */
export const generateHashtagsForKeyword = (keyword: string): string[] => {
  // Normaliser le keyword
  const normalizedKeyword = keyword.toLowerCase().trim();
  
  // Vérifier si c'est un mot-clé géographique
  const isGeographic = detectGeographicKeyword(keyword);
  
  // Hashtags génériques pour tous les types de contenu
  const genericHashtags = [
    "#SEO", "#Référencement", "#Google", "#Digital",
    "#Marketing", "#Web", "#Conseils", "#Astuces"
  ];
  
  // Hashtags basés sur le mot-clé lui-même (enlever les mots communs)
  const keywordParts = normalizedKeyword
    .replace(/[^\wÀ-ÿ\s]/gi, '') // Supprimer les caractères spéciaux sauf accents
    .split(/\s+/)
    .filter(part => 
      part.length > 3 && 
      !["comment", "pour", "avec", "dans", "les", "des", "que", "qui"].includes(part)
    );
  
  // Convertir les parties du mot-clé en hashtags correctement formatés
  const keywordHashtags = keywordParts.map(part => "#" + part.charAt(0).toUpperCase() + part.slice(1));
  
  // Hashtags spécifiques selon le type de contenu
  let specificHashtags: string[] = [];
  
  if (isGeographic) {
    specificHashtags = [
      "#Voyage", "#Tourisme", "#Destination", "#Guide",
      "#Découverte", "#Visite", "#Exploration", "#Incontournable"
    ];
    
    // Si c'est une ville ou pays spécifique, ajouter des hashtags pertinents
    if (normalizedKeyword.includes("paris")) {
      specificHashtags.push("#Paris", "#France", "#TourEiffel", "#ChampsElysees");
    } else if (normalizedKeyword.includes("rome")) {
      specificHashtags.push("#Rome", "#Italie", "#Colisée", "#Vatican");
    } else if (normalizedKeyword.includes("londres")) {
      specificHashtags.push("#Londres", "#UK", "#BigBen", "#RoyaumeUni");
    } else if (normalizedKeyword.includes("bali")) {
      specificHashtags.push("#Bali", "#Indonésie", "#Vacances", "#Plage", "#Temples");
    } else if (normalizedKeyword.includes("japon")) {
      specificHashtags.push("#Japon", "#Tokyo", "#Kyoto", "#Culture", "#Tradition");
    } else if (normalizedKeyword.includes("portugal")) {
      specificHashtags.push("#Portugal", "#Lisbonne", "#Porto", "#Algarve", "#Voyage");
    }
    
    // Si on parle de plages
    if (normalizedKeyword.includes("plage") || normalizedKeyword.includes("mer")) {
      specificHashtags.push("#Plage", "#Mer", "#Océan", "#Vacances", "#Été");
    }
    // Si on parle de montagnes
    else if (normalizedKeyword.includes("montagne") || normalizedKeyword.includes("randonnée")) {
      specificHashtags.push("#Montagne", "#Randonnée", "#Nature", "#Paysage", "#Aventure");
    }
    // Si on parle de villes
    else if (normalizedKeyword.includes("ville") || normalizedKeyword.includes("city")) {
      specificHashtags.push("#Ville", "#CityTrip", "#Escapade", "#Urbain", "#Architecture");
    }
  } else {
    // Vérifier si c'est lié au SEO
    if (normalizedKeyword.includes("seo") || normalizedKeyword.includes("référencement")) {
      specificHashtags = [
        "#SEO", "#Référencement", "#MotsCles", "#Google", 
        "#Trafic", "#Marketing", "#PageRank", "#StrategieSEO"
      ];
    } 
    // Vérifier si c'est lié au marketing
    else if (normalizedKeyword.includes("marketing") || normalizedKeyword.includes("vente") || 
             normalizedKeyword.includes("client") || normalizedKeyword.includes("produit")) {
      specificHashtags = [
        "#Marketing", "#Vente", "#Business", "#Stratégie", 
        "#Client", "#MarketingDigital", "#Croissance", "#Conversion"
      ];
    }
    // Contenu informatif/technique par défaut
    else {
      specificHashtags = [
        "#Conseils", "#Guide", "#HowTo", "#Expert", 
        "#Stratégie", "#Performance", "#Optimisation", "#Solutions"
      ];
    }
  }
  
  // Combiner les hashtags (avec #) et déduplicater
  const allHashtags = [...keywordHashtags, ...specificHashtags, ...genericHashtags];
  
  // Filtrer les doublons en préservant l'ordre
  const uniqueHashtags: string[] = [];
  const seenHashtags = new Set<string>();
  
  for (const hashtag of allHashtags) {
    const normalizedHashtag = hashtag.toLowerCase();
    if (!seenHashtags.has(normalizedHashtag)) {
      seenHashtags.add(normalizedHashtag);
      uniqueHashtags.push(hashtag);
    }
  }
  
  // Limiter à un nombre raisonnable de hashtags (max 12)
  return uniqueHashtags.slice(0, 12);
};

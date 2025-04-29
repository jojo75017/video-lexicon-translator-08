
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
    "SEO", "Référencement", "Google", "Digital",
    "Marketing", "Web", "Conseils", "Astuces"
  ];
  
  // Hashtags basés sur le mot-clé lui-même (enlever les mots communs)
  const keywordParts = normalizedKeyword
    .replace(/[^\wÀ-ÿ\s]/gi, '') // Supprimer les caractères spéciaux sauf accents
    .split(/\s+/)
    .filter(part => 
      part.length > 3 && 
      !["comment", "pour", "avec", "dans", "les", "des", "que", "qui"].includes(part)
    );
  
  const keywordHashtags = keywordParts.map(part => part.charAt(0).toUpperCase() + part.slice(1));
  
  // Hashtags spécifiques selon le type de contenu
  let specificHashtags: string[] = [];
  
  if (isGeographic) {
    specificHashtags = [
      "Voyage", "Tourisme", "Destination", "Guide",
      "Découverte", "Visite", "Exploration", "Incontournable"
    ];
    
    // Si c'est Bali spécifiquement
    if (normalizedKeyword.includes("bali")) {
      specificHashtags.push("Bali", "Indonésie", "Vacances", "Plage", "Temples");
    }
    // Si on parle de rizières
    if (normalizedKeyword.includes("rizière") || normalizedKeyword.includes("riziere") || normalizedKeyword.includes("rizieres")) {
      specificHashtags.push("Rizières", "Paysage", "Agriculture", "Terrasses", "Nature");
    }
  } else {
    // Contenu informatif/technique par défaut
    specificHashtags = [
      "Conseils", "Guide", "HowTo", "Expert", 
      "Stratégie", "Performance", "Optimisation", "Solutions"
    ];
  }
  
  // Combiner et déduplicater les hashtags
  const allHashtags = [...keywordHashtags, ...specificHashtags, ...genericHashtags];
  const uniqueHashtags = Array.from(new Set(allHashtags)).slice(0, 15);
  
  return uniqueHashtags;
};


import { detectGeographicKeyword } from '../titleGenerator';

/**
 * Detects various keyword types and patterns to determine the appropriate template
 */
export const detectKeywordType = (keyword: string): {
  isGeographic: boolean;
  hasBali: boolean;
  hasDigitalNomad: boolean;
  hasRizieres: boolean;
  hasVoyage: boolean;
  hasSolo: boolean;
  isHowTo: boolean;
  containsMultipleEntities: boolean;
  mainSubject: string;
} => {
  if (!keyword || keyword.trim().length === 0) {
    keyword = "sujet";
  }

  // Cleaning and prep
  const keywordLowerCase = keyword.toLowerCase().trim();
  
  // Detect geographic keywords
  const isGeographic = detectGeographicKeyword(keyword);
  
  // Detect multiple entities
  const containsMultipleEntities = keyword.includes(" et ") || 
                                  keyword.includes(" & ") || 
                                  keyword.includes(" vs ") || 
                                  keyword.includes(" ou ");
  
  // Detect specific topics
  const hasBali = keywordLowerCase.includes("bali");
  const hasDigitalNomad = keywordLowerCase.includes("digital nomad") || 
                          keywordLowerCase.includes("nomade digital") || 
                          keywordLowerCase.includes("nomade numérique") ||
                          keywordLowerCase.includes("travail à distance");
  const hasRizieres = keywordLowerCase.includes("rizière") || 
                      keywordLowerCase.includes("rizieres") || 
                      keywordLowerCase.includes("riziere");
  const hasVoyage = keywordLowerCase.includes("voyage") || 
                    keywordLowerCase.includes("voyager") ||
                    keywordLowerCase.includes("voyageur") || 
                    keywordLowerCase.includes("tourisme");
  const hasSolo = keywordLowerCase.includes("solo") || 
                  keywordLowerCase.includes("seul");
  
  // Detect how-to pattern
  const isHowTo = keywordLowerCase.startsWith("comment ") || 
                  keywordLowerCase.startsWith("découvrez comment ") ||
                  keywordLowerCase.includes("guide") || 
                  keywordLowerCase.includes("tutoriel") ||
                  keywordLowerCase.includes("conseil");
  
  // Extract main subject after "comment" if present
  let mainSubject = keyword;
  if (keywordLowerCase.startsWith("comment ")) {
    mainSubject = keyword.substring("comment ".length);
  } else if (keywordLowerCase.startsWith("découvrez comment ")) {
    mainSubject = keyword.substring("découvrez comment ".length);
  }
  
  return {
    isGeographic,
    hasBali,
    hasDigitalNomad,
    hasRizieres,
    hasVoyage,
    hasSolo,
    isHowTo,
    containsMultipleEntities,
    mainSubject
  };
};

/**
 * Extracts entities from a compound keyword (for multiple locations)
 */
export const extractEntities = (keyword: string): string[] => {
  if (keyword.includes(" et ")) {
    return keyword.split(" et ");
  } else if (keyword.includes(" & ")) {
    return keyword.split(" & ");
  } else if (keyword.includes(" vs ")) {
    return keyword.split(" vs ");
  } else if (keyword.includes(" ou ")) {
    return keyword.split(" ou ");
  }
  return [keyword];
};


import { KeywordFrequency } from "@/types/seo/Keyword";
import { stopWords } from './constants/seoConstants';

/**
 * Extraie les mots-clés les plus importants d'un contenu HTML
 * @param htmlContent Le contenu HTML de la page à analyser
 * @returns Une liste de mots-clés avec leur fréquence et densité
 */
export const extractKeywordsFromHtml = (htmlContent: string): KeywordFrequency[] => {
  if (!htmlContent || htmlContent.length === 0) {
    console.warn("Contenu HTML vide pour l'extraction de mots-clés");
    return [];
  }

  try {
    // Nettoyer le HTML pour extraire uniquement le texte
    const textContent = htmlContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .trim();

    // Diviser le texte en mots
    const words = textContent.split(/\s+/);
    const totalWords = words.length;
    
    // Compter la fréquence des mots et des expressions
    const keywordFrequency: Record<string, number> = {};
    
    // Parcourir les mots pour extraire mots simples et expressions
    for (let i = 0; i < words.length; i++) {
      const word = words[i].replace(/[^\w\sàáâäæçèéêëìíîïòóôöùúûüÿ-]/g, '');
      
      // Ne prendre en compte que les mots significatifs (plus de 3 caractères et pas dans les stop words)
      if (word.length > 3 && !stopWords.has(word)) {
        keywordFrequency[word] = (keywordFrequency[word] || 0) + 1;
        
        // Expressions de deux mots
        if (i < words.length - 1) {
          const word2 = words[i + 1].replace(/[^\w\sàáâäæçèéêëìíîïòóôöùúûüÿ-]/g, '');
          if (word2.length > 3 && !stopWords.has(word2)) {
            const phrase = `${word} ${word2}`;
            keywordFrequency[phrase] = (keywordFrequency[phrase] || 0) + 1;
          }
          
          // Expressions de trois mots
          if (i < words.length - 2) {
            const word3 = words[i + 2].replace(/[^\w\sàáâäæçèéêëìíîïòóôöùúûüÿ-]/g, '');
            if (word3.length > 3 && !stopWords.has(word3)) {
              const phrase = `${word} ${word2} ${word3}`;
              keywordFrequency[phrase] = (keywordFrequency[phrase] || 0) + 1;
            }
          }
        }
      }
    }
    
    // Convertir les résultats en tableau et trier par fréquence
    const keywords: KeywordFrequency[] = Object.entries(keywordFrequency)
      .filter(([_, count]) => count > 1) // Filtrer les occurrences uniques
      .map(([keyword, count], index) => ({
        keyword,
        count,
        density: (count / totalWords) * 100,
        position: index + 1
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Garder les 20 mots-clés les plus fréquents
    
    return keywords;
  } catch (error) {
    console.error("Erreur lors de l'extraction des mots-clés:", error);
    return [];
  }
};

/**
 * Transforme les mots-clés extraits en suggestions enrichies
 */
export const enrichKeywords = (keywords: KeywordFrequency[]): KeywordSuggestion[] => {
  return keywords.map(kw => ({
    keyword: kw.keyword,
    volume: Math.floor(Math.random() * 5000) + 500, // Données fictives pour la démo
    difficulty: Math.floor(Math.random() * 100),
    relevance: Math.min(100, kw.count * 10),
    searchVolume: Math.floor(Math.random() * 5000) + 500,
    cpc: parseFloat((Math.random() * 5).toFixed(2)),
    competition: parseFloat(Math.random().toFixed(2)),
    suggestedTitle: `${kw.keyword} - Guide Complet | Informations et Conseils ${new Date().getFullYear()}`,
    suggestedDescription: `Découvrez tout sur ${kw.keyword}. Guide complet avec conseils d'experts, astuces et informations pratiques pour optimiser votre stratégie.`
  }));
};

/**
 * Fonction principale pour extraire et enrichir les mots-clés d'un site web
 */
export const analyzeWebsiteKeywords = async (url: string): Promise<KeywordSuggestion[]> => {
  try {
    console.log(`Extraction des mots-clés pour: ${url}`);
    
    // Récupérer le contenu HTML de la page
    const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
    const html = await response.text();
    
    // Extraire les mots-clés bruts
    const extractedKeywords = extractKeywordsFromHtml(html);
    
    // Enrichir les mots-clés avec des données supplémentaires
    const enrichedKeywords = enrichKeywords(extractedKeywords);
    
    console.log(`Extraction terminée: ${enrichedKeywords.length} mots-clés trouvés`);
    return enrichedKeywords;
  } catch (error) {
    console.error("Erreur lors de l'analyse des mots-clés:", error);
    return [];
  }
};

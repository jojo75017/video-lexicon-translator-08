
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { toast } from 'sonner';

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class PerplexityService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'llama-3.1-sonar-small-128k-online') {
    this.apiKey = apiKey;
    this.model = model;
  }

  /**
   * Validate if the API key is valid by making a simple test request
   */
  async validateApiKey(): Promise<boolean> {
    try {
      toast.loading("Validation de la clé API Perplexity...", {
        id: "validate-perplexity-key"
      });
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'This is a simple test to verify API key validity.'
            },
            {
              role: 'user',
              content: 'Say "valid"'
            }
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        toast.error("Clé API Perplexity invalide", {
          id: "validate-perplexity-key",
          description: `Erreur ${response.status}: ${response.statusText}`
        });
        return false;
      }

      const data = await response.json() as PerplexityResponse;
      const isValid = data.choices[0]?.message?.content?.toLowerCase().includes('valid');
      
      if (isValid) {
        toast.success("Clé API Perplexity validée", {
          id: "validate-perplexity-key"
        });
      } else {
        toast.error("Réponse Perplexity inattendue", {
          id: "validate-perplexity-key"
        });
      }
      
      return isValid;
    } catch (error) {
      console.error('Erreur lors de la validation de la clé Perplexity:', error);
      toast.error("Erreur de validation de la clé API", {
        id: "validate-perplexity-key",
        description: error instanceof Error ? error.message : "Erreur inconnue"
      });
      return false;
    }
  }

  /**
   * Get keyword suggestions based on a seed keyword
   */
  async getKeywordSuggestions(keyword: string, count: number = 10): Promise<KeywordSuggestion[]> {
    try {
      toast.loading(`Génération de suggestions pour "${keyword}"...`, {
        id: "keyword-suggestions"
      });

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `Vous êtes un expert en SEO qui génère des suggestions de mots-clés. 
              Générez EXACTEMENT ${count} suggestions de mots-clés pertinents en français en format JSON strict avec les propriétés suivantes pour chaque mot-clé:
              - keyword (string): le mot-clé
              - volume (number 0-10000): estimation du volume de recherche mensuel
              - difficulty (number 0-100): difficulté à se classer pour ce mot-clé
              - cpc (number 0-5): coût par clic estimé en euros
              - competition (number 0-1): niveau de concurrence
              - suggestedTitle (string): titre SEO optimisé pour ce mot-clé
              - suggestedDescription (string): meta description optimisée pour ce mot-clé

              IMPORTANT: Répondez UNIQUEMENT avec le JSON, sans texte avant ou après. Assurez-vous qu'il y a EXACTEMENT ${count} mots-clés.`
            },
            {
              role: 'user',
              content: `Suggérez des mots-clés SEO pertinents pour : ${keyword}`
            }
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as PerplexityResponse;
      const content = data.choices[0].message.content;
      
      // Try to parse the JSON response
      try {
        // Check if the content is a valid JSON
        const suggestions = JSON.parse(content);
        
        // Validate that we have the right number of suggestions
        const validatedSuggestions = this.validateAndFixSuggestions(suggestions, count, keyword);
        
        toast.success(`${validatedSuggestions.length} suggestions générées pour "${keyword}"`, {
          id: "keyword-suggestions"
        });
        
        return validatedSuggestions;
      } catch (error) {
        console.error('Erreur de parsing JSON:', error);
        console.error('Contenu reçu:', content);
        
        // Generate fallback suggestions if parsing fails
        const fallbackSuggestions = this.generateFallbackSuggestions(keyword, count);
        
        toast.warning("Format de réponse Perplexity incorrect", {
          description: "Des suggestions alternatives ont été générées"
        });
        
        return fallbackSuggestions;
      }
    } catch (error) {
      console.error('Erreur lors de la génération de suggestions:', error);
      toast.error("Erreur lors de la génération de suggestions", {
        id: "keyword-suggestions",
        description: error instanceof Error ? error.message : "Erreur inconnue"
      });
      
      // Return fallback suggestions on error
      return this.generateFallbackSuggestions(keyword, count);
    }
  }
  
  /**
   * Validates and fixes the suggestions to ensure they meet our requirements
   */
  private validateAndFixSuggestions(suggestions: any, count: number, seedKeyword: string): KeywordSuggestion[] {
    let validatedSuggestions: KeywordSuggestion[] = [];
    
    // Check if we have an array or an object with a keywords property
    if (Array.isArray(suggestions)) {
      validatedSuggestions = suggestions;
    } else if (suggestions && typeof suggestions === 'object' && Array.isArray(suggestions.keywords)) {
      validatedSuggestions = suggestions.keywords;
    } else if (suggestions && typeof suggestions === 'object') {
      // Try to extract any array property
      const arrayProps = Object.values(suggestions).filter(val => Array.isArray(val));
      if (arrayProps.length > 0) {
        validatedSuggestions = arrayProps[0] as any[];
      }
    }
    
    // If we still don't have valid suggestions, generate fallbacks
    if (!validatedSuggestions || validatedSuggestions.length === 0) {
      return this.generateFallbackSuggestions(seedKeyword, count);
    }
    
    // Ensure each suggestion has all required properties
    const fixedSuggestions = validatedSuggestions.map((suggestion, index) => {
      return {
        keyword: suggestion.keyword || `${seedKeyword} option ${index + 1}`,
        volume: typeof suggestion.volume === 'number' ? suggestion.volume : Math.floor(Math.random() * 5000) + 500,
        difficulty: typeof suggestion.difficulty === 'number' ? suggestion.difficulty : Math.floor(Math.random() * 80) + 20,
        cpc: typeof suggestion.cpc === 'number' ? suggestion.cpc : parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
        competition: typeof suggestion.competition === 'number' ? suggestion.competition : parseFloat((Math.random() * 0.8).toFixed(2)),
        suggestedTitle: suggestion.suggestedTitle || `Guide complet sur ${suggestion.keyword || seedKeyword}`,
        suggestedDescription: suggestion.suggestedDescription || `Découvrez tout ce que vous devez savoir sur ${suggestion.keyword || seedKeyword}. Conseils d'experts et astuces pour optimiser vos résultats.`
      };
    });
    
    // If we have fewer suggestions than requested, add more
    if (fixedSuggestions.length < count) {
      const additionalNeeded = count - fixedSuggestions.length;
      const additionalSuggestions = this.generateFallbackSuggestions(seedKeyword, additionalNeeded);
      return [...fixedSuggestions, ...additionalSuggestions];
    }
    
    // If we have more suggestions than requested, trim
    if (fixedSuggestions.length > count) {
      return fixedSuggestions.slice(0, count);
    }
    
    return fixedSuggestions;
  }
  
  /**
   * Generate fallback suggestions when the API fails
   */
  private generateFallbackSuggestions(seedKeyword: string, count: number): KeywordSuggestion[] {
    const suggestions: KeywordSuggestion[] = [];
    
    // Pre-defined modifiers for generating variations
    const prefixes = ['guide', 'meilleur', 'comment', 'top', 'pourquoi', 'comparatif', 'avis', 'acheter', 'prix'];
    const suffixes = ['pas cher', 'professionnel', 'en ligne', 'avis', '2025', 'comparatif', 'gratuit', 'près de chez moi', 'avantages'];
    
    // Generate variations
    for (let i = 0; i < count; i++) {
      const usePrefix = i % 3 !== 2;
      const useSuffix = i % 3 !== 1;
      
      let keyword = seedKeyword;
      
      if (usePrefix) {
        keyword = `${prefixes[i % prefixes.length]} ${keyword}`;
      }
      
      if (useSuffix) {
        keyword = `${keyword} ${suffixes[i % suffixes.length]}`;
      }
      
      // For some variations, create long-tail keywords
      if (i >= count - Math.floor(count / 3)) {
        keyword = `comment trouver le meilleur ${seedKeyword} pour ${suffixes[i % suffixes.length]}`;
      }
      
      suggestions.push({
        keyword,
        volume: Math.floor(Math.random() * 5000) + 500,
        difficulty: Math.floor(Math.random() * 80) + 20,
        cpc: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
        competition: parseFloat((Math.random() * 0.8).toFixed(2)),
        suggestedTitle: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} - Guide complet et conseils`,
        suggestedDescription: `Découvrez tout sur ${keyword}. Conseils d'experts, astuces pratiques et guide complet pour vous aider à faire le bon choix.`
      });
    }
    
    return suggestions;
  }

  /**
   * Generate long-tail keyword variations for a seed keyword
   */
  async getLongTailKeywords(keyword: string, count: number = 10): Promise<KeywordSuggestion[]> {
    try {
      toast.loading(`Génération de mots-clés longue traîne pour "${keyword}"...`, {
        id: "longtail-suggestions"
      });

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `Vous êtes un expert en SEO spécialisé dans les mots-clés à longue traîne.
              Générez EXACTEMENT ${count} mots-clés longue traîne en français pour le mot-clé principal fourni.
              Chaque mot-clé doit contenir au moins 4 mots et inclure le mot-clé principal.
              
              Répondez en format JSON strict avec un tableau contenant ces propriétés pour chaque mot-clé:
              - keyword (string): le mot-clé longue traîne (minimum 4 mots, doit inclure le mot-clé principal)
              - volume (number 10-2000): estimation du volume de recherche mensuel
              - difficulty (number 0-60): difficulté à se classer pour ce mot-clé
              - cpc (number 0-3): coût par clic estimé en euros
              - competition (number 0-0.6): niveau de concurrence
              - suggestedTitle (string): titre SEO optimisé pour ce mot-clé
              - suggestedDescription (string): meta description optimisée pour ce mot-clé
              
              IMPORTANT: Répondez UNIQUEMENT avec le JSON, sans texte avant ou après. Assurez-vous qu'il y a EXACTEMENT ${count} mots-clés et que chacun contient AU MOINS 4 mots.`
            },
            {
              role: 'user',
              content: `Générez des mots-clés à longue traîne pour : ${keyword}`
            }
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as PerplexityResponse;
      const content = data.choices[0].message.content;
      
      try {
        const suggestions = JSON.parse(content);
        
        // Validate that suggestions are properly formatted
        const validatedSuggestions = this.validateAndFixLongTailSuggestions(suggestions, count, keyword);
        
        toast.success(`${validatedSuggestions.length} mots-clés longue traîne générés`, {
          id: "longtail-suggestions"
        });
        
        return validatedSuggestions;
      } catch (error) {
        console.error('Erreur de parsing JSON:', error);
        
        // Generate fallback long-tail suggestions
        const fallbackSuggestions = this.generateFallbackLongTailKeywords(keyword, count);
        
        toast.warning("Format de réponse Perplexity incorrect", {
          description: "Des mots-clés longue traîne alternatifs ont été générés"
        });
        
        return fallbackSuggestions;
      }
    } catch (error) {
      console.error('Erreur lors de la génération de mots-clés longue traîne:', error);
      toast.error("Erreur lors de la génération", {
        id: "longtail-suggestions",
        description: error instanceof Error ? error.message : "Erreur inconnue"
      });
      
      return this.generateFallbackLongTailKeywords(keyword, count);
    }
  }

  /**
   * Validate and fix long-tail keyword suggestions
   */
  private validateAndFixLongTailSuggestions(suggestions: any, count: number, seedKeyword: string): KeywordSuggestion[] {
    let validatedSuggestions: KeywordSuggestion[] = [];
    
    // Extract suggestions array
    if (Array.isArray(suggestions)) {
      validatedSuggestions = suggestions;
    } else if (suggestions && typeof suggestions === 'object' && Array.isArray(suggestions.keywords)) {
      validatedSuggestions = suggestions.keywords;
    } else if (suggestions && typeof suggestions === 'object') {
      const arrayProps = Object.values(suggestions).filter(val => Array.isArray(val));
      if (arrayProps.length > 0) {
        validatedSuggestions = arrayProps[0] as any[];
      }
    }
    
    // If we still don't have valid suggestions, generate fallbacks
    if (!validatedSuggestions || validatedSuggestions.length === 0) {
      return this.generateFallbackLongTailKeywords(seedKeyword, count);
    }
    
    // Validate each suggestion
    const fixedSuggestions = validatedSuggestions.map((suggestion, index) => {
      // Ensure the keyword contains the seed keyword and has at least 4 words
      let keyword = suggestion.keyword || '';
      
      // Check if seed keyword is included, if not add it
      if (!keyword.toLowerCase().includes(seedKeyword.toLowerCase())) {
        keyword = `comment trouver le meilleur ${seedKeyword} pour ${index % 2 === 0 ? 'débutants' : 'professionnels'}`;
      }
      
      // Check word count
      const wordCount = keyword.split(/\s+/).length;
      if (wordCount < 4) {
        // Add extra words to make it a long-tail keyword
        const extras = ['efficacement', 'sans problème', 'avec succès', 'à petit prix', 'en toute simplicité'];
        keyword = `${keyword} ${extras[index % extras.length]}`;
      }
      
      return {
        keyword,
        volume: typeof suggestion.volume === 'number' ? suggestion.volume : Math.floor(Math.random() * 500) + 100,
        difficulty: typeof suggestion.difficulty === 'number' ? suggestion.difficulty : Math.floor(Math.random() * 40) + 10,
        cpc: typeof suggestion.cpc === 'number' ? suggestion.cpc : parseFloat((Math.random() * 1.5 + 0.3).toFixed(2)),
        competition: typeof suggestion.competition === 'number' ? suggestion.competition : parseFloat((Math.random() * 0.4).toFixed(2)),
        suggestedTitle: suggestion.suggestedTitle || `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} | Guide étape par étape`,
        suggestedDescription: suggestion.suggestedDescription || `Découvrez comment ${keyword}. Nos conseils d'experts vous guideront dans toutes les étapes de ce processus.`
      };
    });
    
    // Ensure we have the right number of suggestions
    if (fixedSuggestions.length < count) {
      const additionalNeeded = count - fixedSuggestions.length;
      const additionalSuggestions = this.generateFallbackLongTailKeywords(seedKeyword, additionalNeeded);
      return [...fixedSuggestions, ...additionalSuggestions];
    }
    
    if (fixedSuggestions.length > count) {
      return fixedSuggestions.slice(0, count);
    }
    
    return fixedSuggestions;
  }

  /**
   * Generate fallback long-tail keywords
   */
  private generateFallbackLongTailKeywords(seedKeyword: string, count: number): KeywordSuggestion[] {
    const suggestions: KeywordSuggestion[] = [];
    
    // Templates for long-tail keyword generation
    const templates = [
      `comment trouver le meilleur ${seedKeyword} pas cher`,
      `guide complet pour choisir un ${seedKeyword} professionnel`,
      `les erreurs à éviter avec ${seedKeyword} en 2025`,
      `pourquoi investir dans un ${seedKeyword} de qualité`,
      `comment utiliser ${seedKeyword} pour débutants`,
      `comparatif des meilleurs ${seedKeyword} en ligne`,
      `astuces pour optimiser votre ${seedKeyword} facilement`,
      `les meilleurs conseils pour ${seedKeyword} efficace`,
      `tout ce que vous devez savoir sur ${seedKeyword}`,
      `comment améliorer votre ${seedKeyword} rapidement`
    ];
    
    // Additional words to append if needed
    const extras = [
      'pour les professionnels',
      'à petit budget',
      'sans faire d\'erreurs',
      'avec des résultats garantis',
      'en toute simplicité',
      'même sans expérience',
      'pour de meilleurs résultats',
      'en seulement quelques jours',
      'comme les experts',
      'sans investir une fortune'
    ];
    
    for (let i = 0; i < count; i++) {
      // Use templates and add extras to ensure we have 4+ words
      let keyword = templates[i % templates.length];
      
      // If we need more templates, combine with extras
      if (i >= templates.length) {
        const baseIndex = i % templates.length;
        const extraIndex = Math.floor(i / templates.length) % extras.length;
        keyword = `${templates[baseIndex]} ${extras[extraIndex]}`;
      }
      
      suggestions.push({
        keyword,
        volume: Math.floor(Math.random() * 500) + 100,
        difficulty: Math.floor(Math.random() * 40) + 10,
        cpc: parseFloat((Math.random() * 1.5 + 0.3).toFixed(2)),
        competition: parseFloat((Math.random() * 0.4).toFixed(2)),
        suggestedTitle: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} | Guide étape par étape`,
        suggestedDescription: `Découvrez comment ${keyword}. Nos conseils d'experts vous guideront dans toutes les étapes de ce processus.`
      });
    }
    
    return suggestions;
  }

  /**
   * Factory method to create a PerplexityService instance
   */
  static createService(apiKey: string): PerplexityService {
    return new PerplexityService(apiKey);
  }
}

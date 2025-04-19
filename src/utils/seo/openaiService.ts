
export interface OpenAIKeywordResponse {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  competition: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
}

export interface ContentAnalysisResponse {
  score: number;
  readabilityScore: number;
  keywordDensity: { [key: string]: number };
  recommendations: string[];
  contentGaps: string[];
  metaImprovements: string[];
  headingStructureScore: number;
  contentLength: {
    value: number;
    isOptimal: boolean;
    recommendation?: string;
  };
  semanticAnalysis: {
    mainTopics: string[];
    missingTopics: string[];
    entityAnalysis: string[];
  };
}

export class OpenAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getKeywordSuggestions(baseKeyword: string): Promise<OpenAIKeywordResponse[]> {
    try {
      console.log(`Récupération des suggestions de mots-clés pour: ${baseKeyword}`);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Vous êtes un expert en SEO qui fournit des suggestions de mots-clés avec des titres et descriptions optimisés. 
              Retournez un JSON valide contenant un tableau d'objets avec ces propriétés:
              keyword: string - le mot-clé suggéré en français
              volume: number - volume de recherche mensuel estimé entre 100 et 10000
              difficulty: number - difficulté de classement entre 0-100
              cpc: number - coût par clic moyen entre 0.1 et 10
              competition: number - niveau de concurrence entre 0 et 1
              suggestedTitle: string - titre SEO optimisé (max 60 caractères)
              suggestedDescription: string - meta description optimisée (max 155 caractères)`
            },
            {
              role: 'user',
              content: `Générez 5 suggestions de mots-clés pertinents relatifs à "${baseKeyword}" en français avec leurs métriques et suggestions de contenu. Répondez uniquement au format JSON.`
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur de l'API OpenAI: ${response.statusText}`);
      }

      const responseData = await response.json();
      const analysisContent = responseData.choices[0].message.content;
      
      // Extraction du JSON de la réponse
      const jsonMatch = analysisContent.match(/\[.*\]/s);
      if (!jsonMatch) {
        throw new Error("Format de réponse incorrect");
      }
      
      const keywordSuggestions = JSON.parse(jsonMatch[0]);
      console.log("Suggestions générées:", keywordSuggestions);
      return keywordSuggestions;
    } catch (error) {
      console.error("Erreur lors de la récupération des suggestions via OpenAI:", error);
      throw error;
    }
  }

  async analyzeSeoContent(url: string, content: string): Promise<ContentAnalysisResponse> {
    try {
      console.log(`Analyse SEO du contenu pour: ${url}`);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Vous êtes un expert en SEO qui analyse le contenu des pages web.
              Analysez le contenu fourni et retournez un JSON contenant:
              - score: note générale sur 100
              - readabilityScore: score de lisibilité sur 100
              - keywordDensity: objet avec les mots-clés principaux et leur densité
              - recommendations: tableau de recommandations spécifiques pour améliorer le SEO
              - contentGaps: sujets manquants qui devraient être couverts
              - metaImprovements: suggestions pour améliorer les balises meta
              - headingStructureScore: score de la structure des titres sur 100
              - contentLength: analyse de la longueur du contenu
              - semanticAnalysis: analyse sémantique du contenu`
            },
            {
              role: 'user',
              content: `Analysez cette page web: ${url}\n\nContenu:\n${content.substring(0, 4000)}`
            }
          ],
          temperature: 0.2,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur de l'API OpenAI: ${response.statusText}`);
      }

      const responseData = await response.json();
      const analysisContent = responseData.choices[0].message.content;
      
      // Extraction du JSON de la réponse
      const jsonMatch = analysisContent.match(/\{.*\}/s);
      if (!jsonMatch) {
        throw new Error("Format de réponse incorrect");
      }
      
      const analysis = JSON.parse(jsonMatch[0]);
      console.log("Analyse générée:", analysis);
      return analysis;
    } catch (error) {
      console.error("Erreur lors de l'analyse via OpenAI:", error);
      throw error;
    }
  }

  async generateContentSuggestions(keyword: string): Promise<string[]> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Générez des suggestions de contenu SEO optimisées en français.'
            },
            {
              role: 'user',
              content: `Proposez 5 idées d'articles ou de contenus optimisés SEO sur le thème: "${keyword}"`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur de l'API OpenAI: ${response.statusText}`);
      }

      const data = await response.json();
      const suggestions = data.choices[0].message.content
        .split('\n')
        .filter(Boolean)
        .map(s => s.replace(/^\d+\.\s*/, ''));

      return suggestions;
    } catch (error) {
      console.error("Erreur lors de la génération des suggestions:", error);
      throw error;
    }
  }
}

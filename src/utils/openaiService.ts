
interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class OpenAIService {
  private static getApiKey(): string | null {
    return localStorage.getItem('openaiKey');
  }

  static async analyzeWebsiteStructure(content: string, url: string): Promise<{
    keywords: string[];
    structure: any;
    recommendations: string[];
    categories: string[];
  }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Clé API OpenAI non configurée');
    }

    try {
      const prompt = `Analysez ce contenu de site web et fournissez:
1. Les 10 mots-clés principaux liés au contenu réel
2. La structure logique du site
3. 5 recommandations d'amélioration
4. Les catégories de contenu principales

URL: ${url}
Contenu: ${content.substring(0, 2000)}...

Répondez au format JSON:
{
  "keywords": ["mot1", "mot2", ...],
  "structure": {
    "mainTopic": "sujet principal",
    "sections": ["section1", "section2", ...]
  },
  "recommendations": ["recommandation1", ...],
  "categories": ["catégorie1", ...]
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Vous êtes un expert SEO qui analyse les sites web. Répondez toujours en JSON valide.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur OpenAI: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      const content_response = data.choices[0].message.content;
      
      try {
        return JSON.parse(content_response);
      } catch (e) {
        console.error('Erreur de parsing JSON:', content_response);
        // Fallback avec analyse basique
        return this.fallbackAnalysis(content, url);
      }
    } catch (error) {
      console.error('Erreur OpenAI:', error);
      return this.fallbackAnalysis(content, url);
    }
  }

  private static fallbackAnalysis(content: string, url: string) {
    const words = content.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const wordCount: Record<string, number> = {};
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 3) {
        wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
      }
    });

    const keywords = Object.entries(wordCount)
      .filter(([_, count]) => count > 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    const domain = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    return {
      keywords,
      structure: {
        mainTopic: domain,
        sections: ['Accueil', 'Produits', 'Services', 'Contact']
      },
      recommendations: [
        'Optimiser les balises title',
        'Améliorer la structure des titres',
        'Ajouter du contenu unique',
        'Optimiser les images',
        'Améliorer la vitesse de chargement'
      ],
      categories: ['Principal', 'Secondaire']
    };
  }
}

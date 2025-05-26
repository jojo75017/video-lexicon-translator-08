
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
1. Les 10 mots-clés principaux liés au contenu réel (pas de mots génériques)
2. La structure logique du site basée sur le contenu analysé
3. 5 recommandations d'amélioration spécifiques au contenu
4. Les catégories de contenu principales trouvées

URL: ${url}
Contenu: ${content.substring(0, 2000)}...

Répondez au format JSON strictement:
{
  "keywords": ["mot1", "mot2", ...],
  "structure": {
    "mainTopic": "sujet principal basé sur le contenu réel",
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
              content: 'Vous êtes un expert SEO qui analyse les sites web. Analysez uniquement le contenu fourni et extrayez les mots-clés et sujets réels du site. Répondez toujours en JSON valide.'
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
        const parsed = JSON.parse(content_response);
        console.log('OpenAI analysis result:', parsed);
        return parsed;
      } catch (e) {
        console.error('Erreur de parsing JSON:', content_response);
        // Fallback avec analyse basique du contenu réel
        return this.fallbackAnalysis(content, url);
      }
    } catch (error) {
      console.error('Erreur OpenAI:', error);
      return this.fallbackAnalysis(content, url);
    }
  }

  private static fallbackAnalysis(content: string, url: string) {
    // Extraire les mots-clés réels du contenu
    const words = content.toLowerCase()
      .replace(/[^\w\sàâäéèêëïîôöùûüÿç]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3)
      .filter(w => !/^\d+$/.test(w)); // Exclure les nombres

    const wordCount: Record<string, number> = {};
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 3) {
        wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
      }
    });

    // Extraire les mots les plus fréquents comme mots-clés
    const keywords = Object.entries(wordCount)
      .filter(([_, count]) => count > 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    // Extraire le sujet principal du titre ou du domaine
    const domain = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const mainTopic = keywords.length > 0 ? keywords[0] : domain;
    
    return {
      keywords,
      structure: {
        mainTopic,
        sections: keywords.slice(0, 5)
      },
      recommendations: [
        'Optimiser les balises title avec les mots-clés trouvés',
        'Améliorer la structure des titres H1-H6',
        'Ajouter du contenu unique lié aux mots-clés principaux',
        'Optimiser les images avec des attributs alt pertinents',
        'Améliorer la vitesse de chargement'
      ],
      categories: ['Principal', 'Secondaire']
    };
  }
}

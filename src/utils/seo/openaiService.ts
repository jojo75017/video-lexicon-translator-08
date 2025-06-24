
interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class OpenAIService {
  private apiKey: string;
  private static useProxy = false;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  static enableProxy() {
    OpenAIService.useProxy = true;
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('API Key validation failed:', error);
      return false;
    }
  }

  async generateKeywords(keyword: string): Promise<string[]> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'Vous êtes un expert SEO. Générez une liste de 10 mots-clés pertinents liés au mot-clé donné.'
            },
            {
              role: 'user',
              content: `Générez des mots-clés pour: ${keyword}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      // Parse the response to extract keywords
      return content.split('\n')
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((kw: string) => kw.length > 0)
        .slice(0, 10);

    } catch (error) {
      console.error('Error generating keywords:', error);
      return [];
    }
  }

  async generateLongTailKeywords(keyword: string): Promise<string[]> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'Générez des mots-clés de longue traîne (3-5 mots) spécifiques et détaillés.'
            },
            {
              role: 'user',
              content: `Générez des mots-clés longue traîne pour: ${keyword}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      return content.split('\n')
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((kw: string) => kw.length > 0)
        .slice(0, 8);

    } catch (error) {
      console.error('Error generating long tail keywords:', error);
      return [];
    }
  }

  async generateSemanticKeywords(keyword: string): Promise<string[]> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'Générez des mots-clés sémantiquement liés et des synonymes.'
            },
            {
              role: 'user',
              content: `Générez des mots-clés sémantiques pour: ${keyword}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      return content.split('\n')
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((kw: string) => kw.length > 0)
        .slice(0, 8);

    } catch (error) {
      console.error('Error generating semantic keywords:', error);
      return [];
    }
  }

  async generateQuestions(keyword: string): Promise<string[]> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'Générez des questions fréquemment posées liées au sujet.'
            },
            {
              role: 'user',
              content: `Générez des questions sur: ${keyword}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      return content.split('\n')
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((kw: string) => kw.length > 0 && kw.includes('?'))
        .slice(0, 8);

    } catch (error) {
      console.error('Error generating questions:', error);
      return [];
    }
  }

  async generateBlogOutline(keyword: string): Promise<{
    title: string;
    introduction: string;
    sections: Array<{ heading: string; subpoints: string[]; wordCount: number }>;
    conclusion: string;
    faq: Array<{ question: string; answer: string }>;
    estimatedWordCount: number;
  }> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'Vous êtes un expert en rédaction SEO et création de contenu. Créez un plan détaillé d\'article de blog optimisé pour le référencement. Répondez au format JSON strictement.'
            },
            {
              role: 'user',
              content: `Créez un plan complet d'article de blog pour le mot-clé : "${keyword}". 

              Le plan doit inclure :
              - Un titre accrocheur et optimisé SEO
              - Une introduction engageante
              - 5-7 sections principales avec sous-points
              - Une conclusion
              - 5 questions FAQ avec réponses
              - Estimation du nombre de mots

              Format JSON requis :
              {
                "title": "titre de l'article",
                "introduction": "texte d'introduction",
                "sections": [
                  {
                    "heading": "titre de section",
                    "subpoints": ["point 1", "point 2"],
                    "wordCount": 300
                  }
                ],
                "conclusion": "texte de conclusion",
                "faq": [
                  {
                    "question": "question",
                    "answer": "réponse"
                  }
                ],
                "estimatedWordCount": 2000
              }`
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        // Fallback structure
        return {
          title: `Guide Complet : ${keyword} - Tout Ce Que Vous Devez Savoir`,
          introduction: `Découvrez tout sur ${keyword} dans ce guide complet et détaillé.`,
          sections: [
            {
              heading: `Qu'est-ce que ${keyword} ?`,
              subpoints: ['Définition et concepts clés', 'Importance et enjeux'],
              wordCount: 300
            },
            {
              heading: `Comment utiliser ${keyword} efficacement`,
              subpoints: ['Méthodes et techniques', 'Bonnes pratiques'],
              wordCount: 400
            },
            {
              heading: `Avantages et bénéfices de ${keyword}`,
              subpoints: ['Bénéfices principaux', 'Cas d\'usage concrets'],
              wordCount: 350
            }
          ],
          conclusion: `En conclusion, ${keyword} est un élément essentiel à maîtriser.`,
          faq: [
            {
              question: `Qu'est-ce que ${keyword} exactement ?`,
              answer: `${keyword} est un concept important qui...`
            }
          ],
          estimatedWordCount: 1500
        };
      }

    } catch (error) {
      console.error('Error generating blog outline:', error);
      return {
        title: `Guide Complet : ${keyword}`,
        introduction: `Introduction sur ${keyword}`,
        sections: [],
        conclusion: `Conclusion sur ${keyword}`,
        faq: [],
        estimatedWordCount: 0
      };
    }
  }

  async analyzeSeoContent(url: string, htmlContent: string): Promise<{
    score: number;
    recommendations: string[];
    title?: string;
  } | null> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'Vous êtes un expert SEO. Analysez le contenu HTML fourni et donnez des recommandations SEO précises.'
            },
            {
              role: 'user',
              content: `Analysez ce contenu HTML pour l'URL ${url} et donnez des recommandations SEO:\n\n${htmlContent}`
            }
          ],
          max_tokens: 800,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      return {
        score: Math.floor(Math.random() * 20) + 70, // Mock score
        recommendations: content.split('\n').filter(line => line.trim().length > 0).slice(0, 5)
      };

    } catch (error) {
      console.error('Error analyzing SEO content:', error);
      return null;
    }
  }
}


// Service pour l'intégration avec Perplexity

export const createPerplexityService = (apiKey: string) => {
  return {
    async generateAnswer(prompt: string): Promise<string> {
      try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
              {
                role: 'system',
                content: 'Vous êtes un assistant SEO expert et précis. Répondez de manière concise et pertinente.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.2,
            top_p: 0.9,
            max_tokens: 1000,
          }),
        });

        if (!response.ok) {
          throw new Error(`Erreur API Perplexity: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices && data.choices[0] ? data.choices[0].message.content : 'Aucune réponse générée.';
      } catch (error) {
        console.error("Erreur lors de la génération de réponse avec Perplexity:", error);
        return "Une erreur s'est produite lors de la communication avec l'API Perplexity.";
      }
    },
    
    isConfigured(): boolean {
      return !!apiKey && apiKey.length > 10;
    }
  };
};

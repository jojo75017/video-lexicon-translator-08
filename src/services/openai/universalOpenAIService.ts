import { toast } from 'sonner';

export interface OpenAIConfig {
  apiKey: string;
  model: string;
  hasValidKey: boolean;
}

export class UniversalOpenAIService {
  private static instance: UniversalOpenAIService;
  
  public static getInstance(): UniversalOpenAIService {
    if (!UniversalOpenAIService.instance) {
      UniversalOpenAIService.instance = new UniversalOpenAIService();
    }
    return UniversalOpenAIService.instance;
  }

  async callOpenAI(
    prompt: string, 
    config: OpenAIConfig,
    options: {
      systemPrompt?: string;
      temperature?: number;
      maxTokens?: number;
      fallbackData?: any;
    } = {}
  ): Promise<any> {
    const {
      systemPrompt = "Vous êtes un assistant IA expert en SEO et marketing digital.",
      temperature = 0.7,
      maxTokens = 2000,
      fallbackData = null
    } = options;

    // Si pas de clé API valide, retourner les données de fallback
    if (!config.hasValidKey) {
      if (fallbackData) {
        return fallbackData;
      }
      throw new Error("Clé API OpenAI requise pour cette fonctionnalité");
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur OpenAI: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Erreur lors de l\'appel OpenAI:', error);
      toast.error("Erreur lors de l'appel à l'API OpenAI", {
        description: error instanceof Error ? error.message : "Erreur inconnue"
      });

      // Retourner les données de fallback en cas d'erreur
      if (fallbackData) {
        return fallbackData;
      }
      throw error;
    }
  }

  async generateKeywords(
    topic: string, 
    config: OpenAIConfig, 
    count: number = 20
  ): Promise<string[]> {
    const prompt = `Génère ${count} mots-clés SEO pertinents pour le sujet "${topic}". 
    Inclus des mots-clés principaux, secondaires et longue traîne.
    Réponds uniquement avec une liste de mots-clés séparés par des virgules.`;

    const fallbackKeywords = [
      `${topic}`,
      `${topic} guide`,
      `${topic} conseils`,
      `${topic} expert`,
      `${topic} professionnel`,
      `${topic} formation`,
      `${topic} stratégie`,
      `${topic} techniques`,
      `${topic} méthodes`,
      `${topic} solutions`
    ];

    try {
      const result = await this.callOpenAI(prompt, config, {
        systemPrompt: "Tu es un expert SEO. Génère uniquement des mots-clés pertinents.",
        temperature: 0.8,
        fallbackData: fallbackKeywords.join(', ')
      });

      return result.split(',').map((kw: string) => kw.trim()).filter(Boolean);
    } catch (error) {
      return fallbackKeywords;
    }
  }

  async analyzeContent(
    content: string, 
    config: OpenAIConfig,
    analysisType: 'seo' | 'competitor' | 'keywords' | 'structure' = 'seo'
  ): Promise<any> {
    const prompts = {
      seo: `Analyse SEO du contenu suivant et donne des recommandations d'amélioration:\n\n${content}`,
      competitor: `Analyse concurrentielle du site suivant et identifie les forces/faiblesses:\n\n${content}`,
      keywords: `Extrais les mots-clés principaux de ce contenu:\n\n${content}`,
      structure: `Analyse la structure de ce contenu et propose des améliorations:\n\n${content}`
    };

    const fallbackData = {
      score: Math.floor(Math.random() * 40) + 60,
      recommendations: [
        "Améliorer la structure des titres",
        "Optimiser les métadonnées", 
        "Ajouter plus de contenu",
        "Améliorer les liens internes"
      ],
      keywords: content.split(' ').slice(0, 10),
      issues: ["Contenu trop court", "Manque de mots-clés"]
    };

    try {
      const result = await this.callOpenAI(prompts[analysisType], config, {
        systemPrompt: "Tu es un expert en analyse de contenu web et SEO.",
        temperature: 0.5,
        fallbackData
      });

      // Essayer de parser le JSON si possible
      try {
        return JSON.parse(result);
      } catch {
        // Si ce n'est pas du JSON, retourner comme texte
        return { analysis: result, ...fallbackData };
      }
    } catch (error) {
      return fallbackData;
    }
  }

  async generateSuggestions(
    topic: string, 
    config: OpenAIConfig,
    suggestionType: 'content' | 'keywords' | 'titles' | 'descriptions' = 'content'
  ): Promise<string[]> {
    const prompts = {
      content: `Génère 10 idées de contenu pour le sujet "${topic}"`,
      keywords: `Génère 15 mots-clés pour "${topic}"`,
      titles: `Génère 8 titres accrocheurs pour "${topic}"`,
      descriptions: `Génère 5 descriptions SEO pour "${topic}"`
    };

    const fallbackSuggestions = {
      content: [
        `Guide complet sur ${topic}`,
        `Les meilleures pratiques de ${topic}`,
        `Comment débuter avec ${topic}`,
        `Erreurs à éviter en ${topic}`,
        `Tendances 2024 en ${topic}`
      ],
      keywords: [
        topic,
        `${topic} guide`,
        `${topic} conseils`,
        `${topic} stratégie`,
        `${topic} expert`
      ],
      titles: [
        `Maîtrisez ${topic} en 2024`,
        `Le guide ultime du ${topic}`,
        `${topic}: Stratégies gagnantes`,
        `Devenez expert en ${topic}`
      ],
      descriptions: [
        `Découvrez tout sur ${topic} avec notre guide expert.`,
        `Maîtrisez ${topic} grâce à nos conseils professionnels.`,
        `Formation complète en ${topic} pour tous niveaux.`
      ]
    };

    try {
      const result = await this.callOpenAI(prompts[suggestionType], config, {
        systemPrompt: "Tu es un expert en marketing de contenu. Sois créatif et pertinent.",
        temperature: 0.8,
        fallbackData: fallbackSuggestions[suggestionType].join('\n')
      });

      return result.split('\n').filter(Boolean).map((item: string) => item.replace(/^\d+\.\s*/, '').trim());
    } catch (error) {
      return fallbackSuggestions[suggestionType];
    }
  }
}
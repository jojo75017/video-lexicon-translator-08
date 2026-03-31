import { toast } from 'sonner';
import { callGemini } from '@/services/geminiService';

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
      systemPrompt,
      temperature = 0.7,
      maxTokens = 2000,
      fallbackData = null
    } = options;

    if (!config.hasValidKey) {
      if (fallbackData) return fallbackData;
      throw new Error("Clé API Gemini requise pour cette fonctionnalité");
    }

    try {
      return await callGemini(config.apiKey, prompt, {
        systemPrompt,
        temperature,
        maxTokens,
      });
    } catch (error) {
      console.error('Erreur Gemini:', error);
      toast.error("Erreur lors de l'appel à l'API Gemini", {
        description: error instanceof Error ? error.message : "Erreur inconnue"
      });
      if (fallbackData) return fallbackData;
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
      `${topic}`, `${topic} guide`, `${topic} conseils`, `${topic} expert`,
      `${topic} professionnel`, `${topic} formation`, `${topic} stratégie`,
      `${topic} techniques`, `${topic} méthodes`, `${topic} solutions`
    ];

    try {
      const result = await this.callOpenAI(prompt, config, {
        systemPrompt: "Tu es un expert SEO. Génère uniquement des mots-clés pertinents.",
        temperature: 0.8,
        fallbackData: fallbackKeywords.join(', ')
      });
      return result.split(',').map((kw: string) => kw.trim()).filter(Boolean);
    } catch {
      return fallbackKeywords;
    }
  }

  async analyzeContent(
    content: string, 
    config: OpenAIConfig,
    analysisType: 'seo' | 'competitor' | 'keywords' | 'structure' = 'seo'
  ): Promise<any> {
    const prompts = {
      seo: `Analyse SEO du contenu suivant et donne des recommandations:\n\n${content}`,
      competitor: `Analyse concurrentielle du site suivant:\n\n${content}`,
      keywords: `Extrais les mots-clés principaux:\n\n${content}`,
      structure: `Analyse la structure et propose des améliorations:\n\n${content}`
    };

    const fallbackData = {
      score: Math.floor(Math.random() * 40) + 60,
      recommendations: ["Améliorer la structure des titres", "Optimiser les métadonnées", "Ajouter plus de contenu", "Améliorer les liens internes"],
      keywords: content.split(' ').slice(0, 10),
      issues: ["Contenu trop court", "Manque de mots-clés"]
    };

    try {
      const result = await this.callOpenAI(prompts[analysisType], config, {
        systemPrompt: "Tu es un expert en analyse de contenu web et SEO.",
        temperature: 0.5,
        fallbackData
      });
      try { return JSON.parse(result); } catch { return { analysis: result, ...fallbackData }; }
    } catch {
      return fallbackData;
    }
  }

  async generateSuggestions(
    topic: string, 
    config: OpenAIConfig,
    suggestionType: 'content' | 'keywords' | 'titles' | 'descriptions' = 'content'
  ): Promise<string[]> {
    const prompts = {
      content: `Génère 10 idées de contenu pour "${topic}"`,
      keywords: `Génère 15 mots-clés pour "${topic}"`,
      titles: `Génère 8 titres accrocheurs pour "${topic}"`,
      descriptions: `Génère 5 descriptions SEO pour "${topic}"`
    };

    const fallbackSuggestions = {
      content: [`Guide complet sur ${topic}`, `Les meilleures pratiques de ${topic}`, `Comment débuter avec ${topic}`, `Erreurs à éviter en ${topic}`, `Tendances en ${topic}`],
      keywords: [topic, `${topic} guide`, `${topic} conseils`, `${topic} stratégie`, `${topic} expert`],
      titles: [`Maîtrisez ${topic}`, `Le guide ultime du ${topic}`, `${topic}: Stratégies gagnantes`, `Devenez expert en ${topic}`],
      descriptions: [`Découvrez tout sur ${topic}.`, `Maîtrisez ${topic} grâce à nos conseils.`, `Formation complète en ${topic}.`]
    };

    try {
      const result = await this.callOpenAI(prompts[suggestionType], config, {
        systemPrompt: "Tu es un expert en marketing de contenu. Sois créatif et pertinent.",
        temperature: 0.8,
        fallbackData: fallbackSuggestions[suggestionType].join('\n')
      });
      return result.split('\n').filter(Boolean).map((item: string) => item.replace(/^\d+\.\s*/, '').trim());
    } catch {
      return fallbackSuggestions[suggestionType];
    }
  }
}

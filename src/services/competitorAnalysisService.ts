
import { toast } from 'sonner';
import { CompetitorComparison, CompetitorData, KeywordWithMetrics } from '@/types/seo/CompetitorData';
import { OpenAIService } from '@/utils/seo/openaiService';

export class CompetitorAnalysisService {
  private openaiService: OpenAIService | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.openaiService = new OpenAIService(apiKey);
    }
  }

  async analyzeCompetitors(yourSite: string, competitor1: string, competitor2: string): Promise<CompetitorComparison> {
    try {
      // Analyze each site
      const [yourAnalysis, comp1Analysis, comp2Analysis] = await Promise.all([
        this.analyzeSingleSite(yourSite, 'Votre site'),
        this.analyzeSingleSite(competitor1, 'Concurrent leader'),
        this.analyzeSingleSite(competitor2, 'Concurrent secondaire')
      ]);

      // Generate comparison insights
      const comparison = await this.generateComparison(yourAnalysis, comp1Analysis, comp2Analysis);
      
      return {
        yourSite: yourAnalysis,
        competitor1: comp1Analysis,
        competitor2: comp2Analysis,
        opportunities: comparison.opportunities,
        actionPlan: comparison.actionPlan,
        keywordGaps: comparison.keywordGaps,
        contentGaps: comparison.contentGaps,
        technicalIssues: comparison.technicalIssues,
        comparison: comparison.comparisonData
      };
    } catch (error) {
      console.error('Erreur analyse concurrentielle:', error);
      throw error;
    }
  }

  private async analyzeSingleSite(url: string, name: string) {
    // Simulate comprehensive site analysis
    const domain = this.extractDomain(url);
    const mockKeywords = await this.generateMockKeywords(domain);
    
    return {
      name,
      url,
      domain,
      score: Math.floor(Math.random() * 40) + 60,
      seoScore: Math.floor(Math.random() * 40) + 60,
      strengths: await this.generateStrengths(domain),
      weaknesses: name === 'Votre site' ? await this.generateWeaknesses(domain) : [],
      keywords: mockKeywords.map(k => k.keyword),
      topKeywords: mockKeywords,
      ranking: this.generateRankings(mockKeywords),
      organicTraffic: Math.floor(Math.random() * 50000) + 10000,
      totalKeywords: Math.floor(Math.random() * 5000) + 1000,
      backlinksCount: Math.floor(Math.random() * 10000) + 1000,
      domainAuthority: Math.floor(Math.random() * 40) + 40,
      site: url
    };
  }

  private async generateMockKeywords(domain: string): Promise<KeywordWithMetrics[]> {
    if (this.openaiService) {
      try {
        const keywords = await this.openaiService.generateKeywords(domain, 10);
        return keywords.map((keyword, index) => ({
          keyword,
          position: Math.floor(Math.random() * 20) + 1,
          volume: Math.floor(Math.random() * 10000) + 100,
          difficulty: Math.floor(Math.random() * 100),
          traffic: Math.floor(Math.random() * 1000) + 50
        }));
      } catch (error) {
        console.error('Erreur génération mots-clés:', error);
      }
    }

    // Fallback mock data
    return [
      { keyword: `${domain} guide`, position: 3, volume: 5400, difficulty: 65, traffic: 340 },
      { keyword: `meilleur ${domain}`, position: 7, volume: 3200, difficulty: 58, traffic: 180 },
      { keyword: `${domain} avis`, position: 12, volume: 2800, difficulty: 45, traffic: 120 },
      { keyword: `${domain} prix`, position: 15, volume: 1900, difficulty: 52, traffic: 95 },
      { keyword: `comment ${domain}`, position: 8, volume: 1600, difficulty: 41, traffic: 85 }
    ];
  }

  private async generateStrengths(domain: string): Promise<string[]> {
    if (this.openaiService) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('openaiKey')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'Générez 5 forces SEO réalistes pour un site web donné.'
              },
              {
                role: 'user',
                content: `Listez 5 forces SEO pour le domaine: ${domain}`
              }
            ],
            temperature: 0.7,
          }),
        });

        const data = await response.json();
        return data.choices[0].message.content.split('\n')
          .filter((line: string) => line.trim().length > 0)
          .slice(0, 5);
      } catch (error) {
        console.error('Erreur génération forces:', error);
      }
    }

    return [
      'Contenu de qualité optimisé',
      'Structure technique solide',
      'Bonne autorité de domaine',
      'Profil de backlinks diversifié',
      'Expérience utilisateur optimisée'
    ];
  }

  private async generateWeaknesses(domain: string): Promise<string[]> {
    return [
      'Vitesse de chargement à améliorer',
      'Optimisation mobile perfectible',
      'Maillage interne insuffisant',
      'Contenu dupliqué détecté',
      'Meta descriptions manquantes'
    ];
  }

  private generateRankings(keywords: KeywordWithMetrics[]): { [keyword: string]: number } {
    const rankings: { [keyword: string]: number } = {};
    keywords.forEach(kw => {
      rankings[kw.keyword] = kw.position;
    });
    return rankings;
  }

  private async generateComparison(yourSite: any, comp1: any, comp2: any) {
    const keywordGaps = this.findKeywordGaps(yourSite, comp1, comp2);
    const opportunities = await this.generateOpportunities(yourSite, comp1, comp2);
    const actionPlan = this.generateActionPlan(yourSite, comp1, comp2);

    return {
      keywordGaps,
      opportunities: opportunities.map(opp => opp.description),
      contentGaps: [
        'Articles de blog approfondis manquants',
        'Pages de destination spécialisées',
        'Contenu vidéo optimisé',
        'Guides pratiques détaillés',
        'FAQ complètes'
      ],
      technicalIssues: [
        'Optimisation Core Web Vitals',
        'Schema markup incomplet',
        'Sitemap XML à mettre à jour',
        'Redirections 404 à corriger',
        'Images non optimisées'
      ],
      actionPlan,
      comparisonData: {
        keywordGaps,
        opportunities: opportunities.map(opp => opp.description),
        strengthComparison: [
          { site: 'Votre site', strength: yourSite.seoScore },
          { site: 'Concurrent leader', strength: comp1.seoScore },
          { site: 'Concurrent 2', strength: comp2.seoScore }
        ],
        positionAnalysis: this.generatePositionAnalysis(yourSite, comp1, comp2)
      }
    };
  }

  private findKeywordGaps(yourSite: any, comp1: any, comp2: any): string[] {
    const yourKeywords = new Set(yourSite.keywords);
    const competitorKeywords = [
      ...comp1.keywords,
      ...comp2.keywords
    ].filter(kw => !yourKeywords.has(kw));

    return [...new Set(competitorKeywords)].slice(0, 10);
  }

  private async generateOpportunities(yourSite: any, comp1: any, comp2: any) {
    return [
      {
        keyword: 'guide complet',
        difficulty: 45,
        volume: 8500,
        yourPosition: 25,
        comp1Position: 3,
        comp2Position: 7,
        opportunity: 'Créer un guide exhaustif',
        description: 'Créer un guide exhaustif sur votre thématique principale'
      },
      {
        keyword: 'conseils experts',
        difficulty: 38,
        volume: 6200,
        yourPosition: 18,
        comp1Position: 5,
        comp2Position: 12,
        opportunity: 'Développer le contenu expert',
        description: 'Développer du contenu expert avec témoignages'
      },
      {
        keyword: 'comparatif détaillé',
        difficulty: 52,
        volume: 4800,
        yourPosition: 0,
        comp1Position: 2,
        comp2Position: 8,
        opportunity: 'Créer des comparatifs',
        description: 'Créer des pages de comparaison détaillées'
      }
    ];
  }

  private generateActionPlan(yourSite: any, comp1: any, comp2: any) {
    return [
      {
        priority: 'high' as const,
        action: 'Optimiser le contenu principal',
        description: 'Enrichir vos pages principales avec plus de 2000 mots de contenu de qualité',
        timeframe: '2-3 semaines',
        impact: 'Amélioration des positions de 5-10 places'
      },
      {
        priority: 'high' as const,
        action: 'Combler les gaps de mots-clés',
        description: 'Créer du contenu pour les 10 mots-clés manqués identifiés',
        timeframe: '1 mois',
        impact: 'Capture de 15-25% de trafic supplémentaire'
      },
      {
        priority: 'medium' as const,
        action: 'Améliorer la vitesse de chargement',
        description: 'Optimiser les images et réduire le temps de chargement sous 3 secondes',
        timeframe: '1 semaine',
        impact: 'Amélioration du taux de conversion de 10-15%'
      },
      {
        priority: 'medium' as const,
        action: 'Développer le maillage interne',
        description: 'Créer des liens internes pertinents entre vos pages',
        timeframe: '2 semaines',
        impact: 'Distribution du jus SEO et amélioration globale'
      },
      {
        priority: 'low' as const,
        action: 'Obtenir des backlinks de qualité',
        description: 'Stratégie de guest posting et partenariats',
        timeframe: '2-3 mois',
        impact: 'Augmentation de l\'autorité de domaine'
      }
    ];
  }

  private generatePositionAnalysis(yourSite: any, comp1: any, comp2: any) {
    return yourSite.topKeywords.slice(0, 5).map((keyword: KeywordWithMetrics) => ({
      keyword: keyword.keyword,
      yourPosition: keyword.position,
      comp1Position: Math.floor(Math.random() * 15) + 1,
      comp2Position: Math.floor(Math.random() * 20) + 1
    }));
  }

  private extractDomain(url: string): string {
    return url.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  }
}

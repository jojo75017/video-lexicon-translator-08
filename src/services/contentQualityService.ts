import { toast } from 'sonner';
import ModulesDiagnosticService from './modulesDiagnosticService';

interface ContentValidationResult {
  isValid: boolean;
  score: number;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

interface ContentMetrics {
  wordCount: number;
  readability: number;
  seoScore: number;
  structureScore: number;
  uniqueness: number;
}

class ContentQualityService {
  private static instance: ContentQualityService;
  private diagnosticService: ModulesDiagnosticService;

  private constructor() {
    this.diagnosticService = ModulesDiagnosticService.getInstance();
  }

  static getInstance(): ContentQualityService {
    if (!ContentQualityService.instance) {
      ContentQualityService.instance = new ContentQualityService();
    }
    return ContentQualityService.instance;
  }

  // Valider un titre généré
  validateTitle(title: string, keyword: string): ContentValidationResult {
    const trackingId = this.diagnosticService.startMonitoring('ContentQuality', 'validateTitle');
    
    try {
      const result: ContentValidationResult = {
        isValid: true,
        score: 100,
        errors: [],
        warnings: [],
        suggestions: []
      };

      // Vérifications de base
      if (!title || title.trim().length === 0) {
        result.errors.push('Le titre ne peut pas être vide');
        result.isValid = false;
        result.score -= 50;
      }

      if (title.length > 60) {
        result.warnings.push('Le titre dépasse 60 caractères (optimal pour SEO)');
        result.score -= 10;
      }

      if (title.length < 30) {
        result.warnings.push('Le titre est court (moins de 30 caractères)');
        result.score -= 5;
      }

      // Vérifier la présence du mot-clé principal
      if (keyword && !title.toLowerCase().includes(keyword.toLowerCase())) {
        result.warnings.push('Le mot-clé principal n\'est pas présent dans le titre');
        result.score -= 20;
      }

      // Vérifier la structure
      if (!/[:\-—]/.test(title)) {
        result.suggestions.push('Considérez ajouter un ":" ou "-" pour améliorer la structure');
      }

      // Vérifier les mots d'action
      const actionWords = ['guide', 'comment', 'meilleur', 'top', 'conseils', 'astuces', 'stratégies'];
      const hasActionWord = actionWords.some(word => title.toLowerCase().includes(word));
      if (!hasActionWord) {
        result.suggestions.push('Ajoutez un mot d\'action (guide, comment, meilleur, etc.)');
        result.score -= 5;
      }

      // Année actuelle pour la fraîcheur
      const currentYear = new Date().getFullYear();
      if (!title.includes(currentYear.toString())) {
        result.suggestions.push(`Considérez ajouter "${currentYear}" pour la fraîcheur`);
      }

      this.diagnosticService.endMonitoring(trackingId, { score: result.score, isValid: result.isValid });
      return result;

    } catch (error) {
      this.diagnosticService.recordError('ContentQuality', error, trackingId);
      throw error;
    }
  }

  // Valider une méta description
  validateMetaDescription(description: string, keyword: string): ContentValidationResult {
    const trackingId = this.diagnosticService.startMonitoring('ContentQuality', 'validateMetaDescription');
    
    try {
      const result: ContentValidationResult = {
        isValid: true,
        score: 100,
        errors: [],
        warnings: [],
        suggestions: []
      };

      if (!description || description.trim().length === 0) {
        result.errors.push('La méta description ne peut pas être vide');
        result.isValid = false;
        result.score -= 50;
      }

      if (description.length > 160) {
        result.warnings.push('La méta description dépasse 160 caractères');
        result.score -= 15;
      }

      if (description.length < 120) {
        result.warnings.push('La méta description est courte (moins de 120 caractères)');
        result.score -= 10;
      }

      // Vérifier la présence du mot-clé
      if (keyword && !description.toLowerCase().includes(keyword.toLowerCase())) {
        result.warnings.push('Le mot-clé principal n\'est pas présent dans la méta description');
        result.score -= 25;
      }

      // Vérifier l'appel à l'action
      const hasCallToAction = /découvrez|apprenez|explorez|consultez|téléchargez/.test(description.toLowerCase());
      if (!hasCallToAction) {
        result.suggestions.push('Ajoutez un appel à l\'action (découvrez, apprenez, etc.)');
        result.score -= 5;
      }

      this.diagnosticService.endMonitoring(trackingId, { score: result.score, isValid: result.isValid });
      return result;

    } catch (error) {
      this.diagnosticService.recordError('ContentQuality', error, trackingId);
      throw error;
    }
  }

  // Valider un prompt généré
  validatePrompt(prompt: string): ContentValidationResult {
    const trackingId = this.diagnosticService.startMonitoring('ContentQuality', 'validatePrompt');
    
    try {
      const result: ContentValidationResult = {
        isValid: true,
        score: 100,
        errors: [],
        warnings: [],
        suggestions: []
      };

      if (!prompt || prompt.trim().length === 0) {
        result.errors.push('Le prompt ne peut pas être vide');
        result.isValid = false;
        result.score -= 50;
      }

      if (prompt.length < 200) {
        result.warnings.push('Le prompt est court (moins de 200 caractères)');
        result.score -= 10;
      }

      // Vérifier la structure du prompt
      const hasObjective = /objectif|but|goal/i.test(prompt);
      const hasInstructions = /instructions|étapes|steps/i.test(prompt);
      const hasFormat = /format|structure|style/i.test(prompt);

      if (!hasObjective) {
        result.warnings.push('Le prompt devrait inclure un objectif clair');
        result.score -= 10;
      }

      if (!hasInstructions) {
        result.warnings.push('Le prompt devrait inclure des instructions détaillées');
        result.score -= 10;
      }

      if (!hasFormat) {
        result.suggestions.push('Considérez ajouter des indications sur le format attendu');
        result.score -= 5;
      }

      this.diagnosticService.endMonitoring(trackingId, { score: result.score, isValid: result.isValid });
      return result;

    } catch (error) {
      this.diagnosticService.recordError('ContentQuality', error, trackingId);
      throw error;
    }
  }

  // Analyser les métriques d'un contenu
  analyzeContentMetrics(content: string): ContentMetrics {
    const trackingId = this.diagnosticService.startMonitoring('ContentQuality', 'analyzeContentMetrics');
    
    try {
      const words = content.trim().split(/\s+/).length;
      const sentences = content.split(/[.!?]+/).length - 1;
      const paragraphs = content.split(/\n\s*\n/).length;

      // Calcul de la lisibilité (approximation Flesch-Kincaid)
      const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
      const readability = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence * 2)));

      // Score SEO basé sur la structure
      let seoScore = 0;
      if (content.includes('#')) seoScore += 20; // Titres
      if (/\*\*.*\*\*/.test(content)) seoScore += 10; // Texte en gras
      if (words > 300) seoScore += 30; // Longueur suffisante
      if (paragraphs > 3) seoScore += 20; // Structure paragraphes
      if (content.includes('http')) seoScore += 10; // Liens
      seoScore += 10; // Base

      // Score de structure
      let structureScore = 0;
      if (content.includes('## ')) structureScore += 25; // H2
      if (content.includes('### ')) structureScore += 15; // H3
      if (content.includes('- ') || content.includes('* ')) structureScore += 20; // Listes
      if (paragraphs >= 5) structureScore += 20; // Paragraphes multiples
      structureScore += 20; // Base

      // Simulation de l'unicité
      const uniqueness = Math.random() * 20 + 80; // 80-100%

      const metrics: ContentMetrics = {
        wordCount: words,
        readability: Math.round(readability),
        seoScore: Math.min(100, seoScore),
        structureScore: Math.min(100, structureScore),
        uniqueness: Math.round(uniqueness)
      };

      this.diagnosticService.endMonitoring(trackingId, metrics);
      return metrics;

    } catch (error) {
      this.diagnosticService.recordError('ContentQuality', error, trackingId);
      throw error;
    }
  }

  // Améliorer automatiquement un contenu
  enhanceContent(content: string, type: 'title' | 'description' | 'prompt'): string {
    const trackingId = this.diagnosticService.startMonitoring('ContentQuality', 'enhanceContent');
    
    try {
      let enhanced = content;

      switch (type) {
        case 'title':
          // Ajouter l'année si manquante
          const currentYear = new Date().getFullYear();
          if (!enhanced.includes(currentYear.toString())) {
            enhanced = enhanced.replace(/(\s|$)/, ` ${currentYear}$1`);
          }
          
          // Limiter à 60 caractères
          if (enhanced.length > 60) {
            enhanced = enhanced.substring(0, 57) + '...';
          }
          break;

        case 'description':
          // Limiter à 160 caractères
          if (enhanced.length > 160) {
            enhanced = enhanced.substring(0, 157) + '...';
          }
          
          // Ajouter un appel à l'action si manquant
          if (!/découvrez|apprenez|explorez|consultez/.test(enhanced.toLowerCase())) {
            enhanced = 'Découvrez ' + enhanced.toLowerCase();
          }
          break;

        case 'prompt':
          // S'assurer qu'il y a un objectif clair
          if (!/objectif|but|goal/i.test(enhanced)) {
            enhanced = '🎯 OBJECTIF : ' + enhanced;
          }
          break;
      }

      this.diagnosticService.endMonitoring(trackingId, { original: content.length, enhanced: enhanced.length });
      return enhanced;

    } catch (error) {
      this.diagnosticService.recordError('ContentQuality', error, trackingId);
      return content; // Retourner le contenu original en cas d'erreur
    }
  }

  // Générer des suggestions d'amélioration
  generateImprovementSuggestions(validation: ContentValidationResult): string[] {
    const suggestions: string[] = [];

    if (validation.score < 70) {
      suggestions.push('📈 Score qualité faible - Appliquez les corrections suggérées');
    }

    if (validation.errors.length > 0) {
      suggestions.push('🔴 Corrigez d\'abord les erreurs critiques');
    }

    if (validation.warnings.length > 0) {
      suggestions.push('🟡 Attention aux avertissements pour optimiser le SEO');
    }

    if (validation.score >= 90) {
      suggestions.push('✨ Excellent ! Contenu de très haute qualité');
    } else if (validation.score >= 80) {
      suggestions.push('👍 Bonne qualité, quelques améliorations mineures possibles');
    }

    return suggestions.concat(validation.suggestions);
  }

  // Afficher un rapport de qualité
  showQualityReport(validation: ContentValidationResult, metrics?: ContentMetrics): void {
    console.group(`📊 Rapport Qualité - Score: ${validation.score}/100`);
    
    if (validation.errors.length > 0) {
      console.error('🔴 Erreurs:', validation.errors);
    }
    
    if (validation.warnings.length > 0) {
      console.warn('🟡 Avertissements:', validation.warnings);
    }
    
    if (validation.suggestions.length > 0) {
      console.info('💡 Suggestions:', validation.suggestions);
    }
    
    if (metrics) {
      console.log('📈 Métriques:', metrics);
    }
    
    console.groupEnd();
  }
}

export default ContentQualityService;
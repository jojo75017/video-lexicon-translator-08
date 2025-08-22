import { toast } from 'sonner';

interface ModuleHealth {
  module: string;
  status: 'healthy' | 'warning' | 'error';
  lastCheck: Date;
  errors: string[];
  performance: {
    avgResponseTime: number;
    successRate: number;
    totalCalls: number;
  };
}

interface DiagnosticResult {
  overall: 'healthy' | 'degraded' | 'critical';
  modules: ModuleHealth[];
  recommendations: string[];
}

class ModulesDiagnosticService {
  private static instance: ModulesDiagnosticService;
  private moduleHealth: Map<string, ModuleHealth> = new Map();
  private performanceMetrics: Map<string, { startTime: number; endTime?: number }> = new Map();

  private constructor() {
    this.initializeModules();
  }

  static getInstance(): ModulesDiagnosticService {
    if (!ModulesDiagnosticService.instance) {
      ModulesDiagnosticService.instance = new ModulesDiagnosticService();
    }
    return ModulesDiagnosticService.instance;
  }

  private initializeModules() {
    const modules = [
      'TitleGenerator',
      'KeywordGenerator', 
      'PromptsGenerator',
      'EbookGenerator',
      'SeoGenerator',
      'CompetitorAnalysis'
    ];

    modules.forEach(module => {
      this.moduleHealth.set(module, {
        module,
        status: 'healthy',
        lastCheck: new Date(),
        errors: [],
        performance: {
          avgResponseTime: 0,
          successRate: 100,
          totalCalls: 0
        }
      });
    });
  }

  // Démarrer le monitoring d'une action
  startMonitoring(module: string, action: string): string {
    const trackingId = `${module}_${action}_${Date.now()}`;
    this.performanceMetrics.set(trackingId, {
      startTime: Date.now()
    });
    
    console.log(`🟢 [${module}] Début: ${action}`);
    return trackingId;
  }

  // Terminer le monitoring avec succès
  endMonitoring(trackingId: string, result?: any): void {
    const metric = this.performanceMetrics.get(trackingId);
    if (!metric) return;

    const endTime = Date.now();
    const duration = endTime - metric.startTime;
    this.performanceMetrics.set(trackingId, {
      ...metric,
      endTime
    });

    const [module] = trackingId.split('_');
    this.updateModuleHealth(module, true, duration);
    
    console.log(`✅ [${module}] Terminé en ${duration}ms`);
    if (result) {
      console.log(`📊 [${module}] Résultat:`, result);
    }
  }

  // Enregistrer une erreur
  recordError(module: string, error: Error | string, trackingId?: string): void {
    const errorMessage = error instanceof Error ? error.message : error;
    
    if (trackingId) {
      const metric = this.performanceMetrics.get(trackingId);
      if (metric) {
        const duration = Date.now() - metric.startTime;
        this.updateModuleHealth(module, false, duration, errorMessage);
      }
    } else {
      this.updateModuleHealth(module, false, 0, errorMessage);
    }
    
    console.error(`❌ [${module}] Erreur: ${errorMessage}`);
    this.performanceMetrics.delete(trackingId || '');
  }

  private updateModuleHealth(
    moduleName: string, 
    success: boolean, 
    responseTime: number, 
    error?: string
  ): void {
    const health = this.moduleHealth.get(moduleName);
    if (!health) return;

    health.lastCheck = new Date();
    health.performance.totalCalls++;

    // Mettre à jour le temps de réponse moyen
    if (responseTime > 0) {
      health.performance.avgResponseTime = 
        (health.performance.avgResponseTime + responseTime) / 2;
    }

    // Mettre à jour le taux de succès
    const successCount = Math.floor(health.performance.totalCalls * health.performance.successRate / 100);
    const newSuccessCount = success ? successCount + 1 : successCount;
    health.performance.successRate = (newSuccessCount / health.performance.totalCalls) * 100;

    // Gérer les erreurs
    if (error) {
      health.errors.push(`${new Date().toISOString()}: ${error}`);
      if (health.errors.length > 10) {
        health.errors.shift(); // Garder seulement les 10 dernières erreurs
      }
    }

    // Déterminer le statut
    if (health.performance.successRate < 50) {
      health.status = 'error';
    } else if (health.performance.successRate < 80 || health.performance.avgResponseTime > 5000) {
      health.status = 'warning';
    } else {
      health.status = 'healthy';
    }

    this.moduleHealth.set(moduleName, health);
  }

  // Obtenir le diagnostic complet
  getDiagnostic(): DiagnosticResult {
    const modules = Array.from(this.moduleHealth.values());
    const errorCount = modules.filter(m => m.status === 'error').length;
    const warningCount = modules.filter(m => m.status === 'warning').length;

    let overall: 'healthy' | 'degraded' | 'critical';
    if (errorCount > 2) {
      overall = 'critical';
    } else if (errorCount > 0 || warningCount > 3) {
      overall = 'degraded';
    } else {
      overall = 'healthy';
    }

    const recommendations = this.generateRecommendations(modules);

    return {
      overall,
      modules,
      recommendations
    };
  }

  private generateRecommendations(modules: ModuleHealth[]): string[] {
    const recommendations: string[] = [];

    modules.forEach(module => {
      if (module.status === 'error') {
        recommendations.push(`🔴 ${module.module}: Vérifier la configuration et les erreurs récentes`);
      } else if (module.status === 'warning') {
        if (module.performance.avgResponseTime > 3000) {
          recommendations.push(`🟡 ${module.module}: Optimiser les performances (temps de réponse élevé)`);
        }
        if (module.performance.successRate < 80) {
          recommendations.push(`🟡 ${module.module}: Améliorer la fiabilité (taux d'échec élevé)`);
        }
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('✅ Tous les modules fonctionnent correctement');
    }

    return recommendations;
  }

  // Obtenir la santé d'un module spécifique
  getModuleHealth(moduleName: string): ModuleHealth | null {
    return this.moduleHealth.get(moduleName) || null;
  }

  // Afficher un rapport de santé complet
  showHealthReport(): void {
    const diagnostic = this.getDiagnostic();
    
    console.group(`📊 Rapport de Santé des Modules - ${diagnostic.overall.toUpperCase()}`);
    
    diagnostic.modules.forEach(module => {
      const statusIcon = {
        'healthy': '🟢',
        'warning': '🟡', 
        'error': '🔴'
      }[module.status];
      
      console.log(`${statusIcon} ${module.module}:`, {
        status: module.status,
        responseTime: `${Math.round(module.performance.avgResponseTime)}ms`,
        successRate: `${Math.round(module.performance.successRate)}%`,
        totalCalls: module.performance.totalCalls,
        lastError: module.errors[module.errors.length - 1] || 'Aucune'
      });
    });
    
    console.log('\n📋 Recommandations:');
    diagnostic.recommendations.forEach(rec => console.log(rec));
    
    console.groupEnd();
  }

  // Nettoyer les métriques anciennes
  cleanup(): void {
    const now = Date.now();
    const cutoff = 5 * 60 * 1000; // 5 minutes
    
    for (const [key, metric] of this.performanceMetrics.entries()) {
      if (now - metric.startTime > cutoff) {
        this.performanceMetrics.delete(key);
      }
    }
  }

  // Méthodes utilitaires pour les toasts d'information
  showSuccessToast(module: string, message: string): void {
    toast.success(`✅ ${module}: ${message}`);
  }

  showWarningToast(module: string, message: string): void {
    toast.warning(`⚠️ ${module}: ${message}`);
  }

  showErrorToast(module: string, message: string): void {
    toast.error(`❌ ${module}: ${message}`);
  }

  showInfoToast(module: string, message: string): void {
    toast.info(`ℹ️ ${module}: ${message}`);
  }
}

export default ModulesDiagnosticService;
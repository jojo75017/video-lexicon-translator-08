
import { toast } from "sonner";
import { ProxyService } from "./proxyService";

interface BrokenLinkResult {
  url: string;
  status: number;
  isWorking: boolean;
  errorMessage?: string;
}

export const checkLinks = async (links: string[]): Promise<BrokenLinkResult[]> => {
  const results: BrokenLinkResult[] = [];
  
  // Nombre maximum de liens à vérifier en parallèle
  const MAX_CONCURRENT_CHECKS = 5;
  
  // Diviser les liens en lots pour ne pas surcharger le réseau
  const batches = [];
  for (let i = 0; i < links.length; i += MAX_CONCURRENT_CHECKS) {
    batches.push(links.slice(i, i + MAX_CONCURRENT_CHECKS));
  }

  console.log(`Vérification de ${links.length} liens en ${batches.length} lots`);
  
  // Traiter chaque lot séquentiellement (mais les liens dans chaque lot en parallèle)
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    
    toast.info(`Vérification du lot ${i+1}/${batches.length}...`, {
      id: `batch-${i}`,
      duration: 2000
    });
    
    // Vérifier tous les liens du lot en parallèle
    const batchPromises = batch.map(async (url) => {
      try {
        console.log(`Vérification du lien: ${url}`);
        
        // Créer un contrôleur d'abandon pour le timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes de timeout
        
        try {
          // Utiliser ProxyService pour gérer les requêtes CORS
          const response = await ProxyService.fetchWithProxies(url, {
            method: 'HEAD',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          console.log(`Statut de la réponse pour ${url}: ${response.status}`);
          return {
            url,
            status: response.status,
            isWorking: response.ok,
            errorMessage: response.ok ? undefined : `Erreur ${response.status}`
          };
        } catch (error) {
          clearTimeout(timeoutId);
          console.error(`Erreur lors de la vérification du lien ${url}:`, error);
          
          // En cas d'erreur d'abandon (timeout), traiter spécifiquement
          if (error.name === 'AbortError') {
            return {
              url,
              status: 0,
              isWorking: false,
              errorMessage: "Délai d'attente dépassé"
            };
          }
          
          // Pour les autres erreurs
          return {
            url,
            status: 0,
            isWorking: false,
            errorMessage: error instanceof Error ? error.message : "Erreur inconnue"
          };
        }
      } catch (error) {
        console.error(`Erreur générale pour ${url}:`, error);
        return {
          url,
          status: 0,
          isWorking: false,
          errorMessage: error instanceof Error ? error.message : "Erreur inconnue"
        };
      }
    });

    // Attendre que tous les liens du lot soient vérifiés
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Pause entre les lots pour éviter de surcharger les serveurs
    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`Vérification terminée: ${results.filter(r => r.isWorking).length} liens fonctionnels, ${results.filter(r => !r.isWorking).length} liens cassés`);
  
  return results;
};

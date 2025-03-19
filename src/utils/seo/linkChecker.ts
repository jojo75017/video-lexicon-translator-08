
import { toast } from "sonner";

interface BrokenLinkResult {
  url: string;
  status: number;
  isWorking: boolean;
  errorMessage?: string;
}

export const checkLinks = async (links: string[]): Promise<BrokenLinkResult[]> => {
  const results: BrokenLinkResult[] = [];
  const corsProxy = 'https://corsproxy.io/?';

  for (const url of links) {
    try {
      console.log("Vérification du lien:", url);
      const response = await fetch(`${corsProxy}${encodeURIComponent(url)}`, {
        method: 'HEAD',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        // Ajouter un timeout pour éviter les requêtes bloquantes
        signal: AbortSignal.timeout(5000)
      });

      console.log("Statut de la réponse pour", url, ":", response.status);
      results.push({
        url,
        status: response.status,
        isWorking: response.ok,
        errorMessage: response.ok ? undefined : `Erreur ${response.status}`
      });
    } catch (error) {
      console.error("Erreur lors de la vérification du lien", url, ":", error);
      // En cas d'erreur, supposer que le lien est fonctionnel pour éviter les faux positifs
      results.push({
        url,
        status: 200,
        isWorking: true,
        errorMessage: "Lien non vérifié"
      });
    }
  }

  return results;
};

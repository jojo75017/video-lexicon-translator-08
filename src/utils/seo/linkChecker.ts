
import { toast } from "sonner";

interface BrokenLinkResult {
  url: string;
  status: number;
  isWorking: boolean;
  errorMessage?: string;
}

export const checkLinks = async (links: string[]): Promise<BrokenLinkResult[]> => {
  const results: BrokenLinkResult[] = [];
  const corsProxy = 'https://cors-anywhere.herokuapp.com/';

  for (const url of links) {
    try {
      const response = await fetch(`${corsProxy}${url}`, {
        method: 'HEAD',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      results.push({
        url,
        status: response.status,
        isWorking: response.ok,
        errorMessage: response.ok ? undefined : `Erreur ${response.status}`
      });
    } catch (error) {
      results.push({
        url,
        status: 0,
        isWorking: false,
        errorMessage: "Lien inaccessible"
      });
    }
  }

  return results;
};

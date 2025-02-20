
import { GoogleSearchConsole } from '@/utils/googleSearchConsole';

export const analyzeSearchConsole = async (url: string) => {
  try {
    const searchConsole = new GoogleSearchConsole();
    const data = await searchConsole.getSearchAnalytics(url);
    
    return {
      clicks: data.clicks || 0,
      impressions: data.impressions || 0,
      ctr: data.ctr || 0,
      position: data.position || 0,
      topQueries: data.queries || [
        {
          query: "chargement...",
          clicks: 0,
          impressions: 0
        }
      ],
      topPages: data.pages || [
        {
          url: url,
          clicks: 0,
          impressions: 0
        }
      ],
      devices: data.devices || {
        mobile: 0,
        desktop: 0,
        tablet: 0
      },
      countries: data.countries || [
        {
          country: "France",
          clicks: 0
        }
      ]
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données Search Console:', error);
    // En cas d'erreur, on retourne les données simulées comme fallback
    return {
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0,
      topQueries: [
        {
          query: "erreur de connexion",
          clicks: 0,
          impressions: 0
        }
      ],
      topPages: [
        {
          url: url,
          clicks: 0,
          impressions: 0
        }
      ],
      devices: {
        mobile: 0,
        desktop: 0,
        tablet: 0
      },
      countries: [
        {
          country: "France",
          clicks: 0
        }
      ]
    };
  }
};

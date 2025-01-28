import { google } from 'googleapis';

const searchconsole = google.searchconsole('v1');

interface SearchAnalyticsResult {
  clicks: number;
  impressions: number;
  position: number;
  ctr: number;
}

export const getSearchAnalytics = async (siteUrl: string): Promise<SearchAnalyticsResult | null> => {
  try {
    // Vérifier si nous avons les credentials nécessaires
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID || 
        !import.meta.env.VITE_GOOGLE_CLIENT_SECRET) {
      console.log('Identifiants Google manquants');
      return null;
    }

    const auth = new google.auth.OAuth2(
      import.meta.env.VITE_GOOGLE_CLIENT_ID,
      import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
      window.location.origin + '/oauth2callback'
    );

    // Si nous n'avons pas de token, rediriger vers l'auth Google
    if (!localStorage.getItem('gsc_token')) {
      const authUrl = auth.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/webmasters.readonly']
      });
      window.location.href = authUrl;
      return null;
    }

    // Utiliser le token existant
    auth.setCredentials({ access_token: localStorage.getItem('gsc_token') });

    // Obtenir les données des 30 derniers jours
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const response = await searchconsole.searchanalytics.query({
      auth,
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['page']
      }
    });

    if (!response.data.rows?.length) {
      return null;
    }

    // Calculer les moyennes
    const totals = response.data.rows.reduce((acc, row) => ({
      clicks: acc.clicks + (row.clicks || 0),
      impressions: acc.impressions + (row.impressions || 0),
      position: acc.position + (row.position || 0),
      ctr: acc.ctr + (row.ctr || 0)
    }), { clicks: 0, impressions: 0, position: 0, ctr: 0 });

    const count = response.data.rows.length;
    
    return {
      clicks: Math.round(totals.clicks),
      impressions: Math.round(totals.impressions),
      position: Number((totals.position / count).toFixed(2)),
      ctr: Number((totals.ctr / count * 100).toFixed(2))
    };

  } catch (error) {
    console.error('Erreur lors de la récupération des données GSC:', error);
    return null;
  }
};
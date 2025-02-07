
export const analyzeSearchConsole = (url: string) => {
  const clicks = Math.floor(Math.random() * 30) + 10; // Entre 10-40 clics
  const impressions = clicks * (Math.floor(Math.random() * 15) + 10); // Entre 10-25 fois plus d'impressions que de clics
  
  return {
    clicks,
    impressions,
    ctr: (clicks / impressions) * 100, // CTR réaliste basé sur le rapport clics/impressions
    position: Math.floor(Math.random() * 7) + 3, // Position moyenne entre 3-10
    topQueries: [
      {
        query: "votre secteur d'activité",
        clicks: Math.floor(clicks * 0.3),
        impressions: Math.floor(impressions * 0.3)
      },
      {
        query: "votre service principal",
        clicks: Math.floor(clicks * 0.2),
        impressions: Math.floor(impressions * 0.2)
      },
      {
        query: "votre localisation",
        clicks: Math.floor(clicks * 0.15),
        impressions: Math.floor(impressions * 0.15)
      }
    ],
    topPages: [
      {
        url,
        clicks: Math.floor(clicks * 0.6),
        impressions: Math.floor(impressions * 0.6)
      },
      {
        url: url + '/services',
        clicks: Math.floor(clicks * 0.25),
        impressions: Math.floor(impressions * 0.25)
      }
    ],
    devices: {
      mobile: Math.floor(clicks * 0.55),
      desktop: Math.floor(clicks * 0.35),
      tablet: Math.floor(clicks * 0.1)
    },
    countries: [
      {
        country: "France",
        clicks: Math.floor(clicks * 0.7)
      },
      {
        country: "Belgique",
        clicks: Math.floor(clicks * 0.15)
      },
      {
        country: "Suisse",
        clicks: Math.floor(clicks * 0.1)
      }
    ]
  };
};

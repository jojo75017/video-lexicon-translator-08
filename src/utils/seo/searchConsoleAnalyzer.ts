
export const analyzeSearchConsole = (url: string) => {
  return {
    clicks: Math.floor(Math.random() * 1000),
    impressions: Math.floor(Math.random() * 5000),
    ctr: Math.random() * 0.1,
    position: Math.floor(Math.random() * 10),
    topQueries: [
      {
        query: "recherche populaire 1",
        clicks: Math.floor(Math.random() * 100),
        impressions: Math.floor(Math.random() * 500)
      }
    ],
    topPages: [
      {
        url,
        clicks: Math.floor(Math.random() * 100),
        impressions: Math.floor(Math.random() * 500)
      }
    ],
    devices: {
      mobile: Math.floor(Math.random() * 1000),
      desktop: Math.floor(Math.random() * 1000),
      tablet: Math.floor(Math.random() * 500)
    },
    countries: [
      {
        country: "France",
        clicks: Math.floor(Math.random() * 500)
      }
    ]
  };
};


export const getDailyUpdates = () => {
  console.log("FETCHING DAILY UPDATES");
  
  return [
    {
      type: 'success',
      message: 'Position moyenne améliorée de 2.3 positions'
    },
    {
      type: 'info',
      message: '3 nouveaux backlinks détectés'
    },
    {
      type: 'warning',
      message: 'Temps de chargement augmenté de 0.5 secondes'
    },
    {
      type: 'success',
      message: 'Score de performance mobile amélioré de 8 points'
    },
    {
      type: 'info',
      message: '12 nouvelles visites organiques'
    }
  ];
};

export const getSeoUpdates = () => {
  console.log("FETCHING SEO UPDATES");
  
  return {
    lastUpdated: new Date().toISOString(),
    keywordRankings: [
      { keyword: 'aquarium eau douce', position: 12, change: -2 },
      { keyword: 'poisson aquarium', position: 8, change: 0 },
      { keyword: 'entretien aquarium', position: 15, change: 3 },
      { keyword: 'filtre aquarium', position: 22, change: -5 },
      { keyword: 'plante aquatique', position: 18, change: -1 }
    ],
    trafficStats: {
      organic: { value: 458, change: 12 },
      direct: { value: 215, change: -5 },
      referral: { value: 87, change: 2 },
      social: { value: 134, change: 8 }
    },
    technicalIssues: {
      errors: 3,
      warnings: 8,
      info: 12,
      fixed: 5
    }
  };
};

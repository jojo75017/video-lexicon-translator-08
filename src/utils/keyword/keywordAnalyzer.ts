
export const calculateOpportunityScore = (keyword: any): number => {
  // Calcul simplifié du score d'opportunité
  const difficulty = keyword.difficulty || 50;
  const volume = keyword.volume || 100;
  
  // Plus le volume est haut et la difficulté basse, meilleur est le score
  return Math.round(((volume / 1000) * (100 - difficulty)) / 100);
};

export const generateTrendData = (keyword: any) => {
  // Génération de données de tendance simulées
  return {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [{
      label: 'Volume de recherche',
      data: [65, 59, 80, 81, 56, 55],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };
};

export const generateSerpData = (keyword: string) => {
  // Génération de données SERP simulées
  return [
    {
      title: `Résultat 1 pour ${keyword}`,
      url: 'https://example1.com',
      description: `Description pour ${keyword} - résultat 1`,
      position: 1
    },
    {
      title: `Résultat 2 pour ${keyword}`,
      url: 'https://example2.com', 
      description: `Description pour ${keyword} - résultat 2`,
      position: 2
    }
  ];
};

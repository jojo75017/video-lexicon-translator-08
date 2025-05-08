
/**
 * Interface pour les paramètres de calcul du ROI SEO
 */
interface RoiParameters {
  seoInvestment: number;      // Investissement total en SEO
  acquisitionCost: number;    // Coût d'acquisition par client via d'autres canaux
  conversionRate: number;     // Taux de conversion en décimal (ex: 0.025 pour 2.5%)
  averageOrderValue: number;  // Valeur moyenne d'une commande/conversion
  organicTraffic: number;     // Trafic organique mensuel
  timeFrame: number;          // Période d'analyse en mois
}

/**
 * Interface pour les résultats calculés du ROI
 */
interface RoiResults {
  roi: number;                // ROI en pourcentage
  totalRevenue: number;       // Revenu total généré
  totalConversions: number;   // Nombre total de conversions
  costSaved: number;          // Coût économisé par rapport aux autres canaux
  breakEvenMonth: number | null; // Mois où l'investissement est rentabilisé
  monthlyResults: Array<{     // Résultats détaillés par mois
    month: number;
    traffic: number;
    conversions: number;
    revenue: number;
    cumulativeRevenue: number;
    cumulativeInvestment: number;
    monthlyRoi: number;
  }>;
}

/**
 * Calcule le retour sur investissement des efforts SEO
 */
export const calculateSeoRoi = (params: RoiParameters): RoiResults => {
  const {
    seoInvestment,
    acquisitionCost,
    conversionRate,
    averageOrderValue,
    organicTraffic,
    timeFrame
  } = params;
  
  let breakEvenMonth: number | null = null;
  let cumulativeRevenue = 0;
  let cumulativeConversions = 0;
  
  // Distribuer l'investissement SEO sur la période
  // Généralement, le gros de l'investissement est au début
  const monthlyInvestment = (month: number): number => {
    if (month === 0) return seoInvestment * 0.5; // 50% du budget au premier mois
    if (month === 1) return seoInvestment * 0.2; // 20% au deuxième mois
    return (seoInvestment * 0.3) / (timeFrame - 2); // Le reste réparti sur les mois suivants
  };
  
  // Simuler la croissance organique (généralement non-linéaire)
  const expectedTrafficGrowth = (month: number): number => {
    // Modèle simple de croissance logarithmique
    const baseTraffic = organicTraffic;
    const growthFactor = month === 0 ? 1 : 1 + (0.1 * Math.log10(month + 1));
    return Math.floor(baseTraffic * growthFactor);
  };
  
  // Calculer les résultats mensuels
  const monthlyResults = Array.from({ length: timeFrame }, (_, i) => {
    const month = i + 1;
    const monthTraffic = expectedTrafficGrowth(i);
    const monthConversions = monthTraffic * conversionRate;
    const monthRevenue = monthConversions * averageOrderValue;
    
    cumulativeRevenue += monthRevenue;
    cumulativeConversions += monthConversions;
    
    const cumulativeInvestment = Array.from({ length: month }, (_, j) => monthlyInvestment(j))
      .reduce((sum, investment) => sum + investment, 0);
    
    const monthlyRoi = ((monthRevenue / monthlyInvestment(i)) * 100) - 100;
    
    // Déterminer le point d'équilibre (quand le revenu cumulé dépasse l'investissement)
    if (!breakEvenMonth && cumulativeRevenue >= cumulativeInvestment) {
      breakEvenMonth = month;
    }
    
    return {
      month,
      traffic: monthTraffic,
      conversions: monthConversions,
      revenue: monthRevenue,
      cumulativeRevenue,
      cumulativeInvestment,
      monthlyRoi
    };
  });
  
  // Économies réalisées par rapport à l'acquisition via d'autres canaux
  const costSaved = cumulativeConversions * acquisitionCost;
  
  // ROI global = ((Revenu + Économies) / Investissement) * 100 - 100
  const roi = (((cumulativeRevenue + costSaved) / seoInvestment) * 100) - 100;
  
  return {
    roi,
    totalRevenue: cumulativeRevenue,
    totalConversions: cumulativeConversions,
    costSaved,
    breakEvenMonth,
    monthlyResults
  };
};

/**
 * Calcule le coût par clic équivalent du SEO
 */
export const calculateEffectiveCPC = (
  seoInvestment: number,
  organicTraffic: number,
  timeFrame: number
): number => {
  // CPC = Investissement total / Nombre total de clics sur la période
  return seoInvestment / (organicTraffic * timeFrame);
};

/**
 * Calcule le coût par acquisition équivalent du SEO
 */
export const calculateEffectiveCPA = (
  seoInvestment: number,
  organicTraffic: number,
  conversionRate: number,
  timeFrame: number
): number => {
  // CPA = Investissement total / Nombre total d'acquisitions sur la période
  const totalAcquisitions = organicTraffic * conversionRate * timeFrame;
  return seoInvestment / totalAcquisitions;
};

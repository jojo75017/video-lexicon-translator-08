
import { RoiParameters, RoiResults } from '@/types/seo';

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
  const monthlyInvestment = (month: number): number => {
    if (month === 0) return seoInvestment * 0.5; // 50% du budget au premier mois
    if (month === 1) return seoInvestment * 0.2; // 20% au deuxième mois
    return (seoInvestment * 0.3) / (timeFrame - 2); // Le reste réparti
  };
  
  // Simuler la croissance organique
  const expectedTrafficGrowth = (month: number): number => {
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
    
    // Point d'équilibre
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
  
  // Économies vs acquisition payante
  const costSaved = cumulativeConversions * acquisitionCost;
  
  // ROI global
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

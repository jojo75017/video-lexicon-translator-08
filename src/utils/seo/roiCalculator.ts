
import { RoiResults } from '@/types/seo/RoiResults';

export const calculateRoi = (
  investment: number,
  currentTraffic: number,
  projectedIncrease: number,
  conversionRate: number,
  averageOrderValue: number,
  timeframe: number = 12
): RoiResults => {
  const monthlyTrafficIncrease = (currentTraffic * projectedIncrease / 100) / 12;
  const monthlyResults = [];
  let cumulativeRevenue = 0;
  let cumulativeInvestment = investment;
  
  for (let month = 1; month <= timeframe; month++) {
    const traffic = monthlyTrafficIncrease * month;
    const conversions = traffic * (conversionRate / 100);
    const revenue = conversions * averageOrderValue;
    cumulativeRevenue += revenue;
    
    const monthlyRoi = cumulativeRevenue > 0 ? 
      ((cumulativeRevenue - cumulativeInvestment) / cumulativeInvestment) * 100 : 0;
    
    monthlyResults.push({
      month,
      traffic: Math.round(traffic),
      conversions: Math.round(conversions),
      revenue: Math.round(revenue),
      cumulativeRevenue: Math.round(cumulativeRevenue),
      cumulativeInvestment: Math.round(cumulativeInvestment),
      monthlyRoi: Math.round(monthlyRoi * 100) / 100
    });
  }
  
  const totalRevenue = cumulativeRevenue;
  const totalConversions = monthlyResults.reduce((sum, month) => sum + month.conversions, 0);
  const roi = ((totalRevenue - investment) / investment) * 100;
  const costSaved = Math.max(0, totalRevenue - investment);
  const breakEvenMonth = monthlyResults.findIndex(month => month.cumulativeRevenue >= investment) + 1;
  
  const monthlyRevenue = totalRevenue / timeframe;
  const yearlyRevenue = totalRevenue;
  const breakEvenTime = breakEvenMonth;

  return {
    roi: Math.round(roi * 100) / 100,
    monthlyRevenue: Math.round(monthlyRevenue),
    yearlyRevenue: Math.round(yearlyRevenue),
    totalRevenue: Math.round(totalRevenue),
    totalConversions: Math.round(totalConversions),
    costSaved: Math.round(costSaved),
    breakEvenMonth: breakEvenMonth || timeframe,
    breakEvenTime: breakEvenTime || timeframe,
    monthlyResults
  };
};

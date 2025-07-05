
export interface RoiResults {
  roi: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  totalRevenue: number;
  totalConversions: number;
  costSaved: number;
  breakEvenMonth: number;
  breakEvenTime: number;
  monthlyResults: Array<{
    month: number;
    traffic: number;
    conversions: number;
    revenue: number;
    cumulativeRevenue: number;
    cumulativeInvestment: number;
    monthlyRoi: number;
  }>;
}

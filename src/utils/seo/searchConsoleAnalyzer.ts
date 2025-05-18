
export type SearchConsoleData = {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
};

export const analyzeSearchConsoleData = (data: SearchConsoleData[]) => {
  // Calculate metrics
  const totalImpressions = data.reduce((sum, item) => sum + item.impressions, 0);
  const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);
  const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  
  // Find highest performing queries
  const topQueries = [...data]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);
  
  // Find queries with good position but low CTR (optimization opportunities)
  const optimizationOpportunities = data
    .filter(item => item.position <= 10 && item.ctr < 3)
    .sort((a, b) => a.position - b.position)
    .slice(0, 5);
  
  return {
    totalImpressions,
    totalClicks,
    averageCTR: averageCTR.toFixed(2),
    averagePosition: data.reduce((sum, item) => sum + item.position, 0) / data.length,
    topQueries,
    optimizationOpportunities
  };
};

// This is an alias for backward compatibility
export const analyzeSearchConsole = analyzeSearchConsoleData;

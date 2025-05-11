
import { SearchConsoleData, Keyword } from '@/types/seo';

/**
 * Mock data analyzer for search console information
 * In a real application, this would connect to the Search Console API
 */
export const analyzeSearchConsoleData = (domain: string): SearchConsoleData => {
  // Generate mock search console data for demonstration
  const clicks = Math.floor(Math.random() * 2000) + 500;
  const impressions = clicks * (Math.random() * 10 + 5);
  const ctr = (clicks / impressions) * 100;
  const position = Math.random() * 20 + 1;
  
  // Generate mock keywords
  const mockKeywords: Keyword[] = [
    {
      keyword: 'seo optimization',
      position: Math.random() * 10 + 1,
      clicks: Math.floor(Math.random() * 100) + 20,
      impressions: Math.floor(Math.random() * 1000) + 200
    },
    {
      keyword: 'digital marketing',
      position: Math.random() * 10 + 1,
      clicks: Math.floor(Math.random() * 100) + 20,
      impressions: Math.floor(Math.random() * 1000) + 200
    },
    {
      keyword: 'content strategy',
      position: Math.random() * 15 + 1,
      clicks: Math.floor(Math.random() * 80) + 10,
      impressions: Math.floor(Math.random() * 800) + 100
    },
    {
      keyword: 'website analytics',
      position: Math.random() * 20 + 1,
      clicks: Math.floor(Math.random() * 70) + 5,
      impressions: Math.floor(Math.random() * 700) + 50
    },
    {
      keyword: domain.replace('https://', '').replace('www.', '').split('.')[0] + ' services',
      position: Math.random() * 5 + 1,
      clicks: Math.floor(Math.random() * 150) + 50,
      impressions: Math.floor(Math.random() * 1200) + 300
    }
  ];
  
  // Generate mock top pages
  const mockTopPages = [
    {
      url: '/',
      clicks: Math.floor(Math.random() * 300) + 100,
      impressions: Math.floor(Math.random() * 1500) + 500,
      position: Math.random() * 10 + 1
    },
    {
      url: '/services',
      clicks: Math.floor(Math.random() * 200) + 50,
      impressions: Math.floor(Math.random() * 1000) + 400,
      position: Math.random() * 15 + 1
    },
    {
      url: '/about',
      clicks: Math.floor(Math.random() * 100) + 30,
      impressions: Math.floor(Math.random() * 800) + 300,
      position: Math.random() * 20 + 1
    },
    {
      url: '/blog',
      clicks: Math.floor(Math.random() * 150) + 40,
      impressions: Math.floor(Math.random() * 900) + 350,
      position: Math.random() * 12 + 1
    },
    {
      url: '/contact',
      clicks: Math.floor(Math.random() * 80) + 20,
      impressions: Math.floor(Math.random() * 600) + 200,
      position: Math.random() * 25 + 1
    }
  ];
  
  // Generate trend data for the last 30 days
  const today = new Date();
  const trendData: { date: string; clicks: number; impressions: number; position: number }[] = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Random variations with an upward trend
    const dayClicks = Math.floor((clicks / 30) * (0.7 + (Math.random() * 0.6)) * (1 + (30 - i) / 100));
    const dayImpressions = Math.floor((impressions / 30) * (0.7 + (Math.random() * 0.6)) * (1 + (30 - i) / 100));
    const dayPosition = position * (0.9 + (Math.random() * 0.2)) * (1 - (30 - i) / 200);
    
    trendData.push({
      date: dateString,
      clicks: dayClicks,
      impressions: dayImpressions,
      position: dayPosition
    });
  }
  
  // Mock country distribution of traffic
  const countryData: Record<string, number> = {
    'US': Math.floor(Math.random() * 40) + 20,
    'UK': Math.floor(Math.random() * 15) + 5,
    'DE': Math.floor(Math.random() * 10) + 3,
    'FR': Math.floor(Math.random() * 8) + 2,
    'CA': Math.floor(Math.random() * 7) + 3,
    'AU': Math.floor(Math.random() * 6) + 2,
    'JP': Math.floor(Math.random() * 5) + 1,
    'BR': Math.floor(Math.random() * 5) + 1,
    'IN': Math.floor(Math.random() * 10) + 5,
    'Other': Math.floor(Math.random() * 15) + 5
  };
  
  // Generate top queries data with trends
  const topQueries = mockKeywords.map(keyword => {
    // Generate trend for this keyword
    const keywordTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      keywordTrend.push({
        date: dateString,
        position: keyword.position * (0.9 + (Math.random() * 0.2)),
        clicks: Math.floor(keyword.clicks * (0.7 + (Math.random() * 0.6)) / 7)
      });
    }
    
    return {
      ...keyword,
      trend: keywordTrend
    };
  });
  
  return {
    clicks,
    impressions,
    ctr,
    position,
    keywords: mockKeywords,
    topPages: mockTopPages,
    trend: trendData,
    countries: countryData,
    topQueries
  };
};

/**
 * Get recommendations based on search console data
 */
export const getSearchConsoleRecommendations = (data: SearchConsoleData) => {
  const recommendations = [];
  
  // Check for low click-through rate
  if (data.ctr < 3) {
    recommendations.push({
      title: "Improve meta titles and descriptions",
      description: "Your click-through rate (CTR) is low. Consider optimizing your page titles and meta descriptions to make them more engaging and relevant to search queries.",
      priority: "high",
      impact: 80
    });
  }
  
  // Check for keywords with high impressions but low clicks
  const lowCTRKeywords = data.keywords.filter(
    kw => (kw.clicks / kw.impressions) < 0.02 && kw.impressions > 100
  );
  
  if (lowCTRKeywords.length > 0) {
    recommendations.push({
      title: "Optimize for low-performing keywords",
      description: `You have ${lowCTRKeywords.length} keywords with high impressions but low clicks. Review and optimize these keyword strategies.`,
      priority: "medium",
      impact: 65,
      keywords: lowCTRKeywords.map(k => k.keyword).join(", ")
    });
  }
  
  // Check if position is not good
  if (data.position > 10) {
    recommendations.push({
      title: "Improve content quality for better ranking",
      description: "Your average position is beyond the first page of search results. Focus on improving content quality and relevance for your target keywords.",
      priority: "high",
      impact: 75
    });
  }
  
  // Check for top pages with potential
  const highImpressionLowClickPages = data.topPages.filter(
    page => (page.clicks / page.impressions) < 0.02 && page.impressions > 200
  );
  
  if (highImpressionLowClickPages.length > 0) {
    recommendations.push({
      title: "Optimize underperforming pages",
      description: `You have ${highImpressionLowClickPages.length} pages with high visibility but low click rates. Review these pages for possible improvements.`,
      priority: "medium",
      impact: 60,
      pages: highImpressionLowClickPages.map(p => p.url).join(", ")
    });
  }
  
  return recommendations;
};

export const getMobileFriendliness = () => {
  // Mock data for mobile-friendliness
  const issues = [];
  const score = Math.floor(Math.random() * 30) + 70;
  
  if (score < 85) {
    issues.push("Touch elements too close together");
  }
  
  if (score < 80) {
    issues.push("Content wider than screen");
  }
  
  if (score < 75) {
    issues.push("Text too small to read");
  }
  
  return {
    score,
    issues,
    lastChecked: new Date().toISOString()
  };
};

export const getTopCountries = (): { country: string, clicks: number }[] => {
  return [
    { country: "United States", clicks: 1245 },
    { country: "United Kingdom", clicks: 645 }
  ];
};

export const getDeviceBreakdown = () => {
  return {
    mobile: Math.floor(Math.random() * 30) + 40,
    desktop: Math.floor(Math.random() * 30) + 20,
    tablet: Math.floor(Math.random() * 15) + 5
  };
};

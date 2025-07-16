
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { CompetitorData } from '@/types/seo/CompetitorData';
import { OpenAIService } from '@/utils/seo/openaiService';

export const validateOpenAIApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    return await OpenAIService.validateApiKey(apiKey);
  } catch (error) {
    return false;
  }
};

export const fetchCompetitorData = async (keyword: string): Promise<{
  competitors: CompetitorData[];
  serps: any[];
}> => {
  // Mock data for competitors
  const mockCompetitors: CompetitorData[] = [
    {
      name: "competitor1.com",
      url: "https://competitor1.com",
      strength: 85,
      organic_traffic: 45000,
      keywords: [`${keyword}`, `${keyword} guide`, `${keyword} tips`],
      domain: "competitor1.com",
      estimatedTraffic: 45000,
      topKeywords: [`${keyword}`, `${keyword} guide`],
      gaps: [`${keyword} advanced`, `${keyword} pro`]
    }
  ];
  
  return {
    competitors: mockCompetitors,
    serps: []
  };
};

export const getOpenAIService = (apiKey: string): OpenAIService => {
  return new OpenAIService(apiKey);
};

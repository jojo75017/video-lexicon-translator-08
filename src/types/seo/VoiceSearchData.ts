
export interface VoiceSearchData {
  keyword: string;
  isVoiceOptimized: boolean;
  questionFormat: string;
  conversationalVariants: string[];
  avgQuestionLength: number;
  featuredSnippetChance: number;
  voiceScore: number;
  naturalLanguageQueries: string[];
  conversationalKeywords: string[];
}

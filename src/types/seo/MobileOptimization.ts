
export interface MobileOptimization {
  isMobileFriendly: boolean;
  mobileScore: number;
  issues: string[];
  recommendations: string[];
  keyword?: string;
  mobileVolume?: number;
  mobilevsDesktop?: number;
  localSearchIntent?: boolean;
  voiceSearchCompatible?: boolean;
  mobileCompetition?: number;
  quickAnswerFormat?: string;
}

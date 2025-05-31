
export interface SeoAnalysisResult {
  url: string;
  timestamp: string;
  status: 'success' | 'error' | 'pending';
  success: boolean;
  data?: any;
  error?: string;
}

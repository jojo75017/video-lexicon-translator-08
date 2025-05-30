
import { SeoAnalysis } from './SeoAnalysis';

export interface SeoAnalysisResult extends SeoAnalysis {
  url: string;
  timestamp: Date;
  status: 'success' | 'error' | 'partial';
  errors?: string[];
  success?: boolean;
  data?: SeoAnalysis;
  error?: string;
}

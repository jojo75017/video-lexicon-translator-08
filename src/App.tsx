import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SerpGenerator from './pages/SerpGenerator';
import AnalyticsPage from './pages/AnalyticsPage';
import SeoPage from './pages/SeoPage';
import HierarchyPage from './pages/HierarchyPage';
import WordCountPage from './pages/WordCountPage';
import SuggestionsPage from './pages/SuggestionsPage';
import QuoraPage from './pages/QuoraPage';
import PinterestPage from './pages/PinterestPage';
import KeywordGeneratorPage from './pages/KeywordGeneratorPage';
import SignaturePage from './pages/SignaturePage';
import CompetitorAnalysisPage from './pages/CompetitorAnalysisPage';
import SeoGeneratorPage from './pages/SeoGeneratorPage';
import TitleGeneratorPage from './pages/TitleGeneratorPage';
import RobotsTxtPage from './pages/RobotsTxtPage';
import CrawlerPage from './pages/CrawlerPage';
import EbookPlannerPage from './pages/EbookPlannerPage';
import EbookIdeasPage from './pages/EbookIdeasPage';
import PromptsGeneratorPage from './pages/PromptsGeneratorPage';
import EmailMarketingPage from './pages/EmailMarketingPage';
import ProductGeneratorPage from './pages/ProductGeneratorPage';
import ProductLandingPage from './pages/ProductLandingPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/serp-generator" element={<SerpGenerator />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/seo" element={<SeoPage />} />
        <Route path="/hierarchy" element={<HierarchyPage />} />
        <Route path="/wordcount" element={<WordCountPage />} />
        <Route path="/suggestions" element={<SuggestionsPage />} />
        <Route path="/quora" element={<QuoraPage />} />
        <Route path="/pinterest" element={<PinterestPage />} />
        <Route path="/keyword-generator" element={<KeywordGeneratorPage />} />
        <Route path="/signature" element={<SignaturePage />} />
        <Route path="/competitor-analysis" element={<CompetitorAnalysisPage />} />
        <Route path="/seo-generator" element={<SeoGeneratorPage />} />
        <Route path="/title-generator" element={<TitleGeneratorPage />} />
        <Route path="/robots-txt" element={<RobotsTxtPage />} />
        <Route path="/crawler" element={<CrawlerPage />} />
        <Route path="/ebook-planner" element={<EbookPlannerPage />} />
        <Route path="/ebook-ideas" element={<EbookIdeasPage />} />
        <Route path="/prompts-generator" element={<PromptsGeneratorPage />} />
        <Route path="/email-marketing" element={<EmailMarketingPage />} />
        <Route path="/product-generator" element={<ProductGeneratorPage />} />
        <Route path="/product-landing" element={<ProductLandingPage />} />
      </Routes>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
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
      </Routes>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
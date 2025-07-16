import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SerpGenerator from './pages/SerpGenerator';
import AnalyticsPage from './pages/AnalyticsPage';
import SeoPage from './pages/SeoPage';
import HierarchyPage from './pages/HierarchyPage';

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
      </Routes>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
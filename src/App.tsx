import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SerpGenerator from './pages/SerpGenerator';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/serp-generator" element={<SerpGenerator />} />
        <Route path="/analytics" element={<Dashboard />} />
        <Route path="/seo" element={<Dashboard />} />
        <Route path="/hierarchy" element={<Dashboard />} />
      </Routes>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
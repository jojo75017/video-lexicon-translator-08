
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import KeywordGeneratorPage from "./pages/KeywordGeneratorPage";
import CompetitorAnalysisPage from "./pages/CompetitorAnalysisPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/keyword-generator" element={<KeywordGeneratorPage />} />
          <Route path="/keyword-analysis" element={<KeywordGeneratorPage />} />
          <Route path="/competitor-analysis" element={<CompetitorAnalysisPage />} />
        </Routes>
      </Router>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

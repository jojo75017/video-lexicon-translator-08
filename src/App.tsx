
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Accueil from "./pages/Accueil";
import OutilsSeo from "./pages/OutilsSeo";
import QuoraPage from "./pages/QuoraPage";
import SignaturePage from "./pages/SignaturePage";
import HierarchyPage from "./pages/HierarchyPage";
import WordCountPage from "./pages/WordCountPage";
import StructurePage from "./pages/StructurePage";
import PerformancePage from "./pages/PerformancePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LocalBusinessPage from "./pages/LocalBusinessPage";
import BacklinksPage from "./pages/BacklinksPage";
import MetricsPage from "./pages/MetricsPage";
import SuggestionsPage from "./pages/SuggestionsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/index" element={<Navigate to="/" replace />} />
          <Route path="/seo" element={<OutilsSeo />} />
          <Route path="/quora" element={<QuoraPage />} />
          <Route path="/signature" element={<SignaturePage />} />
          <Route path="/hierarchy" element={<HierarchyPage />} />
          <Route path="/wordcount" element={<WordCountPage />} />
          <Route path="/structure" element={<StructurePage />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/local-business" element={<LocalBusinessPage />} />
          <Route path="/backlinks" element={<BacklinksPage />} />
          <Route path="/metrics" element={<MetricsPage />} />
          <Route path="/suggestions" element={<SuggestionsPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

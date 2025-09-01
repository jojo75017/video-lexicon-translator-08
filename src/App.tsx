import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from 'react-router-dom';
// VERSION EBOOK STANDALONE - Seulement les modules ebook
import EbookPlannerPage from './pages/EbookPlannerPage';
import EbookIdeasPage from './pages/EbookIdeasPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Navigate to="/ebook-ideas" replace />} />
          <Route path="/ebook-ideas" element={<EbookIdeasPage />} />
          <Route path="/ebook-planner" element={<EbookPlannerPage />} />
          {/* Toutes les autres routes supprimées pour version standalone */}
        </Routes>
        <Toaster />
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
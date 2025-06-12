
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import UnifiedDashboard from "./components/dashboard/UnifiedDashboard";
import NewsletterPage from "./pages/NewsletterPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/newsletter" element={<NewsletterPage />} />
          {navItems.map(({ to, page }) => (
            <Route key={to} path={to} element={page} />
          ))}
          <Route path="*" element={<UnifiedDashboard><div className="text-center p-8"><h2 className="text-2xl font-bold mb-4">Bienvenue sur votre Dashboard SEO</h2><p>Sélectionnez un outil dans la navigation ci-dessus.</p></div></UnifiedDashboard>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

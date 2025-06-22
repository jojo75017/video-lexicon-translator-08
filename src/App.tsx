
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import KeywordGeneratorPage from "./pages/KeywordGeneratorPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <KeywordGeneratorPage />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

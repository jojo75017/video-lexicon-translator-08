
import { Home, BarChart3, FileText, MessageSquare, Settings, Mail, LineChart, TreePine, Link } from "lucide-react";
import Index from "./pages/Index";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import SeoDashboard from "./pages/SeoDashboard";
import ContentIdeas from "./pages/ContentIdeas";
import SettingsPage from "./pages/SettingsPage";
import KeywordGeneratorPage from "./pages/KeywordGeneratorPage";
import SuggestionsPage from "./pages/SuggestionsPage";
import AiWriterPage from "./pages/AiWriterPage";
import PinterestPage from "./pages/PinterestPage";
import KeywordGuideComplete from "./pages/KeywordGuideComplete";
import NewsletterPage from "./pages/NewsletterPage";
import TrackingPage from "./pages/TrackingPage";
import KeywordMetaPage from "./pages/KeywordMetaPage";
import StructurePage from "./pages/StructurePage";
import InternalLinksPage from "./pages/InternalLinksPage";
import SignaturePage from "./pages/SignaturePage";

export const navItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Newsletter",
    to: "/newsletter",
    icon: <Mail className="h-4 w-4" />,
    page: <NewsletterPage />,
  },
  {
    title: "Analytics",
    to: "/analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <AnalyticsDashboard />,
  },
  {
    title: "SEO",
    to: "/seo",
    icon: <FileText className="h-4 w-4" />,
    page: <SeoDashboard />,
  },
  {
    title: "Suivi Positions",
    to: "/tracking",
    icon: <LineChart className="h-4 w-4" />,
    page: <TrackingPage />,
  },
  {
    title: "Titres et Meta",
    to: "/keyword-meta",
    icon: <FileText className="h-4 w-4" />,
    page: <KeywordMetaPage />,
  },
  {
    title: "Structure Site",
    to: "/structure",
    icon: <TreePine className="h-4 w-4" />,
    page: <StructurePage />,
  },
  {
    title: "Liens Internes",
    to: "/internal-links",
    icon: <Link className="h-4 w-4" />,
    page: <InternalLinksPage />,
  },
  {
    title: "Signature Email",
    to: "/signature",
    icon: <Mail className="h-4 w-4" />,
    page: <SignaturePage />,
  },
  {
    title: "Idées de contenu",
    to: "/content-ideas",
    icon: <MessageSquare className="h-4 w-4" />,
    page: <ContentIdeas />,
  },
  {
    title: "Générateur de mots-clés IA",
    to: "/keyword-generator",
    icon: <MessageSquare className="h-4 w-4" />,
    page: <KeywordGeneratorPage />,
  },
  {
    title: "Suggestions de contenu",
    to: "/suggestions",
    icon: <MessageSquare className="h-4 w-4" />,
    page: <SuggestionsPage />,
  },
  {
    title: "Rédacteur IA 2.0",
    to: "/ai-writer",
    icon: <FileText className="h-4 w-4" />,
    page: <AiWriterPage />,
  },
  {
    title: "Pinterest",
    to: "/pinterest",
    icon: <FileText className="h-4 w-4" />,
    page: <PinterestPage />,
  },
  {
    title: "Guide du générateur de mots-clés",
    to: "/keyword-guide-complete",
    icon: <FileText className="h-4 w-4" />,
    page: <KeywordGuideComplete />,
  },
  {
    title: "Paramètres",
    to: "/settings",
    icon: <Settings className="h-4 w-4" />,
    page: <SettingsPage />,
  },
];

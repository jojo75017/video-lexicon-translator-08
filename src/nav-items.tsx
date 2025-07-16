
import { HomeIcon, Search, TrendingUp, Link2, BarChart3 } from "lucide-react";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import InternalLinkingPage from "./pages/InternalLinkingPage";

export const navItems = [
  {
    title: "Accueil",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <HomePage />,
  },
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <DashboardPage />,
  },
  {
    title: "Analytics",
    to: "/analytics",
    icon: <TrendingUp className="h-4 w-4" />,
    page: <AnalyticsPage />,
  },
  {
    title: "Liens Internes",
    to: "/internal-linking",
    icon: <Link2 className="h-4 w-4" />,
    page: <InternalLinkingPage />,
  },
];

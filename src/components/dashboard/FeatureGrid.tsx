
import React from "react"
import { SparklesIcon, FileText, LayoutDashboard, Zap, Search, BarChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  link: string
  highlight?: boolean
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, link, highlight }) => {
  const handleClick = () => {
    toast.info(`Navigation vers ${title}...`);
  }
  
  return (
    <Link to={link} className="block mb-1" onClick={handleClick}>
      <Card className={cn(
        "transition-all hover:shadow-md", 
        highlight 
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" 
          : "hover:border-primary"
      )}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <CardDescription className={highlight ? "text-sm text-white/90" : "text-sm text-muted-foreground"}>
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}

const featureCards = [
  {
    title: "Outils SEO & IA",
    description: "Générateurs IA, méta-descriptions, vérificateur de liens et structures",
    icon: <FileText className="h-6 w-6 text-white" />,
    link: "/outils-seo",
    highlight: true,
  },
  {
    title: "Analyse de Site Web",
    description: "Effectuez une analyse SEO complète de n'importe quel site web.",
    icon: <SparklesIcon className="h-6 w-6 text-primary" />,
    link: "/seo",
    highlight: false,
  },
  {
    title: "Tableau de Bord",
    description: "Vue d'ensemble de vos analyses et outils SEO.",
    icon: <LayoutDashboard className="h-6 w-6 text-primary" />,
    link: "/",
    highlight: false,
  },
  {
    title: "Recherche IA",
    description: "Analyse de mots-clés et concurrence avec intelligence artificielle.",
    icon: <Search className="h-6 w-6 text-primary" />,
    link: "/outils-seo",
    highlight: false,
  },
  {
    title: "Performances",
    description: "Analysez les performances et la vitesse de votre site web.",
    icon: <Zap className="h-6 w-6 text-primary" />,
    link: "/performance",
    highlight: false,
  },
  {
    title: "Analytics Avancées",
    description: "Visualisez les statistiques détaillées de votre site.",
    icon: <BarChart className="h-6 w-6 text-primary" />,
    link: "/analytics",
    highlight: false,
  }
];

const FeatureGrid: React.FC = () => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {featureCards.map((card, index) => (
        <FeatureCard key={index} {...card} />
      ))}
    </div>
  )
}

export default FeatureGrid

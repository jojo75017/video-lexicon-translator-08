
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
  ultraHighlight?: boolean
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, link, highlight, ultraHighlight }) => {
  const handleClick = () => {
    toast.info(`Navigation vers ${title}...`);
  }

  if (ultraHighlight) {
    return (
      <Link to={link} className="block mb-6 relative z-50" onClick={handleClick}>
        <div className="fixed-feature-section top-4 left-1/2 -translate-x-1/2 z-50 md:relative md:top-auto md:left-auto md:transform-none">
          <Card className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 text-white border-4 border-purple-300 shadow-2xl overflow-hidden relative" style={{
            boxShadow: "0 0 25px rgba(147, 51, 234, 0.7)",
            zIndex: 9999
          }}>
            <div className="absolute inset-0 bg-grid-white/10 opacity-20"></div>
            <CardHeader className="relative z-10 pb-2">
              <div className="bg-white/20 p-3 w-fit rounded-full mb-2">
                {icon}
              </div>
              <CardTitle className="text-2xl font-black flex items-center gap-2">
                {title}
              </CardTitle>
              <CardDescription className="text-white/90 font-medium">
                {description}
              </CardDescription>
              <Button className="mt-4 bg-white/30 hover:bg-white/50 text-white w-full font-bold border-2 border-white">
                DÉCOUVRIR
              </Button>
            </CardHeader>
          </Card>
        </div>
      </Link>
    );
  }
  
  return (
    <Link to={link} className="block mb-1 relative" onClick={handleClick}>
      <Card className={cn(
        "transition-none border-2 shadow-lg", 
        highlight 
          ? "bg-gradient-to-r from-[#b92b27] to-[#8B5CF6] text-white border-orange-300" 
          : "border-primary hover:border-primary-dark"
      )} style={{ display: "block", visibility: "visible", opacity: 1 }}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {icon}
            {highlight ? <span className="font-bold">{title}</span> : title}
          </CardTitle>
          <CardDescription className={highlight ? "text-sm text-white" : "text-sm text-muted-foreground"}>
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}

const featureCards = [
  {
    title: "BOÎTE À OUTILS SEO & IA",
    description: "Générateurs IA, méta-descriptions, vérificateur de liens et structures",
    icon: <FileText className="h-8 w-8 text-white" />,
    link: "/outils-seo",
    highlight: false,
    ultraHighlight: true
  },
  {
    title: "Analyse de Site Web",
    description: "Effectuez une analyse SEO complète de n'importe quel site web.",
    icon: <SparklesIcon className="h-6 w-6 text-primary" />,
    link: "/seo",
    highlight: true,
    ultraHighlight: false
  },
  {
    title: "Tableau de Bord",
    description: "Vue d'ensemble de vos analyses et outils SEO.",
    icon: <LayoutDashboard className="h-6 w-6 text-primary" />,
    link: "/",
    highlight: false,
    ultraHighlight: false
  },
  {
    title: "Recherche IA",
    description: "Analyse de mots-clés et concurrence avec intelligence artificielle.",
    icon: <Search className="h-6 w-6 text-white" />,
    link: "/outils-seo",
    highlight: true,
    ultraHighlight: false
  },
  {
    title: "Performances",
    description: "Analysez les performances et la vitesse de votre site web.",
    icon: <Zap className="h-6 w-6 text-primary" />,
    link: "/performance",
    highlight: true,
    ultraHighlight: false
  },
  {
    title: "Analytics Avancées",
    description: "Visualisez les statistiques détaillées de votre site.",
    icon: <BarChart className="h-6 w-6 text-primary" />,
    link: "/analytics",
    highlight: false,
    ultraHighlight: false
  }
]

const FeatureGrid: React.FC = () => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {featureCards.map((card, index) => (
        <div key={index} className={`relative ${card.ultraHighlight ? 'col-span-full mb-8' : ''}`}>
          <FeatureCard {...card} />
        </div>
      ))}
    </div>
  )
}

export default FeatureGrid

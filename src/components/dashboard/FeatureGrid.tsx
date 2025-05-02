
import React from "react"
import { SparklesIcon, FileText, LayoutDashboard, Zap } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  link: string
  highlight?: boolean
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, link, highlight }) => {
  return (
    <Link to={link}>
      <Card className={cn(
        "transition-colors", 
        highlight 
          ? "bg-gradient-to-r from-[#b92b27] to-[#8B5CF6] text-white border-2 border-orange-300 animate-pulse shadow-lg" 
          : "hover:border-primary"
      )}>
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
    title: "Analyse de Site Web",
    description: "Effectuez une analyse SEO complète de n'importe quel site web.",
    icon: <SparklesIcon className="h-6 w-6 text-primary" />,
    link: "/seo",
    highlight: false
  },
  {
    title: "Tableau de Bord",
    description: "Vue d'ensemble de vos analyses et outils SEO.",
    icon: <LayoutDashboard className="h-6 w-6 text-primary" />,
    link: "/",
    highlight: false
  },
  {
    title: "BOÎTE À OUTILS SEO",
    description: "Générateur de méta-descriptions, vérificateur de liens et structures de contenu",
    icon: <FileText className="h-6 w-6 text-white" />,
    link: "/outils-seo",
    highlight: true
  },
  {
    title: "Performances",
    description: "Analysez les performances et la vitesse de votre site web.",
    icon: <Zap className="h-6 w-6 text-primary" />,
    link: "/performance",
    highlight: false
  }
]

const FeatureGrid: React.FC = () => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featureCards.map((card, index) => (
        <FeatureCard key={index} {...card} />
      ))}
    </div>
  )
}

export default FeatureGrid

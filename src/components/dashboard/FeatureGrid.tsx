import React from "react"
import { SparklesIcon, FileText, LayoutDashboard } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  link: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, link }) => {
  return (
    <Link to={link}>
      <Card className="transition-colors hover:border-primary">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
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
    link: "/seo"
  },
  {
    title: "Tableau de Bord",
    description: "Vue d'ensemble de vos analyses et outils SEO.",
    icon: <LayoutDashboard className="h-6 w-6 text-primary" />,
    link: "/"
  },
  {
    title: "Outils SEO Avancés",
    description: "Générateur de méta-descriptions, vérificateur de liens et structures de contenu",
    icon: <FileText className="h-6 w-6 text-primary" />,
    link: "/outils-seo"
  },
]

const FeatureGrid: React.FC = () => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {featureCards.map((card, index) => (
        <FeatureCard key={index} {...card} />
      ))}
    </div>
  )
}

export default FeatureGrid

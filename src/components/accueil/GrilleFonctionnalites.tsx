
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  BarChart2, 
  Globe, 
  Smartphone, 
  Compass, 
  Zap,
  ListTree,
  MessageSquare
} from 'lucide-react';

const GrilleFonctionnalites = () => {
  const fonctionnalites = [
    {
      icon: <Search className="h-8 w-8 text-indigo-600" />,
      titre: "Analyse SEO",
      description: "Analysez et améliorez le référencement de votre site web",
      lien: "/seo",
      couleur: "bg-indigo-100"
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-green-600" />,
      titre: "Performance",
      description: "Optimisez la vitesse et l'efficacité de votre site",
      lien: "/seo?tab=performance",
      couleur: "bg-green-100"
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      titre: "Accessibilité",
      description: "Assurez-vous que votre site est accessible à tous",
      lien: "/seo?tab=accessibility",
      couleur: "bg-blue-100"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-purple-600" />,
      titre: "Mobile",
      description: "Optimisez votre site pour les appareils mobiles",
      lien: "/seo?tab=mobile",
      couleur: "bg-purple-100"
    },
    {
      icon: <Compass className="h-8 w-8 text-orange-600" />,
      titre: "Exploration",
      description: "Découvrez des opportunités d'amélioration",
      lien: "/seo?tab=exploration",
      couleur: "bg-orange-100"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      titre: "Vitesse",
      description: "Améliorez la vitesse de chargement de votre site",
      lien: "/seo?tab=vitesse",
      couleur: "bg-yellow-100"
    },
    {
      icon: <ListTree className="h-8 w-8 text-teal-600" />,
      titre: "Structure",
      description: "Analysez la structure de votre site web",
      lien: "/seo?tab=serp",
      couleur: "bg-teal-100"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-pink-600" />,
      titre: "Contenu",
      description: "Optimisez votre contenu pour un meilleur référencement",
      lien: "/seo?tab=content",
      couleur: "bg-pink-100"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {fonctionnalites.map((fonctionnalite, index) => (
        <Link 
          key={index} 
          to={fonctionnalite.lien || "#"} 
          className={`block p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${fonctionnalite.couleur || 'bg-white'}`}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            {fonctionnalite.icon}
            <h3 className="text-lg font-semibold">{fonctionnalite.titre}</h3>
            <p className="text-gray-600 text-sm">{fonctionnalite.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default GrilleFonctionnalites;

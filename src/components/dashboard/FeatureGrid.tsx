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

const FeatureGrid = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-indigo-600" />,
      title: "Analyse SEO",
      description: "Analysez et améliorez le référencement de votre site web",
      link: "/seo",
      color: "bg-indigo-100"
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-green-600" />,
      title: "Performance",
      description: "Optimisez la vitesse et l'efficacité de votre site",
      link: "#performance",
      color: "bg-green-100"
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      title: "Accessibilité",
      description: "Assurez-vous que votre site est accessible à tous les utilisateurs",
      link: "#accessibility",
      color: "bg-blue-100"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-purple-600" />,
      title: "Mobile",
      description: "Optimisez votre site pour les appareils mobiles",
      link: "#mobile",
      color: "bg-purple-100"
    },
    {
      icon: <Compass className="h-8 w-8 text-orange-600" />,
      title: "Exploration",
      description: "Découvrez des opportunités d'amélioration de votre site",
      link: "#exploration",
      color: "bg-orange-100"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Vitesse",
      description: "Améliorez la vitesse de chargement de votre site",
      link: "#vitesse",
      color: "bg-yellow-100"
    },
    {
      icon: <ListTree className="h-8 w-8 text-teal-600" />,
      title: "Structure",
      description: "Analysez la structure de votre site web",
      link: "#structure",
      color: "bg-teal-100"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-pink-600" />,
      title: "Contenu",
      description: "Optimisez votre contenu pour un meilleur référencement",
      link: "#contenu",
      color: "bg-pink-100"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <Link 
          key={index} 
          to={feature.link || "#"} 
          className={`block p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${feature.color || 'bg-white'}`}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            {feature.icon}
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FeatureGrid;

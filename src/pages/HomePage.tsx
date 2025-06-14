
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  TreePine, 
  Link as LinkIcon, 
  Mail, 
  LineChart,
  Home,
  BarChart3,
  MessageSquare,
  Settings
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      title: "Titres et Meta",
      description: "Générez des titres et meta descriptions optimisés SEO",
      icon: <FileText className="h-6 w-6" />,
      link: "/keyword-meta",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
    },
    {
      title: "Structure du Site",
      description: "Analysez et optimisez la structure de votre site",
      icon: <TreePine className="h-6 w-6" />,
      link: "/structure",
      color: "bg-green-50 border-green-200 hover:bg-green-100"
    },
    {
      title: "Liens Internes",
      description: "Optimisez votre maillage interne",
      icon: <LinkIcon className="h-6 w-6" />,
      link: "/internal-links",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100"
    },
    {
      title: "Signature Email",
      description: "Créez des signatures email professionnelles",
      icon: <Mail className="h-6 w-6" />,
      link: "/signature",
      color: "bg-amber-50 border-amber-200 hover:bg-amber-100"
    },
    {
      title: "Suivi des Positions",
      description: "Suivez vos positions dans les moteurs de recherche",
      icon: <LineChart className="h-6 w-6" />,
      link: "/tracking",
      color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
    },
    {
      title: "Newsletter",
      description: "Générez du contenu pour vos newsletters",
      icon: <Mail className="h-6 w-6" />,
      link: "/newsletter",
      color: "bg-pink-50 border-pink-200 hover:bg-pink-100"
    },
    {
      title: "Analytics",
      description: "Analysez les performances de votre site",
      icon: <BarChart3 className="h-6 w-6" />,
      link: "/analytics",
      color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
    },
    {
      title: "SEO Dashboard",
      description: "Tableau de bord SEO complet",
      icon: <FileText className="h-6 w-6" />,
      link: "/seo",
      color: "bg-violet-50 border-violet-200 hover:bg-violet-100"
    },
    {
      title: "Générateur de mots-clés",
      description: "Générez des mots-clés avec l'IA",
      icon: <MessageSquare className="h-6 w-6" />,
      link: "/keyword-generator",
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100"
    },
    {
      title: "Idées de contenu",
      description: "Trouvez des idées de contenu",
      icon: <MessageSquare className="h-6 w-6" />,
      link: "/content-ideas",
      color: "bg-teal-50 border-teal-200 hover:bg-teal-100"
    },
    {
      title: "Pinterest",
      description: "Outils pour Pinterest",
      icon: <FileText className="h-6 w-6" />,
      link: "/pinterest",
      color: "bg-red-50 border-red-200 hover:bg-red-100"
    },
    {
      title: "Rédacteur IA",
      description: "Rédigez du contenu avec l'IA",
      icon: <FileText className="h-6 w-6" />,
      link: "/ai-writer",
      color: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 p-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Home className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord SEO</h1>
          </div>
          <p className="text-gray-600">
            Accédez à tous vos outils SEO depuis cette page principale
          </p>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link}>
              <Card className={`h-full transition-all duration-200 cursor-pointer ${feature.color}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <Button variant="outline" className="w-full" size="sm">
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Bienvenue sur votre plateforme SEO
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Utilisez les outils ci-dessus pour optimiser votre référencement naturel, 
                analyser vos performances et améliorer votre visibilité en ligne.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/seo">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Commencer l'analyse SEO
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RocketIcon, LayoutDashboard, ListChecks, BarChart, Settings, ImagePlus, FileText } from 'lucide-react'; // Add this import if not already present

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        
        <Link to="/pinterest-generator" className="group">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-pink-600" />
                <span>Pinterest Generator</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Créez des visuels percutants pour Pinterest et attirez l'attention de votre audience.
              </p>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-pink-600 group-hover:underline">Accéder à l'outil →</div>
            </CardFooter>
          </Card>
        </Link>

        <Link to="/seo-keyword-strategy" className="group">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RocketIcon className="h-5 w-5 text-green-600" />
                <span>Stratégie de Mots-clés SEO</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Découvrez les meilleurs mots-clés pour booster votre visibilité en ligne.
              </p>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-green-600 group-hover:underline">Accéder à l'outil →</div>
            </CardFooter>
          </Card>
        </Link>
        
        <Link to="/seo-content-generator" className="group">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-orange-600" />
                <span>Générateur de contenu SEO</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Créez du contenu optimisé pour le SEO en quelques clics.
              </p>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-orange-600 group-hover:underline">Accéder à l'outil →</div>
            </CardFooter>
          </Card>
        </Link>
        
        <Link to="/signature-generator" className="group">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-purple-600" />
                <span>Générateur de Signature Email</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Créez une signature email professionnelle et personnalisée.
              </p>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-purple-600 group-hover:underline">Accéder à l'outil →</div>
            </CardFooter>
          </Card>
        </Link>
        
        <Link to="/seo-analyzer" className="group">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-teal-600" />
                <span>Analyse SEO</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Analysez votre site web et obtenez des recommandations pour l'améliorer.
              </p>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-teal-600 group-hover:underline">Accéder à l'outil →</div>
            </CardFooter>
          </Card>
        </Link>
        
        <Link to="/settings" className="group">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                <span>Paramètres</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Modifiez les paramètres de votre compte et préférences.
              </p>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-gray-600 group-hover:underline">Accéder aux paramètres →</div>
            </CardFooter>
          </Card>
        </Link>
        
        <Link to="/word-count" className="group">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Compteur de mots</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Analysez et comptez les mots, caractères et paragraphes de votre contenu.
              </p>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-blue-600 group-hover:underline">Accéder à l'outil →</div>
            </CardFooter>
          </Card>
        </Link>
      </div>
      
      <div className="mt-8">
        <Button variant="outline">
          <a href="https://github.com/sadmann7/skateshop" target="_blank" rel="noopener noreferrer">
            Voir le code source sur GitHub
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;


import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { FileText, LinkIcon, LineChart, BarChart2, Tag, Info, FilePenLine, LayoutGrid, Search } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import BrokenLinkButton from '@/components/seo/BrokenLinkButton';
import BlogContentGenerator from '@/components/seo/BlogContentGenerator';
import DomainAnalysis from '@/components/seo/DomainAnalysis';

const HomePage = () => {
  return (
    <UnifiedDashboard>
      <div className="space-y-8">
        <section>
          <Card className="p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold mb-4">Bienvenue sur votre Dashboard SEO</h1>
                <p className="text-gray-600 mb-6">
                  Utilisez nos outils pour analyser et améliorer le référencement de votre site web. 
                  Accédez rapidement aux différentes fonctionnalités ci-dessous.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/keyword-meta">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Title & Meta
                    </Button>
                  </Link>
                  <Link to="/keyword-generator">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      Générateur de mots-clés
                    </Button>
                  </Link>
                  <BrokenLinkButton className="bg-blue-600 hover:bg-blue-700 text-white" />
                  <BlogContentGenerator />
                </div>
              </div>
              <div className="md:w-1/3">
                <BarChart2 className="h-32 w-32 text-blue-500 mx-auto" />
              </div>
            </div>
          </Card>
        </section>

        {/* Nouvelle section d'analyse de domaine */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Analyse de Domaine</h2>
          <DomainAnalysis />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Outils SEO principaux</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/keyword-meta" className="block">
              <Card className="p-6 bg-white hover:bg-blue-50 transition-colors h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <Tag className="h-8 w-8 mr-3 text-blue-600" />
                  <h3 className="text-xl font-bold">Title & Meta</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Optimisez vos balises title et meta pour un meilleur référencement. Générez des méta-descriptions 
                  optimisées pour améliorer votre CTR.
                </p>
                <Button className="mt-auto" variant="outline">Accéder à l'outil</Button>
              </Card>
            </Link>
            
            <Link to="/keyword-generator" className="block">
              <Card className="p-6 bg-white hover:bg-green-50 transition-colors h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <Search className="h-8 w-8 mr-3 text-green-600" />
                  <h3 className="text-xl font-bold">Générateur de mots-clés</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Trouvez les mots-clés les plus pertinents pour votre contenu et améliorez votre visibilité dans les moteurs de recherche.
                </p>
                <Button className="mt-auto" variant="outline">Accéder à l'outil</Button>
              </Card>
            </Link>
            
            <Link to="/internal-linking" className="block">
              <Card className="p-6 bg-white hover:bg-blue-50 transition-colors h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <LinkIcon className="h-8 w-8 mr-3 text-purple-600" />
                  <h3 className="text-xl font-bold">Liens Internes</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Améliorez votre structure de liens internes pour optimiser le maillage de votre site et 
                  renforcer votre référencement.
                </p>
                <Button className="mt-auto" variant="outline">Accéder à l'outil</Button>
              </Card>
            </Link>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Outils supplémentaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/pinterest" className="block">
              <Card className="p-6 bg-white hover:bg-red-50 transition-colors h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <FilePenLine className="h-8 w-8 mr-3 text-red-600" />
                  <h3 className="text-xl font-bold">Pinterest</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Générez des images Pinterest optimisées pour augmenter votre visibilité et attirer plus de trafic vers votre site.
                </p>
                <Button className="mt-auto" variant="outline">Accéder à l'outil</Button>
              </Card>
            </Link>
            
            <Link to="/signature" className="block">
              <Card className="p-6 bg-white hover:bg-blue-50 transition-colors h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <FileText className="h-8 w-8 mr-3 text-blue-600" />
                  <h3 className="text-xl font-bold">Signature Email</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Créez une signature email professionnelle pour renforcer votre image de marque et promouvoir votre site web.
                </p>
                <Button className="mt-auto" variant="outline">Accéder à l'outil</Button>
              </Card>
            </Link>
            
            <Link to="/structure" className="block">
              <Card className="p-6 bg-white hover:bg-purple-50 transition-colors h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <LayoutGrid className="h-8 w-8 mr-3 text-purple-600" />
                  <h3 className="text-xl font-bold">Structure Site</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Analysez et optimisez la structure de votre site web pour une meilleure expérience utilisateur et un meilleur référencement.
                </p>
                <Button className="mt-auto" variant="outline">Accéder à l'outil</Button>
              </Card>
            </Link>
          </div>
        </section>
        
        <section>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Comment ça marche</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold mb-2">1. Choisissez un outil</h3>
                <p className="text-gray-600">Sélectionnez l'outil SEO qui correspond à vos besoins actuels.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-purple-100 rounded-full p-4 mb-4">
                  <BarChart2 className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-bold mb-2">2. Analysez vos données</h3>
                <p className="text-gray-600">Entrez votre URL ou vos mots-clés pour obtenir une analyse détaillée.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 rounded-full p-4 mb-4">
                  <Info className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold mb-2">3. Appliquez les recommandations</h3>
                <p className="text-gray-600">Suivez nos conseils pour améliorer votre référencement et augmenter votre visibilité.</p>
              </div>
            </div>
          </Card>
        </section>
        
        <section>
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertTitle>Besoin d'aide ?</AlertTitle>
            <AlertDescription>
              Notre équipe est disponible pour vous aider à optimiser votre référencement. N'hésitez pas à nous contacter
              pour obtenir des conseils personnalisés.
            </AlertDescription>
          </Alert>
        </section>
      </div>
    </UnifiedDashboard>
  );
};

export default HomePage;

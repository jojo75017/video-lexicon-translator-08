
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Search, 
  BarChart, 
  Mail, 
  Link, 
  Settings,
  PenTool,
  Lightbulb,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Accueil',
      description: 'Retour à la page principale',
      icon: FileText,
      path: '/',
      color: 'text-blue-600'
    },
    {
      title: 'Analytics',
      description: 'Analysez vos performances',
      icon: BarChart,
      path: '/analytics',
      color: 'text-green-600'
    },
    {
      title: 'Liens Internes',
      description: 'Optimisez votre maillage interne',
      icon: Link,
      path: '/internal-linking',
      color: 'text-purple-600'
    },
    {
      title: 'Analyse des Mots-clés',
      description: 'Analysez vos mots-clés',
      icon: Search,
      path: '/keyword-analysis',
      color: 'text-red-600'
    },
    {
      title: 'Générateur de Mots-clés',
      description: 'Générez des mots-clés',
      icon: PenTool,
      path: '/keyword-generator',
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Dashboard SEO</h1>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Dashboard SEO
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Accédez à tous vos outils SEO et de marketing digital depuis ce tableau de bord centralisé.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.path} className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-gray-50 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Button 
                  onClick={() => navigate(feature.path)}
                  className="w-full"
                  variant="outline"
                >
                  Accéder
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

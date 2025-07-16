
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  BarChart, 
  Settings,
  FileText
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Dashboard Principal',
      description: 'Accédez au tableau de bord complet avec tous vos outils SEO',
      icon: LayoutDashboard,
      path: '/dashboard',
      color: 'text-blue-600'
    },
    {
      title: 'Générateur de Mots-clés',
      description: 'Générez et analysez des mots-clés pour votre contenu',
      icon: Search,
      path: '/keyword-generator',
      color: 'text-green-600'
    },
    {
      title: 'Analytics SEO',
      description: 'Analysez vos performances SEO en détail',
      icon: BarChart,
      path: '/dashboard',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Plateforme SEO</h1>
        </div>
      </header>
      
      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Bienvenue sur votre plateforme SEO
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Accédez à tous vos outils SEO et de marketing digital depuis cette interface centralisée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.path} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gray-50 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Button 
                  onClick={() => navigate(feature.path)}
                  className="w-full"
                  variant="outline"
                >
                  Accéder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

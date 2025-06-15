
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
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
  Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Newsletter',
      description: 'Créez des newsletters professionnelles',
      icon: Mail,
      path: '/newsletter',
      color: 'text-blue-600'
    },
    {
      title: 'Structure du Site',
      description: 'Analysez la structure de votre site',
      icon: BarChart,
      path: '/structure',
      color: 'text-green-600'
    },
    {
      title: 'Idées de Contenu',
      description: 'Générez des idées de contenu créatives',
      icon: Lightbulb,
      path: '/content-ideas',
      color: 'text-yellow-600'
    },
    {
      title: 'Rédacteur IA',
      description: 'Créez du contenu avec l\'IA',
      icon: PenTool,
      path: '/ai-writer',
      color: 'text-purple-600'
    },
    {
      title: 'Signature Email',
      description: 'Générez des signatures professionnelles',
      icon: Settings,
      path: '/signature',
      color: 'text-gray-600'
    },
    {
      title: 'Suivi des Positions',
      description: 'Suivez vos positions SEO',
      icon: Search,
      path: '/tracking',
      color: 'text-red-600'
    }
  ];

  return (
    <UnifiedDashboard>
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
    </UnifiedDashboard>
  );
};

export default DashboardPage;

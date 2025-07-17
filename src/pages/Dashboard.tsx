import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Search, Globe, TrendingUp, Users, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Générateur SERP',
      description: 'Générez des URLs pour les sites français',
      icon: Search,
      path: '/serp-generator',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Analytics',
      description: 'Analysez vos performances',
      icon: BarChart3,
      path: '/analytics',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'SEO',
      description: 'Optimisez votre référencement',
      icon: TrendingUp,
      path: '/seo',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Générateur SEO',
      description: 'Créez du contenu SEO optimisé',
      icon: TrendingUp,
      path: '/seo-generator',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Générateur de Titres',
      description: 'Titres SEO optimisés par thématique',
      icon: Lightbulb,
      path: '/title-generator',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      title: 'Hiérarchie',
      description: 'Structure de votre site',
      icon: Globe,
      path: '/hierarchy',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Analyse Concurrentielle',
      description: 'Analysez vos concurrents en détail',
      icon: Users,
      path: '/competitor-analysis',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Test Robots.txt',
      description: 'Testez votre robots.txt et validez les règles',
      icon: Search,
      path: '/robots-txt',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      title: 'Crawler SEO par Georges Boubet',
      description: 'Analyseur de site web SEO',
      icon: Globe,
      path: '/crawler',
      color: 'from-emerald-500 to-emerald-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-6">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-center">
          🚀 Tableau de Bord SEO
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
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

export default Dashboard;
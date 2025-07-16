import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Target, Link, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SeoPage: React.FC = () => {
  const navigate = useNavigate();

  const seoTools = [
    {
      title: 'Analyse des Mots-clés',
      description: 'Trouvez les meilleurs mots-clés pour votre contenu',
      icon: Search,
      status: 'Disponible'
    },
    {
      title: 'Audit Technique',
      description: 'Vérifiez la santé technique de votre site',
      icon: Target,
      status: 'En cours'
    },
    {
      title: 'Analyse des Backlinks',
      description: 'Surveillez vos liens entrants',
      icon: Link,
      status: 'Disponible'
    },
    {
      title: 'Optimisation du Contenu',
      description: 'Améliorez vos textes pour le SEO',
      icon: FileText,
      status: 'Bientôt'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🚀 SEO Tools
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seoTools.map((tool) => (
            <Card key={tool.title} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    <tool.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {tool.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tool.description}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    tool.status === 'Disponible' ? 'bg-green-100 text-green-800' :
                    tool.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {tool.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  variant="outline"
                  disabled={tool.status !== 'Disponible'}
                >
                  {tool.status === 'Disponible' ? 'Utiliser' : 'Bientôt disponible'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeoPage;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, Folder, File, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HierarchyPage: React.FC = () => {
  const navigate = useNavigate();

  const siteStructure = [
    {
      name: 'Accueil',
      type: 'page',
      path: '/',
      children: [
        { name: 'À propos', type: 'page', path: '/about' },
        { name: 'Services', type: 'folder', path: '/services', children: [
          { name: 'Consultation', type: 'page', path: '/services/consultation' },
          { name: 'Formation', type: 'page', path: '/services/formation' }
        ]},
        { name: 'Blog', type: 'folder', path: '/blog', children: [
          { name: 'Articles récents', type: 'page', path: '/blog/recent' },
          { name: 'Catégories', type: 'page', path: '/blog/categories' }
        ]},
        { name: 'Contact', type: 'page', path: '/contact' }
      ]
    }
  ];

  const renderStructureItem = (item: any, level = 0) => (
    <div key={item.path} className={`ml-${level * 4}`}>
      <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
        {item.type === 'folder' ? (
          <Folder className="h-4 w-4 text-blue-500" />
        ) : (
          <File className="h-4 w-4 text-gray-500" />
        )}
        <span className="text-sm">{item.name}</span>
        <span className="text-xs text-gray-400 ml-auto">{item.path}</span>
        {item.children && <ChevronRight className="h-3 w-3 text-gray-400" />}
      </div>
      {item.children && (
        <div className="ml-4">
          {item.children.map((child: any) => renderStructureItem(child, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-red-50/30 p-6">
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            🌐 Hiérarchie du Site
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Structure du Site
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {siteStructure.map(item => renderStructureItem(item))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Pages totales</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between">
                  <span>Profondeur moyenne</span>
                  <span className="font-semibold">2.3</span>
                </div>
                <div className="flex justify-between">
                  <span>Pages orphelines</span>
                  <span className="font-semibold text-orange-600">0</span>
                </div>
                <div className="flex justify-between">
                  <span>Liens internes</span>
                  <span className="font-semibold">24</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HierarchyPage;
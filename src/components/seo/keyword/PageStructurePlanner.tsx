
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TreePine, Layers } from 'lucide-react';

const PageStructurePlanner: React.FC = () => {
  const structureElements = [
    { tag: 'H1', content: 'Titre principal optimisé', importance: 'Critique' },
    { tag: 'H2', content: 'Introduction et contexte', importance: 'Haute' },
    { tag: 'H2', content: 'Section principale 1', importance: 'Haute' },
    { tag: 'H3', content: 'Sous-section avec mots-clés', importance: 'Moyenne' },
    { tag: 'H2', content: 'Section principale 2', importance: 'Haute' },
    { tag: 'H3', content: 'FAQ optimisée', importance: 'Moyenne' },
    { tag: 'H2', content: 'Conclusion et CTA', importance: 'Haute' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TreePine className="h-5 w-5 text-teal-500" />
          Structure de page optimisée
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {structureElements.map((element, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-gray-400" />
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {element.tag}
                </span>
              </div>
              <div className="flex-1">
                <span className="text-sm">{element.content}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                element.importance === 'Critique' ? 'bg-red-100 text-red-800' :
                element.importance === 'Haute' ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {element.importance}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PageStructurePlanner;

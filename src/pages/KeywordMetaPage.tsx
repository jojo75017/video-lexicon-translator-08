
import React, { useState } from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Tag, Info } from 'lucide-react';
import { toast } from 'sonner';

const KeywordMetaPage = () => {
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const handleGenerate = () => {
    if (!keyword) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }
    
    // Génération simplifiée pour démonstration
    setTitle(`${keyword} - Guide complet et conseils d'experts [2025]`);
    setDescription(`Découvrez tout ce que vous devez savoir sur ${keyword.toLowerCase()}. Guides, astuces et conseils d'experts pour améliorer vos résultats dès maintenant.`);
    
    toast.success("Suggestions générées avec succès");
  };

  return (
    <UnifiedDashboard>
      <div className="container mx-auto py-4">
        <Card className="p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Générateur de Title & Meta Description
          </h2>
          
          <div className="space-y-6">
            {/* Input pour le mot-clé */}
            <div>
              <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                Mot-clé principal
              </label>
              <div className="flex gap-2">
                <Input
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Entrez votre mot-clé principal"
                  className="flex-1"
                />
                <Button 
                  onClick={handleGenerate}
                  disabled={!keyword.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Générer
                </Button>
              </div>
            </div>
            
            {/* Title */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title Tag
                </label>
                <span className={`text-xs ${title.length > 60 ? 'text-red-500' : 'text-gray-500'}`}>
                  {title.length}/60
                </span>
              </div>
              <Textarea
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entrez votre balise title ici"
                className="min-h-[80px]"
              />
            </div>
            
            {/* Description */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <span className={`text-xs ${description.length > 155 ? 'text-red-500' : 'text-gray-500'}`}>
                  {description.length}/155
                </span>
              </div>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Entrez votre meta description ici"
                className="min-h-[100px]"
              />
            </div>
            
            {/* Prévisualisation */}
            {(title || description) && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Prévisualisation dans Google:</h3>
                <div className="border border-gray-200 rounded-md p-3 bg-white">
                  <div className="text-blue-600 text-lg truncate">{title || "Titre de votre page"}</div>
                  <div className="text-green-700 text-xs">www.votresite.com › page</div>
                  <div className="text-gray-600 text-sm line-clamp-2 mt-1">
                    {description || "Votre description apparaîtra ici..."}
                  </div>
                </div>
              </div>
            )}
            
            {/* Conseils */}
            <Alert variant="default" className="bg-blue-50 border-blue-100">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Conseils:</strong> Utilisez votre mot-clé principal en début de titre et gardez une longueur entre 50-60 caractères. Pour la description, maintenez 120-155 caractères avec un appel à l'action.
              </AlertDescription>
            </Alert>
          </div>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default KeywordMetaPage;

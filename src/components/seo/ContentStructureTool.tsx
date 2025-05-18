
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading1, Heading2, Heading3, FileText, List, Plus, Trash2, MoveVertical } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { StructureItem, StructureItemType } from '@/types/seo/Hierarchy';

interface ContentStructureToolProps {
  onGenerateStructure?: (items: StructureItem[]) => void;
  initialStructure?: StructureItem[];
  isLoading?: boolean;
}

const ContentStructureTool: React.FC<ContentStructureToolProps> = ({
  onGenerateStructure,
  initialStructure = [],
  isLoading = false
}) => {
  const [structureItems, setStructureItems] = useState<StructureItem[]>(initialStructure);
  const [keyword, setKeyword] = useState('');
  
  const handleAddItem = (type: StructureItemType) => {
    const newItem: StructureItem = {
      id: `item-${Date.now()}`,
      type: type,
      content: type === 'h1' ? 'Titre principal' : 
              type === 'h2' ? 'Sous-titre' :
              type === 'h3' ? 'Titre de section' :
              type === 'h4' ? 'Sous-section' :
              type === 'list' ? 'Liste à puces' : 'Paragraphe',
      items: type === 'list' ? ['Élément 1', 'Élément 2'] : undefined
    };
    
    setStructureItems([...structureItems, newItem]);
  };
  
  const handleUpdateItem = (id: string, content: string) => {
    setStructureItems(structureItems.map(item => 
      item.id === id ? { ...item, content } : item
    ));
  };
  
  const handleUpdateListItem = (itemId: string, index: number, value: string) => {
    setStructureItems(structureItems.map(item => {
      if (item.id === itemId && item.items) {
        const updatedItems = [...item.items];
        updatedItems[index] = value;
        return { ...item, items: updatedItems };
      }
      return item;
    }));
  };
  
  const handleAddListItem = (itemId: string) => {
    setStructureItems(structureItems.map(item => {
      if (item.id === itemId && item.items) {
        return { ...item, items: [...item.items, `Élément ${item.items.length + 1}`] };
      }
      return item;
    }));
  };
  
  const handleRemoveListItem = (itemId: string, index: number) => {
    setStructureItems(structureItems.map(item => {
      if (item.id === itemId && item.items && item.items.length > 1) {
        const newItems = [...item.items];
        newItems.splice(index, 1);
        return { ...item, items: newItems };
      }
      return item;
    }));
  };
  
  const handleRemoveItem = (id: string) => {
    setStructureItems(structureItems.filter(item => item.id !== id));
  };
  
  const handleMoveItem = (id: string, direction: 'up' | 'down') => {
    const index = structureItems.findIndex(item => item.id === id);
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === structureItems.length - 1)) {
      return;
    }
    
    const newItems = [...structureItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setStructureItems(newItems);
  };
  
  const handleGenerateStructure = () => {
    // Validate structure (e.g., H1 should be first if present)
    const h1Count = structureItems.filter(item => item.type === 'h1').length;
    if (h1Count > 1) {
      toast.error("Une page ne devrait contenir qu'un seul titre H1");
      return;
    }
    
    if (h1Count === 1 && structureItems[0].type !== 'h1') {
      toast.warning("Le titre H1 devrait être le premier élément de la page");
    }
    
    if (structureItems.length === 0) {
      toast.error("Ajoutez au moins un élément à la structure");
      return;
    }
    
    // Call the parent's handler with the structure items
    if (onGenerateStructure) {
      onGenerateStructure(structureItems);
    }
    
    toast.success("Structure de contenu générée avec succès");
  };
  
  const handleGenerateFromKeyword = () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }
    
    // Generate a basic structure based on the keyword
    const generatedStructure: StructureItem[] = [
      {
        id: `item-${Date.now()}-h1`,
        type: 'h1',
        content: `Guide complet sur ${keyword}`
      },
      {
        id: `item-${Date.now()}-p1`,
        type: 'p',
        content: `Introduction à ${keyword} et présentation des points clés que nous allons aborder dans cet article.`
      },
      {
        id: `item-${Date.now()}-h2-1`,
        type: 'h2',
        content: `Qu'est-ce que ${keyword} ?`
      },
      {
        id: `item-${Date.now()}-p2`,
        type: 'p',
        content: `Explication détaillée du concept de ${keyword}, son importance et ses applications.`
      },
      {
        id: `item-${Date.now()}-h2-2`,
        type: 'h2',
        content: `Avantages de ${keyword}`
      },
      {
        id: `item-${Date.now()}-list`,
        type: 'list',
        items: [
          `Avantage 1 de ${keyword}`,
          `Avantage 2 de ${keyword}`,
          `Avantage 3 de ${keyword}`
        ]
      },
      {
        id: `item-${Date.now()}-h2-3`,
        type: 'h2',
        content: `Comment utiliser ${keyword} efficacement`
      },
      {
        id: `item-${Date.now()}-h3-1`,
        type: 'h3',
        content: `Étape 1 : Préparation`
      },
      {
        id: `item-${Date.now()}-p3`,
        type: 'p',
        content: `Description de la première étape pour utiliser ${keyword} de manière optimale.`
      },
      {
        id: `item-${Date.now()}-h3-2`,
        type: 'h3',
        content: `Étape 2 : Mise en œuvre`
      }
    ];
    
    setStructureItems(generatedStructure);
    toast.success("Structure générée à partir du mot-clé");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="h-5 w-5 text-blue-600" />
          Créer la structure de contenu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-base font-medium mb-2">Génération automatique</h3>
            <div className="flex gap-2">
              <Input 
                placeholder="Entrez un mot-clé principal" 
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
              <Button onClick={handleGenerateFromKeyword} disabled={!keyword.trim()}>
                Générer
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Créez automatiquement une structure de contenu optimisée pour votre mot-clé
            </p>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-3 h-auto"
              onClick={() => handleAddItem('h1')}
            >
              <Heading1 className="h-5 w-5 mb-1" />
              <span className="text-xs">H1</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-3 h-auto"
              onClick={() => handleAddItem('h2')}
            >
              <Heading2 className="h-5 w-5 mb-1" />
              <span className="text-xs">H2</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-3 h-auto"
              onClick={() => handleAddItem('h3')}
            >
              <Heading3 className="h-5 w-5 mb-1" />
              <span className="text-xs">H3</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-3 h-auto"
              onClick={() => handleAddItem('h4')}
            >
              <Heading3 className="h-4 w-4 mb-1" />
              <span className="text-xs">H4</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-3 h-auto"
              onClick={() => handleAddItem('p')}
            >
              <FileText className="h-5 w-5 mb-1" />
              <span className="text-xs">Texte</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-3 h-auto"
              onClick={() => handleAddItem('list')}
            >
              <List className="h-5 w-5 mb-1" />
              <span className="text-xs">Liste</span>
            </Button>
          </div>
          
          <div className="space-y-3 mt-6">
            {structureItems.length === 0 && (
              <div className="p-6 border border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500 text-center">
                  Ajoutez des éléments pour créer la structure de votre contenu
                </p>
              </div>
            )}
            
            {structureItems.map((item, index) => (
              <div key={item.id} className="p-3 border rounded-md bg-white">
                <div className="flex items-center mb-2">
                  <Badge className="mr-2">
                    {item.type.toUpperCase()}
                  </Badge>
                  
                  <div className="ml-auto flex items-center space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleMoveItem(item.id, 'up')}
                      disabled={index === 0}
                    >
                      <MoveVertical className="h-4 w-4 transform -rotate-90" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleMoveItem(item.id, 'down')}
                      disabled={index === structureItems.length - 1}
                    >
                      <MoveVertical className="h-4 w-4 transform rotate-90" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {item.type === 'list' && item.items ? (
                  <div className="space-y-2">
                    {item.items.map((listItem, listIndex) => (
                      <div key={`${item.id}-item-${listIndex}`} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 min-w-[20px]">{listIndex + 1}.</span>
                        <Input
                          value={listItem}
                          onChange={(e) => handleUpdateListItem(item.id, listIndex, e.target.value)}
                          className="text-sm py-1 px-2 h-8"
                        />
                        
                        {item.items && item.items.length > 1 && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveListItem(item.id, listIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full mt-2 h-8 text-xs"
                      onClick={() => handleAddListItem(item.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Ajouter un élément
                    </Button>
                  </div>
                ) : (
                  <Input
                    value={item.content}
                    onChange={(e) => handleUpdateItem(item.id, e.target.value)}
                    className={`${
                      item.type === 'h1' ? 'text-lg font-bold' :
                      item.type === 'h2' ? 'text-base font-semibold' :
                      item.type === 'h3' ? 'text-sm font-medium' :
                      item.type === 'h4' ? 'text-xs font-medium' : 'text-sm'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          
          <Button 
            className="w-full mt-4" 
            onClick={handleGenerateStructure}
            disabled={isLoading || structureItems.length === 0}
          >
            {isLoading ? 
              "Génération en cours..." : 
              structureItems.length > 0 ? 
                "Générer le contenu" : 
                "Ajoutez des éléments d'abord"
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentStructureTool;

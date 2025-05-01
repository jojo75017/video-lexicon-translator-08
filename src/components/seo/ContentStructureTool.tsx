
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FileText, List, Copy, ChevronDown, ChevronUp, Plus, Trash2, MoveVertical, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface StructureItem {
  id: string;
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'list';
  content: string;
  items?: string[]; // Pour les listes
}

const ContentStructureTool = () => {
  const [topic, setTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [structure, setStructure] = useState<StructureItem[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Exemples de modèles prédéfinis
  const templates = [
    {
      name: "Article de blog",
      structure: [
        { id: '1', type: 'h1', content: 'Titre principal' },
        { id: '2', type: 'p', content: 'Introduction au sujet' },
        { id: '3', type: 'h2', content: 'Première section' },
        { id: '4', type: 'p', content: 'Contenu de la première section' },
        { id: '5', type: 'h2', content: 'Deuxième section' },
        { id: '6', type: 'p', content: 'Contenu de la deuxième section' },
        { id: '7', type: 'h2', content: 'Conclusion' },
        { id: '8', type: 'p', content: 'Résumé et points clés' }
      ]
    },
    {
      name: "Page Produit",
      structure: [
        { id: '1', type: 'h1', content: 'Nom du produit' },
        { id: '2', type: 'h2', content: 'Caractéristiques principales' },
        { id: '3', type: 'list', content: 'Liste des caractéristiques', items: ['Caractéristique 1', 'Caractéristique 2', 'Caractéristique 3'] },
        { id: '4', type: 'h2', content: 'Avantages' },
        { id: '5', type: 'p', content: 'Description des avantages' },
        { id: '6', type: 'h2', content: 'Avis clients' },
        { id: '7', type: 'p', content: 'Témoignages et notes' },
        { id: '8', type: 'h2', content: 'FAQ' },
        { id: '9', type: 'p', content: 'Questions fréquentes et réponses' }
      ]
    },
    {
      name: "Guide pratique",
      structure: [
        { id: '1', type: 'h1', content: 'Guide complet sur [Sujet]' },
        { id: '2', type: 'p', content: 'Introduction et objectifs du guide' },
        { id: '3', type: 'h2', content: 'Ce que vous allez apprendre' },
        { id: '4', type: 'list', content: 'Objectifs d\'apprentissage', items: ['Objectif 1', 'Objectif 2', 'Objectif 3'] },
        { id: '5', type: 'h2', content: 'Prérequis' },
        { id: '6', type: 'p', content: 'Ce que vous devez savoir avant de commencer' },
        { id: '7', type: 'h2', content: 'Étape 1: Premier pas' },
        { id: '8', type: 'p', content: 'Explication de la première étape' },
        { id: '9', type: 'h2', content: 'Étape 2: Mise en pratique' },
        { id: '10', type: 'p', content: 'Détails de l\'implémentation' },
        { id: '11', type: 'h2', content: 'Étape 3: Perfectionnement' },
        { id: '12', type: 'p', content: 'Conseils avancés' },
        { id: '13', type: 'h2', content: 'Résumé et ressources supplémentaires' },
        { id: '14', type: 'p', content: 'Récapitulatif et liens utiles' }
      ]
    }
  ];

  const generateStructure = () => {
    if (!topic.trim()) {
      toast.error("Veuillez saisir un sujet pour générer une structure");
      return;
    }

    setIsGenerating(true);
    toast.info("Génération de la structure de contenu...");

    // Simuler un délai de génération
    setTimeout(() => {
      // Adapter un template en fonction du sujet
      let newStructure = JSON.parse(JSON.stringify(templates[0].structure));
      
      // Adapter le contenu au sujet
      newStructure[0].content = `Tout savoir sur ${topic}`;
      newStructure[2].content = `Qu'est-ce que ${topic} ?`;
      newStructure[4].content = `Les avantages de ${topic}`;
      newStructure[6].content = `Conclusion sur ${topic}`;
      
      setStructure(newStructure);
      setIsGenerating(false);
      toast.success("Structure de contenu générée avec succès");
    }, 1500);
  };

  const addItem = (index: number, type: StructureItem['type'] = 'p') => {
    const newStructure = [...structure];
    const newId = Date.now().toString();
    let newContent = '';
    
    switch(type) {
      case 'h1': newContent = 'Nouveau titre principal'; break;
      case 'h2': newContent = 'Nouvelle section'; break;
      case 'h3': newContent = 'Nouveau sous-titre'; break;
      case 'h4': newContent = 'Nouveau sous-sous-titre'; break;
      case 'p': newContent = 'Nouveau paragraphe'; break;
      case 'list': newContent = 'Nouvelle liste'; break;
      default: newContent = 'Nouveau contenu';
    }
    
    const newItem: StructureItem = {
      id: newId,
      type,
      content: newContent,
      ...(type === 'list' ? { items: ['Élément 1', 'Élément 2'] } : {})
    };
    
    newStructure.splice(index + 1, 0, newItem);
    setStructure(newStructure);
  };

  const removeItem = (index: number) => {
    if (structure.length <= 1) {
      toast.error("Vous devez conserver au moins un élément dans la structure");
      return;
    }
    
    const newStructure = [...structure];
    newStructure.splice(index, 1);
    setStructure(newStructure);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === structure.length - 1)) {
      return;
    }
    
    const newStructure = [...structure];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    const [movedItem] = newStructure.splice(index, 1);
    newStructure.splice(newIndex, 0, movedItem);
    
    setStructure(newStructure);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newStructure = [...structure];
    newStructure[index] = { ...newStructure[index], [field]: value };
    setStructure(newStructure);
  };

  const updateListItem = (structIndex: number, itemIndex: number, value: string) => {
    const newStructure = [...structure];
    if (newStructure[structIndex].items) {
      const newItems = [...newStructure[structIndex].items!];
      newItems[itemIndex] = value;
      newStructure[structIndex] = { ...newStructure[structIndex], items: newItems };
      setStructure(newStructure);
    }
  };

  const addListItem = (index: number) => {
    const newStructure = [...structure];
    if (newStructure[index].items) {
      newStructure[index] = { 
        ...newStructure[index], 
        items: [...newStructure[index].items!, `Nouvel élément ${newStructure[index].items!.length + 1}`] 
      };
      setStructure(newStructure);
    }
  };

  const removeListItem = (structIndex: number, itemIndex: number) => {
    const newStructure = [...structure];
    if (newStructure[structIndex].items && newStructure[structIndex].items!.length > 1) {
      const newItems = [...newStructure[structIndex].items!];
      newItems.splice(itemIndex, 1);
      newStructure[structIndex] = { ...newStructure[structIndex], items: newItems };
      setStructure(newStructure);
    } else {
      toast("Une liste doit contenir au moins un élément");
    }
  };

  const changeItemType = (index: number, newType: StructureItem['type']) => {
    const newStructure = [...structure];
    
    // Si on change vers une liste ou depuis une liste, ajuster les propriétés
    if (newType === 'list' && newStructure[index].type !== 'list') {
      newStructure[index] = { 
        ...newStructure[index], 
        type: newType, 
        items: ['Premier élément', 'Deuxième élément'] 
      };
    } else if (newType !== 'list' && newStructure[index].type === 'list') {
      const { items, ...rest } = newStructure[index];
      newStructure[index] = { ...rest, type: newType };
    } else {
      newStructure[index] = { ...newStructure[index], type: newType };
    }
    
    setStructure(newStructure);
  };

  const applyTemplate = (template: typeof templates[0]) => {
    setStructure(template.structure.map(item => ({
      ...item,
      content: item.content.replace('[Sujet]', topic || 'votre sujet')
    })));
    
    toast.success(`Template "${template.name}" appliqué avec succès`);
  };

  const generateHTML = () => {
    let html = '';
    
    structure.forEach(item => {
      switch(item.type) {
        case 'h1':
          html += `<h1>${item.content}</h1>\n\n`;
          break;
        case 'h2':
          html += `<h2>${item.content}</h2>\n\n`;
          break;
        case 'h3':
          html += `<h3>${item.content}</h3>\n\n`;
          break;
        case 'h4':
          html += `<h4>${item.content}</h4>\n\n`;
          break;
        case 'p':
          html += `<p>${item.content}</p>\n\n`;
          break;
        case 'list':
          html += '<ul>\n';
          item.items?.forEach(listItem => {
            html += `  <li>${listItem}</li>\n`;
          });
          html += '</ul>\n\n';
          break;
      }
    });
    
    return html;
  };

  const copyHTML = () => {
    const html = generateHTML();
    navigator.clipboard.writeText(html);
    toast.success("Code HTML copié dans le presse-papier");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Structure de contenu SEO
        </CardTitle>
        <CardDescription>
          Générez une structure de contenu optimisée pour le référencement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Sujet principal</Label>
            <div className="flex gap-3">
              <Input
                id="topic"
                placeholder="Ex: marketing digital, yoga pour débutants, investissement immobilier..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={generateStructure} 
                disabled={isGenerating || !topic.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  'Générer'
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Templates prédéfinis</Label>
            <div className="flex flex-wrap gap-2">
              {templates.map((template, index) => (
                <Button 
                  key={index} 
                  variant="outline"
                  size="sm"
                  onClick={() => applyTemplate(template)}
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </div>

          {structure.length > 0 && (
            <>
              <Separator />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Structure de contenu</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? "Masquer l'aperçu" : "Afficher l'aperçu"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyHTML}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copier HTML
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {structure.map((item, index) => (
                    <div key={item.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <select
                            value={item.type}
                            onChange={(e) => changeItemType(index, e.target.value as StructureItem['type'])}
                            className="border rounded px-2 py-1 text-sm"
                          >
                            <option value="h1">H1</option>
                            <option value="h2">H2</option>
                            <option value="h3">H3</option>
                            <option value="h4">H4</option>
                            <option value="p">Paragraphe</option>
                            <option value="list">Liste</option>
                          </select>
                          <span className="text-sm font-medium">
                            {item.type === 'h1' ? 'Titre principal' : 
                             item.type === 'h2' ? 'Sous-titre' : 
                             item.type === 'h3' ? 'Sous-sous-titre' : 
                             item.type === 'h4' ? 'Titre niveau 4' :
                             item.type === 'list' ? 'Liste à puces' : 'Paragraphe'}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => moveItem(index, 'up')} disabled={index === 0}>
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => moveItem(index, 'down')} disabled={index === structure.length - 1}>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      
                      {item.type !== 'list' ? (
                        <Input
                          value={item.content}
                          onChange={(e) => updateItem(index, 'content', e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        <div className="space-y-2">
                          <Input
                            value={item.content}
                            onChange={(e) => updateItem(index, 'content', e.target.value)}
                            className="w-full mb-2"
                            placeholder="Titre de la liste"
                          />
                          <div className="pl-4 space-y-2">
                            {item.items?.map((listItem, itemIndex) => (
                              <div key={itemIndex} className="flex items-center gap-2">
                                <span>•</span>
                                <Input
                                  value={listItem}
                                  onChange={(e) => updateListItem(index, itemIndex, e.target.value)}
                                  className="flex-1"
                                />
                                <Button variant="ghost" size="icon" onClick={() => removeListItem(index, itemIndex)}>
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
                              </div>
                            ))}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => addListItem(index)}
                              className="ml-5"
                            >
                              <Plus className="mr-1 h-3 w-3" /> Ajouter un élément
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-2 flex justify-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => addItem(index)}
                          className="w-full flex items-center justify-center border border-dashed border-gray-300 text-gray-500"
                        >
                          <Plus className="mr-1 h-3 w-3" /> Insérer un élément ici
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {showPreview && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Aperçu du contenu</h3>
                  <div className="border rounded-md p-4 prose max-w-full">
                    {structure.map((item, index) => {
                      switch(item.type) {
                        case 'h1':
                          return <h1 key={index} className="text-2xl font-bold mb-4">{item.content}</h1>;
                        case 'h2':
                          return <h2 key={index} className="text-xl font-bold mb-3">{item.content}</h2>;
                        case 'h3':
                          return <h3 key={index} className="text-lg font-bold mb-2">{item.content}</h3>;
                        case 'h4':
                          return <h4 key={index} className="text-base font-bold mb-2">{item.content}</h4>;
                        case 'p':
                          return <p key={index} className="mb-4">{item.content}</p>;
                        case 'list':
                          return (
                            <div key={index} className="mb-4">
                              <div className="font-medium mb-1">{item.content}</div>
                              <ul className="list-disc pl-5 space-y-1">
                                {item.items?.map((listItem, i) => (
                                  <li key={i}>{listItem}</li>
                                ))}
                              </ul>
                            </div>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
        <span>Création de structure de contenu optimisée SEO</span>
        <span>{structure.length} éléments</span>
      </CardFooter>
    </Card>
  );
};

export default ContentStructureTool;

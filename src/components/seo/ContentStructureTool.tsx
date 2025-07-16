import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash, Copy, ListChecks } from "lucide-react";
import { toast } from "sonner";

interface StructureItem {
  id: string;
  type: "h1" | "h2" | "h3" | "h4" | "p" | "list";
  content: string;
  items?: string[];
}

const ContentStructureTool: React.FC = () => {
  const [items, setItems] = useState<StructureItem[]>([
    { id: "h1-1", type: "h1", content: "Titre Principal de la Page" },
    { id: "p-1", type: "p", content: "Paragraphe introductif expliquant le sujet de la page." },
    { id: "h2-1", type: "h2", content: "Sous-titre Important" },
    { id: "p-2", type: "p", content: "Paragraphe détaillant le sous-titre." },
  ]);
  const [generatedContent, setGeneratedContent] = useState('');

  const addItem = (type: StructureItem["type"]) => {
    const newItem: StructureItem = {
      id: `${type}-${Date.now()}`,
      type: type,
      content: `Nouveau ${type.toUpperCase()}`,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, content: string) => {
    setItems(items.map(item => item.id === id ? { ...item, content } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addListItem = (listId: string) => {
    setItems(
      items.map(item =>
        item.id === listId
          ? { ...item, items: [...(item.items || []), `item-${Date.now()}`] }
          : item
      )
    );
  };

  const updateListItem = (listId: string, itemId: string, content: string) => {
    setItems(
      items.map(item =>
        item.id === listId
          ? {
              ...item,
              items: (item.items || []).map(item =>
                item === itemId ? content : item
              ),
            }
          : item
      )
    );
  };

  const removeListItem = (listId: string, itemId: string) => {
    setItems(
      items.map(item =>
        item.id === listId
          ? {
              ...item,
              items: (item.items || []).filter(item => item !== itemId),
            }
          : item
      )
    );
  };

  const generateContent = () => {
    let content = '';
    items.forEach(item => {
      switch (item.type) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
          content += `<${item.type}>${item.content}</${item.type}>\n`;
          break;
        case 'p':
          content += `<p>${item.content}</p>\n`;
          break;
        case 'list':
          content += '<ul>\n';
          (item.items || []).forEach(listItem => {
            content += `  <li>${listItem}</li>\n`;
          });
          content += '</ul>\n';
          break;
      }
    });
    setGeneratedContent(content);
    toast.success("Contenu généré !");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("Contenu copié dans le presse-papier !");
  };

  const addList = () => {
    const newItem = {
      id: `list-${Date.now()}`,
      type: "list" as const,
      content: "", // Add the required content property
      items: []
    };
    setItems([...items, newItem]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" />
          Outil de Structure de Contenu
        </CardTitle>
        <CardDescription>
          Créez et structurez facilement le contenu de votre page
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border rounded-md p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={`content-${item.id}`} className="text-sm font-medium text-gray-700">
                  {item.type.toUpperCase()}
                </label>
                <div className="space-x-2">
                  {item.type === 'list' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addListItem(item.id)}
                      className="space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Ajouter un item</span>
                    </Button>
                  ) : null}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {item.type === 'list' ? (
                <div className="space-y-2">
                  {(item.items || []).map((listItem, index) => (
                    <div key={listItem} className="flex items-center space-x-2">
                      <Input
                        type="text"
                        placeholder={`Item ${index + 1}`}
                        value={listItem}
                        onChange={(e) => updateListItem(item.id, listItem, e.target.value)}
                        className="flex-1 text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeListItem(item.id, listItem)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {!item.items || item.items.length === 0 ? (
                    <div className="text-sm text-gray-500 italic">Aucun item dans cette liste.</div>
                  ) : null}
                </div>
              ) : (
                <Textarea
                  id={`content-${item.id}`}
                  value={item.content}
                  onChange={(e) => updateItem(item.id, e.target.value)}
                  placeholder={`Contenu du ${item.type.toUpperCase()}`}
                  className="w-full text-sm"
                />
              )}
            </div>
          ))}

          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => addItem('h2')}>Ajouter H2</Button>
            <Button variant="outline" onClick={() => addItem('h3')}>Ajouter H3</Button>
            <Button variant="outline" onClick={() => addItem('p')}>Ajouter Paragraphe</Button>
            <Button variant="outline" onClick={addList}>Ajouter Liste</Button>
          </div>

          <div className="border-t pt-4 mt-6">
            <Button className="w-full" onClick={generateContent}>
              Générer le Contenu
            </Button>
          </div>

          {generatedContent && (
            <div className="relative mt-4">
              <textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                className="w-full p-3 h-48 text-sm font-mono bg-gray-100 border border-gray-300 rounded"
                placeholder="Le contenu généré apparaîtra ici..."
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copier</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentStructureTool;

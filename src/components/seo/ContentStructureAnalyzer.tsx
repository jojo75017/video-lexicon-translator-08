import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, FileText, ListTree, Code2, Wand2 } from "lucide-react";
import { toast } from "sonner";

interface StructureItem {
  id: string;
  type: string;
  content: string;
  items?: string[];
}

const ContentStructureAnalyzer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [items, setItems] = useState<StructureItem[]>([]);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StructureItem | null>(null);

  useEffect(() => {
    if (items.length > 0 && !selectedItem) {
      setSelectedItem(items[0]);
    }
  }, [items, selectedItem]);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast.error("Veuillez entrer une URL");
      return;
    }

    setIsLoading(true);
    toast.info("Analyse de la structure en cours...");

    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simuler la récupération du contenu HTML
      const mockHTMLContent = `
        <h1>Titre Principal</h1>
        <p>Paragraphe d'introduction</p>
        <h2>Sous-titre 1</h2>
        <p>Contenu du sous-titre 1</p>
        <h3>Sous-titre 2</h3>
        <p>Contenu du sous-titre 2</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      `;

      setContent(mockHTMLContent);

      // Simuler l'extraction de la structure
      const mockStructure = [
        { id: 'h1-1', type: 'h1', content: 'Titre Principal' },
        { id: 'p-1', type: 'p', content: 'Paragraphe d\'introduction' },
        { id: 'h2-1', type: 'h2', content: 'Sous-titre 1' },
        { id: 'p-2', type: 'p', content: 'Contenu du sous-titre 1' },
        { id: 'h3-1', type: 'h3', content: 'Sous-titre 2' },
        { id: 'p-3', type: 'p', content: 'Contenu du sous-titre 2' },
        { id: 'list-1', type: 'list', content: '', items: ['Item 1', 'Item 2'] }
      ];

      setItems(mockStructure);
      toast.success("Structure analysée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      toast.error("Erreur lors de l'analyse de la structure");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateContent = () => {
    if (!selectedItem) {
      toast.error("Veuillez sélectionner un élément");
      return;
    }

    setIsLoading(true);
    toast.info("Génération du contenu en cours...");

    setTimeout(() => {
      const generated = `Contenu généré pour ${selectedItem.type} "${selectedItem.content}"`;
      setGeneratedContent(generated);
      setIsLoading(false);
      toast.success("Contenu généré avec succès");
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("Contenu copié dans le presse-papier");
  };

  const addItem = (type: string) => {
    const newItem = {
      id: `${type}-${Date.now()}`,
      type: type,
      content: ''
    };
    setItems([...items, newItem]);
  };

  const addList = () => {
    const newItem = {
      id: `list-${Date.now()}`,
      type: "list",
      content: "",
      items: []
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, newContent: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, content: newContent } : item
    ));
    if (selectedItem?.id === id) {
      setSelectedItem({ ...selectedItem, content: newContent });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListTree className="h-5 w-5 text-blue-600" />
          Analyseur de Structure de Contenu
        </CardTitle>
        <CardDescription>
          Analysez et optimisez la structure de votre contenu pour un meilleur SEO
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="url">URL à analyser</Label>
          <div className="flex space-x-2 mt-2">
            <Input
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button onClick={handleAnalyze} disabled={isLoading}>
              {isLoading ? "Analyse..." : "Analyser"}
            </Button>
          </div>
        </div>

        {content && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Structure du contenu</h3>
              <div className="space-y-2">
                {items.map(item => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-md border ${selectedItem?.id === item.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'} cursor-pointer`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-800">{item.type}: {item.content || 'Nouveau'}</div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => addItem('h2')}>Ajouter H2</Button>
                  <Button variant="outline" size="sm" onClick={() => addItem('p')}>Ajouter Paragraphe</Button>
                  <Button variant="outline" size="sm" onClick={addList}>Ajouter Liste</Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Edition & Génération</h3>
              {selectedItem ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="item-content">Contenu de l'élément</Label>
                    <Textarea
                      id="item-content"
                      value={selectedItem.content}
                      onChange={(e) => updateItem(selectedItem.id, e.target.value)}
                      className="mt-2 w-full"
                      placeholder="Entrez le contenu ici..."
                    />
                  </div>
                  <Button onClick={handleGenerateContent} disabled={isLoading}>
                    {isLoading ? "Génération..." : "Générer Contenu"}
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">Sélectionnez un élément pour éditer</div>
              )}
            </div>
          </div>
        )}

        {generatedContent && (
          <div className="relative mt-4">
            <textarea
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              className="w-full p-3 h-48 text-sm font-mono bg-gray-100 border border-gray-300 rounded"
              placeholder="Le contenu généré apparaîtra ici..."
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copier</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentStructureAnalyzer;

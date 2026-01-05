import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Loader2, Save, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const EbookEditorialMemory = () => {
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [memory, setMemory] = useState<{
    promesseCentrale: string;
    angleEditorial: string;
    tonGlobal: string;
    niveauProfondeur: string;
    lecteurCible: string;
    motsClesStyle: string[];
  } | null>(null);

  const generateMemory = async () => {
    if (!title.trim()) {
      toast.error('Veuillez entrer le titre de votre ebook');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('editorial-memory', {
        body: { title: title.trim() }
      });

      if (error) throw error;

      setMemory(data.memory);
      toast.success('Mémoire éditoriale créée avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération de la mémoire');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToLocalStorage = () => {
    if (memory) {
      localStorage.setItem('editorial_memory', JSON.stringify({ title, ...memory }));
      toast.success('Mémoire sauvegardée localement !');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <span className="text-purple-400 text-sm font-mono">P9</span>
              <h2 className="text-xl">Mémoire Éditoriale du Projet</h2>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <p className="text-sm text-muted-foreground">
              <strong>🧠 Effet :</strong> Crée une référence obligatoire pour tous les contenus. 
              Garantit la cohérence sur tout le livre et élimine les dérives IA.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'ebook</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Maîtriser le Marketing Digital en 2024"
              className="bg-background/50"
            />
          </div>

          <Button 
            onClick={generateMemory} 
            disabled={isGenerating || !title.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création de la mémoire...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Créer la Mémoire Éditoriale
              </>
            )}
          </Button>

          {memory && (
            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Mémoire Éditoriale Générée</span>
              </div>

              <div className="grid gap-4">
                <div className="p-4 bg-background/50 rounded-lg border">
                  <Label className="text-purple-400">Promesse Centrale</Label>
                  <p className="mt-1 text-sm">{memory.promesseCentrale}</p>
                </div>

                <div className="p-4 bg-background/50 rounded-lg border">
                  <Label className="text-purple-400">Angle Éditorial</Label>
                  <p className="mt-1 text-sm">{memory.angleEditorial}</p>
                </div>

                <div className="p-4 bg-background/50 rounded-lg border">
                  <Label className="text-purple-400">Ton Global</Label>
                  <p className="mt-1 text-sm">{memory.tonGlobal}</p>
                </div>

                <div className="p-4 bg-background/50 rounded-lg border">
                  <Label className="text-purple-400">Niveau de Profondeur</Label>
                  <p className="mt-1 text-sm">{memory.niveauProfondeur}</p>
                </div>

                <div className="p-4 bg-background/50 rounded-lg border">
                  <Label className="text-purple-400">Lecteur Cible</Label>
                  <p className="mt-1 text-sm">{memory.lecteurCible}</p>
                </div>

                {memory.motsClesStyle && memory.motsClesStyle.length > 0 && (
                  <div className="p-4 bg-background/50 rounded-lg border">
                    <Label className="text-purple-400">Mots-clés de Style</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {memory.motsClesStyle.map((mot, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-500/20 rounded text-xs">
                          {mot}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={saveToLocalStorage} variant="outline" className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder comme Référence
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookEditorialMemory;

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Eye, Loader2, AlertCircle, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const EbookSelfCritique = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [critique, setCritique] = useState<{
    pointsFaibles: Array<{ element: string; raison: string; gravite: string }>;
    manqueProfondeur: Array<{ section: string; suggestion: string }>;
    simplifications: Array<{ original: string; simplifie: string }>;
    renforcements: Array<{ element: string; amelioration: string }>;
    verdictGlobal: string;
  } | null>(null);

  const analyzeCritique = async () => {
    if (!title.trim()) {
      toast.error('Veuillez entrer le titre de votre ebook');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('self-critique', {
        body: { 
          title: title.trim(),
          content: content.trim() || undefined
        }
      });

      if (error) throw error;

      setCritique(data.critique);
      toast.success('Auto-critique terminée !');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Eye className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <span className="text-purple-400 text-sm font-mono">P11</span>
              <h2 className="text-xl">Auto-Critique Éditoriale IA</h2>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <p className="text-sm text-muted-foreground">
              <strong>🎯 Effet Clé :</strong> L'IA ne se contente plus d'écrire — elle se corrige elle-même. 
              Challenge ce qui est faible, manque de profondeur, ou peut être amélioré.
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

          <div className="space-y-2">
            <Label htmlFor="content">Contenu à critiquer (optionnel)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Collez ici le contenu à analyser, ou laissez vide pour une critique basée sur le titre..."
              className="min-h-[150px] bg-background/50"
            />
          </div>

          <Button 
            onClick={analyzeCritique} 
            disabled={isAnalyzing || !title.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse critique en cours...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Lancer l'Auto-Critique
              </>
            )}
          </Button>

          {critique && (
            <div className="space-y-4 mt-6">
              <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <Label className="text-purple-400">Verdict Global</Label>
                <p className="mt-1 text-sm">{critique.verdictGlobal}</p>
              </div>

              {critique.pointsFaibles && critique.pointsFaibles.length > 0 && (
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                  <Label className="text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Points Faibles Identifiés
                  </Label>
                  <div className="space-y-2 mt-2">
                    {critique.pointsFaibles.map((p, i) => (
                      <div key={i} className="p-3 bg-background/50 rounded border">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">{p.element}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            p.gravite === 'haute' ? 'bg-red-500/30 text-red-300' :
                            p.gravite === 'moyenne' ? 'bg-yellow-500/30 text-yellow-300' :
                            'bg-blue-500/30 text-blue-300'
                          }`}>{p.gravite}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{p.raison}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {critique.manqueProfondeur && critique.manqueProfondeur.length > 0 && (
                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <Label className="text-yellow-400">Manque de Profondeur</Label>
                  <div className="space-y-2 mt-2">
                    {critique.manqueProfondeur.map((m, i) => (
                      <div key={i} className="p-3 bg-background/50 rounded border">
                        <span className="font-medium text-sm">{m.section}</span>
                        <p className="text-xs text-green-300 mt-1">→ {m.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {critique.simplifications && critique.simplifications.length > 0 && (
                <div className="p-4 bg-background/50 rounded-lg border">
                  <Label className="text-purple-400">Simplifications Suggérées</Label>
                  <div className="space-y-2 mt-2">
                    {critique.simplifications.map((s, i) => (
                      <div key={i} className="p-3 bg-background/30 rounded border">
                        <p className="text-xs text-red-300 line-through">{s.original}</p>
                        <p className="text-xs text-green-300 mt-1">→ {s.simplifie}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {critique.renforcements && critique.renforcements.length > 0 && (
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <Label className="text-green-400 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Renforcements Proposés
                  </Label>
                  <div className="space-y-2 mt-2">
                    {critique.renforcements.map((r, i) => (
                      <div key={i} className="p-3 bg-background/50 rounded border">
                        <span className="font-medium text-sm">{r.element}</span>
                        <p className="text-xs text-green-300 mt-1">→ {r.amelioration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookSelfCritique;

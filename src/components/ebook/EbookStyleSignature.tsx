import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Fingerprint, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const EbookStyleSignature = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isUnifying, setIsUnifying] = useState(false);
  const [result, setResult] = useState<{
    contenuUnifie: string;
    signatureStylistique: {
      ton: string;
      rythme: string;
      vocabulaire: string;
      structures: string;
    };
    correctionsAppliquees: string[];
    identiteEditoriale: string;
  } | null>(null);

  const unifyStyle = async () => {
    if (!title.trim()) {
      toast.error('Veuillez entrer le titre de votre ebook');
      return;
    }

    setIsUnifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('style-signature', {
        body: { 
          title: title.trim(),
          content: content.trim() || undefined
        }
      });

      if (error) throw error;

      setResult(data.result);
      toast.success('Signature stylistique appliquée !');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'uniformisation');
    } finally {
      setIsUnifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Fingerprint className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <span className="text-purple-400 text-sm font-mono">P13</span>
              <h2 className="text-xl">Signature Stylistique Unique</h2>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <p className="text-sm text-muted-foreground">
              <strong>✍️ Effet :</strong> Identité éditoriale forte. Le texte devient reconnaissable 
              comme provenant d'un même auteur. Différenciation maximale.
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
            <Label htmlFor="content">Contenu à uniformiser (optionnel)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Collez le contenu dont vous voulez unifier le style..."
              className="min-h-[150px] bg-background/50"
            />
          </div>

          <Button 
            onClick={unifyStyle} 
            disabled={isUnifying || !title.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isUnifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uniformisation en cours...
              </>
            ) : (
              <>
                <Fingerprint className="mr-2 h-4 w-4" />
                Appliquer la Signature Stylistique
              </>
            )}
          </Button>

          {result && (
            <div className="space-y-4 mt-6">
              <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <Label className="text-purple-400">Identité Éditoriale</Label>
                <p className="mt-1 text-sm">{result.identiteEditoriale}</p>
              </div>

              {result.signatureStylistique && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-background/50 rounded-lg border">
                    <Label className="text-xs text-purple-400">Ton</Label>
                    <p className="text-sm mt-1">{result.signatureStylistique.ton}</p>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg border">
                    <Label className="text-xs text-purple-400">Rythme</Label>
                    <p className="text-sm mt-1">{result.signatureStylistique.rythme}</p>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg border">
                    <Label className="text-xs text-purple-400">Vocabulaire</Label>
                    <p className="text-sm mt-1">{result.signatureStylistique.vocabulaire}</p>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg border">
                    <Label className="text-xs text-purple-400">Structures</Label>
                    <p className="text-sm mt-1">{result.signatureStylistique.structures}</p>
                  </div>
                </div>
              )}

              {result.correctionsAppliquees && result.correctionsAppliquees.length > 0 && (
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <Label className="text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Corrections Appliquées
                  </Label>
                  <ul className="mt-2 space-y-1">
                    {result.correctionsAppliquees.map((c, i) => (
                      <li key={i} className="text-xs flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 bg-background/50 rounded-lg border">
                <Label className="text-purple-400">Contenu Unifié</Label>
                <div className="mt-2 p-3 bg-background/30 rounded text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                  {result.contenuUnifie}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookStyleSignature;

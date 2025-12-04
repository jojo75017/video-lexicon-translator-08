import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Users, Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOpenAIConfig } from "@/hooks/useOpenAIConfig";

export interface Character {
  id: string;
  name: string;
  description: string;
  referenceImageUrl?: string;
}

interface EbookCharactersProps {
  characters: Character[];
  onUpdateCharacters: (characters: Character[]) => void;
}

export const EbookCharacters = ({ characters, onUpdateCharacters }: EbookCharactersProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const { hasValidApiKey, getConfig } = useOpenAIConfig();

  const addCharacter = () => {
    const newCharacter: Character = {
      id: crypto.randomUUID(),
      name: "",
      description: ""
    };
    onUpdateCharacters([...characters, newCharacter]);
    setEditingId(newCharacter.id);
  };

  const updateCharacter = (id: string, field: keyof Character, value: string) => {
    onUpdateCharacters(
      characters.map(char => 
        char.id === id ? { ...char, [field]: value } : char
      )
    );
  };

  const deleteCharacter = (id: string) => {
    onUpdateCharacters(characters.filter(char => char.id !== id));
  };

  const generateReferenceImage = async (character: Character) => {
    if (!character.name || !character.description) {
      toast.error('Remplissez le nom et la description du personnage');
      return;
    }

    setGeneratingId(character.id);
    
    try {
      const config = getConfig();
      const useOpenAI = hasValidApiKey();

      const { data, error } = await supabase.functions.invoke('generate-character-reference', {
        body: {
          characterName: character.name,
          characterDescription: character.description,
          useOpenAI,
          openaiApiKey: useOpenAI ? config.apiKey : undefined
        }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        updateCharacter(character.id, 'referenceImageUrl', data.imageUrl);
        toast.success(`Image de référence générée pour ${character.name}`);
      } else {
        throw new Error('Aucune image générée');
      }
    } catch (error: any) {
      console.error('Error generating reference image:', error);
      toast.error('Erreur lors de la génération', {
        description: error.message || 'Vérifiez vos crédits ou votre clé API'
      });
    } finally {
      setGeneratingId(null);
    }
  };

  const removeReferenceImage = (id: string) => {
    updateCharacter(id, 'referenceImageUrl', '');
    toast.success('Image de référence supprimée');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Personnages principaux</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Définissez l'apparence de vos personnages et générez une image de référence pour maintenir la cohérence visuelle dans toutes les images.
      </p>

      <div className="space-y-4">
        {characters.map((character) => (
          <div key={character.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <Label htmlFor={`name-${character.id}`}>Nom du personnage</Label>
                <Input
                  id={`name-${character.id}`}
                  value={character.name}
                  onChange={(e) => updateCharacter(character.id, 'name', e.target.value)}
                  placeholder="ex: Sarah, le héros, la protagoniste..."
                  className="mt-1"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteCharacter(character.id)}
                className="mt-6"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div>
              <Label htmlFor={`desc-${character.id}`}>Description physique détaillée</Label>
              <Textarea
                id={`desc-${character.id}`}
                value={character.description}
                onChange={(e) => updateCharacter(character.id, 'description', e.target.value)}
                placeholder="ex: Femme de 30 ans, cheveux bruns mi-longs, yeux verts, style vestimentaire moderne et élégant, sourire chaleureux..."
                className="mt-1 min-h-[100px]"
              />
            </div>

            {/* Image de référence */}
            <div className="border-t pt-3">
              <Label className="flex items-center gap-2 mb-2">
                <ImageIcon className="h-4 w-4" />
                Image de référence
              </Label>
              
              {character.referenceImageUrl ? (
                <div className="flex gap-3 items-start">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-primary/30">
                    <img 
                      src={character.referenceImageUrl} 
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-muted-foreground">
                      Cette image sera utilisée comme référence pour maintenir la cohérence du personnage dans toutes les illustrations.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateReferenceImage(character)}
                        disabled={generatingId === character.id}
                      >
                        {generatingId === character.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-1" />
                        )}
                        Régénérer
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeReferenceImage(character.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => generateReferenceImage(character)}
                  disabled={generatingId === character.id || !character.name || !character.description}
                  className="w-full"
                >
                  {generatingId === character.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Générer une image de référence
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        ))}

        <Button
          onClick={addCharacter}
          variant="outline"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un personnage
        </Button>
      </div>
    </Card>
  );
};

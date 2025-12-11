import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Users, Sparkles, Loader2, Image as ImageIcon, Wand2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOpenAIConfig } from "@/hooks/useOpenAIConfig";

export interface Character {
  id: string;
  name: string;
  description: string;
  role?: string;
  referenceImageUrl?: string;
}

interface Chapter {
  id: string;
  title: string;
  content?: string;
  subChapters?: { id: string; title: string; content?: string }[];
}

interface EbookCharactersProps {
  characters: Character[];
  onUpdateCharacters: (characters: Character[]) => void;
  ebookTitle?: string;
  chapters?: Chapter[];
}

const CHARACTER_ROLES = [
  { value: 'protagonist', label: '🦸 Protagoniste' },
  { value: 'antagonist', label: '🦹 Antagoniste' },
  { value: 'secondary', label: '👥 Personnage secondaire' },
  { value: 'mentor', label: '🧙 Mentor / Guide' },
  { value: 'ally', label: '🤝 Allié' },
  { value: 'love_interest', label: '💕 Intérêt amoureux' },
  { value: 'comic_relief', label: '😄 Comic relief' },
  { value: 'narrator', label: '📖 Narrateur' },
  { value: 'other', label: '✨ Autre' },
];

export const EbookCharacters = ({ characters, onUpdateCharacters, ebookTitle = '', chapters = [] }: EbookCharactersProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const { hasValidApiKey, getConfig } = useOpenAIConfig();

  const addCharacter = () => {
    const newCharacter: Character = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      role: "secondary"
    };
    onUpdateCharacters([...characters, newCharacter]);
    setEditingId(newCharacter.id);
  };

  const generateCharactersFromContent = async () => {
    console.log('Generate characters called with title:', ebookTitle, 'chapters:', chapters.length);
    
    if (!ebookTitle || !ebookTitle.trim()) {
      toast.error(`Ajoutez un titre à votre ebook pour générer les personnages (reçu: "${ebookTitle}")`);
      return;
    }

    const content = chapters.map(ch => {
      let text = `Chapitre: ${ch.title}\n${ch.content || ''}`;
      if (ch.subChapters) {
        text += ch.subChapters.map(sub => `\n${sub.title}: ${sub.content || ''}`).join('');
      }
      return text;
    }).join('\n\n');

    setIsGeneratingAll(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'characters',
          ebookTitle,
          content: content.slice(0, 15000), // Limit content size
        }
      });

      if (error) throw error;

      if (data?.characters && Array.isArray(data.characters)) {
        const newCharacters: Character[] = data.characters.map((char: any) => ({
          id: crypto.randomUUID(),
          name: char.name || 'Sans nom',
          description: char.description || '',
          role: char.role || 'secondary',
        }));

        onUpdateCharacters([...characters, ...newCharacters]);
        toast.success(`${newCharacters.length} personnage(s) généré(s) !`);
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (error: any) {
      console.error('Error generating characters:', error);
      toast.error('Erreur lors de la génération', {
        description: error.message || 'Vérifiez votre connexion'
      });
    } finally {
      setIsGeneratingAll(false);
    }
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Personnages ({characters.length})</h3>
        </div>
        <Button
          onClick={generateCharactersFromContent}
          disabled={isGeneratingAll}
          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90"
        >
          {isGeneratingAll ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Générer avec l'IA
            </>
          )}
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        L'IA analyse votre contenu et extrait automatiquement les personnages avec leurs rôles. Vous pouvez aussi les ajouter manuellement.
      </p>

      <div className="space-y-4">
        {characters.map((character) => (
          <div key={character.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`name-${character.id}`}>Nom du personnage</Label>
                  <Input
                    id={`name-${character.id}`}
                    value={character.name}
                    onChange={(e) => updateCharacter(character.id, 'name', e.target.value)}
                    placeholder="ex: Sarah, le héros..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`role-${character.id}`}>Rôle / Fonction</Label>
                  <Select 
                    value={character.role || 'secondary'} 
                    onValueChange={(value) => updateCharacter(character.id, 'role', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {CHARACTER_ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
              <Label htmlFor={`desc-${character.id}`}>Description / Biographie</Label>
              <Textarea
                id={`desc-${character.id}`}
                value={character.description}
                onChange={(e) => updateCharacter(character.id, 'description', e.target.value)}
                placeholder="ex: Femme de 30 ans, cheveux bruns, détective privée passionnée par la vérité..."
                className="mt-1 min-h-[80px]"
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

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";

export interface Character {
  id: string;
  name: string;
  description: string;
}

interface EbookCharactersProps {
  characters: Character[];
  onUpdateCharacters: (characters: Character[]) => void;
}

export const EbookCharacters = ({ characters, onUpdateCharacters }: EbookCharactersProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addCharacter = () => {
    const newCharacter: Character = {
      id: crypto.randomUUID(),
      name: "",
      description: ""
    };
    onUpdateCharacters([...characters, newCharacter]);
    setEditingId(newCharacter.id);
  };

  const updateCharacter = (id: string, field: 'name' | 'description', value: string) => {
    onUpdateCharacters(
      characters.map(char => 
        char.id === id ? { ...char, [field]: value } : char
      )
    );
  };

  const deleteCharacter = (id: string) => {
    onUpdateCharacters(characters.filter(char => char.id !== id));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Personnages principaux</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Définissez l'apparence de vos personnages pour maintenir la cohérence visuelle dans toutes les images générées.
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

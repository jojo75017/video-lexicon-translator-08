
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FacebookStepProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  onSubmit: () => void;
}

const FacebookStep = ({
  title,
  setTitle,
  description,
  setDescription,
  tone,
  setTone,
  onSubmit,
}: FacebookStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fb-title">Titre du post</Label>
        <Input
          id="fb-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Nouveau post Facebook"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fb-description">Description du post</Label>
        <Textarea
          id="fb-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Description détaillée de votre post Facebook"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fb-tone">Tone of voice</Label>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez le ton" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="excited">Enthousiaste</SelectItem>
            <SelectItem value="professional">Professionnel</SelectItem>
            <SelectItem value="friendly">Amical</SelectItem>
            <SelectItem value="casual">Décontracté</SelectItem>
            <SelectItem value="formal">Formel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={onSubmit}
        className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white"
      >
        Générer le post Facebook
      </Button>
    </div>
  );
};

export default FacebookStep;

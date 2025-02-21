
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LinkedInStepProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  onSubmit: () => void;
}

const LinkedInStep = ({
  title,
  setTitle,
  description,
  setDescription,
  tone,
  setTone,
  onSubmit,
}: LinkedInStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="linkedin-title">Titre du post</Label>
        <Input
          id="linkedin-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Post LinkedIn du Rédacteur d'IA"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin-description">Description du post</Label>
        <Textarea
          id="linkedin-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Comment j'ai utilisé le Rédacteur d'IA pour gagner du temps"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin-tone">Tone of voice</Label>
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
        className="w-full bg-[#0077b5] hover:bg-[#006396] text-white"
      >
        Générer le post LinkedIn
      </Button>
    </div>
  );
};

export default LinkedInStep;

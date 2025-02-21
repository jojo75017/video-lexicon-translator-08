
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InstagramStepProps {
  postTitle: string;
  setPostTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  onSubmit: () => void;
}

const InstagramStep = ({
  postTitle,
  setPostTitle,
  description,
  setDescription,
  tone,
  setTone,
  onSubmit,
}: InstagramStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="ig-title">Titre du post</Label>
        <Input
          id="ig-title"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          placeholder="Ex: Post Instagram pour l'anniversaire de John"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ig-description">Description du post</Label>
        <Textarea
          id="ig-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Joyeux 40e anniversaire John ! Randonnée entre amis pour son anniversaire."
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ig-tone">Tone of voice</Label>
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
        className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white"
      >
        Générer le post Instagram
      </Button>
    </div>
  );
};

export default InstagramStep;

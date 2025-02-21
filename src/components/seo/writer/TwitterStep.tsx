
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TwitterStepProps {
  subject: string;
  setSubject: (value: string) => void;
  count: number;
  setCount: (value: number) => void;
  tone: string;
  setTone: (value: string) => void;
  onSubmit: () => void;
}

const TwitterStep = ({
  subject,
  setSubject,
  count,
  setCount,
  tone,
  setTone,
  onSubmit,
}: TwitterStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="tweet-subject">Sujet du tweet</Label>
        <Input
          id="tweet-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ex: Fil de conseils sur le marketing SEO"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tweet-count">Nombre de tweets dans le fil</Label>
        <Input
          id="tweet-count"
          type="number"
          min={1}
          max={10}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tweet-tone">Tone of voice</Label>
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
        className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
      >
        Générer le fil Twitter
      </Button>
    </div>
  );
};

export default TwitterStep;

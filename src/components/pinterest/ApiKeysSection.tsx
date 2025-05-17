
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ApiKeysSectionProps {
  instagramApiKey: string;
  setInstagramApiKey: (key: string) => void;
  handleSaveInstagramApiKey: () => void;
}

const ApiKeysSection: React.FC<ApiKeysSectionProps> = ({
  instagramApiKey,
  setInstagramApiKey,
  handleSaveInstagramApiKey
}) => {
  const [openAIKey, setOpenAIKey] = useState(localStorage.getItem('openAIKey') || '');

  const handleSaveOpenAIKey = () => {
    localStorage.setItem('openAIKey', openAIKey);
    toast.success('Clé OpenAI sauvegardée');
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
      <Label htmlFor="openai-key">Clé API OpenAI</Label>
      <div className="flex gap-2 mt-2">
        <Input
          id="openai-key"
          type="password"
          value={openAIKey}
          onChange={(e) => setOpenAIKey(e.target.value)}
          placeholder="sk-..."
        />
        <Button onClick={handleSaveOpenAIKey}>Sauvegarder</Button>
      </div>
    </div>
  );
};

export default ApiKeysSection;

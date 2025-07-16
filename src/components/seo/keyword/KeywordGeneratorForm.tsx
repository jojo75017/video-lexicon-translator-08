
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, Loader2 } from 'lucide-react';

interface KeywordGeneratorFormProps {
  keyword: string;
  setKeyword: (value: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

const KeywordGeneratorForm: React.FC<KeywordGeneratorFormProps> = ({
  keyword,
  setKeyword,
  isGenerating,
  onGenerate
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-green-600" />
        Générateur de mots-clés
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Entrez un mot-clé principal..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={isGenerating}
              className="w-full"
            />
          </div>
          <Button 
            type="submit"
            disabled={isGenerating || !keyword.trim()}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Générer
              </>
            )}
          </Button>
        </div>
      </form>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Entrez un mot-clé pour générer des suggestions pertinentes pour votre contenu SEO.</p>
      </div>
    </Card>
  );
};

export default KeywordGeneratorForm;

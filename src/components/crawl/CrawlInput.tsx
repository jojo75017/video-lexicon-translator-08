
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CrawlInputProps {
  url: string;
  isLoading: boolean;
  progress: number;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CrawlInput = ({ url, isLoading, progress, onUrlChange, onSubmit }: CrawlInputProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("CrawlInput submit with URL:", url);
    
    if (!url) {
      toast.error("Veuillez saisir une URL");
      return;
    }
    
    // Appel direct de la fonction de soumission sans l'événement
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="url" className="block text-sm font-medium mb-1">
          URL du site
        </label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={onUrlChange}
          className="w-full"
          placeholder="https://exemple.com"
          required
        />
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500 text-center">
            Analyse en cours... {progress}%
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading || !url}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyse en cours...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Analyser le site
          </>
        )}
      </Button>
    </form>
  );
};

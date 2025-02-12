
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CrawlInputProps {
  url: string;
  isLoading: boolean;
  progress: number;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CrawlInput = ({ url, isLoading, progress, onUrlChange, onSubmit }: CrawlInputProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Analyse en cours..." : "Analyser le site"}
      </Button>
    </form>
  );
};


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

interface CrawlInputProps {
  url: string;
  isLoading: boolean;
  progress: number;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CrawlInput = ({ url, isLoading, progress, onUrlChange, onSubmit }: CrawlInputProps) => {
  // Handle the form submission properly
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    console.log("CrawlInput form submit with URL:", url);
    
    if (!url) {
      toast.error("Veuillez saisir une URL");
      return;
    }
    
    // Call the parent component's onSubmit function
    onSubmit(e);
  };

  // Handle button click separately
  const handleButtonClick = () => {
    console.log("Crawl button clicked with URL:", url);
    
    if (!url) {
      toast.error("Veuillez saisir une URL");
      return;
    }
    
    // Manually trigger form submission
    const formEvent = new Event("submit") as unknown as React.FormEvent;
    onSubmit(formEvent);
  };

  // Debug props received
  useEffect(() => {
    console.log("CrawlInput props:", { url, isLoading, progress, onSubmit: !!onSubmit });
  }, [url, isLoading, progress, onSubmit]);

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
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
        type="button" // Changed from submit to button
        disabled={isLoading || !url}
        className="w-full"
        onClick={handleButtonClick} // Add explicit click handler
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

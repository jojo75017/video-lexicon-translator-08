
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Copy } from "lucide-react";
import { toast } from "sonner";

interface UrlShortenerProps {
  longUrl: string;
}

const UrlShortener = ({ longUrl }: UrlShortenerProps) => {
  const [shortUrl, setShortUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Debug props
  useEffect(() => {
    console.log("UrlShortener props:", { longUrl });
  }, [longUrl]);

  const shortenUrl = async () => {
    console.log("Shortening URL button clicked:", longUrl);
    
    if (!longUrl) {
      toast.error("Veuillez d'abord entrer une URL à analyser");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Fetching shortened URL from tinyurl");
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
      console.log("Fetch response status:", response.status);
      
      if (!response.ok) {
        throw new Error('Erreur lors du raccourcissement de l\'URL');
      }
      
      const shortened = await response.text();
      console.log("Shortened URL received:", shortened);
      setShortUrl(shortened);
      toast.success("URL raccourcie avec succès !");
    } catch (error) {
      console.error('Erreur lors du raccourcissement:', error);
      toast.error("Impossible de raccourcir l'URL");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    console.log("Copy button clicked for URL:", shortUrl);
    
    if (!shortUrl) {
      toast.error("Aucune URL à copier");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("URL copiée dans le presse-papier !");
    } catch (err) {
      console.error("Copy error:", err);
      toast.error("Impossible de copier l'URL");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={shortUrl}
          placeholder="URL raccourcie"
          readOnly
          className="bg-gray-50"
        />
        <Button
          onClick={shortenUrl}
          disabled={isLoading || !longUrl}
          className="min-w-[120px]"
          type="button"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Raccourcir...
            </>
          ) : (
            "Raccourcir"
          )}
        </Button>
        {shortUrl && (
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="icon"
            className="px-3"
            type="button"
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;

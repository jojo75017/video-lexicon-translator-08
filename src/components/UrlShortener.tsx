import React, { useState } from 'react';
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

  const shortenUrl = async () => {
    if (!longUrl) {
      toast.error("Veuillez d'abord entrer une URL à analyser");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
      if (!response.ok) throw new Error('Erreur lors du raccourcissement de l\'URL');
      
      const shortened = await response.text();
      setShortUrl(shortened);
      toast.success("URL raccourcie avec succès !");
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Impossible de raccourcir l'URL");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("URL copiée dans le presse-papier !");
    } catch (err) {
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
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;
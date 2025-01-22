import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const UrlInput = ({ url, setUrl, onAnalyze, isLoading }: UrlInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="url">URL du site</Label>
      <div className="flex gap-2">
        <Input
          id="url"
          placeholder="https://exemple.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
        />
        <Button 
          onClick={onAnalyze}
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse...
            </>
          ) : (
            "Analyser"
          )}
        </Button>
      </div>
    </div>
  );
};

export default UrlInput;
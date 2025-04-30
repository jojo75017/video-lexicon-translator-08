
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound, Loader2, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OpenAIService } from '@/utils/seo/openaiService';

interface OpenAIKeyFormProps {
  apiKey: string;
  onSave: (key: string) => void;
  isLoading: boolean;
  isValid: boolean;
}

const OpenAIKeyForm: React.FC<OpenAIKeyFormProps> = ({ 
  apiKey, 
  onSave, 
  isLoading, 
  isValid 
}) => {
  const [localKey, setLocalKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [hasBeenValidated, setHasBeenValidated] = useState(false);

  useEffect(() => {
    // Update local key when prop changes
    if (apiKey !== localKey) {
      setLocalKey(apiKey);
    }
    
    // Check if key exists and mark as validated
    if (apiKey && isValid) {
      setHasBeenValidated(true);
    }
  }, [apiKey, isValid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localKey) {
      setHasBeenValidated(true);
      onSave(localKey);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="api-key" className="text-sm font-medium text-gray-700 mr-2 flex items-center">
            OpenAI API Key
            {isValid && hasBeenValidated && <Check className="ml-2 h-4 w-4 text-green-500" />}
          </label>
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
          >
            Get API Key <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
        
        <div className="flex gap-2">
          <Input
            id="api-key"
            type={showKey ? "text" : "password"}
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            placeholder="sk-..."
            className={`flex-1 ${hasBeenValidated && (isValid ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500')}`}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? "Hide" : "Show"}
          </Button>
        </div>
        
        <p className="text-xs text-gray-500">
          Your API key is stored locally in your browser and is never transmitted to our servers.
        </p>
      </div>
      
      {hasBeenValidated && !isValid && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The API key could not be validated. Please check that it is correct.
          </AlertDescription>
        </Alert>
      )}
      
      {hasBeenValidated && isValid && (
        <Alert variant="default" className="py-2 bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertDescription>
            API key validated successfully.
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        type="submit" 
        disabled={isLoading || !localKey}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Validating...
          </>
        ) : (
          <>
            <KeyRound className="mr-2 h-4 w-4" />
            Save API Key
          </>
        )}
      </Button>
    </form>
  );
};

export default OpenAIKeyForm;

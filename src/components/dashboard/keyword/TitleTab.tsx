
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TitleTabProps {
  title: string;
  setTitle: (title: string) => void;
  maxTitleLength: number;
  keyword: string;
}

const TitleTab = ({ title, setTitle, maxTitleLength, keyword }: TitleTabProps) => {
  return (
    <div className="space-y-4 pt-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium">Title Tag</label>
          <span className={`text-xs ${
            title.length > maxTitleLength ? 'text-red-500' : 
            title.length > maxTitleLength - 10 ? 'text-amber-500' : 'text-gray-500'
          }`}>
            {title.length}/{maxTitleLength}
          </span>
        </div>
        <Textarea 
          placeholder="Title tag de votre page. Idéalement entre 50 et 60 caractères."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`font-medium ${
            title.length > maxTitleLength ? 'border-red-300 focus:ring-red-500' : ''
          }`}
          rows={2}
        />
        {title.length > maxTitleLength && (
          <p className="text-xs text-red-500 mt-1">
            Le titre dépasse la limite recommandée de {maxTitleLength} caractères.
          </p>
        )}
      </div>
      
      {!keyword.trim() && !title && (
        <Alert className="bg-blue-50 border-blue-100">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Entrez un mot-clé et cliquez sur "Générer" pour obtenir des suggestions de titres optimisés.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TitleTab;

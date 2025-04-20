
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, AlignLeft } from 'lucide-react';

const KeywordTabContent = () => {
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Optimisation des mots-clés</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="title" className="text-sm font-medium leading-none flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Balise Title
            </label>
            <Badge variant={title.length > 60 ? "destructive" : "secondary"}>
              {title.length}/60
            </Badge>
          </div>
          <Input
            id="title"
            placeholder="Entrez votre titre (max 60 caractères)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={title.length > 60 ? "border-red-500" : ""}
          />
          {title.length > 60 && (
            <p className="text-xs text-red-500">Le titre dépasse la limite de 60 caractères</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="metaDescription" className="text-sm font-medium leading-none flex items-center gap-2">
              <AlignLeft className="h-4 w-4" />
              Meta Description
            </label>
            <Badge variant={metaDescription.length > 155 ? "destructive" : "secondary"}>
              {metaDescription.length}/155
            </Badge>
          </div>
          <Textarea
            id="metaDescription"
            placeholder="Entrez votre meta description (max 155 caractères)"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className={metaDescription.length > 155 ? "border-red-500" : ""}
            rows={4}
          />
          {metaDescription.length > 155 && (
            <p className="text-xs text-red-500">La description dépasse la limite de 155 caractères</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordTabContent;

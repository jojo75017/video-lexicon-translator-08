
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface KeywordTabsContentProps {
  activeTab: string;
  keywords: KeywordSuggestion[];
}

const KeywordTabsContent: React.FC<KeywordTabsContentProps> = ({ activeTab, keywords }) => {
  return (
    <div className="space-y-4">
      <TabsContent value="results">
        <Card>
          <CardHeader>
            <CardTitle>Résultats des mots-clés</CardTitle>
          </CardHeader>
          <CardContent>
            {keywords.length > 0 ? (
              <div className="grid gap-4">
                {keywords.map((keyword, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-medium">{keyword.keyword}</h3>
                    <p className="text-sm text-gray-600">Volume: {keyword.volume}</p>
                    <p className="text-sm text-gray-600">Difficulté: {keyword.difficulty}</p>
                    <p className="text-sm text-gray-600">CPC: {keyword.cpc}€</p>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Aucun mot-clé généré pour le moment.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default KeywordTabsContent;

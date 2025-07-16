
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const KeywordTabContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse des mots-clés</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Utilisez le générateur de mots-clés pour analyser et optimiser vos mots-clés.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default KeywordTabContent;

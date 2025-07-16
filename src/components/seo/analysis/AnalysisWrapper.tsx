
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface AnalysisWrapperProps {
  children: React.ReactNode;
  title?: string;
}

const AnalysisWrapper: React.FC<AnalysisWrapperProps> = ({ children, title = "Analyse" }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Analysez un site web pour obtenir des résultats détaillés.
          </AlertDescription>
        </Alert>
        {children}
      </CardContent>
    </Card>
  );
};

export default AnalysisWrapper;

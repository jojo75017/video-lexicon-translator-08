
import React from 'react';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, FileText } from "lucide-react";

const HierarchyTabContent = () => {
  // Données simulées pour éviter les erreurs
  const mockStructure = {
    title: "Page d'exemple",
    h1: ["Titre principal"],
    h2: ["Section 1", "Section 2"],
    h3: ["Sous-section 1", "Sous-section 2"],
    images: 5,
    links: 10
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold">Hiérarchie du contenu</h2>
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Analysez un site web pour voir sa structure hiérarchique.
        </AlertDescription>
      </Alert>

      <Card className="p-4">
        <h3 className="font-semibold mb-3">Structure détectée:</h3>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Titre:</span> {mockStructure.title}
          </div>
          <div>
            <span className="font-medium">H1:</span> {mockStructure.h1.length} trouvés
          </div>
          <div>
            <span className="font-medium">H2:</span> {mockStructure.h2.length} trouvés
          </div>
          <div>
            <span className="font-medium">H3:</span> {mockStructure.h3.length} trouvés
          </div>
          <div>
            <span className="font-medium">Images:</span> {mockStructure.images}
          </div>
          <div>
            <span className="font-medium">Liens:</span> {mockStructure.links}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HierarchyTabContent;


import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const IntegrationsSection = () => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button
          variant="outline"
          className="p-6 h-auto flex flex-col items-center gap-4 text-center"
          onClick={() => window.open('https://search.google.com/search-console', '_blank')}
        >
          <AlertCircle className="h-8 w-8" />
          <div>
            <h3 className="font-semibold mb-2">Google Search Console</h3>
            <p className="text-sm text-gray-600">Connectez-vous pour voir les données en temps réel</p>
          </div>
        </Button>
      </div>
    </Card>
  );
};

export default IntegrationsSection;

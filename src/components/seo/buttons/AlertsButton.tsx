
import React from 'react';
import { Button } from "@/components/ui/button";
import { BellRing } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getAlerts } from '@/utils/seo/alertUtils';
import { toast } from 'sonner';

export const AlertsButton = () => {
  const handleOpenDialog = () => {
    console.log("Opening alerts dialog");
    toast.info("Affichage des alertes SEO critiques");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-red-50"
          onClick={handleOpenDialog}
        >
          <BellRing className="h-6 w-6 text-red-600" />
          <span className="text-xs">Alertes critiques</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Alertes SEO Critiques</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto">
          {getAlerts().map((alert, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${
                alert.severity === 'high' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <p className={`text-sm font-medium ${
                  alert.severity === 'high' ? 'text-red-700' : 'text-yellow-700'
                }`}>
                  {alert.message}
                </p>
                <span className="text-xs text-gray-500">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

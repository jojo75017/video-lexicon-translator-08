
import React from 'react';
import { Button } from "@/components/ui/button";
import { BellRing } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getAlerts } from '@/utils/seo/alertUtils';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export const AlertsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Debug dialog state
  useEffect(() => {
    console.log("AlertsButton dialog state:", { isOpen });
  }, [isOpen]);
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Alerts button clicked manually");
    toast.info("Affichage des alertes SEO critiques");
    setIsOpen(true);
  };
  
  const handleOpenDialog = () => {
    console.log("Opening alerts dialog");
    toast.info("Affichage des alertes SEO critiques");
    setIsOpen(true);
  };
  
  const handleCloseDialog = () => {
    console.log("Closing alerts dialog");
    setIsOpen(false);
  };

  const alerts = getAlerts();
  console.log("Alerts data:", alerts);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-red-50"
          onClick={handleButtonClick}
          type="button"
        >
          <BellRing className="h-6 w-6 text-red-600" />
          <span className="text-xs">Alertes critiques</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" onInteractOutside={handleCloseDialog}>
        <DialogHeader>
          <DialogTitle>Alertes SEO Critiques</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto">
          {alerts.map((alert, index) => (
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

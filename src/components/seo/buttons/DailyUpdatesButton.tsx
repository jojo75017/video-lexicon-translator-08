
import React from 'react';
import { Button } from "@/components/ui/button";
import { Rocket } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getDailyUpdates } from '@/utils/seo/updateUtils';

export const DailyUpdatesButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-green-50"
        >
          <Rocket className="h-6 w-6 text-green-600" />
          <span className="text-xs">Mises à jour quotidiennes</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mises à jour quotidiennes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {getDailyUpdates().map((update, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${
                update.type === 'success' ? 'bg-green-50 border-green-200' :
                update.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}
            >
              <p className={`text-sm ${
                update.type === 'success' ? 'text-green-700' :
                update.type === 'warning' ? 'text-yellow-700' :
                'text-blue-700'
              }`}>
                {update.message}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

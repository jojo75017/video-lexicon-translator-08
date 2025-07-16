
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getHealthMetrics } from '@/utils/seo/healthUtils';

export const HealthButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-teal-50"
        >
          <ShieldCheck className="h-6 w-6 text-teal-600" />
          <span className="text-xs">Santé SEO</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>État de Santé SEO</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {Object.entries(getHealthMetrics()).map(([metric, score]) => (
            <div key={metric} className="p-4 rounded-lg border bg-white">
              <h3 className="text-sm font-medium capitalize mb-2">{metric}</h3>
              <div className="flex items-center">
                <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      score >= 90 ? 'bg-green-500' :
                      score >= 80 ? 'bg-teal-500' :
                      score >= 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className="ml-2 text-sm font-medium">{score}%</span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

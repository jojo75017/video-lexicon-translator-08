
import React from 'react';
import { Button } from "@/components/ui/button";
import { Database } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getOrganizationStats } from '@/utils/seo/organizationUtils';

export const OrganizeButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-indigo-50"
        >
          <Database className="h-6 w-6 text-indigo-600" />
          <span className="text-xs">Organiser</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Organisation du Site</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {getOrganizationStats().map((stat, index) => (
            <div key={index} className="flex justify-between items-center p-4 rounded-lg border bg-white">
              <span className="text-sm font-medium">{stat.category}</span>
              <span className="text-sm font-bold text-indigo-600">{stat.count}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

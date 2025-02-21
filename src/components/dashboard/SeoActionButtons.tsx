
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChartLine, BellRing, ShieldCheck, Database, Plus, Rocket } from 'lucide-react';
import { toast } from "sonner";

const SeoActionButtons = () => {
  const handleAction = (action: string) => {
    toast.info(`Action "${action}" en cours de développement`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <Button
        variant="outline"
        className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-blue-50"
        onClick={() => handleAction("Nouveau projet")}
      >
        <Plus className="h-6 w-6 text-blue-600" />
        <span className="text-xs">Nouveau projet</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-purple-50"
        onClick={() => handleAction("Suivi des classements")}
      >
        <ChartLine className="h-6 w-6 text-purple-600" />
        <span className="text-xs">Suivre les classements</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-green-50"
        onClick={() => handleAction("Mises à jour quotidiennes")}
      >
        <Rocket className="h-6 w-6 text-green-600" />
        <span className="text-xs">Mises à jour quotidiennes</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-red-50"
        onClick={() => handleAction("Alertes critiques")}
      >
        <BellRing className="h-6 w-6 text-red-600" />
        <span className="text-xs">Alertes critiques</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-teal-50"
        onClick={() => handleAction("Santé SEO")}
      >
        <ShieldCheck className="h-6 w-6 text-teal-600" />
        <span className="text-xs">Santé SEO</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-indigo-50"
        onClick={() => handleAction("Organisation")}
      >
        <Database className="h-6 w-6 text-indigo-600" />
        <span className="text-xs">Organiser</span>
      </Button>
    </div>
  );
};

export default SeoActionButtons;

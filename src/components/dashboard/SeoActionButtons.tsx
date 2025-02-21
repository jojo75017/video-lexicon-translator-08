
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChartLine, BellRing, ShieldCheck, Database, Plus, Rocket } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const projectSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  url: z.string().url("Veuillez entrer une URL valide"),
  keywords: z.string().min(2, "Entrez au moins un mot-clé")
});

type ProjectFormData = z.infer<typeof projectSchema>;

const SeoActionButtons = () => {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      url: "",
      keywords: ""
    }
  });

  const handleNewProject = (data: ProjectFormData) => {
    console.log("Nouveau projet:", data);
    toast.success("Projet créé avec succès !");
    setShowNewProjectDialog(false);
    form.reset();
  };

  const handleAction = (action: string) => {
    toast.info(`Action "${action}" en cours de développement`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-blue-50"
          >
            <Plus className="h-6 w-6 text-blue-600" />
            <span className="text-xs">Nouveau projet</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau projet SEO</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleNewProject)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du projet</FormLabel>
                    <FormControl>
                      <Input placeholder="Mon site web" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL du site</FormLabel>
                    <FormControl>
                      <Input placeholder="https://monsite.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mots-clés cibles (séparés par des virgules)</FormLabel>
                    <FormControl>
                      <Input placeholder="seo, marketing, web" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Créer le projet</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
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


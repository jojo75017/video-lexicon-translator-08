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
import RankingTracker from "@/components/seo/RankingTracker";

const projectSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  url: z.string().url("Veuillez entrer une URL valide"),
  keywords: z.string().min(2, "Entrez au moins un mot-clé")
});

type ProjectFormData = z.infer<typeof projectSchema>;

const SeoActionButtons = () => {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showRankingDialog, setShowRankingDialog] = useState(false);
  const [showUpdatesDialog, setShowUpdatesDialog] = useState(false);
  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  const [showHealthDialog, setShowHealthDialog] = useState(false);
  const [showOrgDialog, setShowOrgDialog] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState('');

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

  const handleRankingClick = () => {
    setSelectedUrl('https://example.com');
    setShowRankingDialog(true);
  };

  const getDailyUpdates = () => {
    return [
      {
        type: 'success',
        message: 'Position moyenne améliorée de 2.3 positions'
      },
      {
        type: 'info',
        message: '3 nouveaux backlinks détectés'
      },
      {
        type: 'warning',
        message: 'Temps de chargement augmenté de 0.5 secondes'
      },
      {
        type: 'success',
        message: 'Score de performance mobile amélioré de 8 points'
      },
      {
        type: 'info',
        message: '12 nouvelles visites organiques'
      }
    ];
  };

  const handleAction = (action: string) => {
    toast.info(`Action "${action}" en cours de développement`);
  };

  const getAlerts = () => {
    return [
      {
        severity: 'high',
        message: 'Chute brutale du trafic organique (-45%)',
        time: '2h ago'
      },
      {
        severity: 'medium',
        message: 'Temps de chargement > 3s sur 5 pages',
        time: '4h ago'
      },
      {
        severity: 'high',
        message: 'Perte de position sur 3 mots-clés principaux',
        time: '6h ago'
      }
    ];
  };

  const getHealthMetrics = () => {
    return {
      performance: 85,
      accessibility: 92,
      seo: 88,
      security: 95,
      mobile: 90
    };
  };

  const getOrganizationStats = () => {
    return [
      { category: 'Pages indexées', count: 245 },
      { category: 'Pages en attente', count: 12 },
      { category: 'Redirections', count: 34 },
      { category: 'Erreurs 404', count: 8 },
      { category: 'Pages bloquées', count: 3 }
    ];
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

      <Dialog open={showRankingDialog} onOpenChange={setShowRankingDialog}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-purple-50"
            onClick={handleRankingClick}
          >
            <ChartLine className="h-6 w-6 text-purple-600" />
            <span className="text-xs">Suivre les classements</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Suivi des classements SEO</DialogTitle>
          </DialogHeader>
          <RankingTracker url={selectedUrl} />
        </DialogContent>
      </Dialog>

      <Dialog open={showUpdatesDialog} onOpenChange={setShowUpdatesDialog}>
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

      <Dialog open={showAlertsDialog} onOpenChange={setShowAlertsDialog}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-red-50"
          >
            <BellRing className="h-6 w-6 text-red-600" />
            <span className="text-xs">Alertes critiques</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alertes SEO Critiques</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
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

      <Dialog open={showHealthDialog} onOpenChange={setShowHealthDialog}>
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

      <Dialog open={showOrgDialog} onOpenChange={setShowOrgDialog}>
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
    </div>
  );
};

export default SeoActionButtons;

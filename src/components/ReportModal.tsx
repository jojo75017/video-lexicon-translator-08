
import React from 'react';
import { ExternalLink, Download } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Report } from '@/types/localBusiness';
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import { toast } from "sonner";

interface ReportModalProps {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReportModal = ({ report, open, onOpenChange }: ReportModalProps) => {
  if (!report) return null;

  const chartData = [
    {
      name: 'Répertoires',
      score: report.directoryScore,
    },
    {
      name: 'Avis',
      score: report.reviewScore,
    },
    {
      name: 'Visibilité',
      score: report.visibilityScore,
    },
  ];

  const handleExportPDF = async () => {
    try {
      const element = document.getElementById('report-content');
      if (!element) return;

      toast.loading("Génération du rapport en cours...");
      
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.href = data;
      link.download = 'rapport-presence-locale.png';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Rapport exporté avec succès !");
    } catch (error) {
      toast.error("Erreur lors de l'export du rapport");
      console.error("Export error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Rapport d'analyse de votre présence locale</DialogTitle>
          <DialogDescription>
            Une analyse détaillée de votre visibilité sur les répertoires locaux
          </DialogDescription>
        </DialogHeader>

        <div id="report-content" className="space-y-8 py-4">
          <div className="flex justify-end">
            <Button onClick={handleExportPDF} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exporter en PDF
            </Button>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {chartData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-700">{item.name}</p>
                  <span className="text-lg font-bold">{item.score}%</span>
                </div>
                <Progress value={item.score} className="h-2" />
                <p className="text-sm text-gray-600">
                  {item.score >= 80 ? 'Excellent' : 
                   item.score >= 60 ? 'Bon' : 'À améliorer'}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Recommandations détaillées</h3>
            <div className="space-y-4">
              {report.recommendations.map((recommendation, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-2">{recommendation}</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {getDetailedRecommendations(recommendation).map((detail, i) => (
                      <li key={i} className="text-sm">{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">État des répertoires</h3>
            <div className="space-y-3">
              {report.directories.map((directory, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      directory.status === 'present'
                        ? 'bg-green-500'
                        : directory.status === 'missing'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`} />
                    <div>
                      <span className="font-medium block">{directory.name}</span>
                      <span className="text-sm text-gray-600">
                        {directory.status === 'present'
                          ? 'Présence vérifiée'
                          : directory.status === 'missing'
                          ? 'Fiche à créer'
                          : 'Informations à corriger'
                        }
                      </span>
                    </div>
                  </div>
                  {directory.url && (
                    <a
                      href={directory.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      Voir la fiche
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Fonction utilitaire pour générer des recommandations détaillées
const getDetailedRecommendations = (recommendation: string): string[] => {
  if (recommendation.includes("répertoires manquants")) {
    return [
      "Identifiez les plateformes les plus pertinentes pour votre secteur",
      "Préparez des photos de qualité et une description détaillée",
      "Vérifiez les informations de contact avant chaque soumission",
      "Gardez une copie de vos identifiants de connexion"
    ];
  }
  if (recommendation.includes("informations")) {
    return [
      "Utilisez exactement le même nom d'entreprise partout",
      "Vérifiez que l'adresse est complète et correcte",
      "Assurez-vous que les horaires sont à jour",
      "Mettez à jour les numéros de téléphone si nécessaire"
    ];
  }
  if (recommendation.includes("avis")) {
    return [
      "Créez un processus simple pour demander des avis",
      "Répondez aux avis dans les 24-48 heures",
      "Remerciez pour les avis positifs",
      "Proposez des solutions constructives aux avis négatifs"
    ];
  }
  return [
    "Suivez régulièrement vos statistiques de visibilité",
    "Mettez à jour vos informations dès que nécessaire",
    "Restez actif sur les principales plateformes",
    "Surveillez les nouvelles opportunités de référencement local"
  ];
};


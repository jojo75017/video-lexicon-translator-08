
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Report } from '@/types/localBusiness';

interface ReportModalProps {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReportModal = ({ report, open, onOpenChange }: ReportModalProps) => {
  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Rapport d'analyse de votre présence locale</DialogTitle>
          <DialogDescription>
            Voici une analyse détaillée de votre présence sur les répertoires locaux
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 text-center">
              <p className="text-sm font-medium text-gray-500">Score Répertoires</p>
              <div className="relative pt-1">
                <Progress value={report.directoryScore} className="h-2" />
                <p className="mt-1 text-lg font-semibold">{report.directoryScore}%</p>
              </div>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-sm font-medium text-gray-500">Score Avis</p>
              <div className="relative pt-1">
                <Progress value={report.reviewScore} className="h-2" />
                <p className="mt-1 text-lg font-semibold">{report.reviewScore}%</p>
              </div>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-sm font-medium text-gray-500">Score Visibilité</p>
              <div className="relative pt-1">
                <Progress value={report.visibilityScore} className="h-2" />
                <p className="mt-1 text-lg font-semibold">{report.visibilityScore}%</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Recommandations</h3>
            <ul className="space-y-2">
              {report.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 text-blue-500">•</span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">État des répertoires</h3>
            <div className="space-y-3">
              {report.directories.map((directory, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        directory.status === 'present'
                          ? 'bg-green-500'
                          : directory.status === 'missing'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      }`}
                    />
                    <span className="font-medium">{directory.name}</span>
                  </div>
                  {directory.url && (
                    <a
                      href={directory.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      Voir <ExternalLink className="h-4 w-4" />
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

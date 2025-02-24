
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { toast } from "sonner";
import { BusinessForm } from './BusinessForm';
import { FeatureCards } from './FeatureCards';
import { ReportModal } from './ReportModal';
import type { FormValues, Report } from '@/types/localBusiness';

const generateMockReport = (data: FormValues): Report => {
  return {
    directoryScore: Math.floor(Math.random() * 40) + 60,
    reviewScore: Math.floor(Math.random() * 50) + 50,
    visibilityScore: Math.floor(Math.random() * 45) + 55,
    recommendations: [
      "Créez des profils sur les principaux répertoires manquants",
      "Uniformisez vos informations d'entreprise sur tous les répertoires",
      "Encouragez vos clients satisfaits à laisser des avis",
      "Répondez aux avis existants, positifs comme négatifs"
    ],
    directories: [
      {
        name: "Google Business Profile",
        status: Math.random() > 0.5 ? 'present' : 'missing',
        url: "https://business.google.com"
      },
      {
        name: "Pages Jaunes",
        status: Math.random() > 0.7 ? 'present' : 'incorrect',
        url: "https://pagesjaunes.fr"
      },
      {
        name: "TripAdvisor",
        status: Math.random() > 0.6 ? 'present' : 'missing',
        url: "https://tripadvisor.com"
      }
    ]
  };
};

const LocalBusinessSection = () => {
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState<Report | null>(null);

  const handleSubmit = async (data: FormValues) => {
    try {
      console.log("Form data:", data);
      toast.success("Vérification des répertoires locaux en cours...");
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockReport = generateMockReport(data);
      setReport(mockReport);
      setShowReport(true);
      
      toast.success("Rapport généré ! Consultez les résultats.");
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'analyse.");
    }
  };

  return (
    <>
      <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Développez votre entreprise locale
          </h2>
          <p className="text-gray-600 text-lg">
            Fiches, données et avis assistés par IA, le tout sur une seule et même plateforme.
          </p>
        </CardHeader>
        <CardContent>
          <BusinessForm onSubmit={handleSubmit} />
          <FeatureCards />
        </CardContent>
      </Card>

      <ReportModal 
        report={report}
        open={showReport}
        onOpenChange={setShowReport}
      />
    </>
  );
};

export default LocalBusinessSection;

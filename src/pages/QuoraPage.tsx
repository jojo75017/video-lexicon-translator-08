
import React from 'react';
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/dashboard/PageHeader";
import TabNavigation from "@/components/dashboard/TabNavigation";
import QuoraButton from "@/components/seo/buttons/QuoraButton";
import { MessageSquareText } from 'lucide-react';

const QuoraPage = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Quora - Questions et Réponses"
        description="Gérez et optimisez votre présence sur Quora pour améliorer votre visibilité"
        icon={<MessageSquareText className="h-6 w-6 text-[#b92b27]" />}
      />
      
      <TabNavigation />
      
      <Card className="p-6 shadow-lg bg-white border-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="w-1 h-6 bg-[#b92b27] rounded-full mr-3"></span>
          Assistant Quora
        </h2>
        
        <div className="flex flex-col space-y-6">
          <p className="text-lg">
            Utilisez notre assistant Quora pour créer des questions pertinentes et des réponses de haute qualité qui augmenteront votre visibilité et établiront votre autorité sur la plateforme.
          </p>
          
          <div className="flex justify-center py-4">
            <QuoraButton />
          </div>
          
          <div className="bg-[#b92b27]/5 p-4 rounded-lg border border-[#b92b27]/20">
            <h3 className="font-semibold text-[#b92b27] mb-2">Conseils pour réussir sur Quora</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Répondez régulièrement aux questions liées à votre domaine d'expertise</li>
              <li>Incluez des exemples concrets et des données vérifiables dans vos réponses</li>
              <li>Utilisez des histoires personnelles pour rendre vos réponses mémorables</li>
              <li>Ajoutez des images ou des graphiques pertinents pour illustrer vos points</li>
              <li>Suivez les sujets pertinents pour votre secteur d'activité</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuoraPage;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MessageSquareText, ArrowLeft } from 'lucide-react';

const QuoraPage = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft size={16} />
            Retour au tableau de bord
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Quora & Forums</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center gap-4 mb-6">
          <MessageSquareText size={40} className="text-[#b92b27]" />
          <h2 className="text-2xl font-bold">Générateur de réponses pour Quora et Forums</h2>
        </div>
        
        <p className="mb-4 text-gray-700">
          Créez des réponses optimisées pour Quora et autres forums de discussion. Améliorez votre visibilité et votre autorité en ligne.
        </p>
        
        <div className="p-4 bg-red-50 rounded-md mb-6 border border-red-100">
          <p className="text-red-800">
            Cette fonctionnalité sera bientôt disponible. Revenez prochainement !
          </p>
        </div>
        
        <Link to="/">
          <Button className="w-full bg-[#b92b27] hover:bg-[#a42521] text-white">
            <MessageSquareText className="mr-2" />
            Retour au Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QuoraPage;

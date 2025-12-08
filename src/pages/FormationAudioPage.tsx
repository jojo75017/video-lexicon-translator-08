import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { EbookFormationAudio } from '@/components/ebook/EbookFormationAudio';

const FormationAudioPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/10 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/ebook-planner')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au Générateur
          </Button>
        </div>

        {/* Contenu de la formation */}
        <EbookFormationAudio />
      </div>
    </div>
  );
};

export default FormationAudioPage;

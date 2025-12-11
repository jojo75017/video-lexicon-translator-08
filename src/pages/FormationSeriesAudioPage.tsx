import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { EbookFormationSeriesAudio } from '@/components/ebook/EbookFormationSeriesAudio';

const FormationSeriesAudioPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-950/10 p-6">
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
        <EbookFormationSeriesAudio />
      </div>
    </div>
  );
};

export default FormationSeriesAudioPage;

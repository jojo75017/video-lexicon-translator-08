import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KdpCoverStudio from '@/components/ebook/KdpCoverStudio';

const CouvertureKdpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-background">
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookImage className="h-4 w-4 text-[#008296]" />
            Couverture KDP Exacte (PDF)
          </div>
        </div>

        <KdpCoverStudio />
      </div>
    </div>
  );
};

export default CouvertureKdpPage;

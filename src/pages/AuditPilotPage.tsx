import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KdpAmazonResearch } from '@/components/ebook/KdpAmazonResearch';
import { KdpPilotAccuracyBanner } from '@/components/ebook/KdpPilotAccuracyBanner';

const AuditPilotPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClipboardCheck className="h-4 w-4 text-primary" />
            Audit Pilot KDP
          </div>
        </div>

        <KdpPilotAccuracyBanner />

        <KdpAmazonResearch defaultTab="pilot" />
      </div>
    </div>
  );
};

export default AuditPilotPage;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '@/components/landing/HeroSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { EmailCaptureForm } from '@/components/landing/EmailCaptureForm';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { WhatsIncludedSection } from '@/components/landing/WhatsIncludedSection';
import { SuccessPage } from '@/components/landing/SuccessPage';

const PromptsCapturePage: React.FC = () => {
  const navigate = useNavigate();
  const [submittedEmail, setSubmittedEmail] = useState<string>('');

  const handleEmailSubmit = (email: string) => {
    setSubmittedEmail(email);
  };

  const handleCtaClick = () => {
    document.getElementById('email')?.focus();
  };

  if (submittedEmail) {
    return <SuccessPage email={submittedEmail} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/30">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/prompts-generator')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <Badge className="bg-vibrant-green/10 text-vibrant-green border-vibrant-green/20">
              🎁 Offre Limitée
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HeroSection onCtaClick={handleCtaClick} />
        <BenefitsSection />
        <EmailCaptureForm onSubmit={handleEmailSubmit} />
        <TestimonialsSection />
        <WhatsIncludedSection />
        
        {/* Final CTA */}
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-6">
            ⏰ <strong>Offre limitée :</strong> Téléchargement gratuit pendant encore quelques jours seulement !
          </p>
          <Button 
            onClick={handleCtaClick}
            size="lg"
            className="btn-gradient font-bold px-8 py-4 text-xl floating-animation"
          >
            <Download className="w-6 h-6 mr-2" />
            JE VEUX MES PROMPTS GRATUITS !
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PromptsCapturePage;
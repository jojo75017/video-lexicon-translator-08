import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SuccessPageProps {
  email: string;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ email }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl text-center gradient-card">
        <CardContent className="pt-8 pb-8">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            🎉 Parfait ! C'est dans la boîte !
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Votre pack de prompts professionnels arrive dans votre boîte email sous peu.
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
            <p className="text-primary font-medium">
              📧 Email envoyé à : <span className="font-mono">{email}</span>
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Pensez à vérifier vos spams si vous ne recevez rien dans les 10 prochaines minutes !
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => navigate('/prompts-generator')}
              className="bg-primary hover:bg-primary/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au générateur
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open('https://wa.me/your-number', '_blank')}
              className="border-vibrant-green text-vibrant-green hover:bg-vibrant-green/10"
            >
              💬 Rejoindre notre communauté WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Download } from 'lucide-react';
import { toast } from 'sonner';

interface EmailCaptureFormProps {
  onSubmit: (email: string) => void;
}

export const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Veuillez saisir une adresse email valide");
      return;
    }

    setIsSubmitting(true);
    
    // Simulation d'envoi
    setTimeout(() => {
      onSubmit(email);
      setIsSubmitting(false);
      toast.success("Parfait ! Vérifiez votre boîte email dans quelques minutes.");
    }, 1500);
  };

  return (
    <Card className="max-w-2xl mx-auto mb-12 glow-effect border-primary/20">
      <CardHeader className="text-center bg-gradient-primary text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Mail className="w-6 h-6" />
          Accès Immédiat & Gratuit
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              📧 Votre adresse email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="text-lg py-3 border-2 border-border focus:border-primary"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full btn-gradient font-semibold py-4 text-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Envoi en cours...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                TÉLÉCHARGER MAINTENANT (100% GRATUIT)
              </div>
            )}
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          🔒 Vos données sont sécurisées. Pas de spam, désinscription en 1 clic.
        </p>
      </CardContent>
    </Card>
  );
};
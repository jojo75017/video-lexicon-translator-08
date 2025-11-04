import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Lock, Unlock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface SubscriptionAuthProps {
  onAuthenticated: (email: string, subscriber: any) => void;
}

export const SubscriptionAuth = ({ onAuthenticated }: SubscriptionAuthProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('validate-subscription', {
        body: { email: normalizedEmail }
      });

      if (error) throw error;

      if (data.valid) {
        localStorage.setItem('subscriber_email', normalizedEmail);
        localStorage.setItem('subscriber_data', JSON.stringify(data.subscriber));
        toast.success(`Bienvenue ! Plan ${data.subscriber.plan_type}`);
        onAuthenticated(normalizedEmail, data.subscriber);
        navigate('/ebook-planner');
      } else {
        toast.error(data.message || 'Abonnement non trouvé');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Générateur d'Ebook</h1>
          <p className="text-muted-foreground">
            Connectez-vous avec l'email de votre abonnement
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              'Vérification...'
            ) : (
              <>
                <Unlock className="w-4 h-4 mr-2" />
                Accéder au générateur
              </>
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>Pas encore abonné ?</p>
          <a 
            href="https://votre-tunnel-systeme.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Souscrire maintenant
          </a>
          <div className="pt-2">
            <Link 
              to="/admin"
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              Administration
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};
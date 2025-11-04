import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, UserPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminPage = () => {
  const [email, setEmail] = useState('');
  const [planType, setPlanType] = useState('starter');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Email invalide');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('add-subscriber', {
        body: { email, plan_type: planType }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(data.message || 'Abonné ajouté avec succès !');
        setEmail('');
      } else {
        toast.error(data.message || 'Erreur lors de l\'ajout');
      }
    } catch (error) {
      console.error('Add subscriber error:', error);
      toast.error('Erreur lors de l\'ajout de l\'abonné');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="container mx-auto max-w-4xl py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">Gestion des abonnés</p>
            </div>
          </div>
          <Button onClick={() => navigate('/ebook-planner')} variant="outline">
            Retour au générateur
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Ajouter un abonné</h2>
          </div>
          
          <form onSubmit={handleAddSubscriber} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Plan</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                disabled={isLoading}
              >
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Ajout en cours...' : 'Ajouter l\'abonné'}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Instructions</h2>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Ajoutez un email pour créer un nouvel abonné</p>
            <p>• Si l'email existe déjà, l'abonnement sera réactivé</p>
            <p>• Les abonnés peuvent se connecter avec leur email</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
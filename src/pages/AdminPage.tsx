import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, UserPlus, Users, Copy, Mail, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminPage = () => {
  const [email, setEmail] = useState('');
  const [planType, setPlanType] = useState('starter');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    setIsLoadingSubscribers(true);
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error loading subscribers:', error);
      toast.error('Erreur lors du chargement des abonnés');
    } finally {
      setIsLoadingSubscribers(false);
    }
  };

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
        setGeneratedCode(data.accessCode);
        toast.success(data.message || 'Abonné ajouté avec succès !');
        setEmail('');
        loadSubscribers(); // Refresh list
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

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copié !');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Déconnexion réussie');
    navigate('/auth');
  };

  const filteredSubscribers = subscribers.filter(sub => 
    searchEmail === '' || sub.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="container mx-auto max-w-6xl py-8 space-y-6">
        {/* Header */}
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
          <div className="flex gap-2">
            <Button onClick={() => navigate('/ebook-planner')} variant="outline">
              Retour au générateur
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Add Subscriber Card */}
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
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                'Ajouter l\'abonné'
              )}
            </Button>
          </form>

          {generatedCode && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Code d'accès généré</h3>
              </div>
              <div className="bg-white p-3 rounded border border-green-300 font-mono text-2xl text-center text-green-800 font-bold">
                {generatedCode}
              </div>
              <p className="text-sm text-green-700 mt-2">
                Envoyez ce code au client avec son email pour qu'il puisse se connecter.
              </p>
              <Button
                onClick={() => handleCopyCode(generatedCode)}
                variant="outline"
                className="w-full mt-3"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copier le code
              </Button>
            </div>
          )}
        </Card>

        {/* Subscribers List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Abonnés ({filteredSubscribers.length})</h2>
            </div>
            <Button onClick={loadSubscribers} variant="outline" size="sm">
              Actualiser
            </Button>
          </div>

          <div className="mb-4">
            <Input
              placeholder="Rechercher par email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>

          {isLoadingSubscribers ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun abonné trouvé
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSubscribers.map((subscriber) => (
                <div 
                  key={subscriber.id} 
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{subscriber.email}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          subscriber.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {subscriber.status}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {subscriber.plan_type}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Code: <span className="font-mono font-bold">{subscriber.access_code}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Plans: {subscriber.ebook_plans_generated} | 
                        Chapitres: {subscriber.chapters_generated} | 
                        Sous-chapitres: {subscriber.subchapters_generated} | 
                        Couvertures: {subscriber.covers_generated}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleCopyCode(subscriber.access_code)}
                        variant="outline" 
                        size="sm"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Instructions */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Instructions</h2>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Ajoutez un email pour créer un nouvel abonné avec un code d'accès unique</p>
            <p>• Si l'email existe déjà, l'abonnement sera mis à jour avec le nouveau plan</p>
            <p>• Les abonnés se connectent avec leur email + code d'accès</p>
            <p>• Vous pouvez copier le code d'accès directement depuis la liste</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
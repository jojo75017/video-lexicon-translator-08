import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, UserPlus, Users, Copy, Mail, LogOut, Loader2, Pause, Play, RotateCcw, Edit, Calendar, TrendingUp, Activity, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export const AdminPage = () => {
  const [email, setEmail] = useState('');
  const [planType, setPlanType] = useState('starter');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [planFilter, setPlanFilter] = useState<'all' | 'starter' | 'pro' | 'enterprise'>('all');
  const [selectedSubscriber, setSelectedSubscriber] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');
  const [sendingEmailTo, setSendingEmailTo] = useState<string | null>(null);
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

  const sendAccessCodeByEmail = async (subscriber: any) => {
    setSendingEmailTo(subscriber.id);
    try {
      const { data, error } = await supabase.functions.invoke('send-access-code', {
        body: {
          email: subscriber.email,
          accessCode: subscriber.access_code,
          planType: subscriber.plan_type
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`✅ Code envoyé à ${subscriber.email} ! Pensez à vérifier les spams.`, { duration: 6000 });
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error(`Erreur: ${error.message || 'Impossible d\'envoyer l\'email'}`);
    } finally {
      setSendingEmailTo(null);
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
        
        // Show different toast based on email status
        if (data.emailSent) {
          toast.success('✅ Abonné créé et email envoyé ! Demandez à l\'utilisateur de vérifier ses spams.', { duration: 8000 });
        } else {
          toast.warning(`⚠️ Abonné créé mais l'email n'a pas pu être envoyé. Code: ${data.accessCode}`, {
            duration: 10000,
          });
          if (data.emailError) {
            console.error('Email error:', data.emailError);
          }
        }
        
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

  const handleManageSubscription = async (action: string, subscriberId: string, data?: any) => {
    try {
      const { error } = await supabase.functions.invoke('manage-subscription', {
        body: { action, subscriberId, data }
      });

      if (error) throw error;

      toast.success('Action effectuée avec succès');
      loadSubscribers();
    } catch (error) {
      console.error('Manage subscription error:', error);
      toast.error('Erreur lors de l\'action');
    }
  };

  const getPlanLimits = (plan: string) => {
    const limits: any = {
      starter: { plans: 5, chapters: 20, subchapters: 50, covers: 3 },
      pro: { plans: 20, chapters: 100, subchapters: 300, covers: 10 },
      enterprise: { plans: -1, chapters: -1, subchapters: -1, covers: -1 }
    };
    return limits[plan] || limits.starter;
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const filteredSubscribers = subscribers.filter(sub => {
    const emailMatch = searchEmail === '' || sub.email.toLowerCase().includes(searchEmail.toLowerCase());
    const statusMatch = statusFilter === 'all' || sub.status === statusFilter;
    const planMatch = planFilter === 'all' || sub.plan_type === planFilter;
    return emailMatch && statusMatch && planMatch;
  });

  const stats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.status === 'active').length,
    inactive: subscribers.filter(s => s.status === 'inactive').length,
    starter: subscribers.filter(s => s.plan_type === 'starter').length,
    pro: subscribers.filter(s => s.plan_type === 'pro').length,
    enterprise: subscribers.filter(s => s.plan_type === 'enterprise').length,
  };

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
            <Button onClick={() => navigate('/admin/profile')} variant="outline">
              <User className="w-4 h-4 mr-2" />
              Mon profil
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

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Abonnés</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Actifs / Inactifs</p>
                <p className="text-3xl font-bold">{stats.active} / {stats.inactive}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Par Plan</p>
              <div className="flex gap-2">
                <Badge variant="secondary">{stats.starter} Starter</Badge>
                <Badge variant="secondary">{stats.pro} Pro</Badge>
                <Badge variant="secondary">{stats.enterprise} Enterprise</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Access Codes - Pour donner rapidement les codes */}
        <Card className="p-6 border-2 border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Copy className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">📋 Codes d'accès à donner</h2>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-1">
              {subscribers.filter(s => s.status === 'active').length} actifs
            </Badge>
          </div>
          
          <div className="bg-background rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-semibold">Email</th>
                  <th className="text-left p-3 font-semibold">Code d'accès</th>
                  <th className="text-left p-3 font-semibold">Plan</th>
                  <th className="text-center p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers
                  .filter(s => s.status === 'active')
                  .map((subscriber) => (
                    <tr key={subscriber.id} className="border-t hover:bg-muted/30">
                      <td className="p-3">
                        <span className="font-medium">{subscriber.email}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded">
                          {subscriber.access_code}
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{subscriber.plan_type}</Badge>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2 flex-wrap">
                          <Button
                            onClick={() => sendAccessCodeByEmail(subscriber)}
                            disabled={sendingEmailTo === subscriber.id}
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {sendingEmailTo === subscriber.id ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <Mail className="w-4 h-4 mr-1" />
                            )}
                            Envoyer
                          </Button>
                          <Button
                            onClick={() => {
                              navigator.clipboard.writeText(subscriber.access_code);
                              toast.success('Code copié !');
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Code
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {subscribers.filter(s => s.status === 'active').length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun abonné actif
              </div>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            💡 <strong>Lors d'un achat (27€) sur Systeme.io :</strong> Ajoutez l'abonné ci-dessus, puis cliquez sur "Envoyer" pour lui envoyer son code par email automatiquement.
          </p>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Rechercher par email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <select
              className="px-3 py-2 border rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
            <select
              className="px-3 py-2 border rounded-md"
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value as any)}
            >
              <option value="all">Tous les plans</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
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
              {filteredSubscribers.map((subscriber) => {
                const limits = getPlanLimits(subscriber.plan_type);
                const plansPercentage = getUsagePercentage(subscriber.ebook_plans_generated, limits.plans);
                const chaptersPercentage = getUsagePercentage(subscriber.chapters_generated, limits.chapters);
                
                return (
                  <div 
                    key={subscriber.id} 
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{subscriber.email}</span>
                          <Badge variant={subscriber.status === 'active' ? 'default' : 'destructive'}>
                            {subscriber.status}
                          </Badge>
                          <Badge variant="outline">{subscriber.plan_type}</Badge>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          Code: <span className="font-mono font-bold">{subscriber.access_code}</span>
                          {subscriber.expires_at && (
                            <span className="ml-4">
                              Expire: {format(new Date(subscriber.expires_at), 'dd/MM/yyyy')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleManageSubscription('toggle_status', subscriber.id)}
                          variant="outline"
                          size="sm"
                          title={subscriber.status === 'active' ? 'Suspendre' : 'Activer'}
                        >
                          {subscriber.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                          onClick={() => handleManageSubscription('reset_quotas', subscriber.id)}
                          variant="outline"
                          size="sm"
                          title="Réinitialiser les quotas"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedSubscriber(subscriber);
                            setShowDetailModal(true);
                          }}
                          variant="outline"
                          size="sm"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={() => handleCopyCode(subscriber.access_code)}
                          variant="outline" 
                          size="sm"
                          title="Copier le code"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Usage Progress Bars */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Plans ebook</span>
                          <span className={plansPercentage > 70 ? 'text-orange-600 font-bold' : ''}>
                            {subscriber.ebook_plans_generated}/{limits.plans === -1 ? '∞' : limits.plans}
                          </span>
                        </div>
                        <Progress value={plansPercentage} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Chapitres</span>
                          <span className={chaptersPercentage > 70 ? 'text-orange-600 font-bold' : ''}>
                            {subscriber.chapters_generated}/{limits.chapters === -1 ? '∞' : limits.chapters}
                          </span>
                        </div>
                        <Progress value={chaptersPercentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier l'abonné</DialogTitle>
              <DialogDescription>
                {selectedSubscriber?.email}
              </DialogDescription>
            </DialogHeader>
            
            {selectedSubscriber && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Plan</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md mt-1"
                    defaultValue={selectedSubscriber.plan_type}
                    onChange={(e) => {
                      handleManageSubscription('update_plan', selectedSubscriber.id, {
                        plan_type: e.target.value
                      });
                      setShowDetailModal(false);
                    }}
                  >
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Date d'expiration</label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        if (expirationDate) {
                          handleManageSubscription('set_expiration', selectedSubscriber.id, {
                            expires_at: expirationDate
                          });
                          setShowDetailModal(false);
                          setExpirationDate('');
                        }
                      }}
                      size="sm"
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </div>
                  {selectedSubscriber.expires_at && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Expire actuellement: {format(new Date(selectedSubscriber.expires_at), 'dd/MM/yyyy')}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Statistiques d'utilisation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Plans ebook:</span>
                      <span className="font-mono">{selectedSubscriber.ebook_plans_generated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chapitres:</span>
                      <span className="font-mono">{selectedSubscriber.chapters_generated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sous-chapitres:</span>
                      <span className="font-mono">{selectedSubscriber.subchapters_generated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Couvertures:</span>
                      <span className="font-mono">{selectedSubscriber.covers_generated}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Instructions */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Contrôles Admin</h2>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>Pause/Play:</strong> Suspendre ou réactiver un abonnement</p>
            <p>• <strong>Réinitialiser:</strong> Remettre à zéro tous les compteurs de génération</p>
            <p>• <strong>Modifier:</strong> Changer le plan ou définir une date d'expiration</p>
            <p>• <strong>Barres de progression:</strong> Vert &lt;70%, Orange 70-90%, Rouge &gt;90%</p>
            <p>• Les abonnés suspendus ne peuvent plus générer de contenu</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
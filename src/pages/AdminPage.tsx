import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, UserPlus, Users, Copy, Mail, LogOut, Loader2, Pause, Play, RotateCcw, Edit, Calendar, TrendingUp, Activity, User, DollarSign, CreditCard, BarChart3, Clock, Bell, BellOff, Volume2, CheckCircle, AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { usePaymentNotifications } from '@/hooks/usePaymentNotifications';
import { usePaymentConfirmations } from '@/hooks/usePaymentConfirmations';
import { format } from 'date-fns';

export const AdminPage = () => {
  const [email, setEmail] = useState('');
  const [planType, setPlanType] = useState('lifetime');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [lastAddedEmail, setLastAddedEmail] = useState('');
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [planFilter, setPlanFilter] = useState<'all' | 'starter' | 'pro' | 'enterprise'>('all');
  const [selectedSubscriber, setSelectedSubscriber] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');
  const [sendingEmailTo, setSendingEmailTo] = useState<string | null>(null);
  const [isRefreshingAdmin, setIsRefreshingAdmin] = useState(false);
  const navigate = useNavigate();

  const refreshAdminStatus = async () => {
    setIsRefreshingAdmin(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Session expirée - veuillez vous reconnecter');
        sessionStorage.removeItem('is_admin');
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-admin', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (error) {
        throw error;
      }

      if (data?.isAdmin) {
        sessionStorage.setItem('is_admin', 'true');
        toast.success('✅ Statut admin confirmé !');
      } else {
        sessionStorage.removeItem('is_admin');
        toast.error('Vous n\'êtes plus admin - redirection...');
        navigate('/auth');
      }
    } catch (error: any) {
      console.error('Error refreshing admin status:', error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsRefreshingAdmin(false);
    }
  };
  
  // Hook pour les notifications de paiement
  const { isMonitoring, toggleMonitoring, testSound, newPayments, clearNewPayments } = usePaymentNotifications(true);
  
  // Hook pour les confirmations de paiement en attente
  const { confirmations, pendingCount, markAsProcessed, loadConfirmations: refreshConfirmations } = usePaymentConfirmations();

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
        setLastAddedEmail(email);
        
        // Copy code to clipboard automatically
        navigator.clipboard.writeText(data.accessCode);
        
        // Show different toast based on email status
        if (data.emailSent) {
          toast.success('✅ Abonné créé, email envoyé et code copié !', { duration: 8000 });
        } else {
          toast.warning(`⚠️ Abonné créé mais l'email n'a pas pu être envoyé. Code copié !`, {
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
      starter: { plans: 5, chapters: 50, subchapters: 100, covers: 3 },
      pro: { plans: 20, chapters: 200, subchapters: 400, covers: 10 },
      lifetime: { plans: -1, chapters: -1, subchapters: -1, covers: -1 },
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
    lifetime: subscribers.filter(s => s.plan_type === 'lifetime').length,
  };

  // Prix des plans pour calcul des revenus
  const planPrices: Record<string, number> = {
    starter: 27,
    pro: 47,
    enterprise: 97,
    lifetime: 197,
  };

  // Calcul des revenus
  const revenueStats = useMemo(() => {
    let totalRevenue = 0;
    let monthlyRecurring = 0;
    
    subscribers.forEach(sub => {
      const price = planPrices[sub.plan_type] || 27;
      totalRevenue += price;
      
      if (sub.status === 'active' && sub.plan_type !== 'lifetime') {
        monthlyRecurring += price;
      }
    });

    return { totalRevenue, monthlyRecurring };
  }, [subscribers]);

  // Données pour le graphique par plan
  const planChartData = useMemo(() => [
    { name: 'Starter', value: stats.starter, color: '#6366f1', revenue: stats.starter * planPrices.starter },
    { name: 'Pro', value: stats.pro, color: '#8b5cf6', revenue: stats.pro * planPrices.pro },
    { name: 'Enterprise', value: stats.enterprise, color: '#ec4899', revenue: stats.enterprise * planPrices.enterprise },
    { name: 'Lifetime', value: stats.lifetime, color: '#f59e0b', revenue: stats.lifetime * planPrices.lifetime },
  ].filter(d => d.value > 0), [stats]);

  // Données pour le graphique d'inscriptions par mois
  const monthlySignups = useMemo(() => {
    const months: Record<string, { name: string; count: number; revenue: number }> = {};
    
    subscribers.forEach(sub => {
      const date = new Date(sub.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      
      if (!months[monthKey]) {
        months[monthKey] = { name: monthName, count: 0, revenue: 0 };
      }
      months[monthKey].count++;
      months[monthKey].revenue += planPrices[sub.plan_type] || 27;
    });

    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([, data]) => data);
  }, [subscribers]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

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
          <div className="flex gap-2 flex-wrap items-center">
            {/* Notification Controls */}
            <div className="flex items-center gap-2 mr-2 p-2 rounded-lg bg-muted/50">
              <Button 
                onClick={toggleMonitoring} 
                variant={isMonitoring ? "default" : "outline"}
                size="sm"
                className={isMonitoring ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {isMonitoring ? (
                  <>
                    <Bell className="w-4 h-4 mr-2 animate-pulse" />
                    Surveillance active
                  </>
                ) : (
                  <>
                    <BellOff className="w-4 h-4 mr-2" />
                    Surveillance OFF
                  </>
                )}
              </Button>
              <Button 
                onClick={testSound} 
                variant="ghost" 
                size="sm"
                title="Tester le son"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
              {newPayments.length > 0 && (
                <Badge variant="destructive" className="animate-bounce">
                  {newPayments.length} nouveau(x)
                </Badge>
              )}
            </div>
            
            <Button 
              onClick={refreshAdminStatus} 
              variant="outline" 
              size="sm"
              disabled={isRefreshingAdmin}
              title="Rafraîchir le statut admin"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshingAdmin ? 'animate-spin' : ''}`} />
              {isRefreshingAdmin ? 'Vérification...' : 'Refresh Admin'}
            </Button>
            
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
                className="w-full px-3 py-2 border rounded-md bg-background"
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                disabled={isLoading}
              >
                <option value="lifetime">🌟 Lifetime - 97€ (Accès à vie)</option>
                <option value="starter">Starter - 27€/mois</option>
                <option value="pro">Pro - 67€/mois</option>
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
            <div className="mt-6 p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-green-500 rounded-full">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-green-900 text-lg">✅ Abonné ajouté avec succès !</h3>
              </div>
              
              {lastAddedEmail && (
                <p className="text-sm text-green-700 mb-3 font-medium">
                  📧 Email : <span className="font-mono bg-white px-2 py-1 rounded">{lastAddedEmail}</span>
                </p>
              )}
              
              <div className="bg-white p-4 rounded-lg border-2 border-green-400 font-mono text-3xl text-center text-green-800 font-bold tracking-widest shadow-inner">
                {generatedCode}
              </div>
              
              <p className="text-sm text-green-600 mt-3 text-center">
                📋 Code copié automatiquement dans le presse-papier !
              </p>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button
                  onClick={() => handleCopyCode(generatedCode)}
                  variant="outline"
                  className="border-green-400 text-green-700 hover:bg-green-100"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copier à nouveau
                </Button>
                <Button
                  onClick={() => {
                    if (lastAddedEmail) {
                      const subscriber = subscribers.find(s => s.email === lastAddedEmail);
                      if (subscriber) {
                        sendAccessCodeByEmail(subscriber);
                      }
                    }
                  }}
                  variant="outline"
                  className="border-blue-400 text-blue-700 hover:bg-blue-100"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Renvoyer par email
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Payment Confirmations Pending */}
        {pendingCount > 0 && (
          <Card className="p-6 border-2 border-orange-400 bg-orange-50 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Inbox className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-semibold text-orange-800">
                  📬 Confirmations de paiement en attente
                </h2>
                <Badge className="bg-orange-500 text-white animate-bounce">
                  {pendingCount} en attente
                </Badge>
              </div>
              <Button onClick={refreshConfirmations} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
            </div>

            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-orange-100">
                  <tr>
                    <th className="text-left p-3 font-semibold text-orange-800">Email</th>
                    <th className="text-left p-3 font-semibold text-orange-800">Date</th>
                    <th className="text-center p-3 font-semibold text-orange-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {confirmations
                    .filter(c => c.status === 'pending')
                    .map((confirmation) => (
                      <tr key={confirmation.id} className="border-t hover:bg-orange-50">
                        <td className="p-3">
                          <span className="font-medium text-lg">{confirmation.email}</span>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {format(new Date(confirmation.created_at), 'dd/MM/yyyy HH:mm')}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-2 flex-wrap">
                            <Button
                              onClick={() => {
                                setEmail(confirmation.email);
                                toast.info('Email copié dans le formulaire. Créez l\'abonné !');
                              }}
                              variant="default"
                              size="sm"
                              className="bg-violet-600 hover:bg-violet-700"
                            >
                              <UserPlus className="w-4 h-4 mr-1" />
                              Créer abonné
                            </Button>
                            <Button
                              onClick={() => markAsProcessed(confirmation.id, 'admin')}
                              variant="outline"
                              size="sm"
                              className="border-green-500 text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Traité
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm text-orange-700 mt-4">
              💡 Ces clients ont confirmé leur paiement PayPal. Vérifiez le paiement, puis créez leur compte avec le bouton "Créer abonné".
            </p>
          </Card>
        )}

        {/* Revenue Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-500/20">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenu Total</p>
                <p className="text-2xl font-bold text-green-600">{revenueStats.totalRevenue}€</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-500/20">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MRR (Récurrent)</p>
                <p className="text-2xl font-bold text-blue-600">{revenueStats.monthlyRecurring}€</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-purple-500/20">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-orange-500/20">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taux Actifs</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Month */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Ventes par mois</h3>
            </div>
            {monthlySignups.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlySignups}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? `${value}€` : value,
                      name === 'revenue' ? 'Revenu' : 'Inscriptions'
                    ]}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Inscriptions" />
                  <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenu" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                Pas encore de données
              </div>
            )}
          </Card>

          {/* Distribution by Plan */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Répartition par plan</h3>
            </div>
            {planChartData.length > 0 ? (
              <div className="flex items-center">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie
                      data={planChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {planChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${value} clients (${props.payload.revenue}€)`,
                        props.payload.name
                      ]}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {planChartData.map((plan, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                      <span className="text-sm">{plan.name}: {plan.value}</span>
                      <Badge variant="outline" className="text-xs">{plan.revenue}€</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                Pas encore de données
              </div>
            )}
          </Card>
        </div>

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
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{stats.starter} Starter</Badge>
                <Badge variant="secondary">{stats.pro} Pro</Badge>
                <Badge variant="secondary">{stats.enterprise} Enterprise</Badge>
                {stats.lifetime > 0 && <Badge variant="secondary">{stats.lifetime} Lifetime</Badge>}
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
                          <Button
                            onClick={() => handleManageSubscription('toggle_status', subscriber.id)}
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            title="Désactiver l'accès"
                          >
                            <Pause className="w-4 h-4 mr-1" />
                            Désactiver
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
            💡 <strong>Lors d'un achat (97€) :</strong> Ajoutez l'abonné ci-dessus, puis cliquez sur "Envoyer" pour lui envoyer son code par email automatiquement.
          </p>
        </Card>

        {/* Inactive Subscribers - Reactivation */}
        {subscribers.filter(s => s.status === 'inactive').length > 0 && (
          <Card className="p-6 border-2 border-gray-300 bg-gray-50/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Pause className="w-5 h-5 text-gray-500" />
                <h2 className="text-xl font-semibold text-gray-700">
                  🚫 Abonnés désactivés
                </h2>
                <Badge variant="secondary">
                  {subscribers.filter(s => s.status === 'inactive').length}
                </Badge>
              </div>
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
                    .filter(s => s.status === 'inactive')
                    .map((subscriber) => (
                      <tr key={subscriber.id} className="border-t hover:bg-muted/30">
                        <td className="p-3">
                          <span className="font-medium text-gray-600">{subscriber.email}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-mono text-lg text-gray-400 bg-gray-100 px-3 py-1 rounded">
                            {subscriber.access_code}
                          </span>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-gray-500">{subscriber.plan_type}</Badge>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-2 flex-wrap">
                            <Button
                              onClick={() => handleManageSubscription('toggle_status', subscriber.id)}
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Réactiver
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
            </div>

            <p className="text-sm text-gray-500 mt-4">
              💡 Ces abonnés ont été désactivés. Cliquez sur "Réactiver" pour restaurer leur accès.
            </p>
          </Card>
        )}

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
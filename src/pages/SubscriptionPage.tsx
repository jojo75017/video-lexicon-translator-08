import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Mail, 
  Calendar, 
  Package, 
  BookOpen, 
  FileText, 
  Layers, 
  Image,
  LogOut,
  Key,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Library,
  ArrowRight,
  Loader2,
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SubscriptionPageProps {
  subscriberEmail: string;
  subscriberData: any;
  onLogout: () => void;
}

const SubscriptionPage = ({ subscriberEmail, subscriberData, onLogout }: SubscriptionPageProps) => {
  const navigate = useNavigate();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const planLimits: Record<string, Record<string, number>> = {
    starter: { 
      chapters_generated: 50, 
      ebook_plans_generated: 5, 
      subchapters_generated: 100, 
      covers_generated: 3 
    },
    pro: { 
      chapters_generated: 200, 
      ebook_plans_generated: 20, 
      subchapters_generated: 400, 
      covers_generated: 10 
    },
    lifetime: { 
      chapters_generated: 999999, 
      ebook_plans_generated: 999999, 
      subchapters_generated: 999999, 
      covers_generated: 999999 
    }
  };

  const planFeatures: Record<string, { formations: string[]; features: string[] }> = {
    starter: {
      formations: ['Formation Ebook (Texte)'],
      features: ['5 ebooks/mois', '10 chapitres max', '3 couvertures/mois', 'Export PDF']
    },
    pro: {
      formations: ['Formation Ebook (Texte + Audio)', 'Formation Séries (Texte)', 'Formation Séries (Audio)'],
      features: ['20 ebooks/mois', '20 chapitres max', '10 couvertures/mois', 'Export PDF/EPUB', 'Gestionnaire Séries/Sagas', 'Outils KDP avancés']
    },
    lifetime: {
      formations: ['Toutes les formations (Texte + Audio)', 'Formation Séries complète', 'Futures formations incluses'],
      features: ['Ebooks illimités', 'Chapitres illimités', 'Couvertures illimitées', 'Export PDF/EPUB/Word', 'Séries/Sagas complet', 'Outils KDP Premium', 'Mises à jour à vie']
    }
  };

  const planPrices: Record<string, { price: string; period: string }> = {
    starter: { price: '27€', period: '/mois' },
    pro: { price: '67€', period: '/mois' },
    lifetime: { price: '147€', period: ' (une fois)' }
  };

  const currentLimits = planLimits[subscriberData?.plan_type] || planLimits.starter;
  const currentFeatures = planFeatures[subscriberData?.plan_type] || planFeatures.starter;

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Actif</Badge>;
    }
    return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Expiré</Badge>;
  };

  const getPlanBadge = (plan: string) => {
    const colors: Record<string, string> = {
      starter: 'bg-blue-500',
      pro: 'bg-purple-500',
      lifetime: 'bg-gradient-to-r from-yellow-500 to-orange-500'
    };
    const labels: Record<string, string> = {
      starter: 'STARTER - 27€/mois',
      pro: 'PRO - 67€/mois',
      lifetime: 'LIFETIME - Accès à vie'
    };
    return <Badge className={colors[plan] || 'bg-gray-500'}>{labels[plan] || plan.toUpperCase()}</Badge>;
  };

  const UsageCard = ({ 
    title, 
    icon: Icon, 
    current, 
    limit 
  }: { 
    title: string; 
    icon: any; 
    current: number; 
    limit: number;
  }) => {
    const percentage = limit === 999999 ? 0 : (current / limit) * 100;
    const isUnlimited = limit === 999999;

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className="w-4 h-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isUnlimited ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">∞</div>
              <p className="text-sm text-muted-foreground">Illimité</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{current}</span>
                <span className="text-sm text-muted-foreground">/ {limit}</span>
              </div>
              <Progress 
                value={percentage} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {limit - current} restant{limit - current > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('subscriber_email');
    localStorage.removeItem('subscriber_data');
    toast.success('Déconnexion réussie');
    onLogout();
  };

  const handleUpgrade = async (planId: string) => {
    setSelectedPlan(planId);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("stripe-checkout", {
        body: {
          planId: planId,
          email: subscriberEmail,
          successUrl: `${window.location.origin}/paiement-succes`,
          cancelUrl: `${window.location.origin}/abonnement`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de paiement non reçue");
      }
    } catch (error: any) {
      console.error("Erreur checkout:", error);
      toast.error(error.message || "Erreur lors de la redirection vers le paiement");
    } finally {
      setIsLoading(false);
      setShowUpgradeDialog(false);
    }
  };

  const canUpgradeTo = (targetPlan: string) => {
    const currentPlan = subscriberData?.plan_type || 'starter';
    const planOrder = ['starter', 'pro', 'lifetime'];
    return planOrder.indexOf(targetPlan) > planOrder.indexOf(currentPlan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Mon Abonnement</h1>
            <p className="text-muted-foreground">
              Gérez votre abonnement et consultez vos statistiques
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/ebook-planner')} variant="outline">
              <BookOpen className="w-4 h-4 mr-2" />
              Générateur
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations du compte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{subscriberEmail}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Code d'accès</p>
                  <p className="font-mono font-medium">{subscriberData?.access_code}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <div className="mt-1">{getPlanBadge(subscriberData?.plan_type)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <div className="mt-1">{getStatusBadge(subscriberData?.status)}</div>
                </div>
              </div>
            </div>

            {subscriberData?.expires_at && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Date d'expiration : {new Date(subscriberData.expires_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formations incluses */}
        <Card className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-500" />
              Formations incluses dans votre plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Formations
                </h4>
                <ul className="space-y-1">
                  {currentFeatures.formations.map((formation, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {formation}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Library className="w-4 h-4" />
                  Fonctionnalités
                </h4>
                <ul className="space-y-1">
                  {currentFeatures.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/formation')}
                className="border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Formation Ebook
              </Button>
              {(subscriberData?.plan_type === 'pro' || subscriberData?.plan_type === 'lifetime') && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/formation-series')}
                    className="border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                  >
                    <Library className="w-4 h-4 mr-2" />
                    Formation Séries
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/formation-series-audio')}
                    className="border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Formation Audio
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Utilisation</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <UsageCard
              title="Plans d'ebooks"
              icon={FileText}
              current={subscriberData?.ebook_plans_generated || 0}
              limit={currentLimits.ebook_plans_generated}
            />
            <UsageCard
              title="Chapitres"
              icon={BookOpen}
              current={subscriberData?.chapters_generated || 0}
              limit={currentLimits.chapters_generated}
            />
            <UsageCard
              title="Sous-chapitres"
              icon={Layers}
              current={subscriberData?.subchapters_generated || 0}
              limit={currentLimits.subchapters_generated}
            />
            <UsageCard
              title="Couvertures"
              icon={Image}
              current={subscriberData?.covers_generated || 0}
              limit={currentLimits.covers_generated}
            />
          </div>
        </div>

        {/* Plan Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Changer de plan</CardTitle>
            <CardDescription>
              Passez à un plan supérieur pour débloquer plus de fonctionnalités
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Starter */}
              <div className={`border rounded-lg p-4 space-y-3 ${subscriberData?.plan_type === 'starter' ? 'border-blue-500 bg-blue-50/50' : ''}`}>
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-500">STARTER</Badge>
                  <span className="font-bold">27€/mois</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>✅ 5 ebooks/mois</li>
                  <li>✅ 10 chapitres max</li>
                  <li>✅ 3 couvertures/mois</li>
                  <li>✅ Export PDF</li>
                  <li className="text-emerald-600">🎓 Formation Ebook</li>
                </ul>
                {subscriberData?.plan_type === 'starter' && (
                  <Badge variant="outline" className="w-full justify-center">Plan actuel</Badge>
                )}
              </div>
              
              {/* Pro */}
              <div className={`border-2 rounded-lg p-4 space-y-3 ${subscriberData?.plan_type === 'pro' ? 'border-purple-500 bg-purple-50/50' : 'border-purple-500'}`}>
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-500">PRO</Badge>
                  <span className="font-bold">67€/mois</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>✅ 20 ebooks/mois</li>
                  <li>✅ 20 chapitres max</li>
                  <li>✅ 10 couvertures/mois</li>
                  <li>✅ Export PDF/EPUB</li>
                  <li className="text-emerald-600">🎓 3 Formations incluses</li>
                  <li className="text-purple-600">📚 Séries/Sagas</li>
                </ul>
                {subscriberData?.plan_type === 'pro' ? (
                  <Badge variant="outline" className="w-full justify-center">Plan actuel</Badge>
                ) : canUpgradeTo('pro') && (
                  <Button 
                    className="w-full bg-purple-500 hover:bg-purple-600" 
                    size="sm"
                    onClick={() => handleUpgrade('pro')}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Passer au Pro'}
                  </Button>
                )}
              </div>
              
              {/* Lifetime */}
              <div className={`border rounded-lg p-4 space-y-3 bg-gradient-to-br from-yellow-50 to-orange-50 ${subscriberData?.plan_type === 'lifetime' ? 'border-yellow-500' : ''}`}>
                <div className="flex items-center justify-between">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">LIFETIME</Badge>
                  <span className="font-bold">147€</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>✅ Ebooks illimités à vie</li>
                  <li>✅ Chapitres illimités</li>
                  <li>✅ Couvertures illimitées</li>
                  <li>✅ Export PDF/EPUB/Word</li>
                  <li className="text-emerald-600">🎓 Toutes les formations</li>
                  <li className="text-purple-600">📚 Séries/Sagas complet</li>
                  <li className="text-orange-600">⭐ Support VIP</li>
                </ul>
                {subscriberData?.plan_type === 'lifetime' ? (
                  <Badge variant="outline" className="w-full justify-center">Plan actuel</Badge>
                ) : canUpgradeTo('lifetime') && (
                  <Button 
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90" 
                    size="sm"
                    onClick={() => handleUpgrade('lifetime')}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accès à vie'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;

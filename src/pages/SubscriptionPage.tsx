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
  Crown,
  Shield,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import LifetimeBadge from '@/components/ui/lifetime-badge';

interface SubscriptionPageProps {
  subscriberEmail: string;
  subscriberData: any;
  onLogout: () => void;
}

const ADMIN_EMAIL = 'boubetgeorges@gmail.com';

const SubscriptionPage = ({ subscriberEmail, subscriberData, onLogout }: SubscriptionPageProps) => {
  const navigate = useNavigate();
  
  // Redirection automatique pour l'admin permanent
  useEffect(() => {
    const storedAdmin = (localStorage.getItem('permanent_admin_email') || '').toLowerCase();
    if (storedAdmin === ADMIN_EMAIL || import.meta.env.DEV) {
      // L'admin est reconnu, on le redirige directement
      sessionStorage.setItem('is_admin', 'true');
      localStorage.setItem('permanent_admin_email', ADMIN_EMAIL);
      navigate('/ebook-planner', { replace: true });
    }
  }, [navigate]);

  const isVip = subscriberData?.plan_tier === 'vip';

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

  // VIP gets lifetime features
  const effectivePlanType = isVip ? 'lifetime' : subscriberData?.plan_type;
  const currentLimits = planLimits[effectivePlanType] || planLimits.starter;
  const currentFeatures = planFeatures[effectivePlanType] || planFeatures.starter;

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Actif</Badge>;
    }
    return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Expiré</Badge>;
  };

  const getPlanBadge = (plan: string, tier?: string) => {
    // VIP badge takes priority
    if (tier === 'vip') {
      return (
        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold animate-pulse">
          <Crown className="w-3 h-3 mr-1" />
          VIP FONDATEUR
        </Badge>
      );
    }
    
    if (plan === 'lifetime') {
      return <LifetimeBadge size="md" />;
    }
    
    const colors: Record<string, string> = {
      starter: 'bg-blue-500',
      pro: 'bg-purple-500',
    };
    const labels: Record<string, string> = {
      starter: 'STARTER - 27€/mois',
      pro: 'PRO - 67€/mois',
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
                  <div className="mt-1">{getPlanBadge(subscriberData?.plan_type, subscriberData?.plan_tier)}</div>
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

        {/* Offre unique */}
        <Card>
          <CardHeader>
            <CardTitle>Offre unique : Accès à vie (37€)</CardTitle>
            <CardDescription>
              EbookStudio Pro fonctionne désormais avec une seule offre à 37€ (accès à vie + mises à jour).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <LifetimeBadge size="md" />
                  <Badge variant="outline">37€</Badge>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>✅ Ebooks illimités</li>
                  <li>✅ Couvertures & exports inclus</li>
                  <li>✅ Toutes les formations incluses</li>
                  <li>✅ Mises à jour à vie</li>
                </ul>
              </div>

              <div className="space-y-3">
                {subscriberData?.plan_type === 'lifetime' && subscriberData?.status === 'active' ? (
                  <>
                    <Badge variant="outline" className="w-full justify-center">Accès actif</Badge>
                    <Button onClick={() => navigate('/ebook-planner')} className="w-full">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Ouvrir le générateur
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Vous n’êtes pas encore sur l’offre unique. Cliquez ci-dessous pour accéder à la page de paiement.
                    </p>
                    <Button onClick={() => navigate('/offres')} className="w-full">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Accéder à l’offre 37€
                    </Button>
                  </>
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

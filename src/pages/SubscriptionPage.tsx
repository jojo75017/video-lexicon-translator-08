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
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SubscriptionPageProps {
  subscriberEmail: string;
  subscriberData: any;
  onLogout: () => void;
}

const SubscriptionPage = ({ subscriberEmail, subscriberData, onLogout }: SubscriptionPageProps) => {
  const navigate = useNavigate();

  const planLimits: Record<string, Record<string, number>> = {
    starter: { 
      chapters_generated: 50, 
      ebook_plans_generated: 5, 
      subchapters_generated: 100, 
      covers_generated: 10 
    },
    pro: { 
      chapters_generated: 200, 
      ebook_plans_generated: 20, 
      subchapters_generated: 500, 
      covers_generated: 50 
    },
    agency: { 
      chapters_generated: 999999, 
      ebook_plans_generated: 999999, 
      subchapters_generated: 999999, 
      covers_generated: 999999 
    }
  };

  const currentLimits = planLimits[subscriberData?.plan_type] || planLimits.starter;

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
      agency: 'bg-gradient-to-r from-yellow-500 to-orange-500'
    };
    return <Badge className={colors[plan] || 'bg-gray-500'}>{plan.toUpperCase()}</Badge>;
  };

  const getProgressColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-green-500';
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
            <CardTitle>Améliorer votre plan</CardTitle>
            <CardDescription>
              Débloquez plus de fonctionnalités en passant à un plan supérieur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 space-y-3">
                <Badge className="bg-blue-500">STARTER</Badge>
                <ul className="space-y-2 text-sm">
                  <li>✅ 5 plans d'ebooks</li>
                  <li>✅ 50 chapitres</li>
                  <li>✅ 100 sous-chapitres</li>
                  <li>✅ 10 couvertures</li>
                </ul>
              </div>
              
              <div className="border-2 border-purple-500 rounded-lg p-4 space-y-3">
                <Badge className="bg-purple-500">PRO</Badge>
                <ul className="space-y-2 text-sm">
                  <li>✅ 20 plans d'ebooks</li>
                  <li>✅ 200 chapitres</li>
                  <li>✅ 500 sous-chapitres</li>
                  <li>✅ 50 couvertures</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4 space-y-3 bg-gradient-to-br from-yellow-50 to-orange-50">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">AGENCY</Badge>
                <ul className="space-y-2 text-sm">
                  <li>✅ Plans illimités</li>
                  <li>✅ Chapitres illimités</li>
                  <li>✅ Sous-chapitres illimités</li>
                  <li>✅ Couvertures illimitées</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Button asChild>
                <a 
                  href="https://votre-tunnel-systeme.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Changer de plan
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;

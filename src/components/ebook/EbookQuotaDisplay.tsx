import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Image, Layers, Crown, Zap, AlertCircle } from 'lucide-react';
import { useUserQuotas, formatQuotaDisplay, getQuotaPercentage } from '@/hooks/useUserQuotas';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EbookQuotaDisplay: React.FC = () => {
  const { quotas, isLoading, hasSubscription } = useUserQuotas();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasSubscription || !quotas) {
    return (
      <Card className="border-amber-500/50 bg-amber-500/5">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center gap-4">
            <AlertCircle className="w-12 h-12 text-amber-500" />
            <div>
              <h3 className="font-semibold text-lg">Aucun abonnement actif</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Souscrivez à une offre pour accéder au générateur d'ebooks
              </p>
            </div>
            <Button onClick={() => navigate('/offres')} className="mt-2">
              <Crown className="w-4 h-4 mr-2" />
              Voir les offres
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const planColors = {
    starter: 'bg-green-500',
    pro: 'bg-amber-500',
    lifetime: 'bg-gradient-to-r from-purple-500 to-pink-500',
  };

  const planNames = {
    starter: 'Starter',
    pro: 'Pro',
    lifetime: 'Lifetime',
  };

  const quotaItems = [
    {
      key: 'ebook_plans',
      label: 'Plans d\'ebook',
      icon: BookOpen,
      quota: quotas.ebook_plans,
    },
    {
      key: 'chapters',
      label: 'Chapitres',
      icon: FileText,
      quota: quotas.chapters,
    },
    {
      key: 'subchapters',
      label: 'Sous-chapitres',
      icon: Layers,
      quota: quotas.subchapters,
    },
    {
      key: 'covers',
      label: 'Couvertures',
      icon: Image,
      quota: quotas.covers,
    },
  ];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Vos Quotas
          </CardTitle>
          <Badge className={`${planColors[quotas.plan as keyof typeof planColors] || planColors.starter} text-white`}>
            {planNames[quotas.plan as keyof typeof planNames] || quotas.plan}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {quotaItems.map(({ key, label, icon: Icon, quota }) => {
          const percentage = getQuotaPercentage(quota);
          const isUnlimited = quota.limit === -1;
          const isLow = !isUnlimited && quota.remaining <= 2 && quota.remaining > 0;
          const isExhausted = !isUnlimited && quota.remaining === 0;

          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isExhausted ? 'text-destructive' : isLow ? 'text-amber-500' : 'text-muted-foreground'}`} />
                  <span className={isExhausted ? 'text-destructive' : ''}>{label}</span>
                </div>
                <span className={`font-medium ${isExhausted ? 'text-destructive' : isLow ? 'text-amber-500' : ''}`}>
                  {formatQuotaDisplay(quota)}
                </span>
              </div>
              {!isUnlimited && (
                <Progress 
                  value={percentage} 
                  className={`h-2 ${isExhausted ? '[&>div]:bg-destructive' : isLow ? '[&>div]:bg-amber-500' : ''}`}
                />
              )}
              {isUnlimited && (
                <div className="h-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-purple-500 font-medium">∞ ILLIMITÉ</span>
                </div>
              )}
            </div>
          );
        })}

        {quotas.plan !== 'lifetime' && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-4"
            onClick={() => navigate('/offres')}
          >
            <Crown className="w-4 h-4 mr-2" />
            Passer à une offre supérieure
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EbookQuotaDisplay;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Copy, Users, DollarSign, Clock, CheckCircle, Gift, ArrowLeft, Share2, Link, TrendingUp } from 'lucide-react';
import { useReferral } from '@/hooks/useReferral';

const ParrainagePage = () => {
  const navigate = useNavigate();
  const { code, stats, referrals, loading, getReferralLink } = useReferral();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const link = getReferralLink();
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Lien de parrainage copié !');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    const link = getReferralLink();
    if (!link) return;
    if (navigator.share) {
      await navigator.share({
        title: 'EbookStudio Pro - Générateur d\'Ebook IA',
        text: 'Crée ton ebook avec l\'IA en quelques minutes ! Utilise mon lien pour commencer :',
        url: link,
      });
    } else {
      copyLink();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const totalReferrals = stats?.total_referrals ?? 0;
  const converted = stats?.converted ?? 0;
  const conversionRate = totalReferrals > 0 ? ((converted / totalReferrals) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Programme de Parrainage</h1>
            <p className="text-muted-foreground">
              Gagnez des commissions sur chaque vente
            </p>
          </div>
        </div>

        {/* Referral Link Card */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Votre lien de parrainage
            </CardTitle>
            <CardDescription>
              Partagez ce lien — quand quelqu'un s'inscrit et paye, vous gagnez une commission
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-background border rounded-lg px-4 py-3 text-sm font-mono truncate">
                {getReferralLink() || 'Connexion requise...'}
              </code>
              <Button onClick={copyLink} variant={copied ? "default" : "outline"} size="icon">
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={copyLink} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copier le lien
              </Button>
              <Button onClick={shareLink} variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>
            {code && (
              <p className="text-xs text-muted-foreground text-center">
                Votre code : <Badge variant="secondary">{code}</Badge>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-3xl font-bold">{totalReferrals}</div>
              <p className="text-sm text-muted-foreground">Total filleuls</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-3xl font-bold">{stats?.pending ?? 0}</div>
              <p className="text-sm text-muted-foreground">En attente</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-3xl font-bold">{converted}</div>
              <p className="text-sm text-muted-foreground">Convertis</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold">{conversionRate}%</div>
              <p className="text-sm text-muted-foreground">Taux conversion</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
              <div className="text-3xl font-bold">{stats?.total_commission ?? 0}€</div>
              <p className="text-sm text-muted-foreground">Commissions</p>
            </CardContent>
          </Card>
        </div>

        {/* Commission Details */}
        {stats && (stats.unpaid_commission > 0 || stats.paid_commission > 0) && (
          <Card>
            <CardHeader>
              <CardTitle>Détail des commissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center py-2 border-b">
                <span>À percevoir</span>
                <Badge variant="outline" className="text-lg">{stats.unpaid_commission}€</Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Déjà versées</span>
                <Badge variant="secondary" className="text-lg">{stats.paid_commission}€</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Referrals List */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des parrainages</CardTitle>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Gift className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Aucun filleul pour le moment</p>
                <p className="text-sm mt-1">Partagez votre lien pour commencer à gagner des commissions !</p>
              </div>
            ) : (
              <div className="space-y-3">
                {referrals.map((ref) => (
                  <div key={ref.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{ref.referred_email}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(ref.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {ref.status === 'converted' && (
                        <span className="text-sm font-medium text-green-600">+{ref.commission_amount}€</span>
                      )}
                      <Badge variant={ref.status === 'converted' ? 'default' : 'secondary'}>
                        {ref.status === 'converted' ? 'Converti' : 'En attente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* How it works */}
        <Card>
          <CardHeader>
            <CardTitle>Comment ça marche ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-primary">1</span>
                </div>
                <h4 className="font-semibold">Partagez</h4>
                <p className="text-sm text-muted-foreground">Envoyez votre lien unique à vos contacts</p>
              </div>
              <div className="text-center p-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-primary">2</span>
                </div>
                <h4 className="font-semibold">Ils s'inscrivent</h4>
                <p className="text-sm text-muted-foreground">Votre filleul crée son compte et achète l'accès</p>
              </div>
              <div className="text-center p-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-primary">3</span>
                </div>
                <h4 className="font-semibold">Vous gagnez</h4>
                <p className="text-sm text-muted-foreground">De 1.85€ à 30€ par vente selon le palier</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-center">Barème des commissions</h4>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-semibold">Offre Fondateur (37€)</p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Filleuls 1 à 5 : <strong>5%</strong> = 1.85€/vente</li>
                    <li>• Filleuls 6 à 25 : <strong>10€</strong>/vente</li>
                  </ul>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-semibold">Offre Pro Lifetime (147€)</p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• <strong>30€</strong> par vente (tous paliers)</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParrainagePage;

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Crown, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import V3UpsellCheckout from '@/components/admin/V3UpsellCheckout';
import CoverProKeyVault from '@/components/cover-studio-pro/CoverProKeyVault';
import CoverProIllustrationPanel from '@/components/cover-studio-pro/CoverProIllustrationPanel';
import useCoverProAccess from '@/hooks/useCoverProAccess';
import type { V3UpsellPack } from '@/data/roadmapV3';

const COVER_PRO_PACK: V3UpsellPack = {
  id: 'cover_studio_pro',
  title: 'Cover Studio KDP Pro',
  desc: 'Illustrations de couverture professionnelles générées par IA, sans aucun texte, dans votre espace privé.',
  price: 67,
  priceId: 'v3_pack_cover_studio_pro_once',
  to: '/v3/cover-pro',
  modules: [],
  badge: 'Pro',
};

/**
 * Cover Studio KDP Pro — module indépendant (67 €, paiement unique).
 * 3 générations incluses une seule fois, puis clé API personnelle chiffrée.
 * Aucun crédit Lovable n'est utilisé. Les anciens modules de couverture restent
 * inchangés et accessibles séparément.
 */
export default function CoverProPage() {
  const { hasAccess, reason, credits, key, loading, error, refresh } = useCoverProAccess();
  const [checkout, setCheckout] = useState(false);
  const [params] = useSearchParams();

  // Ouverture directe du tunnel de paiement (lien « Voir l'offre 67 € »).
  useEffect(() => {
    if (params.get('checkout') === '1' && !loading && !hasAccess) setCheckout(true);
  }, [params, loading, hasAccess]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <header className="space-y-2">
        <Badge className="gap-1"><Crown className="h-3 w-3" /> Cover Studio KDP Pro</Badge>
        <h1 className="text-2xl font-bold sm:text-3xl">Une couverture digne d'une maison d'édition</h1>
        <p className="text-muted-foreground">
          Illustration générée par IA en portrait haute résolution, sans titre ni logo, enregistrée
          dans votre espace privé. Aucun numéro ISBN n'est demandé.
        </p>
      </header>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {!hasAccess ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="h-4 w-4" /> Module à débloquer — 67 €, paiement unique
            </CardTitle>
            <CardDescription>
              Comprend 3 générations offertes, une seule fois. Ensuite, vous connectez votre propre
              clé API OpenAI : vous ne payez que votre consommation réelle, sans abonnement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => setCheckout(true)}>
              Débloquer Cover Studio KDP Pro — 67 € <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-muted-foreground">
              Vos anciens outils de couverture restent disponibles sans changement.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 p-3 text-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Accès actif {reason === 'admin' ? '(administrateur)' : '(achat enregistré)'} ·{' '}
            {credits.remaining} / {credits.granted} génération(s) incluse(s) restante(s)
            <Link to="/v3/mes-couvertures" className="ml-auto underline">Mes couvertures</Link>
          </div>

          <CoverProIllustrationPanel
            remaining={credits.remaining}
            hasKey={Boolean(key)}
            onGenerated={refresh}
          />

          <CoverProKeyVault keyInfo={key} onChanged={refresh} />
        </>
      )}

      {checkout && <V3UpsellCheckout pack={COVER_PRO_PACK} onClose={() => setCheckout(false)} />}
    </div>
  );
}

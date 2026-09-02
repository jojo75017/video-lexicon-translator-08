import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ExternalLink, Eye, EyeOff, Loader2, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStripeEnvironment } from '@/lib/stripe';
import {
  isPreviewingAsSubscriber,
  setPreviewingAsSubscriber,
} from '@/components/v3/V3ContemplationMode';

type EntitlementRow = {
  module: string;
  status: string;
  environment: string;
  amount: number | null;
  created_at: string;
};

const TUNNEL_LINKS = [
  { label: 'Page de vente (17 €)', path: '/bd-offre' },
  { label: 'Page d’upsell Pro (47 €)', path: '/bd-upsell' },
  { label: 'Page de remerciement', path: '/bd-merci' },
  { label: 'Dashboard Studio BD', path: '/bd-studio' },
];

/**
 * Panneau de test du tunnel Studio BD & Jeunesse, réservé à l'admin.
 * Permet de parcourir le tunnel, de s'accorder un accès de test sans payer
 * et de revenir à zéro.
 */
export default function AdminTestBdPage() {
  const [rows, setRows] = useState<EntitlementRow[]>([]);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [preview, setPreview] = useState(isPreviewingAsSubscriber);

  let environment = 'sandbox';
  try {
    environment = getStripeEnvironment();
  } catch {
    environment = 'non configuré';
  }

  const call = useCallback(async (action: string) => {
    setBusy(action);
    try {
      const { data, error } = await supabase.functions.invoke('bd-test-access', {
        body: { action, environment },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.email) setEmail(data.email);
      if (Array.isArray(data?.rows)) setRows(data.rows as EntitlementRow[]);
      return data;
    } catch (err) {
      toast.error((err as Error).message || 'Action impossible');
      return null;
    } finally {
      setBusy(null);
    }
  }, [environment]);

  useEffect(() => {
    void call('status');
  }, [call]);

  const togglePreview = () => {
    const next = !preview;
    setPreviewingAsSubscriber(next);
    setPreview(next);
    toast.info(next
      ? 'Aperçu visiteur activé : le Studio BD se comporte comme pour un non-acheteur.'
      : 'Mode admin rétabli : le Studio BD est ouvert.');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <header className="space-y-2">
        <Badge variant="outline" className="gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" /> Admin
        </Badge>
        <h1 className="text-2xl font-bold">Tester le tunnel Studio BD &amp; Jeunesse</h1>
        <p className="text-sm text-muted-foreground">
          Environnement de paiement actuel : <strong>{environment}</strong>
          {email ? <> — vos accès sont testés sur <strong>{email}</strong></> : null}
        </p>
      </header>

      <Card>
        <CardHeader><CardTitle className="text-base">1. Parcourir le tunnel</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {TUNNEL_LINKS.map(({ label, path }) => (
            <Button key={path} asChild variant="outline" size="sm">
              <Link to={path}>
                {label} <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">2. Voir comme un visiteur</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Activez cet aperçu pour que le Studio BD vous traite comme un non-acheteur :
            vous serez redirigé vers la page de vente, exactement comme un visiteur.
            L’aperçu se réinitialise au rechargement de la page.
          </p>
          <Button type="button" variant={preview ? 'default' : 'outline'} size="sm" onClick={togglePreview}>
            {preview ? <EyeOff className="mr-1.5 h-4 w-4" /> : <Eye className="mr-1.5 h-4 w-4" />}
            {preview ? 'Revenir en mode admin' : 'Voir comme un visiteur'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">3. Accès de test sans paiement</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Ces boutons écrivent un droit d’accès de test sur votre email, afin de vérifier
            que l’achat déverrouille bien le studio (et la version Pro).
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" disabled={busy !== null} onClick={() => void call('grant').then((d) => d && toast.success('Accès 17 € accordé'))}>
              {busy === 'grant' && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              M’accorder l’accès 17 €
            </Button>
            <Button size="sm" variant="secondary" disabled={busy !== null} onClick={() => void call('grant_pro').then((d) => d && toast.success('Accès Pro 47 € accordé'))}>
              {busy === 'grant_pro' && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              M’accorder l’accès Pro 47 €
            </Button>
            <Button size="sm" variant="outline" disabled={busy !== null} onClick={() => void call('revoke').then((d) => d && toast.success('Accès de test retirés')).then(() => void call('status'))}>
              <Trash2 className="mr-1.5 h-4 w-4" /> Retirer mes accès de test
            </Button>
            <Button size="sm" variant="ghost" disabled={busy !== null} onClick={() => void call('status')}>
              <RefreshCw className="mr-1.5 h-4 w-4" /> Actualiser
            </Button>
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
            {rows.length === 0 ? (
              <span className="text-muted-foreground">Aucun droit d’accès BD enregistré sur votre email.</span>
            ) : (
              <ul className="space-y-1">
                {rows.map((r) => (
                  <li key={`${r.module}-${r.environment}-${r.created_at}`} className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{r.module}</Badge>
                    <span>{r.status}</span>
                    <span className="text-muted-foreground">· {r.environment}</span>
                    {r.amount ? <span className="text-muted-foreground">· {r.amount} €</span> : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">4. Tester un vrai paiement</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Le paiement carte utilise l’environnement <strong>{environment}</strong>. En mode
            sandbox, payez avec la carte de test <strong>4242 4242 4242 4242</strong>, une date
            future et n’importe quel CVC : le parcours complet est validé, webhook inclus.
          </p>
          <p>
            En mode live, tout paiement est réel : utilisez de préférence les accès de test
            ci-dessus pour vos vérifications.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

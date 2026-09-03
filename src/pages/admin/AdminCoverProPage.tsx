import { useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Administration du droit d'accès Cover Studio KDP Pro.
 * Le droit est accordé ou retiré côté serveur (`cover-pro-admin`), après
 * vérification du rôle administrateur. Les 3 générations incluses ne sont
 * jamais recréditées, même après une révocation puis un nouvel octroi.
 */
export default function AdminCoverProPage() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<unknown>(null);

  const call = async (action: 'status' | 'grant' | 'revoke') => {
    setBusy(action);
    try {
      const { data, error } = await supabase.functions.invoke('cover-pro-admin', {
        body: { action, email: email.trim().toLowerCase() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
      if (action !== 'status') toast.success(action === 'grant' ? 'Accès accordé.' : 'Accès retiré.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Opération impossible');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4 text-primary" /> Cover Studio KDP Pro — accès abonné
          </CardTitle>
          <CardDescription>Accordez ou retirez le droit d'accès au module pour un email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cp-admin-email">Email de l'abonné</Label>
            <Input
              id="cp-admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abonne@exemple.fr"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" disabled={busy !== null || !email} onClick={() => call('status')}>
              {busy === 'status' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Vérifier'}
            </Button>
            <Button disabled={busy !== null || !email} onClick={() => call('grant')}>
              {busy === 'grant' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Accorder l\u2019accès'}
            </Button>
            <Button variant="ghost" disabled={busy !== null || !email} onClick={() => call('revoke')}>
              {busy === 'revoke' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Retirer l\u2019accès'}
            </Button>
          </div>
          {result != null && (
            <pre className="max-h-64 overflow-auto rounded-lg border bg-muted/40 p-3 text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

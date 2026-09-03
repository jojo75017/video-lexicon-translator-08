import { useState } from 'react';
import { KeyRound, Loader2, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { CoverProKeyInfo } from '@/hooks/useCoverProAccess';

interface Props {
  keyInfo: CoverProKeyInfo | null;
  onChanged: () => void;
}

/**
 * Coffre de la clé API personnelle OpenAI de Cover Studio KDP Pro.
 * La clé saisie part directement vers la fonction serveur, qui la teste puis la
 * chiffre. Elle n'est jamais conservée dans le navigateur ni dans localStorage,
 * et seul un aperçu masqué revient du serveur.
 */
export default function CoverProKeyVault({ keyInfo, onChanged }: Props) {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState<null | 'save' | 'test' | 'delete'>(null);

  const call = async (action: 'save' | 'test' | 'delete') => {
    setBusy(action);
    try {
      const body: Record<string, unknown> = { action };
      if (action === 'save') body.apiKey = value;
      const { data, error } = await supabase.functions.invoke('cover-pro-key', { body });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (action === 'save') {
        setValue('');
        toast.success('Clé vérifiée et enregistrée de façon chiffrée.');
      } else if (action === 'delete') {
        toast.success('Clé supprimée du coffre.');
      } else {
        toast[data?.ok ? 'success' : 'error'](
          data?.ok ? 'Clé valide auprès d\u2019OpenAI.' : (data?.error ?? 'Clé refusée.'),
        );
      }
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Opération impossible');
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <KeyRound className="h-4 w-4 text-primary" /> Votre clé API OpenAI
        </CardTitle>
        <CardDescription>
          Utilisée uniquement après vos 3 générations incluses. Elle est chiffrée sur nos serveurs,
          jamais enregistrée dans votre navigateur et jamais affichée en entier.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {keyInfo ? (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/40 p-3 text-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="font-mono">{keyInfo.mask}</span>
            {keyInfo.lastTestOk === false && (
              <span className="text-destructive">dernier test échoué</span>
            )}
            <div className="ml-auto flex gap-2">
              <Button size="sm" variant="outline" disabled={busy !== null} onClick={() => call('test')}>
                {busy === 'test' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Tester'}
              </Button>
              <Button size="sm" variant="ghost" disabled={busy !== null} onClick={() => call('delete')}>
                {busy === 'delete' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Aucune clé personnelle enregistrée.</p>
        )}

        <div className="space-y-2">
          <Label htmlFor="cover-pro-key">{keyInfo ? 'Remplacer la clé' : 'Ajouter votre clé'}</Label>
          <div className="flex gap-2">
            <Input
              id="cover-pro-key"
              type="password"
              autoComplete="off"
              placeholder="sk-…"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Button disabled={busy !== null || value.trim().length < 20} onClick={() => call('save')}>
              {busy === 'save' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

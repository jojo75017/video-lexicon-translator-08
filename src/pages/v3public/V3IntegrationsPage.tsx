import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plug, Lock, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import BackButton from '@/components/v3/BackButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

interface ProviderDef {
  id: string;
  label: string;
  hint: string;
  needsList?: boolean;
  needsWebhook?: boolean;
}

const PROVIDERS: ProviderDef[] = [
  { id: 'brevo', label: 'Brevo', hint: 'Clé API v3 (Brevo → SMTP & API)', needsList: true },
  { id: 'systemeio', label: 'Systeme.io', hint: 'Clé API (Réglages → Clés API)', needsList: true },
  { id: 'getresponse', label: 'GetResponse', hint: 'Clé API (Intégrations → API)', needsList: true },
  { id: 'mailerlite', label: 'MailerLite', hint: 'Token API', needsList: true },
  { id: 'webhook', label: 'Autre outil (webhook)', hint: 'URL appelée à chaque nouveau contact', needsWebhook: true },
];

interface RowState {
  api_key: string;
  list_id: string;
  webhook_url: string;
  saved: boolean;
}

const EMPTY_ROW: RowState = { api_key: '', list_id: '', webhook_url: '', saved: false };

/** Intégrations e-mailing privées de l'abonné. */
export default function V3IntegrationsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [rows, setRows] = useState<Record<string, RowState>>(
    Object.fromEntries(PROVIDERS.map((p) => [p.id, { ...EMPTY_ROW }])),
  );
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user ?? null;
      if (cancelled) return;
      setUserId(user?.id ?? null);

      if (user) {
        const { data: list } = await (supabase as any)
          .from('subscriber_integrations')
          .select('provider, api_key, list_id, webhook_url')
          .eq('user_id', user.id);
        if (!cancelled && Array.isArray(list)) {
          setRows((cur) => {
            const next = { ...cur };
            list.forEach((r: any) => {
              if (!next[r.provider]) return;
              next[r.provider] = {
                api_key: r.api_key ?? '',
                list_id: r.list_id ?? '',
                webhook_url: r.webhook_url ?? '',
                saved: true,
              };
            });
            return next;
          });
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const patch = (provider: string, key: keyof RowState, value: string) =>
    setRows((cur) => ({ ...cur, [provider]: { ...cur[provider], [key]: value } }));

  const handleSave = async (p: ProviderDef) => {
    if (!userId) {
      toast.error('Connectez-vous pour enregistrer une intégration.');
      return;
    }
    const row = rows[p.id];
    if (p.needsWebhook) {
      if (!/^https:\/\/[^\s]{4,}$/i.test(row.webhook_url.trim())) {
        toast.error('L’URL du webhook doit commencer par https://');
        return;
      }
    } else if (row.api_key.trim().length < 10) {
      toast.error('La clé API semble trop courte.');
      return;
    }

    setBusy(p.id);
    const { error } = await (supabase as any).from('subscriber_integrations').upsert(
      {
        user_id: userId,
        provider: p.id,
        api_key: row.api_key.trim() || null,
        list_id: row.list_id.trim() || null,
        webhook_url: row.webhook_url.trim() || null,
        status: 'connected',
      },
      { onConflict: 'user_id,provider' },
    );
    setBusy(null);
    if (error) toast.error(error.message);
    else {
      setRows((cur) => ({ ...cur, [p.id]: { ...cur[p.id], saved: true } }));
      toast.success(`${p.label} est enregistré.`);
    }
  };

  const handleDelete = async (p: ProviderDef) => {
    if (!userId) return;
    setBusy(p.id);
    const { error } = await (supabase as any)
      .from('subscriber_integrations')
      .delete()
      .eq('user_id', userId)
      .eq('provider', p.id);
    setBusy(null);
    if (error) toast.error(error.message);
    else {
      setRows((cur) => ({ ...cur, [p.id]: { ...EMPTY_ROW } }));
      toast.success(`${p.label} est déconnecté.`);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Helmet>
        <title>Mes intégrations e-mailing — Ebookstudio</title>
        <meta
          name="description"
          content="Reliez Brevo, Systeme.io, GetResponse, MailerLite ou votre propre webhook pour envoyer vos contacts lecteurs vers votre outil d'e-mailing."
        />
      </Helmet>

      <BackButton to="/v3/fonctionnalites" label="Retour aux fonctionnalités" />

      <header className="mb-6 mt-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold" style={{ color: 'var(--v3-ink)' }}>
          <Plug className="h-6 w-6" style={{ color: 'var(--v3-emerald)' }} />
          Mes intégrations
        </h1>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--v3-muted)' }}>
          Envoyez automatiquement vos contacts lecteurs vers votre outil d'e-mailing.
        </p>
        <p
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: 'rgba(6,78,59,0.08)', color: 'var(--v3-emerald)' }}
        >
          <Lock className="h-3.5 w-3.5" /> Vos clés sont visibles par vous seul
        </p>
      </header>

      {!userId && !loading && (
        <p className="mb-4 rounded-xl bg-white p-4 text-[13.5px]" style={{ border: '1px solid var(--v3-line)', color: 'var(--v3-muted)' }}>
          Connectez-vous pour enregistrer vos intégrations.
        </p>
      )}

      <div className="space-y-4">
        {PROVIDERS.map((p) => {
          const row = rows[p.id];
          return (
            <section key={p.id} className="rounded-2xl bg-white p-5" style={{ border: '1px solid var(--v3-line)' }}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-bold" style={{ color: 'var(--v3-ink)' }}>{p.label}</h2>
                  <p className="text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>{p.hint}</p>
                </div>
                {row.saved && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.12em]"
                    style={{ background: 'var(--v3-emerald-50)', color: 'var(--v3-emerald)' }}
                  >
                    Connecté
                  </span>
                )}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {p.needsWebhook ? (
                  <div className="sm:col-span-2">
                    <Label htmlFor={`${p.id}-webhook`} className="text-[13px]">URL du webhook</Label>
                    <Input
                      id={`${p.id}-webhook`}
                      type="url"
                      maxLength={300}
                      placeholder="https://…"
                      disabled={loading}
                      value={row.webhook_url}
                      onChange={(e) => patch(p.id, 'webhook_url', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <Label htmlFor={`${p.id}-key`} className="text-[13px]">Clé API</Label>
                      <Input
                        id={`${p.id}-key`}
                        type="password"
                        maxLength={300}
                        autoComplete="off"
                        placeholder="Collez votre clé"
                        disabled={loading}
                        value={row.api_key}
                        onChange={(e) => patch(p.id, 'api_key', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    {p.needsList && (
                      <div>
                        <Label htmlFor={`${p.id}-list`} className="text-[13px]">Identifiant de liste (optionnel)</Label>
                        <Input
                          id={`${p.id}-list`}
                          maxLength={100}
                          placeholder="ex. 12"
                          disabled={loading}
                          value={row.list_id}
                          onChange={(e) => patch(p.id, 'list_id', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => handleSave(p)} disabled={busy === p.id || loading || !userId} className="gap-2">
                  <Save className="h-4 w-4" /> {busy === p.id ? 'Enregistrement…' : 'Enregistrer'}
                </Button>
                {row.saved && (
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(p)}
                    disabled={busy === p.id}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" /> Déconnecter
                  </Button>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

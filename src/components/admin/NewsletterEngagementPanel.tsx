import { useCallback, useEffect, useMemo, useState } from 'react';
import { Copy, Download, MailX, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NEWSLETTERS, NEWSLETTER_TRACK_PREFIX } from '@/data/newslettersSystemeio';

interface EventRow {
  prospect_email: string;
  email_step: number | null;
}

const norm = (e: string) => e.toLowerCase().trim();

export function NewsletterEngagementPanel() {
  const [selected, setSelected] = useState<number | 'all'>('all');
  const [opens, setOpens] = useState<EventRow[]>([]);
  const [clicks, setClicks] = useState<EventRow[]>([]);
  const [prospects, setProspects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [o, c, p] = await Promise.all([
      supabase
        .from('email_opens')
        .select('prospect_email, email_step')
        .like('template_name', `${NEWSLETTER_TRACK_PREFIX}%`)
        .limit(20000),
      supabase
        .from('email_clicks')
        .select('prospect_email, email_step')
        .like('template_name', `${NEWSLETTER_TRACK_PREFIX}%`)
        .limit(20000),
      supabase
        .from('sales_prospects')
        .select('email, unsubscribed, status')
        .eq('unsubscribed', false)
        .limit(20000),
    ]);
    setLoading(false);
    const err = o.error || c.error || p.error;
    if (err) {
      toast.error('Chargement impossible : ' + err.message);
      return;
    }
    setOpens((o.data ?? []) as EventRow[]);
    setClicks((c.data ?? []) as EventRow[]);
    setProspects(
      ((p.data ?? []) as Array<{ email: string; status: string | null }>)
        .filter((r) => r.status !== 'client' && r.status !== 'converted')
        .map((r) => norm(r.email)),
    );
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const { openers, clickers, nonOpeners } = useMemo(() => {
    const match = (r: EventRow) => selected === 'all' || r.email_step === selected;
    const openSet = new Set(opens.filter(match).map((r) => norm(r.prospect_email)));
    const clickSet = new Set(clicks.filter(match).map((r) => norm(r.prospect_email)));
    const engaged = new Set([...openSet, ...clickSet]);
    const uniqueProspects = [...new Set(prospects)];
    return {
      openers: openSet,
      clickers: clickSet,
      nonOpeners: uniqueProspects.filter((e) => !engaged.has(e)).sort(),
    };
  }, [opens, clicks, prospects, selected]);

  const copyEmails = async () => {
    await navigator.clipboard.writeText(nonOpeners.join('\n'));
    toast.success(`${nonOpeners.length} emails copiés`);
  };

  const exportCsv = () => {
    const csv = ['email', ...nonOpeners].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `non-ouvrants-newsletter-${selected}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const relanceSubject =
    selected === 'all'
      ? 'Vous ne l’avez peut-être pas vu…'
      : `Vous ne l’avez peut-être pas vu : ${NEWSLETTERS.find((n) => n.number === selected)?.subject ?? ''}`;

  return (
    <Card className="rounded-2xl border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge className="rounded-full">Relance des non-ouvrants</Badge>
          <h2 className="mt-3 text-lg font-semibold text-foreground">
            Qui n’a ni ouvert ni cliqué
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Le HTML des newsletters contient désormais un pixel d’ouverture avec la balise
            d’email de Systeme.io. On peut donc isoler les prospects qui n’ont rien fait et
            les relancer depuis Systeme.io.
          </p>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl" onClick={() => void load()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Actualiser
        </Button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={selected === 'all' ? 'default' : 'outline'}
          className="rounded-xl"
          onClick={() => setSelected('all')}
        >
          Toutes
        </Button>
        {NEWSLETTERS.map((n) => (
          <Button
            key={n.id}
            size="sm"
            variant={selected === n.number ? 'default' : 'outline'}
            className="rounded-xl"
            onClick={() => setSelected(n.number)}
          >
            #{n.number}
          </Button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-xs uppercase text-muted-foreground">Ont ouvert</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{openers.size}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-xs uppercase text-muted-foreground">Ont cliqué</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{clickers.size}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-xs uppercase text-muted-foreground">N’ont rien fait</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {loading ? '…' : nonOpeners.length}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button size="sm" className="rounded-xl" onClick={() => void copyEmails()} disabled={!nonOpeners.length}>
          <Copy className="mr-2 h-4 w-4" /> Copier les emails
        </Button>
        <Button size="sm" variant="outline" className="rounded-xl" onClick={exportCsv} disabled={!nonOpeners.length}>
          <Download className="mr-2 h-4 w-4" /> Exporter en CSV
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl"
          onClick={async () => {
            await navigator.clipboard.writeText(relanceSubject);
            toast.success('Objet de relance copié');
          }}
        >
          <MailX className="mr-2 h-4 w-4" /> Copier l’objet de relance
        </Button>
      </div>

      {nonOpeners.length > 0 && (
        <div className="mt-4 max-h-56 overflow-y-auto rounded-xl border border-border p-3 text-sm text-muted-foreground">
          {nonOpeners.slice(0, 300).map((e) => (
            <div key={e}>{e}</div>
          ))}
          {nonOpeners.length > 300 && (
            <p className="mt-2 text-xs">… et {nonOpeners.length - 300} autres (dans le CSV).</p>
          )}
        </div>
      )}

      <div className="mt-5 rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Marche à suivre</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Collez le HTML de la newsletter dans Systeme.io (le pixel est déjà dedans).</li>
          <li>48 h après l’envoi, revenez ici et exportez les non-ouvrants.</li>
          <li>Importez le CSV dans Systeme.io avec le tag <strong>RELANCE-{selected === 'all' ? 'N' : selected}</strong>.</li>
          <li>Renvoyez le même email à ce tag, avec l’objet de relance copié ci-dessus.</li>
        </ol>
        <p className="mt-3 text-xs">
          Gmail et Outlook bloquent ou mettent en cache les images : le nombre d’ouvertures est
          sous-estimé. Le clic reste le signal fiable, c’est pourquoi les cliqueurs sont exclus
          de la relance même sans ouverture enregistrée.
        </p>
      </div>
    </Card>
  );
}

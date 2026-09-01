import { useCallback, useEffect, useState } from 'react';
import { MousePointerClick, RefreshCw, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  NEWSLETTERS,
  NEWSLETTER_TRACK_PREFIX,
  newsletterDestination,
} from '@/data/newslettersSystemeio';

interface ClickRow {
  prospect_email: string;
  clicked_url: string;
  template_name: string | null;
  email_step: number | null;
  clicked_at: string;
}

interface Bucket {
  clicks: number;
  emails: Set<string>;
}

const emptyBucket = (): Bucket => ({ clicks: 0, emails: new Set<string>() });

export function NewsletterClicksPanel() {
  const [rows, setRows] = useState<ClickRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('email_clicks')
      .select('prospect_email, clicked_url, template_name, email_step, clicked_at')
      .like('template_name', `${NEWSLETTER_TRACK_PREFIX}%`)
      .order('clicked_at', { ascending: false })
      .limit(5000);
    setLoading(false);
    if (error) {
      toast.error("Impossible de charger les clics : " + error.message);
      return;
    }
    setRows((data ?? []) as ClickRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const byDestination = new Map<string, Bucket>();
  const byNewsletter = new Map<number, Bucket>();

  const isIdentified = (email: string) => !email.endsWith('@systemeio.local');

  for (const r of rows) {
    const email = r.prospect_email.toLowerCase();
    const dest = newsletterDestination(r.clicked_url);
    const d = byDestination.get(dest) ?? emptyBucket();
    d.clicks += 1;
    if (isIdentified(email)) d.emails.add(email);
    byDestination.set(dest, d);

    const num = r.email_step ?? 0;
    const n = byNewsletter.get(num) ?? emptyBucket();
    n.clicks += 1;
    if (isIdentified(email)) n.emails.add(email);
    byNewsletter.set(num, n);
  }

  const totalUnique = new Set(
    rows.map((r) => r.prospect_email.toLowerCase()).filter(isIdentified),
  ).size;
  const anonymousClicks = rows.filter((r) => !isIdentified(r.prospect_email.toLowerCase())).length;
  const priority = ['/essai', '/commander'];
  const destinations = [...byDestination.entries()].sort(
    (a, b) =>
      (priority.indexOf(b[0]) + 1 || 0) - (priority.indexOf(a[0]) + 1 || 0) ||
      b[1].clicks - a[1].clicks,
  );

  return (
    <Card className="rounded-2xl border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge className="rounded-full">Clics Systeme.io</Badge>
          <h2 className="mt-3 text-lg font-semibold text-foreground">
            Combien de prospects cliquent réellement
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Chaque bouton des newsletters passe par le traceur avant d'ouvrir la page. L'email du
            contact est fourni par Systeme.io, donc on compte les prospects uniques, pas seulement
            les clics.
          </p>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl" onClick={() => void load()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Actualiser
        </Button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-xs uppercase text-muted-foreground">Clics enregistrés</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{rows.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-xs uppercase text-muted-foreground">Prospects uniques</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{totalUnique}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-xs uppercase text-muted-foreground">Vers /commander</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {byDestination.get('/commander')?.emails.size ?? 0}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-foreground">Par destination</p>
        {destinations.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            {loading ? 'Chargement…' : "Aucun clic pour l'instant."}
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            {destinations.map(([dest, b]) => (
              <div
                key={dest}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-2 text-sm"
              >
                <span className="font-medium text-foreground">{dest}</span>
                <span className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {b.emails.size} prospects
                  </span>
                  <span className="flex items-center gap-1">
                    <MousePointerClick className="h-3.5 w-3.5" /> {b.clicks} clics
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-foreground">Par newsletter</p>
        <div className="mt-2 space-y-2">
          {NEWSLETTERS.map((n) => {
            const b = byNewsletter.get(n.number);
            return (
              <div
                key={n.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-4 py-2 text-sm"
              >
                <span className="text-foreground">
                  <strong>#{n.number}</strong> — {n.subject}
                </span>
                <span className="text-muted-foreground">
                  {b ? `${b.emails.size} prospects · ${b.clicks} clics` : 'aucun clic'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        Les données n'apparaissent qu'après un envoi réel depuis Systeme.io : sur un email de test,
        la balise de fusion n'est pas remplacée et le clic n'est volontairement pas compté (la page
        s'ouvre quand même).
      </p>
    </Card>
  );
}

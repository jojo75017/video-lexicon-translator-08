import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Loader2,
  RefreshCw,
  Rocket,
  Users,
  PenLine,
  Mail,
  Crown,
  ToggleLeft,
  ToggleRight,
  Headphones,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminPanelNav from '@/components/admin/AdminPanelNav';
import { AdminGate } from '@/components/auth/AdminGate';
import useLaunchSettings, { type LaunchSettingKey } from '@/hooks/useLaunchSettings';
import { formatPrice, V3_PLANS } from '@/data/v3Pricing';
import { LAUNCH_SCRIPT_LONG, LAUNCH_SCRIPT_SHORT } from '@/data/launchMediaScript';


interface TrialRow {
  id: string;
  email: string | null;
  book_idea: string;
  proposed_title: string | null;
  word_count: number | null;
  language: string | null;
  delivered_at: string | null;
  converted_at: string | null;
  created_at: string;
}

interface WaitlistRow {
  id: string;
  email: string;
  plan: string;
  billing_interval: string;
  status: string;
  rank: number;
  amount: number | null;
  trial_ends_at: string | null;
  source: string | null;
  created_at: string;
}

const SWITCHES: Array<{ key: LaunchSettingKey; label: string; help: string }> = [
  {
    key: 'free_trial_open',
    label: 'Essai gratuit ouvert',
    help: 'Autorise la génération du chapitre 1 gratuit sur /essai.',
  },
  {
    key: 'first_month_free_open',
    label: 'Premier mois offert',
    help: 'Applique la période d’essai Stripe jusqu’au 1er novembre 2026.',
  },
  {
    key: 'v3_open',
    label: 'Studio V3 ouvert',
    help: 'Ouvre l’accès complet : la salle d’attente laisse place au studio.',
  },
];

function fmtDate(value: string | null) {
  return value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—';
}

/** Pilotage du lancement du 1er septembre → ouverture du 1er octobre 2026. */
function AdminLancementContent() {
  const { settings, loading: settingsLoading, update, reload } = useLaunchSettings();
  const [trials, setTrials] = useState<TrialRow[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<LaunchSettingKey | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [savingVideo, setSavingVideo] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [t, w] = await Promise.all([
      supabase
        .from('trial_chapters')
        .select('id, email, book_idea, proposed_title, word_count, language, delivered_at, converted_at, created_at')
        .order('created_at', { ascending: false })
        .limit(200),
      supabase
        .from('launch_waitlist')
        .select('id, email, plan, billing_interval, status, rank, amount, trial_ends_at, source, created_at')
        .order('rank', { ascending: true })
        .limit(300),
    ]);
    if (t.error) toast.error(`Essais : ${t.error.message}`);
    if (w.error) toast.error(`Liste d’attente : ${w.error.message}`);
    setTrials((t.data ?? []) as TrialRow[]);
    setWaitlist((w.data ?? []) as WaitlistRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    document.title = 'Lancement V3 — Administration';
    void load();
  }, [load]);

  useEffect(() => {
    setVideoUrl(String(settings.launch_video?.url || ''));
  }, [settings.launch_video?.url]);

  /** Enregistre le lien de la vidéo de lancement (emails, /essai, /commander, /v3/attente). */
  const saveVideo = async () => {
    setSavingVideo(true);
    try {
      const url = videoUrl.trim();
      await update('launch_video', { enabled: url.length > 0, url });
      toast.success(url ? 'Vidéo enregistrée.' : 'Bloc vidéo masqué.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Enregistrement impossible.');
    } finally {
      setSavingVideo(false);
    }
  };

  const stats = useMemo(() => {
    const emailed = trials.filter((t) => t.delivered_at).length;
    const converted = trials.filter((t) => t.converted_at).length;
    const mrr = waitlist
      .filter((w) => w.status !== 'cancelled')
      .reduce((sum, w) => {
        const plan = V3_PLANS.find((p) => p.id === w.plan);
        if (!plan) return sum;
        return sum + (w.billing_interval === 'year' ? plan.yearlyPrice / 12 : plan.monthlyPrice);
      }, 0);
    return {
      trials: trials.length,
      emailed,
      converted,
      convRate: trials.length ? Math.round((converted / trials.length) * 100) : 0,
      members: waitlist.length,
      mrr: Math.round(mrr),
    };
  }, [trials, waitlist]);

  const toggle = async (key: LaunchSettingKey) => {
    setSaving(key);
    try {
      await update(key, { ...settings[key], enabled: !settings[key].enabled });
      toast.success('Réglage enregistré.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Enregistrement impossible.');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <AdminPanelNav />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Lancement
            </p>
            <h1 className="text-2xl font-bold text-foreground">
              Campagne 1<sup>er</sup> septembre → ouverture 1<sup>er</sup> octobre 2026
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => { void load(); void reload(); }}>
              <RefreshCw className="mr-2 h-4 w-4" /> Actualiser
            </Button>
            <Button asChild className="rounded-xl">
              <Link to="/essai" target="_blank">
                <Rocket className="mr-2 h-4 w-4" /> Voir la page d’essai
              </Link>
            </Button>
          </div>
        </div>

        {/* Indicateurs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: 'Chapitres d’essai générés', value: stats.trials, icon: PenLine },
            { label: 'Chapitres envoyés par email', value: stats.emailed, icon: Mail },
            { label: 'Essais convertis', value: `${stats.converted} (${stats.convRate} %)`, icon: Users },
            { label: 'Membres fondateurs', value: stats.members, icon: Crown },
            { label: 'MRR engagé', value: formatPrice(stats.mrr), icon: Rocket },
          ].map((s) => (
            <Card key={s.label} className="rounded-2xl">
              <CardContent className="p-5">
                <s.icon className="h-4 w-4 text-muted-foreground" />
                <p className="mt-3 text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Vidéo de lancement */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Lien de la vidéo de lancement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Collez l’URL de votre vidéo (YouTube ou autre). Elle apparaît aussitôt dans les emails de rappel,
              sur la page d’essai, sur la page de commande et dans le salon des membres fondateurs. Champ vide =
              bloc vidéo masqué partout.
            </p>
            <div className="flex flex-wrap gap-2">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="min-w-[280px] flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm"
              />
              <Button className="rounded-xl" onClick={() => void saveVideo()} disabled={savingVideo}>
                {savingVideo ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Enregistrer
              </Button>
              {videoUrl.trim() && (
                <Button asChild variant="outline" className="rounded-xl">
                  <a href={videoUrl.trim()} target="_blank" rel="noopener noreferrer">Ouvrir</a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Interrupteurs */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Interrupteurs du lancement</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {SWITCHES.map((s) => {
              const on = settings[s.key].enabled;
              return (
                <button
                  key={s.key}
                  type="button"
                  disabled={settingsLoading || saving === s.key}
                  onClick={() => void toggle(s.key)}
                  className={`rounded-xl border-2 p-4 text-left transition ${
                    on ? 'border-emerald-500/60 bg-emerald-500/5' : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">{s.label}</span>
                    {saving === s.key ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : on ? (
                      <ToggleRight className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{s.help}</p>
                  <Badge variant={on ? 'default' : 'secondary'} className="mt-3">
                    {on ? 'Actif' : 'Fermé'}
                  </Badge>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Membres fondateurs */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Membres fondateurs ({waitlist.length})</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : waitlist.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune inscription pour l’instant.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 pr-3">Rang</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Forfait</th>
                    <th className="py-2 pr-3">Statut</th>
                    <th className="py-2 pr-3">Fin d’essai</th>
                    <th className="py-2 pr-3">Origine</th>
                    <th className="py-2">Inscrit le</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.map((w) => (
                    <tr key={w.id} className="border-b last:border-0">
                      <td className="py-2 pr-3 font-semibold">#{w.rank}</td>
                      <td className="py-2 pr-3">{w.email}</td>
                      <td className="py-2 pr-3">
                        {w.plan} · {w.billing_interval === 'year' ? 'annuel' : 'mensuel'}
                      </td>
                      <td className="py-2 pr-3">
                        <Badge variant={w.status === 'active' ? 'default' : 'secondary'}>{w.status}</Badge>
                      </td>
                      <td className="py-2 pr-3">{fmtDate(w.trial_ends_at)}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{w.source ?? '—'}</td>
                      <td className="py-2 text-muted-foreground">{fmtDate(w.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Essais gratuits */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Chapitres d’essai ({trials.length})</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : trials.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun essai généré pour l’instant.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 pr-3">Titre proposé</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Mots</th>
                    <th className="py-2 pr-3">Langue</th>
                    <th className="py-2 pr-3">Envoyé</th>
                    <th className="py-2 pr-3">Converti</th>
                    <th className="py-2">Créé le</th>
                  </tr>
                </thead>
                <tbody>
                  {trials.map((t) => (
                    <tr key={t.id} className="border-b last:border-0">
                      <td className="max-w-[260px] truncate py-2 pr-3 font-medium" title={t.book_idea}>
                        {t.proposed_title ?? t.book_idea}
                      </td>
                      <td className="py-2 pr-3">{t.email ?? <span className="text-muted-foreground">anonyme</span>}</td>
                      <td className="py-2 pr-3">{t.word_count ?? '—'}</td>
                      <td className="py-2 pr-3 uppercase">{t.language ?? 'fr'}</td>
                      <td className="py-2 pr-3">
                        {t.delivered_at ? <Badge>envoyé</Badge> : <Badge variant="secondary">non</Badge>}
                      </td>
                      <td className="py-2 pr-3">
                        {t.converted_at ? (
                          <Badge className="bg-emerald-600">abonné</Badge>
                        ) : (
                          <Badge variant="secondary">en attente</Badge>
                        )}
                      </td>
                      <td className="py-2 text-muted-foreground">{fmtDate(t.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminLancementPage() {
  return (
    <AdminGate>
      <AdminLancementContent />
    </AdminGate>
  );
}

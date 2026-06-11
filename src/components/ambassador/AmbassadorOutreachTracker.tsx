import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Users, Plus, Trash2, Clock, TrendingUp, MessageCircle, CheckCircle2,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

interface Outreach {
  id: string;
  handle: string;
  platform: string;
  niche: string | null;
  status: string;
  email: string | null;
  notes: string | null;
  last_contact_at: string | null;
  follow_up_at: string | null;
  source: string;
}

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'autre', label: 'Autre' },
];

const STATUSES = [
  { value: 'a_contacter', label: 'À contacter', color: 'bg-[#232F3E]/10 text-[#232F3E]' },
  { value: 'message1', label: 'Message envoyé', color: 'bg-blue-100 text-blue-700' },
  { value: 'repondu', label: 'A répondu', color: 'bg-amber-100 text-amber-700' },
  { value: 'inscrit', label: 'Inscrit ✓', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'refuse', label: 'Pas intéressé', color: 'bg-rose-100 text-rose-700' },
];

const statusMeta = (s: string) => STATUSES.find((x) => x.value === s) || STATUSES[0];
const platformLabel = (p: string) => PLATFORMS.find((x) => x.value === p)?.label || p;

const DAY = 86_400_000;

const AmbassadorOutreachTracker: React.FC = () => {
  const [rows, setRows] = useState<Outreach[]>([]);
  const [loading, setLoading] = useState(true);
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [niche, setNiche] = useState('');
  const [adding, setAdding] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from('ambassador_outreach')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setRows(data as Outreach[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!handle.trim()) { toast.error('Indique au moins un pseudo.'); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Connecte-toi.'); return; }
    setAdding(true);
    const { error } = await supabase.from('ambassador_outreach').insert({
      owner_id: user.id,
      handle: handle.trim(),
      platform,
      niche: niche.trim() || null,
      status: 'a_contacter',
      source: 'manual',
    });
    setAdding(false);
    if (error) { toast.error(error.message); return; }
    setHandle(''); setNiche('');
    toast.success('Contact ajouté');
    load();
  };

  const setStatus = async (id: string, status: string) => {
    const patch: Record<string, unknown> = { status };
    if (status === 'message1') {
      patch.last_contact_at = new Date().toISOString();
      patch.follow_up_at = new Date(Date.now() + 3 * DAY).toISOString();
    }
    if (status === 'repondu' || status === 'inscrit' || status === 'refuse') {
      patch.follow_up_at = null;
    }
    const { error } = await supabase.from('ambassador_outreach').update(patch).eq('id', id);
    if (error) { toast.error(error.message); return; }
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } as Outreach : x)));
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('ambassador_outreach').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    setRows((r) => r.filter((x) => x.id !== id));
  };

  const exportCSV = () => {
    if (rows.length === 0) { toast.info('Aucune donnée à exporter'); return; }
    const headers = ['Pseudo', 'Plateforme', 'Niche', 'Statut', 'Email', 'Dernier contact', 'Relance', 'Notes'];
    const escape = (v: string | null) => {
      const s = (v ?? '').replace(/"/g, '""');
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
    };
    const lines = rows.map((r) => [
      escape(r.handle),
      escape(platformLabel(r.platform)),
      escape(r.niche),
      escape(statusMeta(r.status).label),
      escape(r.email),
      escape(r.last_contact_at ? new Date(r.last_contact_at).toLocaleDateString('fr-FR') : ''),
      escape(r.follow_up_at ? new Date(r.follow_up_at).toLocaleDateString('fr-FR') : ''),
      escape(r.notes),
    ].join(','));
    const csv = [headers.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suivi-recrutement-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success('Export CSV téléchargé');
  };

  const stats = useMemo(() => {
    const total = rows.length;
    const contacted = rows.filter((r) => r.status !== 'a_contacter').length;
    const replied = rows.filter((r) => ['repondu', 'inscrit'].includes(r.status)).length;
    const joined = rows.filter((r) => r.status === 'inscrit').length;
    const replyRate = contacted ? Math.round((replied / contacted) * 100) : 0;
    const convRate = contacted ? Math.round((joined / contacted) * 100) : 0;
    return { total, contacted, replied, joined, replyRate, convRate };
  }, [rows]);

  const needsFollowUp = (r: Outreach) =>
    r.status === 'message1' && r.follow_up_at && new Date(r.follow_up_at).getTime() <= Date.now();

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { v: stats.contacted, l: 'Contactés', i: MessageCircle, c: 'text-[#008296]' },
          { v: stats.replied, l: 'Réponses', i: TrendingUp, c: 'text-amber-600' },
          { v: stats.joined, l: 'Inscrits', i: CheckCircle2, c: 'text-emerald-600' },
          { v: `${stats.replyRate}%`, l: 'Taux de réponse', i: Users, c: 'text-[#232F3E]' },
        ].map((s) => (
          <div key={s.l} className="bg-white border border-[#232F3E]/10 rounded-xl p-4 text-center">
            <s.i className={`w-5 h-5 mx-auto mb-1 ${s.c}`} />
            <div className="text-2xl font-bold text-[#232F3E]">{s.v}</div>
            <div className="text-xs text-[#232F3E]/60">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Add */}
      <div className="bg-white border border-[#232F3E]/10 rounded-xl p-4">
        <div className="grid sm:grid-cols-[1fr_140px_1fr_auto] gap-2 items-end">
          <div>
            <label className="text-xs text-[#232F3E]/60 mb-1 block">Pseudo / @handle</label>
            <Input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@compte" />
          </div>
          <div>
            <label className="text-xs text-[#232F3E]/60 mb-1 block">Réseau</label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-[#232F3E]/60 mb-1 block">Niche</label>
            <Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="ex : fitness" />
          </div>
          <Button onClick={add} disabled={adding} style={{ background: '#008296', color: 'white' }}>
            <Plus className="w-4 h-4 mr-1" /> Ajouter
          </Button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-8 text-[#232F3E]/50">Chargement…</div>
      ) : rows.length === 0 ? (
        <div className="bg-white border border-dashed border-[#232F3E]/20 rounded-xl py-10 text-center text-[#232F3E]/55">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          Aucun contact pour l'instant. Ajoute les personnes que tu veux recruter ci-dessus.
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => {
            const m = statusMeta(r.status);
            const followUp = needsFollowUp(r);
            return (
              <div
                key={r.id}
                className={`bg-white border rounded-xl p-3 flex flex-wrap items-center gap-3 ${
                  followUp ? 'border-[#FF9E2D] ring-1 ring-[#FF9E2D]/40' : 'border-[#232F3E]/10'
                }`}
              >
                <div className="flex-1 min-w-[160px]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#232F3E]">{r.handle}</span>
                    <span className="text-xs text-[#232F3E]/50">{platformLabel(r.platform)}</span>
                    {r.source === 'self_service' && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">auto-inscrit</span>
                    )}
                  </div>
                  <div className="text-xs text-[#232F3E]/55">
                    {r.niche || '—'}{r.email ? ` · ${r.email}` : ''}
                  </div>
                </div>

                {followUp && (
                  <span className="flex items-center gap-1 text-xs text-[#FF9E2D] font-semibold">
                    <Clock className="w-3.5 h-3.5" /> À relancer
                  </span>
                )}

                <span className={`text-xs px-2 py-1 rounded-full ${m.color}`}>{m.label}</span>

                <Select value={r.status} onValueChange={(v) => setStatus(r.id, v)}>
                  <SelectTrigger className="w-[170px] h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>

                <button onClick={() => remove(r.id)} className="text-[#232F3E]/30 hover:text-rose-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AmbassadorOutreachTracker;

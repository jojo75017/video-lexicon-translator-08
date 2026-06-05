import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Copy, Plus, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const TEAL = '#008296';
const STORAGE_KEY = 'arc_team_members_v1';

type ArcStatus = 'invité' | 'accepté' | 'lu' | 'avis posté';
interface ArcMember { id: string; name: string; email: string; status: ArcStatus; }

const STATUSES: ArcStatus[] = ['invité', 'accepté', 'lu', 'avis posté'];
const GOALS = [
  { day: 'J+14', target: 10 },
  { day: 'J+30', target: 25 },
  { day: 'J+60', target: 50 },
];

const ArcTeamBuilder: React.FC = () => {
  const [members, setMembers] = useState<ArcMember[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  useEffect(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); if (s) setMembers(JSON.parse(s)); } catch { /* ignore */ }
  }, []);
  const persist = (next: ArcMember[]) => { setMembers(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };

  const add = () => {
    if (!name.trim()) return toast.error('Nom requis.');
    persist([...members, { id: crypto.randomUUID(), name: name.trim(), email: email.trim(), status: 'invité' }]);
    setName(''); setEmail('');
  };
  const cycle = (id: string) => persist(members.map((m) => m.id === id
    ? { ...m, status: STATUSES[(STATUSES.indexOf(m.status) + 1) % STATUSES.length] } : m));
  const remove = (id: string) => persist(members.filter((m) => m.id !== id));

  const reviews = members.filter((m) => m.status === 'avis posté').length;

  const run = async () => {
    if (!title.trim()) return toast.error('Titre requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Rédige un email d'invitation pour recruter des lecteurs ARC (Advance Review Copy) qui liront le livre en avant-première et laisseront un avis honnête sur Amazon (conforme aux règles : avis non rémunéré), en français.
Livre : "${title}"
${niche ? `Niche : ${niche}` : ''}

Fournis :
1. EMAIL D'INVITATION (objet + corps) : explique l'engagement, le calendrier, le bénéfice pour le lecteur.
2. POST de recrutement à publier dans groupes/réseaux.
3. Mini-charte ARC (3-4 règles claires et conformes Amazon).
Ton chaleureux et transparent. Format texte, pas de HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.7 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-joy-ink/70">
        Recrute 10–30 lecteurs ARC, suis leur statut et atteins tes objectifs d'avis (10 à J+14, 25 à J+30, 50 à J+60).
      </p>

      {/* Objectifs */}
      <div className="grid grid-cols-3 gap-2">
        {GOALS.map((g) => (
          <Card key={g.day} className="border-joy-ink/10"><CardContent className="p-3 text-center">
            <p className="text-[11px] text-joy-ink/50">{g.day}</p>
            <p className="text-lg font-bold" style={{ color: reviews >= g.target ? '#10B981' : TEAL }}>{reviews}/{g.target}</p>
            <p className="text-[10px] text-joy-ink/40">{reviews >= g.target ? '✓ atteint' : 'avis postés'}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Ajout membre */}
      <div className="flex gap-2 items-end flex-wrap">
        <div className="flex-1 min-w-[120px]"><Label className="text-xs">Nom</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="flex-1 min-w-[120px]"><Label className="text-xs">Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <Button onClick={add} style={{ background: TEAL, color: 'white' }}><Plus className="h-4 w-4" /></Button>
      </div>

      {/* Liste */}
      {members.length > 0 && (
        <Card className="border-joy-ink/10"><CardContent className="p-3 space-y-2">
          <p className="text-xs font-medium flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {members.length} lecteur(s)</p>
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-2 text-sm border-b border-joy-ink/5 pb-1.5">
              <span className="flex-1 truncate">{m.name} <span className="text-joy-ink/40 text-xs">{m.email}</span></span>
              <Badge onClick={() => cycle(m.id)} className="cursor-pointer" style={{ background: `${TEAL}22`, color: TEAL }}>{m.status}</Badge>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => remove(m.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
        </CardContent></Card>
      )}

      {/* Génération invitation */}
      <div className="space-y-3 pt-2 border-t border-joy-ink/10">
        <div className="grid gap-3 sm:grid-cols-2">
          <div><Label className="text-xs">Titre du livre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div><Label className="text-xs">Niche</Label><Input value={niche} onChange={(e) => setNiche(e.target.value)} /></div>
        </div>
        <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span className="ml-1.5">Générer email + post de recrutement</span>
        </Button>
        {output && (
          <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
            <Textarea rows={14} value={output} onChange={(e) => setOutput(e.target.value)} className="text-xs" />
            <Button variant="outline" size="sm" className="gap-1.5"
              onClick={() => { navigator.clipboard.writeText(output); toast.success('Copié ✓'); }}>
              <Copy className="h-3.5 w-3.5" /> Copier
            </Button>
          </CardContent></Card>
        )}
      </div>
    </div>
  );
};

export default ArcTeamBuilder;

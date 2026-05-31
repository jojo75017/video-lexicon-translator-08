import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Fingerprint, Sparkles, Check, X, Copy, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  voice_name: string;
  summary: string;
  tone: string;
  sentence_structure: string;
  vocabulary: string;
  pacing: string;
  signature_traits: string[];
  recurring_devices: string[];
  do: string[];
  dont: string[];
  style_prompt: string;
}

const EchoAuthorVoice: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const run = async () => {
    if (text.trim().length < 100) { toast.error('Colle un échantillon de ton écriture (min. 100 caractères).'); return; }
    setLoading(true); setProfile(null);
    try {
      const { data, error } = await supabase.functions.invoke('echo-author-voice', { body: { text: text.trim() } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setProfile(data.profile as Profile);
    } catch (e: any) {
      toast.error(e?.message || "Échec de l'extraction ÉCHO.");
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = async () => {
    if (!profile) return;
    await navigator.clipboard.writeText(profile.style_prompt);
    toast.success('Bloc de style copié.');
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Colle un extrait représentatif de ta plume…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
      />
      <Button onClick={run} disabled={loading} style={{ background: '#10B981', color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Extraire ma voix</span>
      </Button>

      {loading && <p className="text-sm text-joy-ink/60">ÉCHO capture ta signature stylistique…</p>}

      {profile && (
        <div className="space-y-4 text-sm">
          <div className="rounded-xl border p-3">
            <div className="mb-1 flex items-center gap-2">
              <Fingerprint className="h-4 w-4" style={{ color: '#10B981' }} />
              <span className="font-semibold">{profile.voice_name}</span>
            </div>
            <p className="text-joy-ink/70">{profile.summary}</p>
            <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
              <p><span className="font-medium">Ton :</span> {profile.tone}</p>
              <p><span className="font-medium">Rythme :</span> {profile.pacing}</p>
              <p><span className="font-medium">Phrases :</span> {profile.sentence_structure}</p>
              <p><span className="font-medium">Vocabulaire :</span> {profile.vocabulary}</p>
            </div>
          </div>

          <div>
            <p className="mb-1.5 font-semibold">Marqueurs signature</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.signature_traits.map((t, i) => <Badge key={i} variant="secondary">{t}</Badge>)}
            </div>
          </div>

          <div>
            <p className="mb-1.5 font-semibold">Procédés récurrents</p>
            <ul className="list-disc space-y-1 pl-5 text-joy-ink/70">
              {profile.recurring_devices.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-2.5">
              <p className="mb-1 flex items-center gap-1.5 font-semibold"><Check className="h-4 w-4" style={{ color: '#10B981' }} /> À faire</p>
              <ul className="list-disc space-y-1 pl-5 text-joy-ink/70">{profile.do.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </div>
            <div className="rounded-lg border p-2.5">
              <p className="mb-1 flex items-center gap-1.5 font-semibold"><X className="h-4 w-4" style={{ color: '#E94E77' }} /> À éviter</p>
              <ul className="list-disc space-y-1 pl-5 text-joy-ink/70">{profile.dont.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </div>
          </div>

          <div className="rounded-xl border p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="flex items-center gap-1.5 font-semibold"><Wand2 className="h-4 w-4" /> Bloc de style réutilisable</p>
              <Button size="sm" variant="ghost" onClick={copyPrompt}><Copy className="h-3.5 w-3.5" /> Copier</Button>
            </div>
            <pre className="whitespace-pre-wrap rounded-lg bg-joy-cream/40 p-2.5 text-[12px] text-joy-ink/80">{profile.style_prompt}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default EchoAuthorVoice;

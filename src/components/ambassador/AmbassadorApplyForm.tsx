import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'autre', label: 'Autre' },
];

const AmbassadorApplyForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [niche, setNiche] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!email.includes('@')) { toast.error('Email invalide.'); return; }
    if (!handle.trim() && !name.trim()) { toast.error('Indique ton pseudo.'); return; }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('submit-ambassador-application', {
        body: { name, email, handle, platform, niche },
      });
      if (error) throw error;
      if (!(data as any)?.success) throw new Error((data as any)?.error || 'Erreur');
      setDone(true);
      toast.success('Candidature envoyée ! Vérifie ta boîte mail 📩');
    } catch (e: any) {
      toast.error(e?.message || 'Impossible d\'envoyer la candidature.');
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="bg-[#008296]/5 border border-[#008296]/30 rounded-2xl p-8 text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
        <h2 className="text-2xl font-bold text-[#232F3E]">Candidature reçue 🎉</h2>
        <p className="text-[#232F3E]/70">
          On vient de t'envoyer un email avec ton kit et le lien pour activer ton lien
          ambassadeur. Pense à vérifier tes spams !
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-[#FF9E2D] rounded-2xl p-8 space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 bg-[#FF9E2D]/15 text-[#FF9E2D] px-2.5 py-1 rounded-full text-xs font-bold">
            🌐 Formulaire public
          </span>
          <span className="inline-flex items-center gap-1 bg-[#008296]/10 text-[#008296] px-2.5 py-1 rounded-full text-xs font-bold">
            👤 Rempli par l'influenceur
          </span>
        </div>
        <h2 className="text-2xl font-bold flex items-center gap-2 text-[#232F3E]">
          <Sparkles className="w-6 h-6 text-[#FF9E2D]" /> Deviens ambassadeur en 30 secondes
        </h2>
        <p className="text-sm text-[#232F3E]/65 mt-1">
          Ce formulaire est destiné aux influenceurs qui visitent cette page. Ils remplissent leurs coordonnées,
          reçoivent automatiquement par email leur kit complet et leur lien de suivi. 30% de commission sur chaque vente.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[#232F3E]/60 mb-1 block">Prénom de l'influenceur</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="ex : Sarah" />
        </div>
        <div>
          <label className="text-xs text-[#232F3E]/60 mb-1 block">Email de l'influenceur *</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ex : sarah@gmail.com" />
        </div>
        <div>
          <label className="text-xs text-[#232F3E]/60 mb-1 block">Pseudo / @handle de l'influenceur *</label>
          <Input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="ex : @sarah_creates" />
        </div>
        <div>
          <label className="text-xs text-[#232F3E]/60 mb-1 block">Réseau principal</label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PLATFORMS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-[#232F3E]/60 mb-1 block">Niche / thématique de l'influenceur</label>
          <Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="ex : développement perso, finance, cuisine…" />
        </div>
      </div>

      <Button
        onClick={submit}
        disabled={sending}
        style={{ background: '#FF9E2D', color: '#232F3E' }}
        className="w-full font-semibold"
      >
        {sending ? 'Envoi…' : 'Recevoir mon kit + mon lien'}
      </Button>
    </div>
  );
};

export default AmbassadorApplyForm;

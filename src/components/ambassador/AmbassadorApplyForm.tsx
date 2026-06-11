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
      <div className="bg-white border-2 border-emerald-300 rounded-2xl p-8 space-y-6 text-center">
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-emerald-100 animate-pulse" />
          <div className="relative w-full h-full rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#232F3E]">Candidature envoyée 🎉</h2>
          <p className="text-[#232F3E]/70 max-w-md mx-auto">
            Ton kit ambassadeur et ton lien de suivi personnalisé arrivent automatiquement par email.
          </p>
        </div>

        <div className="bg-[#FAFAFA] border border-[#232F3E]/10 rounded-xl p-5 text-left space-y-3 max-w-md mx-auto">
          <h3 className="font-bold text-[#232F3E] text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF9E2D]" /> Prochaines étapes
          </h3>
          <ul className="space-y-3 text-sm text-[#232F3E]/75">
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#008296]/10 text-[#008296] text-xs font-bold shrink-0">1</span>
              <span>Vérifie ta boîte email (et tes spams) dans les prochaines minutes.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#008296]/10 text-[#008296] text-xs font-bold shrink-0">2</span>
              <span>Télécharge le kit complet : mockups, scripts TikTok/Reels et visuels prêts à poster.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#008296]/10 text-[#008296] text-xs font-bold shrink-0">3</span>
              <span>Active ton lien de suivi perso pour commencer à tracker tes commissions (30% par vente).</span>
            </li>
          </ul>
        </div>

        <p className="text-xs text-[#232F3E]/50">
          Une question ? Écris-nous à <a href="mailto:georges@ebookstudio.fr" className="text-[#008296] underline">georges@ebookstudio.fr</a>
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

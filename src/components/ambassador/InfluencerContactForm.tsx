import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const InfluencerContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!email.includes('@')) { toast.error('Email invalide.'); return; }
    if (!message.trim()) { toast.error('Écris ton message.'); return; }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-subscriber-contact', {
        body: {
          email,
          name: name || handle,
          subject: handle ? `Influenceur ${handle}` : 'Contact influenceur',
          category: 'Programme Ambassadeur / Influenceur',
          message,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setDone(true);
      toast.success('Message envoyé ! Je te réponds vite 📩');
    } catch (e: any) {
      toast.error(e?.message || "Impossible d'envoyer le message.");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="bg-[#008296]/5 border border-[#008296]/30 rounded-2xl p-8 text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
        <h2 className="text-2xl font-bold text-[#232F3E]">Message reçu 🎉</h2>
        <p className="text-[#232F3E]/70">
          Merci ! Je te réponds personnellement par email dès que possible. Pense à vérifier tes spams.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-[#008296] rounded-2xl p-8 space-y-5">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2 text-[#232F3E]">
          <Mail className="w-6 h-6 text-[#008296]" /> Une question ? Contacte-moi directement
        </h2>
        <p className="text-sm text-[#232F3E]/65 mt-1">
          Collaboration sur-mesure, question sur les commissions, partenariat… Écris-moi ici, je te
          réponds personnellement par email.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[#232F3E]/60 mb-1 block">Prénom</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ton prénom" />
        </div>
        <div>
          <label className="text-xs text-[#232F3E]/60 mb-1 block">Email *</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="toi@email.com" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-[#232F3E]/60 mb-1 block">Pseudo / @handle</label>
          <Input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@toncompte" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-[#232F3E]/60 mb-1 block">Ton message *</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Dis-moi ce dont tu as besoin…"
            rows={4}
          />
        </div>
      </div>

      <Button
        onClick={submit}
        disabled={sending}
        style={{ background: '#008296', color: 'white' }}
        className="w-full font-semibold"
      >
        {sending ? 'Envoi…' : 'Envoyer mon message'}
      </Button>
    </div>
  );
};

export default InfluencerContactForm;

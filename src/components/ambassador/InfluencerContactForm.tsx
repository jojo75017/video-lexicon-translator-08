import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

const InfluencerContactForm: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (!email.includes('@')) { toast.error('Email invalide.'); return; }
    if (!message.trim()) { toast.error('Écris ton message.'); return; }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-subscriber-contact', {
        body: {
          email,
          name: name || handle,
          handle,
          source: 'influenceurs',
          subject: handle ? `Influenceur ${handle}` : 'Contact influenceur',
          category: 'Programme Ambassadeur / Influenceur',
          message,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast.success('Message envoyé ! Je te réponds vite 📩');
      navigate('/influenceurs/merci');
    } catch (e: any) {
      toast.error(e?.message || "Impossible d'envoyer le message.");
    } finally {
      setSending(false);
    }
  };


  return (
    <div className="bg-white border-2 border-[#008296] rounded-2xl p-8 space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 bg-[#008296]/15 text-[#008296] px-2.5 py-1 rounded-full text-xs font-bold">
            🌐 Formulaire public
          </span>
          <span className="inline-flex items-center gap-1 bg-[#FF9E2D]/15 text-[#FF9E2D] px-2.5 py-1 rounded-full text-xs font-bold">
            👤 L'influenceur t'écrit ici
          </span>
        </div>
        <h2 className="text-2xl font-bold flex items-center gap-2 text-[#232F3E]">
          <Mail className="w-6 h-6 text-[#008296]" /> Une question ? Contacte-moi directement
        </h2>
        <p className="text-sm text-[#232F3E]/65 mt-1">
          Ce formulaire est destiné aux influenceurs qui ont des questions avant de s'inscrire.
          Ils écrivent leur message ici et tu reçois leur demande par email.
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
        <div className="sm:col-span-2">
          <label className="text-xs text-[#232F3E]/60 mb-1 block">Pseudo / @handle de l'influenceur</label>
          <Input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="ex : @sarah_creates" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-[#232F3E]/60 mb-1 block">Message de l'influenceur *</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="L'influenceur écrit sa question ici…"
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

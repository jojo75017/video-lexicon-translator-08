import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { PARTNER_PLATFORMS } from '@/data/partnerProgram';

const INK = '#0F342E';
const GOLD = '#B08D3F';

/**
 * Candidature publique au programme partenaires.
 * Enregistre le contact et déclenche l'email de bienvenue (fonction existante
 * `submit-ambassador-application`), sans créer de nouveau circuit.
 */
export default function PartnerApplyForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [niche, setNiche] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!email.includes('@')) {
      toast.error('Indiquez une adresse email valide.');
      return;
    }
    if (!handle.trim() && !name.trim()) {
      toast.error('Indiquez votre nom ou celui de votre média.');
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('submit-ambassador-application', {
        body: { name, email, handle, platform, niche, program: 'partenaires' },
      });
      if (error) throw error;
      if (!(data as { success?: boolean } | null)?.success) {
        throw new Error((data as { error?: string } | null)?.error || 'Envoi impossible.');
      }
      setDone(true);
      toast.success('Candidature envoyée.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Envoi impossible.');
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center" style={{ borderColor: GOLD }}>
        <CheckCircle2 className="mx-auto h-10 w-10" style={{ color: INK }} />
        <h3 className="mt-4 text-xl font-bold" style={{ color: INK }}>
          Candidature reçue
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: 'rgba(35,47,62,0.7)' }}>
          Vous recevez un email avec votre accès d'essai et la marche à suivre pour activer votre
          lien de suivi. Si rien n'arrive dans l'heure, vérifiez vos indésirables.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-6 md:p-8" style={{ borderColor: GOLD }}>
      <h3 className="text-xl font-bold" style={{ color: INK }}>
        Devenir partenaire
      </h3>
      <p className="mt-1 text-sm" style={{ color: 'rgba(35,47,62,0.7)' }}>
        Deux minutes. Vous recevez un accès pour tester le studio, puis votre lien de suivi.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold" style={{ color: 'rgba(35,47,62,0.65)' }}>
            Votre prénom
          </label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="ex : Claire" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold" style={{ color: 'rgba(35,47,62,0.65)' }}>
            Votre email *
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ex : claire@exemple.fr"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold" style={{ color: 'rgba(35,47,62,0.65)' }}>
            Nom de votre média ou de votre compte *
          </label>
          <Input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="ex : Écrire et publier"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold" style={{ color: 'rgba(35,47,62,0.65)' }}>
            Où parlez-vous à votre audience ?
          </label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PARTNER_PLATFORMS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold" style={{ color: 'rgba(35,47,62,0.65)' }}>
            Votre sujet, et l'ordre de grandeur de votre audience
          </label>
          <Input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="ex : auto-édition et KDP, environ 4 000 abonnés"
          />
        </div>
      </div>

      <Button
        onClick={submit}
        disabled={sending}
        className="mt-5 w-full font-semibold"
        style={{ background: INK, color: '#FFFFFF' }}
      >
        <Send className="mr-1.5 h-4 w-4" />
        {sending ? 'Envoi…' : 'Envoyer ma candidature'}
      </Button>
      <p className="mt-3 text-center text-xs" style={{ color: 'rgba(35,47,62,0.55)' }}>
        Aucun engagement, aucun frais. Vous pouvez arrêter à tout moment.
      </p>
    </div>
  );
}

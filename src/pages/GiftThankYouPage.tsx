import React, { useEffect, useState } from 'react';
import { Gift, Loader2, Copy, CheckCircle2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getStripeEnvironment } from '@/lib/stripe';
import { toast } from 'sonner';

const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const AMBER_SOFT = '#FFF3DF';
const INK = '#2A2118';
const SERIF = "'Georgia', 'Times New Roman', serif";

/** Page de remerciement après achat d'une carte cadeau : affiche le code à l'acheteur. */
const GiftThankYouPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get('session_id');
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) { setError('Session introuvable.'); setLoading(false); return; }
    supabase.functions.invoke('v3-gift-verify', {
      body: { sessionId, environment: getStripeEnvironment() },
    }).then(({ data, error: err }) => {
      if (err || !(data as { ok?: boolean })?.ok) {
        setError((data as { error?: string })?.error || err?.message || 'Vérification impossible.');
      } else {
        setCode((data as { code?: string }).code ?? null);
        setRecipient((data as { recipientEmail?: string }).recipientEmail ?? null);
      }
      setLoading(false);
    });
  }, [sessionId]);

  const copy = () => {
    if (code) { navigator.clipboard.writeText(code); toast.success('Code copié !'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: AMBER_SOFT }}>
      <div className="w-full max-w-md rounded-3xl border-2 bg-white p-8 text-center shadow-[0_12px_40px_-16px_rgba(232,149,30,0.5)]"
        style={{ borderColor: AMBER }}>
        {loading ? (
          <div className="py-10"><Loader2 className="h-7 w-7 animate-spin mx-auto" style={{ color: AMBER }} /></div>
        ) : error ? (
          <p className="text-sm py-6" style={{ color: '#b3261e' }}>{error}</p>
        ) : (
          <>
            <Gift className="h-12 w-12 mx-auto mb-3" style={{ color: AMBER }} />
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: SERIF, color: INK }}>Merci pour votre cadeau ! 🎁</h1>
            <p className="text-sm mb-5" style={{ color: '#6f5e47' }}>
              Voici le code cadeau à offrir. Le bénéficiaire l'activera sur <strong>ebookstudio.fr/carte-cadeau</strong>.
              {recipient && <> Une copie a été envoyée à <strong>{recipient}</strong>.</>}
            </p>
            <button onClick={copy}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 text-xl font-black tracking-wider mb-5"
              style={{ borderColor: `${AMBER}55`, background: AMBER_SOFT, color: AMBER_DEEP }}>
              {code} <Copy className="h-4 w-4" />
            </button>
            <div className="flex items-center justify-center gap-1.5 text-xs mb-5" style={{ color: '#1f9d6b' }}>
              <CheckCircle2 className="h-4 w-4" /> Paiement confirmé · carte active
            </div>
            <button onClick={() => navigate('/')}
              className="w-full rounded-xl px-6 py-3 text-sm font-bold"
              style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}>
              Retour à l'accueil
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GiftThankYouPage;

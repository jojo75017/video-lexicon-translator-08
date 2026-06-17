import React, { useEffect, useState } from 'react';
import { Gift, Loader2, CheckCircle2, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getStripeEnvironment } from '@/lib/stripe';
import { toast } from 'sonner';

const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const AMBER_SOFT = '#FFF3DF';
const INK = '#2A2118';
const SERIF = "'Georgia', 'Times New Roman', serif";

/** Page d'activation d'une carte cadeau. Accès lié au compte connecté uniquement. */
const GiftRedeemPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setChecking(false);
    });
  }, []);

  const redeem = async () => {
    if (!code.trim()) { toast.error('Saisissez votre code cadeau.'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('v3-gift-redeem', {
        body: { code: code.trim(), environment: getStripeEnvironment() },
      });
      if (error) throw new Error(error.message);
      if (!(data as { ok?: boolean })?.ok) throw new Error((data as { error?: string })?.error || 'Activation impossible.');
      setDone(true);
      toast.success('Carte cadeau activée ! Accès débloqué.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Activation impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: AMBER_SOFT }}>
      <div className="w-full max-w-md rounded-3xl border-2 bg-white p-8 shadow-[0_12px_40px_-16px_rgba(232,149,30,0.5)]"
        style={{ borderColor: AMBER }}>
        <div className="flex items-center gap-2 mb-2">
          <Gift className="h-6 w-6" style={{ color: AMBER }} />
          <h1 className="text-2xl font-bold" style={{ fontFamily: SERIF, color: INK }}>Activer ma carte cadeau</h1>
        </div>

        {checking ? (
          <div className="py-10 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" style={{ color: AMBER }} /></div>
        ) : done ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3" style={{ color: '#1f9d6b' }} />
            <p className="text-sm mb-5" style={{ color: '#6f5e47' }}>
              Votre accès à la Base est débloqué à vie, lié à <strong>{email}</strong>.
            </p>
            <button onClick={() => navigate('/hub-v3')}
              className="w-full rounded-xl px-6 py-3.5 text-sm font-black"
              style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}>
              Accéder à mon espace →
            </button>
          </div>
        ) : !email ? (
          <div className="py-4 text-center">
            <p className="text-sm mb-5" style={{ color: '#6f5e47' }}>
              Pour activer votre carte cadeau, connectez-vous (ou créez votre compte). L'accès sera
              lié à ce compte, à vous seul.
            </p>
            <button onClick={() => navigate('/auth')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-black"
              style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}>
              <LogIn className="h-4 w-4" /> Se connecter / Créer un compte
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm mb-4" style={{ color: '#6f5e47' }}>
              Connecté en tant que <strong>{email}</strong>. L'accès sera lié à ce compte.
            </p>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#6f5e47' }}>Votre code cadeau</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="NOEL-XXXX-XXXX"
              className="w-full rounded-xl border px-4 py-3 text-sm mb-5 tracking-wider focus:outline-none"
              style={{ borderColor: `${AMBER}55`, color: INK }}
            />
            <button onClick={redeem} disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-black disabled:opacity-60"
              style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Activation…</> : 'Activer ma carte'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GiftRedeemPage;

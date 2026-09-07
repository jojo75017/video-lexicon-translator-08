import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Check, Copy, LinkIcon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import CopyBlockList from './CopyBlockList';
import { buildPartnerKit, buildPartnerLink } from '@/data/partnerProgram';

const INK = '#0F342E';
const GOLD = '#B08D3F';

/**
 * Lien de suivi du partenaire connecté + kit prêt à copier.
 * Réutilise la table `referral_codes` existante (un code par utilisateur).
 */
export default function PartnerLinkPanel() {
  const [checking, setChecking] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setChecking(false);
        return;
      }
      setSignedIn(true);
      const { data } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('user_id', session.user.id)
        .maybeSingle();
      if (data?.code) setCode(data.code);
      setChecking(false);
    })();
  }, []);

  const createCode = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error('Connectez-vous pour créer votre lien.');
      return;
    }
    setCreating(true);
    try {
      const base = (session.user.email?.split('@')[0] || 'part')
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, 8)
        .toUpperCase();
      const newCode = `${base}${Math.floor(100 + Math.random() * 900)}`;
      const { data, error } = await supabase
        .from('referral_codes')
        .insert({ user_id: session.user.id, code: newCode })
        .select('code')
        .single();
      if (error) throw error;
      setCode(data.code);
      toast.success('Votre lien de suivi est prêt.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Création impossible.');
    } finally {
      setCreating(false);
    }
  };

  const link = useMemo(() => (code ? buildPartnerLink(code) : ''), [code]);
  const kit = useMemo(() => buildPartnerKit(link || buildPartnerLink('VOTRECODE')), [link]);

  const copyLink = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Lien copié');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6" style={{ borderColor: GOLD }}>
        <h3 className="flex items-center gap-2 text-lg font-bold" style={{ color: INK }}>
          <LinkIcon className="h-5 w-5" /> Votre lien de suivi
        </h3>

        {checking ? (
          <p className="mt-3 text-sm" style={{ color: 'rgba(35,47,62,0.6)' }}>
            Vérification de votre compte…
          </p>
        ) : !signedIn ? (
          <p className="mt-3 text-sm" style={{ color: 'rgba(35,47,62,0.7)' }}>
            Connectez-vous à votre compte pour créer votre lien, ou envoyez d'abord votre
            candidature ci-dessous : le lien vous sera préparé.
          </p>
        ) : code ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              className="min-w-[240px] flex-1 rounded-md border bg-[#FCFCFA] px-3 py-2 font-mono text-sm"
              style={{ borderColor: 'rgba(35,47,62,0.16)', color: INK }}
            />
            <Button onClick={copyLink} style={{ background: INK, color: '#FFFFFF' }}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="ml-1.5">Copier</span>
            </Button>
          </div>
        ) : (
          <div className="mt-3">
            <p className="mb-3 text-sm" style={{ color: 'rgba(35,47,62,0.7)' }}>
              Vous n'avez pas encore de lien. Il se crée en une seconde et reste le même
              définitivement.
            </p>
            <Button
              onClick={createCode}
              disabled={creating}
              style={{ background: GOLD, color: '#FFFFFF' }}
              className="font-semibold"
            >
              <Sparkles className="mr-1.5 h-4 w-4" />
              {creating ? 'Création…' : 'Créer mon lien de suivi'}
            </Button>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold" style={{ color: INK }}>
          Votre kit, prêt à copier
        </h3>
        <p className="mb-4 mt-1 text-sm" style={{ color: 'rgba(35,47,62,0.7)' }}>
          {code
            ? 'Votre lien est déjà inséré dans chaque texte. Vous pouvez modifier les textes avant de les copier.'
            : 'Les textes ci-dessous contiennent « VOTRECODE » : ils seront personnalisés dès que votre lien existera.'}
        </p>
        <CopyBlockList blocks={kit} />
      </div>
    </div>
  );
}

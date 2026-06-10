import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Copy, Check, FileText, Image as ImageIcon, Download, Link as LinkIcon, Send } from 'lucide-react';
import { toast } from 'sonner';
import mockup from '@/assets/influenceurs-mockup.jpg';
import InfluencerFinder from '@/components/admin/InfluencerFinder';
import {
  PRICE_NOW, PRICE_V3, COMMISSION_NOW, COMMISSION_V3,
  getActiveCommission, formatEuro, ORIGIN,
} from '@/lib/influencerKit';

const TEAL = '#008296';

interface Tracking { code: string; clicks: number; conversions: number; earnings: number; }

const InfluencerKit: React.FC = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [rows, setRows] = useState<Tracking[]>([]);

  const commission = getActiveCommission();

  const loadTracking = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const { data: codes } = await supabase
      .from('referral_codes')
      .select('code')
      .eq('user_id', session.user.id);
    if (!codes?.length) return;
    const out: Tracking[] = [];
    for (const c of codes) {
      const [{ count: clicks }, { data: refs }] = await Promise.all([
        supabase.from('affiliate_clicks').select('id', { count: 'exact', head: true }).eq('ref_code', c.code),
        supabase.from('referrals').select('status, commission_amount').eq('referrer_id', session.user.id),
      ]);
      const conversions = refs?.filter(r => r.status === 'converted' || r.status === 'paid').length || 0;
      const earnings = (refs || []).reduce((s, r) => s + Number(r.commission_amount || 0), 0);
      out.push({ code: c.code, clicks: clicks || 0, conversions, earnings });
    }
    setRows(out);
  };

  useEffect(() => { loadTracking(); }, []);

  const generate = async () => {
    if (!name.trim()) return toast.error('Indique le nom / pseudo de l\'influenceur.');
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Session admin requise.');
      const slug = name.trim().replace(/[^a-zA-Z0-9]/g, '').slice(0, 10).toUpperCase();
      const newCode = `INF-${slug || 'AMB'}${Math.floor(Math.random() * 1000)}`;
      const { data: ins, error } = await supabase
        .from('referral_codes')
        .insert({ user_id: session.user.id, code: newCode })
        .select('code')
        .single();
      if (error) throw error;
      setCode(ins.code);
      toast.success('Lien de suivi généré ✓');
      loadTracking();
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  const link = useMemo(() => code ? `${ORIGIN}/promo/decouverte?ref=${code}` : '', [code]);

  const dm = code ? `Salut ${name || ''} 👋

J'adore ton contenu ! Je lance Ebookstudio Pro, un outil qui génère un ebook complet (plan, chapitres, couverture Amazon KDP, SEO) en 30 min.

Je te propose mon programme ambassadeur : 30% de commission par vente, soit ${formatEuro(commission)} pour toi à chaque achat via ton lien (et ${formatEuro(COMMISSION_V3)}/vente dès octobre).

Pas de cash en avance, suivi automatique. Voici ton lien perso :
${link}

Kit complet (scripts vidéo + visuels) : ${ORIGIN}/influenceurs
Dis-moi si tu veux tester 🚀` : '';

  const copy = async (value: string, label: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(label);
    toast.success('Copié ✓');
    setTimeout(() => setCopied(null), 2000);
  };

  const sendInvite = async () => {
    if (!email.trim() || !email.includes('@')) return toast.error('Email invalide.');
    if (!link) return toast.error('Génère d\'abord un lien de suivi.');
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-influencer-invite', {
        body: {
          email: email.trim(),
          name,
          link,
          commission: formatEuro(commission),
          commissionV3: formatEuro(COMMISSION_V3),
        },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Échec de l\'envoi.');
      toast.success(`Invitation envoyée à ${email.trim()} ✓`);
      setEmail('');
    } catch (e: any) {
      toast.error(e?.message || 'Échec de l\'envoi.');
    } finally { setSending(false); }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Génère un lien + code de suivi unique par influenceur, copie le message d'approche prêt à coller,
        télécharge le kit, et suis les performances. Commission 30% : <strong>{formatEuro(COMMISSION_NOW)}</strong>/vente
        maintenant ({PRICE_NOW}€) → <strong>{formatEuro(COMMISSION_V3)}</strong>/vente dès octobre ({PRICE_V3}€).
      </p>

      {/* Génération */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <Label className="text-xs">Nom / pseudo de l'influenceur</Label>
          <div className="flex gap-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="ex: @julie_booktok" />
            <Button onClick={generate} disabled={loading} style={{ background: TEAL, color: 'white' }}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}
              <span className="ml-1.5">Générer</span>
            </Button>
          </div>

          {code && (
            <div className="space-y-3 pt-2">
              <div>
                <Label className="text-xs">Lien de suivi</Label>
                <div className="flex gap-2 mt-1">
                  <Input readOnly value={link} className="text-xs" />
                  <Button variant="outline" size="icon" onClick={() => copy(link, 'lien')}>
                    {copied === 'lien' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-xs">Message d'approche (DM TikTok / Insta)</Label>
                <pre className="mt-1 whitespace-pre-wrap text-xs bg-muted rounded-md p-3 font-sans">{dm}</pre>
                <Button variant="outline" size="sm" className="mt-2 gap-1.5" onClick={() => copy(dm, 'dm')}>
                  {copied === 'dm' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} Copier le message
                </Button>
              </div>

              <div className="pt-2 border-t">
                <Label className="text-xs">Envoi automatique par email</Label>
                <p className="text-[11px] text-muted-foreground mb-1.5">
                  Envoie l'invitation (lien perso + kit + offre) directement dans la boîte mail de l'influenceur.
                </p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@influenceur.com"
                    className="text-xs"
                  />
                  <Button onClick={sendInvite} disabled={sending} style={{ background: '#FF9E2D', color: '#232F3E' }}>
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    <span className="ml-1.5">Envoyer</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Téléchargements */}
      <div className="grid sm:grid-cols-2 gap-3">
        <a href="/kit-influenceurs.pdf" download>
          <Card className="hover:border-[#FF9E2D] transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <FileText className="h-7 w-7 text-[#008296]" />
              <div className="flex-1"><p className="font-semibold text-sm">Dossier Influenceur (PDF)</p>
                <p className="text-xs text-muted-foreground">Pitch, offre, scripts</p></div>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </a>
        <a href={mockup} download="ebookstudio-mockup.jpg">
          <Card className="hover:border-[#FF9E2D] transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <ImageIcon className="h-7 w-7 text-[#008296]" />
              <div className="flex-1"><p className="font-semibold text-sm">Visuel mockup (9:16)</p>
                <p className="text-xs text-muted-foreground">Story / Reel</p></div>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </a>
      </div>

      {/* Suivi */}
      {rows.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-sm mb-3">Suivi des codes</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="text-left text-muted-foreground border-b">
                  <th className="py-1.5 pr-3">Code</th><th className="pr-3">Clics</th>
                  <th className="pr-3">Ventes</th><th>Commissions</th>
                </tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.code} className="border-b last:border-0">
                      <td className="py-1.5 pr-3 font-mono">{r.code}</td>
                      <td className="pr-3">{r.clicks}</td>
                      <td className="pr-3">{r.conversions}</td>
                      <td className="font-semibold text-[#008296]">{formatEuro(r.earnings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InfluencerKit;

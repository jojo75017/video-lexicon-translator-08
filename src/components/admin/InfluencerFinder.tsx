import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, ExternalLink, Users, Copy, Check, UserPlus, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import {
  COMMISSION_V3, getActiveCommission, formatEuro, ORIGIN,
} from '@/lib/influencerKit';

const TEAL = '#008296';

type Platform = 'tiktok' | 'instagram' | 'youtube' | 'facebook';

interface Influencer {
  platform: Platform;
  name: string;
  handle: string | null;
  url: string;
  description: string;
  followers: string | null;
}

interface InviteState {
  code: string;
  link: string;
  dm: string;
  niche: string;
  email: string;
  sending: boolean;
  generating: boolean;
}


const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'tiktok', label: 'TikTok' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'facebook', label: 'Facebook' },
];

const PRESETS = [
  'booktok auto-édition',
  'gagner de l’argent en ligne',
  'Amazon KDP français',
  'side hustle revenus passifs',
  'écrire un livre IA',
];

const InfluencerFinder: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState<Platform[]>(['tiktok', 'instagram', 'youtube', 'facebook']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Influencer[]>([]);
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [inviting, setInviting] = useState<string | null>(null);
  const [invites, setInvites] = useState<Record<string, InviteState>>({});

  const commission = getActiveCommission();

  const toggle = (p: Platform) =>
    setSelected((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));

  const search = async () => {
    if (!keyword.trim()) return toast.error('Indique une niche ou un mot-clé.');
    if (!selected.length) return toast.error('Sélectionne au moins une plateforme.');
    setLoading(true);
    setSearched(true);
    try {
      const { data, error } = await supabase.functions.invoke('find-influencers', {
        body: { keyword: keyword.trim(), platforms: selected, limit: 6 },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Échec de la recherche.');
      setResults(data.influencers || []);
      if (!data.influencers?.length) toast.info('Aucun résultat — essaie un autre mot-clé.');
      else toast.success(`${data.count} comptes trouvés ✓`);
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la recherche.');
    } finally {
      setLoading(false);
    }
  };

  const copyValue = async (txt: string, key: string) => {
    await navigator.clipboard.writeText(txt);
    setCopied(key);
    toast.success('Copié ✓');
    setTimeout(() => setCopied(null), 1500);
  };

  const buildDm = (inf: Influencer, link: string) => `Salut ${inf.handle || inf.name} 👋

J'adore ton contenu ! Je lance Ebookstudio Pro, un outil qui génère un ebook complet (plan, chapitres, couverture Amazon KDP, SEO) en 30 min.

Je te propose mon programme ambassadeur : 30% de commission par vente, soit ${formatEuro(commission)} pour toi à chaque achat via ton lien (et ${formatEuro(COMMISSION_V3)}/vente dès octobre).

Pas de cash en avance, suivi automatique. Voici ton lien perso :
${link}

Kit complet (scripts vidéo + visuels) : ${ORIGIN}/influenceurs
Dis-moi si tu veux tester 🚀`;

  const invite = async (inf: Influencer) => {
    if (invites[inf.url]) return; // already generated
    setInviting(inf.url);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Session admin requise.');

      // Réutilise le code de parrainage existant (1 seul code par utilisateur)
      let code: string | null = null;
      const { data: existing } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('user_id', session.user.id)
        .limit(1)
        .maybeSingle();

      if (existing?.code) {
        code = existing.code;
      } else {
        const base = (inf.handle || inf.name).replace(/[^a-zA-Z0-9]/g, '').slice(0, 10).toUpperCase();
        const newCode = `INF-${base || 'AMB'}${Math.floor(Math.random() * 1000)}`;
        const { data: ins, error } = await supabase
          .from('referral_codes')
          .insert({ user_id: session.user.id, code: newCode })
          .select('code')
          .single();
        if (error) throw error;
        code = ins.code;
      }

      const link = `${ORIGIN}/promo/decouverte?ref=${code}`;
      const dm = buildDm(inf, link);
      setInvites((s) => ({
        ...s,
        [inf.url]: { code: code!, link, dm, niche: keyword.trim(), email: '', sending: false, generating: false },
      }));
      await navigator.clipboard.writeText(dm);
      // Ouvre le profil pour coller le message en DM en un clic
      window.open(inf.url, '_blank', 'noopener,noreferrer');
      toast.success('Message copié ✓ Le profil s\'ouvre — colle (Ctrl+V) dans le DM');
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération du lien.');
    } finally {
      setInviting(null);
    }
  };

  const setEmail = (url: string, email: string) =>
    setInvites((s) => ({ ...s, [url]: { ...s[url], email } }));

  const setNiche = (url: string, niche: string) =>
    setInvites((s) => ({ ...s, [url]: { ...s[url], niche } }));

  const setDm = (url: string, dm: string) =>
    setInvites((s) => ({ ...s, [url]: { ...s[url], dm } }));

  const generateAi = async (inf: Influencer) => {
    const inv = invites[inf.url];
    if (!inv) return;
    setInvites((s) => ({ ...s, [inf.url]: { ...s[inf.url], generating: true } }));
    try {
      const { data, error } = await supabase.functions.invoke('generate-influencer-message', {
        body: {
          name: inf.handle || inf.name,
          niche: inv.niche || keyword.trim(),
          platform: inf.platform,
          link: inv.link,
          commission: formatEuro(commission),
          commissionV3: formatEuro(COMMISSION_V3),
          kitUrl: `${ORIGIN}/influenceurs`,
        },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Échec de la génération.');
      setInvites((s) => ({ ...s, [inf.url]: { ...s[inf.url], dm: data.message || s[inf.url].dm, generating: false } }));
      toast.success('Message personnalisé généré par IA ✓');
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération IA.');
      setInvites((s) => ({ ...s, [inf.url]: { ...s[inf.url], generating: false } }));
    }
  };

  const sendEmail = async (inf: Influencer) => {
    const inv = invites[inf.url];
    if (!inv) return;
    if (!inv.email.trim() || !inv.email.includes('@')) return toast.error('Email invalide.');
    setInvites((s) => ({ ...s, [inf.url]: { ...s[inf.url], sending: true } }));
    try {
      const { data, error } = await supabase.functions.invoke('send-influencer-invite', {
        body: {
          email: inv.email.trim(),
          name: inf.handle || inf.name,
          link: inv.link,
          commission: formatEuro(commission),
          commissionV3: formatEuro(COMMISSION_V3),
        },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Échec de l\'envoi.');
      toast.success(`Invitation envoyée à ${inv.email.trim()} ✓`);
      setInvites((s) => ({ ...s, [inf.url]: { ...s[inf.url], email: '', sending: false } }));
    } catch (e: any) {
      toast.error(e?.message || 'Échec de l\'envoi.');
      setInvites((s) => ({ ...s, [inf.url]: { ...s[inf.url], sending: false } }));
    }
  };

  return (
    <Card className="border-[#008296]/30">
      <CardContent className="p-4 space-y-3">
        <div>
          <h4 className="font-semibold text-sm flex items-center gap-1.5">
            <Search className="h-4 w-4 text-[#008296]" /> Trouver des influenceurs
          </h4>
          <p className="text-[11px] text-muted-foreground">
            Recherche de comptes réels par niche sur TikTok, Instagram, YouTube et Facebook.
          </p>
        </div>

        <Label className="text-xs">Niche / mot-clé</Label>
        <div className="flex gap-2">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            placeholder="ex: booktok auto-édition"
          />
          <Button onClick={search} disabled={loading} style={{ background: TEAL, color: 'white' }}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span className="ml-1.5">Chercher</span>
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setKeyword(p)}
              className="text-[11px] px-2 py-0.5 rounded-full border hover:border-[#FF9E2D] transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                selected.includes(p.id)
                  ? 'bg-[#008296] text-white border-[#008296]'
                  : 'text-muted-foreground hover:border-[#FF9E2D]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {searched && !loading && results.length === 0 && (
          <p className="text-xs text-muted-foreground py-2">Aucun compte trouvé pour cette recherche.</p>
        )}

        {results.length > 0 && (
          <div className="space-y-2 pt-1">
            {results.map((inf) => {
              const inv = invites[inf.url];
              return (
                <div key={inf.url} className="border rounded-md p-2.5">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium text-sm truncate">{inf.name}</span>
                        <Badge variant="outline" className="text-[10px] py-0">{inf.platform}</Badge>
                        {inf.followers && (
                          <span className="text-[11px] text-[#008296] flex items-center gap-0.5">
                            <Users className="h-3 w-3" />{inf.followers}
                          </span>
                        )}
                      </div>
                      {inf.handle && <p className="text-[11px] text-muted-foreground">{inf.handle}</p>}
                      {inf.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{inf.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        className="h-7 gap-1"
                        style={{ background: TEAL, color: 'white' }}
                        disabled={inviting === inf.url || !!inv}
                        onClick={() => invite(inf)}
                        title="Générer le lien et le message d'invitation"
                      >
                        {inviting === inf.url ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <UserPlus className="h-3.5 w-3.5" />
                        )}
                        <span className="text-[11px]">{inv ? 'Invité' : 'Inviter'}</span>
                      </Button>
                      <a href={inf.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="h-7 w-full px-0" title="Ouvrir le profil">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    </div>
                  </div>

                  {inv && (
                    <div className="mt-2.5 pt-2.5 border-t space-y-2">
                      <div>
                        <Label className="text-[11px]">Lien de suivi ({inv.code})</Label>
                        <div className="flex gap-1.5 mt-1">
                          <Input readOnly value={inv.link} className="text-[11px] h-7" />
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => copyValue(inv.link, inf.url + 'link')}>
                            {copied === inf.url + 'link' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-[11px]">Niche / thématique (pour personnaliser)</Label>
                        <Input
                          value={inv.niche}
                          onChange={(e) => setNiche(inf.url, e.target.value)}
                          placeholder="ex: booktop romance, finances perso..."
                          className="text-[11px] h-7 mt-1"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <Label className="text-[11px]">Message d'invitation (éditable)</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 gap-1 px-2"
                            disabled={inv.generating}
                            onClick={() => generateAi(inf)}
                            title="Générer un message personnalisé avec l'IA"
                          >
                            {inv.generating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-[#FF9E2D]" />}
                            <span className="text-[10px]">Générer avec IA</span>
                          </Button>
                        </div>
                        <Textarea
                          value={inv.dm}
                          onChange={(e) => setDm(inf.url, e.target.value)}
                          rows={8}
                          className="text-[11px] mt-1 font-sans"
                        />
                        <Button variant="outline" size="sm" className="h-7 gap-1.5 mt-1.5" onClick={() => copyValue(inv.dm, inf.url + 'dm')}>
                          {copied === inf.url + 'dm' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          <span className="text-[11px]">Copier le message (DM)</span>
                        </Button>
                      </div>
                      <div>
                        <Label className="text-[11px]">Envoyer l'invitation par email</Label>
                        <div className="flex gap-1.5 mt-1">
                          <Input
                            type="email"
                            value={inv.email}
                            onChange={(e) => setEmail(inf.url, e.target.value)}
                            placeholder="email@influenceur.com (si tu le connais)"
                            className="text-[11px] h-7"
                          />
                          <Button
                            size="sm"
                            className="h-7"
                            style={{ background: '#FF9E2D', color: '#232F3E' }}
                            disabled={inv.sending}
                            onClick={() => sendEmail(inf)}
                          >
                            {inv.sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                            <span className="ml-1 text-[11px]">Envoyer</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <p className="text-[10px] text-muted-foreground">
              Astuce : clique « Inviter » → le lien + message sont prêts. Sans email public, colle le message en DM ;
              si tu as leur email, envoie l'invitation en un clic.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InfluencerFinder;

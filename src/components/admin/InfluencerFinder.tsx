import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, ExternalLink, Users, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

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

  const copyHandle = async (inf: Influencer) => {
    const txt = inf.handle || inf.url;
    await navigator.clipboard.writeText(txt);
    setCopied(inf.url);
    toast.success('Copié ✓');
    setTimeout(() => setCopied(null), 1500);
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
            {results.map((inf) => (
              <div key={inf.url} className="flex items-start gap-2 border rounded-md p-2.5">
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
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => copyHandle(inf)} title="Copier le @">
                    {copied === inf.url ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                  <a href={inf.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="h-7 w-7" title="Ouvrir le profil">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                </div>
              </div>
            ))}
            <p className="text-[10px] text-muted-foreground">
              Astuce : copie le @, puis génère son lien de suivi ci-dessous et envoie l'invitation.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InfluencerFinder;

import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Sparkles, BookPlus, Loader2, Download } from 'lucide-react';
import useProBookTier from '@/hooks/useProBookTier';

interface GeneratedTome {
  index: number;
  title: string;
  synopsis: string;
  chapters: Array<{ number: number; title: string; summary: string; scenes?: any[] }>;
  cliffhanger?: string;
  hooksNextTome?: string[];
}

const LS_KEY = 'universe_volumes_wip_v1';

export const EbookUniverseVolumesGenerator: React.FC = () => {
  const { tier } = useProBookTier();
  const isPro = tier === 'pro';

  // Bible
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [worldRules, setWorldRules] = useState('');
  const [narrativeStyle, setNarrativeStyle] = useState('romanesque immersif');
  const [characters, setCharacters] = useState('');
  const [locations, setLocations] = useState('');
  const [timeline, setTimeline] = useState('');
  const [plotThreads, setPlotThreads] = useState('');
  const [themes, setThemes] = useState('');

  // Config volumes
  const maxTomes = isPro ? 10 : 5;
  const maxChapters = isPro ? 30 : 15;
  const [numTomes, setNumTomes] = useState(3);
  const [chaptersPerTome, setChaptersPerTome] = useState(10);
  const [globalArc, setGlobalArc] = useState('');

  // Génération
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTome, setCurrentTome] = useState(0);
  const [tomes, setTomes] = useState<GeneratedTome[]>([]);

  // Charger un brouillon
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setTitle(s.title || '');
        setGenre(s.genre || '');
        setWorldRules(s.worldRules || '');
        setCharacters(s.characters || '');
        setLocations(s.locations || '');
        setTimeline(s.timeline || '');
        setPlotThreads(s.plotThreads || '');
        setThemes(s.themes || '');
        setGlobalArc(s.globalArc || '');
        setTomes(s.tomes || []);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const saveWip = (extra: Partial<any> = {}) => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          title, genre, worldRules, characters, locations, timeline,
          plotThreads, themes, globalArc, tomes, ...extra,
        }),
      );
    } catch {
      /* ignore */
    }
  };

  const bibleObj = () => ({
    title,
    genre,
    worldRules,
    narrativeStyle,
    characters: characters ? characters.split('\n').filter(Boolean) : [],
    locations: locations ? locations.split('\n').filter(Boolean) : [],
    timeline: timeline ? timeline.split('\n').filter(Boolean) : [],
    plotThreads: plotThreads ? plotThreads.split('\n').filter(Boolean) : [],
    mainThemes: themes ? themes.split(',').map((s) => s.trim()).filter(Boolean) : [],
  });

  const generateAll = async () => {
    if (!title.trim()) {
      toast.error('Renseignez au moins le titre de la saga.');
      return;
    }
    setBusy(true);
    setTomes([]);
    setProgress(0);

    const bible = bibleObj();
    const previousTomes: Array<{ index: number; title: string; synopsis: string }> = [];
    const results: GeneratedTome[] = [];

    for (let i = 1; i <= numTomes; i++) {
      setCurrentTome(i);
      try {
        const { data, error } = await supabase.functions.invoke('agent-universe-volumes', {
          body: {
            bible,
            tome: {
              index: i,
              goal: globalArc ? `Arc global: ${globalArc}. Progression du tome ${i}/${numTomes}.` : `Tome ${i}/${numTomes}`,
            },
            chaptersPerTome,
            tier: isPro ? 'pro' : 'standard',
            previousTomes,
          },
        });

        if (error) throw error;
        const tome: GeneratedTome = { ...(data?.tome || {}), index: i };
        results.push(tome);
        previousTomes.push({ index: i, title: tome.title, synopsis: tome.synopsis });
        setTomes([...results]);
        setProgress(Math.round((i / numTomes) * 100));
        saveWip({ tomes: results });
      } catch (e: any) {
        toast.error(`Tome ${i} : ${e?.message || 'erreur'}`);
        break;
      }
    }

    setBusy(false);
    toast.success(`${results.length} tome(s) généré(s).`);
  };

  const saveToBible = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      toast.error('Connectez-vous pour sauvegarder.');
      return;
    }
    const { error } = await supabase.from('series_bibles').insert({
      user_id: userData.user.id,
      title,
      genre,
      total_tomes: numTomes,
      world_rules: worldRules,
      narrative_style: narrativeStyle,
      main_themes: bibleObj().mainThemes as any,
      characters: bibleObj().characters as any,
      locations: bibleObj().locations as any,
      timeline: bibleObj().timeline as any,
      plot_threads: bibleObj().plotThreads as any,
      tomes: tomes as any,
    });
    if (error) toast.error(error.message);
    else toast.success('Bible d\'univers enregistrée.');
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ bible: bibleObj(), tomes }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'univers'}-volumes.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            Bible d'univers
            <Badge variant="secondary">{isPro ? 'Pro' : 'Standard'}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Titre de la saga *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Les Chroniques d'Aethel" />
          </div>
          <div>
            <Label>Genre</Label>
            <Input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Fantasy épique" />
          </div>
          <div>
            <Label>Style narratif</Label>
            <Input value={narrativeStyle} onChange={(e) => setNarrativeStyle(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label>Règles du monde</Label>
            <Textarea rows={3} value={worldRules} onChange={(e) => setWorldRules(e.target.value)} placeholder="Magie liée aux 4 éléments, seules les femmes peuvent lire les runes..." />
          </div>
          <div>
            <Label>Personnages (un par ligne)</Label>
            <Textarea rows={4} value={characters} onChange={(e) => setCharacters(e.target.value)} />
          </div>
          <div>
            <Label>Lieux (un par ligne)</Label>
            <Textarea rows={4} value={locations} onChange={(e) => setLocations(e.target.value)} />
          </div>
          <div>
            <Label>Timeline narrative (une ligne = un événement)</Label>
            <Textarea rows={4} value={timeline} onChange={(e) => setTimeline(e.target.value)} />
          </div>
          <div>
            <Label>Fils narratifs (un par ligne)</Label>
            <Textarea rows={4} value={plotThreads} onChange={(e) => setPlotThreads(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label>Thèmes (séparés par virgule)</Label>
            <Input value={themes} onChange={(e) => setThemes(e.target.value)} placeholder="rédemption, guerre, deuil, amour" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookPlus className="h-5 w-5 text-emerald-600" />
            Configuration des volumes
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <Label>Nombre de tomes (max {maxTomes})</Label>
            <Input
              type="number"
              min={1}
              max={maxTomes}
              value={numTomes}
              onChange={(e) => setNumTomes(Math.min(maxTomes, Math.max(1, parseInt(e.target.value) || 1)))}
            />
          </div>
          <div>
            <Label>Chapitres par tome (max {maxChapters})</Label>
            <Input
              type="number"
              min={5}
              max={maxChapters}
              value={chaptersPerTome}
              onChange={(e) => setChaptersPerTome(Math.min(maxChapters, Math.max(5, parseInt(e.target.value) || 10)))}
            />
          </div>
          <div className="md:col-span-3">
            <Label>Arc global de la saga</Label>
            <Textarea rows={2} value={globalArc} onChange={(e) => setGlobalArc(e.target.value)} placeholder="Une prophétie oubliée refait surface ; à travers les tomes, l'héroïne unifie les royaumes divisés..." />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button onClick={generateAll} disabled={busy} className="bg-emerald-700 hover:bg-emerald-800">
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Générer les {numTomes} tomes
        </Button>
        {tomes.length > 0 && (
          <>
            <Button variant="outline" onClick={saveToBible}>
              Enregistrer la Bible + tomes
            </Button>
            <Button variant="outline" onClick={exportJson}>
              <Download className="mr-2 h-4 w-4" />
              Exporter JSON
            </Button>
          </>
        )}
      </div>

      {busy && (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-2 text-sm text-muted-foreground">
              Génération du tome {currentTome} / {numTomes}…
            </div>
            <Progress value={progress} />
          </CardContent>
        </Card>
      )}

      {tomes.map((t) => (
        <Card key={t.index}>
          <CardHeader>
            <CardTitle>
              Tome {t.index} — {t.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed">{t.synopsis}</p>
            {t.chapters?.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t.chapters.length} chapitres
                </div>
                <ul className="space-y-2">
                  {t.chapters.map((c) => (
                    <li key={c.number} className="rounded border p-3">
                      <div className="text-sm font-semibold">
                        Chapitre {c.number} — {c.title}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">{c.summary}</div>
                      {isPro && c.scenes && c.scenes.length > 0 && (
                        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                          {c.scenes.map((s: any, idx: number) => (
                            <li key={idx}>
                              • <b>{s.location}</b> — {s.tension} {s.keyDialogue ? `« ${s.keyDialogue} »` : ''}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {t.cliffhanger && (
              <p className="text-sm italic text-amber-700">Cliffhanger : {t.cliffhanger}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EbookUniverseVolumesGenerator;

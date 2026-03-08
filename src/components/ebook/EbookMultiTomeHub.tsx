import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BookCopy, Users, MapPin, Clock, GitBranch, Plus, Trash2, Save, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SeriesCharacter {
  name: string;
  role: string;
  description: string;
  firstAppearance: string;
  evolution: string;
}

interface SeriesLocation {
  name: string;
  description: string;
  importance: string;
}

interface PlotThread {
  title: string;
  status: 'open' | 'developing' | 'resolved';
  description: string;
  tomes: number[];
}

interface TomePlan {
  number: number;
  title: string;
  summary: string;
  status: 'planned' | 'writing' | 'done';
  wordCount: number;
}

interface SeriesBibleData {
  title: string;
  genre: string;
  totalTomes: number;
  characters: SeriesCharacter[];
  locations: SeriesLocation[];
  plotThreads: PlotThread[];
  tomes: TomePlan[];
  worldRules: string;
  narrativeStyle: string;
  timeline: string;
}

export const EbookMultiTomeHub: React.FC = () => {
  const [bible, setBible] = useState<SeriesBibleData>({
    title: '', genre: '', totalTomes: 3,
    characters: [], locations: [], plotThreads: [], tomes: [],
    worldRules: '', narrativeStyle: '', timeline: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const addCharacter = () => setBible(prev => ({
    ...prev,
    characters: [...prev.characters, { name: '', role: 'secondary', description: '', firstAppearance: 'Tome 1', evolution: '' }]
  }));

  const addLocation = () => setBible(prev => ({
    ...prev,
    locations: [...prev.locations, { name: '', description: '', importance: 'secondary' }]
  }));

  const addPlotThread = () => setBible(prev => ({
    ...prev,
    plotThreads: [...prev.plotThreads, { title: '', status: 'open', description: '', tomes: [1] }]
  }));

  const addTome = () => setBible(prev => ({
    ...prev,
    tomes: [...prev.tomes, { number: prev.tomes.length + 1, title: '', summary: '', status: 'planned', wordCount: 0 }]
  }));

  const updateCharacter = (index: number, field: keyof SeriesCharacter, value: string) => {
    setBible(prev => {
      const chars = [...prev.characters];
      chars[index] = { ...chars[index], [field]: value };
      return { ...prev, characters: chars };
    });
  };

  const updateLocation = (index: number, field: keyof SeriesLocation, value: string) => {
    setBible(prev => {
      const locs = [...prev.locations];
      locs[index] = { ...locs[index], [field]: value };
      return { ...prev, locations: locs };
    });
  };

  const updatePlotThread = (index: number, field: keyof PlotThread, value: any) => {
    setBible(prev => {
      const threads = [...prev.plotThreads];
      threads[index] = { ...threads[index], [field]: value };
      return { ...prev, plotThreads: threads };
    });
  };

  const updateTome = (index: number, field: keyof TomePlan, value: any) => {
    setBible(prev => {
      const tomes = [...prev.tomes];
      tomes[index] = { ...tomes[index], [field]: value };
      return { ...prev, tomes: tomes };
    });
  };

  const removeItem = (type: 'characters' | 'locations' | 'plotThreads' | 'tomes', index: number) => {
    setBible(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
  };

  const completionPercent = () => {
    const done = bible.tomes.filter(t => t.status === 'done').length;
    return bible.tomes.length > 0 ? Math.round((done / bible.tomes.length) * 100) : 0;
  };

  const openThreads = bible.plotThreads.filter(t => t.status === 'open').length;
  const totalWords = bible.tomes.reduce((acc, t) => acc + t.wordCount, 0);

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-primary/10">
              <BookCopy className="h-6 w-6 text-primary" />
            </div>
            Hub Multi-Tomes & Bible de Série
            <Badge className="bg-primary/10 text-primary border-primary/30">SAGA</Badge>
          </CardTitle>
          <CardDescription>
            Gérez la cohérence narrative entre vos tomes : personnages, lieux, arcs narratifs et timeline
          </CardDescription>
        </CardHeader>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Tomes', value: bible.tomes.length, icon: BookCopy },
          { label: 'Personnages', value: bible.characters.length, icon: Users },
          { label: 'Lieux', value: bible.locations.length, icon: MapPin },
          { label: 'Arcs ouverts', value: openThreads, icon: GitBranch },
          { label: 'Mots total', value: totalWords.toLocaleString(), icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-4 pb-3 text-center">
              <Icon className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progression */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progression de la saga</span>
            <span className="text-sm font-bold">{completionPercent()}%</span>
          </div>
          <Progress value={completionPercent()} className="h-3" />
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">📊 Vue</TabsTrigger>
          <TabsTrigger value="characters">👥 Persos</TabsTrigger>
          <TabsTrigger value="locations">📍 Lieux</TabsTrigger>
          <TabsTrigger value="plotThreads">🔗 Arcs</TabsTrigger>
          <TabsTrigger value="tomes">📚 Tomes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div><label className="text-sm font-medium">Titre de la saga</label><Input value={bible.title} onChange={e => setBible(p => ({ ...p, title: e.target.value }))} placeholder="Ma saga..." /></div>
              <div><label className="text-sm font-medium">Genre</label><Input value={bible.genre} onChange={e => setBible(p => ({ ...p, genre: e.target.value }))} placeholder="Fantasy, Thriller..." /></div>
              <div><label className="text-sm font-medium">Style narratif</label><Input value={bible.narrativeStyle} onChange={e => setBible(p => ({ ...p, narrativeStyle: e.target.value }))} placeholder="3ème personne, omniscient..." /></div>
            </div>
            <div className="space-y-3">
              <div><label className="text-sm font-medium">Règles de l'univers</label><Textarea value={bible.worldRules} onChange={e => setBible(p => ({ ...p, worldRules: e.target.value }))} placeholder="Règles magiques, lois physiques..." className="min-h-[80px]" /></div>
              <div><label className="text-sm font-medium">Timeline générale</label><Textarea value={bible.timeline} onChange={e => setBible(p => ({ ...p, timeline: e.target.value }))} placeholder="An 1: événement fondateur..." className="min-h-[80px]" /></div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="characters" className="space-y-4">
          <Button variant="outline" onClick={addCharacter} className="w-full"><Plus className="h-4 w-4 mr-2" /> Ajouter un personnage</Button>
          {bible.characters.map((char, i) => (
            <Card key={i}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <Input value={char.name} onChange={e => updateCharacter(i, 'name', e.target.value)} placeholder="Nom" />
                    <Input value={char.role} onChange={e => updateCharacter(i, 'role', e.target.value)} placeholder="Rôle (héros, mentor...)" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem('characters', i)} className="ml-2"><Trash2 className="h-4 w-4" /></Button>
                </div>
                <Textarea value={char.description} onChange={e => updateCharacter(i, 'description', e.target.value)} placeholder="Description physique et psychologique..." className="min-h-[60px]" />
                <div className="grid grid-cols-2 gap-3">
                  <Input value={char.firstAppearance} onChange={e => updateCharacter(i, 'firstAppearance', e.target.value)} placeholder="Première apparition" />
                  <Input value={char.evolution} onChange={e => updateCharacter(i, 'evolution', e.target.value)} placeholder="Évolution sur la saga" />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Button variant="outline" onClick={addLocation} className="w-full"><Plus className="h-4 w-4 mr-2" /> Ajouter un lieu</Button>
          {bible.locations.map((loc, i) => (
            <Card key={i}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex gap-3">
                  <Input value={loc.name} onChange={e => updateLocation(i, 'name', e.target.value)} placeholder="Nom du lieu" className="flex-1" />
                  <Input value={loc.importance} onChange={e => updateLocation(i, 'importance', e.target.value)} placeholder="Importance" className="w-32" />
                  <Button variant="ghost" size="icon" onClick={() => removeItem('locations', i)}><Trash2 className="h-4 w-4" /></Button>
                </div>
                <Textarea value={loc.description} onChange={e => updateLocation(i, 'description', e.target.value)} placeholder="Description détaillée du lieu..." className="min-h-[60px]" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="plotThreads" className="space-y-4">
          <Button variant="outline" onClick={addPlotThread} className="w-full"><Plus className="h-4 w-4 mr-2" /> Ajouter un arc narratif</Button>
          {bible.plotThreads.map((thread, i) => (
            <Card key={i} className={thread.status === 'resolved' ? 'opacity-60' : ''}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex gap-3 items-center">
                  <Input value={thread.title} onChange={e => updatePlotThread(i, 'title', e.target.value)} placeholder="Titre de l'arc" className="flex-1" />
                  <select
                    value={thread.status}
                    onChange={e => updatePlotThread(i, 'status', e.target.value)}
                    className="border rounded px-2 py-1 text-sm bg-background"
                  >
                    <option value="open">🔵 Ouvert</option>
                    <option value="developing">🟡 En cours</option>
                    <option value="resolved">🟢 Résolu</option>
                  </select>
                  <Button variant="ghost" size="icon" onClick={() => removeItem('plotThreads', i)}><Trash2 className="h-4 w-4" /></Button>
                </div>
                <Textarea value={thread.description} onChange={e => updatePlotThread(i, 'description', e.target.value)} placeholder="Description de l'arc..." className="min-h-[60px]" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tomes" className="space-y-4">
          <Button variant="outline" onClick={addTome} className="w-full"><Plus className="h-4 w-4 mr-2" /> Ajouter un tome</Button>
          {bible.tomes.map((tome, i) => (
            <Card key={i}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex gap-3 items-center">
                  <Badge variant="outline" className="shrink-0">Tome {tome.number}</Badge>
                  <Input value={tome.title} onChange={e => updateTome(i, 'title', e.target.value)} placeholder="Titre du tome" className="flex-1" />
                  <select
                    value={tome.status}
                    onChange={e => updateTome(i, 'status', e.target.value as any)}
                    className="border rounded px-2 py-1 text-sm bg-background"
                  >
                    <option value="planned">📋 Planifié</option>
                    <option value="writing">✍️ En écriture</option>
                    <option value="done">✅ Terminé</option>
                  </select>
                  <Button variant="ghost" size="icon" onClick={() => removeItem('tomes', i)}><Trash2 className="h-4 w-4" /></Button>
                </div>
                <Textarea value={tome.summary} onChange={e => updateTome(i, 'summary', e.target.value)} placeholder="Résumé du tome..." className="min-h-[60px]" />
                <div className="flex items-center gap-3">
                  <label className="text-xs text-muted-foreground">Mots:</label>
                  <Input type="number" value={tome.wordCount} onChange={e => updateTome(i, 'wordCount', parseInt(e.target.value) || 0)} className="w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EbookMultiTomeHub;

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Loader2, Sparkles, Download, Copy, Trash2, Target, Notebook, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { buildImageCacheKey, getCachedImage, setCachedImage } from '@/lib/educationalImageCache';

interface AgendaGeneratorProps {
  ebookTitle?: string;
}

interface AgendaPage {
  id: string;
  title: string;
  type: string;
  content: string;
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

const AGENDA_TYPES = [
  { id: 'planner-2026', label: 'Agenda 2026 (annuel)', desc: 'Pages mensuelles + hebdomadaires sur 12 mois' },
  { id: 'planner-undated', label: 'Planner non daté', desc: 'Pages réutilisables sans dates' },
  { id: 'goal-planner', label: 'Goal Planner', desc: 'Objectifs trimestriels, suivi habitudes' },
  { id: 'student-planner', label: 'Planner étudiant', desc: 'Suivi cours, devoirs, examens' },
  { id: 'business-planner', label: 'Planner business', desc: 'KPI, projets, finances' },
  { id: 'wellness-planner', label: 'Wellness / Self-care', desc: 'Sommeil, gratitude, méditation' },
];

const AgendaSection = ({ page, onCopy, onRemove, onGenerateImage }: any) => (
  <Card className="border-2 hover:border-primary/40">
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-lg">{page.title}</CardTitle>
          <Badge variant="secondary" className="mt-1">{page.type}</Badge>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onGenerateImage(page)} disabled={page.isGeneratingImage} title="Générer illustration">
            {page.isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onCopy(page)}><Copy className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => onRemove(page.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      {page.imageUrl && (
        <img src={page.imageUrl} alt={page.title} className="w-full max-h-64 object-contain rounded-lg border bg-muted/30" />
      )}
      <pre className="text-xs whitespace-pre-wrap text-muted-foreground font-sans">{page.content}</pre>
    </CardContent>
  </Card>
);

const EbookAgendaGenerator: React.FC<AgendaGeneratorProps> = ({ ebookTitle }) => {
  const [type, setType] = useState('planner-2026');
  const [theme, setTheme] = useState('');
  const [year, setYear] = useState('2026');
  const [audience, setAudience] = useState('adultes');
  const [pages, setPages] = useState<AgendaPage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const generate = async () => {
    setIsGenerating(true);
    try {
      const typeInfo = AGENDA_TYPES.find(t => t.id === type);
      const prompt = `Tu es expert en création d'agendas et planners low-content pour KDP (Amazon).
Génère la structure complète d'un agenda/planner type "${typeInfo?.label}" (${typeInfo?.desc}).
${type === 'planner-2026' ? `Année: ${year}.` : ''}
${theme ? `Thématique / niche: ${theme}.` : ''}
Public: ${audience}.
${customPrompt ? `Instructions: ${customPrompt}` : ''}

Retourne UNIQUEMENT un tableau JSON valide (sans markdown) de 8 à 12 pages représentatives. Chaque page:
- title: titre de la page (ex: "Janvier 2026 - Vue mensuelle", "Habit Tracker", "Objectifs trimestriels")
- type: catégorie (mensuel | hebdomadaire | objectif | tracker | notes | introduction)
- content: contenu textuel / structure de la page en clair (tableau ASCII, listes, champs à remplir, citations motivantes). Riche en détails pour servir de base à un PDF imprimable KDP.`;

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { prompt, type: 'agenda', maxTokens: 4000 }
      });
      if (error) throw error;

      let content = data.content || data;
      if (typeof content === 'string') {
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        content = JSON.parse(content);
      }
      const generated: AgendaPage[] = (content as any[]).map((p, i) => ({
        id: `agenda-${Date.now()}-${i}`,
        title: p.title || `Page ${i + 1}`,
        type: p.type || 'page',
        content: p.content || '',
      }));
      setPages(prev => [...prev, ...generated]);
      toast.success(`${generated.length} pages d'agenda générées !`);
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la génération de l'agenda");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPage = (p: AgendaPage) => {
    navigator.clipboard.writeText(`# ${p.title}\n\n${p.content}`);
    toast.success('Page copiée');
  };
  const removePage = (id: string) => setPages(prev => prev.filter(p => p.id !== id));

  const generatePageImage = async (page: AgendaPage, force = false) => {
    const cacheKey = buildImageCacheKey(['agenda', type, theme, page.title, page.type]);
    if (!force) {
      const cached = page.imageUrl || getCachedImage(cacheKey);
      if (cached) {
        if (!page.imageUrl) {
          setPages(prev => prev.map(p => p.id === page.id ? { ...p, imageUrl: cached } : p));
        }
        toast.info('Illustration déjà générée (cache)');
        return;
      }
    }
    setPages(prev => prev.map(p => p.id === page.id ? { ...p, isGeneratingImage: true } : p));
    try {
      const { data, error } = await supabase.functions.invoke('generate-educational-image', {
        body: {
          title: page.title,
          context: `Decorative illustration for a planner page about ${theme || type}. ${page.type}.`,
          style: 'Soft pastel watercolor planner illustration, hand-drawn, minimalist, light and airy, white background, no text, clean composition for low-content KDP book.',
          folder: `agenda/${type}`,
        }
      });
      if (error) throw error;
      const url = data?.imageUrl;
      if (!url) throw new Error('Pas d\'image');
      setCachedImage(cacheKey, url);
      setPages(prev => prev.map(p => p.id === page.id ? { ...p, imageUrl: url, isGeneratingImage: false } : p));
      toast.success('Illustration générée');
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Erreur génération image');
      setPages(prev => prev.map(p => p.id === page.id ? { ...p, isGeneratingImage: false } : p));
    }
  };

  const generateAllImages = async () => {
    for (const p of pages) {
      if (!p.imageUrl) await generatePageImage(p);
    }
  };
  const exportAll = () => {
    const md = pages.map(p => `# ${p.title}\n\n${p.content}\n\n---\n`).join('\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agenda-${type}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Agenda exporté');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10"><CalendarDays className="w-6 h-6 text-primary" /></div>
            <div>
              <CardTitle className="text-2xl">Générateur d'Agendas & Planners</CardTitle>
              <CardDescription>Structure complète de planners low-content pour KDP</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Type d'agenda</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AGENDA_TYPES.map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {type === 'planner-2026' && (
              <div className="space-y-2">
                <Label>Année</Label>
                <Input value={year} onChange={e => setYear(e.target.value)} />
              </div>
            )}
            <div className="space-y-2">
              <Label>Niche / thématique</Label>
              <Input value={theme} onChange={e => setTheme(e.target.value)} placeholder="Ex: fitness, productivité, maman..." />
            </div>
            <div className="space-y-2">
              <Label>Public cible</Label>
              <Input value={audience} onChange={e => setAudience(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Instructions supplémentaires (optionnel)</Label>
            <Textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} rows={3} placeholder="Ex: inclure citations motivantes, page de gratitude..." />
          </div>
          <Button onClick={generate} disabled={isGenerating} className="w-full">
            {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Génération...</> : <><Sparkles className="w-4 h-4 mr-2" />Générer l'agenda</>}
          </Button>
        </CardContent>
      </Card>

      {pages.length > 0 && (
        <>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={generateAllImages}><ImageIcon className="w-4 h-4 mr-2" />Générer toutes les illustrations</Button>
            <Button variant="outline" onClick={exportAll}><Download className="w-4 h-4 mr-2" />Exporter ({pages.length})</Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pages.map(p => <AgendaSection key={p.id} page={p} onCopy={copyPage} onRemove={removePage} onGenerateImage={generatePageImage} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default EbookAgendaGenerator;

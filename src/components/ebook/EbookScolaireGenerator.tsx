import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Loader2, Sparkles, Download, Copy, Trash2, BookOpen, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ScolaireGeneratorProps {
  ebookTitle?: string;
}

interface ScolaireChapter {
  id: string;
  title: string;
  objectives: string;
  lesson: string;
  exercises: string;
  corrections: string;
  imageUrl?: string;
  imagePrompt?: string;
  isGeneratingImage?: boolean;
}

const LEVELS = ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6e', '5e', '4e', '3e', 'Seconde', 'Première', 'Terminale'];
const SUBJECTS = ['Mathématiques', 'Français', 'Histoire-Géographie', 'Sciences', 'Anglais', 'Espagnol', 'Physique-Chimie', 'SVT', 'Philosophie'];
const FORMATS = [
  { id: 'cahier-revisions', label: 'Cahier de révisions', desc: 'Cours + exercices + corrigés' },
  { id: 'fiches-bac', label: 'Fiches de révision', desc: 'Synthèses courtes par thème' },
  { id: 'exercices', label: 'Cahier d\'exercices', desc: 'Exercices progressifs avec corrigés' },
  { id: 'methodologie', label: 'Méthodologie / annales', desc: 'Méthodes + sujets corrigés' },
];

const EbookScolaireGenerator: React.FC<ScolaireGeneratorProps> = ({ ebookTitle }) => {
  const [level, setLevel] = useState('CM2');
  const [subject, setSubject] = useState('Mathématiques');
  const [format, setFormat] = useState('cahier-revisions');
  const [themes, setThemes] = useState('');
  const [numberOfChapters, setNumberOfChapters] = useState(6);
  const [chapters, setChapters] = useState<ScolaireChapter[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const generate = async () => {
    setIsGenerating(true);
    try {
      const fmt = FORMATS.find(f => f.id === format);
      const prompt = `Tu es professeur certifié de ${subject} pour le niveau ${level} (Éducation Nationale française).
Crée un "${fmt?.label}" (${fmt?.desc}) en ${numberOfChapters} chapitres conformes au programme officiel.
${themes ? `Thèmes prioritaires: ${themes}.` : ''}
${customPrompt ? `Instructions: ${customPrompt}` : ''}

Retourne UNIQUEMENT un tableau JSON valide (sans markdown) avec ${numberOfChapters} objets. Chaque chapitre:
- title: titre du chapitre (ex: "Chapitre 3 - Les fractions")
- objectives: 2-4 objectifs pédagogiques (puces "- ...")
- lesson: cours clair et pédagogique (300-500 mots, exemples concrets adaptés au niveau ${level})
- exercises: 5 à 8 exercices progressifs numérotés, du plus simple au plus difficile
- corrections: corrigés détaillés des exercices avec méthode expliquée
- imagePrompt: description courte en anglais d'une illustration pédagogique (schéma, figure, scène) qui illustre le chapitre, sans texte dans l'image`;

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { prompt, type: 'scolaire', maxTokens: 6000 }
      });
      if (error) throw error;

      let content = data.content || data;
      if (typeof content === 'string') {
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        content = JSON.parse(content);
      }
      const generated: ScolaireChapter[] = (content as any[]).map((c, i) => ({
        id: `sco-${Date.now()}-${i}`,
        title: c.title || `Chapitre ${i + 1}`,
        objectives: c.objectives || '',
        lesson: c.lesson || '',
        exercises: c.exercises || '',
        corrections: c.corrections || '',
        imagePrompt: c.imagePrompt || '',
      }));
      setChapters(prev => [...prev, ...generated]);
      toast.success(`${generated.length} chapitres générés !`);
    } catch (e) {
      console.error(e);
      toast.error('Erreur lors de la génération du contenu scolaire');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatChapter = (c: ScolaireChapter) =>
    `# ${c.title}\n\n## Objectifs pédagogiques\n${c.objectives}\n\n## Cours\n${c.lesson}\n\n## Exercices\n${c.exercises}\n\n## Corrigés\n${c.corrections}\n\n---\n`;

  const copyChapter = (c: ScolaireChapter) => {
    navigator.clipboard.writeText(formatChapter(c));
    toast.success('Chapitre copié');
  };
  const removeChapter = (id: string) => setChapters(prev => prev.filter(c => c.id !== id));
  const exportAll = () => {
    const md = chapters.map(formatChapter).join('\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scolaire-${level}-${subject}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Cahier exporté');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10"><GraduationCap className="w-6 h-6 text-primary" /></div>
            <div>
              <CardTitle className="text-2xl">Générateur Scolaire & Parascolaire</CardTitle>
              <CardDescription>Cahiers de révisions, fiches, exercices corrigés (CP → Terminale)</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Paramètres pédagogiques</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Niveau</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Matière</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{FORMATS.map(f => <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Thèmes / chapitres prioritaires</Label>
              <Input value={themes} onChange={e => setThemes(e.target.value)} placeholder="Ex: fractions, géométrie, conjugaison..." />
            </div>
            <div className="space-y-2">
              <Label>Nombre de chapitres</Label>
              <Select value={String(numberOfChapters)} onValueChange={v => setNumberOfChapters(parseInt(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[4,6,8,10,12].map(n => <SelectItem key={n} value={String(n)}>{n} chapitres</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Instructions supplémentaires</Label>
            <Textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} rows={3} placeholder="Ex: pédagogie Montessori, exemples ludiques..." />
          </div>
          <Button onClick={generate} disabled={isGenerating} className="w-full">
            {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Génération...</> : <><Sparkles className="w-4 h-4 mr-2" />Générer le cahier</>}
          </Button>
        </CardContent>
      </Card>

      {chapters.length > 0 && (
        <>
          <div className="flex justify-end">
            <Button variant="outline" onClick={exportAll}><Download className="w-4 h-4 mr-2" />Exporter ({chapters.length})</Button>
          </div>
          <div className="space-y-4">
            {chapters.map(c => (
              <Card key={c.id} className="border-2 hover:border-primary/40">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{c.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => copyChapter(c)}><Copy className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeChapter(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div><Badge variant="secondary">Objectifs</Badge><pre className="mt-1 whitespace-pre-wrap font-sans text-muted-foreground">{c.objectives}</pre></div>
                  <div><Badge variant="secondary">Cours</Badge><pre className="mt-1 whitespace-pre-wrap font-sans text-muted-foreground">{c.lesson}</pre></div>
                  <div><Badge variant="secondary">Exercices</Badge><pre className="mt-1 whitespace-pre-wrap font-sans text-muted-foreground">{c.exercises}</pre></div>
                  <div><Badge variant="secondary">Corrigés</Badge><pre className="mt-1 whitespace-pre-wrap font-sans text-muted-foreground">{c.corrections}</pre></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EbookScolaireGenerator;

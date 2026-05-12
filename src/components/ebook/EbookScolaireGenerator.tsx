import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Loader2, Sparkles, Download, Copy, Trash2, BookOpen, ImageIcon, FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { buildImageCacheKey, getCachedImage, setCachedImage } from '@/lib/educationalImageCache';
import { exportEbookToDocx } from '@/lib/ebookDocxExporter';
import { exportEbookToPdf } from '@/lib/ebookPdfExporter';
import { getFriendlyError } from '@/lib/errorMessages';
import { writeAutosave, readAutosave } from '@/lib/ebookProjectStorage';
import { EbookProjectsPanel } from './EbookProjectsPanel';
import { callGemini } from '@/services/geminiService';

const getGeminiKey = (): string => {
  if (typeof window === 'undefined') return '';
  return (localStorage.getItem('openai_api_key') || '').trim();
};

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

const toDisplayText = (value: unknown): string => {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  if (Array.isArray(value)) {
    return value.map((entry) => toDisplayText(entry)).filter(Boolean).join('\n\n');
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const preferredKeys = ['title', 'type', 'heading', 'name', 'label', 'instructions', 'answers', 'content', 'text', 'description'];
    const usedKeys = new Set<string>();

    const orderedValues = preferredKeys
      .filter((key) => key in record)
      .map((key) => {
        usedKeys.add(key);
        return record[key];
      });

    const remainingValues = Object.entries(record)
      .filter(([key]) => !usedKeys.has(key))
      .map(([, entry]) => entry);

    return [...orderedValues, ...remainingValues]
      .map((entry) => toDisplayText(entry))
      .filter(Boolean)
      .join('\n');
  }

  return '';
};

const EbookScolaireGenerator: React.FC<ScolaireGeneratorProps> = ({ ebookTitle }) => {
  const [level, setLevel] = useState('CM2');
  const [subject, setSubject] = useState('Mathématiques');
  const [format, setFormat] = useState('cahier-revisions');
  const [themes, setThemes] = useState('');
  const [numberOfChapters, setNumberOfChapters] = useState(6);
  const [chapters, setChapters] = useState<ScolaireChapter[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [imageStyle, setImageStyle] = useState<'hatier-school' | 'flat-clean' | 'soft-planner'>('hatier-school');
  const hydrated = useRef(false);

  // Auto-load last session
  useEffect(() => {
    const saved = readAutosave<any>('scolaire');
    if (saved) {
      if (saved.level) setLevel(saved.level);
      if (saved.subject) setSubject(saved.subject);
      if (saved.format) setFormat(saved.format);
      if (saved.themes) setThemes(saved.themes);
      if (saved.numberOfChapters) setNumberOfChapters(saved.numberOfChapters);
      if (saved.customPrompt) setCustomPrompt(saved.customPrompt);
      if (saved.imageStyle) setImageStyle(saved.imageStyle);
      if (Array.isArray(saved.chapters)) setChapters(saved.chapters);
    }
    hydrated.current = true;
  }, []);

  // Auto-save on changes
  useEffect(() => {
    if (!hydrated.current) return;
    writeAutosave('scolaire', { level, subject, format, themes, numberOfChapters, customPrompt, imageStyle, chapters });
  }, [level, subject, format, themes, numberOfChapters, customPrompt, imageStyle, chapters]);

  const loadProject = (data: any) => {
    if (!data) return;
    setLevel(data.level || 'CM2');
    setSubject(data.subject || 'Mathématiques');
    setFormat(data.format || 'cahier-revisions');
    setThemes(data.themes || '');
    setNumberOfChapters(data.numberOfChapters || 6);
    setCustomPrompt(data.customPrompt || '');
    setChapters(Array.isArray(data.chapters) ? data.chapters : []);
  };

  const generate = async () => {
    const geminiKey = getGeminiKey();
    if (!geminiKey || !geminiKey.startsWith('AIza')) {
      toast.error("Clé Gemini manquante ou invalide. Renseignez-la dans Paramètres > Clés API (commence par 'AIza').");
      return;
    }
    setIsGenerating(true);
    try {
      const fmt = FORMATS.find(f => f.id === format);
      const sysPrompt = `Tu es un professeur certifié de l'Éducation Nationale française expert en pédagogie.
RÈGLES CRITIQUES :
- Réponds UNIQUEMENT avec un tableau JSON valide (commence par [ et termine par ]).
- AUCUN texte avant ou après le JSON, AUCUN markdown, AUCUN backtick.
- Échappe correctement les guillemets et sauts de ligne dans les chaînes JSON (\\n).
- Chaque chapitre doit contenir un cours COMPLET (300-500 mots minimum), des exercices détaillés et leurs corrigés.`;
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

      const text = await callGemini(geminiKey, prompt, {
        systemPrompt: sysPrompt,
        temperature: 0.6,
        maxTokens: 16000,
        jsonMode: true,
      });

      let content: any = text;
      if (typeof content === 'string') {
        let raw = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const start = raw.indexOf('[');
        if (start > 0) raw = raw.slice(start);
        try {
          content = JSON.parse(raw);
        } catch {
          // Recover from truncated JSON: keep only complete objects
          const objects: any[] = [];
          let depth = 0, inStr = false, esc = false, objStart = -1;
          for (let i = 0; i < raw.length; i++) {
            const ch = raw[i];
            if (inStr) {
              if (esc) esc = false;
              else if (ch === '\\') esc = true;
              else if (ch === '"') inStr = false;
              continue;
            }
            if (ch === '"') { inStr = true; continue; }
            if (ch === '{') { if (depth === 0) objStart = i; depth++; }
            else if (ch === '}') {
              depth--;
              if (depth === 0 && objStart >= 0) {
                try { objects.push(JSON.parse(raw.slice(objStart, i + 1))); } catch {}
                objStart = -1;
              }
            }
          }
          if (!objects.length) throw new Error('JSON invalide reçu de l\'IA');
          content = objects;
          toast.warning(`Réponse tronquée : ${objects.length}/${numberOfChapters} chapitres récupérés`);
        }
      }
      const chapterList = Array.isArray(content)
        ? content
        : Array.isArray((content as any)?.chapters)
          ? (content as any).chapters
          : [];

      if (!chapterList.length) {
        throw new Error('Aucun chapitre valide reçu depuis le service de génération');
      }

      const generated: ScolaireChapter[] = chapterList.map((c, i) => ({
        id: `sco-${Date.now()}-${i}`,
        title: toDisplayText(c.title) || `Chapitre ${i + 1}`,
        objectives: toDisplayText(c.objectives),
        lesson: toDisplayText(c.lesson),
        exercises: toDisplayText(c.exercises),
        corrections: toDisplayText(c.corrections),
        imagePrompt: toDisplayText(c.imagePrompt),
      }));
      setChapters(generated);
      toast.success(`${generated.length} chapitres générés !`);
    } catch (e: any) {
      console.error('[Scolaire] generation error:', e);
      toast.error(e?.message || getFriendlyError(e, 'Erreur lors de la génération du contenu scolaire'));
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

  const generateChapterImage = async (chapter: ScolaireChapter, force = false) => {
    const cacheKey = buildImageCacheKey(['scolaire', level, subject, chapter.title, chapter.imagePrompt, imageStyle]);
    if (!force) {
      const cached = chapter.imageUrl || getCachedImage(cacheKey);
      if (cached) {
        if (!chapter.imageUrl) {
          setChapters(prev => prev.map(c => c.id === chapter.id ? { ...c, imageUrl: cached } : c));
        }
        toast.info('Illustration déjà générée (cache)');
        return;
      }
    }
    setChapters(prev => prev.map(c => c.id === chapter.id ? { ...c, isGeneratingImage: true } : c));
    try {
      const richContext = chapter.imagePrompt ||
        `Pedagogical scene illustrating "${chapter.title}" in ${subject} for ${level} students. Show a friendly mascot character explaining the concept with visual metaphors (diagrams, objects, arrows, colorful banners). Objectives: ${(chapter.objectives || '').slice(0, 200)}.`;
      const { data, error } = await supabase.functions.invoke('generate-educational-image', {
        body: {
          title: chapter.title,
          context: richContext,
          preset: imageStyle,
          folder: `scolaire/${level}`,
        }
      });
      if (error) throw error;
      const url = data?.imageUrl;
      if (!url) throw new Error('Pas d\'image');
      setCachedImage(cacheKey, url);
      setChapters(prev => prev.map(c => c.id === chapter.id ? { ...c, imageUrl: url, isGeneratingImage: false } : c));
      toast.success('Illustration générée');
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Erreur génération image');
      setChapters(prev => prev.map(c => c.id === chapter.id ? { ...c, isGeneratingImage: false } : c));
    }
  };

  const generateAllImages = async () => {
    for (const c of chapters) {
      if (!c.imageUrl) {
        await generateChapterImage(c);
      }
    }
  };

  const exportAll = async () => {
    try {
      await exportEbookToDocx({
        filename: `scolaire-${level}-${subject}-${Date.now()}.docx`,
        documentTitle: `${subject} - ${level}`,
        documentSubtitle: FORMATS.find(f => f.id === format)?.label,
        sections: chapters.map(c => ({
          title: c.title,
          imageUrl: c.imageUrl,
          blocks: [
            { heading: 'Objectifs pédagogiques', text: c.objectives },
            { heading: 'Cours', text: c.lesson },
            { heading: 'Exercices', text: c.exercises },
            { heading: 'Corrigés', text: c.corrections },
          ],
        })),
      });
      toast.success('Cahier exporté en .docx');
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Erreur export DOCX');
    }
  };

  const exportPdf = async () => {
    try {
      await exportEbookToPdf({
        filename: `scolaire-${level}-${subject}-${Date.now()}.pdf`,
        documentTitle: `${subject} - ${level}`,
        documentSubtitle: FORMATS.find(f => f.id === format)?.label,
        sections: chapters.map(c => ({
          title: c.title,
          imageUrl: c.imageUrl,
          blocks: [
            { heading: 'Objectifs pédagogiques', text: c.objectives },
            { heading: 'Cours', text: c.lesson },
            { heading: 'Exercices', text: c.exercises },
            { heading: 'Corrigés', text: c.corrections },
          ],
        })),
      });
      toast.success('Cahier exporté en .pdf');
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Erreur export PDF');
    }
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

      <EbookProjectsPanel
        scope="scolaire"
        label="Scolaire"
        currentData={{ level, subject, format, themes, numberOfChapters, customPrompt, chapters }}
        isEmpty={chapters.length === 0}
        onLoad={loadProject}
      />

      {chapters.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex items-center gap-2 mr-auto">
              <Label className="text-sm whitespace-nowrap">Style des illustrations :</Label>
              <Select value={imageStyle} onValueChange={(v: any) => setImageStyle(v)}>
                <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hatier-school">🎨 Style Hatier (mascotte + couleurs)</SelectItem>
                  <SelectItem value="flat-clean">✏️ Épuré (flat vector blanc)</SelectItem>
                  <SelectItem value="soft-planner">🖌️ Aquarelle douce</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={generate} disabled={isGenerating} title="Régénère tous les chapitres avec les paramètres actuels">
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Régénérer le cahier
            </Button>
            <Button variant="outline" onClick={generateAllImages}>
              <ImageIcon className="w-4 h-4 mr-2" />Générer toutes les illustrations
            </Button>
            <Button variant="outline" onClick={exportAll}><Download className="w-4 h-4 mr-2" />DOCX ({chapters.length})</Button>
            <Button onClick={exportPdf}><FileText className="w-4 h-4 mr-2" />PDF ({chapters.length})</Button>
          </div>
          <div className="space-y-4">
            {chapters.map(c => (
              <Card key={c.id} className="border-2 hover:border-primary/40">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{c.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => generateChapterImage(c)} disabled={c.isGeneratingImage} title="Générer illustration">
                        {c.isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => copyChapter(c)}><Copy className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeChapter(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {c.imageUrl && (
                    <img src={c.imageUrl} alt={c.title} className="w-full max-h-80 object-contain rounded-lg border bg-muted/30" />
                  )}
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

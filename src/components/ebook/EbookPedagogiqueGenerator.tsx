import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Loader2, Sparkles, Download, Copy, Trash2, ImageIcon, FileText, RefreshCw, Lightbulb, Star, PenLine, Wand2 } from 'lucide-react';
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

interface PedagogiqueGeneratorProps {
  ebookTitle?: string;
}

interface CalloutBox {
  type: 'saviez-vous' | 'conseil' | 'exercice' | 'point-cle';
  title: string;
  body: string;
}

interface ComparisonTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

interface SubSection {
  heading: string;
  paragraphs: string[];
}

interface PedagogiqueChapter {
  id: string;
  title: string;
  intro: string;
  subSections: SubSection[];
  callouts: CalloutBox[];
  tables: ComparisonTable[];
  imagePrompt?: string;
  imageCaption?: string;
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

const AUDIENCES = [
  'Parents (jeunes enfants)',
  'Parents (adolescents)',
  'Étudiants (lycée/supérieur)',
  'Professionnels (formation continue)',
  'Grand public (vulgarisation)',
  'Enseignants / formateurs',
  'Soignants / professions médicales',
  'Coachs & thérapeutes',
];

const TONES = [
  { id: 'pedagogique-bienveillant', label: 'Pédagogique & bienveillant' },
  { id: 'expert-accessible', label: 'Expert & accessible' },
  { id: 'narratif-immersif', label: 'Narratif & immersif' },
  { id: 'pratique-direct', label: 'Pratique & direct' },
];

const CALLOUT_META: Record<CalloutBox['type'], { icon: string; label: string; color: string; Icon: any }> = {
  'saviez-vous': { icon: '💡', label: 'Le saviez-vous ?', color: 'from-amber-50 to-yellow-50 border-amber-300', Icon: Lightbulb },
  'conseil': { icon: '✨', label: 'Conseil pratique', color: 'from-teal-50 to-cyan-50 border-teal-300', Icon: Sparkles },
  'exercice': { icon: '✍️', label: 'Exercice pratique', color: 'from-violet-50 to-purple-50 border-violet-300', Icon: PenLine },
  'point-cle': { icon: '⭐', label: 'Point clé', color: 'from-orange-50 to-rose-50 border-orange-300', Icon: Star },
};

const toText = (v: unknown): string => {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join('\n\n');
  if (typeof v === 'object') return Object.values(v as Record<string, unknown>).map(toText).filter(Boolean).join('\n');
  return '';
};

const safeJsonExtract = (raw: string): any => {
  let cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const start = cleaned.indexOf('[');
  if (start > 0) cleaned = cleaned.slice(start);
  try { return JSON.parse(cleaned); } catch { }
  const objects: any[] = [];
  let depth = 0, inStr = false, esc = false, objStart = -1;
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '\"') inStr = false;
      continue;
    }
    if (ch === '\"') { inStr = true; continue; }
    if (ch === '{') { if (depth === 0) objStart = i; depth++; }
    else if (ch === '}') {
      depth--;
      if (depth === 0 && objStart >= 0) {
        try { objects.push(JSON.parse(cleaned.slice(objStart, i + 1))); } catch { }
        objStart = -1;
      }
    }
  }
  return objects;
};

const formatChapterMarkdown = (c: PedagogiqueChapter): string => {
  let md = `# ${c.title}\n\n${c.intro}\n\n`;
  c.subSections.forEach(s => {
    md += `## ${s.heading}\n\n${s.paragraphs.join('\n\n')}\n\n`;
  });
  c.callouts.forEach(b => {
    const meta = CALLOUT_META[b.type];
    md += `> **${meta.icon} ${meta.label}** — ${b.title}\n> ${b.body.replace(/\n/g, '\n> ')}\n\n`;
  });
  c.tables.forEach(t => {
    if (t.caption) md += `_${t.caption}_\n\n`;
    md += `| ${t.headers.join(' | ')} |\n`;
    md += `| ${t.headers.map(() => '---').join(' | ')} |\n`;
    t.rows.forEach(r => { md += `| ${r.join(' | ')} |\n`; });
    md += '\n';
  });
  if (c.imageCaption) md += `_${c.imageCaption}_\n\n`;
  return md;
};

const EbookPedagogiqueGenerator: React.FC<PedagogiqueGeneratorProps> = ({ ebookTitle }) => {
  const [bookTitle, setBookTitle] = useState(ebookTitle || '');
  const [bookSubtitle, setBookSubtitle] = useState('');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [tone, setTone] = useState('pedagogique-bienveillant');
  const [numberOfChapters, setNumberOfChapters] = useState(6);
  const [calloutsPerChapter, setCalloutsPerChapter] = useState(3);
  const [tablesPerChapter, setTablesPerChapter] = useState(1);
  const [customPrompt, setCustomPrompt] = useState('');
  const [chapters, setChapters] = useState<PedagogiqueChapter[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageStyle, setImageStyle] = useState<'hatier-school' | 'flat-clean' | 'soft-planner'>('soft-planner');
  const [imageStats, setImageStats] = useState<{ success: number; failed: number; lastError: 'credits' | 'rate' | 'other' | null }>(
    { success: 0, failed: 0, lastError: null }
  );
  const hydrated = useRef(false);

  useEffect(() => {
    const saved = readAutosave<any>('pedagogique');
    if (saved) {
      if (saved.bookTitle) setBookTitle(saved.bookTitle);
      if (saved.bookSubtitle) setBookSubtitle(saved.bookSubtitle);
      if (saved.topic) setTopic(saved.topic);
      if (saved.audience) setAudience(saved.audience);
      if (saved.tone) setTone(saved.tone);
      if (saved.numberOfChapters) setNumberOfChapters(saved.numberOfChapters);
      if (saved.calloutsPerChapter) setCalloutsPerChapter(saved.calloutsPerChapter);
      if (saved.tablesPerChapter != null) setTablesPerChapter(saved.tablesPerChapter);
      if (saved.customPrompt) setCustomPrompt(saved.customPrompt);
      if (saved.imageStyle) setImageStyle(saved.imageStyle);
      if (Array.isArray(saved.chapters)) setChapters(saved.chapters);
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    writeAutosave('pedagogique', {
      bookTitle, bookSubtitle, topic, audience, tone, numberOfChapters,
      calloutsPerChapter, tablesPerChapter, customPrompt, imageStyle, chapters,
    });
  }, [bookTitle, bookSubtitle, topic, audience, tone, numberOfChapters, calloutsPerChapter, tablesPerChapter, customPrompt, imageStyle, chapters]);

  const loadProject = (data: any) => {
    if (!data) return;
    setBookTitle(data.bookTitle || '');
    setBookSubtitle(data.bookSubtitle || '');
    setTopic(data.topic || '');
    setAudience(data.audience || AUDIENCES[0]);
    setTone(data.tone || 'pedagogique-bienveillant');
    setNumberOfChapters(data.numberOfChapters || 6);
    setCalloutsPerChapter(data.calloutsPerChapter || 3);
    setTablesPerChapter(data.tablesPerChapter ?? 1);
    setCustomPrompt(data.customPrompt || '');
    setChapters(Array.isArray(data.chapters) ? data.chapters : []);
  };

  const generate = async () => {
    const geminiKey = getGeminiKey();
    if (!geminiKey || !geminiKey.startsWith('AIza')) {
      toast.error("Clé Gemini manquante ou invalide. Renseignez-la dans Paramètres > Clés API (commence par 'AIza').");
      return;
    }
    if (!topic.trim()) {
      toast.error('Indique le sujet du livre pédagogique.');
      return;
    }
    setIsGenerating(true);
    try {
      const toneLabel = TONES.find(t => t.id === tone)?.label || tone;
      const sysPrompt = `Tu es un auteur professionnel de livres pédagogiques (style Éditions Eyrolles / Larousse / Hatier).
Tu maîtrises la pédagogie : structure progressive, vulgarisation rigoureuse, exemples concrets, encadrés didactiques, tableaux comparatifs.
RÈGLES CRITIQUES :
- Réponds UNIQUEMENT avec un tableau JSON valide (commence par [ et termine par ]).
- AUCUN texte avant/après, AUCUN markdown, AUCUN backtick.
- Échappe correctement guillemets et sauts de ligne (\n) dans les chaînes.
- Contenu RICHE : intro 100-180 mots, chaque sous-section 200-350 mots minimum.
- Encadrés courts et actionnables. Tableaux factuels et structurés.`;

      const prompt = `Écris ${numberOfChapters} chapitres d'un livre pédagogique professionnel.

LIVRE : "${bookTitle || topic}"${bookSubtitle ? ` — ${bookSubtitle}` : ''}
SUJET : ${topic}
PUBLIC : ${audience}
TON : ${toneLabel}
${customPrompt ? `INSTRUCTIONS : ${customPrompt}` : ''}

Pour CHAQUE chapitre, retourne un objet JSON avec :
- title : "Chapitre N — Titre" (numérotation continue)
- intro : paragraphe d'ouverture (100-180 mots, situe le sujet et donne envie de lire)
- subSections : tableau de 3 à 5 sous-sections, chacune avec :
    - heading : titre numéroté style "1.1 Titre" (utilise la numérotation du chapitre)
    - paragraphs : tableau de 2 à 4 paragraphes pédagogiques (200-350 mots au total par sous-section)
- callouts : exactement ${calloutsPerChapter} encadrés didactiques. Chaque encadré :
    - type : un parmi "saviez-vous" | "conseil" | "exercice" | "point-cle" (varie les types)
    - title : titre court de l'encadré
    - body : contenu de 40-90 mots, concret et actionnable
- tables : ${tablesPerChapter} tableau(x) comparatif(s) factuel(s) (PAS de tableau-encadré). Chaque tableau :
    - caption : légende courte sous le tableau
    - headers : 3 à 6 colonnes (IMPORTANT : assure-toi d'avoir assez de colonnes pour une comparaison riche)
    - rows : 4 à 7 lignes de données concrètes (chiffres, étapes, comparaisons d'âges, etc.)
- imagePrompt : description en ANGLAIS d'une illustration photoréaliste/éditoriale qui résume le chapitre (sans texte dans l'image)
- imageCaption : légende française à afficher sous l'illustration (1 phrase)

QUALITÉ : surpasse-toi. Le rendu doit être digne d'un livre vendu en librairie : progression claire, exemples concrets, vocabulaire précis, jamais creux.`;

      const text = await callGemini(geminiKey, prompt, {
        systemPrompt: sysPrompt,
        temperature: 0.7,
        maxTokens: 24000,
        jsonMode: true,
      });

      let content: any = text;
      if (typeof content === 'string') {
        content = safeJsonExtract(content);
      }
      const list: any[] = Array.isArray(content)
        ? content
        : Array.isArray((content as any)?.chapters) ? (content as any).chapters : [];

      if (!list.length) throw new Error('Aucun chapitre valide reçu');
      if (list.length < numberOfChapters) {
        toast.warning(`Réponse partielle : ${list.length}/${numberOfChapters} chapitres récupérés.`);
      }

      const generated: PedagogiqueChapter[] = list.map((c: any, i: number) => ({
        id: `pedago-${Date.now()}-${i}`,
        title: toText(c.title) || `Chapitre ${i + 1}`,
        intro: toText(c.intro),
        subSections: Array.isArray(c.subSections)
          ? c.subSections.map((s: any) => ({
              heading: toText(s.heading),
              paragraphs: Array.isArray(s.paragraphs) ? s.paragraphs.map(toText) : [toText(s.paragraphs)],
            }))
          : [],
        callouts: Array.isArray(c.callouts)
          ? c.callouts
              .map((b: any) => ({
                type: (['saviez-vous', 'conseil', 'exercice', 'point-cle'].includes(b?.type) ? b.type : 'point-cle') as CalloutBox['type'],
                title: toText(b?.title),
                body: toText(b?.body),
              }))
              .filter((b: CalloutBox) => b.body)
          : [],
        tables: Array.isArray(c.tables)
          ? c.tables
              .map((t: any) => ({
                caption: toText(t?.caption),
                headers: Array.isArray(t?.headers) ? t.headers.map(toText) : [],
                rows: Array.isArray(t?.rows) ? t.rows.map((r: any) => Array.isArray(r) ? r.map(toText) : []) : [],
              }))
              .filter((t: ComparisonTable) => t.headers.length && t.rows.length)
          : [],
        imagePrompt: toText(c.imagePrompt),
        imageCaption: toText(c.imageCaption),
      }));
      setChapters(generated);
      toast.success(`${generated.length} chapitres pédagogiques générés !`);
    } catch (e: any) {
      console.error('[Pedagogique] generation error:', e);
      toast.error(e?.message || getFriendlyError(e, 'Erreur lors de la génération'));
    } finally {
      setIsGenerating(false);
    }
  };

  const copyChapter = (c: PedagogiqueChapter) => {
    navigator.clipboard.writeText(formatChapterMarkdown(c));
    toast.success('Chapitre copié');
  };
  const removeChapter = (id: string) => setChapters(prev => prev.filter(c => c.id !== id));

  const generateChapterImage = async (chapter: PedagogiqueChapter, force = false) => {
    const cacheKey = buildImageCacheKey(['pedagogique', topic, chapter.title, chapter.imagePrompt, imageStyle]);
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
        `Editorial illustration for the chapter "${chapter.title}" of a pedagogical book about ${topic}. Audience: ${audience}. Photoréalisme doux, lumière naturelle, no text.`;
      const { data, error } = await supabase.functions.invoke('generate-educational-image', {
        body: {
          title: chapter.title,
          context: richContext,
          preset: imageStyle,
          folder: `pedagogique/${(topic || 'livre').slice(0, 40)}`,
        }
      });
      if (error) throw error;
      const url = data?.imageUrl;
      if (!url) throw new Error("Pas d'image");
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
      if (!c.imageUrl) await generateChapterImage(c);
    }
  };

  const buildExportSections = () => chapters.map(c => {
    const blocks: Array<{ heading?: string; text: string }> = [];
    if (c.intro) blocks.push({ text: c.intro });
    c.subSections.forEach(s => blocks.push({ heading: s.heading, text: s.paragraphs.join('\n\n') }));
    c.callouts.forEach(b => {
      const meta = CALLOUT_META[b.type];
      blocks.push({ heading: `${meta.icon} ${meta.label} — ${b.title}`, text: b.body });
    });
    c.tables.forEach(t => {
      const tableText = [t.headers.join(' | '), ...t.rows.map(r => r.join(' | '))].join('\n');
      blocks.push({ heading: t.caption || 'Tableau', text: tableText });
    });
    return { title: c.title, imageUrl: c.imageUrl, blocks };
  });

  const exportDocx = async () => {
    try {
      await exportEbookToDocx({
        filename: `livre-pedagogique-${Date.now()}.docx`,
        documentTitle: bookTitle || topic,
        documentSubtitle: bookSubtitle,
        sections: buildExportSections(),
      });
      toast.success('Livre exporté en .docx');
    } catch (e: any) { toast.error(e?.message || 'Erreur export DOCX'); }
  };

  const exportPdf = async () => {
    try {
      await exportEbookToPdf({
        filename: `livre-pedagogique-${Date.now()}.pdf`,
        documentTitle: bookTitle || topic,
        documentSubtitle: bookSubtitle,
        sections: buildExportSections(),
      });
      toast.success('Livre exporté en .pdf');
    } catch (e: any) { toast.error(e?.message || 'Erreur export PDF'); }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10"><BookOpen className="w-6 h-6 text-primary" /></div>
            <div>
              <CardTitle className="text-2xl">Générateur de Livres Pédagogiques</CardTitle>
              <CardDescription>
                Chapitres riches façon Eyrolles / Hatier : intro + sous-sections numérotées + encadrés
                💡 Le saviez-vous • ✨ Conseil • ✍️ Exercice • ⭐ Point clé • tableaux comparatifs • illustrations légendées.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Wand2 className="w-5 h-5 text-primary" /> Paramètres du livre</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Titre du livre</Label>
              <Input value={bookTitle} onChange={e => setBookTitle(e.target.value)} placeholder="Ex: La Magie des Premiers Mots" />
            </div>
            <div className="space-y-2">
              <Label>Sous-titre</Label>
              <Input value={bookSubtitle} onChange={e => setBookSubtitle(e.target.value)} placeholder="Ex: Accompagner l'enfant dans son langage" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Sujet & angle pédagogique *</Label>
            <Textarea value={topic} onChange={e => setTopic(e.target.value)} rows={2} placeholder="Ex: comprendre et accompagner le développement du langage chez l'enfant de 0 à 5 ans" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Public cible</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{AUDIENCES.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ton</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TONES.map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Nombre de chapitres</Label>
              <Select value={String(numberOfChapters)} onValueChange={v => setNumberOfChapters(parseInt(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{[3,4,5,6,8,10,12].map(n => <SelectItem key={n} value={String(n)}>{n} chapitres</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Encadrés / chapitre</Label>
              <Select value={String(calloutsPerChapter)} onValueChange={v => setCalloutsPerChapter(parseInt(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{[2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n} encadrés</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tableaux / chapitre</Label>
              <Select value={String(tablesPerChapter)} onValueChange={v => setTablesPerChapter(parseInt(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{[0,1,2].map(n => <SelectItem key={n} value={String(n)}>{n} tableau(x)</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Instructions supplémentaires</Label>
            <Textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} rows={3} placeholder="Ex: inclure des références scientifiques, éviter le jargon, ajouter des anecdotes..." />
          </div>
          <Button onClick={generate} disabled={isGenerating} className="w-full">
            {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Génération en cours…</> : <><Sparkles className="w-4 h-4 mr-2" />Générer les chapitres pédagogiques</>}
          </Button>
        </CardContent>
      </Card>

      <EbookProjectsPanel
        scope="pedagogique"
        label="Pédagogique"
        currentData={{ bookTitle, bookSubtitle, topic, audience, tone, numberOfChapters, calloutsPerChapter, tablesPerChapter, customPrompt, chapters }}
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
                  <SelectItem value="soft-planner">🖌️ Aquarelle douce (éditorial)</SelectItem>
                  <SelectItem value="hatier-school">🎨 Hatier (mascotte + couleurs)</SelectItem>
                  <SelectItem value="flat-clean">✏️ Épuré (flat vector)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={generate} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Régénérer
            </Button>
            <Button variant="outline" onClick={generateAllImages}>
              <ImageIcon className="w-4 h-4 mr-2" />Toutes les illustrations
            </Button>
            <Button variant="outline" onClick={exportDocx}><Download className="w-4 h-4 mr-2" />DOCX</Button>
            <Button onClick={exportPdf}><FileText className="w-4 h-4 mr-2" />PDF</Button>
          </div>

          <div className="space-y-4">
            {chapters.map(c => (
              <Card key={c.id} className="border-2 hover:border-primary/40">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg">{c.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => generateChapterImage(c)} disabled={c.isGeneratingImage} title="Générer illustration">
                        {c.isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => copyChapter(c)} title="Copier"><Copy className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeChapter(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  {c.imageUrl && (
                    <figure className="space-y-1">
                      <img src={c.imageUrl} alt={c.title} className="w-full max-h-80 object-cover rounded-lg border bg-muted/30" />
                      {c.imageCaption && <figcaption className="italic text-center text-muted-foreground text-xs">{c.imageCaption}</figcaption>}
                    </figure>
                  )}
                  {c.intro && (
                    <p className="leading-relaxed text-foreground/90 whitespace-pre-wrap">{c.intro}</p>
                  )}
                  {c.subSections.map((s, i) => (
                    <div key={i} className="space-y-2">
                      <h3 className="font-serif text-base font-semibold text-foreground">{s.heading}</h3>
                      {s.paragraphs.map((p, j) => (
                        <p key={j} className="leading-relaxed text-muted-foreground whitespace-pre-wrap">{p}</p>
                      ))}
                    </div>
                  ))}
                  {c.callouts.length > 0 && (
                    <div className="grid gap-3 md:grid-cols-2">
                      {c.callouts.map((b, i) => {
                        const meta = CALLOUT_META[b.type];
                        const Icon = meta.Icon;
                        return (
                          <div key={i} className={`rounded-xl border-2 p-4 bg-gradient-to-br ${meta.color}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className="w-4 h-4" />
                              <Badge variant="secondary" className="text-xs">{meta.icon} {meta.label}</Badge>
                            </div>
                            {b.title && <div className="font-semibold mb-1">{b.title}</div>}
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{b.body}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {c.tables.map((t, i) => (
                    <div key={i} className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse border border-border rounded-lg overflow-hidden">
                        <thead className="bg-muted">
                          <tr>{t.headers.map((h, j) => (
                            <th key={j} className="border border-border px-3 py-2 text-left font-semibold">{h}</th>
                          ))}</tr>
                        </thead>
                        <tbody>
                          {t.rows.map((r, j) => (
                            <tr key={j} className={j % 2 ? 'bg-muted/30' : ''}>
                              {r.map((cell, k) => <td key={k} className="border border-border px-3 py-2">{cell}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {t.caption && <p className="text-xs italic text-center text-muted-foreground mt-1">{t.caption}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EbookPedagogiqueGenerator;

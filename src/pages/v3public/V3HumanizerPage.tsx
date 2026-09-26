import { ChangeEvent, DragEvent, useMemo, useRef, useState } from 'react';
import { Document, Packer, Paragraph } from 'docx';
import mammoth from 'mammoth/mammoth.browser';
import { saveAs } from 'file-saver';
import BackButton from '@/components/v3/BackButton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BarChart3, Clipboard, Copy, Download, Eraser, FileUp, Languages, Loader2, RefreshCw, ShieldCheck, Wand2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ThemeToggle from '@/components/v3public/ThemeToggle';
import { analyzeStylometry, countWords, type StylometricMetrics } from '@/lib/v3/humanizeMetrics';
import { getProvider, getProviderKey } from '@/services/aiWritingService';
import { usePageMeta } from '@/hooks/usePageMeta';

type Intensity = 'light' | 'medium' | 'strong';
type AuditResponse = { score?: number; markers?: string[]; recommendations?: string[] };

const TONES = [
  ['academic', 'Académique'],
  ['professional', 'Professionnel'],
  ['journalistic', 'Journalistique'],
  ['conversational', 'Conversationnel'],
  ['storytelling', 'Créatif'],
] as const;

const INTENSITIES: { value: Intensity; label: string; help: string }[] = [
  { value: 'light', label: 'Léger', help: 'Ajustements discrets, structure conservée' },
  { value: 'medium', label: 'Équilibré', help: 'Phrases et rythme retravaillés' },
  { value: 'strong', label: 'Agressif', help: 'Refonte profonde du style' },
];

const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'opération impossible';

export default function V3HumanizerPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [audit, setAudit] = useState<StylometricMetrics | null>(null);
  const [auditNotes, setAuditNotes] = useState<string[]>([]);
  const [tone, setTone] = useState('professional');
  const [intensityIndex, setIntensityIndex] = useState(1);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const fileInput = useRef<HTMLInputElement>(null);

  usePageMeta({
    title: 'HumanizeAI — Humaniseur et audit stylométrique | EbookStudio',
    description: 'Humanisez votre texte et analysez son rythme, son vocabulaire et ses marqueurs stylistiques.',
    noindex: true,
  });

  const stats = useMemo(() => {
    const words = countWords(input);
    return { words, characters: input.length, minutes: Math.max(1, Math.ceil(words / 220)) };
  }, [input]);

  const outputScore = useMemo(() => output ? 100 - analyzeStylometry(output).aiRisk : null, [output]);

  const loadFile = async (file?: File) => {
    if (!file) return;
    const extension = file.name.toLocaleLowerCase().split('.').pop();
    try {
      if (extension === 'txt') setInput(await file.text());
      else if (extension === 'docx') {
        const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        setInput(result.value.trim());
      } else throw new Error('Format accepté : .txt ou .docx');
      setOutput('');
      setAudit(null);
      toast.success('Texte importé');
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => loadFile(event.target.files?.[0]);
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    loadFile(event.dataTransfer.files?.[0]);
  };

  const pasteText = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) throw new Error('Le presse-papiers est vide');
      setInput(text);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handleHumanize = async () => {
    if (input.trim().length < 50) {
      toast.error('Merci de saisir au moins 50 caractères');
      return;
    }
    setLoading(true);
    try {
      const provider = getProvider();
      const { data, error } = await supabase.functions.invoke('humanize-content', {
        body: {
          content: input,
          intensity: INTENSITIES[intensityIndex].value,
          style: tone,
          locale: 'fr',
          userProvider: provider,
          userApiKey: getProviderKey(provider) || undefined,
        },
      });
      if (error) throw error;
      const result = data?.humanizedContent || data?.humanized || data?.text || data?.result;
      if (!result) throw new Error(data?.error || 'Aucun texte retourné');
      setOutput(result);
      toast.success('Texte humanisé');
    } catch (error) {
      toast.error(`Erreur : ${errorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAudit = async () => {
    if (input.trim().length < 50) {
      toast.error('Merci de saisir au moins 50 caractères');
      return;
    }
    setAuditLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-detection-score', { body: { content: input, action: 'detect' } });
      if (error) throw error;
      const response = (data ?? {}) as AuditResponse;
      setAudit(analyzeStylometry(input, response.score));
      setAuditNotes([...(response.markers ?? []), ...(response.recommendations ?? [])].slice(0, 6));
      toast.success('Audit stylométrique terminé');
    } catch (error) {
      setAudit(analyzeStylometry(input));
      setAuditNotes(['Analyse IA indisponible : les mesures objectives locales restent affichées.']);
      toast.error(`Analyse IA indisponible : ${errorMessage(error)}`);
    } finally {
      setAuditLoading(false);
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    toast.success('Texte copié');
  };

  const exportDocx = async () => {
    const document = new Document({
      sections: [{ children: output.split(/\n+/).filter(Boolean).map((text) => new Paragraph({ text })) }],
    });
    saveAs(await Packer.toBlob(document), 'texte-humanise.docx');
    toast.success('Document téléchargé');
  };

  const labels = language === 'fr'
    ? { humanizer: 'Humanisateur', audit: 'Audit stylométrique', source: 'Texte source', result: 'Texte humanisé' }
    : { humanizer: 'Humanizer', audit: 'Stylometric audit', source: 'Source text', result: 'Humanized text' };

  const Metric = ({ label, value, detail }: { label: string; value: number; detail: string }) => (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <strong className="text-lg text-foreground">{value}%</strong>
      </div>
      <Progress value={value} className="mt-3 h-2" />
      <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background px-4 py-6 text-foreground md:px-6">
      <div className="mx-auto max-w-7xl">
        <BackButton to="/v3/outils" />
        <header className="mt-4 flex flex-col gap-5 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <Wand2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-primary">Inclus dans Édition</p>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">HumanizeAI</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Réécriture naturelle et diagnostic du rythme, du vocabulaire et des automatismes d’écriture.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <Select value={language} onValueChange={(value: 'fr' | 'en') => setLanguage(value)}>
              <SelectTrigger className="w-28" aria-label="Langue de l’interface"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="fr">FR</SelectItem><SelectItem value="en">EN</SelectItem></SelectContent>
            </Select>
            <ThemeToggle variant="plain" showLabel={false} />
          </div>
        </header>

        <Tabs defaultValue="humanizer" className="mt-6">
          <TabsList className="grid h-12 w-full max-w-lg grid-cols-2">
            <TabsTrigger value="humanizer" className="gap-2"><Wand2 className="h-4 w-4" />{labels.humanizer}</TabsTrigger>
            <TabsTrigger value="audit" className="gap-2"><BarChart3 className="h-4 w-4" />{labels.audit}</TabsTrigger>
          </TabsList>

          <TabsContent value="humanizer" className="mt-6 space-y-5">
            <div className="grid gap-4 rounded-md border border-border bg-card p-4 lg:grid-cols-[220px_1fr_auto] lg:items-end">
              <label className="space-y-2 text-sm font-semibold">Ton
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{TONES.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                </Select>
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold"><span>Niveau d’humanisation</span><span>{INTENSITIES[intensityIndex].label}</span></div>
                <Slider value={[intensityIndex]} min={0} max={2} step={1} onValueChange={([value]) => setIntensityIndex(value)} aria-label="Niveau d’humanisation" />
                <p className="text-xs text-muted-foreground">{INTENSITIES[intensityIndex].help}</p>
              </div>
              <Button size="lg" onClick={handleHumanize} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}{loading ? 'Humanisation…' : 'Humaniser le texte'}
              </Button>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <section className="rounded-md border border-border bg-card p-5" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-semibold">{labels.source}</h2>
                  <div className="flex gap-1">
                    <input ref={fileInput} type="file" accept=".txt,.docx" onChange={handleFile} className="hidden" />
                    <Button variant="ghost" size="sm" onClick={() => fileInput.current?.click()}><FileUp />Importer</Button>
                    <Button variant="ghost" size="sm" onClick={pasteText}><Clipboard />Coller</Button>
                    <Button variant="ghost" size="sm" onClick={() => { setInput(''); setOutput(''); }}><Eraser />Effacer</Button>
                  </div>
                </div>
                <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Collez votre texte ou déposez un fichier .txt ou .docx…" className="mt-3 min-h-[420px] resize-y" />
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground"><span>{stats.words} mots</span><span>{stats.characters} caractères</span><span>{stats.minutes} min de lecture</span></div>
              </section>

              <section className="rounded-md border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-semibold">{labels.result}</h2>
                  {outputScore !== null && <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">Humanité estimée : {outputScore}%</span>}
                </div>
                <Textarea value={output} onChange={(event) => setOutput(event.target.value)} placeholder="Le résultat apparaîtra ici…" className="mt-3 min-h-[420px] resize-y bg-muted/40" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={copyOutput} disabled={!output}><Copy />Copier</Button>
                  <Button variant="outline" size="sm" onClick={exportDocx} disabled={!output}><Download />Exporter DOCX</Button>
                  <Button variant="outline" size="sm" onClick={handleHumanize} disabled={!input || loading}><RefreshCw />Régénérer</Button>
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="mt-6 space-y-5">
            <section className="rounded-md border border-border bg-card p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Collez le texte à analyser…" className="min-h-48 flex-1 resize-y" />
                <Button size="lg" onClick={handleAudit} disabled={auditLoading}>{auditLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}{auditLoading ? 'Analyse…' : 'Analyser la signature IA'}</Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Les résultats sont des estimations éditoriales, pas une garantie face à un détecteur tiers.</p>
            </section>

            {audit && <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Risque IA estimé" value={audit.aiRisk} detail="Estimation IA complétée par les mesures locales." />
                <Metric label="Variété du vocabulaire" value={audit.vocabularyVariety} detail="Part de mots distincts dans le texte." />
                <Metric label="Variation du rythme" value={audit.rhythmVariety} detail="Écart entre les longueurs de phrases." />
                <Metric label="Densité de tics" value={audit.clichéDensity} detail="Formules fréquemment rencontrées dans les textes automatisés." />
              </div>
              {auditNotes.length > 0 && <section className="rounded-md border border-border bg-card p-5"><h2 className="font-semibold">Points à surveiller</h2><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{auditNotes.map((note) => <li key={note}>— {note}</li>)}</ul></section>}
              <section className="rounded-md border border-border bg-card p-5">
                <h2 className="font-semibold">Lecture phrase par phrase</h2>
                <TooltipProvider delayDuration={100}>
                  <div className="mt-4 text-base leading-8">
                    {audit.sentences.map((sentence, index) => (
                      <Tooltip key={`${sentence.text}-${index}`}>
                        <TooltipTrigger asChild><span className={`mr-1 rounded px-1 py-0.5 ${sentence.level === 'predictable' ? 'bg-destructive/20' : sentence.level === 'regular' ? 'bg-primary/15' : 'bg-accent/15'}`}>{sentence.text}</span></TooltipTrigger>
                        <TooltipContent className="max-w-xs">{sentence.reason}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              </section>
            </>}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

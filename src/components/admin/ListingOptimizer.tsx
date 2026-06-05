import React, { useMemo, useState } from 'react';
import { BookOpen, Copy, DollarSign, FileText, Layers, Loader2, Search, ShoppingCart, Sparkles, Star, Tag, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { niches600 } from '@/data/niches600';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

type KeywordSlot = {
  value: string;
  volume: number;
  competition: number;
  opportunity: number;
};

type CategoryRow = { name: string; fit: number; rank: string; reason: string };

// Emplacements vides au départ : aucune métrique inventée tant que l'IA n'a pas estimé.
const emptySlots = (): KeywordSlot[] =>
  Array.from({ length: 7 }, () => ({ value: '', volume: 0, competition: 0, opportunity: 0 }));

const keywordFromNiches = niches600.slice(0, 36).map((n) => n.motCleAmazon);

const formatOpportunity = (score: number) => Number.isInteger(score) ? `${score}/10` : `${score.toFixed(1).replace('.', ',')}/10`;

// Extrait le premier objet JSON d'une réponse IA (tolère ```json … ``` et texte autour).
const parseJson = <T,>(raw: string): T | null => {
  try {
    const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    return JSON.parse(cleaned.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
};

const clamp = (n: unknown, min: number, max: number, fallback: number) => {
  const v = typeof n === 'number' ? n : Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.min(max, Math.max(min, v));
};

const ListingOptimizer: React.FC = () => {
  const [bookTitle, setBookTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [market, setMarket] = useState('Amazon.fr');
  const [format, setFormat] = useState('Broché + Kindle');
  const [price, setPrice] = useState('4,99');
  const [slots, setSlots] = useState<KeywordSlot[]>(emptySlots());
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [description, setDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const filledSlots = slots.filter((slot) => slot.value.trim()).length;
  const score = useMemo(() => Math.round((filledSlots / 7) * 42 + Math.min(description.length / 18, 38) + (bookTitle.length > 35 ? 20 : 12)), [filledSlots, description.length, bookTitle.length]);

  const updateSlot = (index: number, value: string) => {
    setSlots((current) => current.map((slot, slotIndex) => slotIndex === index ? { ...slot, value } : slot));
  };

  const clearSlot = (index: number) => setSlots((current) => current.map((slot, i) => i === index ? { value: '', volume: 0, competition: 0, opportunity: 0 } : slot));

  const applySuggestion = (keyword: string) => {
    const emptyIndex = slots.findIndex((slot) => !slot.value.trim());
    if (emptyIndex === -1) {
      toast.info('Les 7 emplacements KDP sont déjà remplis.');
      return;
    }
    updateSlot(emptyIndex, keyword);
    setSuggestions((current) => current.filter((item) => item !== keyword));
  };

  const copyText = async (value: string) => {
    if (!value.trim()) return;
    await navigator.clipboard.writeText(value);
    toast.success('Copié.');
  };

  const analyze = async () => {
    if (!bookTitle.trim()) return toast.error('Indique au moins le titre du livre.');
    setAnalyzing(true);
    try {
      const prompt = `Tu es expert Amazon KDP (marché ${market}). Pour le livre ci-dessous, estime une optimisation de fiche produit.

Titre : "${bookTitle}"
${subtitle ? `Sous-titre : "${subtitle}"` : ''}
Format : ${format}

Réponds UNIQUEMENT en JSON valide, sans texte autour, avec cette forme exacte :
{
  "keywords": [ { "value": "expression de recherche", "volume": <0-100 estimation demande relative>, "competition": <0-100 estimation concurrence>, "opportunity": <0-10 score> } ]  // exactement 7 entrées, pertinentes pour le livre
  ,"suggestions": [ "mot-clé alternatif", ... ]  // 8 à 10 mots-clés supplémentaires
  ,"categories": [ { "name": "Catégorie KDP réelle", "fit": <0-100>, "rank": "Très pertinent|Pertinent|Secondaire|Support", "reason": "phrase courte" } ]  // 4 entrées
  ,"description": "Description Amazon vendeuse en français, 600-900 caractères, sauts de ligne autorisés, pas de HTML"
}
Les volumes/concurrence sont des ESTIMATIONS expertes (pas des données mesurées), reste réaliste.`;

      const raw = await callAIWriting(prompt, { temperature: 0.5, jsonMode: true });
      const data = parseJson<{
        keywords?: Array<Partial<KeywordSlot>>;
        suggestions?: string[];
        categories?: Array<Partial<CategoryRow>>;
        description?: string;
      }>(raw);

      if (!data) {
        toast.error("Réponse IA illisible, réessaie.");
        return;
      }

      const kw = (data.keywords ?? []).slice(0, 7).map((k) => ({
        value: String(k.value ?? '').trim(),
        volume: clamp(k.volume, 0, 100, 50),
        competition: clamp(k.competition, 0, 100, 50),
        opportunity: Math.round(clamp(k.opportunity, 0, 10, 7) * 10) / 10,
      }));
      const padded = [...kw, ...emptySlots()].slice(0, 7);
      setSlots(padded);
      if (data.suggestions?.length) setSuggestions(data.suggestions.filter((s) => typeof s === 'string').slice(0, 10));
      if (data.categories?.length) {
        setCategories(data.categories.slice(0, 4).map((c) => ({
          name: String(c.name ?? '').trim() || 'Catégorie',
          fit: clamp(c.fit, 0, 100, 70),
          rank: String(c.rank ?? 'Pertinent'),
          reason: String(c.reason ?? ''),
        })));
      }
      if (typeof data.description === 'string' && data.description.trim()) setDescription(data.description.trim());
      setAnalyzed(true);
      toast.success('Analyse IA générée ✓');
    } catch (e: any) {
      toast.error(e?.message || "Échec de l'analyse IA.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="border-t pt-4 text-foreground">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-primary">Optimiseur d'annonces</h2>
          <p className="text-sm text-muted-foreground">Optimisez la visibilité et le taux de conversion de votre livre sur Amazon KDP.</p>
        </div>
        <Button onClick={analyze} disabled={analyzing} className="gap-1.5">
          {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {analyzed ? 'Relancer l\'analyse IA' : 'Analyser avec l\'IA'}
        </Button>
      </div>

      <div className="mb-5 rounded-lg border bg-card p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg border bg-secondary text-primary">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="min-w-0 space-y-3">
            <div className="grid gap-2 lg:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Titre du livre</span>
                <Input value={bookTitle} onChange={(event) => setBookTitle(event.target.value)} placeholder="Titre de votre livre" />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Sous-titre</span>
                <Input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} placeholder="Sous-titre" />
              </label>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <label className="space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground">Auteur</span>
                <Input value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Auteur" />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground">Marché</span>
                <Input value={market} onChange={(event) => setMarket(event.target.value)} />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground">Format</span>
                <Input value={format} onChange={(event) => setFormat(event.target.value)} />
              </label>
            </div>
          </div>
          <div className="rounded-lg border bg-secondary px-3 py-2 text-center">
            <div className="text-[11px] text-muted-foreground">Score fiche</div>
            <div className="text-xl font-bold text-primary">{Math.min(score, 100)}/100</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="keywords" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap gap-1 bg-secondary p-1">
          <TabsTrigger value="keywords"><Tag className="mr-1.5 h-4 w-4" /> Mots clés</TabsTrigger>
          <TabsTrigger value="categories"><Layers className="mr-1.5 h-4 w-4" /> Catégories</TabsTrigger>
          <TabsTrigger value="description"><FileText className="mr-1.5 h-4 w-4" /> Description</TabsTrigger>
          <TabsTrigger value="aplus"><Sparkles className="mr-1.5 h-4 w-4" /> Contenu A+</TabsTrigger>
          <TabsTrigger value="pricing"><DollarSign className="mr-1.5 h-4 w-4" /> Tarification</TabsTrigger>
        </TabsList>

        <TabsContent value="keywords" className="space-y-4">
          {analyzed && (
            <p className="text-[11px] text-muted-foreground">
              Les volumes et niveaux de concurrence sont des <strong>estimations IA</strong> (BYOK), pas des données Amazon mesurées.
            </p>
          )}
          <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">7 emplacements pour mots clés (norme KDP)</h3>
                <Badge className="bg-primary text-primary-foreground">{filledSlots}/7 remplis</Badge>
              </div>
              <div className="space-y-4">
                {slots.map((slot, index) => (
                  <div key={index} className="grid gap-2 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</div>
                    <div className="space-y-2">
                      <Input value={slot.value} onChange={(event) => updateSlot(index, event.target.value)} placeholder="mot-clé KDP" className="bg-secondary" />
                      {slot.value.trim() && slot.volume > 0 && (
                        <div className="grid gap-3 text-xs sm:grid-cols-3">
                          <div>
                            <div className="flex justify-between text-muted-foreground"><span>Demande est.</span><strong className="text-foreground">{slot.volume}</strong></div>
                            <Progress value={slot.volume} className="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between text-muted-foreground"><span>Concurrence est.</span><strong className="text-foreground">{slot.competition} %</strong></div>
                            <Progress value={slot.competition} className="h-1.5" />
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground">Opportunité</span>
                            <Badge variant="secondary" className="font-bold text-primary">{formatOpportunity(slot.opportunity)}</Badge>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-1">
                      <Button type="button" size="icon" variant="ghost" onClick={() => clearSlot(index)} title="Vider cet emplacement"><X className="h-4 w-4" /></Button>
                      <Button type="button" size="icon" variant="ghost" onClick={() => copyText(slot.value)} title="Copier le mot-clé"><Copy className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                <h3 className="font-bold">Aperçu Amazon</h3>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xl font-black text-primary">amazone</span>
                  <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex gap-3">
                  <div className="flex aspect-[2/3] w-20 flex-col justify-between rounded border bg-secondary p-2 text-[8px] font-bold leading-tight text-foreground">
                    <span>Regardez à l'intérieur</span>
                    <span>{(bookTitle || 'Titre du livre').slice(0, 55)}</span>
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <p className="font-bold leading-tight">{bookTitle || 'Titre du livre'}</p>
                    <p className="mt-1 text-primary">{author || 'Auteur'}</p>
                    <div className="mt-1 flex items-center gap-0.5 text-primary"><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3" /></div>
                    <p className="mt-1 text-base font-bold text-primary">{price} €</p>
                    <Button size="sm" className="mt-2 w-full">Acheter maintenant</Button>
                  </div>
                </div>
                <div className="mt-4 border-t pt-3 text-xs">
                  <p className="font-bold">À propos de ce livre</p>
                  <p className="line-clamp-3 text-muted-foreground">{description || 'Lancez l\'analyse IA pour générer une description vendeuse.'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold uppercase tracking-wider text-primary">Mots-clés suggérés</h3>
              <span className="text-xs text-muted-foreground">Cliquez sur une étiquette pour remplir un emplacement libre.</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((keyword) => (
                <button key={keyword} type="button" onClick={() => applySuggestion(keyword)} className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/20">
                  ✓ {keyword}
                </button>
              ))}
              {keywordFromNiches.slice(0, 10).map((keyword) => (
                <button key={keyword} type="button" onClick={() => applySuggestion(keyword)} className="rounded-md border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                  + {keyword}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-3">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-1 text-lg font-bold">Catégories KDP recommandées</h3>
            <p className="mb-4 text-sm text-muted-foreground">Sélectionnez 2 catégories principales puis préparez la demande des catégories additionnelles au support KDP.</p>
            {categories.length === 0 ? (
              <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Lancez l'analyse IA pour obtenir des suggestions de catégories adaptées à votre livre.
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {categories.map((row) => (
                  <div key={row.name} className="rounded-lg border bg-secondary/50 p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="font-semibold">{row.name}</span>
                      <Badge variant="outline">{row.rank}</Badge>
                    </div>
                    <Progress value={row.fit} className="mb-2 h-2" />
                    <p className="text-xs text-muted-foreground">{row.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="description" className="space-y-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold">Description vendeuse</h3>
                <p className="text-sm text-muted-foreground">Accroche, promesse, bénéfices, preuve et appel à l'action.</p>
              </div>
              <Badge variant="secondary">{description.length} caractères</Badge>
            </div>
            <Textarea value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-44" placeholder="Lancez l'analyse IA ou rédigez votre description ici." />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {['Accroche', 'Problème', 'Promesse', 'Bénéfices', 'CTA'].map((label) => <Badge key={label} variant="outline" className="justify-center py-1.5">{label}</Badge>)}
              <Button variant="outline" size="sm" className="ml-auto gap-1.5" onClick={() => copyText(description)} disabled={!description.trim()}>
                <Copy className="h-3.5 w-3.5" /> Copier
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="aplus" className="space-y-3">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-1 text-lg font-bold">Structure Contenu A+</h3>
            <p className="mb-4 text-sm text-muted-foreground">Blocs prêts à transformer en visuels Amazon A+.</p>
            <div className="grid gap-3 md:grid-cols-3">
              {['Bannière promesse', '3 bénéfices visuels', 'Comparatif avant/après', 'Profil lecteur idéal', 'Checklist incluse', 'Signature auteur'].map((block) => (
                <div key={block} className="rounded-lg border bg-secondary/50 p-3">
                  <Sparkles className="mb-2 h-4 w-4 text-primary" />
                  <p className="font-semibold">{block}</p>
                  <p className="text-xs text-muted-foreground">Titre, texte court et image à générer.</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-3">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-1 text-lg font-bold">Tarification</h3>
            <p className="mb-4 text-sm text-muted-foreground">Saisissez votre prix affiché ; utilisez le module « Royalties Simulator » pour le calcul exact des marges KDP.</p>
            <label className="block max-w-[220px] space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">Prix affiché (€)</span>
              <Input value={price} onChange={(event) => setPrice(event.target.value)} />
            </label>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ListingOptimizer;

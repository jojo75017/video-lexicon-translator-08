import React, { useMemo, useState } from 'react';
import { BookOpen, Copy, DollarSign, FileText, Layers, Search, ShoppingCart, Sparkles, Star, Tag, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { niches600 } from '@/data/niches600';
import { toast } from 'sonner';

type KeywordSlot = {
  value: string;
  volume: number;
  competition: number;
  opportunity: number;
};

const initialSlots: KeywordSlot[] = [
  { value: 'non-fiction guide', volume: 74, competition: 38, opportunity: 9.1 },
  { value: 'self improvement book', volume: 88, competition: 62, opportunity: 7.4 },
  { value: 'practical how-to guide', volume: 65, competition: 45, opportunity: 8.2 },
  { value: 'beginner guide book', volume: 51, competition: 29, opportunity: 8.8 },
  { value: 'step by step guide', volume: 79, competition: 55, opportunity: 7.9 },
  { value: 'complete handbook', volume: 43, competition: 22, opportunity: 9.3 },
  { value: 'ultimate reference book', volume: 67, competition: 48, opportunity: 8.0 },
];

const defaultSuggestions = [
  'guide non-fictionnel',
  'livre de développement personnel',
  'guide pratique',
  'guide du débutant',
  'guide étape par étape',
  'manuel complet',
  'ouvrage de référence ultime',
  'guide complet',
  "livre de conseils d'experts",
  'guide des stratégies concrètes',
];

const categoryRows = [
  { name: 'Développement personnel', fit: 94, rank: 'Très pertinent', reason: 'Public large, promesse transformationnelle claire.' },
  { name: 'Santé, famille et style de vie', fit: 87, rank: 'Pertinent', reason: 'Convient aux guides pratiques orientés autonomie.' },
  { name: 'Business et carrière', fit: 73, rank: 'Secondaire', reason: 'À garder si le livre contient une méthode structurée.' },
  { name: 'Éducation et références', fit: 69, rank: 'Support', reason: 'Utile pour positionner le livre comme manuel.' },
];

const keywordFromNiches = niches600.slice(0, 36).map((n) => n.motCleAmazon);

const formatOpportunity = (score: number) => Number.isInteger(score) ? `${score}/10` : `${score.toFixed(1).replace('.', ',')}/10`;

const ListingOptimizer: React.FC = () => {
  const [bookTitle, setBookTitle] = useState("Ménage adapté à l'âge : Guide pratique pour maintenir son autonomie à domicile");
  const [subtitle, setSubtitle] = useState('Autonomiser les aidants naturels et les personnes de 55 ans et plus grâce à des stratégies de gestion du domicile intelligentes et durables');
  const [author, setAuthor] = useState('Auteur KDP');
  const [market, setMarket] = useState('Amazon.fr');
  const [format, setFormat] = useState('Broché + Kindle');
  const [price, setPrice] = useState('4,99');
  const [slots, setSlots] = useState<KeywordSlot[]>(initialSlots);
  const [suggestions, setSuggestions] = useState(defaultSuggestions);
  const [description, setDescription] = useState("Découvrez une méthode simple pour adapter votre maison, préserver votre autonomie et réduire la charge mentale des proches aidants. Ce guide pratique rassemble des conseils concrets, des checklists et des exemples applicables immédiatement pour transformer le quotidien avec sérénité.");

  const filledSlots = slots.filter((slot) => slot.value.trim()).length;
  const score = useMemo(() => Math.round((filledSlots / 7) * 42 + Math.min(description.length / 18, 38) + (bookTitle.length > 35 ? 20 : 12)), [filledSlots, description.length, bookTitle.length]);

  const updateSlot = (index: number, value: string) => {
    setSlots((current) => current.map((slot, slotIndex) => slotIndex === index ? { ...slot, value } : slot));
  };

  const clearSlot = (index: number) => updateSlot(index, '');

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
    await navigator.clipboard.writeText(value);
    toast.success('Copié.');
  };

  return (
    <div className="border-t pt-4 text-foreground">
      <div className="mb-4 space-y-2">
        <h2 className="text-2xl font-bold text-primary">Optimiseur d'annonces</h2>
        <p className="text-sm text-muted-foreground">Optimisez la visibilité et le taux de conversion de votre livre sur Amazon KDP.</p>
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
                <Input value={bookTitle} onChange={(event) => setBookTitle(event.target.value)} />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Sous-titre</span>
                <Input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} />
              </label>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <label className="space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground">Auteur</span>
                <Input value={author} onChange={(event) => setAuthor(event.target.value)} />
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
                      <div className="grid gap-3 text-xs sm:grid-cols-3">
                        <div>
                          <div className="flex justify-between text-muted-foreground"><span>Recherche Vol</span><strong className="text-foreground">{slot.volume}</strong></div>
                          <Progress value={slot.volume} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between text-muted-foreground"><span>Concours</span><strong className="text-foreground">{slot.competition} %</strong></div>
                          <Progress value={slot.competition} className="h-1.5" />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-muted-foreground">Opportunité</span>
                          <Badge variant="secondary" className="font-bold text-primary">{formatOpportunity(slot.opportunity)}</Badge>
                        </div>
                      </div>
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
                    <span>{bookTitle.slice(0, 55)}</span>
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <p className="font-bold leading-tight">{bookTitle}</p>
                    <p className="mt-1 text-primary">{author}</p>
                    <div className="mt-1 flex items-center gap-0.5 text-primary"><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3" /></div>
                    <p className="mt-1 text-base font-bold text-primary">{price} €</p>
                    <Button size="sm" className="mt-2 w-full">Acheter maintenant</Button>
                  </div>
                </div>
                <div className="mt-4 border-t pt-3 text-xs">
                  <p className="font-bold">À propos de ce livre</p>
                  <p className="line-clamp-3 text-muted-foreground">{description}</p>
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
            <div className="grid gap-3 md:grid-cols-2">
              {categoryRows.map((row) => (
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
            <Textarea value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-44" />
            <div className="mt-3 grid gap-2 md:grid-cols-5">
              {['Accroche', 'Problème', 'Promesse', 'Bénéfices', 'CTA'].map((label) => <Badge key={label} variant="outline" className="justify-center py-1.5">{label}</Badge>)}
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
            <h3 className="mb-1 text-lg font-bold">Tarification recommandée</h3>
            <p className="mb-4 text-sm text-muted-foreground">Ajustement selon format, concurrence et perception de valeur.</p>
            <div className="grid gap-3 md:grid-cols-[220px_1fr]">
              <label className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground">Prix affiché</span>
                <Input value={price} onChange={(event) => setPrice(event.target.value)} />
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">Kindle</p><p className="text-xl font-bold text-primary">3,99 €</p></div>
                <div className="rounded-lg border bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">Broché</p><p className="text-xl font-bold text-primary">12,99 €</p></div>
                <div className="rounded-lg border bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">Lancement</p><p className="text-xl font-bold text-primary">0,99 €</p></div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ListingOptimizer;
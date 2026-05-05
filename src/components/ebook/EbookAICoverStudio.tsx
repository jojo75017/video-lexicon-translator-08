import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Palette, Loader2, Download, Sparkles, Image as ImageIcon, Smartphone, BookOpen, Upload, X, Type, Copy, Ruler,
  CheckCircle2, AlertTriangle, XCircle, Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EbookAICoverStudioProps {
  ebookTitle?: string;
  authorName?: string;
  initialDescription?: string;
  onCoverGenerated?: (url: string) => void;
}

const styles = [
  { value: 'professional', label: 'Professionnel' },
  { value: 'minimalist', label: 'Minimaliste' },
  { value: 'photo', label: 'Photo réaliste' },
  { value: 'illustrated', label: 'Illustré' },
  { value: 'typographic', label: 'Typographique fort' },
  { value: 'dark', label: 'Sombre / Premium' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'romance', label: 'Romance' },
  { value: 'vintage', label: 'Vintage' },
];

const genres = [
  { value: 'non-fiction', label: 'Non-Fiction' },
  { value: 'fiction', label: 'Fiction' },
  { value: 'business', label: 'Business' },
  { value: 'self-help', label: 'Développement Personnel' },
  { value: 'fantasy', label: 'Fantasy/SF' },
  { value: 'romance', label: 'Romance' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'children', label: 'Jeunesse' },
  { value: 'cooking', label: 'Cuisine' },
];

type CoverFormat = 'kindle' | 'paperback';

interface PaperbackSpec {
  widthMm: number; heightMm: number; spineMm: number; bleed: number;
  totalWmm: number; totalHmm: number; pages?: number; paper?: string; trim: string;
}

interface GeneratedCover {
  url: string;
  desc: string;
  format: CoverFormat;
  paperbackSpec?: PaperbackSpec | null;
  prompts?: { recto: string; verso: string };
}

export const EbookAICoverStudio: React.FC<EbookAICoverStudioProps> = ({
  ebookTitle = '',
  authorName = '',
  initialDescription = '',
  onCoverGenerated,
}) => {
  const [title, setTitle] = useState(ebookTitle);
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState(authorName);
  const [format, setFormat] = useState<CoverFormat>('kindle');
  const [style, setStyle] = useState('professional');
  const [genre, setGenre] = useState('non-fiction');
  const [colorScheme, setColorScheme] = useState('');
  const [description, setDescription] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCovers, setGeneratedCovers] = useState<GeneratedCover[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPromptsPreview, setShowPromptsPreview] = useState(false);

  useEffect(() => {
    if (initialDescription.trim()) setDescription(initialDescription);
  }, [initialDescription]);

  // ========== VALIDATION DIMENSIONS BROCHÉ (en direct, avant génération) ==========
  type CheckStatus = 'ok' | 'warn' | 'error';
  interface Check { label: string; status: CheckStatus; detail: string; }

  const paperbackValidation = React.useMemo(() => {
    if (format !== 'paperback') return null;
    const brief = (initialDescription || '').toLowerCase();
    const checks: Check[] = [];

    // Trim
    const trimMatch = brief.match(/(\d{1,2}[.,]?\d?)\s*[x×]\s*(\d{1,2}[.,]?\d?)\s*cm/);
    let widthMm = 0, heightMm = 0;
    if (trimMatch) {
      widthMm = parseFloat(trimMatch[1].replace(',', '.')) * 10;
      heightMm = parseFloat(trimMatch[2].replace(',', '.')) * 10;
      const validKdp = widthMm >= 102 && widthMm <= 216 && heightMm >= 152 && heightMm <= 279;
      checks.push({
        label: 'Trim (format final)',
        status: validKdp ? 'ok' : 'warn',
        detail: `${(widthMm/10).toFixed(2)} × ${(heightMm/10).toFixed(2)} cm${validKdp ? ' — conforme KDP' : ' — hors plage KDP standard (10.2–21.6 × 15.2–27.9 cm)'}`,
      });
    } else {
      checks.push({
        label: 'Trim (format final)',
        status: 'error',
        detail: 'Aucune dimension trouvée. Renseignez le format dans Format & Tranche KDP (ex : 15.24 × 22.86 cm).',
      });
    }

    // Pages + papier
    const pagesMatch = brief.match(/(\d{2,4})\s*pages?/);
    const paper: 'cream' | 'white' = /blanc|white/.test(brief) ? 'white' : 'cream';
    if (pagesMatch) {
      const pages = parseInt(pagesMatch[1], 10);
      const validPages = pages >= 24 && pages <= 828;
      checks.push({
        label: 'Pages & papier',
        status: validPages ? 'ok' : 'error',
        detail: `${pages} pages, papier ${paper === 'white' ? 'blanc' : 'crème'}${validPages ? '' : ' — KDP exige 24 à 828 pages'}`,
      });
    } else {
      checks.push({
        label: 'Pages & papier',
        status: 'error',
        detail: 'Nombre de pages manquant — impossible de calculer le dos. Saisissez-le dans Format & Tranche KDP.',
      });
    }

    // Dos calculé
    if (pagesMatch) {
      const pages = parseInt(pagesMatch[1], 10);
      const factor = paper === 'white' ? 0.0524 : 0.0573;
      const spineMm = +(pages * factor).toFixed(2);
      const spineOk = spineMm >= 1; // KDP : pas de texte sur le dos < 80p (~4.6mm) mais structure OK >= 1mm
      checks.push({
        label: 'Dos (spine)',
        status: spineMm < 4.6 ? 'warn' : 'ok',
        detail: `${spineMm} mm calculés${spineMm < 4.6 ? ' — KDP interdit le texte sur le dos sous ~80 pages (4.6 mm)' : ' — assez large pour titre + auteur'}`,
      });
    }

    // Bleed (toujours 3.175 mm imposé par buildPaperbackSpec)
    checks.push({
      label: 'Bleed (fond perdu)',
      status: 'ok',
      detail: '3.175 mm (0.125") appliqué automatiquement sur les 4 côtés',
    });

    const hasError = checks.some((c) => c.status === 'error');
    const hasWarn = checks.some((c) => c.status === 'warn');
    return { checks, hasError, hasWarn };
  }, [format, initialDescription]);

  // ========== APERÇU DES PROMPTS AVANT GÉNÉRATION ==========
  const livePromptPreview = React.useMemo(() => {
    if (!title.trim()) return null;
    const baseArt = `Style: ${style}. Palette: ${colorScheme || 'modern, high contrast'}. Genre: ${genre}.${description ? ` Concept: ${description}.` : ''} Photorealistic magazine-grade quality, NO cartoon, NO low-fidelity, NO watermark, NO Amazon badge, NO mockup. Title typography sharp and perfectly legible.`;
    const recto = `FRONT COVER (recto) for the book "${title}"${subtitle ? `, subtitle "${subtitle}"` : ''}, by ${author || 'Author'}. Vertical portrait artwork, ratio 1.6:1, flat 2D print-ready. Title HUGE centered at top third, ${subtitle ? 'subtitle clearly below in smaller elegant type, ' : ''}author name at the bottom. ${baseArt}`;
    const verso = `BACK COVER (verso / 4ème de couverture) for the same book "${title}" by ${author || 'Author'}. Same visual universe as the front cover (same palette, lighting, typography). Vertical portrait, same dimensions as the front. Compose a clean back panel with: a short hook headline at the top, a 3–5 line synopsis area in readable body text, a small author bio block at the bottom-left, and a CLEAN EMPTY rectangular zone of 50 x 30 mm in the BOTTOM-RIGHT reserved for ISBN barcode. ${baseArt}`;
    return { recto, verso };
  }, [title, subtitle, author, style, colorScheme, genre, description]);

  const handleReferenceUpload = (file: File) => {
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Image de référence trop lourde (max 4 Mo)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setReferenceImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const generateCover = async () => {
    if (!title.trim()) {
      toast.error('Titre requis');
      return;
    }
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-cover', {
        body: {
          title,
          subtitle,
          author,
          genre,
          style,
          colorScheme,
          description,
          format,
          kdpBrief: initialDescription, // brief from KDP calculator if any
          referenceImage,
        },
      });
      if (error) throw error;
      if (!data?.imageUrl) throw new Error('Aucune image générée');

      setGeneratedCovers((prev) => [
        { url: data.imageUrl, desc: data.description || '', format, paperbackSpec: data.paperbackSpec, prompts: data.prompts },
        ...prev,
      ]);
      onCoverGenerated?.(data.imageUrl);
      toast.success(
        format === 'kindle'
          ? 'Couverture Kindle générée !'
          : 'Couverture Broché complète générée !'
      );
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCover = (cover: GeneratedCover, index: number) => {
    const link = document.createElement('a');
    link.href = cover.url;
    link.download = `couverture-${cover.format}-${index + 1}-${title.replace(/\s+/g, '-').toLowerCase() || 'livre'}.png`;
    link.click();
    toast.success('Téléchargement lancé');
  };

  const copyPrompt = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Prompt ${label} copié`);
    } catch {
      toast.error('Copie impossible');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-primary/10">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            Studio Couverture IA
            <Badge className="bg-primary/10 text-primary border-primary/30">PRO Bestseller</Badge>
          </CardTitle>
          <CardDescription>
            Générez la couverture <strong>Kindle</strong> ou <strong>Broché complet</strong> (face + dos + 4ème) avec qualité best-seller Amazon.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Paramètres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Format toggle */}
            <div className="space-y-2">
              <Label>Format de couverture</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('kindle')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    format === 'kindle'
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">Kindle eBook</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Face seule, ratio 1.6:1</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('paperback')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    format === 'paperback'
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">Broché complet</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Face + dos + 4ème</p>
                </button>
              </div>
              {format === 'paperback' && !initialDescription && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-start gap-1">
                  <Type className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  Astuce : passez par <strong>Format & Tranche KDP</strong> pour calculer le dos avant de générer.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Titre du livre</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mon livre..." />
            </div>
            <div className="space-y-2">
              <Label>Sous-titre <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
              <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Le guide ultime pour..." />
            </div>
            <div className="space-y-2">
              <Label>Nom d'auteur</Label>
              <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Jean Dupont" />
            </div>
            <div className="space-y-2">
              <Label>Genre</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {genres.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Style visuel</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {styles.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Palette de couleurs (optionnel)</Label>
              <Input value={colorScheme} onChange={(e) => setColorScheme(e.target.value)} placeholder="Ex: bleu nuit et or..." />
            </div>
            <div className="space-y-2">
              <Label>Description / concept (optionnel)</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez l'ambiance, les éléments visuels souhaités..." className="min-h-[70px]" />
            </div>

            {/* Reference image */}
            <div className="space-y-2">
              <Label>Couverture d'inspiration (optionnel)</Label>
              {referenceImage ? (
                <div className="relative rounded-lg overflow-hidden border bg-muted/20">
                  <img src={referenceImage} alt="Référence" className="w-full h-32 object-cover" />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => setReferenceImage(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  <Upload className="h-5 w-5" />
                  <span className="text-xs">Importer une couverture inspirante</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleReferenceUpload(f);
                  e.target.value = '';
                }}
              />
            </div>

            <Button className="w-full" onClick={generateCover} disabled={isGenerating || !title.trim()}>
              {isGenerating ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Génération en cours...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" /> Générer la couverture</>
              )}
            </Button>
            <p className="text-[10px] text-muted-foreground text-center">
              Modèle Pro Bestseller (Gemini 3 Pro Image) — quelques secondes par génération
            </p>
          </CardContent>
        </Card>

        {/* Gallery */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="h-5 w-5" /> Couvertures générées ({generatedCovers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedCovers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Palette className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-lg">Aucune couverture générée</p>
                <p className="text-sm">Choisissez le format Kindle ou Broché et lancez une génération</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {generatedCovers.map((cover, i) => (
                  <div key={i} className="rounded-lg border bg-muted/20 overflow-hidden">
                    <div className="flex items-center justify-between p-3 border-b bg-background/50">
                      <Badge className="bg-primary/10 text-primary border-primary/30">
                        {cover.format === 'kindle' ? '📱 Kindle eBook' : '📖 Broché complet (face + dos + 4ème)'}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => downloadCover(cover, i)}>
                          <Download className="h-3 w-3 mr-1" /> Télécharger
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            onCoverGenerated?.(cover.url);
                            toast.success('Couverture sélectionnée');
                          }}
                        >
                          ✓ Utiliser cette couverture
                        </Button>
                      </div>
                    </div>

                    <div className="relative bg-muted">
                      <img
                        src={cover.url}
                        alt={`Couverture ${i + 1}`}
                        className={`w-full object-contain ${
                          cover.format === 'kindle' ? 'max-h-[600px]' : 'max-h-[420px]'
                        }`}
                      />

                      {/* Overlay repères broché */}
                      {cover.format === 'paperback' && (
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          viewBox="0 0 100 60"
                          preserveAspectRatio="none"
                        >
                          {/* Marge de sécurité 3mm (≈3% du wrap) */}
                          <rect x="3" y="3" width="94" height="54" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.15" strokeDasharray="0.5,0.5" opacity="0.7" />
                          {/* Séparateurs panneaux : back | spine | front */}
                          <line x1="46" y1="0" x2="46" y2="60" stroke="hsl(var(--primary))" strokeWidth="0.2" strokeDasharray="0.8,0.4" opacity="0.8" />
                          <line x1="54" y1="0" x2="54" y2="60" stroke="hsl(var(--primary))" strokeWidth="0.2" strokeDasharray="0.8,0.4" opacity="0.8" />
                          {/* Zone ISBN (bas droit du panneau back) */}
                          <rect x="33" y="46" width="11" height="9" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary))" strokeWidth="0.2" />
                        </svg>
                      )}

                      {cover.format === 'paperback' && (
                        <div className="absolute inset-x-0 bottom-0 bg-background/85 backdrop-blur-sm border-t px-3 py-2 flex flex-wrap gap-3 text-[11px]">
                          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary" /> Marge sécurité 3mm</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-0.5 border-t border-dashed border-primary" /> Pliures dos</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-2 bg-primary/30 border border-primary" /> Zone ISBN (5×3 cm)</span>
                          <span className="ml-auto text-muted-foreground">4ème · Dos · Face</span>
                        </div>
                      )}
                    </div>

                    {/* Spec dimensions broché */}
                    {cover.format === 'paperback' && cover.paperbackSpec && (
                      <div className="px-3 py-2 border-t bg-muted/30 text-[11px] flex flex-wrap gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1 font-semibold"><Ruler className="w-3 h-3" /> Spec calculée :</span>
                        <span>Trim <strong>{cover.paperbackSpec.trim}</strong></span>
                        <span>Dos <strong>{cover.paperbackSpec.spineMm} mm</strong>{cover.paperbackSpec.pages ? ` (${cover.paperbackSpec.pages} p.)` : ''}</span>
                        <span>Wrap total <strong>{cover.paperbackSpec.totalWmm} × {cover.paperbackSpec.totalHmm} mm</strong></span>
                        <span>Bleed <strong>{cover.paperbackSpec.bleed} mm</strong></span>
                      </div>
                    )}

                    {/* Prompts recto + verso à copier */}
                    {cover.prompts && (
                      <div className="border-t bg-background p-3 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          Prompts professionnels prêts à copier (MidJourney, DALL·E, Imagen, Firefly…)
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="rounded-lg border bg-muted/20 p-2 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-[10px]">RECTO · Face</Badge>
                              <Button size="sm" variant="ghost" className="h-6 px-2 text-[11px]" onClick={() => copyPrompt(cover.prompts!.recto, 'recto')}>
                                <Copy className="w-3 h-3 mr-1" /> Copier
                              </Button>
                            </div>
                            <Textarea readOnly value={cover.prompts.recto} className="text-[11px] min-h-[120px] font-mono" />
                          </div>
                          <div className="rounded-lg border bg-muted/20 p-2 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-[10px]">VERSO · 4ème</Badge>
                              <Button size="sm" variant="ghost" className="h-6 px-2 text-[11px]" onClick={() => copyPrompt(cover.prompts!.verso, 'verso')}>
                                <Copy className="w-3 h-3 mr-1" /> Copier
                              </Button>
                            </div>
                            <Textarea readOnly value={cover.prompts.verso} className="text-[11px] min-h-[120px] font-mono" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EbookAICoverStudio;

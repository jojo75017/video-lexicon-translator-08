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
  CheckCircle2, AlertTriangle, XCircle, Eye, Zap, ChevronDown, ChevronUp,
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

// Registre visuel = brief artistique fort injecté dans le prompt scène
const REGISTRES = [
  { value: 'auto', label: 'Auto (détecté par l\'IA)', prompt: '' },
  { value: 'thriller', label: '🔪 Thriller / Suspense', prompt: 'Cinematic thriller cover — moody chiaroscuro, deep shadows, single dramatic light source, fog or rain, desaturated cold palette with one accent (blood red, neon blue), subject partially in shadow, sense of dread, Fincher / Villeneuve cinematography, anamorphic lens flare' },
  { value: 'business', label: '💼 Business / Productivité', prompt: 'Modern business book cover — sleek minimalist object photography (chess piece, mountain, geometric architecture, gold ingot, single bold icon), clean white or deep navy background, high-end editorial typography à la HBR / Penguin Business, premium matte texture, gold or copper accents, Atomic Habits / Sapiens energy' },
  { value: 'fantasy', label: '🐉 Fantasy / SF', prompt: 'Epic fantasy cover — sweeping painted landscape, ancient ruins or ethereal forest, magical luminescence, mist, dramatic sky (twin moons, aurora), heroic silhouette in distance, ornate medallion or weapon foreground, oil painting feel, Brandon Sanderson / Tolkien edition style' },
  { value: 'wellness', label: '🌿 Wellness / Spiritualité', prompt: 'Wellness book cover — serene natural photography, soft golden hour light, organic textures (linen, stone, water, leaves, ceramic), warm earthy palette (sage, terracotta, cream), zen composition with breathing whitespace, calming and aspirational, Goop / Mindful magazine aesthetic' },
  { value: 'romance', label: '💕 Romance', prompt: 'Romance cover — soft cinematic portrait or evocative object (rose, intertwined hands, silk fabric), warm dusky lighting, dreamy bokeh, pastel pink/gold/burgundy palette, elegant script accent typography, emotional intimate atmosphere' },
  { value: 'memoir', label: '📖 Mémoire / Récit de vie', prompt: 'Literary memoir cover — single iconic photographic object or vintage portrait, faded film grain, muted nostalgic palette (sepia, dusty blue, ochre), handwritten or classic serif typography, New Yorker / NYT bestseller feel' },
  { value: 'jeunesse', label: '🎨 Jeunesse', prompt: 'Children book cover — vibrant illustrated scene with friendly character, painted or digital art style, saturated joyful palette, playful hand-lettered title, magical atmosphere, Pixar / Disney book edition energy' },
  { value: 'cuisine', label: '🍴 Cuisine', prompt: 'Cookbook cover — top-down or close-up food photography, natural daylight, rustic wooden or marble surface, fresh ingredients, steam, warm appetizing tones, Ottolenghi / Bon Appétit editorial style' },
  { value: 'horror', label: '👻 Horror / Mystère', prompt: 'Horror cover — unsettling symbolic object, deep blacks, blood red or sickly green accent, decaying texture, lone silhouette in distance, gothic atmosphere, Stephen King paperback feel' },
];

const COVER_PRESETS = [
  { value: 'thriller', title: 'Thriller', subtitle: 'Ombres, pluie, tension, rouge sang', genre: 'thriller', style: 'thriller', colorScheme: 'noir profond, bleu froid, gris pluie, accent rouge sang', description: 'Une couverture thriller photoréaliste avec un symbole central inquiétant, lumière dure, profondeur cinématographique et tension immédiate.' },
  { value: 'business', title: 'Business', subtitle: 'Premium, clair, objet iconique, cuivre', genre: 'business', style: 'professional', colorScheme: 'blanc éditorial, bleu nuit, graphite, accent cuivre ou or', description: 'Une couverture business haut de gamme avec un objet métaphorique fort, composition minimaliste, texture mate et impact rayon Amazon.' },
  { value: 'fantasy', title: 'Fantasy', subtitle: 'Ruines, magie, ciel épique, brume', genre: 'fantasy', style: 'fantasy', colorScheme: 'bleu nuit, violet profond, vert émeraude, lumière dorée magique', description: 'Une couverture fantasy spectaculaire avec décor vaste, lumière magique, silhouette héroïque et atmosphère de grande saga.' },
  { value: 'wellness', title: 'Wellness', subtitle: 'Nature, calme, lumière douce, sage', genre: 'self-help', style: 'photo', colorScheme: 'sauge, crème, terracotta douce, lumière dorée naturelle', description: 'Une couverture wellness apaisante avec matière naturelle, respiration visuelle, lumière douce et rendu photo premium.' },
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
  const [registre, setRegistre] = useState('business');
  const [genre, setGenre] = useState('non-fiction');
  const [colorScheme, setColorScheme] = useState('');
  const [description, setDescription] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCovers, setGeneratedCovers] = useState<GeneratedCover[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPromptsPreview, setShowPromptsPreview] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
        detail: `${(widthMm/10).toFixed(2)} × ${(heightMm/10).toFixed(2)} cm${validKdp ? ' - conforme KDP' : ' - hors plage KDP standard (10.2–21.6 × 15.2–27.9 cm)'}`,
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
        detail: `${pages} pages, papier ${paper === 'white' ? 'blanc' : 'crème'}${validPages ? '' : ' - KDP exige 24 à 828 pages'}`,
      });
    } else {
      checks.push({
        label: 'Pages & papier',
        status: 'error',
        detail: 'Nombre de pages manquant - impossible de calculer le dos. Saisissez-le dans Format & Tranche KDP.',
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
        detail: `${spineMm} mm calculés${spineMm < 4.6 ? ' - KDP interdit le texte sur le dos sous ~80 pages (4.6 mm)' : ' - assez large pour titre + auteur'}`,
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

  const createFallbackCover = (reason = 'Couverture créée sans IA') => {
    if (!title.trim()) {
      toast.error('Titre requis');
      return null;
    }

    const isPaperback = format === 'paperback';
    const canvas = document.createElement('canvas');
    canvas.width = isPaperback ? 3300 : 1600;
    canvas.height = isPaperback ? 2100 : 2560;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const root = getComputedStyle(document.documentElement);
    const primary = `hsl(${root.getPropertyValue('--primary').trim() || '22 100% 55%'})`;
    const foreground = `hsl(${root.getPropertyValue('--foreground').trim() || '0 0% 8%'})`;
    const background = `hsl(${root.getPropertyValue('--background').trim() || '0 0% 100%'})`;
    const muted = `hsl(${root.getPropertyValue('--muted').trim() || '30 15% 96%'})`;

    const fillWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number) => {
      const words = text.split(/\s+/).filter(Boolean);
      const lines: string[] = [];
      let line = '';
      words.forEach((word) => {
        const testLine = line ? `${line} ${word}` : word;
        if (ctx.measureText(testLine).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = testLine;
        }
      });
      if (line) lines.push(line);
      lines.slice(0, maxLines).forEach((lineText, index) => ctx.fillText(lineText, x, y + index * lineHeight));
      return Math.min(lines.length, maxLines) * lineHeight;
    };

    const drawFront = (x: number, y: number, w: number, h: number) => {
      const activePreset = COVER_PRESETS.find((preset) => preset.value === registre)?.value || 'business';
      const gradient = ctx.createLinearGradient(x, y, x + w, y + h);

      if (activePreset === 'thriller') {
        gradient.addColorStop(0, 'hsl(222 34% 4%)');
        gradient.addColorStop(0.58, 'hsl(221 39% 11%)');
        gradient.addColorStop(1, 'hsl(0 74% 30%)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = 'hsl(220 13% 91%)';
        ctx.globalAlpha = 0.08;
        for (let i = 0; i < 16; i += 1) ctx.fillRect(x + w * (0.08 + i * 0.055), y, 2, h);
        ctx.globalAlpha = 0.28;
        ctx.fillStyle = 'hsl(0 72% 51%)';
        ctx.fillRect(x + w * 0.12, y + h * 0.68, w * 0.76, h * 0.018);
        ctx.globalAlpha = 1;
      } else if (activePreset === 'fantasy') {
        gradient.addColorStop(0, 'hsl(215 46% 15%)');
        gradient.addColorStop(0.52, 'hsl(226 37% 30%)');
        gradient.addColorStop(1, 'hsl(162 88% 20%)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, w, h);
        const moon = ctx.createRadialGradient(x + w * 0.72, y + h * 0.2, 8, x + w * 0.72, y + h * 0.2, w * 0.18);
        moon.addColorStop(0, 'hsl(49 100% 87% / 0.9)');
        moon.addColorStop(1, 'hsl(49 100% 87% / 0)');
        ctx.fillStyle = moon;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = 'hsl(48 96% 53% / 0.5)';
        ctx.beginPath();
        ctx.moveTo(x + w * 0.5, y + h * 0.18);
        ctx.lineTo(x + w * 0.58, y + h * 0.56);
        ctx.lineTo(x + w * 0.42, y + h * 0.56);
        ctx.closePath();
        ctx.fill();
      } else if (activePreset === 'wellness') {
        gradient.addColorStop(0, 'hsl(42 45% 94%)');
        gradient.addColorStop(0.58, 'hsl(96 27% 85%)');
        gradient.addColorStop(1, 'hsl(15 44% 52%)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = 'hsl(120 16% 32% / 0.34)';
        ctx.lineWidth = Math.max(8, w * 0.012);
        for (let i = 0; i < 5; i += 1) {
          ctx.beginPath();
          ctx.ellipse(x + w * (0.22 + i * 0.14), y + h * 0.66, w * 0.09, h * 0.16, -0.7, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else {
        gradient.addColorStop(0, background);
        gradient.addColorStop(0.55, muted);
        gradient.addColorStop(1, primary);
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = primary;
        ctx.globalAlpha = 0.14;
        ctx.fillRect(x + w * 0.08, y + h * 0.1, w * 0.84, h * 0.02);
        ctx.fillRect(x + w * 0.12, y + h * 0.84, w * 0.76, h * 0.018);
        ctx.globalAlpha = 1;
      }

      ctx.textAlign = 'center';
      ctx.fillStyle = foreground;
      ctx.font = `800 ${Math.max(72, Math.floor(w * 0.095))}px Inter, Arial, sans-serif`;
      const titleHeight = fillWrappedText(title.toUpperCase(), x + w / 2, y + h * 0.32, w * 0.78, Math.floor(w * 0.12), 4);

      if (subtitle.trim()) {
        ctx.font = `500 ${Math.max(34, Math.floor(w * 0.042))}px Inter, Arial, sans-serif`;
        ctx.fillStyle = foreground;
        ctx.globalAlpha = 0.78;
        fillWrappedText(subtitle, x + w / 2, y + h * 0.32 + titleHeight + h * 0.045, w * 0.72, Math.floor(w * 0.06), 2);
        ctx.globalAlpha = 1;
      }

      ctx.font = `700 ${Math.max(34, Math.floor(w * 0.044))}px Inter, Arial, sans-serif`;
      ctx.fillStyle = foreground;
      ctx.fillText(author.trim() || 'Auteur', x + w / 2, y + h * 0.9);

      ctx.font = `600 ${Math.max(18, Math.floor(w * 0.025))}px Inter, Arial, sans-serif`;
      ctx.fillStyle = primary;
      ctx.fillText((genre || 'KDP').replace('-', ' ').toUpperCase(), x + w / 2, y + h * 0.15);
    };

    if (isPaperback) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const backW = 1450;
      const spineW = 400;
      drawFront(backW + spineW, 0, backW, canvas.height);
      ctx.fillStyle = muted;
      ctx.fillRect(0, 0, backW, canvas.height);
      ctx.fillStyle = foreground;
      ctx.textAlign = 'left';
      ctx.font = '800 80px Inter, Arial, sans-serif';
      ctx.fillText('À propos du livre', 150, 260);
      ctx.font = '400 44px Inter, Arial, sans-serif';
      ctx.globalAlpha = 0.65;
      ['Un espace prêt pour votre résumé Amazon.', 'Ajoutez ensuite votre texte de 4e de couverture.', 'Zone ISBN conservée en bas à droite.'].forEach((line, idx) => ctx.fillText(line, 150, 390 + idx * 80));
      ctx.globalAlpha = 1;
      ctx.strokeStyle = primary;
      ctx.lineWidth = 6;
      ctx.strokeRect(150, canvas.height - 420, 480, 260);
      ctx.fillStyle = foreground;
      ctx.font = '700 44px Inter, Arial, sans-serif';
      ctx.fillText(author.trim() || 'Auteur', 150, canvas.height - 600);
      ctx.fillStyle = primary;
      ctx.fillRect(backW, 0, spineW, canvas.height);
      ctx.save();
      ctx.translate(backW + spineW / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = background;
      ctx.textAlign = 'center';
      ctx.font = '800 74px Inter, Arial, sans-serif';
      ctx.fillText(title.toUpperCase(), 0, -20);
      ctx.font = '600 42px Inter, Arial, sans-serif';
      ctx.fillText(author.trim() || 'Auteur', 0, 70);
      ctx.restore();
    } else {
      drawFront(0, 0, canvas.width, canvas.height);
    }

    const url = canvas.toDataURL('image/png');
    const localCover: GeneratedCover = {
      url,
      desc: reason,
      format,
      paperbackSpec: format === 'paperback' ? buildLocalPaperbackSpec() : null,
      prompts: livePromptPreview || undefined,
    };

    setGeneratedCovers((prev) => [localCover, ...prev]);
    onCoverGenerated?.(url);
    toast.success(reason);
    return localCover;
  };

  const buildLocalPaperbackSpec = (): PaperbackSpec => {
    const parsed = (initialDescription || '').toLowerCase();
    const pages = Number(parsed.match(/(\d{2,4})\s*pages?/)?.[1]) || undefined;
    const trimMatch = parsed.match(/(\d{1,2}[.,]?\d?)\s*[x×]\s*(\d{1,2}[.,]?\d?)\s*cm/);
    const widthMm = trimMatch ? parseFloat(trimMatch[1].replace(',', '.')) * 10 : 152;
    const heightMm = trimMatch ? parseFloat(trimMatch[2].replace(',', '.')) * 10 : 229;
    const paper = /blanc|white/.test(parsed) ? 'white' : 'cream';
    const spineMm = +((pages || 200) * (paper === 'white' ? 0.0524 : 0.0573)).toFixed(2);
    const bleed = 3.175;
    return {
      widthMm,
      heightMm,
      spineMm,
      bleed,
      totalWmm: +(widthMm * 2 + spineMm + bleed * 2).toFixed(2),
      totalHmm: +(heightMm + bleed * 2).toFixed(2),
      pages,
      paper,
      trim: `${(widthMm / 10).toFixed(2)}x${(heightMm / 10).toFixed(2)} cm`,
    };
  };

  const generateCover = async () => {
    if (!title.trim()) {
      toast.error('Titre requis');
      return;
    }
    if (format === 'paperback' && paperbackValidation?.hasError) {
      toast.error('Dimensions broché incomplètes - corrigez la validation avant de générer');
      return;
    }
    setIsGenerating(true);
    try {
      const invokePromise = supabase.functions.invoke('generate-ai-cover', {
          body: {
            title,
            subtitle,
            author,
            genre,
            style: (() => {
              const reg = REGISTRES.find(r => r.value === registre);
              return reg && reg.prompt ? `${reg.prompt}. Additional style note: ${style}` : style;
            })(),
            colorScheme,
            description,
            userPrompt, // ce que l'utilisateur veut VRAIMENT voir sur la couverture
            registre,
            format,
            kdpBrief: initialDescription, // brief from KDP calculator if any
            referenceImage,
          },
        });
      const timeoutPromise = new Promise<never>((_, reject) => {
        window.setTimeout(() => reject(new Error('La génération IA prend trop de temps')), 45000);
      });
      const { data, error } = await Promise.race([invokePromise, timeoutPromise]);
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la génération';
      console.error('Cover AI generation failed, using local fallback:', message);
      createFallbackCover('IA indisponible : couverture de secours créée pour continuer');
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

  const applyPreset = (preset: typeof COVER_PRESETS[number]) => {
    setRegistre(preset.value);
    setGenre(preset.genre);
    setStyle(preset.style);
    setColorScheme(preset.colorScheme);
    if (!description.trim()) setDescription(preset.description);
    toast.success(`Modèle « ${preset.title} » appliqué — décrivez maintenant la scène voulue.`);
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

      {/* ============ MODE EXPRESS 1-CLIC ============ */}
      <Card className="border-2 border-primary/40 bg-gradient-to-br from-amber-50 via-primary/5 to-orange-50 dark:from-amber-950/20 dark:via-primary/10 dark:to-orange-950/20 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-orange-400 shadow-md">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl flex items-center gap-2">
                Mode Express
              <Badge className="bg-primary/10 text-primary border-primary/30">
                Presets visibles
              </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                Choisissez un preset visible, puis générez une couverture adaptée au registre du livre.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="express-title" className="text-sm font-medium">
                Titre du livre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="express-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Les Secrets de la DME"
                className="mt-1.5 bg-background"
              />
            </div>
            <div>
              <Label htmlFor="express-author" className="text-sm font-medium">
                Nom de l'auteur
              </Label>
              <Input
                id="express-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex : Marie Dupont"
                className="mt-1.5 bg-background"
              />
            </div>
          </div>

          <div className="rounded-lg border border-primary/30 bg-background/85 p-3 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                Presets de couverture visibles
              </Label>
              <Badge variant="outline" className="border-primary/30 text-primary">Choix obligatoire</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {COVER_PRESETS.map((preset) => {
                const active = registre === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className={`min-h-[118px] rounded-lg border p-3 text-left transition-all ${
                      active
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/30 shadow-md'
                        : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base font-bold text-foreground">{preset.title}</span>
                      {active && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="mt-2 text-xs leading-snug text-muted-foreground">{preset.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={generateCover}
            disabled={isGenerating || !title.trim()}
            size="lg"
            className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-md"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Création en cours… (~30s)
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Générer ma couverture en 1 clic
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => createFallbackCover('Maquette créée avec le preset choisi')}
            disabled={isGenerating || !title.trim()}
            className="w-full"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Créer une maquette avec le preset choisi
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            ✨ Style professionnel · Format Kindle · Qualité bestseller Amazon
          </p>
        </CardContent>
      </Card>

      {/* ============ TOGGLE MODE AVANCÉ ============ */}
      <Button
        variant="ghost"
        onClick={() => setShowAdvanced((v) => !v)}
        className="w-full justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        {showAdvanced ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Masquer les options avancées
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Personnaliser (style, broché, image de référence…)
          </>
        )}
      </Button>

      {showAdvanced && (
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

            {/* ========= VALIDATION DIMENSIONS BROCHÉ EN DIRECT ========= */}
            {format === 'paperback' && paperbackValidation && (
              <div className={`rounded-lg border p-3 space-y-2 ${
                paperbackValidation.hasError
                  ? 'border-destructive/40 bg-destructive/5'
                  : paperbackValidation.hasWarn
                    ? 'border-amber-500/40 bg-amber-500/5'
                    : 'border-emerald-500/40 bg-emerald-500/5'
              }`}>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  {paperbackValidation.hasError ? (
                    <><XCircle className="w-4 h-4 text-destructive" /> Validation broché - corrections requises</>
                  ) : paperbackValidation.hasWarn ? (
                    <><AlertTriangle className="w-4 h-4 text-amber-600" /> Validation broché - avertissements</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Dimensions broché conformes KDP</>
                  )}
                </div>
                <ul className="space-y-1.5">
                  {paperbackValidation.checks.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11px]">
                      {c.status === 'ok' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />}
                      {c.status === 'warn' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />}
                      {c.status === 'error' && <XCircle className="w-3.5 h-3.5 text-destructive mt-0.5 flex-shrink-0" />}
                      <div>
                        <div className="font-medium text-foreground">{c.label}</div>
                        <div className="text-muted-foreground">{c.detail}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
              <Label>Registre visuel <span className="text-xs text-muted-foreground">(force le style de la scène)</span></Label>
              <Select value={registre} onValueChange={setRegistre}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REGISTRES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
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

            {/* ========= APERÇU PROMPTS AVANT GÉNÉRATION ========= */}
            {livePromptPreview && (
              <div className="rounded-lg border bg-muted/20">
                <button
                  type="button"
                  onClick={() => setShowPromptsPreview((v) => !v)}
                  className="w-full flex items-center justify-between p-2.5 text-xs font-semibold hover:bg-muted/40 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-primary" />
                    Voir les prompts qui seront envoyés à l'IA
                  </span>
                  <span className="text-muted-foreground">{showPromptsPreview ? '▲' : '▼'}</span>
                </button>
                {showPromptsPreview && (
                  <div className="border-t p-2 space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px]">RECTO · Face</Badge>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px]" onClick={() => copyPrompt(livePromptPreview.recto, 'recto')}>
                          <Copy className="w-3 h-3 mr-1" /> Copier
                        </Button>
                      </div>
                      <Textarea readOnly value={livePromptPreview.recto} className="text-[10px] min-h-[80px] font-mono" />
                    </div>
                    {format === 'paperback' && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px]">VERSO · 4ème</Badge>
                          <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px]" onClick={() => copyPrompt(livePromptPreview.verso, 'verso')}>
                            <Copy className="w-3 h-3 mr-1" /> Copier
                          </Button>
                        </div>
                        <Textarea readOnly value={livePromptPreview.verso} className="text-[10px] min-h-[80px] font-mono" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <Button
              className="w-full"
              onClick={generateCover}
              disabled={isGenerating || !title.trim() || (format === 'paperback' && !!paperbackValidation?.hasError)}
            >
              {isGenerating ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Génération en cours...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" /> Générer la couverture</>
              )}
            </Button>
            <p className="text-[10px] text-muted-foreground text-center">
              Modèle Pro Bestseller (Gemini 3 Pro Image) - quelques secondes par génération
            </p>
          </CardContent>
        </Card>

      </div>
      )}

      {/* Gallery */}
      <Card>
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
              <p className="text-sm">Saisissez le titre puis lancez la génération en 1 clic</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {generatedCovers.map((cover, i) => (
                <CoverCard
                  key={i}
                  cover={cover}
                  index={i}
                  onDownload={() => downloadCover(cover, i)}
                  onUse={() => {
                    onCoverGenerated?.(cover.url);
                    toast.success('Couverture sélectionnée');
                  }}
                  copyPrompt={copyPrompt}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================================
// CoverCard - affiche la couverture dans le bon ratio Amazon
// + mockup vignette/fiche pour éviter toute mauvaise surprise
// ============================================================
interface CoverCardProps {
  cover: GeneratedCover;
  index: number;
  onDownload: () => void;
  onUse: () => void;
  copyPrompt: (text: string, label: string) => void;
}

const CoverCard: React.FC<CoverCardProps> = ({ cover, index, onDownload, onUse, copyPrompt }) => {
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setDims({ w: img.naturalWidth, h: img.naturalHeight });
  };

  // Ratios cibles Amazon : Kindle 1.6:1 (2560x1600 mini), Broché variable
  const kindleTargetRatio = 1.6;
  const realRatio = dims ? dims.h / dims.w : null;
  const ratioOk = cover.format === 'kindle' && realRatio
    ? Math.abs(realRatio - kindleTargetRatio) < 0.05
    : true;
  const resolutionOk = dims ? dims.w >= 1600 && dims.h >= 2560 : true;

  return (
    <div className="rounded-lg border bg-muted/20 overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b bg-background/50">
        <Badge className="bg-primary/10 text-primary border-primary/30">
          {cover.format === 'kindle' ? '📱 Kindle eBook' : '📖 Broché complet (face + dos + 4ème)'}
        </Badge>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onDownload}>
            <Download className="h-3 w-3 mr-1" /> Télécharger
          </Button>
          <Button size="sm" onClick={onUse}>
            ✓ Utiliser cette couverture
          </Button>
        </div>
      </div>

      {/* ===== Aperçu KINDLE dans le BON ratio Amazon (1.6:1) ===== */}
      {cover.format === 'kindle' ? (
        <div className="p-4 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4 bg-gradient-to-br from-muted/30 to-background">
          {/* Cadre exact ratio Amazon Kindle */}
          <div className="flex flex-col items-center">
            <div
              className="relative bg-[#1a1a1a] rounded-md shadow-2xl overflow-hidden"
              style={{ aspectRatio: '1600 / 2560', width: '100%', maxWidth: 360 }}
            >
              <img
                ref={imgRef}
                src={cover.url}
                alt={`Couverture ${index + 1}`}
                onLoad={handleImgLoad}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                Cadre Amazon Kindle 1.6:1
              </div>
            </div>

            {/* Validation dimensions */}
            <div className="mt-3 w-full max-w-[360px] space-y-1.5">
              {dims && (
                <div className="text-[11px] flex items-center justify-between bg-background/80 border rounded-md px-2.5 py-1.5">
                  <span className="font-mono text-muted-foreground">{dims.w} × {dims.h} px</span>
                  <span className="text-muted-foreground">Ratio {realRatio?.toFixed(2)}:1</span>
                </div>
              )}
              <div className={`text-[11px] flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border ${ratioOk ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300' : 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300'}`}>
                {ratioOk ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {ratioOk ? 'Ratio conforme Amazon Kindle (1.6:1)' : `Ratio ${realRatio?.toFixed(2)}:1 — Amazon attend 1.6:1, des bandes pourront apparaître`}
              </div>
              {dims && (
                <div className={`text-[11px] flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border ${resolutionOk ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300' : 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300'}`}>
                  {resolutionOk ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  {resolutionOk ? 'Résolution suffisante (≥ 1600×2560 px)' : 'Résolution sous le minimum recommandé Amazon (1600×2560 px)'}
                </div>
              )}
            </div>
          </div>

          {/* Mockup Amazon : vignette catalogue + fiche produit */}
          <div className="space-y-3">
            <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-primary" /> Aperçu Amazon (sans surprise)
            </div>

            {/* Vignette catalogue */}
            <div className="rounded-md border bg-background p-2.5 shadow-sm">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">Vignette résultats</div>
              <div className="flex gap-2.5">
                <img src={cover.url} alt="thumb" className="w-[60px] h-[96px] object-cover rounded-sm border" />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold text-[#007185] truncate">Votre couverture</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Format Kindle</div>
                  <div className="text-[10px] text-[#B12704] font-bold mt-1">EUR 4,99</div>
                  <div className="flex items-center gap-0.5 mt-0.5 text-[#FF9E2D] text-[10px]">★★★★★</div>
                </div>
              </div>
            </div>

            {/* Fiche produit */}
            <div className="rounded-md border bg-background p-2.5 shadow-sm">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">Fiche produit</div>
              <div className="flex gap-2.5">
                <img src={cover.url} alt="detail" className="w-[90px] h-[144px] object-cover rounded-sm border" />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="text-[11px] font-semibold text-[#0F1111] truncate">Votre titre</div>
                  <div className="text-[10px] text-[#007185]">par Auteur</div>
                  <button type="button" className="mt-1 text-[10px] bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-medium rounded-full px-3 py-1 border border-[#FCD200]">
                    Acheter en 1-Click
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground leading-relaxed">
              C'est exactement ainsi que ta couverture apparaîtra sur Amazon. Si tu vois des éléments coupés ou mal cadrés, régénère avec un autre style.
            </p>
          </div>
        </div>
      ) : (
        /* ===== Aperçu BROCHÉ (inchangé, avec overlay repères) ===== */
        <div className="relative bg-muted">
          <img
            src={cover.url}
            alt={`Couverture ${index + 1}`}
            onLoad={handleImgLoad}
            className="w-full object-contain max-h-[420px]"
          />
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
          >
            <rect x="3" y="3" width="94" height="54" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.15" strokeDasharray="0.5,0.5" opacity="0.7" />
            <line x1="46" y1="0" x2="46" y2="60" stroke="hsl(var(--primary))" strokeWidth="0.2" strokeDasharray="0.8,0.4" opacity="0.8" />
            <line x1="54" y1="0" x2="54" y2="60" stroke="hsl(var(--primary))" strokeWidth="0.2" strokeDasharray="0.8,0.4" opacity="0.8" />
            <rect x="33" y="46" width="11" height="9" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary))" strokeWidth="0.2" />
          </svg>
          <div className="absolute inset-x-0 bottom-0 bg-background/85 backdrop-blur-sm border-t px-3 py-2 flex flex-wrap gap-3 text-[11px]">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary" /> Marge sécurité 3mm</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 border-t border-dashed border-primary" /> Pliures dos</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 bg-primary/30 border border-primary" /> Zone ISBN (5×3 cm)</span>
            <span className="ml-auto text-muted-foreground">4ème · Dos · Face</span>
          </div>
        </div>
      )}

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
  );
};

export default EbookAICoverStudio;

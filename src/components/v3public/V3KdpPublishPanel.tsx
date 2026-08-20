import { useEffect, useMemo, useState } from 'react';
import JSZip from 'jszip';
import { toast } from 'sonner';
import { BookMarked, Copy, Download, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { callAIWriting } from '@/services/aiWritingService';

interface V3KdpPublishPanelProps {
  title: string;
  subtitle?: string;
  author: string;
  category?: string;
  manuscript: string;
  coverUrl?: string | null;
  initialDescription?: string;
  initialKeywords?: string[];
  initialCategories?: string[];
  /** Remplit automatiquement mots-clés + catégories avec l'IA quand ils sont vides. */
  autoFill?: boolean;
}


const BISAC_SUGGESTIONS = [
  'FICTION / Thrillers / Suspense',
  'FICTION / Mystery & Detective / General',
  'FICTION / Romance / Contemporary',
  'FICTION / Fantasy / General',
  'BODY, MIND & SPIRIT / Inspiration & Personal Growth',
  'BUSINESS & ECONOMICS / Entrepreneurship',
  'SELF-HELP / Personal Growth / Success',
  'HEALTH & FITNESS / Diet & Nutrition',
  'JUVENILE FICTION / Bedtime & Dreams',
  'COOKING / General',
];

function slugify(value: string) {
  return (value || 'livre')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 60) || 'livre';
}

function extractJson(raw: string): any | null {
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch {
    return null;
  }
}

export default function V3KdpPublishPanel({
  title,
  subtitle,
  author,
  category,
  manuscript,
  coverUrl,
  initialDescription,
  initialKeywords,
  initialCategories,
  autoFill,
}: V3KdpPublishPanelProps) {
  const [description, setDescription] = useState(initialDescription || '');
  const [keywords, setKeywords] = useState<string[]>(() => {
    const base = initialKeywords?.slice(0, 7) || [];
    return Array.from({ length: 7 }, (_, i) => base[i] || '');
  });
  const [categories, setCategories] = useState<string[]>(() => {
    const base = initialCategories?.filter(Boolean).slice(0, 3) || [];
    return Array.from({ length: 3 }, (_, i) => base[i] || '');
  });
  const [authorBio, setAuthorBio] = useState('');
  const [aPlusContent, setAPlusContent] = useState('');
  const [backCoverText, setBackCoverText] = useState('');
  const [price, setPrice] = useState('9.99');
  const [zipping, setZipping] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  useEffect(() => {
    if (initialDescription && !description) setDescription(initialDescription);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDescription]);

  // Les données arrivent souvent après le premier rendu (chargement du livre) :
  // on complète alors les cases encore vides sans écraser une saisie manuelle.
  useEffect(() => {
    const base = initialKeywords?.filter(Boolean).slice(0, 7) || [];
    if (!base.length) return;
    setKeywords((prev) => prev.map((value, index) => value.trim() || base[index] || ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialKeywords || [])]);

  useEffect(() => {
    const base = initialCategories?.filter(Boolean).slice(0, 3) || [];
    if (!base.length) return;
    setCategories((prev) => prev.map((value, index) => value.trim() || base[index] || ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialCategories || [])]);

  const royalty = useMemo(() => {
    const value = Number(price.replace(',', '.'));

    if (!Number.isFinite(value) || value <= 0) return null;
    const rate = value >= 2.99 && value <= 9.99 ? 0.7 : 0.35;
    return { rate, net: value * rate };
  }, [price]);

  const copy = async (label: string, value: string) => {
    if (!value.trim()) {
      toast.error(`${label} est vide.`);
      return;
    }
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copié.`);
  };

  const generateAll = async () => {
    if (!title.trim()) {
      toast.error('Le titre du livre est requis.');
      return;
    }
    setGenerating(true);
    try {
      const excerpt = (manuscript || '').slice(0, 6000);
      const prompt = `Tu es un expert copywriting Amazon KDP francophone.
Livre : "${title}"${subtitle ? ` — sous-titre : "${subtitle}"` : ''}
Auteur : ${author || 'Auteur indépendant'}
${category ? `Genre : ${category}` : ''}
Extrait du manuscrit :
"""${excerpt}"""

Réponds UNIQUEMENT en JSON valide :
{
  "description": "description KDP vendeuse, 1500 à 3000 caractères, HTML autorisé <b> <i> <br>",
  "keywords": ["7 mots-clés longue traîne de recherche Amazon"],
  "bisac": ["3 catégories BISAC officielles en anglais"],
  "authorBio": "biographie auteur 500 à 800 caractères à la 3e personne",
  "aPlusContent": "contenu A+ Amazon : 3 modules texte (titre + paragraphe) séparés par des sauts de ligne",
  "backCover": "texte de 4e de couverture, 700 caractères max"
}`;
      const raw = await callAIWriting(prompt, { temperature: 0.8, maxTokens: 4000, jsonMode: true });
      const data = extractJson(typeof raw === 'string' ? raw : JSON.stringify(raw));
      if (!data) throw new Error('Réponse IA illisible, réessaie.');

      if (data.description) setDescription(String(data.description).slice(0, 4000));
      if (Array.isArray(data.keywords)) {
        setKeywords(Array.from({ length: 7 }, (_, i) => String(data.keywords[i] || '').slice(0, 50)));
      }
      if (Array.isArray(data.bisac)) {
        setCategories(Array.from({ length: 3 }, (_, i) => String(data.bisac[i] || '')));
      }
      if (data.authorBio) setAuthorBio(String(data.authorBio));
      if (data.aPlusContent) setAPlusContent(String(data.aPlusContent));
      if (data.backCover) setBackCoverText(String(data.backCover));
      toast.success('Contenu Amazon KDP généré ✓');
    } catch (error: any) {
      toast.error(error?.message || 'Génération impossible.');
    } finally {
      setGenerating(false);
    }
  };

  // Livre déjà terminé mais mots-clés / catégories absents : on les complète une seule fois,
  // pour que la fiche KDP ne soit jamais vide à l'ouverture.
  useEffect(() => {
    if (!autoFill || autoFilled || generating) return;
    if (!title.trim() || !manuscript.trim()) return;
    const noKeywords = keywords.every((k) => !k.trim());
    const noCategories = categories.every((c) => !c.trim());
    if (!noKeywords && !noCategories) return;
    setAutoFilled(true);
    toast.info('Mots-clés et catégories KDP en cours de génération…');
    void generateAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFill, autoFilled, title, manuscript, keywords, categories]);


    const lines = [
      `Titre : ${title}`,
      subtitle ? `Sous-titre : ${subtitle}` : '',
      `Auteur : ${author}`,
      category ? `Genre : ${category}` : '',
      `Prix conseillé : ${price} €`,
      royalty ? `Royalties estimées : ${royalty.net.toFixed(2)} € (${Math.round(royalty.rate * 100)} %)` : '',
      '',
      '--- DESCRIPTION KDP (4000 caractères max) ---',
      description,
      '',
      '--- 7 MOTS-CLÉS KDP ---',
      ...keywords.map((k, i) => `${i + 1}. ${k}`),
      '',
      '--- CATÉGORIES BISAC ---',
      ...categories.map((c, i) => `${i + 1}. ${c}`),
      '',
      '--- BIOGRAPHIE AUTEUR (Author Central) ---',
      authorBio,
      '',
      '--- 4E DE COUVERTURE ---',
      backCoverText,
      '',
      '--- CONTENU A+ AMAZON ---',
      aPlusContent,
    ];
    return lines.filter((line) => line !== undefined).join('\n');
  };

  const downloadPack = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();
      const base = slugify(title);
      zip.file(`${base}-metadonnees-kdp.txt`, buildMetadataText());
      zip.file(
        `${base}-metadonnees-kdp.json`,
        JSON.stringify(
          {
            title,
            subtitle: subtitle || '',
            author,
            category: category || '',
            price,
            description,
            keywords: keywords.filter(Boolean),
            bisac: categories.filter(Boolean),
            authorBio,
            backCover: backCoverText,
            aPlusContent,
          },
          null,
          2,
        ),
      );
      if (authorBio.trim()) zip.file(`${base}-bio-auteur.txt`, authorBio);
      if (aPlusContent.trim()) zip.file(`${base}-contenu-a-plus.txt`, aPlusContent);
      if (backCoverText.trim()) zip.file(`${base}-4e-de-couverture.txt`, backCoverText);
      if (manuscript?.trim()) zip.file(`${base}-manuscrit.md`, manuscript);
      if (coverUrl) {
        try {
          const response = await fetch(coverUrl);
          const blob = await response.blob();
          zip.file(`${base}-couverture.png`, blob);
        } catch {
          zip.file('couverture-url.txt', coverUrl);
        }
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${base}-pack-kdp.zip`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Pack KDP téléchargé.');
    } catch (error: any) {
      toast.error(error?.message || 'Impossible de générer le pack KDP.');
    } finally {
      setZipping(false);
    }
  };

  const inputStyle = {
    borderColor: 'var(--v3-border)',
    color: 'var(--v3-ink)',
    background: 'var(--v3-paper)',
  } as const;

  const chipButton = {
    borderColor: 'var(--v3-border)',
    color: 'var(--v3-ink)',
  } as const;

  return (
    <div className="rounded-[28px] border p-5 sm:p-7" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="v3-chip v3-chip-orange"><BookMarked className="h-3.5 w-3.5" /> Publication KDP</span>
          <h3 className="v3-serif mt-3 text-2xl font-bold" style={{ color: 'var(--v3-ink)' }}>Publier sur Amazon KDP</h3>
          <p className="mt-1 text-sm" style={{ color: 'var(--v3-muted)' }}>
            Tout ce que KDP te demandera : description, 7 mots-clés, catégories BISAC, bio auteur,
            4e de couverture, contenu A+ et prix.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={generateAll}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold disabled:opacity-60"
            style={{ background: 'var(--v3-ink)', color: '#fff' }}
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            Générer tout avec l'IA
          </button>
          <button
            type="button"
            onClick={downloadPack}
            disabled={zipping}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold disabled:opacity-60"
            style={{ background: 'var(--v3-orange-600)', color: '#fff' }}
          >
            {zipping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Télécharger le Pack KDP (ZIP)
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <label className="block space-y-1">
          <span className="flex items-center justify-between text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>
            <span>Description KDP</span>
            <span>{description.length} / 4000</span>
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 4000))}
            rows={8}
            placeholder="Accroche, promesse, bénéfices, appel à l’action…"
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => copy('Description', description)}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold"
            style={chipButton}
          >
            <Copy className="h-3.5 w-3.5" /> Copier la description
          </button>
        </label>

        <div>
          <span className="text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>7 mots-clés KDP</span>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {keywords.map((keyword, index) => (
              <input
                key={index}
                value={keyword}
                onChange={(e) => setKeywords((prev) => prev.map((k, i) => (i === index ? e.target.value.slice(0, 50) : k)))}
                placeholder={`Mot-clé ${index + 1}`}
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                style={inputStyle}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => copy('Mots-clés', keywords.filter(Boolean).join('\n'))}
            className="mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold"
            style={chipButton}
          >
            <Copy className="h-3.5 w-3.5" /> Copier les mots-clés
          </button>
        </div>

        <div>
          <span className="text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>Catégories BISAC (3 max)</span>
          <div className="mt-2 grid gap-2 md:grid-cols-3">
            {categories.map((value, index) => (
              <input
                key={index}
                list="v3-bisac-suggestions"
                value={value}
                onChange={(e) => setCategories((prev) => prev.map((c, i) => (i === index ? e.target.value : c)))}
                placeholder={`Catégorie ${index + 1}`}
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                style={inputStyle}
              />
            ))}
          </div>
          <datalist id="v3-bisac-suggestions">
            {BISAC_SUGGESTIONS.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>

        <label className="block space-y-1">
          <span className="flex items-center justify-between text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>
            <span>Biographie auteur (Author Central)</span>
            <span>{authorBio.length} / 2000</span>
          </span>
          <textarea
            value={authorBio}
            onChange={(e) => setAuthorBio(e.target.value.slice(0, 2000))}
            rows={4}
            placeholder="Qui est l’auteur, son parcours, sa légitimité, son univers…"
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => copy('Biographie auteur', authorBio)}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold"
            style={chipButton}
          >
            <Copy className="h-3.5 w-3.5" /> Copier la bio
          </button>
        </label>

        <label className="block space-y-1">
          <span className="flex items-center justify-between text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>
            <span>4e de couverture</span>
            <span>{backCoverText.length} / 1200</span>
          </span>
          <textarea
            value={backCoverText}
            onChange={(e) => setBackCoverText(e.target.value.slice(0, 1200))}
            rows={4}
            placeholder="Texte imprimé au dos du livre broché."
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => copy('4e de couverture', backCoverText)}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold"
            style={chipButton}
          >
            <Copy className="h-3.5 w-3.5" /> Copier la 4e de couverture
          </button>
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>
            Contenu A+ Amazon (modules texte)
          </span>
          <textarea
            value={aPlusContent}
            onChange={(e) => setAPlusContent(e.target.value)}
            rows={6}
            placeholder="Module 1 : titre + paragraphe / Module 2 : … / Module 3 : …"
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => copy('Contenu A+', aPlusContent)}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold"
            style={chipButton}
          >
            <Copy className="h-3.5 w-3.5" /> Copier le contenu A+
          </button>
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>Prix de vente (€)</span>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
              style={inputStyle}
            />
          </label>
          <div className="rounded-xl border px-3 py-2 text-sm" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)' }}>
            <span className="flex items-center gap-2 text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>
              <Sparkles className="h-3.5 w-3.5" /> Royalties estimées
            </span>
            <span className="mt-1 block font-bold">
              {royalty ? `${royalty.net.toFixed(2)} € par vente (${Math.round(royalty.rate * 100)} %)` : 'Prix invalide'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

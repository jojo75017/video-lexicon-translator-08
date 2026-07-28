import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Loader2, Lock, Check, Download, ArrowLeft, Wand2, Save, FileText, Printer, Image as ImageIcon, Moon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useProjectSave } from '@/hooks/useProjectSave';
import {
  Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, AlignmentType, PageBreak,
  PageOrientation,
} from 'docx';
import { saveAs } from 'file-saver';
import {
  ILLUSTRATION_STYLES,
  buildCharacterBibleText,
  canUseKidsBook,
  computeSpineWidth,
  KIDS_BOOK_IMAGE_MODEL,
  KIDS_BOOK_PRESETS,
  type KidsBookDraft,
  type KidsStory,
  type IllustrationStyle,
  type KidsPresetId,
} from '@/config/kidsBookConfig';
import type { V3Plan } from '@/data/v3ToolPlans';


const STORAGE_KEY = 'v3_kids_book_draft_v2';
const PROJECT_ID_KEY = 'v3_kids_book_project_id';


function loadDraft(): KidsBookDraft {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* noop */ }
  return {
    title: '',
    subtitle: '',
    authorName: '',
    synopsis: '',
    targetAge: '3-6 ans',
    style: 'pixar-3d',
    chapterCount: 10,
    wordsPerStory: 120,
    character: { name: '', age: '4 ans', physical: '', outfit: '' },
    stories: [],
  };
}

type Phase = 'idle' | 'stories' | 'illustrations' | 'done';

export default function V3KidsBookCreatePage() {
  const nav = useNavigate();
  const { saveSpecializedProject, updateSpecializedProject } = useProjectSave();
  const [plan, setPlan] = useState<V3Plan | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [draft, setDraft] = useState<KidsBookDraft>(loadDraft);
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [projectId, setProjectId] = useState<string | null>(() => {
    try { return localStorage.getItem(PROJECT_ID_KEY); } catch { return null; }
  });
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'docx' | null>(null);
  const [generatingCover, setGeneratingCover] = useState(false);
  const [generatingBack, setGeneratingBack] = useState(false);
  const [pageCount, setPageCount] = useState<number>(32);

  const generateCover = async () => {
    if (!draft.title) return toast.error('Ajoute un titre avant de créer la couverture.');
    setGeneratingCover(true);
    try {
      const stylePrompt = ILLUSTRATION_STYLES.find((s) => s.id === draft.style)?.prompt || '';
      const model = KIDS_BOOK_IMAGE_MODEL[plan || 'expert'];
      const characterBible = buildCharacterBibleText(draft.character);
      const coverScene = `Couverture professionnelle de livre jeunesse KDP, format album carré. Grand titre "${draft.title}" en typographie manuscrite enfantine, colorée et lisible, occupant le haut de la couverture. ${draft.subtitle ? `Sous-titre: "${draft.subtitle}". ` : ''}Nom de l'auteur "${draft.authorName}" en bas de la couverture, plus petit. Illustration centrale mettant en scène ${draft.character.name} de manière expressive et joyeuse, ambiance ${draft.synopsis || 'douce et magique'}. Composition professionnelle équilibrée, marges nettes, couleurs vives, style prêt à imprimer pour Amazon KDP.`;
      const { data: img, error: imgErr } = await supabase.functions.invoke('agent-illustrator', {
        body: {
          bookId: 'draft-cover',
          storyId: 'cover',
          characterBible,
          scene: coverScene,
          stylePrompt,
          model,
        },
      });
      if (imgErr || !img?.url) throw new Error(imgErr?.message || img?.error || 'échec');
      setDraft((d) => ({ ...d, coverUrl: img.url }));
      toast.success('Couverture créée ✨');
    } catch (e: any) {
      toast.error(e.message || 'Erreur génération couverture');
    } finally {
      setGeneratingCover(false);
    }
  };

  const generateBackCover = async () => {
    if (!draft.title) return toast.error('Ajoute un titre avant de créer la 4e de couverture.');
    setGeneratingBack(true);
    try {
      const stylePrompt = ILLUSTRATION_STYLES.find((s) => s.id === draft.style)?.prompt || '';
      const model = KIDS_BOOK_IMAGE_MODEL[plan || 'expert'];
      const characterBible = buildCharacterBibleText(draft.character);
      const backText = draft.backCoverText
        || `Un livre tendre pour les enfants de ${draft.targetAge}. ${draft.synopsis || ''}`.trim();
      const backScene = `4e de couverture professionnelle de livre jeunesse KDP, format album carré. Zone de texte lisible en haut ou au centre pour un résumé (laisser un large espace blanc/uniforme d'au moins 40% de la surface pour permettre l'ajout du texte). Petite illustration secondaire cohérente avec l'univers, montrant ${draft.character.name} de dos ou dans une scène calme, ambiance douce, ${draft.synopsis || 'univers du livre'}. Marges nettes, palette assortie à la 1ère de couverture. Pas de titre, pas de texte imprimé dans l'image — juste illustration + fond neutre pour texte.`;
      const { data: img, error: imgErr } = await supabase.functions.invoke('agent-illustrator', {
        body: {
          bookId: 'draft-back',
          storyId: 'back',
          characterBible,
          scene: backScene,
          stylePrompt,
          model,
        },
      });
      if (imgErr || !img?.url) throw new Error(imgErr?.message || img?.error || 'échec');
      setDraft((d) => ({ ...d, backCoverUrl: img.url, backCoverText: backText }));
      toast.success('4e de couverture créée ✨');
    } catch (e: any) {
      toast.error(e.message || 'Erreur génération 4e de couverture');
    } finally {
      setGeneratingBack(false);
    }
  };

  const spine = computeSpineWidth(pageCount);



  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoadingPlan(false); return; }
      const { data: sub } = await (supabase as any)
        .from('subscribers').select('plan_tier').eq('user_id', user.id).maybeSingle();
      const tier = (sub?.plan_tier ?? '').toLowerCase();
      if (tier.includes('auteur') || tier.includes('editeur') || tier.includes('vip')) setPlan('auteur');
      else if (tier.includes('expert') || tier.includes('studio')) setPlan('expert');
      else if (tier) setPlan('debutant');
      setLoadingPlan(false);
    })();
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch { /* noop */ }
  }, [draft]);

  const update = (patch: Partial<KidsBookDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const updateChar = (patch: Partial<KidsBookDraft['character']>) =>
    setDraft((d) => ({ ...d, character: { ...d.character, ...patch } }));

  const generateAll = async () => {
    if (!draft.title) return toast.error('Ajoute un titre.');
    if (!draft.authorName) return toast.error('Le nom d\'auteur est obligatoire.');
    if (!draft.synopsis) return toast.error('Ajoute un synopsis / pitch du livre.');
    if (!draft.character.name || !draft.character.physical) {
      return toast.error('Complète la bible du personnage (prénom + description physique).');
    }
    const count = Math.max(1, Math.min(30, draft.chapterCount || 10));
    const words = Math.max(30, Math.min(400, draft.wordsPerStory || 120));

    try {
      // 1) Génération des histoires (titre + synopsis + contenu)
      setPhase('stories');
      setProgress({ done: 0, total: count });
      const { data, error } = await supabase.functions.invoke('agent-kids-stories', {
        body: {
          bookTitle: draft.title,
          subtitle: draft.subtitle,
          synopsis: draft.synopsis,
          targetAge: draft.targetAge,
          characterBible: buildCharacterBibleText(draft.character),
          count,
          wordsPerStory: words,
        },
      });
      if (error || !data?.stories?.length) {
        throw new Error(error?.message || data?.error || 'Aucune histoire générée');
      }
      const stories: KidsStory[] = data.stories.map((s: any) => ({
        id: crypto.randomUUID(),
        title: s.title,
        synopsis: s.synopsis,
        content: s.content || '',
      }));
      setDraft((d) => ({ ...d, stories }));
      toast.success(`${stories.length} histoires écrites ✨`);

      // 2) Illustrations (une par histoire, en série pour respecter les quotas)
      setPhase('illustrations');
      setProgress({ done: 0, total: stories.length });
      const stylePrompt = ILLUSTRATION_STYLES.find((s) => s.id === draft.style)?.prompt || '';
      const model = KIDS_BOOK_IMAGE_MODEL[plan || 'expert'];
      const characterBible = buildCharacterBibleText(draft.character);

      for (let i = 0; i < stories.length; i++) {
        const story = stories[i];
        try {
          const { data: img, error: imgErr } = await supabase.functions.invoke('agent-illustrator', {
            body: {
              bookId: 'draft',
              storyId: story.id,
              characterBible,
              scene: story.synopsis,
              stylePrompt,
              model,
            },
          });
          if (imgErr || !img?.url) throw new Error(imgErr?.message || img?.error || 'échec');
          stories[i] = { ...story, illustrationUrl: img.url };
          setDraft((d) => ({ ...d, stories: [...stories] }));
        } catch (e: any) {
          toast.error(`Illustration ${i + 1} : ${e.message}`);
        }
        setProgress({ done: i + 1, total: stories.length });
      }

      setPhase('done');
      toast.success('Livre prêt — tu peux l\'exporter.');
    } catch (e: any) {
      toast.error(e.message || 'Erreur de génération');
      setPhase('idle');
    }
  };

  const saveToCloud = async () => {
    if (!draft.title) return toast.error('Ajoute un titre avant de sauvegarder.');
    setSaving(true);
    const payload = {
      title: draft.title,
      author_name: draft.authorName,
      project_type: 'kids_book' as any,
      target_audience: draft.targetAge,
      book_summary: draft.synopsis || '',
      number_of_chapters: draft.stories.length || draft.chapterCount || 0,
      characters: [draft.character],
      chapters: draft.stories.map((s, i) => ({
        chapter_number: i + 1,
        title: s.title,
        content: s.content || '',
        synopsis: s.synopsis,
        illustration_url: s.illustrationUrl || null,
      })),
      ebook_images: draft.stories
        .filter((s) => s.illustrationUrl)
        .map((s) => ({ story_id: s.id, url: s.illustrationUrl })),
      writing_style: draft.style,
    };
    let id = projectId;
    if (id) {
      const ok = await updateSpecializedProject(id, payload);
      if (!ok) id = null;
    }
    if (!id) {
      id = await saveSpecializedProject(payload);
      if (id) {
        setProjectId(id);
        try { localStorage.setItem(PROJECT_ID_KEY, id); } catch { /* noop */ }
      }
    }
    setSaving(false);
  };

  const exportHtml = () => {
    const html = buildAlbumHtml(draft);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(draft.title || 'album').replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Album HTML téléchargé.');
  };

  const exportPdf = () => {
    setExporting('pdf');
    try {
      const html = buildAlbumHtml(draft);
      const w = window.open('', '_blank');
      if (!w) { toast.error('Autorise les pop-ups pour imprimer.'); return; }
      w.document.write(html);
      w.document.close();
      // Laisser le temps aux images de charger avant impression
      const trigger = () => { try { w.focus(); w.print(); } catch { /* noop */ } };
      w.onload = () => setTimeout(trigger, 800);
      setTimeout(trigger, 2500);
      toast.success('Boîte d\'impression ouverte — choisis "Enregistrer au format PDF".');
    } finally {
      setExporting(null);
    }
  };

  const fetchImgBytes = async (url: string): Promise<Uint8Array | null> => {
    try {
      const r = await fetch(url);
      const buf = await r.arrayBuffer();
      return new Uint8Array(buf);
    } catch { return null; }
  };

  const exportDocx = async () => {
    setExporting('docx');
    try {
      // KDP square 21.59 x 21.59 cm = 8.5" x 8.5" = 12240 x 12240 DXA
      const PAGE = 12240;
      const MARGIN = 720; // 0.5"
      const children: Paragraph[] = [];

      // ---- Couverture ----
      if (draft.coverUrl) {
        const coverBytes = await fetchImgBytes(draft.coverUrl);
        if (coverBytes) {
          children.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new ImageRun({
              type: 'png',
              data: coverBytes,
              transformation: { width: 560, height: 560 },
              altText: { title: 'Couverture', description: draft.title, name: 'cover' },
            } as any)],
          }));
          children.push(new Paragraph({ children: [new PageBreak()] }));
        }
      }

      // ---- Page de titre ----
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER, heading: HeadingLevel.TITLE,
        spacing: { before: 2400, after: 200 },
        children: [new TextRun({ text: draft.title, bold: true, size: 72 })],
      }));
      if (draft.subtitle) {
        children.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: draft.subtitle, italics: true, size: 32 })],
        }));
      }
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { before: 400 },
        children: [new TextRun({ text: draft.authorName, size: 32 })],
      }));
      children.push(new Paragraph({ children: [new PageBreak()] }));

      // ---- Sommaire ----
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Sommaire', bold: true })],
      }));
      draft.stories.forEach((s, i) => {
        children.push(new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 120 },
          children: [new TextRun({ text: `${i + 1}. ${s.title || 'Histoire'}`, size: 26 })],
        }));
      });
      children.push(new Paragraph({ children: [new PageBreak()] }));

      // ---- Histoires ----
      for (let i = 0; i < draft.stories.length; i++) {
        const s = draft.stories[i];
        if (s.illustrationUrl) {
          const bytes = await fetchImgBytes(s.illustrationUrl);
          if (bytes) {
            children.push(new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new ImageRun({
                type: 'png',
                data: bytes,
                transformation: { width: 500, height: 500 },
                altText: { title: s.title || 'Illustration', description: s.synopsis || '', name: `story-${i + 1}` },
              } as any)],
            }));
            children.push(new Paragraph({ children: [new PageBreak()] }));
          }
        }
        children.push(new Paragraph({
          heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `${i + 1}. ${s.title || 'Histoire'}`, bold: true })],
        }));
        children.push(new Paragraph({
          alignment: AlignmentType.JUSTIFIED, spacing: { after: 200, line: 360 },
          children: [new TextRun({ text: s.content || s.synopsis || '', size: 28 })],
        }));
        children.push(new Paragraph({ children: [new PageBreak()] }));
      }

      // Remerciements
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Remerciements', bold: true })],
      }));
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 200 },
        children: [new TextRun({
          text: `Un immense merci à toi, petit lecteur, ainsi qu'aux parents, grands-parents et enseignants qui prennent le temps de partager ces histoires. Merci à tous ceux qui, de près ou de loin, ont soufflé sur les pages de ce livre pour lui donner vie.`,
          size: 26,
        })],
      }));
      children.push(new Paragraph({ children: [new PageBreak()] }));

      // Mot de l'auteur
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Le mot de l'auteur", bold: true })],
      }));
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 200 },
        children: [new TextRun({
          text: `J'ai écrit ${draft.title} avec l'envie de faire grandir la curiosité, la tendresse et le sourire des plus petits. Chaque histoire est une petite graine à planter dans le cœur des enfants — j'espère qu'elles fleuriront longtemps dans le vôtre.`,
          size: 26,
        })],
      }));
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: `— ${draft.authorName}`, italics: true, size: 28 })],
      }));
      children.push(new Paragraph({ children: [new PageBreak()] }));

      // Note pour avis
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Si ce livre vous a plu…', bold: true })],
      }));
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 200 },
        children: [new TextRun({
          text: `Laisser un avis sur Amazon prend moins d'une minute et fait une immense différence pour un auteur indépendant. Votre retour aide d'autres familles à découvrir ce livre et me donne l'élan pour en écrire d'autres.`,
          size: 26,
        })],
      }));
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Merci du fond du cœur ❤️', italics: true, size: 30 })],
      }));

      const doc = new Document({
        creator: draft.authorName || 'Ebookstudio',
        title: draft.title,
        styles: {
          default: { document: { run: { font: 'Georgia', size: 28 } } },
        },
        sections: [{
          properties: {
            page: {
              size: { width: PAGE, height: PAGE, orientation: PageOrientation.PORTRAIT },
              margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
            },
          },
          children,
        }],
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${(draft.title || 'album').replace(/\s+/g, '-')}-KDP-21x21.docx`);
      toast.success('Album Word (format KDP 21×21 cm) téléchargé.');
    } catch (e: any) {
      toast.error(e.message || 'Erreur export Word');
    } finally {
      setExporting(null);
    }
  };




  if (loadingPlan) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--v3-emerald,#064e3b)]" />
      </div>
    );
  }

  const planAllowed = canUseKidsBook(plan);
  const busy = phase === 'stories' || phase === 'illustrations';

  return (
    <section className="v3-halo-soft min-h-[calc(100vh-4rem)] py-12 px-5">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => nav('/v3/create')} className="text-sm text-[var(--v3-muted)] hover:text-[var(--v3-ink)] inline-flex items-center gap-1 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour à l'écriture classique
        </button>

        <div className="text-center mb-8">
          <span className="v3-chip v3-chip-orange"><Sparkles className="w-3.5 h-3.5" /> Livre illustré maternelle</span>
          <h1 className="v3-serif text-4xl font-bold mt-4">Album jeunesse — 100% automatique</h1>
          <p className="text-sm text-[var(--v3-muted)] mt-2 max-w-xl mx-auto">
            Renseigne le titre, l'auteur, le synopsis et ton personnage.
            L'IA écrit toutes les histoires et génère les illustrations cohérentes.
          </p>
        </div>

        {!planAllowed && (
          <div className="v3-card mb-4 border-l-4 border-[#C97A14] bg-[#fff7ec]">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#C97A14] shrink-0 mt-0.5" />
              <div className="text-sm text-[var(--v3-ink)]">
                <strong>Mode aperçu.</strong> La génération d'illustrations est incluse dans les forfaits{' '}
                <strong>Studio</strong> et <strong>Éditeur</strong>.{' '}
                <Link to="/v3/forfaits" className="underline text-[#C97A14]">Voir les forfaits</Link>
              </div>
            </div>
          </div>
        )}

        {/* 1. Le livre */}
        <div className="v3-card mb-4">
          <h2 className="font-semibold mb-3">1. Ton livre</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={draft.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="Titre du livre *"
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
            />
            <input
              value={draft.subtitle || ''}
              onChange={(e) => update({ subtitle: e.target.value })}
              placeholder="Sous-titre (optionnel)"
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
            />
            <input
              value={draft.authorName}
              onChange={(e) => update({ authorName: e.target.value })}
              placeholder="Nom d'auteur (sur la couverture) *"
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
            />
            <input
              value={draft.targetAge}
              onChange={(e) => update({ targetAge: e.target.value })}
              placeholder="Âge cible (ex: 3-6 ans)"
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
            />
            <textarea
              value={draft.synopsis || ''}
              onChange={(e) => update({ synopsis: e.target.value })}
              placeholder="Synopsis / pitch du livre — le fil rouge que l'IA suivra pour toutes les histoires *"
              rows={3}
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm md:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
            />
          </div>
        </div>

        {/* 2. Bible personnage */}
        <div className="v3-card mb-4">
          <h2 className="font-semibold mb-1">2. Ton personnage</h2>
          <p className="text-xs text-[var(--v3-muted)] mb-3">
            Plus tu es précis, plus le personnage restera identique d'une illustration à l'autre.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={draft.character.name}
              onChange={(e) => updateChar({ name: e.target.value })}
              placeholder="Prénom (ex: Jules) *"
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
            />
            <input
              value={draft.character.age}
              onChange={(e) => updateChar({ age: e.target.value })}
              placeholder="Âge (ex: 4 ans)"
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
            />
            <textarea
              value={draft.character.physical}
              onChange={(e) => updateChar({ physical: e.target.value })}
              placeholder="Description physique — cheveux, yeux, morphologie *"
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm md:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
              rows={2}
            />
            <textarea
              value={draft.character.outfit}
              onChange={(e) => updateChar({ outfit: e.target.value })}
              placeholder="Tenue signature — reprise sur TOUTES les images"
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm md:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
              rows={2}
            />
            <input
              value={draft.character.personality || ''}
              onChange={(e) => updateChar({ personality: e.target.value })}
              placeholder="Personnalité (optionnel — curieux, gentil, maladroit...)"
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm md:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
            />
          </div>
        </div>

        {/* 3. Paramètres */}
        <div className="v3-card mb-4">
          <h2 className="font-semibold mb-3">3. Format du livre</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="text-sm">
              <span className="block text-xs text-[var(--v3-muted)] mb-1">Nombre d'histoires</span>
              <input
                type="number" min={1} max={30}
                value={draft.chapterCount || 10}
                onChange={(e) => update({ chapterCount: Math.max(1, Math.min(30, Number(e.target.value) || 1)) })}
                className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm"
              />
            </label>
            <label className="text-sm">
              <span className="block text-xs text-[var(--v3-muted)] mb-1">Mots par histoire</span>
              <input
                type="number" min={30} max={400} step={10}
                value={draft.wordsPerStory || 120}
                onChange={(e) => update({ wordsPerStory: Math.max(30, Math.min(400, Number(e.target.value) || 120)) })}
                className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm"
              />
            </label>
            <label className="text-sm">
              <span className="block text-xs text-[var(--v3-muted)] mb-1">Style d'illustration</span>
              <select
                value={draft.style}
                onChange={(e) => update({ style: e.target.value as IllustrationStyle })}
                className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm"
              >
                {ILLUSTRATION_STYLES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* 4. Lancer */}
        <div className="v3-card mb-4 text-center bg-gradient-to-br from-[#fff7ec] to-white">
          <h2 className="font-semibold mb-2">4. Lancer la création complète</h2>
          <p className="text-xs text-[var(--v3-muted)] mb-4">
            L'IA écrit les {draft.chapterCount || 10} histoires (~{draft.wordsPerStory || 120} mots chacune)
            puis génère leur illustration cohérente. Compte quelques minutes.
          </p>
          <Button
            onClick={generateAll}
            disabled={busy}
            size="lg"
            className="bg-gradient-to-r from-[#C97A14] to-[#a8630f] hover:opacity-90 text-white shadow-lg"
          >
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {phase === 'stories' && 'Écriture des histoires…'}
                {phase === 'illustrations' && `Illustrations ${progress.done}/${progress.total}…`}
              </>
            ) : (
              <><Wand2 className="w-4 h-4 mr-2" /> Créer tout mon livre automatiquement</>
            )}
          </Button>
          {phase === 'illustrations' && (
            <div className="mt-4 max-w-md mx-auto">
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C97A14] transition-all"
                  style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Aperçu des histoires générées */}
        {draft.stories.length > 0 && (
          <div className="v3-card mb-4">
            <h2 className="font-semibold mb-3">Aperçu ({draft.stories.length} histoires)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {draft.stories.map((s, i) => (
                <div key={s.id} className="border rounded-lg p-3 bg-white/60 flex gap-3">
                  {s.illustrationUrl ? (
                    <img src={s.illustrationUrl} alt="" className="w-20 h-20 object-cover rounded shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded bg-neutral-100 flex items-center justify-center text-[10px] text-neutral-400 shrink-0">
                      {phase === 'illustrations' ? '…' : 'En attente'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs text-[var(--v3-muted)]">Histoire {i + 1}</div>
                    <div className="font-medium text-sm truncate">{s.title}</div>
                    <div className="text-xs text-neutral-600 line-clamp-2">{s.content || s.synopsis}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cover Studio Pro Kids : 1ère + 4ème + tranche */}
        <div className="v3-card mb-4 border-2 border-[#C97A14]/30">
          <h2 className="font-semibold mb-1 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#C97A14]" /> 5. Cover Studio Pro Kids — couverture complète KDP
          </h2>
          <p className="text-xs text-[var(--v3-muted)] mb-4">
            Génère la 1ère de couverture, la 4e de couverture et calcule automatiquement la tranche selon le nombre de pages — prêt à uploader sur KDP.
          </p>

          {/* 1ère de couverture */}
          <div className="mb-5">
            <div className="text-xs font-semibold text-[#C97A14] uppercase tracking-wider mb-2">1ère de couverture</div>
            <div className="flex flex-wrap items-start gap-4">
              <Button
                onClick={generateCover}
                disabled={generatingCover || !draft.title}
                className="bg-[#C97A14] hover:opacity-90 text-white"
              >
                {generatingCover ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                {draft.coverUrl ? 'Regénérer la 1ère' : 'Créer la 1ère de couverture'}
              </Button>
              {draft.coverUrl && (
                <div className="flex flex-col items-center gap-1">
                  <img src={draft.coverUrl} alt="1ère de couverture" className="w-40 h-40 object-cover rounded border shadow-sm" />
                  <span className="text-[11px] text-green-700 inline-flex items-center gap-1">
                    <Check className="w-3 h-3" /> Intégrée à l'export
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 4e de couverture */}
          <div className="mb-5 pt-4 border-t border-black/5">
            <div className="text-xs font-semibold text-[#C97A14] uppercase tracking-wider mb-2">4e de couverture (dos)</div>
            <label className="block text-xs text-[var(--v3-muted)] mb-2">
              Résumé imprimé sur la 4e (optionnel — sinon on utilise ton synopsis)
              <textarea
                value={draft.backCoverText || ''}
                onChange={(e) => update({ backCoverText: e.target.value })}
                placeholder="Résumé accrocheur qui apparaîtra au dos du livre…"
                rows={3}
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:border-[#C97A14] focus:outline-none"
              />
            </label>
            <div className="flex flex-wrap items-start gap-4">
              <Button
                onClick={generateBackCover}
                disabled={generatingBack || !draft.title}
                variant="outline"
                className="border-[#C97A14] text-[#C97A14] hover:bg-[#C97A14]/10"
              >
                {generatingBack ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                {draft.backCoverUrl ? 'Regénérer la 4e' : 'Créer la 4e de couverture'}
              </Button>
              {draft.backCoverUrl && (
                <img src={draft.backCoverUrl} alt="4e de couverture" className="w-40 h-40 object-cover rounded border shadow-sm" />
              )}
            </div>
          </div>

          {/* Tranche */}
          <div className="pt-4 border-t border-black/5">
            <div className="text-xs font-semibold text-[#C97A14] uppercase tracking-wider mb-2">Tranche (spine) — calcul KDP auto</div>
            <div className="flex flex-wrap items-end gap-4">
              <label className="text-xs text-[var(--v3-muted)]">
                Nombre total de pages intérieures
                <input
                  type="number"
                  min={24}
                  max={828}
                  value={pageCount}
                  onChange={(e) => setPageCount(Math.max(24, Math.min(828, parseInt(e.target.value) || 24)))}
                  className="mt-1 block w-28 rounded-lg border border-black/15 px-3 py-2 text-sm"
                />
              </label>
              <div className="text-xs bg-[#C97A14]/10 border border-[#C97A14]/30 rounded-lg px-4 py-2">
                <div className="font-semibold text-[#C97A14]">Largeur de tranche calculée</div>
                <div className="text-[#232F3E] mt-1">
                  {spine.mm.toFixed(2)} mm · {spine.cm.toFixed(3)} cm · {spine.inches.toFixed(4)} po
                </div>
                <div className="text-[10px] text-[var(--v3-muted)] mt-1">
                  Formule KDP : pages × 0,0025 po (papier couleur 60#)
                </div>
              </div>
              <label className="text-xs text-[var(--v3-muted)] flex-1 min-w-[220px]">
                Texte imprimé sur la tranche (titre · auteur)
                <input
                  type="text"
                  value={draft.spineText || `${draft.title}${draft.authorName ? ` — ${draft.authorName}` : ''}`}
                  onChange={(e) => update({ spineText: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <p className="text-[11px] text-[var(--v3-muted)] mt-3">
              💡 Sur KDP, uploade la <strong>1ère de couverture</strong> et la <strong>4e de couverture</strong> séparément, puis reporte cette largeur de tranche exacte dans le générateur de couverture Amazon.
            </p>
          </div>
        </div>


        {/* Sauvegarde & Export */}

        <div className="v3-card mb-4">
          <h2 className="font-semibold mb-2">6. Sauvegarde</h2>
          <p className="text-xs text-[var(--v3-muted)] mb-3">
            Enregistre ton livre dans « Mes projets » pour le retrouver depuis n'importe quel appareil.
          </p>
          <Button
            onClick={saveToCloud}
            disabled={saving || !draft.title}
            className="bg-[var(--v3-emerald,#064e3b)] hover:opacity-90 text-white"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {projectId ? 'Mettre à jour dans mes projets' : 'Sauvegarder dans mes projets'}
          </Button>
          {projectId && (
            <span className="ml-3 text-xs text-green-700 inline-flex items-center gap-1">
              <Check className="w-3 h-3" /> Projet lié
            </span>
          )}
        </div>

        <div className="v3-card mb-8">
          <h2 className="font-semibold mb-2">7. Export album</h2>
          <p className="text-xs text-[var(--v3-muted)] mb-3">
            Format album carré 21,59 × 21,59 cm — prêt pour KDP.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={exportPdf}
              disabled={!draft.stories.length || !draft.title || exporting === 'pdf'}
              className="bg-[#C97A14] hover:opacity-90 text-white"
            >
              {exporting === 'pdf' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Printer className="w-4 h-4 mr-2" />}
              Exporter en PDF
            </Button>
            <Button
              onClick={exportDocx}
              disabled={!draft.stories.length || !draft.title || exporting === 'docx'}
              variant="outline"
            >
              {exporting === 'docx' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
              Exporter en Word (.docx)
            </Button>
            <Button
              onClick={exportHtml}
              disabled={!draft.stories.length || !draft.title}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" /> HTML
            </Button>
          </div>
          <p className="text-[11px] text-[var(--v3-muted)] mt-3">
            PDF : ouvre la boîte d'impression du navigateur → choisis <em>Enregistrer au format PDF</em>.
          </p>
        </div>

        <div className="text-center text-xs text-[var(--v3-muted)] flex items-center justify-center gap-2">
          <Check className="w-3 h-3 text-green-600" />
          Brouillon aussi sauvegardé automatiquement dans ce navigateur
        </div>

      </div>
    </section>
  );
}

function esc(s: string): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

function buildAlbumHtml(d: KidsBookDraft): string {
  const stories = d.stories.map((s, i) => `
    <section class="page image-page">
      ${s.illustrationUrl ? `<img src="${esc(s.illustrationUrl)}" alt="${esc(s.title)}" />` : `<div class="placeholder">Illustration à générer</div>`}
    </section>
    <section class="page text-page">
      <h2>${i + 1}. ${esc(s.title || 'Histoire')}</h2>
      <p>${esc(s.content || s.synopsis || '')}</p>
    </section>
  `).join('\n');

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(d.title)}</title>
<style>
  @page { size: 21.59cm 21.59cm; margin: 0; }
  body { margin: 0; font-family: 'Georgia', serif; color: #232F3E; }
  .page { width: 21.59cm; height: 21.59cm; page-break-after: always; box-sizing: border-box; display: flex; flex-direction: column; }
  .cover { background: linear-gradient(160deg,#fef3c7,#fde68a); padding: 3cm 2cm; text-align: center; justify-content: center; align-items: center; }
  .cover h1 { font-size: 48pt; margin: 0 0 0.5cm; line-height: 1.1; }
  .cover .subtitle { font-size: 22pt; font-style: italic; margin-bottom: 1cm; }
  .cover .author { font-size: 20pt; margin-top: 2cm; font-style: italic; }
  .title-page { padding: 4cm 2cm; text-align: center; justify-content: center; }
  .title-page h1 { font-size: 36pt; margin: 0; }
  .title-page .subtitle { font-size: 18pt; font-style: italic; margin-top: 0.5cm; }
  .title-page .author { font-size: 22pt; margin-top: 3cm; }
  .title-page .age { font-size: 14pt; color: #888; margin-top: 1cm; }
  .image-page { padding: 0; }
  .image-page img { width: 100%; height: 100%; object-fit: cover; }
  .image-page .placeholder { flex: 1; display: flex; align-items: center; justify-content: center; background: #f5f5f4; color: #999; font-size: 14pt; }
  .text-page { padding: 3cm 2.5cm; justify-content: center; }
  .text-page h2 { font-size: 26pt; margin: 0 0 1cm; }
  .text-page p { font-size: 16pt; line-height: 1.6; margin: 0; white-space: pre-wrap; }
  .end-page { padding: 3cm 2.5cm; justify-content: center; text-align: center; background: #fffdf7; }
  .end-page h2 { font-size: 30pt; margin: 0 0 1cm; color: #C97A14; }
  .end-page p { font-size: 15pt; line-height: 1.6; margin: 0 0 0.6cm; }
  .end-page .signature { margin-top: 1.2cm; font-style: italic; font-size: 16pt; }
  .end-page .thanks { margin-top: 1.5cm; font-size: 18pt; font-style: italic; color: #C97A14; }
  .cover-image { padding: 0 !important; background: #000 !important; display: block !important; }
  .cover-image .cover-illu { width: 21.59cm; height: 21.59cm; object-fit: cover; display: block; }
</style></head><body>
  <section class="page cover ${d.coverUrl ? 'cover-image' : ''}">
    ${d.coverUrl ? `<img class="cover-illu" src="${esc(d.coverUrl)}" alt="Couverture" />` : `
      <h1>${esc(d.title)}</h1>
      ${d.subtitle ? `<div class="subtitle">${esc(d.subtitle)}</div>` : ''}
      <div class="author">${esc(d.authorName)}</div>
    `}
  </section>
  <section class="page title-page">
    <h1>${esc(d.title)}</h1>
    ${d.subtitle ? `<div class="subtitle">${esc(d.subtitle)}</div>` : ''}
    <div class="author">${esc(d.authorName)}</div>
    <div class="age">${esc(d.targetAge)}</div>
  </section>
  </section>
  ${stories}
  <section class="page end-page">
    <h2>Remerciements</h2>
    <p>Un immense merci à toi, petit lecteur, ainsi qu'aux parents, grands-parents et enseignants qui prennent le temps de partager ces histoires. Merci à tous ceux qui, de près ou de loin, ont soufflé sur les pages de ce livre pour lui donner vie.</p>
  </section>
  <section class="page end-page">
    <h2>Le mot de l'auteur</h2>
    <p>J'ai écrit ${esc(d.title)} avec l'envie de faire grandir la curiosité, la tendresse et le sourire des plus petits. Chaque histoire est une petite graine à planter dans le cœur des enfants — j'espère qu'elles fleuriront longtemps dans le vôtre.</p>
    <p class="signature">— ${esc(d.authorName)}</p>
  </section>
  <section class="page end-page review-page">
    <h2>Si ce livre vous a plu…</h2>
    <p>Laisser un avis sur Amazon prend moins d'une minute et fait une immense différence pour un auteur indépendant. Votre retour aide d'autres familles à découvrir ce livre et me donne l'élan pour en écrire d'autres.</p>
    <p class="thanks">Merci du fond du cœur ❤️</p>
  </section>
</body></html>`;
}

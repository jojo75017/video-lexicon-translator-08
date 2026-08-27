import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen, Film, Loader2, Sparkles, FileText, Download, Image as ImageIcon,
  Wand2, Play, Mic, Video, Lock, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { CsProject, CsChapter, CsVideoLesson, Slide } from '@/types/contentStudio';
import V3AgentReturnBar from '@/components/v3public/V3AgentReturnBar';

type Tab = 'ebook' | 'video';

export default function ContentStudioProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<CsProject | null>(null);
  const [chapters, setChapters] = useState<CsChapter[]>([]);
  const [tab, setTab] = useState<Tab>('ebook');
  const [loading, setLoading] = useState(true);
  const [writingChapter, setWritingChapter] = useState<string | null>(null);
  const [generatingMeta, setGeneratingMeta] = useState(false);
  const [generatingCover, setGeneratingCover] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [videoLessons, setVideoLessons] = useState<Record<string, CsVideoLesson>>({});
  const [generatingLesson, setGeneratingLesson] = useState<string | null>(null);
  const [generatingVoice, setGeneratingVoice] = useState<string | null>(null);
  const [renderingMp4, setRenderingMp4] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!id) return;
    const [projRes, chRes] = await Promise.all([
      supabase.from('cs_projects').select('*').eq('id', id).single(),
      supabase.from('cs_chapters').select('*').eq('project_id', id).order('chapter_number', { ascending: true }),
    ]);
    if (projRes.data) {
      setProject(projRes.data as CsProject);
      if (projRes.data.cover_image_url) {
        const { data: signed } = await supabase.storage.from('contentstudio').createSignedUrl(projRes.data.cover_image_url, 3600);
        setCoverUrl(signed?.signedUrl || null);
      }
    }
    setChapters((chRes.data as CsChapter[]) || []);
    setLoading(false);
  }, [id]);

  const loadVideoLessons = useCallback(async () => {
    if (!id) return;
    const { data } = await supabase
      .from('cs_video_lessons')
      .select('*, cs_chapters!inner(project_id)')
      .eq('cs_chapters.project_id', id);
    const map: Record<string, CsVideoLesson> = {};
    for (const v of (data as any[]) || []) {
      map[v.chapter_id] = v as CsVideoLesson;
    }
    setVideoLessons(map);
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { if (tab === 'video' && project?.video_unlocked) loadVideoLessons(); }, [tab, project?.video_unlocked, loadVideoLessons]);

  const handleWriteChapter = async (ch: CsChapter) => {
    setWritingChapter(ch.id);
    const prevChapter = chapters.find((c) => c.chapter_number === ch.chapter_number - 1);
    const { data, error } = await supabase.functions.invoke('cs-write-chapter', {
      body: {
        project_id: id,
        chapter_id: ch.id,
        chapter_title: ch.title,
        chapter_number: ch.chapter_number,
        tone: project?.tone,
        language_code: project?.language_code,
        previous_context: prevChapter?.content_markdown?.slice(-1500) || undefined,
      },
    });
    if (error) {
      console.error('write chapter', error);
      alert('Erreur de génération : ' + (error.message || 'inconnue'));
    } else if (data?.content) {
      setChapters((cs) => cs.map((c) =>
        c.id === ch.id ? { ...c, content_markdown: data.content, status: 'completed' } : c
      ));
    }
    setWritingChapter(null);
  };

  const handleGenerateMeta = async () => {
    setGeneratingMeta(true);
    const { data, error } = await supabase.functions.invoke('cs-generate-kdp-meta', {
      body: {
        project_id: id,
        title: project?.title,
        subtitle: project?.subtitle,
        target_audience: project?.target_audience,
        chapters_titles: chapters.map((c) => c.title),
        language_code: project?.language_code,
      },
    });
    if (!error && data) {
      setProject((p) => p ? { ...p, kdp_description: data.kdp_description, kdp_keywords: data.kdp_keywords, kdp_categories: data.kdp_categories } : p);
    } else {
      alert('Erreur métadonnées KDP');
    }
    setGeneratingMeta(false);
  };

  const handleGenerateCover = async () => {
    setGeneratingCover(true);
    const { data, error } = await supabase.functions.invoke('cs-generate-cover', {
      body: {
        project_id: id,
        title: project?.title,
        subtitle: project?.subtitle,
        target_audience: project?.target_audience,
        tone: project?.tone,
        language_code: project?.language_code,
      },
    });
    if (!error && data?.cover_url) {
      setCoverUrl(data.cover_url);
      setProject((p) => p ? { ...p, cover_image_url: data.storage_path } : p);
    } else {
      alert('Erreur génération couverture');
    }
    setGeneratingCover(false);
  };

  const handleUnlockVideo = async () => {
    if (!confirm('Débloquer la version vidéo ? Chaque chapitre sera transformé en leçon vidéo.')) return;
    const { error } = await supabase.from('cs_projects').update({ video_unlocked: true, updated_at: new Date().toISOString() }).eq('id', id);
    if (!error) setProject((p) => p ? { ...p, video_unlocked: true } : p);
  };

  const handleGenerateLesson = async (ch: CsChapter) => {
    setGeneratingLesson(ch.id);
    const { data, error } = await supabase.functions.invoke('cs-video-lesson', {
      body: {
        chapter_id: ch.id,
        project_id: id,
        chapter_title: ch.title,
        chapter_content: ch.content_markdown || '',
        tone: project?.tone,
        language_code: project?.language_code,
      },
    });
    if (!error && data) {
      await loadVideoLessons();
    } else {
      alert('Erreur génération leçon vidéo');
    }
    setGeneratingLesson(null);
  };

  const handleGenerateVoice = async (ch: CsChapter) => {
    const lesson = videoLessons[ch.id];
    if (!lesson) return;
    setGeneratingVoice(ch.id);
    const { data, error } = await supabase.functions.invoke('cs-video-voice', {
      body: {
        chapter_id: ch.id,
        project_id: id,
        video_title: lesson.video_title,
        script_hook: lesson.script_hook,
        script_core: lesson.script_core,
        script_action: lesson.script_action,
        language_code: project?.language_code,
      },
    });
    if (!error && data) {
      await loadVideoLessons();
    } else {
      alert('Erreur voix off');
    }
    setGeneratingVoice(null);
  };

  const handleRenderMp4 = async (ch: CsChapter) => {
    const lesson = videoLessons[ch.id];
    if (!lesson?.audio_url || !lesson.slides_json) {
      alert('Générez d\'abord la leçon et la voix off.');
      return;
    }
    setRenderingMp4(ch.id);
    try {
      const mp4Blob = await renderVideoClientSide(lesson.slides_json, lesson.audio_url);
      if (!mp4Blob) throw new Error('Échec du rendu');
      const path = `${project?.user_id}/${id}/${ch.id}/video.webm`;
      const { error: upErr } = await supabase.storage.from('contentstudio').upload(path, mp4Blob, { contentType: 'video/webm', upsert: true });
      if (upErr) throw upErr;
      await supabase.from('cs_video_lessons').update({ video_mp4_url: path, updated_at: new Date().toISOString() }).eq('id', lesson.id);
      await loadVideoLessons();
    } catch (e: any) {
      alert('Rendu vidéo échoué : ' + e.message);
    }
    setRenderingMp4(null);
  };

  const handleExportEpub = () => {
    const md = chapters
      .filter((c) => c.content_markdown)
      .map((c) => `# ${c.title}\n\n${c.content_markdown}`)
      .join('\n\n---\n\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.title || 'livre'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportKdpMeta = () => {
    const meta = {
      title: project?.title,
      subtitle: project?.subtitle,
      description: project?.kdp_description,
      keywords: project?.kdp_keywords,
      categories: project?.kdp_categories,
    };
    const blob = new Blob([JSON.stringify(meta, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.title || 'livre'}-kdp-meta.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedCount = chapters.filter((c) => c.status === 'completed').length;

  if (loading) {
    return <div className="grid min-h-[60vh] place-items-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }
  if (!project) {
    return <div className="container mx-auto max-w-4xl py-12 text-center text-muted-foreground">Projet introuvable.</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 space-y-6">
      <V3AgentReturnBar />

      <header className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Link to="/v3/contentstudio" className="text-sm text-muted-foreground hover:text-foreground">← ContentStudio</Link>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{project.title}</h1>
        {project.subtitle && <p className="text-sm text-muted-foreground">{project.subtitle}</p>}
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">{completedCount}/{chapters.length} chapitres</span>
          {project.video_unlocked && <span className="rounded-full bg-primary/10 px-2 py-0.5 font-bold text-primary">Vidéo débloquée</span>}
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        <button
          onClick={() => setTab('ebook')}
          className={`inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${tab === 'ebook' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <BookOpen className="h-4 w-4" /> Ebook
        </button>
        <button
          onClick={() => setTab('video')}
          className={`inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${tab === 'video' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <Film className="h-4 w-4" /> Formation vidéo
        </button>
      </div>

      {/* EBOOK TAB */}
      {tab === 'ebook' && (
        <div className="space-y-6">
          {/* Barre d'actions ebook */}
          <div className="flex flex-wrap gap-2">
            <button onClick={handleGenerateMeta} disabled={generatingMeta} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted disabled:opacity-50">
              {generatingMeta ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />} Métadonnées KDP
            </button>
            <button onClick={handleGenerateCover} disabled={generatingCover} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted disabled:opacity-50">
              {generatingCover ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />} Couverture
            </button>
            <button onClick={handleExportEpub} disabled={completedCount === 0} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted disabled:opacity-50">
              <Download className="h-3.5 w-3.5" /> Exporter
            </button>
            <button onClick={handleExportKdpMeta} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted">
              <FileText className="h-3.5 w-3.5" /> Export KDP JSON
            </button>
          </div>

          {/* Couverture */}
          {coverUrl && (
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Couverture générée</p>
              <img src={coverUrl} alt="Couverture" className="max-h-80 rounded-md shadow-md" />
            </div>
          )}

          {/* Métadonnées KDP */}
          {project.kdp_description && (
            <div className="rounded-lg border border-border bg-card p-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Métadonnées KDP</p>
              <p className="text-sm text-foreground whitespace-pre-wrap">{project.kdp_description}</p>
              {project.kdp_keywords && (
                <div className="flex flex-wrap gap-1">
                  {project.kdp_keywords.map((k, i) => (
                    <span key={i} className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">{k}</span>
                  ))}
                </div>
              )}
              {project.kdp_categories && (
                <div className="flex flex-wrap gap-1">
                  {project.kdp_categories.map((c, i) => (
                    <span key={i} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{c}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chapitres */}
          <div className="space-y-3">
            {chapters.map((ch) => (
              <ChapterCard key={ch.id} chapter={ch} writing={writingChapter === ch.id} onWrite={() => handleWriteChapter(ch)} />
            ))}
          </div>

          {/* Upsell vidéo */}
          {!project.video_unlocked && (
            <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Film className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Transformez ce livre en formation vidéo</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Débloquez la version vidéo : chaque chapitre devient une leçon avec script, slides,
                voix off MP3, sous-titres et MP4 monté. Tout inclus, aucune clé API.
              </p>
              <button onClick={handleUnlockVideo} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
                <Sparkles className="h-4 w-4" /> Débloquer la version vidéo
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIDEO TAB */}
      {tab === 'video' && (
        <div className="space-y-4">
          {!project.video_unlocked ? (
            <div className="grid place-items-center rounded-lg border border-dashed border-border py-16 text-center">
              <Lock className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-3">Débloquez d'abord la version vidéo depuis l'onglet Ebook.</p>
              <button onClick={() => setTab('ebook')} className="text-sm font-semibold text-primary hover:underline">Aller à l'onglet Ebook</button>
            </div>
          ) : (
            chapters.map((ch) => {
              const lesson = videoLessons[ch.id];
              return (
                <VideoLessonCard
                  key={ch.id}
                  chapter={ch}
                  lesson={lesson}
                  generatingLesson={generatingLesson === ch.id}
                  generatingVoice={generatingVoice === ch.id}
                  renderingMp4={renderingMp4 === ch.id}
                  onGenerateLesson={() => handleGenerateLesson(ch)}
                  onGenerateVoice={() => handleGenerateVoice(ch)}
                  onRenderMp4={() => handleRenderMp4(ch)}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

/* ===================== Composant Chapitre ===================== */

function ChapterCard({ chapter, writing, onWrite }: { chapter: CsChapter; writing: boolean; onWrite: () => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
          {chapter.chapter_number}
        </span>
        <button onClick={() => setExpanded(!expanded)} className="flex-1 text-left">
          <h3 className="text-sm font-semibold text-foreground">{chapter.title}</h3>
          <p className="text-[11px] text-muted-foreground">
            {chapter.status === 'completed' ? `${(chapter.content_markdown || '').split(/\s+/).length} mots` : 'À rédiger'}
          </p>
        </button>
        {chapter.status === 'completed' ? (
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        ) : (
          <button onClick={onWrite} disabled={writing} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50">
            {writing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
            {writing ? 'Rédaction…' : 'Rédiger'}
          </button>
        )}
      </div>
      {expanded && chapter.content_markdown && (
        <div className="border-t border-border bg-muted/30 p-4 max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-xs text-foreground font-sans">{chapter.content_markdown}</pre>
        </div>
      )}
    </div>
  );
}

/* ===================== Composant Leçon Vidéo ===================== */

function VideoLessonCard({
  chapter, lesson, generatingLesson, generatingVoice, renderingMp4,
  onGenerateLesson, onGenerateVoice, onRenderMp4,
}: {
  chapter: CsChapter; lesson?: CsVideoLesson;
  generatingLesson: boolean; generatingVoice: boolean; renderingMp4: boolean;
  onGenerateLesson: () => void; onGenerateVoice: () => void; onRenderMp4: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
          {chapter.chapter_number}
        </span>
        <button onClick={() => setExpanded(!expanded)} className="flex-1 text-left">
          <h3 className="text-sm font-semibold text-foreground">{lesson?.video_title || chapter.title}</h3>
          <p className="text-[11px] text-muted-foreground">
            {lesson ? (lesson.audio_url ? 'Voix off ✓' : 'Script ✓') : 'Leçon non générée'}
            {lesson?.video_mp4_url ? ' · MP4 ✓' : ''}
          </p>
        </button>
        <div className="flex gap-1.5">
          <button onClick={onGenerateLesson} disabled={generatingLesson} className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground disabled:opacity-50">
            {generatingLesson ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />} Script
          </button>
          {lesson && (
            <button onClick={onGenerateVoice} disabled={generatingVoice} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-medium hover:bg-muted disabled:opacity-50">
              {generatingVoice ? <Loader2 className="h-3 w-3 animate-spin" /> : <Mic className="h-3 w-3" />} Voix
            </button>
          )}
          {lesson?.audio_url && (
            <button onClick={onRenderMp4} disabled={renderingMp4} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-medium hover:bg-muted disabled:opacity-50">
              {renderingMp4 ? <Loader2 className="h-3 w-3 animate-spin" /> : <Video className="h-3 w-3" />} MP4
            </button>
          )}
        </div>
      </div>
      {expanded && lesson && (
        <div className="border-t border-border bg-muted/30 p-4 space-y-4">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase text-muted-foreground">Accroche</p>
            <p className="text-xs text-foreground">{lesson.script_hook}</p>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase text-muted-foreground">Cœur</p>
            <p className="text-xs text-foreground whitespace-pre-wrap">{lesson.script_core}</p>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase text-muted-foreground">Passage à l'action</p>
            <p className="text-xs text-foreground">{lesson.script_action}</p>
          </div>
          {lesson.slides_json && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase text-muted-foreground">Slides ({lesson.slides_json.length})</p>
              <div className="grid gap-2">
                {lesson.slides_json.map((s, i) => (
                  <div key={i} className="rounded-md border border-border bg-background p-2.5">
                    <p className="text-xs font-semibold text-foreground">{s.slideNumber}. {s.title}</p>
                    {s.bulletPoints && (
                      <ul className="mt-1 ml-4 list-disc text-[11px] text-muted-foreground">
                        {s.bulletPoints.map((b, j) => <li key={j}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {lesson.audio_url && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase text-muted-foreground">Voix off</p>
              <AudioPlayer path={lesson.audio_url} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ===================== Lecteur audio (URL signée) ===================== */

function AudioPlayer({ path }: { path: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    supabase.storage.from('contentstudio').createSignedUrl(path, 3600).then(({ data }) => setUrl(data?.signedUrl || null));
  }, [path]);
  if (!url) return <Loader2 className="h-3 w-3 animate-spin" />;
  return <audio controls src={url} className="w-full h-8" />;
}

/* ===================== Rendu MP4 côté client (canvas + MediaRecorder) ===================== */

async function renderVideoClientSide(slides: Slide[], audioPath: string): Promise<Blob | null> {
  // Récupère l'URL signée de l'audio
  const { data } = await supabase.storage.from('contentstudio').createSignedUrl(audioPath, 3600);
  const audioUrl = data?.signedUrl;
  if (!audioUrl) return null;

  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d')!;

  const audio = new Audio(audioUrl);
  audio.crossOrigin = 'anonymous';
  await new Promise((res, rej) => { audio.addEventListener('loadedmetadata', res, { once: true }); audio.addEventListener('error', rej, { once: true }); });

  // Capture canvas + audio
  const canvasStream = canvas.captureStream(30);
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(audio);
  const dest = audioCtx.createMediaStreamDestination();
  source.connect(dest);
  source.connect(audioCtx.destination);
  canvasStream.addTrack(dest.stream.getAudioTracks()[0]);

  const recorder = new MediaRecorder(canvasStream, { mimeType: 'video/webm;codecs=vp8,opus' });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };

  return new Promise<Blob | null>((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
    recorder.onerror = () => resolve(null);

    recorder.start();
    audio.play();

    const draw = () => {
      if (audio.paused || audio.ended) {
        if (audio.ended) { recorder.stop(); return; }
        requestAnimationFrame(draw);
        return;
      }
      const elapsed = audio.currentTime;
      // Calcule la slide courante (durée égale par slide)
      const slideDuration = audio.duration / Math.max(slides.length, 1);
      const slideIndex = Math.min(Math.floor(elapsed / slideDuration), slides.length - 1);
      const slide = slides[slideIndex];

      // Fond dégradé
      const grad = ctx.createLinearGradient(0, 0, 1280, 720);
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(1, '#1E293B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1280, 720);

      // Numéro de slide
      ctx.fillStyle = '#008296';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(`${slideIndex + 1}/${slides.length}`, 40, 50);

      // Titre
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 40px sans-serif';
      wrapText(ctx, slide.title, 80, 250, 1120, 50);

      // Bullet points
      if (slide.bulletPoints) {
        ctx.font = '28px sans-serif';
        ctx.fillStyle = '#CBD5E1';
        let y = 340;
        for (const bp of slide.bulletPoints.slice(0, 6)) {
          ctx.fillText('• ' + bp, 100, y);
          y += 45;
        }
      }

      requestAnimationFrame(draw);
    };
    draw();
    audio.addEventListener('ended', () => {
      // Laisse un délai pour le dernier frame
      setTimeout(() => { if (recorder.state !== 'inactive') recorder.stop(); }, 500);
    });
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word + ' ';
      y += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, y);
}

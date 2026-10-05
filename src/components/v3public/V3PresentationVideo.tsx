import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Subtitles, CheckCircle2, ArrowRight } from 'lucide-react';
import videoAsset from '@/assets/ebookstudio-v3-video.mp4.asset.json';
import { supabase } from '@/integrations/supabase/client';

/**
 * Vidéo de présentation V3 (5 min 12, voix française, sous-titrée).
 * Placée juste au-dessus du bloc d'aide Zoom sur l'accueil.
 *
 * ÉCRIN ÉVOLUTIF : pour remplacer cette vidéo par une version plus grande
 * et plus attractive plus tard, il suffit de changer la constante VIDEO_URL
 * ci-dessous (ou la constante DUREE pour le badge). Tout le reste de la
 * carte (titre, accroche, points clés, mise en page) reste inchangé.
 */
const VIDEO_URL = videoAsset.url;
const DUREE = '5 min 12 · Voix française et sous-titres';

/** Points clés annoncés avant la lecture — contenu informatif. */
const POINTS_CLES = [
  'Le parcours complet : de l’idée au livre en vente sur Amazon',
  'Comment choisir un sujet qui trouve ses lecteurs',
  'La rédaction assistée, chapitre par chapitre, à votre rythme',
  'Couverture, mise en page et fiche Amazon générés pour vous',
];

export default function V3PresentationVideo({ userId }: { userId: string }) {
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [hasBooks, setHasBooks] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('ebook_projects')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .then(({ count }) => {
        if (!cancelled) setHasBooks((count ?? 0) > 0);
      });
    return () => { cancelled = true; };
  }, [userId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVideoFailed(true), 12_000);
    return () => window.clearTimeout(timeout);
  }, []);

  if (videoFailed) return null;

  return (
    <section id="video-v3" className={`v3-shell py-8 scroll-mt-24 ${videoReady ? '' : 'hidden'}`}>
      <div
        className="overflow-hidden rounded-3xl bg-white"
        style={{
          border: '1px solid var(--v3-joy-orange-soft)',
          boxShadow: '0 18px 40px -28px rgba(30, 41, 59, 0.35)',
        }}
      >
        <div className="grid gap-5 px-5 pt-5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-8 md:px-8 md:pt-6">
          <div>
            <p
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ color: 'var(--v3-joy-orange-600)' }}
            >
              <Play className="h-3.5 w-3.5" /> Présentation V3
            </p>
            <h2 className="v3-serif mt-2 text-2xl font-semibold md:text-3xl" style={{ color: 'var(--v3-joy-ink)' }}>
              Avant de commencer, regardez cette vidéo
            </h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--v3-joy-muted)' }}>
              Cinq minutes qui vous font gagner des heures : vous y verrez exactement
              comment EbookStudio V3 transforme une simple idée en livre publié sur Amazon —
              et où cliquer à chaque étape. Pas de théorie, uniquement ce que vous ferez
              vous-même juste après.
            </p>
          </div>

          <ul className="space-y-2 self-center">
            {POINTS_CLES.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm" style={{ color: 'var(--v3-joy-ink)' }}>
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--v3-joy-orange-600)' }} />
                <span className="leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 px-5 pb-5 md:px-8 md:pb-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold"
              style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}
            >
              <Subtitles className="h-3 w-3" /> {DUREE}
            </span>
            <span className="text-[11px]" style={{ color: 'var(--v3-joy-muted)' }}>
              Astuce : lancez la vidéo, puis gardez cette page ouverte pour suivre les étapes en direct.
            </span>
          </div>
          <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--v3-joy-orange-soft)', background: 'var(--v3-joy-ink)' }}>
            <video
              src={VIDEO_URL}
              controls
              playsInline
              preload="metadata"
              className="aspect-video w-full"
              onLoadedMetadata={() => setVideoReady(true)}
              onError={() => setVideoFailed(true)}
            >
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/v3/create"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
              style={{ background: 'var(--v3-joy-orange-600)', boxShadow: '0 10px 24px -12px rgba(234, 88, 12, 0.6)' }}
            >
              {hasBooks ? 'Créer un nouveau livre' : 'Créer mon premier livre'} <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-[11px]" style={{ color: 'var(--v3-joy-muted)' }}>
              Vous venez de voir le parcours ? Lancez-vous tout de suite, étape par étape.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

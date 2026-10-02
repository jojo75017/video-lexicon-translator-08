import { Play, Subtitles } from 'lucide-react';
import videoAsset from '@/assets/ebookstudio-v3-video.mp4.asset.json';

/**
 * Vidéo de présentation V3 (5 min 12, voix française, sous-titrée).
 * Écrin lumineux « Jovial » : carte claire à liseré orange, compacte,
 * cohérente avec le reste de l'accueil.
 */
export default function V3PresentationVideo() {
  return (
    <section id="video-v3" className="v3-shell py-8 scroll-mt-24">
      <div
        className="overflow-hidden rounded-3xl bg-white"
        style={{
          border: '1px solid var(--v3-joy-orange-soft)',
          boxShadow: '0 18px 40px -28px rgba(30, 41, 59, 0.35)',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 md:px-8 md:pt-6">
          <div>
            <p
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ color: 'var(--v3-joy-orange-600)' }}
            >
              <Play className="h-3.5 w-3.5" /> Présentation V3
            </p>
            <h2 className="v3-serif mt-2 text-2xl font-semibold md:text-3xl" style={{ color: 'var(--v3-joy-ink)' }}>
              Voilà ce que vous trouverez dans les onglets
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--v3-joy-muted)' }}>
              Suivez aussi cette vidéo : elle vous fera gagner du temps et vous montrera le parcours complet,
              du manuscrit au livre prêt pour Amazon.
            </p>
          </div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold"
            style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}
          >
            <Subtitles className="h-3 w-3" /> 5 min 12 · Voix française et sous-titres
          </span>
        </div>

        <div className="mt-4 px-5 pb-5 md:px-8 md:pb-6">
          <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--v3-joy-orange-soft)', background: 'var(--v3-joy-ink)' }}>
            <video
              src={videoAsset.url}
              controls
              playsInline
              preload="metadata"
              className="aspect-video w-full"
            >
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

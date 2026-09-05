import { Play, Subtitles } from 'lucide-react';
import videoAsset from '@/assets/v3-presentation.mp4.asset.json';

/**
 * Vidéo de présentation V3 (6 min 47, sous-titrée en français, sans voix).
 * Mise en avant sur la page d'accueil V3, dans un écrin « maison d'édition » :
 * fond éditorial profond (encre / émeraude / filets or), largeur élargie sans
 * occuper toute la largeur de la page.
 */
export default function V3PresentationVideo() {
  return (
    <section
      id="video-v3"
      className="relative w-full overflow-hidden"
      style={{ background: 'var(--v3-paper)', borderBottom: '1px solid var(--v3-line)' }}
    >
      {/* Filets or latéraux — ancre éditoriale */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-px"
        style={{ background: 'linear-gradient(180deg, transparent, var(--v3-gold), transparent)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-px"
        style={{ background: 'linear-gradient(180deg, transparent, var(--v3-gold), transparent)' }}
      />
      {/* Voile doré en haut */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{ background: 'linear-gradient(180deg, var(--v3-gold-soft), transparent)' }}
      />

      <div className="relative max-w-6xl mx-auto px-5 md:px-10 py-10 md:py-14">
        <div
          className="relative rounded-md p-2 md:p-3"
          style={{
            background: 'var(--v3-ivory)',
            border: '1px solid var(--v3-gold)',
            boxShadow: '0 22px 50px -34px var(--v3-editorial-ink)',
          }}
        >
          <div className="rounded-sm px-4 py-4 md:px-7" style={{ border: '1px solid color-mix(in srgb, var(--v3-gold) 50%, transparent)' }}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--v3-line)' }}>
            <div>
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--v3-gold-600)' }}>
                <Play className="h-3.5 w-3.5" /> Collection EbookStudio · Présentation V3
              </p>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold v3-serif" style={{ color: 'var(--v3-editorial-ink)' }}>
                Découvrez EbookStudio V3 en 7 minutes
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
                Le parcours complet : du sommaire construit avec l'IA au fichier prêt pour Amazon.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 border-l pl-4 text-[11px] font-semibold" style={{ color: 'var(--v3-editorial-ink-soft)', borderColor: 'var(--v3-gold)' }}>
              <Subtitles className="h-3 w-3" /> 7 minutes · Sous-titrée en français
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-sm" style={{ background: 'var(--v3-editorial-ink)' }}>
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
      </div>
    </section>
  );
}

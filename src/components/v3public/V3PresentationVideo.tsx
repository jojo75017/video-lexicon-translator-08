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
      style={{
        background:
          'radial-gradient(120% 140% at 12% 0%, #14201c 0%, #0c1714 45%, #070d0b 100%)',
      }}
    >
      {/* Filets or latéraux — ancre éditoriale */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-px"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(200,153,47,0.55), transparent)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-px"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(200,153,47,0.55), transparent)' }}
      />
      {/* Voile doré en haut */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{ background: 'linear-gradient(180deg, rgba(200,153,47,0.10), transparent)' }}
      />

      <div className="relative max-w-5xl mx-auto px-5 md:px-10 py-10 md:py-14">
        <div
          className="rounded-[24px] p-5 md:p-8 text-white"
          style={{
            background:
              'linear-gradient(150deg, rgba(11,110,85,0.32) 0%, rgba(7,13,11,0.55) 60%, rgba(7,13,11,0.75) 100%)',
            border: '1px solid rgba(200,153,47,0.30)',
            boxShadow: '0 24px 60px -28px rgba(0,0,0,0.65)',
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#e7cf8c]">
                <Play className="h-3.5 w-3.5" /> La vidéo de présentation
              </p>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold v3-serif">
                Découvrez EbookStudio V3 en 7 minutes
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/85">
                Le parcours complet : du sommaire construit avec l'IA au fichier prêt pour Amazon.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#e7cf8c]">
              <Subtitles className="h-3 w-3" /> Sous-titrée en français
            </span>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg bg-black/40">
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

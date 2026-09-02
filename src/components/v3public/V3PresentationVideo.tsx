import { Play, Subtitles } from 'lucide-react';
import videoAsset from '@/assets/v3-presentation.mp4.asset.json';

/**
 * Vidéo de présentation V3 (6 min 47, sous-titrée en français, sans voix).
 * Mise en avant sur la page d'accueil V3, juste sous le hero.
 */
export default function V3PresentationVideo() {
  return (
    <section id="video-v3" className="max-w-3xl mx-auto px-5 md:px-8 py-6">
      <div className="rounded-2xl border border-[#c9a84c]/35 bg-[#064e3b] p-5 md:p-7 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#e7cf8c]">
              <Play className="h-3.5 w-3.5" /> La vidéo de présentation
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold">
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

        <div className="mt-3 overflow-hidden rounded-lg bg-black/40">
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
    </section>
  );
}

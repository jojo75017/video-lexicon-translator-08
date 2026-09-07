import { Play, Subtitles } from 'lucide-react';
import videoAsset from '@/assets/ebookstudio-v3-video.mp4.asset.json';

/**
 * Vidéo V3 complète (5 min 12, voix française, sous-titrée), affichée aux abonnés.
 */
export default function V3WelcomeVideo() {
  return (
    <section
      className="relative overflow-hidden rounded-md border p-2 md:p-3"
      style={{
        background: 'var(--v3-ivory, #fffdf8)',
        borderColor: 'var(--v3-gold, #c9a84c)',
        boxShadow: '0 22px 50px -34px var(--v3-editorial-ink, #0f2e1f)',
      }}
    >
      <div className="rounded-sm border px-4 py-4 md:px-7" style={{ borderColor: 'color-mix(in srgb, var(--v3-gold, #c9a84c) 50%, transparent)' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--v3-line, rgba(0,0,0,0.1))' }}>
        <div>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--v3-gold-600, #a8862f)' }}>
            <Play className="h-3.5 w-3.5" /> Bienvenue chez EbookStudio
          </p>
          <h2 className="mt-1.5 text-xl md:text-2xl font-bold" style={{ color: 'var(--v3-editorial-ink, #0f2e1f)' }}>
            EbookStudio V3 : du manuscrit au livre publiable
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Le sommaire, l'écriture chapitre par chapitre, la correction, la couverture et l'export
            pour Amazon. Vos cadeaux sont déjà dans votre espace.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
          <Subtitles className="h-3 w-3" /> 5 min 12 · Voix française et sous-titres
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-sm" style={{ background: 'var(--v3-editorial-ink, #0f2e1f)' }}>
        <video src={videoAsset.url} controls playsInline preload="metadata" className="aspect-video w-full">
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
      </div>
      </div>
    </section>
  );
}

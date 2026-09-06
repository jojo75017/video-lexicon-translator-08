import { Play, Subtitles } from 'lucide-react';
import videoAsset from '@/assets/v3-bienvenue.mp4.asset.json';

/**
 * Vidéo « Bienvenue » (2 min 21, voix française, musique douce, sous-titrée),
 * affichée aux abonnés après achat : aucune vente, aucun prix — uniquement
 * l'accueil et la prise en main du studio.
 */
export default function V3WelcomeVideo() {
  return (
    <section
      className="rounded-lg border p-3 md:p-4"
      style={{
        background: 'var(--v3-ivory, #fffdf8)',
        borderColor: 'var(--v3-gold, #c9a84c)',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3" style={{ borderColor: 'var(--v3-line, rgba(0,0,0,0.1))' }}>
        <div>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--v3-gold-600, #a8862f)' }}>
            <Play className="h-3.5 w-3.5" /> Bienvenue chez EbookStudio
          </p>
          <h2 className="mt-1.5 text-xl md:text-2xl font-bold" style={{ color: 'var(--v3-editorial-ink, #0f2e1f)' }}>
            Par où commencer — 2 minutes
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Le sommaire, l'écriture chapitre par chapitre, la correction, la couverture et l'export
            pour Amazon. Vos cadeaux sont déjà dans votre espace.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
          <Subtitles className="h-3 w-3" /> Voix française et sous-titres
        </span>
      </div>

      <div className="mt-3 overflow-hidden rounded-md" style={{ background: 'var(--v3-editorial-ink, #0f2e1f)' }}>
        <video src={videoAsset.url} controls playsInline preload="metadata" className="aspect-video w-full">
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
      </div>
    </section>
  );
}

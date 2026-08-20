import { Play, Clock, Lock } from 'lucide-react';
import useLaunchSettings from '@/hooks/useLaunchSettings';

interface V3VideoPlayerProps {
  className?: string;
  /** Titre affiché au-dessus du lecteur. */
  title?: string;
  /** Sous-titre / promesse. */
  subtitle?: string;
  /** Affiche le bloc même sans vidéo (vignette d'attente). */
  showPlaceholder?: boolean;
}

/** Transforme un lien YouTube / Vimeo en URL d'intégration. */
function toEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

/**
 * Vidéo de présentation V3 (7-8 minutes). L'URL est stockée dans
 * `launch_settings.v3_video`, donc modifiable depuis l'administration
 * sans republier le site. Réservée aux abonnés (espace V3).
 */
export default function V3VideoPlayer({
  className = '',
  title = 'La vidéo V3 — 7 minutes',
  subtitle = "Le parcours complet : du sommaire construit avec l'IA au fichier prêt pour Amazon.",
  showPlaceholder = true,
}: V3VideoPlayerProps) {
  const { settings, loading } = useLaunchSettings();
  const url = String(settings.v3_video?.url || '').trim();
  const embed = url ? toEmbedUrl(url) : null;
  const isFile = /\.(mp4|webm|mov)$/i.test(url);

  if (loading) return null;
  if (!url && !showPlaceholder) return null;

  return (
    <section className={`rounded-2xl border border-[#c9a84c]/35 bg-[#064e3b] p-5 text-white ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#e7cf8c]">
            <Play className="h-3.5 w-3.5" /> {title}
          </p>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/85">{subtitle}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#e7cf8c]">
          <Lock className="h-3 w-3" /> Réservée aux abonnés
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl bg-black/40">
        {embed ? (
          <iframe
            src={embed}
            title="Vidéo de présentation Ebookstudio V3"
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : isFile ? (
          <video controls preload="metadata" className="aspect-video w-full" src={url} />
        ) : url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex aspect-video w-full items-center justify-center gap-2 text-sm font-semibold text-[#e7cf8c] hover:underline"
          >
            <Play className="h-5 w-5 fill-current" /> Regarder la vidéo
          </a>
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 px-6 text-center">
            <Clock className="h-7 w-7 text-[#e7cf8c]" />
            <p className="text-sm font-semibold text-white">Vidéo en préparation</p>
            <p className="max-w-md text-xs leading-relaxed text-white/70">
              La présentation complète de la V3 (7 à 8 minutes) arrive pour le lancement de septembre.
              Elle s'affichera ici automatiquement.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

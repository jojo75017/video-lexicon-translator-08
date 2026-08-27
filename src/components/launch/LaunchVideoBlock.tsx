import { Play, Headphones, Download } from 'lucide-react';
import useLaunchSettings from '@/hooks/useLaunchSettings';

interface LaunchVideoBlockProps {
  className?: string;
}

/** Bloc média de lancement. Affiche une vidéo (lien externe) ou un lecteur audio (mp3). */
export default function LaunchVideoBlock({ className = '' }: LaunchVideoBlockProps) {
  const { settings, loading } = useLaunchSettings();
  const url = String(settings.launch_video?.url || '').trim();
  const kind = settings.launch_video?.kind || (url.endsWith('.mp3') ? 'audio' : 'video');

  if (loading || !url) return null;

  if (kind === 'audio' || url.endsWith('.mp3')) {
    return (
      <div className={`rounded-2xl border border-[#D4AF37]/30 bg-[#0F2E1F] p-5 text-white ${className}`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
              <Headphones className="h-3.5 w-3.5" /> Message audio — 2 minutes
            </p>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-white/90">
              Écoutez le message complet : pourquoi EbookStudio change la publication sur Amazon,
              et comment prendre l'accès à vie à 47 € avant le 30 septembre.
            </p>
          </div>
          <a
            href="/message"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-[#2A2118] transition hover:brightness-110"
          >
            <Play className="h-4 w-4 fill-current" /> Écouter le message
          </a>
        </div>
        <audio controls className="mt-4 w-full" preload="metadata" src={url}>
          Votre navigateur ne supporte pas la lecture audio.
        </audio>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#D4AF37] underline-offset-2 hover:underline"
        >
          <Download className="h-3.5 w-3.5" /> Si la lecture ne démarre pas : télécharger le MP3
        </a>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-[#D4AF37]/30 bg-[#0F2E1F] p-5 text-white ${className}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
            <Play className="h-3.5 w-3.5" /> La vidéo — 2 minutes
          </p>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-white/90">
            Je vous montre un livre complet, du sommaire au fichier prêt pour Amazon.
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-[#2A2118] transition hover:brightness-110"
        >
          <Play className="h-4 w-4 fill-current" /> Regarder la vidéo
        </a>
      </div>
    </div>
  );
}

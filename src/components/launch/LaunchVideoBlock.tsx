import { PlayCircle } from 'lucide-react';
import useLaunchSettings from '@/hooks/useLaunchSettings';

/**
 * Bloc vidéo de lancement. Le lien est réglé dans /admin/lancement
 * (clé `launch_video`) : si aucun lien n'est enregistré, rien ne s'affiche.
 */
export default function LaunchVideoBlock({ className = '' }: { className?: string }) {
  const { settings } = useLaunchSettings();
  const url = String(settings.launch_video?.url || '').trim();
  if (!url || settings.launch_video?.enabled === false) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-wrap items-center gap-3 rounded-2xl px-5 py-4 no-underline ${className}`}
      style={{ background: 'linear-gradient(120deg,#064e3b,#0b3b2f)', border: '1px solid #C9A84C' }}
    >
      <PlayCircle className="h-8 w-8 shrink-0" style={{ color: '#C9A84C' }} />
      <span className="min-w-[200px] flex-1">
        <span className="block text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: '#C9A84C' }}>
          La vidéo — 2 minutes
        </span>
        <span className="block text-[15px] font-semibold text-white">
          Un livre complet, du sommaire au fichier prêt pour Amazon
        </span>
      </span>
      <span
        className="rounded-lg px-4 py-2 text-[13px] font-bold"
        style={{ background: '#C9A84C', color: '#0b2b22' }}
      >
        Regarder
      </span>
    </a>
  );
}

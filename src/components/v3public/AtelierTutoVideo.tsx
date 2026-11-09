import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PlayCircle, X } from 'lucide-react';
import { videoPourAtelier } from '@/data/videosSerieV3';

/** Bouton discret « Voir le tutoriel vidéo » affiché en haut de l'atelier correspondant. */
export default function AtelierTutoVideo() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const v = videoPourAtelier(pathname);
  if (!v) return null;
  return (
    <div className="mx-auto max-w-6xl px-4 pt-3">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}
        className="v3-chip-toggle inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold"
        style={{ borderColor: '#008296', color: '#5FD3E0', background: 'rgba(0,130,150,0.12)' }}>
        {open ? <X className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
        {open ? 'Fermer la vidéo' : `Voir le tutoriel vidéo (${v.duree}) · ${v.num}/12 ${v.titre}`}
      </button>
      {open && (
        <div className="mt-3 max-w-2xl overflow-hidden rounded-xl border" style={{ borderColor: 'rgba(0,130,150,0.4)' }}>
          <video key={v.src} src={v.src} controls autoPlay playsInline preload="metadata"
            className="aspect-video w-full bg-black" aria-label={`Tutoriel vidéo : ${v.titre}`} />
        </div>
      )}
    </div>
  );
}

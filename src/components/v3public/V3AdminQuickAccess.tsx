import { useEffect, useState } from 'react';
import { BookOpen, Eye, EyeOff, Mail, Shield, ShieldCheck, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import useIsAdmin from '@/hooks/useIsAdmin';
import { ADMIN_HOME_PATH } from '@/config/adminRoutes';
import {
  ADMIN_PREVIEW_AS_SUBSCRIBER_KEY,
  isPreviewingAsSubscriber,
} from '@/components/v3/V3ContemplationMode';

const ACCESS_LINKS = [
  { label: 'V2 — Générateur', path: '/ebook-planner', icon: BookOpen },
  { label: 'Prospects', path: '/gestion-prospects', icon: Users },
  { label: 'Emails', path: '/apercu-emails', icon: Mail },
  { label: 'Admin', path: ADMIN_HOME_PATH, icon: Shield },
];

/**
 * Barre d'accès rapide réservée à l'admin : bascule V2 / V3, outils internes,
 * et interrupteur « Voir comme un abonné » pour tester le parcours verrouillé.
 */
export default function V3AdminQuickAccess() {
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();
  const [preview, setPreview] = useState(isPreviewingAsSubscriber);

  useEffect(() => {
    const sync = () => setPreview(isPreviewingAsSubscriber());
    window.addEventListener('v3-admin-preview-change', sync);
    return () => window.removeEventListener('v3-admin-preview-change', sync);
  }, []);

  if (isAdmin !== true) return null;

  const togglePreview = () => {
    const next = !preview;
    try {
      if (next) localStorage.setItem(ADMIN_PREVIEW_AS_SUBSCRIBER_KEY, '1');
      else localStorage.removeItem(ADMIN_PREVIEW_AS_SUBSCRIBER_KEY);
    } catch {
      toast.error('Stockage du navigateur indisponible.');
      return;
    }
    setPreview(next);
    window.dispatchEvent(new Event('v3-admin-preview-change'));
    toast.info(next
      ? 'Aperçu abonné activé : la V3 se comporte comme avant l’ouverture.'
      : 'Mode admin rétabli : tous les modules V3 sont ouverts pour vos tests.');
  };

  return (
    <aside
      data-contemplation-allow="true"
      className="sticky top-[7.5rem] z-20 border-b border-border bg-card/95 px-3 py-2 shadow-sm backdrop-blur"
      aria-label="Accès rapides administrateur"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 overflow-x-auto">
        <span
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-semibold"
          style={{ borderColor: 'rgba(212,175,55,0.5)', background: 'rgba(15,46,31,0.92)', color: '#D4AF37' }}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          {preview ? 'Aperçu abonné (admin)' : 'Mode admin — test complet V3'}
        </span>

        {ACCESS_LINKS.map(({ label, path, icon: Icon }) => (
          <Button
            key={path}
            type="button"
            size="sm"
            variant={path === '/ebook-planner' ? 'default' : 'outline'}
            className="shrink-0"
            onClick={() => navigate(path)}
          >
            <Icon className="mr-1.5 h-4 w-4" />
            {label}
          </Button>
        ))}

        <Button type="button" size="sm" variant="ghost" className="shrink-0" onClick={togglePreview}>
          {preview ? <EyeOff className="mr-1.5 h-4 w-4" /> : <Eye className="mr-1.5 h-4 w-4" />}
          {preview ? 'Revenir en mode admin' : 'Voir comme un abonné'}
        </Button>
      </div>
    </aside>
  );
}

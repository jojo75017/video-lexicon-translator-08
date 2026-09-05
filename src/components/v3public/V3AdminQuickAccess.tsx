import { useEffect, useState } from 'react';
import { BookOpen, Eye, EyeOff, Mail, Palette, Shield, ShieldCheck, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ADMIN_HOME_PATH } from '@/config/adminRoutes';
import {
  isPreviewingAsSubscriber,
  setPreviewingAsSubscriber,
} from '@/components/v3/V3ContemplationMode';

const ACCESS_LINKS = [
  { label: 'V2 — Générateur', path: '/ebook-planner', icon: BookOpen },
  { label: 'Prospects', path: '/gestion-prospects', icon: Users },
  { label: 'Emails', path: '/apercu-emails', icon: Mail },
  { label: 'Tester BD', path: '/admin/tester-bd', icon: Palette },
  { label: 'Admin', path: ADMIN_HOME_PATH, icon: Shield },
];

/**
 * Barre d'accès rapide réservée à l'admin : bascule V2 / V3, outils internes,
 * et interrupteur « Voir comme un abonné » pour tester le parcours verrouillé.
 */
type V3AdminQuickAccessProps = {
  isAdmin: boolean;
  isAdminChecking: boolean;
};

export default function V3AdminQuickAccess({ isAdmin, isAdminChecking }: V3AdminQuickAccessProps) {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(isPreviewingAsSubscriber);

  useEffect(() => {
    const sync = () => setPreview(isPreviewingAsSubscriber());
    window.addEventListener('v3-admin-preview-change', sync);
    return () => window.removeEventListener('v3-admin-preview-change', sync);
  }, []);

  if (!isAdmin) return null;

  const togglePreview = () => {
    const next = !preview;
    setPreviewingAsSubscriber(next);
    setPreview(next);
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
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-bold"
          style={{ borderColor: '#D4AF37', background: '#0B2A1C', color: '#FFF3D0' }}
        >
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: '#D4AF37' }} />
          {preview ? 'Aperçu abonné (admin)' : 'Mode admin — test complet V3'}
        </span>

        {!preview && ACCESS_LINKS.map(({ label, path, icon: Icon }) => (
          <Button
            key={path}
            type="button"
            size="sm"
            variant={path === '/ebook-planner' ? 'default' : 'outline'}
            className="shrink-0"
            onClick={() => navigate(path)}
          >
            <Icon className="mr-1.5 h-4 w-4" />
            {label === 'Admin' ? 'Dashboard admin' : label}
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

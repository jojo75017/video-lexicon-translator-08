import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CoverStudioPro from '@/components/admin/CoverStudioPro';
import '@/styles/v3-public.css';

/** Studio V4 des abonnés (maison d'édition de couvertures), hors ancien Hub et hors offre payante. */
export default function V3StudioV4Page() {
  return (
    <main className="v3-theme-scope mx-auto w-full max-w-6xl space-y-4 px-4 py-8">
      <Link to="/v3/mes-couvertures" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Mes couvertures
      </Link>
      <CoverStudioPro />
    </main>
  );
}

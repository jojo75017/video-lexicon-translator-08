import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, PenLine, Compass, Lightbulb, Feather, Palette, LayoutTemplate, LayoutGrid,
  BookOpen, BookMarked, Image as ImageIcon, AudioLines, Tags, Gift, Target, Sparkles, Info,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useV3Entitlement } from '@/hooks/useV3Entitlement';
import { V3_AGENTS } from '@/data/v3Agents';
import AgentPortrait from './AgentPortrait';
import V3HomeTopBlock from './V3HomeTopBlock';

const STEPS = [
  { n: 1, title: 'Idée et niche', icon: Lightbulb, to: '/v3/kdp/radar-niches' },
  { n: 2, title: 'Écriture', icon: Feather, to: '/v3/create' },
  { n: 3, title: 'Couverture', icon: Palette, to: '/v3/mes-couvertures' },
  { n: 4, title: 'Mise en page Kindle et broché', icon: LayoutTemplate, to: '/v3/outils/editeur' },
  { n: 5, title: 'Voir tous les outils', icon: LayoutGrid, to: '/v3/outils' },
];

const PILLS = [
  { label: 'Kindle', icon: BookOpen, to: '/v3/outils/editeur' },
  { label: 'Livre broché', icon: BookMarked, to: '/v3/outils/editeur' },
  { label: 'Couverture', icon: ImageIcon, to: '/v3/mes-couvertures' },
  { label: 'Livre audio', icon: AudioLines, to: '/v3/outils/audiobook' },
  { label: 'Métadonnées', icon: Tags, to: '/v3/kdp/fiche-audit' },
];

const SHORTCUTS = [
  { label: 'Kit de démarrage', icon: Gift, to: '/v3/kit-demarrage' },
  { label: '10 niches rentables', icon: Target, to: '/10-niches-offertes' },
  { label: 'Nouveautés', icon: Sparkles, to: '/v3/nouveautes' },
];

type Book = { id: string; title: string | null; updated_at: string };

const card = 'rounded-3xl bg-white p-5 md:p-6';
const cardStyle = { border: '2px solid var(--v3-joy-orange-soft)' };

export default function V3SubscriberHome({ user }: { user: any }) {
  const { hasBase, hasFull, isAdmin } = useV3Entitlement() as any;
  const [books, setBooks] = useState<Book[] | null>(null);

  const meta = user?.user_metadata ?? {};
  const fullName: string = meta.first_name || meta.full_name || meta.name || '';
  const prenom = fullName.trim().split(/\s+/)[0] || (user?.email ?? '').split('@')[0];
  const niveau = isAdmin ? 'Administrateur' : hasFull ? 'Édition' : hasBase ? 'Plume' : 'Abonné';

  useEffect(() => {
    if (window.location.hash !== '#nouveau-livre') return;
    const t = setTimeout(() => document.getElementById('nouveau-livre')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    let cancelled = false;
    supabase
      .from('ebook_projects')
      .select('id,title,updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(3)
      .then(({ data }) => { if (!cancelled) setBooks((data as Book[]) ?? []); });
    return () => { cancelled = true; };
  }, [user.id]);

  return (
    <section style={{ background: '#2A2624', borderBottom: '1px solid rgba(246,189,42,0.18)' }}>
      <div className="v3-shell space-y-8 py-8 md:py-12">
        {/* a) Bienvenue */}
        <div className="text-center">
          <span
            className="inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}
          >
            Niveau {niveau}
          </span>
          <h1 className="v3-serif mt-3 text-2xl font-semibold md:text-4xl" style={{ color: '#F3EDE6' }}>
            Bienvenue dans votre maison d'édition IA{prenom ? `, ${prenom}` : ''}
          </h1>
        </div>

        <V3HomeTopBlock userId={user.id} />

      </div>
    </section>
  );
}

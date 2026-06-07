import React from 'react';
import {
  Sparkles, FileText, FileType2, BookOpen, Link2, Newspaper,
  Video, Youtube, FileEdit, Crown, Star,
} from 'lucide-react';

const GOLD = '#c9a84c';
const GOLD_LIGHT = '#f0d78c';

type Source = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: 'pro' | 'star';
};

// Toutes les sources de création — chaque carte ouvre le STUDIO V3 (reste en V3).
const SOURCES: Source[] = [
  { id: 'scratch', title: 'Partir de zéro', description: 'Créez votre livre à partir d’une page blanche, guidé par l’IA.', icon: FileEdit },
  { id: 'template', title: 'Commencer à partir d’un modèle', description: 'Choisissez un modèle professionnel prêt à l’emploi.', icon: BookOpen },
  { id: 'url', title: 'Importer depuis un article ou une URL', description: 'Transformez un article de blog ou une page web en livre.', icon: Link2 },
  { id: 'docx', title: 'Importer depuis un fichier DOCX', description: 'Convertissez un document Word en livre numérique propre.', icon: FileText },
  { id: 'pdf', title: 'Importer depuis un PDF', description: 'Transformez un PDF existant en ebook éditable.', icon: FileType2, badge: 'star' },
  { id: 'gdocs', title: 'Importer depuis Google Docs', description: 'Importez directement un document Google Docs.', icon: Newspaper },
  { id: 'video', title: 'Importer depuis une vidéo', description: 'Convertissez une vidéo en livre via la transcription IA.', icon: Video, badge: 'pro' },
  { id: 'youtube', title: 'Importer depuis YouTube', description: 'Transformez une vidéo YouTube en livre numérique.', icon: Youtube, badge: 'pro' },
];

function SourceCard({ source, onSelect }: { source: Source; onSelect: (id: string) => void }) {
  const Icon = source.icon;
  return (
    <button
      onClick={() => onSelect(source.id)}
      className="group relative text-left rounded-2xl p-5 border bg-[#161616] border-[#c9a84c22] transition-all duration-300 overflow-hidden hover:border-[#c9a84c] hover:shadow-[0_0_30px_-6px_rgba(201,168,76,0.45)] hover:-translate-y-1"
    >
      <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(160px 100px at 50% 0%, ${GOLD}22, transparent 70%)` }} />

      {source.badge && (
        <span className="absolute top-3 right-3 inline-flex items-center justify-center rounded-md p-1"
          style={{ background: `${GOLD}1f`, color: GOLD_LIGHT }}>
          {source.badge === 'pro' ? <Crown className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5" />}
        </span>
      )}

      <div className="relative">
        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ background: `${GOLD}1a`, color: GOLD_LIGHT }}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-sm font-semibold leading-tight mb-1"
          style={{ background: `linear-gradient(90deg, ${GOLD_LIGHT}, #ffffff)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          {source.title}
        </div>
        <p className="text-[11px] text-white/55 leading-snug">{source.description}</p>
      </div>
    </button>
  );
}

/**
 * Onglet spécial V3 — hub de création « Créer un livre numérique ».
 * Chaque source ouvre le STUDIO V3 (BookCreationStudio) SANS quitter le Hub V3.
 */
const CreateBookHub: React.FC<{ onSelectSource: (sourceId: string) => void }> = ({ onSelectSource }) => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-5 w-5" style={{ color: GOLD }} />
        <h2 className="text-lg font-bold" style={{ color: GOLD_LIGHT }}>Créer un livre numérique</h2>
      </div>
      <p className="text-sm text-white/50 mb-6 max-w-2xl">
        Choisissez votre point de départ. Importez depuis n’importe quelle source ou partez d’une page blanche —
        l’IA s’occupe de la mise en forme et de la structure, directement dans le Studio V3.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SOURCES.map((s) => (
          <SourceCard key={s.id} source={s} onSelect={onSelectSource} />
        ))}
      </div>
    </section>
  );
};

export default CreateBookHub;

import { BookOpen, ExternalLink } from 'lucide-react';
import { BLOG_URL } from '@/data/externalLinks';

type Variant = 'header' | 'headerDark' | 'sidebar' | 'footer' | 'hero' | 'inline';

/**
 * Lien réutilisable vers le blog externe ebookstudio.blog.
 * Ouvre toujours dans un nouvel onglet.
 */
export default function BlogExternalLink({
  variant = 'inline',
  showBadge = true,
  label = 'Blog',
  className,
  onClick,
}: {
  variant?: Variant;
  showBadge?: boolean;
  label?: string;
  className?: string;
  onClick?: () => void;
}) {
  const base =
    'inline-flex items-center gap-2 font-semibold transition-colors whitespace-nowrap';

  const styles: Record<Variant, string> = {
    header:
      'px-3 py-1.5 rounded-full text-[13px] text-[#064e3b] bg-[rgba(201,168,76,0.15)] hover:bg-[rgba(201,168,76,0.28)] border border-[rgba(201,168,76,0.45)]',
    headerDark:
      'px-3 py-1.5 rounded-full text-[13px] text-white bg-[rgba(201,168,76,0.18)] hover:bg-[rgba(201,168,76,0.32)] border border-[rgba(201,168,76,0.55)]',
    sidebar:
      'w-full rounded-md px-2.5 py-2 text-[13px] text-[#064e3b] hover:bg-[rgba(201,168,76,0.14)]',
    footer:
      'text-sm text-white/80 hover:text-white',
    hero:
      'px-6 py-3 rounded-full text-[15px] text-[#1a1408] bg-[var(--v3-gold)] hover:brightness-110 shadow-[0_10px_30px_-10px_rgba(201,168,76,0.7)]',
    inline:
      'text-[13px] text-[color:var(--v3-emerald)] hover:underline',
  };

  return (
    <a
      href={BLOG_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className ?? ''}`}
      title="Ouvrir le blog EbookStudio dans un nouvel onglet"
    >
      <BookOpen className="w-4 h-4" />
      <span>{label}</span>
      {showBadge && (
        <span
          className="text-[9px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
          style={{ background: '#C97A14', color: '#fff' }}
        >
          Nouveau
        </span>
      )}
      <ExternalLink className="w-3 h-3 opacity-60" />
    </a>
  );
}

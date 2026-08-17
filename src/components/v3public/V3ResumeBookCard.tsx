import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, History, MessageSquare, ListOrdered } from 'lucide-react';
import { readBookBrief, type BookBrief } from '@/lib/v3/bookBrief';
import { loadOutlineVersions, loadRemoteThread } from '@/lib/v3/genieThread';

/**
 * « Reprendre mon livre » — un livre peut demander des semaines de travail.
 * Cette carte rappelle où l'auteur s'est arrêté (fiche, sommaire, conversation)
 * et le ramène exactement à cette étape.
 */
export default function V3ResumeBookCard({ compact = false }: { compact?: boolean }) {
  const [brief, setBrief] = useState<BookBrief | null>(null);
  const [messages, setMessages] = useState(0);
  const [versions, setVersions] = useState(0);
  const [lastAt, setLastAt] = useState<string>('');

  useEffect(() => {
    const stored = readBookBrief();
    setBrief(stored);
    if (!stored) return;
    setLastAt(stored.savedAt || '');
    void loadRemoteThread(stored.projectId || null).then((thread) => {
      setMessages(thread.length);
      const last = thread[thread.length - 1]?.createdAt;
      if (last) setLastAt((prev) => (!prev || new Date(last) > new Date(prev) ? last : prev));
    });
    void loadOutlineVersions(stored.projectId || null).then((list) => setVersions(list.length));
  }, []);

  const step = useMemo(() => {
    if (!brief) return '';
    if (brief.outlineValidated) return '3. Rédaction des chapitres';
    if ((brief.outline || []).length) return '2. Sommaire à valider';
    return '1. Fiche du livre';
  }, [brief]);

  if (!brief || !(brief.title || '').trim()) return null;

  return (
    <div
      className="rounded-[22px] border p-4 md:p-5"
      style={{ borderColor: 'var(--v3-gold, #c9a84c)', background: 'linear-gradient(180deg, rgba(6,78,59,0.06), rgba(201,168,76,0.05))' }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{ background: 'var(--v3-emerald, #064e3b)', color: '#fff' }}>
            <History className="h-3 w-3" /> Reprendre mon livre
          </span>
          <div className="v3-serif mt-2 truncate text-xl font-bold" style={{ color: 'var(--v3-ink)' }}>{brief.title}</div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]" style={{ color: 'var(--v3-muted)' }}>
            <span>Étape en cours : <strong>{step}</strong></span>
            <span className="inline-flex items-center gap-1"><ListOrdered className="h-3 w-3" /> {(brief.outline || []).length} chapitres au sommaire</span>
            {messages > 0 && <span className="inline-flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {messages} messages conservés</span>}
            {versions > 0 && <span>{versions} version(s) de sommaire</span>}
            {lastAt && <span>Dernière activité : {new Date(lastAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/v3/create" className="v3-btn v3-btn-primary text-xs">
            <BookOpen className="h-3.5 w-3.5" /> Reprendre où je m’étais arrêté <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          {!compact && (
            <Link to="/v3/mes-livres" className="v3-btn v3-btn-ghost text-xs">Mes livres</Link>
          )}
        </div>
      </div>
      {!compact && (
        <p className="mt-3 text-[11px]" style={{ color: 'var(--v3-muted)' }}>
          Votre conversation avec Ebookstudio-Génie et chaque version de votre sommaire sont enregistrées :
          vous pouvez écrire votre livre sur plusieurs semaines, depuis n’importe quel appareil, sans rien perdre.
        </p>
      )}
    </div>
  );
}

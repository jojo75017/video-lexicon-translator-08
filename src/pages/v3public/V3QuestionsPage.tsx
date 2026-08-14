import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle, Search, LifeBuoy } from 'lucide-react';
import BackButton from '@/components/v3/BackButton';
import { Input } from '@/components/ui/input';
import { V3_QUESTIONS, V3_QUESTION_THEMES } from '@/data/v3Questions';

const PAGE_SIZE = 40;

/** Catalogue de questions-réponses : chaque réponse ouvre le bon outil. */
export default function V3QuestionsPage() {
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState<string | null>(null);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return V3_QUESTIONS.filter((entry) => {
      if (theme && entry.theme !== theme) return false;
      if (!q) return true;
      return (
        entry.question.toLowerCase().includes(q) ||
        entry.answer.toLowerCase().includes(q) ||
        entry.theme.toLowerCase().includes(q)
      );
    });
  }, [query, theme]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <Helmet>
        <title>Questions-réponses Ebookstudio — une réponse et le bon outil</title>
        <meta
          name="description"
          content="Plus de 300 questions d'auteurs : écriture, correction, couverture, export KDP, mots-clés Amazon, forfaits. Chaque réponse ouvre directement l'outil concerné."
        />
      </Helmet>

      <BackButton to="/v3/fonctionnalites" label="Retour aux fonctionnalités" />

      <header className="mb-6 mt-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold" style={{ color: 'var(--v3-ink)' }}>
          <HelpCircle className="h-6 w-6" style={{ color: 'var(--v3-emerald)' }} />
          Questions-réponses
        </h1>
        <p className="mt-2 max-w-2xl text-[14.5px]" style={{ color: 'var(--v3-muted)' }}>
          {V3_QUESTIONS.length} questions d'auteurs, chacune avec le bouton qui ouvre l'outil
          concerné.
        </p>
      </header>

      <div className="relative mb-4">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
          style={{ color: 'var(--v3-muted)' }}
        />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(PAGE_SIZE);
          }}
          maxLength={120}
          placeholder="Rechercher : couverture, latin, export, mots-clés…"
          className="h-11 bg-white pl-9"
          aria-label="Rechercher une question"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => { setTheme(null); setLimit(PAGE_SIZE); }}
          className="rounded-full px-3 py-1.5 text-[12.5px] font-semibold"
          style={
            theme === null
              ? { background: 'var(--v3-emerald)', color: '#fff' }
              : { background: '#fff', color: 'var(--v3-muted)', border: '1px solid var(--v3-line)' }
          }
        >
          Tout
        </button>
        {V3_QUESTION_THEMES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTheme(t); setLimit(PAGE_SIZE); }}
            className="rounded-full px-3 py-1.5 text-[12.5px] font-semibold"
            style={
              theme === t
                ? { background: 'var(--v3-emerald)', color: '#fff' }
                : { background: '#fff', color: 'var(--v3-muted)', border: '1px solid var(--v3-line)' }
            }
          >
            {t}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <div
          className="rounded-2xl bg-white p-6 text-center"
          style={{ border: '1px solid var(--v3-line)' }}
        >
          <p className="text-[14.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
            Aucune réponse pour cette recherche.
          </p>
          <Link
            to="/v3/contact"
            className="mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[13.5px] font-semibold text-white"
            style={{ background: 'var(--v3-emerald)' }}
          >
            <LifeBuoy className="h-4 w-4" /> Posez-nous la question
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {results.slice(0, limit).map((entry) => (
            <li
              key={entry.id}
              className="flex flex-col rounded-2xl bg-white p-4"
              style={{ border: '1px solid var(--v3-line)' }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-[0.16em]"
                style={{ color: 'var(--v3-gold-600)' }}
              >
                {entry.theme}
              </span>
              <h2 className="mt-1.5 text-[14.5px] font-bold" style={{ color: 'var(--v3-ink)' }}>
                {entry.question}
              </h2>
              <p className="mt-1.5 flex-1 text-[13px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
                {entry.answer}
              </p>
              <Link
                to={entry.action.route}
                className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-[12.5px] font-semibold"
                style={{ background: 'var(--v3-emerald-50)', color: 'var(--v3-emerald)' }}
              >
                {entry.action.label} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {results.length > limit && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setLimit((l) => l + PAGE_SIZE)}
            className="rounded-xl px-4 py-2.5 text-[13.5px] font-semibold"
            style={{ background: '#fff', border: '1px solid var(--v3-line)', color: 'var(--v3-emerald)' }}
          >
            Voir plus de questions ({results.length - limit} restantes)
          </button>
        </div>
      )}
    </div>
  );
}

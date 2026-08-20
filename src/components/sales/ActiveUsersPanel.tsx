import { useEffect, useState } from 'react';
import { PenLine, BookOpenCheck, FileDown, MessagesSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Bloc de preuve d'usage — factuel, sans citation inventée.
 * On indique uniquement la version utilisée et l'étape en cours.
 * Si un témoignage approuvé existe pour la personne, sa ligne disparaît
 * automatiquement : le vrai avis prend le relais plus bas dans la page.
 */

const EMERALD = '#0B5C4B';
const GOLD = '#C9A84C';

interface ActiveUser {
  name: string;
  version: string;
  stage: string;
  icon: typeof PenLine;
}

const USERS: ActiveUser[] = [
  { name: 'Rachel D.', version: 'Version 2', stage: 'rédaction de son livre en cours', icon: PenLine },
  { name: 'Patrick L.', version: 'Version 2', stage: 'relecture et correction de son manuscrit', icon: BookOpenCheck },
  { name: 'Stéphane M.', version: 'Version 2', stage: 'export des fichiers pour Amazon KDP', icon: FileDown },
  { name: 'Claude René B.', version: 'Version 2', stage: 'échanges réguliers, rédaction en cours', icon: MessagesSquare },
];

const ActiveUsersPanel = () => {
  const [hidden, setHidden] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from('book_testimonials')
        .select('author_name')
        .eq('approved', true)
        .limit(200);
      if (!active || !data) return;
      const approved = data.map((r) => String(r.author_name || '').trim().toLowerCase());
      setHidden(USERS.map((u) => u.name).filter((n) => approved.includes(n.trim().toLowerCase())));
    })();
    return () => {
      active = false;
    };
  }, []);

  const visible = USERS.filter((u) => !hidden.includes(u.name));
  if (visible.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="rounded-2xl border bg-white p-6" style={{ borderColor: `${EMERALD}22` }}>
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ background: `${GOLD}18`, color: '#8a6d16' }}
        >
          Utilisation en cours
        </span>
        <h2 className="mt-3 text-lg font-black" style={{ color: EMERALD }}>
          Ils écrivent en ce moment avec EbookStudio
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
          Ce ne sont pas des avis, mais l'état réel de leurs projets. Leurs témoignages seront
          publiés ici lorsqu'ils les auront écrits eux-mêmes.
        </p>

        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {visible.map((u) => (
            <li
              key={u.name}
              className="flex items-start gap-3 rounded-xl border bg-slate-50/60 p-4"
              style={{ borderColor: `${EMERALD}14` }}
            >
              <u.icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: GOLD }} />
              <div>
                <p className="text-sm font-bold" style={{ color: EMERALD }}>
                  {u.name}
                  <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    {u.version}
                  </span>
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{u.stage}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ActiveUsersPanel;

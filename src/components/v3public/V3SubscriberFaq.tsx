import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { V3_QUESTIONS } from '@/data/v3Questions';

/** Questions reprises du registre officiel (page FAQ complète). */
const FEATURED_IDS = ['q-cle-unique', 'q-forfaits', 'q-v2', 'q-chapitres', 'q-support', 'q-paypal'];

/** FAQ sombre de l'accueil abonné — planche 15 de la maquette du 5 novembre. */
export default function V3SubscriberFaq() {
  const questions = FEATURED_IDS.map((id) => V3_QUESTIONS.find((q) => q.id === id)).filter(Boolean) as typeof V3_QUESTIONS;
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="v3-faq" className="v3-shell scroll-mt-24 py-10 md:py-14">
      <div className="text-center">
        <span
          className="inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
          style={{ background: 'rgba(246,189,42,0.12)', color: '#F6BD2A' }}
        >
          <HelpCircle className="mr-2 h-3.5 w-3.5" /> On vous répond
        </span>
        <h2 className="v3-serif mt-3 text-2xl font-semibold md:text-3xl" style={{ color: '#F3EDE6' }}>
          Questions fréquentes
        </h2>
      </div>

      <div className="mx-auto mt-8 max-w-3xl space-y-3">
        {questions.map((q) => {
          const isOpen = open === q.id;
          return (
            <div
              key={q.id}
              className="overflow-hidden rounded-2xl"
              style={{ background: '#332E2B', border: '1px solid rgba(246,189,42,0.25)' }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : q.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
              >
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
                  style={{ background: 'rgba(246,189,42,0.14)', color: '#F6BD2A' }}
                >
                  <HelpCircle className="h-4 w-4" />
                </span>
                <span className="flex-1 text-[14px] font-semibold" style={{ color: '#F3EDE6' }}>
                  {q.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  style={{ color: '#F6BD2A' }}
                />
              </button>
              {isOpen && (
                <div className="border-t px-4 py-3" style={{ borderColor: 'rgba(246,189,42,0.18)' }}>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: '#D8CFC7' }}>
                    {q.answer}
                  </p>
                  {q.action && (
                    <Link
                      to={q.action.route}
                      className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-bold"
                      style={{ color: '#F6BD2A' }}
                    >
                      {q.action.label} →
                    </Link>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div className="pt-2 text-center">
          <Link
            to="/v3/fonctionnalites/questions"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-bold transition-opacity hover:opacity-90"
            style={{ background: '#F6BD2A', color: '#1A1408' }}
          >
            Voir les 539 questions <ChevronDown className="h-4 w-4 -rotate-90" />
          </Link>
        </div>
      </div>
    </section>
  );
}

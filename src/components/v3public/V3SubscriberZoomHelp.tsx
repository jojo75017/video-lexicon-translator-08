import { CalendarDays, CheckCircle2, Video } from 'lucide-react';
import { trackZoomBooking } from '@/utils/analytics';

const BOOKING_URL = 'https://calendly.com/boubetgeorges/nouvelle-reunion';

const HELP_POINTS = [
  'Débloquer une étape de votre livre',
  'Clarifier une fonctionnalité',
  "Mieux comprendre une analyse de l'outil",
];

export default function V3SubscriberZoomHelp() {
  return (
    <section
      className="border-y"
      style={{
        background: 'var(--v3-joy-cream)',
        borderColor: 'var(--v3-joy-orange-soft)',
      }}
      aria-labelledby="subscriber-zoom-title"
    >
      <div className="v3-shell py-9 md:py-12">
        <div className="grid items-center gap-7 lg:grid-cols-[1fr_auto] lg:gap-12">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase"
              style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}
            >
              <Video className="h-3.5 w-3.5" /> Accompagnement humain
            </span>
            <h2
              id="subscriber-zoom-title"
              className="v3-serif mt-3 text-2xl font-semibold md:text-3xl"
              style={{ color: 'var(--v3-joy-ink)' }}
            >
              Vous êtes coincé ? Parlons-en ensemble
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 md:text-base" style={{ color: 'var(--v3-joy-muted)' }}>
              Réservez 30 minutes avec le fondateur pour avancer sereinement, obtenir des réponses claires et reprendre votre projet au bon endroit.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-3">
              {HELP_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm font-semibold" style={{ color: 'var(--v3-joy-ink)' }}>
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--v3-joy-orange-600)' }} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center lg:min-w-64">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackZoomBooking}
              className="v3-btn v3-joy-cta w-full justify-center px-6 py-3 text-base sm:w-auto lg:w-full"
            >
              <CalendarDays className="h-5 w-5" />
              Réserver un appel Zoom (30 min)
            </a>
            <p className="mt-2 text-xs" style={{ color: 'var(--v3-joy-muted)' }}>
              Sans engagement, au créneau de votre choix.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
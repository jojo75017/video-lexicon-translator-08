import { Link } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Lock, ShoppingBag, Clock } from 'lucide-react';
import { BackButton } from '@/components/v3/BackButton';
import useV3Open from '@/hooks/useV3Open';
import {
  V3_LAUNCH_CALENDAR,
  V3_OPENING_ISO,
  daysUntil,
  formatCalendarDate,
  type V3CalendarStatus,
} from '@/data/v3LaunchCalendar';

/**
 * Calendrier d'ouverture des modules V3 — page d'information uniquement.
 * Aucun verrou, aucun paiement, aucune écriture : elle explique ce qui est
 * déjà libre et la date exacte d'ouverture du reste.
 */
export default function V3CalendrierPage() {
  const { open } = useV3Open();
  const remaining = daysUntil(V3_OPENING_ISO);
  const openingLabel = formatCalendarDate(V3_OPENING_ISO);

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA', color: '#232F3E' }}>
      <div className="v3-shell pt-4"><BackButton /></div>

      <header className="v3-shell pt-8 pb-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#C9A84C' }}>
          Calendrier d'ouverture
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
          Quand chaque module de la V3 s'ouvre
        </h1>
        <p className="text-[#4B5563] leading-relaxed max-w-3xl">
          Certains modules sont déjà utilisables aujourd'hui. Les autres s'ouvrent tous ensemble
          {openingLabel ? <> le <strong>{openingLabel}</strong></> : null}. Les compléments achetés
          s'ouvrent, eux, immédiatement après le paiement.
        </p>

        <div
          className="mt-5 rounded-lg px-5 py-4 flex flex-wrap items-center gap-3 text-sm"
          style={{ background: '#064E3B', color: '#F5E6C8' }}
        >
          <CalendarDays className="w-5 h-5" style={{ color: '#C9A84C' }} />
          {open ? (
            <span className="font-semibold">La V3 est ouverte : tous les modules ci-dessous sont accessibles.</span>
          ) : (
            <span className="font-semibold">
              Ouverture dans {remaining} jour{remaining > 1 ? 's' : ''} — {openingLabel} (heure de Paris)
            </span>
          )}
        </div>
      </header>

      {V3_LAUNCH_CALENDAR.map((group) => (
        <section key={group.key} className="v3-shell py-6">
          <div className="flex items-center gap-2 mb-1">
            <StatusIcon status={group.entries[0]?.status ?? 'libre'} />
            <h2 className="text-xl font-bold">{group.label}</h2>
          </div>
          <p className="text-sm text-[#6B7280] mb-4">{group.intro}</p>

          <ul className="grid md:grid-cols-2 gap-3">
            {group.entries.map((entry) => {
              const date = formatCalendarDate(entry.opensAt);
              const content = (
                <>
                  <div className="flex items-start gap-2">
                    <StatusIcon status={entry.status} />
                    <span className="font-semibold leading-snug">{entry.title}</span>
                  </div>
                  <p className="text-sm text-[#4B5563] mt-1.5">{entry.note}</p>
                  <p className="text-xs mt-2 font-semibold" style={{ color: '#064E3B' }}>
                    {entry.status === 'complement' ? 'Ouvert dès l’achat' : date ? date : 'Déjà ouvert'}
                  </p>
                </>
              );

              return (
                <li
                  key={entry.title}
                  className="rounded-lg p-4"
                  style={{ background: '#fff', border: '1px solid #E5E7EB' }}
                >
                  {entry.to ? (
                    <Link to={entry.to} className="block hover:opacity-90">{content}</Link>
                  ) : (
                    content
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className="v3-shell pb-14">
        <div className="rounded-lg p-5 text-sm" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center gap-2 font-semibold mb-1.5">
            <Clock className="w-4 h-4" style={{ color: '#C9A84C' }} />
            Bon à savoir
          </div>
          <p className="text-[#4B5563] leading-relaxed">
            Les dates ci-dessus concernent l'ouverture des modules, pas votre abonnement.
            Vos livres, vos couvertures et vos réglages sont conservés avant comme après l'ouverture.
          </p>
        </div>
      </section>
    </div>
  );
}

function StatusIcon({ status }: { status: V3CalendarStatus }) {
  if (status === 'libre') return <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#0d7a5f' }} />;
  if (status === 'complement') return <ShoppingBag className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />;
  return <Lock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#6B7280' }} />;
}

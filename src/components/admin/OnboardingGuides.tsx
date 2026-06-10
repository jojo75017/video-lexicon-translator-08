import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Lock, Gift, Calendar } from 'lucide-react';

const TEAL = '#008296';
const GOLD = '#c9a84c';

// ============================================================================
// Guides Nouveaux Abonnés — Onboarding 7 jours.
// Parcours « Premiers pas KDP en 7 jours » + 2 guides de base OFFERTS pour
// activer les nouveaux abonnés. Guides avancés verrouillés → CTA upsell.
// ============================================================================

interface DayStep {
  day: number;
  title: string;
  desc: string;
  /** Module interne à ouvrir (route). */
  to?: string;
}

const SEVEN_DAYS: DayStep[] = [
  { day: 1, title: 'Trouver ta niche rentable', desc: 'Lance INTEL pour repérer une niche à demande réelle et faible concurrence.', to: '/hub-v3' },
  { day: 2, title: 'Valider ton angle', desc: 'Analyse le top 10 Amazon avec SCOUT et trouve ton positionnement.', to: '/hub-v3' },
  { day: 3, title: 'Générer ton manuscrit', desc: 'Crée ton livre via le Studio de création (pipeline P1–P15).', to: '/hub-v3' },
  { day: 4, title: 'Couverture professionnelle', desc: 'Génère une couverture photoréaliste prête KDP.', to: '/couverture-kdp' },
  { day: 5, title: 'Fiche & mots-clés', desc: 'Optimise titre, sous-titre, 7 mots-clés et catégories.', to: '/hub-v3' },
  { day: 6, title: 'Conformité & export', desc: 'Vérifie la conformité KDP puis exporte ton pack ZIP.', to: '/hub-v3' },
  { day: 7, title: 'Publier & lancer', desc: 'Publie sur KDP et déclenche ta séquence de lancement J-7.', to: '/hub-v3' },
];

interface Guide {
  title: string;
  desc: string;
  free: boolean;
}

const GUIDES: Guide[] = [
  { title: 'Premiers pas sur Amazon KDP', desc: 'Créer ton compte, fiscalité, modes de redevance, marketplaces.', free: true },
  { title: 'Anatomie d\'une fiche qui convertit', desc: 'Titre, sous-titre, description A+, mots-clés et catégories.', free: true },
  { title: 'Stratégie de lancement avancée', desc: 'Pré-commande, reviews, ranking, BookBub et Amazon Ads.', free: false },
  { title: 'Scaler à 10 livres rentables', desc: 'Systématiser la production et bâtir un catalogue qui vend.', free: false },
  { title: 'Traduction & marchés internationaux', desc: 'Dupliquer tes ventes sur US/UK/DE/ES.', free: false },
];

const OnboardingGuides: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <p className="text-sm text-joy-ink/70">
        Active tes premiers résultats en 7 jours. Le parcours « Premiers pas KDP » et 2 guides de base
        sont <strong>offerts</strong> ; les guides avancés se débloquent avec les packs upsell.
      </p>

      {/* Parcours 7 jours */}
      <div>
        <h3 className="flex items-center gap-2 font-bold mb-3" style={{ color: TEAL }}>
          <Calendar className="h-5 w-5" /> Onboarding « Premiers pas KDP en 7 jours »
        </h3>
        <div className="space-y-2">
          {SEVEN_DAYS.map((s) => (
            <button
              key={s.day}
              onClick={() => s.to && navigate(s.to)}
              className="w-full text-left flex gap-3 rounded-xl border p-3 hover:border-current transition-colors"
              style={{ color: TEAL }}
            >
              <div
                className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: TEAL }}
              >
                J{s.day}
              </div>
              <div>
                <div className="font-semibold text-joy-ink">{s.title}</div>
                <div className="text-sm text-joy-ink/60">{s.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Guides */}
      <div>
        <h3 className="flex items-center gap-2 font-bold mb-3" style={{ color: TEAL }}>
          <Gift className="h-5 w-5" /> Guides
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GUIDES.map((g) => (
            <div
              key={g.title}
              className="rounded-xl border p-4 flex flex-col gap-2"
              style={g.free ? {} : { opacity: 0.95 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-joy-ink">{g.title}</span>
                {g.free ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> Offert
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: GOLD }}>
                    <Lock className="h-4 w-4" /> Avancé
                  </span>
                )}
              </div>
              <p className="text-sm text-joy-ink/60 flex-1">{g.desc}</p>
              {g.free ? (
                <span className="text-sm font-semibold" style={{ color: TEAL }}>Disponible →</span>
              ) : (
                <button
                  onClick={() => navigate('/hub-v3#tarifs')}
                  className="self-start rounded-lg px-3 py-1.5 text-sm font-bold text-white hover:opacity-90"
                  style={{ background: GOLD }}
                >
                  Débloquer (upsell) →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuides;

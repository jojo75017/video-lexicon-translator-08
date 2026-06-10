import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, ChevronDown, RotateCcw, Trophy, Lock } from 'lucide-react';
import { getModuleById, type V3Module } from '@/data/roadmapV3';
import { isModuleClickable } from './v3ModuleRegistry';

// Palette « Clair Ambre » — cohérente avec V3HubPage.
const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const AMBER_SOFT = '#FFF3DF';
const INK = '#2A2118';
const GREEN = '#1f9d6b';
const SERIF = "'Georgia', 'Times New Roman', serif";

const STORAGE_KEY = 'v3_workflow30_progress';

interface Step {
  /** Module V3 ouvert au clic. */
  moduleId: string;
  /** Libellé court de l'action (sinon titre du module). */
  label?: string;
  /** Pourquoi cette étape (aide). */
  hint: string;
}

interface Phase {
  key: string;
  emoji: string;
  title: string;
  steps: Step[];
}

/** Le parcours complet : de l'idée au livre publié et vendu. 30 étapes. */
const PHASES: Phase[] = [
  {
    key: 'idee',
    emoji: '🔎',
    title: 'Phase 1 — Trouver l\'idée gagnante',
    steps: [
      { moduleId: 'p22-trend-radar', label: 'Repérer les tendances', hint: 'Détecte les sujets qui montent sur Amazon.' },
      { moduleId: 'niche-intelligence', label: 'Analyser la niche', hint: 'Mesure la demande et la profondeur du marché.' },
      { moduleId: 'p16-competitive', label: 'Étudier la concurrence', hint: 'Compare les best-sellers de la niche.' },
      { moduleId: 'ku-niche-detector', label: 'Vérifier la rentabilité (KU)', hint: 'Cible les niches rentables en lecture KU.' },
      { moduleId: 'p26-commercial-score', label: 'Valider le potentiel', hint: 'Note le potentiel commercial avant d\'écrire.' },
    ],
  },
  {
    key: 'ecriture',
    emoji: '✍️',
    title: 'Phase 2 — Concevoir & écrire le livre',
    steps: [
      { moduleId: 'book-creation-studio', label: 'Créer le livre (Studio IA)', hint: 'Génère plan et chapitres avec les agents IA.' },
      { moduleId: 'p17-series', label: 'Architecturer la série', hint: 'Planifie les tomes si c\'est une saga.' },
      { moduleId: 'p19-author-voice', label: 'Fixer la voix d\'auteur', hint: 'Garde un style constant sur tout le livre.' },
      { moduleId: 'p20-chat-manuscript', label: 'Affiner via le chat manuscrit', hint: 'Discute et retravaille ton texte avec l\'IA.' },
      { moduleId: 'p23-universe-bible', label: 'Vérifier la cohérence', hint: 'Contrôle la cohérence de l\'univers et des persos.' },
    ],
  },
  {
    key: 'qualite',
    emoji: '🧪',
    title: 'Phase 3 — Réviser & garantir la qualité',
    steps: [
      { moduleId: 'p18-readability', label: 'Auditer la lisibilité', hint: 'Mesure et améliore la fluidité de lecture.' },
      { moduleId: 'p24-cliche-detector', label: 'Nettoyer clichés & répétitions', hint: 'Supprime les tics d\'écriture et redites.' },
      { moduleId: 'p25-tone-adapter', label: 'Adapter le ton', hint: 'Ajuste le ton à ta cible de lecteurs.' },
      { moduleId: 'ebook-anti-plagiat', label: 'Protéger contre le plagiat', hint: 'Vérifie l\'originalité et protège ton texte.' },
      { moduleId: 'content-compliance', label: 'Contrôler la conformité KDP', hint: 'Évite les motifs de refus à la publication.' },
    ],
  },
  {
    key: 'mise-en-page',
    emoji: '🎨',
    title: 'Phase 4 — Mise en page & couverture',
    steps: [
      { moduleId: 'manuscript-converter', label: 'Convertir le manuscrit', hint: 'Mets ton fichier au bon format KDP.' },
      { moduleId: 'back-matter-builder', label: 'Ajouter les pages de fin', hint: 'Génère remerciements, bio et appels à l\'action.' },
      { moduleId: 'copyright-page', label: 'Générer la page copyright', hint: 'Crée les mentions légales obligatoires.' },
      { moduleId: 'cover-studio-pro', label: 'Créer la couverture Pro', hint: 'Couverture photoréaliste haut de gamme (IA).' },
      { moduleId: 'cover-variants-thumbnail', label: 'Tester la miniature Amazon', hint: 'Valide la lisibilité du titre en 200×300 px.' },
    ],
  },
  {
    key: 'publication',
    emoji: '🚀',
    title: 'Phase 5 — Préparer & publier sur KDP',
    steps: [
      { moduleId: 'multi-format-express', label: 'Exporter multi-format', hint: 'Génère ebook + broché prêts à l\'upload.' },
      { moduleId: 'cover-pdf-exact', label: 'Couverture KDP exacte (PDF)', hint: 'PDF dos + 4e + fonds perdus aux bonnes cotes.' },
      { moduleId: 'kindle-previewer', label: 'Prévisualiser le rendu', hint: 'Simule l\'affichage Kindle avant publication.' },
      { moduleId: 'isbn-metadata', label: 'Renseigner ISBN & métadonnées', hint: 'Titre, sous-titre, mots-clés et description.' },
      { moduleId: 'categories-manager-10', label: 'Choisir les 10 catégories', hint: 'Maximise la visibilité avec 10 catégories.' },
      { moduleId: 'prepub-checklist', label: 'Passer la checklist finale', hint: 'Vérifie tout avant de cliquer « Publier ».' },
      { moduleId: 'kdp-pack-zip', label: 'Générer le pack KDP ZIP', hint: 'Tous les fichiers prêts pour l\'upload KDP.' },
    ],
  },
  {
    key: 'vente',
    emoji: '📈',
    title: 'Phase 6 — Lancer & vendre',
    steps: [
      { moduleId: 'sales-description', label: 'Écrire la description vendeuse', hint: 'Une fiche produit qui convertit.' },
      { moduleId: 'listing-optimizer', label: 'Optimiser l\'annonce', hint: 'Mots-clés et titre optimisés pour Amazon.' },
      { moduleId: 'launch-sequence-j7', label: 'Lancer la séquence J-7', hint: 'Plan de lancement jour par jour.' },
      { moduleId: 'sales-tracker', label: 'Suivre les ventes', hint: 'Pilote tes ventes et tes royalties en direct.' },
    ],
  },
];

const ALL_STEP_IDS = PHASES.flatMap((p) => p.steps.map((s) => s.moduleId));
const TOTAL = ALL_STEP_IDS.length;

function loadProgress(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

const V3Workflow30: React.FC<{ onOpenModule: (m: V3Module) => void }> = ({ onOpenModule }) => {
  const [done, setDone] = useState<Set<string>>(() => loadProgress());
  const [openPhase, setOpenPhase] = useState<string | null>(PHASES[0].key);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...done]));
  }, [done]);

  const completed = useMemo(() => ALL_STEP_IDS.filter((id) => done.has(id)).length, [done]);
  const pct = Math.round((completed / TOTAL) * 100);

  const toggle = (id: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const reset = () => setDone(new Set());

  let counter = 0;

  return (
    <section id="parcours" className="mb-12 scroll-mt-20">
      {/* En-tête + progression */}
      <div className="rounded-3xl border-2 bg-white overflow-hidden shadow-[0_10px_44px_-18px_rgba(232,149,30,0.45)]"
        style={{ borderColor: AMBER }}>
        <div className="relative p-6 sm:p-8" style={{ background: `linear-gradient(135deg, ${AMBER_SOFT}, #ffffff 70%)` }}>
          <span className="pointer-events-none absolute inset-x-10 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${AMBER}, transparent)` }} />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 rounded-full border px-3.5 py-1"
                style={{ borderColor: `${AMBER}66`, background: '#fff' }}>
                <Trophy className="h-4 w-4" style={{ color: AMBER }} />
                <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: AMBER_DEEP }}>
                  Le parcours complet
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: SERIF, color: INK }}>
                De l'idée au livre publié — en 30 étapes
              </h2>
              <p className="mt-2 max-w-2xl text-sm" style={{ color: '#6f5e47' }}>
                Suis le chemin pas à pas. Coche chaque étape, ta progression est sauvegardée
                automatiquement. Clique sur une étape pour ouvrir l'outil correspondant.
              </p>
            </div>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors hover:bg-[#FFF3DF]"
              style={{ borderColor: `${AMBER}55`, color: AMBER_DEEP }}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Réinitialiser
            </button>
          </div>

          {/* Barre de progression */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: INK }}>
                {completed} / {TOTAL} étapes terminées
              </span>
              <span className="text-sm font-black" style={{ color: completed === TOTAL ? GREEN : AMBER_DEEP }}>
                {pct}%
              </span>
            </div>
            <div className="h-3 w-full rounded-full overflow-hidden" style={{ background: '#f0e7d4' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: completed === TOTAL ? `linear-gradient(90deg, ${GREEN}, #2fc488)` : `linear-gradient(90deg, ${AMBER}, #FFB44D)` }} />
            </div>
            {completed === TOTAL && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: GREEN }}>
                <Trophy className="h-4 w-4" /> Bravo, ton livre est prêt et lancé !
              </p>
            )}
          </div>
        </div>

        {/* Phases */}
        <div className="divide-y divide-[#f0e7d4]">
          {PHASES.map((phase) => {
            const isOpen = openPhase === phase.key;
            const phaseIds = phase.steps.map((s) => s.moduleId);
            const phaseDone = phaseIds.filter((id) => done.has(id)).length;
            const phaseComplete = phaseDone === phaseIds.length;
            return (
              <div key={phase.key}>
                <button
                  onClick={() => setOpenPhase(isOpen ? null : phase.key)}
                  className="w-full flex items-center gap-3 px-5 sm:px-7 py-4 text-left transition-colors hover:bg-[#FCF8F0]"
                  aria-expanded={isOpen}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl text-lg shrink-0 border"
                    style={{ borderColor: phaseComplete ? GREEN : '#eadfc9', background: phaseComplete ? `${GREEN}14` : '#FCF8F0' }}>
                    {phaseComplete ? <Check className="h-4 w-4" style={{ color: GREEN }} /> : phase.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold leading-tight" style={{ fontFamily: SERIF, color: INK }}>{phase.title}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: '#a18a6c' }}>{phaseDone} / {phaseIds.length} étapes</div>
                  </div>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: AMBER_DEEP }} />
                </button>

                {isOpen && (
                  <ol className="pb-3">
                    {phase.steps.map((step) => {
                      counter += 1;
                      const n = counter;
                      const mod = getModuleById(step.moduleId);
                      const ready = isModuleClickable(step.moduleId);
                      const isDone = done.has(step.moduleId);
                      return (
                        <li key={step.moduleId} className="flex items-start gap-3 px-5 sm:px-7 py-2.5">
                          {/* Case à cocher */}
                          <button
                            onClick={() => toggle(step.moduleId)}
                            aria-label={isDone ? 'Marquer comme à faire' : 'Marquer comme terminé'}
                            className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-colors"
                            style={{
                              borderColor: isDone ? GREEN : `${AMBER}66`,
                              background: isDone ? GREEN : '#fff',
                            }}
                          >
                            {isDone && <Check className="h-3.5 w-3.5 text-white" />}
                          </button>

                          {/* Numéro + libellé */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-black tabular-nums" style={{ color: AMBER_DEEP }}>
                                {String(n).padStart(2, '0')}
                              </span>
                              <span className={`text-sm font-semibold leading-tight ${isDone ? 'line-through opacity-60' : ''}`} style={{ color: INK }}>
                                {step.label ?? mod?.title ?? step.moduleId}
                              </span>
                            </div>
                            <p className="text-[11px] leading-snug mt-0.5" style={{ color: '#8a7860' }}>{step.hint}</p>
                          </div>

                          {/* Ouvrir l'outil */}
                          {ready && mod ? (
                            <button
                              onClick={() => onOpenModule(mod)}
                              className="shrink-0 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-bold border transition-colors hover:bg-[#FFF3DF]"
                              style={{ borderColor: `${AMBER}55`, color: AMBER_DEEP }}
                            >
                              Ouvrir <ArrowRight className="h-3 w-3" />
                            </button>
                          ) : (
                            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold" style={{ color: '#a18a6c' }}>
                              <Lock className="h-3 w-3" /> Bientôt
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default V3Workflow30;

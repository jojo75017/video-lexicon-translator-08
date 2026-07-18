import { useParams, useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { SPECIAL_BOOK_TABS } from '@/components/v3public/V3Header';

const META: Record<string, { emoji: string; title: string; hero: string; features: string[] }> = {
  roman:          { emoji: '📖', title: 'Roman',           hero: 'Écris un roman captivant en quelques minutes.', features: ['Structure narrative solide', 'Personnages vivants', 'Chapitres cohérents'] },
  cuisine:        { emoji: '🍳', title: 'Livre de cuisine', hero: 'Recettes, menus, fiches techniques — un livre pro.', features: ['Fiches recettes', 'Photos IA', 'Sommaire clair'] },
  voyage:         { emoji: '🧳', title: 'Guide de voyage',  hero: 'Itinéraires, bonnes adresses, cartes.', features: ['Itinéraires détaillés', 'Bonnes adresses', 'Cartes générées'] },
  coloriage:      { emoji: '🎨', title: 'Livre de coloriage', hero: 'Pages à colorier générées par IA.', features: ['Illustrations line-art', 'Thèmes variés', 'Prêt à imprimer'] },
  bd:             { emoji: '💥', title: 'BD / Manga',       hero: 'Planches, cases et bulles générées par IA.', features: ['Cases dynamiques', 'Bulles éditables', 'Style manga ou BD'] },
  documentaire:   { emoji: '🎬', title: 'Documentaire',     hero: 'Livre documentaire richement illustré.', features: ['Recherche approfondie', 'Photos', 'Sources'] },
  atlas:          { emoji: '🗺️', title: 'Atlas',           hero: 'Cartes et fiches géographiques.', features: ['Cartes régionales', 'Fiches pays', 'Statistiques'] },
  encyclopedie:   { emoji: '📚', title: 'Encyclopédie',    hero: 'Articles thématiques structurés.', features: ['Articles par thème', 'Index alpha', 'Références'] },
  agenda:         { emoji: '📅', title: 'Agenda / Planner', hero: 'Planificateurs et pages datées.', features: ['Vues mensuelles', 'Habitudes', 'Objectifs'] },
  journal:        { emoji: '📔', title: 'Journal intime',   hero: 'Journaux et carnets guidés.', features: ['Prompts quotidiens', 'Gratitude', 'Réflexions'] },
  scolaire:       { emoji: '🏫', title: 'Manuel scolaire',  hero: 'Cours, exercices, corrigés.', features: ['Programme structuré', 'Exercices', 'Corrigés'] },
  aquariophilie:  { emoji: '🐠', title: 'Aquariophilie',    hero: 'Fiches poissons et bacs.', features: ['Fiches espèces', 'Guides bacs', 'Maintenance'] },
  oiseaux:        { emoji: '🐦', title: 'Fiches oiseaux',   hero: 'Guide ornithologique illustré.', features: ['Fiches espèces', 'Chants', 'Habitats'] },
  saga:           { emoji: '📚', title: 'Saga multi-tomes', hero: 'Une série cohérente sur plusieurs tomes.', features: ['Bible narrative', 'Personnages récurrents', 'Fil rouge'] },
};

export default function V3SpecialBookPage() {
  const { type } = useParams();
  const nav = useNavigate();
  const meta = (type && META[type]) || { emoji: '📚', title: 'Livre spécial', hero: 'Crée un livre spécial.', features: [] };

  return (
    <>
      <section className="v3-halo">
        <div className="max-w-4xl mx-auto px-5 md:px-8 py-16 text-center">
          <div className="text-5xl">{meta.emoji}</div>
          <h1 className="v3-serif text-4xl md:text-5xl font-bold mt-4">{meta.title}</h1>
          <p className="mt-3 text-[var(--v3-muted)] max-w-lg mx-auto">{meta.hero}</p>
          <button
            onClick={() => nav(`/v3/create?type=${encodeURIComponent(meta.title)}`)}
            className="v3-btn v3-btn-primary mt-8"
          >
            <Sparkles className="w-4 h-4" /> Créer ce livre <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {meta.features.length > 0 && (
        <section className="max-w-5xl mx-auto px-5 md:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-4">
            {meta.features.map((f) => (
              <div key={f} className="v3-card">
                <div className="w-8 h-8 rounded-lg bg-[var(--v3-orange-50)] text-[var(--v3-orange-600)] grid place-items-center">✓</div>
                <div className="mt-3 font-semibold">{f}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-5 md:px-8 py-8">
        <div className="text-sm text-[var(--v3-muted)] mb-4">Autres types de livres :</div>
        <div className="flex flex-wrap gap-2">
          {SPECIAL_BOOK_TABS.filter((t) => t.slug !== type).map((t) => (
            <Link key={t.slug} to={`/v3/livres/${t.slug}`} className="v3-chip">{t.label}</Link>
          ))}
        </div>
      </section>
    </>
  );
}

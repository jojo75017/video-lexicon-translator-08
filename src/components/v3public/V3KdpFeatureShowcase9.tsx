import V3FeatureAccessInfo from './V3FeatureAccessInfo';
import { CalendarCheck, Megaphone, Search, Send, Share2, Target } from 'lucide-react';
import marketingImg from '@/assets/v3-kdp-ai-marketing.jpg';

const BENEFITS = [
  { icon: Megaphone, text: 'Des textes publicitaires Amazon générés automatiquement, prêts à diffuser.' },
  { icon: Send, text: 'Descriptions promotionnelles rédigées pour vos lancements de livres.' },
  { icon: Share2, text: 'Publications pour les réseaux sociaux afin de promouvoir chaque nouveauté.' },
  { icon: CalendarCheck, text: 'Séquences d’emails prêtes à envoyer pour annoncer vos sorties.' },
  { icon: Target, text: 'Stratégies de lancement construites pour vous, étape par étape.' },
  { icon: Search, text: 'Vos livres optimisés pour l’algorithme de recherche d’Amazon.' },
];

/**
 * Encart « Caractéristique 09 » — l'optimiseur de marketing et de ventes par IA.
 * Même famille visuelle que les encarts 01 à 08 (carte sombre à liseré orange),
 * compacte, avec une photo en vis-à-vis.
 */
export default function V3KdpFeatureShowcase9() {
  return (
    <div className="v3-shell">
      <article
        className="mx-auto mt-8 max-w-6xl overflow-hidden rounded-3xl"
        style={{
          background: 'var(--v3-joy-ink)',
          border: '1px solid var(--v3-joy-orange)',
          boxShadow: '0 24px 50px -32px color-mix(in srgb, var(--v3-joy-ink) 55%, transparent)',
        }}
      >
        <div className="grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:p-10 lg:py-8">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase"
              style={{ background: 'color-mix(in srgb, var(--v3-joy-orange) 18%, transparent)', color: 'var(--v3-joy-orange)' }}
            >
              Caractéristique 09 <Target className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <h3 className="v3-serif mt-4 text-2xl font-semibold leading-tight md:text-3xl" style={{ color: 'var(--v3-on-emerald)' }}>
              Optimiseur de marketing et de ventes par IA
            </h3>
              <V3FeatureAccessInfo included="Descriptions et préparation du lancement" options={[{ title: "Posts et trafic social", route: "/v3/posts" }, { title: "Promotion éditeur", route: "/v3/acquisition" }]} />
            <ul className="mt-5 space-y-3">
              {BENEFITS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-[14px] leading-6 md:text-[15px]" style={{ color: 'color-mix(in srgb, var(--v3-on-emerald) 90%, transparent)' }}>
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg" style={{ background: 'color-mix(in srgb, var(--v3-joy-orange) 20%, transparent)', color: 'var(--v3-joy-orange)' }} aria-hidden="true">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="overflow-hidden rounded-2xl p-2"
            style={{ background: 'var(--v3-joy-orange-soft)', border: '1px solid var(--v3-joy-orange)' }}
          >
            <img
              src={marketingImg}
              alt="Un robot élégant présente un tableau de bord lumineux avec un graphique en hausse, à côté d'une tablette affichant des couvertures de livres"
              width={1024}
              height={768}
              loading="lazy"
              className="h-40 w-full rounded-xl object-cover sm:h-48 lg:h-56"
            />
          </div>
        </div>
      </article>
    </div>
  );
}

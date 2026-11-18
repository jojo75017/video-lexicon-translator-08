import V3PricingOverview from '@/components/v3public/V3PricingOverview';
import { usePageMeta } from '@/hooks/usePageMeta';
import mockup from '@/assets/vente-mockup-3d.jpg';
import cuervo from '@/assets/vente-el-cuervo.jpg';

const NUIT = '#0b1120', OR = '#ff9e2d', IVOIRE = '#f5f1e8';
const Cta = ({ label = 'Voir les formules' }: { label?: string }) => (
  <a href="#formules" className="inline-block rounded-xl px-8 py-4 text-lg font-bold shadow-lg transition hover:scale-105" style={{ background: OR, color: NUIT }}>{label}</a>
);
const Section = ({ children, light }: { children: React.ReactNode; light?: boolean }) => (
  <section className="px-4 py-16 md:py-20" style={light ? { background: IVOIRE, color: NUIT } : undefined}>
    <div className="mx-auto max-w-6xl">{children}</div>
  </section>
);
const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl" style={{ color: "inherit" }}>{children}</h2>;

const etapes = [
  ['1', 'Votre idée', 'Un titre, un thème ou quelques lignes suffisent pour démarrer.'],
  ['2', 'La rédaction', 'Chapitre par chapitre, avec une mémoire de l’histoire et un nettoyage automatique des répétitions.'],
  ['3', 'La couverture', 'Studio Couvertures et mockups 3D pour présenter votre livre comme un pro.'],
  ['4', 'Amazon KDP', 'Fichiers Kindle et broché, fiche Amazon et checklist de publication.'],
];
const publics = [
  ['Débutants', 'Vous rêvez d’écrire mais la page blanche vous bloque.'],
  ['Romanciers', 'Vous voulez aller plus vite sans perdre la cohérence de votre histoire.'],
  ['Experts et formateurs', 'Vous transformez votre savoir en guide publié.'],
  ['Éditeurs KDP', 'Vous publiez régulièrement et cherchez un atelier complet.'],
];
const atouts = [
  ['Écriture blindée', 'Nettoyage des scories, pas de découvertes rejouées d’un chapitre à l’autre.'],
  ['Mockups 3D intégrés', 'Votre livre posé sur une vraie table, prêt pour Amazon et les réseaux.'],
  ['100 % vos droits', 'Vous restez propriétaire de vos livres et de vos redevances.'],
  ['Vos clés IA', 'Utilisez vos clés gratuites ou celles que vous avez déjà, sans frais cachés.'],
];
const faq = [
  ['Faut-il savoir écrire ?', 'Non. Vous apportez l’idée, EbookStudio vous accompagne à chaque étape et vous gardez la main sur chaque chapitre.'],
  ['À qui appartiennent mes livres ?', 'À vous, entièrement. Vous publiez sous votre nom et touchez vos redevances.'],
  ['Pourquoi mettre mes propres clés ?', 'Avec vos clés gratuites (ou celles que vous avez déjà), vous obtenez de bien meilleurs résultats. Nous vous montrons comment faire lors de votre séance d’accueil.'],
  ['Puis-je arrêter quand je veux ?', 'Oui, les formules mensuelles sont sans engagement.'],
  ['Comment publier sur Amazon ?', 'EbookStudio prépare vos fichiers et votre fiche, et une checklist vous guide jusqu’à la mise en ligne.'],
];

export default function FormulesPubliquesPage() {
  usePageMeta({ title: 'EbookStudio — Écrivez et publiez votre livre sur Amazon', description: 'De l’idée au livre publié sur Amazon KDP : rédaction, couverture, mockups 3D. Formules dès 19 €/mois, sans engagement.' });
  return <main className="min-h-screen" style={{ background: NUIT, color: '#f5f5f5' }}>
    <Section>
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <span className="mb-4 inline-block rounded-full px-4 py-1 text-sm font-semibold" style={{ background: 'rgba(255,158,45,.15)', color: OR }}>Atelier d’écriture et de publication</span>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl">Écrivez, habillez et publiez votre livre sur Amazon, <span style={{ color: OR }}>sans rester bloqué sur la page blanche</span></h1>
          <p className="mb-8 text-lg opacity-90">EbookStudio vous accompagne de l’idée jusqu’au livre en vente : rédaction cohérente, couverture professionnelle, mockups 3D et fichiers prêts pour KDP.</p>
          <Cta label="Je choisis ma formule" />
          <p className="mt-4 text-sm opacity-75">Paiement sécurisé · Sans engagement · Dès 19 €/mois</p>
        </div>
        <img src={mockup} alt="Livre EbookStudio présenté en mockup 3D" className="w-full rounded-2xl shadow-2xl" width={1080} height={1080} />
      </div>
    </Section>

    <Section light>
      <H2>Pourquoi tant de livres ne voient jamais le jour</H2>
      <div className="grid gap-6 md:grid-cols-3">
        {[['La page blanche', 'On a l’idée, mais on ne sait pas par où commencer.'], ['Le temps', 'Des mois d’écriture, de relecture et de mise en page.'], ['Le coût', 'Correction, couverture, maquette : la facture grimpe vite.']].map(([t, d]) =>
          <div key={t} className="rounded-2xl p-6 shadow" style={{ background: "#fff", color: NUIT }}><h3 className="mb-2 text-xl font-bold">{t}</h3><p>{d}</p></div>)}
      </div>
    </Section>

    <Section>
      <H2>La méthode EbookStudio en 4 étapes</H2>
      <div className="grid gap-6 md:grid-cols-4">
        {etapes.map(([n, t, d]) => <div key={n} className="rounded-2xl border p-6" style={{ borderColor: 'rgba(255,255,255,.15)' }}>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full font-bold" style={{ background: OR, color: NUIT }}>{n}</div>
          <h3 className="mb-2 text-lg font-bold">{t}</h3><p className="opacity-85">{d}</p></div>)}
      </div>
    </Section>

    <Section light>
      <H2>Pour qui ?</H2>
      <div className="grid gap-6 md:grid-cols-4">
        {publics.map(([t, d]) => <div key={t} className="rounded-2xl p-6 shadow" style={{ background: "#fff", color: NUIT }}><h3 className="mb-2 font-bold" style={{ color: '#008296' }}>{t}</h3><p>{d}</p></div>)}
      </div>
    </Section>

    <Section>
      <H2>Ce qui rend EbookStudio différent</H2>
      <div className="grid gap-6 md:grid-cols-2">
        {atouts.map(([t, d]) => <div key={t} className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,.06)' }}><h3 className="mb-2 text-xl font-bold" style={{ color: OR }}>✓ {t}</h3><p className="opacity-90">{d}</p></div>)}
      </div>
    </Section>

    <Section light>
      <div className="grid items-center gap-10 md:grid-cols-2">
        <img src={cuervo} alt="Le Fils d'El Cuervo, roman publié sur Amazon" className="w-full rounded-2xl shadow-xl" />
        <div>
          <h2 className="mb-4 text-3xl font-bold" style={{ color: "inherit" }}>Un vrai livre, vraiment publié</h2>
          <p className="mb-6 text-lg">« Le Fils d’El Cuervo » a été préparé avec EbookStudio et il est en vente sur Amazon, en Kindle et en broché.</p>
          <div className="flex flex-wrap gap-3">
            <a href="https://www.amazon.fr/dp/B0HLL8PZB6" target="_blank" rel="noopener noreferrer" className="rounded-xl px-5 py-3 font-semibold" style={{ background: NUIT, color: IVOIRE }}>Voir le Kindle</a>
            <a href="https://www.amazon.fr/dp/B0HRVVYL49" target="_blank" rel="noopener noreferrer" className="rounded-xl border-2 px-5 py-3 font-semibold" style={{ borderColor: NUIT }}>Voir le broché</a>
          </div>
        </div>
      </div>
    </Section>

    <Section>
      <H2>Méthode classique ou EbookStudio ?</H2>
      <div className="overflow-x-auto"><table className="w-full text-left">
        <thead><tr className="border-b" style={{ borderColor: 'rgba(255,255,255,.2)' }}><th className="p-4"></th><th className="p-4">Méthode classique</th><th className="p-4" style={{ color: OR }}>EbookStudio</th></tr></thead>
        <tbody>{[['Rédaction', 'Des mois, seul', 'Accompagnée, chapitre par chapitre'], ['Couverture', 'Graphiste à payer', 'Studio inclus (dès Auteur)'], ['Mise en page KDP', 'À faire soi-même', 'Fichiers prêts'], ['Budget', 'Plusieurs centaines d’euros par livre', 'Dès 19 €/mois']].map(r =>
          <tr key={r[0]} className="border-b" style={{ borderColor: 'rgba(255,255,255,.1)' }}><td className="p-4 font-semibold">{r[0]}</td><td className="p-4 opacity-75">{r[1]}</td><td className="p-4 font-semibold">{r[2]}</td></tr>)}</tbody>
      </table></div>
    </Section>

    <section id="formules" className="dark v3-plans-dark px-4 py-16"><div className="mx-auto max-w-7xl">
      <H2>Choisissez votre formule</H2>
      <V3PricingOverview detailsHref="/v3-premium#studios" />
    </div></section>

    <Section light>
      <H2>Questions fréquentes</H2>
      <div className="mx-auto max-w-3xl space-y-3">
        {faq.map(([q, a]) => <details key={q} className="rounded-xl p-5 shadow" style={{ background: "#fff", color: NUIT }}><summary className="cursor-pointer text-lg font-semibold">{q}</summary><p className="mt-3">{a}</p></details>)}
      </div>
    </Section>

    <Section>
      <div className="text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl" style={{ color: "inherit" }}>Votre livre mérite d’exister</h2>
        <p className="mb-8 text-lg opacity-90">Après votre inscription, réservez votre séance d’accueil de 30 minutes avec Georges pour bien démarrer.</p>
        <Cta label="Je commence maintenant" />
      </div>
    </Section>
  </main>;
}

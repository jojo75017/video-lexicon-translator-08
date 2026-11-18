import V3PricingOverview from '@/components/v3public/V3PricingOverview';
import { usePageMeta } from '@/hooks/usePageMeta';
import mockup from '@/assets/vente-mockup-3d.jpg';
import cuervo from '@/assets/vente-el-cuervo.jpg';

/* Page de vente longue façon Book Machine : police droite, contrastes francs. */
const NUIT = '#0b1120', NUIT2 = '#111a2e', OR = '#ff9e2d', BLANC = '#fefefe', ENCRE = '#0f172a', GRIS = '#334155';
const FONT = { fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif', fontStyle: 'normal' as const };

type C = { children: React.ReactNode };
const Cta = ({ label = 'Je choisis ma formule' }: { label?: string }) => (
  <a href="#formules" className="inline-block rounded-xl px-8 py-4 text-lg font-extrabold shadow-xl transition hover:scale-105" style={{ background: OR, color: NUIT, ...FONT }}>{label} →</a>
);
const Dark = ({ children }: C) => <section className="px-5 py-20" style={{ background: NUIT, color: BLANC }}><div className="mx-auto max-w-6xl">{children}</div></section>;
const Light = ({ children }: C) => <section className="px-5 py-20" style={{ background: BLANC, color: ENCRE }}><div className="mx-auto max-w-6xl">{children}</div></section>;
const Kicker = ({ children }: C) => <div className="mb-3 text-center text-sm font-bold uppercase tracking-widest" style={{ color: OR, ...FONT }}>{children}</div>;
const H2 = ({ children }: C) => <h2 className="mx-auto mb-6 max-w-4xl text-center text-3xl font-extrabold leading-tight md:text-5xl" style={{ color: 'inherit', ...FONT }}>{children}</h2>;
const Lead = ({ children, dark }: C & { dark?: boolean }) => <div className="mx-auto mb-12 max-w-3xl text-center text-lg md:text-xl" style={{ color: dark ? '#e2e8f0' : GRIS, ...FONT }}>{children}</div>;
const H3 = ({ children, color }: C & { color?: string }) => <h3 className="mb-2 text-xl font-bold" style={{ color: color ?? 'inherit', ...FONT }}>{children}</h3>;
const P = ({ children, dark }: C & { dark?: boolean }) => <div className="text-base leading-relaxed" style={{ color: dark ? '#e2e8f0' : GRIS, ...FONT }}>{children}</div>;

const douleurs = [
  ['😩 La page blanche', 'Vous avez l’idée depuis des années, mais vous ne savez pas par où commencer.'],
  ['⏳ Des mois perdus', 'Écriture, relecture, mise en page : 6 mois de travail en moyenne, souvent abandonnés en route.'],
  ['💸 Une facture salée', 'Correcteur, graphiste, maquettiste : comptez 1 500 € à 3 000 € pour un seul livre.'],
  ['❌ Le refus d’Amazon', 'Une marge mal réglée, un dos de couverture faux d’un millimètre, et le fichier est rejeté.'],
  ['🌀 Les incohérences', 'Avec les IA classiques : chapitres qui se répètent, personnages qui changent, « Acte I » oubliés dans le texte.'],
  ['🧩 Trop d’outils', 'ChatGPT, Canva, DeepL, un formateur… quatre abonnements pour un résultat bricolé.'],
];
const etapes = [
  ['1', 'Votre idée', 'Un titre, un thème ou trois lignes suffisent. Vous choisissez le genre : roman, guide, jeunesse, BD…'],
  ['2', 'Une rédaction cohérente', 'Chapitre par chapitre, avec une mémoire de l’histoire et un nettoyage automatique des répétitions et des scories.'],
  ['3', 'Une couverture pro', 'Studio Couvertures au format KDP, dos et quatrième calculés, puis mockups 3D pour vos réseaux.'],
  ['4', 'La publication Amazon', 'Fichiers Kindle et broché, fiche Amazon (description, mots-clés, catégories) et checklist pas à pas.'],
];
const publics = [
  ['Les débutants', 'Vous rêvez d’écrire votre premier livre mais vous n’avez jamais osé.'],
  ['Les romanciers', 'Vous voulez aller plus vite sans perdre la cohérence de votre intrigue.'],
  ['Les experts', 'Coachs, formateurs, artisans : transformez votre savoir en guide publié.'],
  ['Les éditeurs KDP', 'Vous publiez régulièrement et cherchez un atelier complet et fiable.'],
];
const atouts = [
  ['Écriture blindée', 'Notre moteur éditorial retire les « Acte », « Partie » et répétitions, et interdit les découvertes rejouées d’un chapitre à l’autre.'],
  ['Mockups 3D intégrés', 'Votre livre posé sur une vraie table en bois ou un bureau : des visuels prêts pour Amazon et Facebook.'],
  ['Audio et voix off', 'Transformez vos textes en livre audio avec des voix naturelles (dès la formule Auteur).'],
  ['Traduction multilingue', 'Vendez sur tous les marchés Amazon : texte et couverture traduits.'],
  ['100 % vos droits', 'Vous publiez sous votre nom et vous gardez toutes vos redevances.'],
  ['Vos clés IA', 'Utilisez vos clés gratuites ou celles que vous avez déjà : meilleure qualité, aucun frais caché.'],
];
const comparatif = [
  ['Temps pour sortir un livre', '6 mois et plus', 'Quelques jours'],
  ['Coût correction + couverture', '1 500 € à 3 000 €', 'Inclus dès 19 €/mois'],
  ['Couverture au format KDP', 'Graphiste à payer', 'Calcul automatique'],
  ['Cohérence des chapitres', 'Relecture manuelle', 'Mémoire + nettoyage auto'],
  ['Fiche Amazon et mots-clés', 'À faire seul', 'Préparés pour vous'],
  ['Accompagnement', 'Aucun', 'Séance d’accueil de 30 min'],
];
const faq = [
  ['Faut-il savoir écrire ?', 'Non. Vous apportez l’idée, EbookStudio vous accompagne à chaque étape et vous gardez la main sur chaque chapitre.'],
  ['Amazon accepte-t-il les livres créés avec l’IA ?', 'Oui. Amazon demande simplement de déclarer l’usage de l’IA au moment de la publication.'],
  ['À qui appartiennent mes livres ?', 'À vous, entièrement. Vous publiez sous votre nom et touchez vos redevances.'],
  ['Pourquoi mettre mes propres clés ?', 'Avec vos clés gratuites (ou celles que vous avez déjà), les résultats sont bien meilleurs. Nous vous montrons comment faire lors de la séance d’accueil.'],
  ['Puis-je arrêter quand je veux ?', 'Oui, les formules mensuelles sont sans engagement.'],
  ['Faut-il installer un logiciel ?', 'Non, tout fonctionne dans votre navigateur, sur ordinateur ou tablette.'],
  ['Comment publier sur Amazon ?', 'EbookStudio prépare vos fichiers et votre fiche, et une checklist vous guide jusqu’à la mise en ligne.'],
];

export default function FormulesPubliquesPage() {
  usePageMeta({ title: 'EbookStudio — Écrivez et publiez votre livre sur Amazon', description: 'De l’idée au livre publié sur Amazon KDP : rédaction cohérente, couverture, mockups 3D. Formules dès 19 €/mois, sans engagement.' });
  return <main className="min-h-screen" style={{ background: NUIT, color: BLANC, ...FONT }}>
    {/* HERO */}
    <section className="px-5 pb-20 pt-16" style={{ background: `radial-gradient(circle at 70% 20%, #1e3a5f 0%, ${NUIT} 60%)` }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <span className="mb-5 inline-block rounded-full px-4 py-1.5 text-sm font-bold" style={{ background: OR, color: NUIT }}>✨ L’atelier français pour publier sur Amazon KDP</span>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl" style={FONT}>Créez, publiez et générez un revenu avec des livres IA, <span style={{ color: OR }}>même si vous n’avez jamais écrit une ligne de votre vie</span></h1>
          <div className="mb-4 text-xl font-semibold leading-relaxed" style={{ color: BLANC }}>L’intelligence artificielle fait 90 % du travail à votre place et Amazon se charge de vendre vos livres pendant que vous dormez.</div>
          <div className="mb-8 text-lg leading-relaxed" style={{ color: '#e2e8f0' }}>La méthode complète pas à pas pour transformer une simple idée en livre publié et en source de revenus durable.</div>
          <Cta />
          <div className="mt-6 grid gap-2 text-base font-semibold" style={{ color: BLANC }}>
            <div>✅ Paiement sécurisé Stripe</div><div>✅ Sans engagement, dès 19 €/mois</div><div>✅ Séance d’accueil de 30 min avec Georges</div>
          </div>
        </div>
        <img src={mockup} alt="Livre EbookStudio présenté en mockup 3D" className="w-full rounded-3xl shadow-2xl" width={1080} height={1080} />
      </div>
    </section>

    {/* TOUT A CHANGÉ */}
    <Dark>
      <Kicker>Une époque totalement folle</Kicker>
      <H2>Aujourd’hui, tout a changé avec l’intelligence artificielle</H2>
      <Lead dark>Pour la première fois dans l’histoire, une personne ordinaire peut créer un livre de manière beaucoup plus simple… et surtout infiniment plus rapide qu’avant (vraiment… c’est le jour et la nuit). Ce qui demandait autrefois des mois, parfois des années, peut aujourd’hui avancer à une vitesse complètement différente.</Lead>
      <Lead dark>Pourquoi ? Parce qu’avec les bons outils, la bonne méthode et les bonnes étapes, l’intelligence artificielle permet d’accélérer tout ce qui bloquait la majorité des gens.</Lead>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        {['Trouver une idée porteuse','Valider un sujet avant de perdre du temps','Structurer un plan clair','Rédiger beaucoup plus vite','Améliorer le style','Rendre le texte plus humain','Créer une couverture convaincante','Mettre le livre en page','Le publier sur Amazon','Et recommencer avec d’autres livres'].map((t, i) => <div key={t} className="rounded-2xl p-5 text-center" style={{ background: NUIT2, border: '1px solid #334155' }}>
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full font-extrabold" style={{ background: OR, color: NUIT }}>{i + 1}</div>
          <div className="text-base font-bold" style={{ color: BLANC, ...FONT }}>{t}</div></div>)}
      </div>
    </Dark>

    {/* DOULEUR */}
    <Light>
      <Kicker>Le vrai problème</Kicker>
      <H2>Pourquoi 9 livres sur 10 ne voient jamais le jour</H2>
      <Lead>Ce n’est pas un manque de talent. C’est un parcours semé d’obstacles que personne ne vous explique.</Lead>
      <div className="grid gap-6 md:grid-cols-3">
        {douleurs.map(([t, d]) => <div key={t} className="rounded-2xl border-2 p-7" style={{ borderColor: '#e2e8f0', background: '#f8fafc' }}><H3 color={ENCRE}>{t}</H3><P>{d}</P></div>)}
      </div>
    </Light>

    {/* SOLUTION */}
    <Dark>
      <Kicker>La solution</Kicker>
      <H2>EbookStudio : votre maison d’édition en 4 étapes</H2>
      <Lead dark>Un seul atelier remplace le correcteur, le graphiste, le maquettiste et les quatre abonnements.</Lead>
      <div className="grid gap-6 md:grid-cols-2">
        {etapes.map(([n, t, d]) => <div key={n} className="flex gap-5 rounded-2xl p-7" style={{ background: NUIT2, border: '1px solid #334155' }}>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl font-extrabold" style={{ background: OR, color: NUIT }}>{n}</div>
          <div><H3 color={BLANC}>{t}</H3><P dark>{d}</P></div></div>)}
      </div>
      <div className="mt-12 text-center"><Cta label="Je commence mon livre" /></div>
    </Dark>

    {/* POUR QUI */}
    <Light>
      <Kicker>Pour qui ?</Kicker>
      <H2>EbookStudio est fait pour vous si…</H2>
      <div className="mt-10 grid gap-6 md:grid-cols-4">
        {publics.map(([t, d]) => <div key={t} className="rounded-2xl p-7 shadow-lg" style={{ background: BLANC, borderTop: `5px solid #008296` }}><H3 color="#008296">{t}</H3><P>{d}</P></div>)}
      </div>
    </Light>

    {/* ATOUTS */}
    <Dark>
      <Kicker>Exclusivités</Kicker>
      <H2>Ce que vous ne trouverez nulle part ailleurs</H2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {atouts.map(([t, d]) => <div key={t} className="rounded-2xl p-7" style={{ background: NUIT2, border: '1px solid #334155' }}><H3 color={OR}>✓ {t}</H3><P dark>{d}</P></div>)}
      </div>
    </Dark>

    {/* PREUVE */}
    <Light>
      <div className="grid items-center gap-12 md:grid-cols-2">
        <img src={cuervo} alt="Le Fils d’El Cuervo, roman publié avec EbookStudio" className="w-full rounded-3xl shadow-2xl" loading="lazy" />
        <div>
          <div className="mb-3 text-sm font-bold uppercase tracking-widest" style={{ color: OR }}>Preuve réelle</div>
          <h2 className="mb-5 text-3xl font-extrabold md:text-4xl" style={{ color: ENCRE, ...FONT }}>« Le Fils d’El Cuervo » : un vrai roman, en vente sur Amazon</h2>
          <P>241 pages, publié en Kindle et en broché, accepté par Amazon. Rédigé, mis en page et habillé avec EbookStudio.</P>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="https://www.amazon.fr/dp/B0HLL8PZB6" target="_blank" rel="noopener noreferrer" className="rounded-xl px-6 py-3 font-bold" style={{ background: ENCRE, color: BLANC }}>Voir le Kindle</a>
            <a href="https://www.amazon.fr/dp/B0HRVVYL49" target="_blank" rel="noopener noreferrer" className="rounded-xl border-2 px-6 py-3 font-bold" style={{ borderColor: ENCRE, color: ENCRE }}>Voir le broché</a>
          </div>
        </div>
      </div>
    </Light>

    {/* COMPARATIF */}
    <Dark>
      <Kicker>Comparez</Kicker>
      <H2>Méthode classique ou EbookStudio ?</H2>
      <div className="mt-10 overflow-x-auto rounded-2xl" style={{ background: BLANC }}>
        <table className="w-full text-left text-base" style={{ color: ENCRE, ...FONT }}>
          <thead><tr style={{ background: '#f1f5f9' }}><th className="p-5"></th><th className="p-5 font-bold">Méthode classique</th><th className="p-5 font-extrabold" style={{ color: '#008296' }}>EbookStudio</th></tr></thead>
          <tbody>{comparatif.map(([l, a, b]) => <tr key={l} className="border-t" style={{ borderColor: '#e2e8f0' }}>
            <td className="p-5 font-bold">{l}</td><td className="p-5" style={{ color: '#b91c1c' }}>✗ {a}</td><td className="p-5 font-semibold" style={{ color: '#047857' }}>✓ {b}</td></tr>)}</tbody>
        </table>
      </div>
    </Dark>

    {/* TARIFS */}
    <section id="formules" className="px-5 py-20" style={{ background: NUIT2, color: BLANC }}>
      <div className="mx-auto max-w-6xl">
        <Kicker>Nos formules</Kicker>
        <H2>Choisissez votre formule</H2>
        <Lead dark>Starter 19 €, Auteur 29 €, Édition 59 € par mois. Sans engagement. Séance d’accueil de 30 minutes offerte.</Lead>
        <V3PricingOverview />
      </div>
    </section>

    {/* FAQ */}
    <Light>
      <Kicker>Questions fréquentes</Kicker>
      <H2>Vous vous demandez sûrement…</H2>
      <div className="mx-auto mt-10 max-w-3xl space-y-4">
        {faq.map(([q, r]) => <details key={q} className="rounded-2xl border-2 p-6" style={{ borderColor: '#e2e8f0', background: BLANC }}>
          <summary className="cursor-pointer text-lg font-bold" style={{ color: ENCRE }}>{q}</summary>
          <div className="mt-3"><P>{r}</P></div></details>)}
      </div>
    </Light>

    {/* CTA FINAL */}
    <Dark>
      <div className="text-center">
        <H2>Votre livre mérite d’exister. Commencez aujourd’hui.</H2>
        <Lead dark>Choisissez votre formule, puis réservez votre séance d’accueil de 30 minutes : nous configurons ensemble vos clés et lançons votre premier livre.</Lead>
        <Cta label="Je publie mon livre" />
      </div>
    </Dark>
  </main>;
}

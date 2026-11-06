import V3PricingOverview from '@/components/v3public/V3PricingOverview';
import { usePageMeta } from '@/hooks/usePageMeta';
import imgEcriture from '@/assets/commence-ici-hero.jpg';
import imgCouv from '@/assets/cover-studio-hero.jpg';
import imgIllu from '@/assets/ebook-illustre-hero.jpg';
import imgBd from '@/assets/bd-studio-hero.jpg';
import imgKdp from '@/assets/kdp-hero.jpg';
import imgTuto from '@/assets/tutoriels-hero-v2.jpg';

const C = { bg: '#0b1120', card: '#131c2e', teal: '#2dd4bf', orange: '#ff9e2d', text: '#f5f5f5', muted: '#cbd5e1' };

const CALENDLY_URL = 'https://calendly.com/pro-georgesboubet/30min';
const AUTHOR_AMAZON_URL = 'https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7';

// Les 8 vraies couvertures de Georges Boubet, publiées sur Amazon KDP
// (les mêmes que la section « 8 couvertures publiées » de l'accueil abonné).
const COVERS = [
  'https://m.media-amazon.com/images/I/918zLvnFYpL._SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71F5oIMMJhL._SL1499_.jpg',
  'https://m.media-amazon.com/images/I/71bx0hCAteL._SL1499_.jpg',
  'https://m.media-amazon.com/images/I/71Nx8sX+yKL._SL1499_.jpg',
  'https://m.media-amazon.com/images/I/81TDpyFFJRL._SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71M9vInJYiL._SL1499_.jpg',
  'https://m.media-amazon.com/images/I/71dtOsRjyFL._SL1329_.jpg',
  'https://m.media-amazon.com/images/I/71XFHkhKPyL._SL1491_.jpg',
];

type Studio = {
  t: string;
  d: string;
  img: string;
  alt: string;
  acces: string;
};

const studios: Studio[] = [
  {
    t: "L'atelier d'écriture et les spécialistes IA",
    acces: 'Inclus dès la formule Débutant',
    img: imgEcriture,
    alt: "L'atelier d'écriture EbookStudio avec ses spécialistes IA",
    d: "Vous partez d'une idée, d'un sommaire ou d'une histoire racontée à voix haute. Les spécialistes IA vous aident à construire le plan, puis à rédiger chapitre par chapitre : romans, guides pratiques et 17 genres spéciaux (cuisine, voyage, coloriage, documentaire, jeux, atlas, journal intime…). Chaque texte reste le vôtre : vous relisez, corrigez et validez avant d'exporter. La mise en page est préparée pour vous, avec des exports PDF, Word et EPUB prêts à retravailler. Les formules Débutant et Auteur incluent un volume mensuel de livres et de couvertures ; la formule Édition VIP lève la limite de livres.",
  },
  {
    t: 'Le studio couverture Kindle et broché',
    acces: 'Kindle dès Débutant · broché complet en Édition VIP',
    img: imgCouv,
    alt: 'Le studio de couverture Kindle et broché EbookStudio',
    d: "Une couverture se joue à quelques centimètres près : le studio calcule le dos et la tranche selon le nombre de pages et le type de papier, place vos textes et vos images, puis génère des fichiers aux dimensions attendues par Amazon KDP. La couverture Kindle est accessible dans toutes les formules, dans la limite du nombre de couvertures inclus chaque mois. Le studio broché complet — tranche, quatrième de couverture, PDF haute définition 300 DPI — est réservé à la formule Édition VIP. Vous gardez la main sur chaque élément : titre, auteur, image, couleurs et ajustements.",
  },
  {
    t: 'Les ateliers illustrés',
    acces: 'Guides illustrés dès Auteur · album jeunesse en Édition VIP',
    img: imgIllu,
    alt: 'Les ateliers de livres illustrés EbookStudio',
    d: "Certains livres vivent par l'image : guides pratiques illustrés pour adultes, eBook illustré construit scène après scène, et album jeunesse pour les 3–6 ans avec une histoire unique suivie page après page. Les illustrations sont générées dans l'atelier ou choisies parmi des banques d'images libres de droits, puis insérées dans votre livre avec leur légende. Les guides illustrés et l'eBook illustré sont accessibles dès la formule Auteur ; le studio Album illustré jeunesse est réservé à la formule Édition VIP. Comme pour le texte, vous validez chaque visuel avant l'export final.",
  },
  {
    t: 'BD Studio et VC Books',
    acces: 'Dès la formule Auteur',
    img: imgBd,
    alt: 'Le studio de bandes dessinées et les VC Books EbookStudio',
    d: "La bande dessinée demande un découpage particulier : le studio vous aide à transformer votre histoire en scénario, puis en planches, case par case, avec des personnages cohérents d'une page à l'autre. Les VC Books, ces petits livres humoristiques à offrir, suivent un parcours dédié : création du livre, illustrations et couverture, puis fiche de préparation KDP. Ces deux ateliers sont accessibles dès la formule Auteur. Là encore, rien ne part sans vous : vous relisez le scénario, ajustez les dialogues et validez chaque planche avant de préparer votre publication.",
  },
  {
    t: 'Traduction multilingue et audio',
    acces: 'Traduction 10 langues dès Débutant · 15 langues et audio en Édition VIP',
    img: imgKdp,
    alt: 'Le traducteur multilingue et le studio audio EbookStudio',
    d: "Un livre peut vivre dans plusieurs langues : le traducteur reprend votre manuscrit — importé depuis un fichier ou choisi dans votre bibliothèque — et le traduit avec sa couverture, en préparant les repères utiles pour les marchés Amazon concernés. Les formules Débutant et Auteur traduisent en 10 langues ; la formule Édition VIP en propose 15, dont le coréen, le turc, le vietnamien et le thaïlandais. Le studio audio, réservé à l'Édition VIP, transforme vos textes en livres audio et voix off. Chaque traduction et chaque enregistrement se relit et se réécoute avant publication.",
  },
  {
    t: 'La préparation Amazon KDP',
    acces: 'Outils de base dès Débutant · outils éditeur en Édition VIP',
    img: imgTuto,
    alt: "La boîte à outils de préparation Amazon KDP d'EbookStudio",
    d: "Publier sur Amazon KDP demande de la méthode : choisir les bonnes catégories, trouver les mots-clés que tapent vraiment les lecteurs, soigner la description et vérifier son livre avant l'envoi. La boîte à outils rassemble l'analyse des catégories, la recherche de mots-clés, l'audit avant publication et un plan de lancement construit à partir de votre livre. Les outils de base sont inclus dès la formule Débutant ; les outils d'éditeur comme Amazon Spy sont réservés à l'Édition VIP. EbookStudio prépare votre publication : c'est vous qui la validez et la publiez sur votre compte KDP.",
  },
];

const cadeaux = [
  {
    e: '🎓',
    t: "L'Académie : 25 tutoriels pas-à-pas",
    d: "Créer son premier livre, réussir ses couvertures et préparer sa publication Amazon, sans jargon. Disponibles à tout moment dans votre espace, dès la connexion.",
  },
  {
    e: '🧰',
    t: 'La boîte à outils Amazon KDP',
    d: "Analyse des catégories, recherche de mots-clés et audit avant publication. Ces outils font partie de votre formule : vous les retrouvez dans votre espace, sans rien installer.",
  },
  {
    e: '📞',
    t: 'Un appel de 30 min avec Georges',
    d: "Pour faire le point sur votre premier projet et lever vos blocages. Sur rendez-vous, selon les disponibilités : la réservation se fait en ligne depuis votre espace.",
    lien: CALENDLY_URL,
  },
  {
    e: '📚',
    t: "La banque d'idées et les 17 genres prêts",
    d: "Des idées de livres et des parcours guidés pour démarrer dès le premier jour, directement dans l'atelier d'écriture de votre espace.",
  },
];

const faq = [
  ["Amazon accepte-t-il les livres écrits avec l'IA ?", "Amazon demande de déclarer l'usage de l'IA lors de la publication, et la décision finale d'acceptation appartient toujours à Amazon. Vous restez l'auteur : vous relisez, ajustez et validez chaque contenu avant de le publier."],
  ['Puis-je résilier quand je veux ?', "Oui, les formules sont sans engagement et se résilient depuis votre espace. L'accès reste ouvert jusqu'à la fin du mois payé."],
  ['À qui appartiennent mes livres ?', 'À vous : textes, couvertures et redevances Amazon.'],
  ['Comment je profite des ressources incluses ?', "Après le paiement, vous recevez votre code d'accès par email. Les tutoriels, les outils KDP et la banque d'idées vous attendent dans votre espace. L'appel avec Georges se réserve en ligne, sur rendez-vous, selon les disponibilités."],
  ["L'IA écrit-elle toute seule à ma place ?", "L'IA vous aide à structurer et à rédiger, mais vous gardez la main : vous relisez, corrigez et validez chaque chapitre. EbookStudio ne publie rien à votre place."],
  ['Faut-il installer un logiciel ?', 'Non, tout fonctionne dans le navigateur, sur ordinateur ou tablette.'],
  ["Je suis débutant, est-ce pour moi ?", 'Oui. Les tutoriels et les parcours guidés vous accompagnent étape par étape.'],
  ['Les anciens clients V2 gardent-ils leurs accès ?', 'Oui, la V2 reste accessible jusqu’au 31 décembre 2027 et les droits acquis sont conservés.'],
  ['Puis-je changer de formule ?', 'Oui, vous pouvez passer à une formule supérieure à tout moment.'],
];

const Btn = ({ children }: { children: React.ReactNode }) => (
  <a href="#formules" className="inline-block rounded-xl px-8 py-4 text-lg font-bold" style={{ background: C.orange, color: '#111827' }}>{children}</a>
);

export default function V3PremiumVentePage() {
  usePageMeta({ title: 'EbookStudio V3 Premium — créez et publiez vos livres avec l’IA', description: 'Écrivez, illustrez, traduisez et préparez vos livres pour Amazon KDP. Ressources incluses dans chaque formule. Dès 19 €/mois, sans engagement.' });
  return (
    <main className="dark v3-plans-dark min-h-screen" style={{ background: C.bg, color: C.text }}>
      {/* Héro : les 8 vraies couvertures publiées de Georges */}
      <section className="px-4 pt-16 pb-12 text-center" style={{ background: 'radial-gradient(circle at 50% 0%, #134e4a 0%, #0b1120 65%)' }}>
        <p className="font-semibold tracking-widest uppercase mb-4" style={{ color: C.teal }}>EbookStudio V3 Premium</p>
        <h1 className="mx-auto max-w-4xl text-4xl md:text-6xl font-extrabold leading-tight">Créez, illustrez et publiez vos livres sur Amazon KDP grâce à l'IA</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg" style={{ color: C.muted }}>Vos idées et votre style, sans compétence graphique, en respectant les règles KDP. Un seul atelier pour écrire, illustrer, traduire et préparer votre publication.</p>
        <div className="mt-8"><Btn>Découvrir les formules — dès 19 €/mois</Btn></div>
        <p className="mt-4 text-sm" style={{ color: C.muted }}>Kindle et broché · Sans engagement · Assistance en français · Ressources incluses dans chaque formule</p>
        <div className="mx-auto mt-10 max-w-5xl">
          <div className="grid grid-cols-4 gap-3 md:gap-4">
            {COVERS.map((src, i) => (
              <a
                key={src}
                href={AUTHOR_AMAZON_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-xl transition-transform hover:-translate-y-1"
                style={{ border: '1px solid #1f2a44', boxShadow: '0 12px 28px -14px rgba(0,0,0,.8)' }}
                title={`Livre ${i + 1} de Georges Boubet sur Amazon`}
              >
                <img
                  src={src}
                  alt={`Couverture du livre ${i + 1} de Georges Boubet, créée avec EbookStudio et publiée sur Amazon KDP`}
                  loading="lazy"
                  className="aspect-[2/3] w-full object-cover"
                />
              </a>
            ))}
          </div>
          <p className="mt-4 text-sm" style={{ color: C.muted }}>
            Des livres de Georges Boubet, écrits et mis en page avec les ateliers que vous avez sous la main —{' '}
            <a href={AUTHOR_AMAZON_URL} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: C.teal }}>
              voir la page auteur Amazon
            </a>
          </p>
        </div>
      </section>

      {/* Introduction éditoriale : d'une idée à un livre */}
      <section className="px-4 py-14 mx-auto max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center">D'une idée à un livre prêt pour Amazon</h2>
        <div className="mt-6 space-y-4 text-lg leading-relaxed" style={{ color: C.muted }}>
          <p>
            Tout commence par une idée : un roman qui vous trotte dans la tête, un savoir-faire à transmettre,
            une histoire à raconter aux enfants. Ensuite, la réalité reprend ses droits — la page blanche,
            la mise en page, la couverture aux bonnes dimensions, les catégories Amazon à choisir.
          </p>
          <p>
            EbookStudio V3 rassemble ces étapes dans un seul atelier : écrire avec l'aide de spécialistes IA,
            créer la couverture Kindle ou broché, illustrer, traduire, puis préparer sereinement votre
            publication KDP. L'IA vous aide à aller plus vite ; vous restez l'auteur, et c'est vous qui
            relisez, validez et publiez chaque livre sur votre propre compte Amazon.
          </p>
        </div>
      </section>

      {/* Constat */}
      <section className="px-4 py-14 mx-auto max-w-6xl grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-8" style={{ background: '#2a1215', border: '1px solid #7f1d1d' }}>
          <h2 className="text-2xl font-bold mb-4">❌ Écrire seul en 2026</h2>
          <ul className="space-y-2" style={{ color: C.muted }}>
            <li>Des semaines bloqué devant la page blanche</li><li>Des heures de marges sous Word</li><li>Des couvertures refusées par Amazon</li><li>Plusieurs abonnements à payer en parallèle</li>
          </ul>
        </div>
        <div className="rounded-2xl p-8" style={{ background: '#0f2a2a', border: `1px solid ${C.teal}` }}>
          <h2 className="text-2xl font-bold mb-4">✅ Avec EbookStudio V3</h2>
          <ul className="space-y-2" style={{ color: C.muted }}>
            <li>Des spécialistes IA qui vous guident du plan au manuscrit</li><li>Des exports au format KDP</li><li>Des couvertures Kindle et broché</li><li>Traduction, audio et outils Amazon au même endroit</li>
          </ul>
        </div>
      </section>

      {/* Les 6 ateliers : sections alternées texte / visuel */}
      <section id="studios" className="px-4 py-14 mx-auto max-w-6xl">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-4">Tout ce qu'il faut, dans un seul atelier</h2>
        <p className="text-center mb-12" style={{ color: C.muted }}>Six ateliers qui se suivent, de la première idée à la préparation de votre publication.</p>
        <div className="space-y-12">
          {studios.map((s, i) => (
            <article
              key={s.t}
              className={`flex flex-col gap-6 md:items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <img
                src={s.img}
                alt={s.alt}
                loading="lazy"
                className="w-full md:w-2/5 h-52 md:h-64 object-cover rounded-2xl"
                style={{ border: '1px solid #1f2a44' }}
              />
              <div className="flex-1 rounded-2xl p-6 md:p-8" style={{ background: C.card, border: '1px solid #1f2a44' }}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: C.orange }}>{s.acces}</p>
                <h3 className="mt-2 text-2xl font-bold" style={{ color: C.teal }}>{s.t}</h3>
                <p className="mt-3 leading-relaxed" style={{ color: C.muted }}>{s.d}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Ressources incluses (ex-cadeaux, sans valorisation barrée) */}
      <section className="px-4 py-14 mx-auto max-w-5xl">
        <div className="rounded-3xl p-8 md:p-12" style={{ background: 'linear-gradient(135deg,#1f1a0b,#131c2e)', border: `2px solid ${C.orange}` }}>
          <p className="text-center font-bold uppercase tracking-widest" style={{ color: C.orange }}>🎁 Inclus dans votre espace</p>
          <h2 className="text-center text-3xl md:text-4xl font-bold mt-2 mb-8">Le pack de démarrage « Auteur KDP »</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {cadeaux.map((c) => (
              <div key={c.t} className="rounded-2xl p-6" style={{ background: C.card }}>
                <div className="text-3xl">{c.e}</div>
                <h3 className="mt-2 text-lg font-bold">{c.t}</h3>
                <p className="mt-1" style={{ color: C.muted }}>{c.d}</p>
                {c.lien ? (
                  <a href={c.lien} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold underline" style={{ color: C.teal }}>
                    Réserver mon appel (sur rendez-vous, selon les disponibilités)
                  </a>
                ) : null}
              </div>
            ))}
          </div>
          <p className="text-center mt-8" style={{ color: C.muted }}>
            Les tutoriels, les outils et la banque d'idées vous attendent dans votre espace dès la connexion.
            L'appel avec Georges se réserve en ligne, sur rendez-vous, selon les disponibilités.
          </p>
          <div className="text-center mt-6"><Btn>Choisir ma formule</Btn></div>
        </div>
      </section>

      {/* Formules */}
      <section id="formules" className="px-4 py-14 mx-auto max-w-7xl">
        <h2 className="text-center text-3xl md:text-4xl font-bold">Choisissez votre formule</h2>
        <p className="text-center mt-2" style={{ color: C.muted }}>Sans engagement · le pack de démarrage inclus dans chaque formule</p>
        <V3PricingOverview detailsHref="#studios" kdpPilotPlanLabel="Débutant" />
      </section>

      {/* FAQ */}
      <section className="px-4 py-14 mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold mb-8">Questions fréquentes</h2>
        <div className="space-y-3">
          {faq.map(([q, a]) => (
            <details key={q} className="rounded-xl p-5" style={{ background: C.card, border: '1px solid #1f2a44' }}>
              <summary className="cursor-pointer font-semibold" style={{ color: C.text }}>{q}</summary>
              <p className="mt-3" style={{ color: C.muted }}>{a}</p>
            </details>
          ))}
        </div>
        <div className="text-center mt-10"><Btn>Je commence maintenant</Btn></div>
      </section>

      <footer className="px-4 py-8 text-center text-sm" style={{ color: C.muted, borderTop: '1px solid #1f2a44' }}>
        <a href="/mentions-legales" className="mx-2 underline">Mentions légales</a>
        <a href="/cgv" className="mx-2 underline">CGV</a>
        <a href="/confidentialite" className="mx-2 underline">Confidentialité</a>
        <a href="/assistance" className="mx-2 underline">Assistance</a>
      </footer>
    </main>
  );
}

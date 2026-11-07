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
    acces: 'Écriture guidée dès Débutant · narration et livres spéciaux dès Auteur',
    img: imgEcriture,
    alt: "L'atelier d'écriture EbookStudio avec ses spécialistes IA",
    d: "Dès Débutant, vous partez d'une idée ou de votre sommaire pour construire le plan et rédiger chapitre par chapitre. Dès Auteur, vous retrouvez également « Je raconte un livre » et les 17 genres spéciaux : cuisine, voyage, coloriage, documentaire, jeux, atlas, journal intime… Chaque texte reste sous votre contrôle : vous relisez, corrigez et validez avant d'exporter. La mise en page est préparée avec des exports PDF, Word et EPUB prêts à retravailler. Débutant et Auteur proposent un volume mensuel de livres et de couvertures ; Édition VIP propose les livres illimités, sous réserve des limites techniques et du fournisseur IA.",
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

// Valeurs habituelles validées par Georges (06/11/2026) : 67 + 47 + 97 + 27 = 238 €
const cadeaux = [
  {
    e: '🎓',
    t: "L'Académie : 25 tutoriels pas-à-pas",
    d: "Créer son premier livre, réussir ses couvertures et préparer sa publication Amazon, sans jargon. Les guides pas-à-pas sont accessibles après activation de votre abonnement ; les vidéos non encore publiées sont indiquées « à venir prochainement ».",
    v: '67 €',
  },
  {
    e: '🧰',
    t: 'La boîte à outils Amazon KDP',
    d: "Analyse des catégories, recherche de mots-clés et audit avant publication. Ces outils font partie de votre formule : vous les retrouvez dans votre espace, sans rien installer.",
    v: '47 €',
  },
  {
    e: '📞',
    t: 'Un appel de 30 min avec Georges',
    d: "Pour faire le point sur votre premier projet et lever vos blocages. Sur rendez-vous, selon les disponibilités : la réservation se fait en ligne depuis votre espace.",
    lien: CALENDLY_URL,
    v: '97 €',
  },
  {
    e: '📚',
    t: "La banque d'idées et les 17 genres prêts",
    d: "Des idées de livres et des parcours guidés pour démarrer dès le premier jour, directement dans l'atelier d'écriture de votre espace.",
    v: '27 €',
  },
];

const VALEUR_TOTALE_PACK = '238 €';

const faq = [
  ["Amazon accepte-t-il les livres écrits avec l'IA ?", "Amazon KDP distingue le contenu généré par l'IA du contenu simplement assisté par l'IA. Vous devez déclarer les textes, images ou traductions générés par l'IA lors de la publication, même si vous les avez ensuite modifiés. Consultez les règles KDP en vigueur : la décision finale d'acceptation appartient toujours à Amazon. EbookStudio vous laisse la main à chaque étape : vous relisez, ajustez et vérifiez les droits et la conformité de vos textes et couvertures avant de les envoyer. Aucun outil ne garantit l'acceptation ni les ventes d'un livre."],
  ['Puis-je résilier quand je veux ?', "Oui, toutes les formules sont sans engagement. La résiliation se fait directement depuis votre espace, en quelques clics, sans avoir à écrire à personne. Votre accès reste ouvert jusqu'à la fin du mois déjà payé, et vous pouvez reprendre une formule plus tard si vous le souhaitez. En cas d'impayé, l'accès est simplement mis en pause : vous le retrouvez tel quel dès le règlement, sans rien perdre de vos livres."],
  ['À qui appartiennent mes livres ?', "EbookStudio ne revendique aucun droit sur vos œuvres et ne prend aucune commission sur vos ventes Amazon. Vous publiez sur votre propre compte KDP et recevez les redevances directement d'Amazon. Vous devez néanmoins vérifier les droits sur les textes et les images utilisés, respecter les licences des banques d'images et les conditions de vos fournisseurs IA. La protection d'un contenu généré par IA dépend aussi du droit applicable et de votre contribution humaine ; l'outil ne garantit pas des droits exclusifs sur tout résultat."],
  ['Comment je profite des ressources incluses ?', "Après confirmation du paiement et activation de votre compte, votre code d'accès personnel est envoyé par email. Connectez-vous pour retrouver les guides des 25 tutoriels, les outils KDP de votre formule et la banque d'idées. Les vidéos déjà publiées sont accessibles ; les autres portent la mention « à venir prochainement ». Avec votre abonnement actif, l'appel de 30 minutes avec Georges est inclus et se réserve en ligne, sur rendez-vous et selon les disponibilités. Un lien public seul n'active aucun accès à vos ateliers."],
  ["L'IA écrit-elle toute seule à ma place ?", "Non, et c'est volontaire. L'IA vous aide à structurer votre livre, à rédiger des propositions de chapitres et à débloquer la page blanche, mais vous gardez la main sur tout : vous choisissez le sujet, vous validez le plan, vous relisez et corrigez chaque chapitre avant l'export. EbookStudio ne publie jamais rien à votre place — la publication se fait par vous, depuis votre compte Amazon KDP. C'est cette relecture humaine qui fait la différence entre un livre jetable et un livre dont vous êtes fier."],
  ['Ai-je besoin de ma propre clé IA ?', "Oui : préparez VOS propres clés Gemini et OpenAI, ainsi qu'OpenRouter pour les ateliers concernés. Vous les créez sur vos comptes fournisseurs et les renseignez sur la page « Clés API » dans le navigateur utilisé. Chaque atelier indique le fournisseur nécessaire ; le Studio Pro hybride utilise Gemini et OpenAI pour des rôles distincts. Sans la clé personnelle nécessaire, la rédaction ne démarre pas : la clé de Georges ne remplace jamais la vôtre. Les éventuels frais du fournisseur sont à votre charge, distincts de l'abonnement EbookStudio. Google propose certains modèles avec un niveau gratuit limité, pas une génération gratuite illimitée. Les quotas de votre formule restent applicables même avec votre clé. Le guide explique où créer et coller chaque clé."],
  ['Faut-il installer un logiciel ?', "Non, tout fonctionne dans votre navigateur, sur ordinateur ou tablette. Il n'y a rien à télécharger, rien à mettre à jour et aucune compétence technique à avoir. Vous vous connectez avec votre code, et vous retrouvez vos livres, vos couvertures et vos outils exactement où vous les aviez laissés, quel que soit l'appareil utilisé."],
  ["Je suis débutant, est-ce pour moi ?", "Oui, l'atelier a été pensé pour les personnes qui n'ont jamais publié. Les parcours sont guidés étape par étape : on vous pose des questions simples, et l'outil s'occupe de la partie technique (mise en page, dimensions de couverture, formats d'export). Les 25 tutoriels reprennent chaque étape en français, sans jargon, et l'assistance répond en français si vous êtes bloqué. La formule Débutant à 19 €/mois est précisément faite pour démarrer sans risque."],
  ['Que contient exactement chaque formule ?', "Débutant (19 €/mois) : 20 livres et 10 couvertures par mois, l'écriture guidée, les exports PDF/Word/EPUB, les outils KDP de base et la traduction en 10 langues. Auteur (29 €/mois) : tout Débutant, plus 50 livres et 30 couvertures par mois, « Je raconte un livre », la BD, les livres spéciaux, la correction éditoriale et HumanizeAI. Édition VIP (59 €/mois) : tout Auteur, plus les livres illimités, 50 couvertures par mois, le studio couverture broché complet, l'album jeunesse, l'audio et Amazon Spy. Chaque formule inclut tout le contenu des précédentes."],
  ['Les anciens clients V2 gardent-ils leurs accès ?', "Oui, absolument. Tous les droits acquis sont conservés : les formules à vie restent valables à vie, et la V2 reste accessible jusqu'au 31 décembre 2027. Les anciens clients bénéficient en plus d'un tarif fidélité de -20 % à vie sur les nouvelles formules mensuelles, réservé à leur compte. Aucun nouvel achat n'est obligatoire pour continuer à utiliser ce qui a déjà été payé."],
  ['Puis-je changer de formule ?', "Oui, vous pouvez passer à une formule supérieure à tout moment depuis votre espace, par exemple commencer à 19 € puis monter à 29 € quand vos besoins grandissent. Le changement prend effet immédiatement et vos livres, couvertures et réglages vous suivent. Vous pouvez aussi revenir à une formule inférieure ou résilier, toujours sans engagement."],
  ['Que se passe-t-il juste après mon paiement ?', "Le paiement se fait sur une page sécurisée Stripe : utilisez les moyens de paiement qui y sont réellement affichés, selon votre pays, appareil et formule. Vous revenez ensuite sur la page Merci. L'accès est activé après confirmation du paiement, puis le code personnel est envoyé par email ; pensez aux indésirables. Une simple visite de la page Merci ne prouve pas un paiement et ne donne aucun droit. Si vous n'êtes pas connecté, utilisez le code reçu pour accéder à votre espace ; contactez l'assistance si le message n'arrive pas."],
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

      {/* Cadeaux inclus : titre, utilité, valeur barrée, mention OFFERT et total du pack */}
      <section className="px-4 py-14 mx-auto max-w-5xl">
        <div className="rounded-3xl p-8 md:p-12" style={{ background: 'linear-gradient(135deg,#1f1a0b,#131c2e)', border: `2px solid ${C.orange}` }}>
          <p className="text-center font-bold uppercase tracking-widest" style={{ color: C.orange }}>🎁 Inclus dans votre espace</p>
          <h2 className="text-center text-3xl md:text-4xl font-bold mt-2 mb-8">Le pack de démarrage « Auteur KDP »</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {cadeaux.map((c) => (
              <div key={c.t} className="rounded-2xl p-6 flex flex-col" style={{ background: C.card }}>
                <div className="text-3xl">{c.e}</div>
                <h3 className="mt-2 text-lg font-bold">{c.t}</h3>
                <p className="mt-1" style={{ color: C.muted }}>{c.d}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="text-lg line-through" style={{ color: C.muted }}>{c.v}</span>
                  <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide" style={{ background: C.orange, color: '#111827' }}>
                    Offert avec votre abonnement — 0 € supplémentaire
                  </span>
                </div>
                {c.lien ? (
                  <a href={c.lien} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold underline" style={{ color: C.teal }}>
                    Réserver mon appel (sur rendez-vous, selon les disponibilités)
                  </a>
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl px-6 py-5 text-center" style={{ background: 'rgba(255,158,45,0.12)', border: `1px solid ${C.orange}` }}>
            <p className="text-xl md:text-2xl font-bold">
              Valeur totale du pack : <span className="line-through" style={{ color: C.muted }}>{VALEUR_TOTALE_PACK}</span>
            </p>
            <p className="mt-1 text-lg font-bold" style={{ color: C.orange }}>Inclus dans votre abonnement</p>
          </div>
          <p className="text-center mt-6" style={{ color: C.muted }}>
            Les guides, les outils de votre formule et la banque d'idées sont accessibles après activation de votre abonnement. Les vidéos non encore disponibles sont annoncées à venir.
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

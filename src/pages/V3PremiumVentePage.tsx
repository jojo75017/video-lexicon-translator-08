import V3PricingOverview from '@/components/v3public/V3PricingOverview';
import { usePageMeta } from '@/hooks/usePageMeta';
import hero from '@/assets/commander-hero-books.jpg';
import imgEcriture from '@/assets/commence-ici-hero.jpg';
import imgCouv from '@/assets/cover-studio-hero.jpg';
import imgIllu from '@/assets/ebook-illustre-hero.jpg';
import imgBd from '@/assets/bd-studio-hero.jpg';
import imgKdp from '@/assets/kdp-hero.jpg';
import imgTuto from '@/assets/tutoriels-hero-v2.jpg';

const C = { bg: '#0b1120', card: '#131c2e', teal: '#2dd4bf', orange: '#ff9e2d', text: '#f5f5f5', muted: '#cbd5e1' };

const studios = [
  { t: "L'atelier d'écriture et les spécialistes IA", d: "Romans, guides pratiques ou « Je raconte mon livre » avec Camille. 17 genres spéciaux : cuisine, voyage, coloriage, documentaire, jeux…", img: imgEcriture },
  { t: 'Le studio couverture Kindle et broché', d: "Dos et tranche calculés selon le nombre de pages et le papier. Fichiers prêts pour l'impression Amazon.", img: imgCouv },
  { t: 'Les ateliers illustrés', d: 'Album jeunesse 3–6 ans, guides illustrés pour adultes, eBook illustré scène après scène.', img: imgIllu },
  { t: 'BD Studio et VC Books', d: 'Bandes dessinées, mangas et livres humoristiques, de la planche à la fiche KDP.', img: imgBd },
  { t: 'Traducteur multilingue et audio', d: 'Votre livre et sa couverture en 10 à 15 langues, et vos textes en livres audio.', img: imgKdp },
  { t: 'La boîte à outils Amazon KDP', d: 'Catégories, mots-clés Amazon, audit avant publication et plan de lancement.', img: imgTuto },
];

const cadeaux = [
  { e: '🎓', t: "L'Académie : 25 tutoriels pas-à-pas", d: 'Créer son premier livre, réussir ses couvertures et publier sur Amazon, sans jargon.', v: '67 €' },
  { e: '🧰', t: 'La boîte à outils Amazon KDP', d: 'Analyse des catégories, mots-clés Amazon et audit avant publication.', v: '47 €' },
  { e: '📞', t: 'Un appel de 30 min avec Georges', d: 'Pour faire le point sur votre premier projet et lever vos blocages.', v: '97 €' },
  { e: '📚', t: "La banque d'idées et 17 genres prêts", d: 'Des idées de livres et des modèles pour démarrer dès le premier jour.', v: '27 €' },
];

const faq = [
  ["Amazon accepte-t-il les livres écrits avec l'IA ?", "Oui. Amazon demande de déclarer l'usage de l'IA lors de la publication. Vous restez l'auteur : vous relisez, ajustez et validez."],
  ['Puis-je résilier quand je veux ?', 'Oui, les formules sont sans engagement et se résilient depuis votre espace.'],
  ['À qui appartiennent mes livres ?', 'À vous : textes, couvertures et redevances Amazon.'],
  ['Comment je reçois mes cadeaux ?', "Après le paiement, vous recevez votre code d'accès par email. Les cadeaux sont débloqués dans votre espace dès la connexion."],
  ['Faut-il installer un logiciel ?', 'Non, tout fonctionne dans le navigateur, sur ordinateur ou tablette.'],
  ["Je suis débutant, est-ce pour moi ?", 'Oui. Les tutoriels et les parcours guidés vous accompagnent étape par étape.'],
  ['Les anciens clients V2 gardent-ils leurs accès ?', 'Oui, la V2 reste accessible jusqu’au 31 décembre 2027.'],
  ["Puis-je changer de formule ?", 'Oui, vous pouvez passer à une formule supérieure à tout moment.'],
];

const Btn = ({ children }: { children: React.ReactNode }) => (
  <a href="#formules" className="inline-block rounded-xl px-8 py-4 text-lg font-bold" style={{ background: C.orange, color: '#111827' }}>{children}</a>
);

export default function V3PremiumVentePage() {
  usePageMeta({ title: 'EbookStudio V3 Premium — créez et publiez vos livres avec l’IA', description: 'Écrivez, illustrez, traduisez et publiez vos livres sur Amazon KDP. 4 cadeaux offerts. Dès 19 €/mois, sans engagement.' });
  return (
    <main className="dark v3-plans-dark min-h-screen" style={{ background: C.bg, color: C.text }}>
      <section className="px-4 pt-16 pb-12 text-center" style={{ background: 'radial-gradient(circle at 50% 0%, #134e4a 0%, #0b1120 65%)' }}>
        <p className="font-semibold tracking-widest uppercase mb-4" style={{ color: C.teal }}>EbookStudio V3 Premium</p>
        <h1 className="mx-auto max-w-4xl text-4xl md:text-6xl font-extrabold leading-tight">Créez, illustrez et publiez vos livres sur Amazon KDP grâce à l'IA</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg" style={{ color: C.muted }}>Vos idées et votre style, sans compétence graphique, en respectant les règles KDP. Un seul atelier pour écrire, illustrer, traduire et publier.</p>
        <div className="mt-8"><Btn>Découvrir les formules — dès 19 €/mois</Btn></div>
        <p className="mt-4 text-sm" style={{ color: C.muted }}>Kindle et broché · Sans engagement · Assistance en français · 🎁 4 cadeaux offerts</p>
        <img src={hero} alt="Livres créés avec EbookStudio" className="mx-auto mt-10 w-full max-w-5xl rounded-2xl shadow-2xl" />
      </section>

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

      <section className="px-4 py-14 mx-auto max-w-6xl">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-10">Tout ce qu'il faut, dans un seul atelier</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map((s) => (
            <article key={s.t} className="rounded-2xl overflow-hidden" style={{ background: C.card, border: '1px solid #1f2a44' }}>
              <img src={s.img} alt={s.t} loading="lazy" className="w-full h-44 object-cover" />
              <div className="p-6"><h3 className="text-xl font-bold mb-2" style={{ color: C.teal }}>{s.t}</h3><p style={{ color: C.muted }}>{s.d}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 py-14 mx-auto max-w-5xl">
        <div className="rounded-3xl p-8 md:p-12" style={{ background: 'linear-gradient(135deg,#1f1a0b,#131c2e)', border: `2px solid ${C.orange}` }}>
          <p className="text-center font-bold uppercase tracking-widest" style={{ color: C.orange }}>🎁 Offert avec votre abonnement</p>
          <h2 className="text-center text-3xl md:text-4xl font-bold mt-2 mb-8">Le pack de démarrage « Auteur KDP »</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {cadeaux.map((c, i) => (
              <div key={c.t} className="rounded-2xl p-6" style={{ background: C.card }}>
                <div className="text-3xl">{c.e}</div>
                <h3 className="mt-2 text-lg font-bold">Cadeau {i + 1} : {c.t}</h3>
                <p className="mt-1" style={{ color: C.muted }}>{c.d}</p>
                <p className="mt-2 text-sm font-semibold" style={{ color: C.orange }}>Valeur {c.v} — offert</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8" style={{ color: C.muted }}>Débloqués automatiquement dans votre espace dès votre inscription.</p>
          <div className="text-center mt-6"><Btn>Débloquer mes accès et mes cadeaux</Btn></div>
        </div>
      </section>

      <section id="formules" className="px-4 py-14 mx-auto max-w-7xl">
        <h2 className="text-center text-3xl md:text-4xl font-bold">Choisissez votre formule</h2>
        <p className="text-center mt-2" style={{ color: C.muted }}>Sans engagement · les 4 cadeaux inclus dans chaque formule</p>
        <V3PricingOverview />
      </section>

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

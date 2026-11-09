import { Link } from 'react-router-dom';
import { ArrowRight, Gift } from 'lucide-react';

const CALENDLY_URL = 'https://calendly.com/pro-georgesboubet/30min';

// Valeurs habituelles validées par Georges (06/11/2026) : 67 + 47 + 97 + 27 = 238 €
const CADEAUX = [
  { e: '🎓', t: "L'Académie : 25 tutoriels pas-à-pas", d: 'Les vidéos et guides écrits, de la première idée à la publication Amazon. Les vidéos non encore publiées arrivent prochainement.', v: '67 €', to: '/v3/tutoriels-v3', cta: 'Ouvrir les tutoriels' },
  { e: '🧰', t: 'La boîte à outils Amazon KDP', d: 'Catégories, mots-clés, fiche Amazon et audit avant publication, réunis dans votre Espace KDP.', v: '47 €', to: '/v3/kdp', cta: "Ouvrir l'Espace KDP" },
  { e: '📞', t: 'Un appel de 30 min avec Georges', d: 'Pour faire le point sur votre projet et lever vos blocages. Sur rendez-vous, selon les disponibilités.', v: '97 €', href: CALENDLY_URL, cta: 'Réserver mon appel' },
  { e: '📚', t: "La banque d'idées et les 17 genres prêts", d: "Des idées de livres et des parcours guidés pour démarrer dès aujourd'hui dans l'atelier d'écriture.", v: '27 €', to: '/v3/lancer', cta: "Ouvrir l'atelier d'écriture" },
];

export default function V3CadeauxPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 text-foreground">
      <div className="mb-8 rounded-2xl border border-border bg-card p-6 text-center">
        <Gift className="mx-auto h-10 w-10 text-primary" />
        <h1 className="mt-3 text-3xl font-bold">Votre pack de bienvenue</h1>
        <p className="mt-2 text-muted-foreground">Merci pour votre abonnement ! Vos 4 cadeaux sont inclus, sans rien payer de plus.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {CADEAUX.map((c) => {
          const btn = 'mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground';
          return (
            <div key={c.t} className="flex flex-col rounded-2xl border border-border bg-card p-5">
              <div className="text-3xl">{c.e}</div>
              <h2 className="mt-2 text-lg font-bold">{c.t}</h2>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{c.d}</p>
              <p className="mt-3 text-sm"><span className="line-through text-muted-foreground">{c.v}</span> <span className="ml-2 font-bold text-primary">OFFERT avec votre abonnement</span></p>
              {c.href ? (
                <a href={c.href} target="_blank" rel="noopener noreferrer" className={btn}>{c.cta} <ArrowRight className="h-4 w-4" /></a>
              ) : (
                <Link to={c.to!} className={btn}>{c.cta} <ArrowRight className="h-4 w-4" /></Link>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-center font-semibold">Valeur totale du pack : <span className="line-through text-muted-foreground">238 €</span> · Inclus dans votre abonnement</p>
    </div>
  );
}

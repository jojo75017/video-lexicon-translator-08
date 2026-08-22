const FAQ = [
  {
    q: 'Est-ce que ça marche dans mon domaine ?',
    a: "Si vous avez un savoir qu'une personne accepterait de lire dans un livre — coaching, santé, cuisine, finances, développement personnel, roman, jeunesse — oui. L'atelier s'adapte au sujet que vous donnez.",
  },
  {
    q: "Je n'écris pas bien. C'est un problème ?",
    a: "Non. Vous parlez, vous dictez ou vous écrivez en vrac. Vos idées sont reprises, structurées et corrigées, mais elles restent les vôtres : vous gardez un onglet « mes mots d'origine » pour comparer à tout moment.",
  },
  {
    q: 'Faut-il déjà avoir une audience ?',
    a: "Non. Votre livre publié sur Amazon est justement ce qui vous rend visible. Les mots-clés et les catégories fournis par l'atelier sont là pour que des lecteurs vous trouvent sans que vous ayez une liste d'emails.",
  },
  {
    q: "C'est de l'IA : Amazon l'accepte ?",
    a: "Oui. Amazon KDP demande simplement de déclarer l'usage d'outils d'IA lors de la publication, et le contenu doit respecter ses règles de qualité. C'est exactement ce que la correction éditoriale en 4 relectures sert à garantir.",
  },
  {
    q: 'Combien de temps pour avoir mon livre ?',
    a: "Ça dépend de la longueur. Un livre court se termine en quelques soirées ; un livre de 20 à 30 chapitres demande plutôt une à deux semaines, en validant le plan puis les chapitres au fil de l'eau.",
  },
  {
    q: 'Est-ce que je peux modifier ce qui est écrit ?',
    a: "Oui, tout. Chaque chapitre est éditable directement dans l'atelier, avant et après correction. Rien n'est verrouillé.",
  },
  {
    q: "C'est un abonnement ?",
    a: "Non. À 47 €, c'est un paiement unique et l'accès reste à vous. La V3 lancée le 1er octobre est incluse. Après le 31 août, l'accès ne sera plus disponible qu'en abonnement mensuel.",
  },
  {
    q: 'Et si ça ne me convient pas ?',
    a: "Vous m'écrivez un email dans les 30 jours et je vous rembourse intégralement, sans justification à donner.",
  },
];

export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

/** Bloc « Questions fréquentes » du long format. */
export default function MethodeFaq() {
  return (
    <section className="ds-section mx-auto max-w-4xl px-5">
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--ds-gold)]">Questions fréquentes</p>
      <h2 className="mt-3 text-2xl font-bold md:text-3xl">Ce qu'on me demande le plus souvent.</h2>
      <div className="mt-8 space-y-3">
        {FAQ.map((f) => (
          <details key={f.q} className="group ds-card p-5">
            <summary className="cursor-pointer list-none font-bold text-[var(--ds-text)]">
              {f.q}
              <span
                className="float-right transition group-open:rotate-45"
                style={{ color: 'var(--ds-gold)' }}
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ds-text-muted)]">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

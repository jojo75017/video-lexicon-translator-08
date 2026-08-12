import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import AssistantChat from '@/components/assistant/AssistantChat';
import { ASSISTANT_FAQ } from '@/data/assistantKnowledge';

/** Assistant public : répond gratuitement et oriente vers la bonne page. */
const AssistantPublicPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Assistant IA Ebookstudio — posez votre question sur l'édition KDP</title>
        <meta
          name="description"
          content="Assistant IA gratuit : niches Amazon, mots-clés, structure de livre, correction, export KDP, couvertures. Réponse en quelques lignes et accès direct au bon outil."
        />
        <link rel="canonical" href="https://ebookstudio.fr/assistant" />
      </Helmet>

      <section className="max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Gratuit, sans inscription
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight mb-4">
            Toutes vos questions sur l'édition, une réponse et le bon outil
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Écriture, correction, couverture, export Word/PDF, mots-clés Amazon, forfaits : l'assistant
            répond en quelques lignes et vous emmène directement là où ça se passe.
          </p>

          <div className="grid gap-2">
            {ASSISTANT_FAQ.slice(0, 8).map((f) => (
              <div key={f.id} className="rounded-xl border bg-card p-3">
                <p className="text-sm font-semibold text-foreground">{f.question}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {f.actions.map((a) => (
                    <Link
                      key={a.route + a.label}
                      to={a.route}
                      className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11.5px] font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition"
                    >
                      {a.label} <ArrowRight className="w-3 h-3" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <AssistantChat variant="page" />
        </div>
      </section>
    </div>
  );
};

export default AssistantPublicPage;

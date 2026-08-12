import { Helmet } from 'react-helmet';
import AssistantChat from '@/components/assistant/AssistantChat';
import V3JourneyTiles from '@/components/v3/V3JourneyTiles';
import { ASSISTANT_FAQ } from '@/data/assistantKnowledge';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BackButton from '@/components/v3/BackButton';

/** Assistant IA de l'espace abonné : réponse + bouton vers le bon onglet. */
const V3AssistantPage = () => {
  return (
    <div className="container max-w-6xl py-6 space-y-8">
      <Helmet>
        <title>Assistant Ebookstudio — trouvez le bon outil en une question</title>
        <meta
          name="description"
          content="Posez votre question sur la création de livre, la correction, l'export KDP, les couvertures ou les mots-clés Amazon : l'assistant répond et ouvre le bon outil."
        />
      </Helmet>

      <BackButton />

      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Assistant Ebookstudio</h1>
        <p className="text-muted-foreground max-w-2xl">
          Une question, une réponse claire, et le bouton qui ouvre directement l'onglet concerné.
        </p>
      </header>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
        <AssistantChat variant="page" />

        <div className="space-y-6">
          <V3JourneyTiles title="Les onglets du parcours" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">Réponses immédiates</h2>
            <div className="grid gap-2">
              {ASSISTANT_FAQ.map((f) => (
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
          </section>
        </div>
      </div>
    </div>
  );
};

export default V3AssistantPage;

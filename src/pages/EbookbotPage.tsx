import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Target, Zap, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import EbookbotChat from '@/components/ebookbot/EbookbotChat';

const EbookbotPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      <Helmet>
        <title>EBOOKBOT — Ton copilote IA pour réussir sur Amazon KDP | EbookStudio</title>
        <meta name="description" content="EBOOKBOT, l'assistant IA gratuit qui te guide sur Amazon KDP : niches rentables, mots-clés, structure d'ebook, marketing et lancement. Réponses en 3 secondes." />
        <link rel="canonical" href="https://www.ebookstudio.fr/ebookbot" />
      </Helmet>

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/offres" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Retour aux offres
          </Link>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-500/10 text-orange-700">100% GRATUIT</span>
        </div>
      </header>

      {/* Hero + Chat */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left: pitch */}
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold mb-5">
              <Sparkles className="w-3.5 h-3.5" /> NOUVEAU — Assistant IA intégré
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">
              Rencontre <span className="text-orange-600">EBOOKBOT</span>,<br/>
              ton copilote KDP <span className="inline-block">🚀</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              L'assistant intelligent qui t'accompagne à chaque étape de ton succès KDP.
            </p>

            <div className="space-y-3 mb-8">
              {[
                { icon: MessageCircle, title: 'Conseils personnalisés', desc: 'Réponses instantanées adaptées à ta situation' },
                { icon: Target, title: 'Toujours pertinent', desc: 'Expert KDP, écriture, marketing & support outil' },
                { icon: Zap, title: 'Ultra-rapide', desc: 'Obtiens des réponses en 3-5 lignes, claires et actionnables' },
              ].map(f => (
                <Card key={f.title} className="p-4 border-2 hover:border-orange-300 transition-colors">
                  <div className="flex gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm mb-0.5">{f.title}</h3>
                      <p className="text-xs text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2 border-t">
              <div>
                <div className="text-2xl font-extrabold text-orange-600">10k+</div>
                <div className="text-[11px] text-muted-foreground">Questions / semaine</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-orange-600">3s</div>
                <div className="text-[11px] text-muted-foreground">Temps de réponse</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-orange-600">4,8/5</div>
                <div className="text-[11px] text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right: live chat */}
          <div className="md:sticky md:top-24">
            <EbookbotChat variant="page" />
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-foreground">Ce que tu peux demander à EBOOKBOT</h2>
        <p className="text-center text-muted-foreground mb-10 text-sm">4 domaines d'expertise, des milliers de cas d'usage</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { emoji: '🎯', title: 'Expert KDP', items: ['Choix de niche & BSR', 'Mots-clés titre + 7 backend', '2 catégories optimales', 'Stratégie de prix'] },
            { emoji: '✍️', title: 'Écriture & structure', items: ['Idées d\'ebooks', 'Plan en 8-12 chapitres', 'Hook d\'introduction', 'Conclusion qui vend'] },
            { emoji: '📈', title: 'Marketing', items: ['Description Amazon HEAL', 'Séquences emails', 'Posts Pinterest/Insta', 'Stratégie de lancement'] },
            { emoji: '🛠️', title: 'Support EbookStudio', items: ['Workflow 15 agents', 'Studio Couverture IA', 'Génération audio', 'Module formation'] },
          ].map(c => (
            <Card key={c.title} className="p-5 border-2 hover:border-orange-300 transition-colors">
              <div className="text-3xl mb-2">{c.emoji}</div>
              <h3 className="font-bold text-foreground mb-3">{c.title}</h3>
              <ul className="space-y-1.5">
                {c.items.map(i => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                    <span className="text-orange-500">✓</span> {i}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EbookbotPage;

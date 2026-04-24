import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Download, Check, Chrome, Sparkles, ArrowLeft, Zap, Eye, Target, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ExtensionChromePage = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    fetch('/ebookstudio-scanner.zip')
      .then(res => {
        if (!res.ok) throw new Error('Téléchargement impossible');
        return res.blob();
      })
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'ebookstudio-scanner.zip';
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch(err => alert(err.message))
      .finally(() => setDownloading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-teal-50">
      <Helmet>
        <title>Extension Chrome KDP — Score de niche Amazon en 1 clic | EbookStudio</title>
        <meta name="description" content="Scanne n'importe quelle page Amazon Kindle : score de niche /100, ventes estimées, concurrence et verdict GO/À éviter. Extension Chrome 100% gratuite." />
        <link rel="canonical" href="https://www.ebookstudio.fr/extension-chrome" />
      </Helmet>

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/offres" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Retour aux offres
          </Link>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">100% GRATUIT</span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" /> NOUVEAU — Extension Chrome
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-5 leading-tight">
          Tu passes encore des heures à<br/>
          <span className="bg-gradient-to-r from-orange-500 to-teal-600 bg-clip-text text-transparent">chercher une niche rentable ?</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-3 font-medium">C'est terminé.</p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          L'extension <strong>EbookStudio Scanner</strong> t'ouvre Amazon, tu cliques, et tu sais instantanément si la niche vaut le coup.
        </p>

        <Button size="lg" onClick={handleDownload} disabled={downloading} className="text-lg px-8 py-6 bg-gradient-to-r from-orange-500 to-teal-600 hover:from-orange-600 hover:to-teal-700 text-white shadow-xl">
          <Download className="w-5 h-5 mr-2" />
          {downloading ? 'Téléchargement…' : "Télécharger l'extension (gratuit)"}
        </Button>
        <p className="text-xs text-muted-foreground mt-3">Compatible Chrome, Edge, Brave, Opera • 17 Ko • Aucune inscription</p>
      </section>

      {/* What you see */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="text-center mb-3">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-3">✨ NOUVEAU v1.1 — Mode Niche + Mots-clés + Historique</span>
        </div>
        <h2 className="text-3xl font-bold text-center mb-3 text-foreground">6 super-pouvoirs pour scanner Amazon Kindle</h2>
        <p className="text-center text-muted-foreground mb-10">Bien plus qu'un simple badge : un vrai outil d'analyse de niche</p>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Target, title: 'Score de niche /100', desc: 'Évaluation calculée sur BSR + prix + concurrence avec verdict GO / À creuser / À éviter' },
            { icon: Eye, title: 'Ventes estimées', desc: 'Estimation des ventes/jour et /mois selon le BSR Amazon en temps réel' },
            { icon: ShieldCheck, title: 'Analyse Top 10 + Pépites 💎', desc: 'Sur une page de recherche : score moyen de la niche + livres à fort potentiel surlignés en vert' },
            { icon: Sparkles, title: 'Extraction mots-clés', desc: 'Détecte automatiquement les mots-clés principaux + longue traîne du livre, copie en 1 clic' },
            { icon: Download, title: 'Historique + Export CSV', desc: 'Garde les 30 derniers scans, ré-ouvre un livre en 1 clic, exporte tout en CSV' },
            { icon: Zap, title: 'Multi-marketplaces', desc: 'Compatible Amazon FR, COM, UK, DE, ES, IT — un seul outil pour tous les marchés' },
          ].map(f => (
            <Card key={f.title} className="p-5 border-2 hover:border-primary transition-colors">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-teal-100 mb-3">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-1.5">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Mockup */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2">
          <div className="text-xs text-muted-foreground mb-3">Aperçu du badge sur une fiche Amazon :</div>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 relative min-h-[280px]">
            <div className="text-xs text-slate-400 italic">… page Amazon Kindle …</div>
            {/* Mock badge */}
            <div className="absolute top-4 right-4 w-72 bg-white rounded-xl shadow-2xl border overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-teal-600 text-white px-3 py-2 text-xs font-semibold flex justify-between">
                <span>📚 EbookStudio</span><span className="opacity-70">×</span>
              </div>
              <div className="p-3 flex items-center gap-3">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex flex-col items-center justify-center">
                  <div className="text-xl font-extrabold text-foreground">82</div>
                  <div className="text-[9px] text-muted-foreground">/100</div>
                </div>
                <div className="flex-1 bg-emerald-500 text-white p-2 rounded-lg text-center text-xs font-bold">🚀 GO</div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 px-3 pb-3">
                <div className="bg-slate-50 p-2 rounded"><div className="text-[9px] uppercase text-muted-foreground">Ventes/jour</div><b className="text-sm">~60</b></div>
                <div className="bg-slate-50 p-2 rounded"><div className="text-[9px] uppercase text-muted-foreground">Ventes/mois</div><b className="text-sm">~1 800</b></div>
                <div className="bg-slate-50 p-2 rounded"><div className="text-[9px] uppercase text-muted-foreground">Concurrence</div><b className="text-sm text-emerald-600">Faible</b></div>
                <div className="bg-slate-50 p-2 rounded"><div className="text-[9px] uppercase text-muted-foreground">BSR</div><b className="text-sm">#4 820</b></div>
              </div>
              <div className="bg-slate-900 text-white text-center py-2.5 text-xs font-semibold">Analyse complète sur EbookStudio →</div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
            <Chrome className="w-6 h-6 text-primary" /> Installation en 4 étapes
          </h2>
          <ol className="space-y-4">
            {[
              <>Télécharge l'extension via le bouton ci-dessus puis <b>dézippe</b> le fichier <code className="bg-muted px-1.5 py-0.5 rounded text-xs">ebookstudio-scanner.zip</code></>,
              <>Ouvre Chrome (ou Edge / Brave) et va sur <code className="bg-muted px-1.5 py-0.5 rounded text-xs">chrome://extensions</code></>,
              <>Active le <b>Mode développeur</b> (interrupteur en haut à droite)</>,
              <>Clique sur <b>« Charger l'extension non empaquetée »</b> et sélectionne le dossier dézippé</>,
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{i + 1}</div>
                <div className="text-sm text-foreground leading-relaxed pt-0.5">{step}</div>
              </li>
            ))}
          </ol>
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex gap-3">
            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-emerald-900">
              <b>C'est tout !</b> Va sur amazon.fr / .com / .co.uk, ouvre une fiche livre Kindle, le badge apparaît automatiquement.
            </div>
          </div>
        </Card>
      </section>

      {/* CTA Final */}
      <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
        <Card className="p-10 bg-gradient-to-br from-orange-500 to-teal-600 text-white border-0">
          <h2 className="text-3xl font-bold mb-3">Tu veux aller plus loin ?</h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            Avec un abonnement EbookStudio (67€/an), tu débloques l'analyse complète : mots-clés concurrents, insights clients, opportunités cachées, génération d'ebook IA en 47 minutes.
          </p>
          <Link to="/offres">
            <Button size="lg" variant="secondary" className="text-base">
              Découvrir EbookStudio Pro →
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
};

export default ExtensionChromePage;

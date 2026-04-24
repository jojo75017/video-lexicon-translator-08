import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Download, Check, ArrowLeft, Zap, Target, ShieldCheck, BarChart3, Crosshair, Gift, Rocket, TrendingUp, Star, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const features = [
    { icon: Target, title: 'Score de niche /100', desc: 'Notation instantanée du potentiel commercial de chaque livre Kindle scanné.' },
    { icon: TrendingUp, title: 'Ventes & revenus estimés', desc: 'Calcul automatique du chiffre d\'affaires mensuel à partir du BSR Amazon.' },
    { icon: BarChart3, title: 'Analyse IA des avis', desc: 'Synthèse en 30 secondes des forces, faiblesses et opportunités des concurrents.' },
    { icon: Crosshair, title: 'Mots-clés gagnants', desc: 'Extraction automatique des keywords des best-sellers de la niche.' },
    { icon: ShieldCheck, title: 'Verdict GO / À éviter', desc: 'Recommandation claire pour décider en 5 secondes si la niche vaut le coup.' },
    { icon: Zap, title: 'Analyse en 1 clic', desc: 'Aucune configuration. Ouvrez Amazon, cliquez, obtenez le verdict.' },
  ];

  const stats = [
    { value: '< 3s', label: 'Temps d\'analyse' },
    { value: '100%', label: 'Gratuit' },
    { value: '0€', label: 'Sans CB' },
    { value: '4.8★', label: 'Satisfaction' },
  ];

  const steps = [
    { num: '01', title: 'Téléchargez le ZIP', desc: 'Cliquez sur le bouton ci-dessus pour récupérer l\'extension (200 ko).' },
    { num: '02', title: 'Activez le mode développeur', desc: 'Dans Chrome → chrome://extensions → activez "Mode développeur" en haut à droite.' },
    { num: '03', title: 'Chargez l\'extension', desc: 'Cliquez sur "Charger l\'extension non empaquetée" puis sélectionnez le dossier dézippé.' },
    { num: '04', title: 'Scannez Amazon', desc: 'Ouvrez n\'importe quelle fiche Kindle. L\'analyse apparaît automatiquement.' },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <Helmet>
        <title>Extension Chrome KDP — Scanner Amazon Kindle gratuit | EbookStudio</title>
        <meta name="description" content="Scanne n'importe quelle page Amazon Kindle : score de niche /100, ventes estimées, concurrence et verdict GO/À éviter. Extension Chrome 100% gratuite." />
        <link rel="canonical" href="https://www.ebookstudio.fr/extension-chrome" />
      </Helmet>

      {/* Header */}
      <header className="border-b-2 border-black/5 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/offres" className="flex items-center gap-2 text-sm font-semibold text-black/60 hover:text-black transition">
            <ArrowLeft className="w-4 h-4" /> Retour aux offres
          </Link>
          <span className="text-xs font-black px-3 py-1.5 rounded-full bg-orange-500 text-white uppercase tracking-wider">
            ⚡ 100% Gratuit
          </span>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden">
        {/* Decorative orange shapes */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texte gauche */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border-2 border-orange-200 mb-6">
                <Rocket className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-black text-orange-700 uppercase tracking-wider">EbookStudio Scanner • v1.0</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 text-black">
                Scanne Amazon
                <br />
                <span className="text-orange-500">en 1 clic.</span>
              </h1>

              <p className="text-xl text-black/70 leading-relaxed mb-8 max-w-xl">
                Score de niche, ventes estimées, concurrence, mots-clés gagnants. 
                Tout ce dont tu as besoin pour valider une idée de livre Kindle, 
                <span className="text-orange-600 font-bold"> directement sur la page Amazon.</span>
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  onClick={handleDownload}
                  disabled={downloading}
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-7 rounded-xl shadow-[0_8px_30px_rgba(249,115,22,0.4)] hover:shadow-[0_12px_40px_rgba(249,115,22,0.5)] transition-all hover:-translate-y-0.5 border-0"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {downloading ? 'Téléchargement…' : 'Télécharger gratuitement'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-black bg-white text-black hover:bg-black hover:text-white font-bold text-lg px-8 py-7 rounded-xl transition"
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Voir la démo
                </Button>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-black/60">
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-orange-500" /> Sans carte bancaire</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-orange-500" /> Installation 30s</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-orange-500" /> Chrome, Edge, Brave</span>
              </div>
            </div>

            {/* Mockup droite : extension popup en CSS */}
            <div className="relative">
              <div className="absolute -inset-6 bg-orange-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-black rounded-2xl p-6 shadow-2xl border-4 border-black">
                {/* Browser bar */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="ml-3 flex-1 bg-white/10 rounded-md px-3 py-1 text-xs text-white/60">
                    amazon.fr/kindle-store
                  </div>
                </div>

                {/* Scanner card */}
                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                      <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-black">EBOOKSTUDIO SCANNER</div>
                      <div className="text-[10px] text-black/50 uppercase tracking-wider">Analyse en cours…</div>
                    </div>
                  </div>

                  {/* Score gauge */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative w-24 h-24 shrink-0">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" stroke="#000" strokeOpacity="0.08" strokeWidth="10" fill="none" />
                        <circle cx="50" cy="50" r="42" stroke="#f97316" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${87 * 2.64} 264`} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-black text-black leading-none">87</div>
                        <div className="text-[9px] font-bold text-black/50 uppercase">/100</div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-black/50 uppercase tracking-wider mb-1">Niche Score</div>
                      <div className="text-lg font-black text-orange-600 leading-tight">Excellent potentiel</div>
                      <div className="text-xs text-black/60 mt-1">Faible concurrence • Forte demande</div>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <div className="text-[10px] font-bold text-orange-700 uppercase">Revenus</div>
                      <div className="text-lg font-black text-black">4 250€<span className="text-xs text-black/50">/mo</span></div>
                    </div>
                    <div className="bg-black rounded-lg p-3">
                      <div className="text-[10px] font-bold text-orange-400 uppercase">BSR</div>
                      <div className="text-lg font-black text-white">12 500</div>
                    </div>
                  </div>

                  {/* Verdict */}
                  <div className="bg-orange-500 rounded-lg py-3 text-center">
                    <div className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> GO — Niche profitable
                    </div>
                  </div>
                </div>
              </div>

              {/* Badge flottant */}
              <div className="absolute -top-4 -right-4 bg-black rounded-2xl p-3 shadow-xl border-4 border-orange-500 rotate-6">
                <Gift className="w-7 h-7 text-orange-500 mx-auto" />
                <div className="text-[10px] font-black text-white text-center mt-0.5">100%<br />GRATUIT</div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-black text-white rounded-2xl p-6 text-center">
                <div className="text-3xl md:text-4xl font-black text-orange-500">{s.value}</div>
                <div className="text-xs text-white/60 mt-1 uppercase tracking-wider font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-orange-50/50 border-y-2 border-orange-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-600 text-sm font-black uppercase tracking-widest">Fonctionnalités</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4 text-black">
              Tout ce qu'un éditeur KDP attend.
            </h2>
            <p className="text-black/60 text-lg max-w-2xl mx-auto">
              Une analyse complète, professionnelle et instantanée. Sans quitter Amazon.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group bg-white border-2 border-black/5 rounded-2xl p-8 hover:border-orange-500 hover:-translate-y-1 transition-all shadow-sm hover:shadow-xl">
                <div className="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black mb-2 text-black">{f.title}</h3>
                <p className="text-black/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO / HOW IT WORKS */}
      <section id="demo" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-600 text-sm font-black uppercase tracking-widest">Comment ça marche</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4 text-black">
              Installé en 30 secondes.
            </h2>
            <p className="text-black/60 text-lg">4 étapes simples. Aucune compétence technique requise.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <div className="bg-white border-2 border-black/10 rounded-2xl p-6 h-full hover:border-orange-500 transition">
                  <div className="text-5xl font-black text-orange-500 mb-3">{s.num}</div>
                  <h3 className="text-lg font-black mb-2 text-black">{s.title}</h3>
                  <p className="text-sm text-black/60 leading-relaxed">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 w-6 h-6 text-orange-500 -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING / FREE */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-10 md:p-14 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 border border-white/30 mb-6">
                <Gift className="w-4 h-4 text-white" />
                <span className="text-xs font-black text-white uppercase tracking-wider">Offert à vie</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
                Pourquoi c'est gratuit ?
              </h2>
              <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-2xl">
                Parce qu'on veut que tu valides tes idées de livres avant d'écrire 200 pages. 
                C'est notre cadeau : un outil qui aurait coûté <span className="line-through opacity-60">97€/mois</span> ailleurs, 
                <span className="font-black"> totalement offert.</span>
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {[
                  'Aucune limite de scans',
                  'Aucune publicité',
                  'Aucune donnée revendue',
                ].map((txt, i) => (
                  <div key={i} className="flex items-center gap-2 text-white">
                    <Check className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-bold">{txt}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleDownload}
                disabled={downloading}
                size="lg"
                className="bg-black hover:bg-white hover:text-black text-white font-bold text-lg px-10 py-7 rounded-xl transition-all hover:-translate-y-0.5 border-0"
              >
                <Download className="w-5 h-5 mr-2" />
                {downloading ? 'Téléchargement…' : 'Télécharger maintenant'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-16 px-6 bg-white border-t-2 border-black/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />)}
          </div>
          <p className="text-black/70 text-sm mb-2">
            Plus de <span className="text-orange-600 font-black">2 400 éditeurs KDP</span> utilisent déjà l'extension.
          </p>
          <p className="text-xs text-black/40">
            Compatible avec Chrome, Edge, Brave, Arc, Opera et tous les navigateurs Chromium.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ExtensionChromePage;

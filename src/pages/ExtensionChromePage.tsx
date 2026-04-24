import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Download, Check, Chrome, Sparkles, ArrowLeft, Zap, Eye, Target, ShieldCheck, Search, BarChart3, Crosshair, Gift, Rocket, TrendingUp, Star, Lock, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import heroDark from '@/assets/extension-hero-dark.jpg';

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
    { icon: Target, title: 'Score de niche /100', desc: 'Notation instantanée du potentiel commercial de chaque livre Kindle scanné.', color: 'from-orange-500 to-amber-500' },
    { icon: TrendingUp, title: 'Ventes & revenus estimés', desc: 'Calcul automatique du chiffre d\'affaires mensuel à partir du BSR Amazon.', color: 'from-emerald-500 to-teal-500' },
    { icon: BarChart3, title: 'Analyse IA des avis', desc: 'Synthèse en 30 secondes des forces, faiblesses et opportunités des concurrents.', color: 'from-blue-500 to-cyan-500' },
    { icon: Crosshair, title: 'Mots-clés gagnants', desc: 'Extraction automatique des keywords des best-sellers de la niche.', color: 'from-violet-500 to-purple-500' },
    { icon: ShieldCheck, title: 'Verdict GO / À éviter', desc: 'Recommandation claire pour décider en 5 secondes si la niche vaut le coup.', color: 'from-rose-500 to-pink-500' },
    { icon: Zap, title: 'Analyse en 1 clic', desc: 'Aucune configuration. Ouvrez Amazon, cliquez, obtenez le verdict.', color: 'from-yellow-500 to-orange-500' },
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
    <div className="min-h-screen bg-[#0A0E1A] text-white overflow-hidden">
      <Helmet>
        <title>Extension Chrome KDP — Scanner Amazon Kindle gratuit | EbookStudio</title>
        <meta name="description" content="Scanne n'importe quelle page Amazon Kindle : score de niche /100, ventes estimées, concurrence et verdict GO/À éviter. Extension Chrome 100% gratuite." />
        <link rel="canonical" href="https://www.ebookstudio.fr/extension-chrome" />
      </Helmet>

      {/* Background ambiance */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-orange-600/15 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/5 bg-[#0A0E1A]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/offres" className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" /> Retour aux offres
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black">
              ⚡ 100% GRATUIT
            </span>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 pt-16 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texte gauche */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                <Rocket className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-semibold text-orange-300 uppercase tracking-wider">EbookStudio Scanner • v1.0</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6">
                Scanne Amazon
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                  en 1 clic.
                </span>
              </h1>

              <p className="text-xl text-white/70 leading-relaxed mb-8 max-w-xl">
                Score de niche, ventes estimées, concurrence, mots-clés gagnants. 
                Tout ce dont tu as besoin pour valider une idée de livre Kindle, 
                <span className="text-orange-400 font-semibold"> directement sur la page Amazon.</span>
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  onClick={handleDownload}
                  disabled={downloading}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold text-lg px-8 py-7 rounded-2xl shadow-[0_0_40px_rgba(251,146,60,0.5)] hover:shadow-[0_0_60px_rgba(251,146,60,0.7)] transition-all hover:-translate-y-0.5"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {downloading ? 'Téléchargement…' : 'Télécharger gratuitement'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 font-semibold text-lg px-8 py-7 rounded-2xl"
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Voir la démo
                </Button>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50">
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Sans carte bancaire</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Installation 30s</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Chrome, Edge, Brave</span>
              </div>
            </div>

            {/* Image hero droite */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/30 to-amber-500/30 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden border border-orange-500/20 shadow-2xl">
                <img
                  src={heroDark}
                  alt="EbookStudio Scanner extension Chrome avec score de niche 87/100 sur Amazon Kindle"
                  className="w-full h-auto"
                  width={1920}
                  height={1080}
                />
              </div>
              {/* Badge flottant */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl p-4 shadow-xl border-2 border-emerald-300/30 rotate-6">
                <Gift className="w-8 h-8 text-white" />
                <div className="text-xs font-black text-white mt-1">100%<br />GRATUIT</div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-xs text-white/60 mt-1 uppercase tracking-wider font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-400 text-sm font-bold uppercase tracking-widest">Fonctionnalités</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">
              Tout ce qu'un éditeur KDP attend.
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Une analyse complète, professionnelle et instantanée. Sans quitter Amazon.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.06] hover:border-orange-500/30 transition-all hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-white/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO / HOW IT WORKS */}
      <section id="demo" className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-400 text-sm font-bold uppercase tracking-widest">Comment ça marche</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">
              Installé en 30 secondes.
            </h2>
            <p className="text-white/60 text-lg">4 étapes simples. Aucune compétence technique requise.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-2xl p-6 h-full hover:border-orange-500/30 transition">
                  <div className="text-5xl font-black bg-gradient-to-br from-orange-400 to-amber-500 bg-clip-text text-transparent mb-3">
                    {s.num}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 w-6 h-6 text-orange-500/40 -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING / FREE */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent border border-orange-500/30 rounded-3xl p-10 md:p-14 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6">
                <Gift className="w-4 h-4 text-emerald-300" />
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Offert à vie</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Pourquoi c'est gratuit ?
              </h2>
              <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-2xl">
                Parce qu'on veut que tu valides tes idées de livres avant d'écrire 200 pages. 
                C'est notre cadeau : un outil qui aurait coûté <span className="line-through text-white/40">97€/mois</span> ailleurs, 
                <span className="text-orange-300 font-bold"> totalement offert.</span>
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Check, txt: 'Aucune limite de scans' },
                  { icon: Check, txt: 'Aucune publicité' },
                  { icon: Check, txt: 'Aucune donnée revendue' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/80">
                    <item.icon className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm font-medium">{item.txt}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleDownload}
                disabled={downloading}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold text-lg px-10 py-7 rounded-2xl shadow-[0_0_40px_rgba(251,146,60,0.5)] hover:shadow-[0_0_60px_rgba(251,146,60,0.7)] transition-all hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5 mr-2" />
                {downloading ? 'Téléchargement…' : 'Télécharger maintenant'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="relative z-10 py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
          </div>
          <p className="text-white/60 text-sm mb-2">
            Plus de <span className="text-orange-400 font-bold">2 400 éditeurs KDP</span> utilisent déjà l'extension.
          </p>
          <p className="text-xs text-white/40">
            Compatible avec Chrome, Edge, Brave, Arc, Opera et tous les navigateurs Chromium.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ExtensionChromePage;

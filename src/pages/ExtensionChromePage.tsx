import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Download, Check, ArrowLeft, ArrowRight, Search, BarChart3, Crosshair, Gift, Rocket, Zap, Star, Target, TrendingUp, ShieldCheck, Sparkles, Eye } from 'lucide-react';
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

  const heroFeatures = [
    { icon: Search, title: 'Score de niche en temps réel', desc: "Visualise le potentiel d'un livre directement sur sa fiche Amazon" },
    { icon: BarChart3, title: 'Analyse IA des avis', desc: 'Synthèse des points forts et faibles des concurrents en 30 sec' },
    { icon: Crosshair, title: 'Mots-clés extraits automatiquement', desc: 'Récupère les keywords gagnants utilisés par les best-sellers' },
    { icon: Gift, title: 'Gratuit pour tous', desc: '3 analyses IA offertes le 1er jour, puis 1/jour. Illimité avec un plan payant.' },
  ];

  const moreFeatures = [
    { icon: Target, title: 'Score de niche /100', desc: 'Notation instantanée du potentiel commercial de chaque livre Kindle.' },
    { icon: TrendingUp, title: 'Revenus mensuels estimés', desc: 'Calcul automatique du CA à partir du BSR Amazon en temps réel.' },
    { icon: BarChart3, title: 'Ventes/jour & BSR', desc: 'Suivi du Best Sellers Rank et estimation du volume quotidien.' },
    { icon: Crosshair, title: 'Top mots-clés gagnants', desc: 'Extraction des keywords des best-sellers de la niche scannée.' },
    { icon: Sparkles, title: 'Analyse IA des avis', desc: 'Synthèse des forces, faiblesses et opportunités en 30 secondes.' },
    { icon: ShieldCheck, title: 'Verdict GO / À éviter', desc: 'Recommandation claire pour décider en 5 secondes.' },
    { icon: Eye, title: 'Niveau de concurrence', desc: 'Évaluation visuelle Faible/Moyenne/Forte sur chaque fiche.' },
    { icon: Zap, title: 'Analyse en 1 clic', desc: 'Aucune configuration. Ouvrez Amazon, cliquez, obtenez le verdict.' },
    { icon: Rocket, title: 'Mises à jour gratuites', desc: 'Toutes les futures fonctionnalités incluses, sans surcoût.' },
  ];

  const steps = [
    { num: '01', title: 'Téléchargez le ZIP', desc: "Cliquez sur le bouton ci-dessus pour récupérer l'extension (200 ko)." },
    { num: '02', title: 'Activez le mode développeur', desc: 'Dans Chrome → chrome://extensions → activez "Mode développeur".' },
    { num: '03', title: "Chargez l'extension", desc: 'Cliquez sur "Charger l\'extension non empaquetée" puis sélectionnez le dossier dézippé.' },
    { num: '04', title: 'Scannez Amazon', desc: "Ouvrez n'importe quelle fiche Kindle. L'analyse apparaît automatiquement." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-50/40 to-white text-black">
      <Helmet>
        <title>Extension Chrome KDP — Scanner Amazon Kindle gratuit | EbookStudio</title>
        <meta name="description" content="Scanne n'importe quelle page Amazon Kindle : score de niche /100, ventes estimées, concurrence et verdict GO/À éviter. Extension Chrome 100% gratuite." />
        <link rel="canonical" href="https://www.ebookstudio.fr/extension-chrome" />
      </Helmet>

      {/* Header */}
      <header className="border-b border-black/5 bg-white/70 backdrop-blur sticky top-0 z-50">
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
      <section className="relative pt-12 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Top center badge + title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-semibold text-orange-600">Nouveau · Extension Chrome gratuite</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 text-black max-w-5xl mx-auto">
              Analyse n'importe quel livre Amazon
              <br />
              <span className="text-orange-500">en 1 clic</span>
            </h1>
            <p className="text-lg md:text-xl text-black/60 leading-relaxed max-w-3xl mx-auto">
              Installe l'extension <span className="font-bold text-black">EbookStudio Scanner</span> sur Chrome et obtiens instantanément le 
              potentiel d'une niche, le score de concurrence et les mots-clés gagnants 
              directement sur Amazon.
            </p>
          </div>

          {/* Grid 2 cols : features left + mockup right */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* LEFT : 4 feature cards */}
            <div className="space-y-4">
              {heroFeatures.map((f, i) => (
                <div key={i} className="flex items-start gap-4 bg-white border border-black/5 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(249,115,22,0.12)] hover:border-orange-200 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                    <f.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-1">{f.title}</h3>
                    <p className="text-sm text-black/60 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}

              {/* CTA */}
              <div className="pt-4">
                <Button
                  onClick={handleDownload}
                  disabled={downloading}
                  size="lg"
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold text-base px-8 py-6 rounded-xl shadow-[0_8px_30px_rgba(249,115,22,0.35)] hover:shadow-[0_12px_40px_rgba(249,115,22,0.45)] transition-all border-0"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {downloading ? 'Téléchargement…' : 'Télécharger gratuitement'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-sm text-black/60">
                  <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-orange-500" /> Sans carte bancaire</span>
                  <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-orange-500" /> Installation en 30 sec</span>
                  <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-orange-500" /> Compatible Chrome, Edge, Brave</span>
                </div>
              </div>
            </div>

            {/* RIGHT : Browser mockup with Amazon page + KDP Rocket panel */}
            <div className="relative">
              {/* Floating "100% Gratuit" pill */}
              <div className="absolute -top-3 right-4 z-20 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5" /> 100% Gratuit
              </div>

              {/* Browser window */}
              <div className="bg-white rounded-2xl shadow-2xl border border-black/10 overflow-hidden">
                {/* Browser bar */}
                <div className="bg-gray-100 border-b border-black/5 px-4 py-2.5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="ml-2 flex-1 bg-white rounded-md px-3 py-1 text-[11px] text-black/60 flex items-center gap-2 border border-black/5">
                    <span>🔒</span>
                    <span>https://www.amazon.fr/dp/B0CKDB7F3Q</span>
                  </div>
                </div>

                {/* Amazon nav */}
                <div className="bg-[#131921] px-4 py-2 flex items-center gap-3 text-white text-[10px]">
                  <span className="font-bold text-sm">amazon<span className="text-orange-400">.fr</span></span>
                  <span className="opacity-70">Bonjour,<br/>Identifiez-vous</span>
                  <span className="opacity-70">Retours et Commandes</span>
                  <span className="opacity-70 ml-auto">Ventes</span>
                  <span className="opacity-70">🛒 Panier</span>
                  <div className="ml-2 px-2 py-1 bg-orange-500 rounded text-[9px] font-bold flex items-center gap-1">
                    <Rocket className="w-2.5 h-2.5" /> KDP ROCKET
                  </div>
                </div>

                {/* Page content */}
                <div className="p-4 grid grid-cols-[80px_1fr_140px] gap-3">
                  {/* Book cover */}
                  <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded shadow-md aspect-[2/3] flex flex-col items-center justify-between p-2 text-white">
                    <div className="text-[8px] font-bold text-center leading-tight">MINDSET<br/>RESET</div>
                    <div className="w-full h-px bg-white/40" />
                    <div className="text-[6px] text-center opacity-90 leading-tight">Reprenez le contrôle<br/>de votre vie</div>
                    <div className="text-[5px] font-bold opacity-80">JEAN-CLAUDE FOURNIER</div>
                  </div>

                  {/* Product info */}
                  <div className="space-y-1.5 text-[10px]">
                    <div className="text-black/50 text-[8px]">Livres › Développement personnel › Mindset Reset</div>
                    <h3 className="font-bold text-black text-sm leading-tight">Mindset Reset : Reprenez le contrôle de votre vie</h3>
                    <div className="text-blue-600 text-[9px]">de Jean-Claude Fournier (Auteur)</div>
                    <div className="flex items-center gap-1 text-[9px]">
                      <span className="text-orange-500">★★★★★</span>
                      <span className="text-black/60">4,7 · 1 284 évaluations</span>
                    </div>
                    <div className="text-base font-bold text-black pt-1">14,99 €</div>
                    <button className="w-full bg-yellow-400 text-black text-[9px] font-semibold py-1 rounded">Ajouter au panier</button>
                    <button className="w-full bg-orange-400 text-black text-[9px] font-semibold py-1 rounded">Acheter cet article</button>
                    <div className="pt-1.5">
                      <div className="font-bold text-[9px] text-black mb-0.5">Description</div>
                      <p className="text-[8px] text-black/60 leading-snug">Découvrez les méthodes éprouvées pour transformer vos habitudes et reprendre le contrôle de votre vie quotidienne.</p>
                    </div>
                  </div>

                  {/* KDP ROCKET panel (the magic) */}
                  <div className="bg-white border-2 border-orange-400 rounded-lg p-2 space-y-2 shadow-[0_4px_12px_rgba(249,115,22,0.2)]">
                    <div className="flex items-center gap-1 pb-1 border-b border-orange-100">
                      <Rocket className="w-3 h-3 text-orange-500" />
                      <span className="text-[8px] font-black text-black">KDP ROCKET</span>
                    </div>

                    {/* Score gauge */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-14 h-14">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" stroke="#fed7aa" strokeWidth="10" fill="none" />
                          <circle cx="50" cy="50" r="42" stroke="#f97316" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${87 * 2.64} 264`} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-sm font-black text-orange-500 leading-none">87</div>
                          <div className="text-[6px] font-bold text-black/40">/100</div>
                        </div>
                      </div>
                      <div className="text-[7px] font-bold text-green-600 mt-0.5 flex items-center gap-0.5">
                        <Check className="w-2 h-2" /> Excellente niche
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-1 text-[7px]">
                      <div>
                        <div className="text-black/50 font-semibold">Revenu/mois</div>
                        <div className="font-black text-black text-[8px]">2 340 €</div>
                      </div>
                      <div>
                        <div className="text-black/50 font-semibold">Ventes/jour</div>
                        <div className="font-black text-black text-[8px]">~12</div>
                      </div>
                      <div>
                        <div className="text-black/50 font-semibold">Concurrence</div>
                        <div className="font-black text-green-600 text-[8px]">Faible</div>
                      </div>
                      <div>
                        <div className="text-black/50 font-semibold">BSR</div>
                        <div className="font-black text-black text-[8px]">#4 218</div>
                      </div>
                    </div>

                    {/* Keywords */}
                    <div>
                      <div className="text-[7px] font-bold text-black mb-1">Top mots-clés</div>
                      <div className="flex flex-wrap gap-0.5">
                        {['mindset', 'développement', 'habitudes', 'réussite', 'psychologie'].map(k => (
                          <span key={k} className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded text-[6px] font-semibold">{k}</span>
                        ))}
                      </div>
                    </div>

                    {/* AI button */}
                    <button className="w-full bg-orange-500 text-white text-[7px] font-bold py-1 rounded flex items-center justify-center gap-0.5">
                      <Sparkles className="w-2 h-2" /> Analyser les avis IA
                    </button>

                    {/* Quota bar */}
                    <div className="bg-orange-50 rounded p-1">
                      <div className="flex items-center justify-between text-[6px] font-semibold mb-0.5">
                        <span className="text-black flex items-center gap-0.5"><Zap className="w-2 h-2 text-orange-500" /> Analyses gratuites</span>
                        <span className="text-black/60">2/3</span>
                      </div>
                      <div className="h-1 bg-white rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '66%' }} />
                      </div>
                      <div className="text-right text-[6px] text-black/50 mt-0.5">66%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating "Analyse en 1 clic" pill below */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-black/5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-orange-500" /> Analyse en 1 clic
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MORE FEATURES */}
      <section className="py-24 px-6 bg-white border-t border-orange-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-orange-600 text-sm font-black uppercase tracking-widest">Toutes les fonctionnalités</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4 text-black">
              Tout ce qu'un éditeur KDP attend.
            </h2>
            <p className="text-black/60 text-lg max-w-2xl mx-auto">
              Une analyse complète, professionnelle et instantanée — sans quitter Amazon.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {moreFeatures.map((f, i) => (
              <div key={i} className="bg-white border border-black/10 rounded-2xl p-6 hover:border-orange-300 hover:-translate-y-1 transition-all hover:shadow-lg group">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4 group-hover:bg-orange-500 transition">
                  <f.icon className="w-6 h-6 text-orange-500 group-hover:text-white transition" />
                </div>
                <h3 className="text-lg font-bold mb-1.5 text-black">{f.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-gradient-to-br from-orange-50/60 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-orange-600 text-sm font-black uppercase tracking-widest">Installation</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4 text-black">
              Installé en 30 secondes.
            </h2>
            <p className="text-black/60 text-lg">4 étapes simples. Aucune compétence technique requise.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <div className="bg-white border border-black/10 rounded-2xl p-6 h-full hover:border-orange-300 hover:shadow-lg transition">
                  <div className="text-4xl font-black text-orange-500 mb-3">{s.num}</div>
                  <h3 className="text-base font-bold mb-2 text-black">{s.title}</h3>
                  <p className="text-sm text-black/60 leading-relaxed">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 w-5 h-5 text-orange-400 -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-orange-500 rounded-3xl p-10 md:p-14 overflow-hidden text-white">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 mb-5">
                <Gift className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wider">Offert à vie</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Pourquoi c'est gratuit ?
              </h2>
              <p className="text-base md:text-lg text-white/90 leading-relaxed mb-8 max-w-2xl">
                Parce qu'on veut que tu valides tes idées de livres avant d'écrire 200 pages. 
                Un outil qui aurait coûté <span className="line-through opacity-60">97€/mois</span> ailleurs, 
                <span className="font-black"> totalement offert.</span>
              </p>

              <div className="grid sm:grid-cols-3 gap-3 mb-8">
                {['Aucune limite de scans', 'Aucune publicité', 'Aucune donnée revendue'].map((txt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-semibold">{txt}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleDownload}
                disabled={downloading}
                size="lg"
                className="bg-black hover:bg-white hover:text-orange-500 text-white font-bold text-base px-8 py-6 rounded-xl transition-all hover:-translate-y-0.5 border-0"
              >
                <Download className="w-5 h-5 mr-2" />
                {downloading ? 'Téléchargement…' : 'Télécharger maintenant'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="flex justify-center gap-1 mb-3">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />)}
            </div>
            <p className="text-black/70 text-sm">
              Plus de <span className="text-orange-600 font-black">2 400 éditeurs KDP</span> utilisent déjà l'extension.
            </p>
            <p className="text-xs text-black/40 mt-1">
              Compatible Chrome, Edge, Brave, Arc, Opera et tous les navigateurs Chromium.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExtensionChromePage;

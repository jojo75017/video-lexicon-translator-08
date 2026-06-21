import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Download, Check, ArrowLeft, ArrowRight, Search, BarChart3, Crosshair, Gift, Rocket, Zap, Star, Target, TrendingUp, ShieldCheck, Sparkles, Eye, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ExtensionChromePage = () => {
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

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
        <title>Extension Chrome KDP - Scanner Amazon Kindle gratuit | Ebookstudio Pro V2</title>
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
              Installe l'extension <span className="font-bold text-black">Ebookstudio Pro V2 Scanner</span> sur Chrome et obtiens instantanément le 
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
              <div className="pt-4 space-y-3">
                <Button
                  onClick={handleDownload}
                  disabled={downloading}
                  size="lg"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-base px-8 py-6 rounded-xl shadow-[0_8px_30px_rgba(249,115,22,0.35)] hover:shadow-[0_12px_40px_rgba(249,115,22,0.45)] transition-all border-0"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {downloading ? 'Téléchargement…' : 'Télécharger gratuitement'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                {/* Bouton secondaire Pro */}
                <Button
                  onClick={() => navigate('/offres')}
                  variant="outline"
                  size="lg"
                  className="w-full bg-black hover:bg-gray-900 text-white border-0 font-bold text-base px-8 py-6 rounded-xl transition-all hover:scale-[1.01]"
                >
                  <Crown className="w-5 h-5 mr-2 text-orange-400" />
                  Passer Pro - 67€ à vie (analyses illimitées)
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-sm text-black/60">
                  <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-orange-500" /> Sans carte bancaire</span>
                  <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-orange-500" /> Installation en 30 sec</span>
                  <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-orange-500" /> Compatible Chrome, Edge, Brave</span>
                </div>
              </div>
            </div>

            {/* RIGHT : Browser mockup - Amazon page + REAL extension popup */}
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
                    <span className="truncate">https://www.amazon.fr/dp/B0CW194QGL</span>
                  </div>
                </div>

                {/* Amazon nav */}
                <div className="bg-[#131921] px-4 py-2 flex items-center gap-3 text-white text-[10px]">
                  <span className="font-bold text-sm">amazon<span className="text-orange-400">.fr</span></span>
                  <span className="opacity-70 hidden sm:inline">Bonjour,<br/>Identifiez-vous</span>
                  <span className="opacity-70 ml-auto">🛒 Panier</span>
                </div>

                {/* Page content with floating extension popup */}
                <div className="relative p-4 bg-white min-h-[480px]">
                  {/* Faded Amazon page in background */}
                  <div className="grid grid-cols-[80px_1fr] gap-3 opacity-40">
                    <div className="bg-gradient-to-br from-gray-300 to-gray-500 rounded shadow aspect-[2/3]" />
                    <div className="space-y-1.5 text-[10px]">
                      <div className="text-black/50 text-[8px]">Livres › Romans › Suspense</div>
                      <h3 className="font-bold text-black text-sm leading-tight">La femme de ménage voit tout (French Edition)</h3>
                      <div className="text-blue-600 text-[9px]">par Freida McFadden</div>
                      <div className="flex items-center gap-1 text-[9px]">
                        <span className="text-orange-500">★★★★★</span>
                        <span className="text-black/60">4,5 · 17 594 évaluations</span>
                      </div>
                      <div className="text-base font-bold text-black pt-1">6,40 €</div>
                      <div className="h-2 bg-gray-200 rounded w-3/4" />
                      <div className="h-2 bg-gray-200 rounded w-2/3" />
                      <div className="h-2 bg-gray-200 rounded w-4/5" />
                    </div>
                  </div>

                  {/* THE REAL EXTENSION POPUP - floating top-right */}
                  <div className="absolute top-3 right-3 w-[260px] bg-[#FAFAFA] rounded-xl shadow-2xl border border-black/10 overflow-hidden">
                    {/* Header sombre EbookStudio */}
                    <div className="px-3 py-2.5 text-white relative bg-[#232F3E]">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-[13px] flex items-center gap-1.5">
                            <span className="inline-flex w-5 h-5 items-center justify-center rounded bg-[#008296] text-[10px]">📚</span>
                            EbookStudio <span className="text-[#FF9E2D]">Scanner</span>
                          </div>
                        </div>
                        <button className="w-5 h-5 rounded-md bg-white/15 flex items-center justify-center text-[10px]">×</button>
                      </div>
                    </div>


                    {/* Book info */}
                    <div className="px-3 pt-2.5 pb-2 bg-white">
                      <div className="font-bold text-[11px] text-[#232F3E] leading-tight mb-0.5">La femme de ménage voit tout (French Edition)</div>
                      <div className="text-[#FF9E2D] text-[9px] italic mb-1.5">par Freida McFadden</div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="bg-gray-100 text-[8px] px-1.5 py-0.5 rounded font-mono font-semibold">ASIN: B0CW194QGL</span>
                        <span className="text-[8px] text-[#008296] font-semibold flex items-center gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#008296]" /> .com
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[9px] text-black/70">
                        <span>📖 Kindle</span>
                        <span>448 p.</span>
                        <span className="text-orange-500">★★★★☆</span>
                        <span className="font-semibold">4.5</span>
                      </div>
                      <div className="text-[9px] text-black/60 mt-0.5 flex items-center gap-1">
                        📅 October 2, 2024
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-white border-b border-gray-200">
                      <button className="flex-1 py-1.5 text-[10px] font-bold text-[#008296] border-b-2 border-[#FF9E2D]">Score</button>
                      <button className="flex-1 py-1.5 text-[10px] font-semibold text-gray-500">Mots-clés</button>
                    </div>

                    {/* Score + Verdict */}
                    <div className="px-3 py-2.5 bg-white flex items-center gap-2.5">
                      <div className="relative w-12 h-12 shrink-0">
                        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="44" stroke="#fee2e2" strokeWidth="8" fill="none" />
                          <circle cx="50" cy="50" r="44" stroke="#ef4444" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${21 * 2.76} 276`} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-base font-black text-[#232F3E] leading-none">21</div>
                          <div className="text-[7px] font-bold text-black/40">/100</div>
                        </div>
                      </div>
                      <button className="flex-1 bg-[#ef4444] text-white text-[11px] font-bold py-2.5 rounded-md flex items-center justify-center gap-1 shadow-sm">
                        <span className="w-3 h-3 rounded-full border-2 border-white flex items-center justify-center text-[8px]">⛔</span>
                        À ÉVITER
                      </button>
                    </div>

                    {/* Stats grid 2x3 */}
                    <div className="px-3 pb-2 grid grid-cols-2 gap-1.5">
                      <div className="bg-gray-50 rounded p-1.5">
                        <div className="text-[7px] font-bold text-gray-500 uppercase tracking-wider">Ventes/jour</div>
                        <div className="text-[11px] font-black text-[#232F3E] mt-0.5">~1</div>
                      </div>
                      <div className="bg-gray-50 rounded p-1.5">
                        <div className="text-[7px] font-bold text-gray-500 uppercase tracking-wider">Ventes/mois</div>
                        <div className="text-[11px] font-black text-[#232F3E] mt-0.5">~30</div>
                      </div>
                      <div className="bg-gray-50 rounded p-1.5">
                        <div className="text-[7px] font-bold text-gray-500 uppercase tracking-wider">Concurrence</div>
                        <div className="text-[11px] font-black text-red-500 mt-0.5">Forte</div>
                      </div>
                      <div className="bg-gray-50 rounded p-1.5">
                        <div className="text-[7px] font-bold text-gray-500 uppercase tracking-wider">BSR</div>
                        <div className="text-[11px] font-black text-[#232F3E] mt-0.5">#316 077</div>
                      </div>
                      <div className="bg-gray-50 rounded p-1.5">
                        <div className="text-[7px] font-bold text-gray-500 uppercase tracking-wider">Prix</div>
                        <div className="text-[11px] font-black text-[#232F3E] mt-0.5">—</div>
                      </div>
                      <div className="bg-gray-50 rounded p-1.5">
                        <div className="text-[7px] font-bold text-gray-500 uppercase tracking-wider">Avis</div>
                        <div className="text-[11px] font-black text-[#232F3E] mt-0.5">17 594</div>
                      </div>
                    </div>

                    {/* Revenus estimés banner */}
                    <div className="mx-3 mb-2 bg-emerald-50 border border-emerald-200 rounded-md py-1.5 px-2 text-center">
                      <div className="text-[9px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                        💡 Revenus estimés/mois : <span className="text-emerald-800">~105 €</span>
                      </div>
                    </div>

                    {/* CTA bottom */}
                    <button className="w-full bg-[#232F3E] hover:bg-[#FF9E2D] text-white text-[10px] font-bold py-2.5 transition-colors">
                      Analyse complète sur Ebookstudio Pro V2 →
                    </button>
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
              Une analyse complète, professionnelle et instantanée - sans quitter Amazon.
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

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleDownload}
                  disabled={downloading}
                  size="lg"
                  className="bg-black hover:bg-white hover:text-orange-500 text-white font-bold text-base px-8 py-6 rounded-xl transition-all hover:-translate-y-0.5 border-0"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {downloading ? 'Téléchargement…' : 'Télécharger gratuitement'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <Button
                  onClick={() => navigate('/offres')}
                  size="lg"
                  className="bg-white hover:bg-orange-100 text-orange-600 font-bold text-base px-8 py-6 rounded-xl transition-all hover:-translate-y-0.5 border-0"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Passer Pro - 67€ à vie
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
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

import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Download, Check, Chrome, Sparkles, ArrowLeft, Zap, Eye, Target, ShieldCheck, Search, BarChart3, Crosshair, Gift } from 'lucide-react';
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

  const heroFeatures = [
    { icon: Search, title: 'Score de niche en temps réel', desc: 'Visualise le potentiel d\'un livre directement sur sa fiche Amazon' },
    { icon: BarChart3, title: 'Analyse IA des avis', desc: 'Synthèse des points forts et faibles des concurrents en 30 sec' },
    { icon: Crosshair, title: 'Mots-clés extraits automatiquement', desc: 'Récupère les keywords gagnants utilisés par les best-sellers' },
    { icon: Gift, title: 'Gratuit pour tous', desc: '3 analyses IA offertes le 1er jour, puis 1/jour. Illimité avec un plan payant.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-orange-50/40">
      <Helmet>
        <title>Extension Chrome KDP — Score de niche Amazon en 1 clic | EbookStudio</title>
        <meta name="description" content="Scanne n'importe quelle page Amazon Kindle : score de niche /100, ventes estimées, concurrence et verdict GO/À éviter. Extension Chrome 100% gratuite." />
        <link rel="canonical" href="https://www.ebookstudio.fr/extension-chrome" />
      </Helmet>

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/offres" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Retour aux offres
          </Link>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">100% GRATUIT</span>
        </div>
      </header>

      {/* HERO — style maquette KDP Rocket */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-20">
        {/* Badge top centré */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-white border border-orange-200 text-orange-600 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm">
            <Chrome className="w-3.5 h-3.5" /> Nouveau · Extension Chrome gratuite
          </span>
        </div>

        {/* Titre */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-slate-900 leading-tight mb-5">
          Analyse n'importe quel livre Amazon<br />
          <span className="text-orange-500">en 1 clic</span>
        </h1>
        <p className="text-lg text-center text-slate-600 max-w-2xl mx-auto mb-12">
          Installe l'extension <strong>EbookStudio Scanner</strong> sur Chrome et obtiens instantanément le potentiel d'une niche, le score de concurrence et les mots-clés gagnants directement sur Amazon.
        </p>

        {/* Grille 2 colonnes : features à gauche, mockup à droite */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Colonne gauche : 4 features + CTA */}
          <div className="space-y-3">
            {heroFeatures.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-0.5">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}

            {/* CTA principal */}
            <div className="pt-3">
              <Button
                size="lg"
                onClick={handleDownload}
                disabled={downloading}
                className="w-full sm:w-auto text-base px-8 py-6 bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 rounded-xl"
              >
                <Download className="w-5 h-5 mr-2" />
                {downloading ? 'Téléchargement…' : 'Télécharger gratuitement'}
                <span className="ml-2">→</span>
              </Button>
              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-sm text-slate-600">
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Sans carte bancaire</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Installation en 30 sec</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Compatible Chrome, Edge, Brave</span>
              </div>
            </div>
          </div>

          {/* Colonne droite : mockup navigateur Amazon + badge */}
          <div className="relative">
            {/* Badge "100% Gratuit" flottant */}
            <div className="absolute -top-3 -right-2 z-20 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-sm font-bold">
              <Gift className="w-4 h-4" /> 100% Gratuit
            </div>

            {/* Fenêtre navigateur */}
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Barre navigateur */}
              <div className="bg-slate-100 px-3 py-2 flex items-center gap-2 border-b border-slate-200">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-[10px] text-slate-500 truncate border border-slate-200 mx-2">
                  🔒 https://www.amazon.fr/dp/B0CKD87F3Q
                </div>
                <span className="text-[10px] text-slate-400">⋮</span>
              </div>

              {/* Barre Amazon */}
              <div className="bg-[#131921] text-white px-3 py-1.5 flex items-center gap-3 text-[10px]">
                <span className="font-bold italic text-amber-400">amazon<span className="text-white">.fr</span></span>
                <span className="text-slate-300">Bonjour,<br/>Identifiez-vous</span>
                <span className="text-slate-300 hidden sm:inline">Retours et Commandes</span>
                <span className="text-slate-300 hidden md:inline">Ventes</span>
                <span className="ml-auto text-slate-300">🛒 Panier</span>
              </div>

              {/* Contenu fiche + badge extension */}
              <div className="p-3 grid grid-cols-12 gap-2 bg-white">
                {/* Fil d'ariane */}
                <div className="col-span-12 text-[9px] text-slate-500 mb-1">Livres › Développement personnel › Mindset Reset</div>

                {/* Couverture */}
                <div className="col-span-4">
                  <div className="aspect-[2/3] bg-gradient-to-br from-orange-400 to-orange-600 rounded shadow-md flex flex-col items-center justify-between p-2 text-white">
                    <div className="text-center pt-3">
                      <div className="text-[18px] font-extrabold leading-none tracking-tight">MINDSET</div>
                      <div className="text-[18px] font-extrabold leading-none tracking-tight">RESET</div>
                    </div>
                    <div className="text-center text-[7px] leading-tight px-1">
                      Reprenez le contrôle<br/>de votre vie
                    </div>
                    <div className="text-[7px] font-bold tracking-wider">JEAN-CLAUDE FOURNIER</div>
                  </div>
                </div>

                {/* Infos livre */}
                <div className="col-span-4 text-[9px] leading-tight">
                  <div className="font-bold text-slate-900 text-[11px] leading-tight mb-1">Mindset Reset : Reprenez le contrôle de votre vie</div>
                  <div className="text-blue-700 mb-1">de Jean-Claude Fournier <span className="text-slate-500">(Auteur)</span></div>
                  <div className="text-amber-500 mb-1">★★★★★ <span className="text-blue-700">1 284 évaluations</span></div>
                  <div className="text-slate-900 font-bold text-sm mb-1.5">14,99 €</div>
                  <button className="w-full bg-amber-300 text-slate-900 rounded-full py-1 text-[9px] font-semibold mb-1">Ajouter au panier</button>
                  <button className="w-full bg-orange-400 text-white rounded-full py-1 text-[9px] font-semibold mb-2">Acheter cet article</button>
                  <div className="text-[8px] text-slate-700">
                    <div className="font-bold mb-0.5">Description</div>
                    <div className="text-slate-500 leading-snug">Découvrez les méthodes éprouvées pour transformer vos habitudes et reprendre le contrôle de votre vie quotidienne.</div>
                  </div>
                </div>

                {/* BADGE EXTENSION (à droite) */}
                <div className="col-span-4">
                  <div className="bg-white rounded-lg border-2 border-orange-300 shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-2 py-1 text-[8px] font-bold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> KDP ROCKET
                    </div>
                    <div className="p-2">
                      {/* Score circulaire */}
                      <div className="flex flex-col items-center mb-2">
                        <div className="w-14 h-14 rounded-full border-[5px] border-orange-500 flex flex-col items-center justify-center">
                          <div className="text-base font-extrabold text-orange-600 leading-none">87</div>
                          <div className="text-[7px] text-slate-500">/100</div>
                        </div>
                        <div className="text-[8px] font-bold text-emerald-600 mt-1">✓ Excellente niche</div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-1 text-[7px] mb-2">
                        <div className="bg-slate-50 rounded p-1">
                          <div className="text-slate-500">• Revenu/mois</div>
                          <div className="font-bold text-slate-900 text-[8px]">2 340 €</div>
                        </div>
                        <div className="bg-slate-50 rounded p-1">
                          <div className="text-slate-500">• Ventes/jour</div>
                          <div className="font-bold text-slate-900 text-[8px]">~12</div>
                        </div>
                        <div className="bg-slate-50 rounded p-1">
                          <div className="text-slate-500">• Concurrence</div>
                          <div className="font-bold text-emerald-600 text-[8px]">Faible</div>
                        </div>
                        <div className="bg-slate-50 rounded p-1">
                          <div className="text-slate-500">• BSR</div>
                          <div className="font-bold text-slate-900 text-[8px]">#4 218</div>
                        </div>
                      </div>

                      {/* Top mots-clés */}
                      <div className="mb-2">
                        <div className="text-[7px] font-bold text-slate-700 mb-0.5">Top mots-clés</div>
                        <div className="flex flex-wrap gap-0.5">
                          {['mindset', 'développement', 'habitudes', 'réussite', 'psychologie'].map(k => (
                            <span key={k} className="bg-orange-100 text-orange-800 px-1 py-0.5 rounded text-[6px] font-medium">{k}</span>
                          ))}
                        </div>
                      </div>

                      {/* CTA analyse avis */}
                      <button className="w-full bg-amber-300 text-slate-900 rounded-full py-1 text-[7px] font-bold mb-1.5">⚡ Analyser les avis IA</button>

                      {/* Quota */}
                      <div className="bg-orange-50 rounded p-1 text-[7px]">
                        <div className="flex justify-between mb-0.5">
                          <span className="text-orange-700 font-semibold">📊 Analyses gratuites</span>
                          <span className="font-bold text-orange-900">2/3</span>
                        </div>
                        <div className="h-1 bg-orange-200 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-orange-500 rounded-full" />
                        </div>
                        <div className="text-right text-orange-700 mt-0.5">66%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tag "Analyse en 1 clic" sous le mockup */}
            <div className="absolute -bottom-4 left-8 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Zap className="w-4 h-4 text-orange-500" /> Analyse en 1 clic
            </div>
          </div>
        </div>
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

      {/* Mockup réaliste */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-center mb-2 text-foreground">Voilà ce que tu vois sur Amazon, en vrai :</h2>
        <p className="text-center text-muted-foreground mb-8 text-sm">Aperçu fidèle du badge avec toutes les infos extraites de la fiche produit</p>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Mock fiche Amazon */}
          <div className="bg-white rounded-2xl shadow-xl p-5 border-2 border-slate-200">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-3 font-semibold">📦 Fiche Amazon Kindle</div>
            <div className="flex gap-3">
              <div className="w-20 h-28 bg-gradient-to-br from-orange-400 to-red-600 rounded shadow-md flex items-center justify-center text-white text-[10px] font-bold text-center p-1">COUVERTURE</div>
              <div className="flex-1 text-xs">
                <div className="font-bold text-slate-900 leading-tight mb-1">Réveil Spirituel : 30 Jours pour Transformer Votre Vie</div>
                <div className="text-blue-700 mb-1">par Marie Dubois (Auteur)</div>
                <div className="text-amber-500 mb-1">★★★★☆ <span className="text-slate-500">4,3 sur 5 — 87 évaluations</span></div>
                <div className="text-red-700 font-bold text-lg">7,99 €</div>
                <div className="text-slate-500 text-[10px] mt-1">Format Kindle • 142 pages • 12 mars 2025</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t text-[10px] text-slate-500">
              <div><b>ASIN :</b> B0CXY8K2LM</div>
              <div><b>Classement des meilleures ventes Amazon :</b> #4 820 dans la Boutique Kindle</div>
            </div>
          </div>

          {/* Mock badge réaliste */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border-2 border-dashed border-slate-300">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-3 font-semibold text-center">⬇ Le badge EbookStudio extrait & analyse ⬇</div>
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-xs">
              {/* Head */}
              <div className="bg-gradient-to-r from-orange-500 to-teal-600 text-white px-3 py-2 text-[11px] font-semibold flex justify-between">
                <span>📚 EbookStudio</span><span className="opacity-70">×</span>
              </div>
              {/* Book info */}
              <div className="px-3 py-2.5 bg-slate-50 border-b border-slate-200">
                <div className="font-bold text-slate-900 text-[12px] leading-tight">Réveil Spirituel : 30 Jours pour Transformer Votre Vie</div>
                <div className="text-teal-700 italic text-[10px] mt-0.5">par Marie Dubois</div>
                <div className="flex flex-wrap gap-1.5 mt-1.5 text-[9px] items-center">
                  <span className="bg-orange-100 text-orange-900 px-1.5 py-0.5 rounded font-mono"><b>ASIN: B0CXY8K2LM</b></span>
                  <span className="bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded font-semibold">🌍 .fr</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1.5 text-[9px] text-slate-500 items-center">
                  <span>Format Kindle</span>
                  <span>📖 142 p.</span>
                  <span className="text-amber-500 font-bold">★★★★☆ 4.3</span>
                </div>
                <div className="text-[9px] text-slate-500 mt-1">📅 12 mars 2025</div>
              </div>
              {/* Tabs */}
              <div className="flex border-b border-slate-200 bg-slate-50">
                <div className="flex-1 py-2 text-center text-[11px] font-semibold text-teal-700 border-b-2 border-orange-500 bg-white">Score</div>
                <div className="flex-1 py-2 text-center text-[11px] font-semibold text-slate-400">Mots-clés</div>
              </div>
              {/* Score */}
              <div className="p-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-14 h-14 rounded-full border-[5px] border-emerald-500 flex flex-col items-center justify-center flex-shrink-0">
                    <div className="text-lg font-extrabold text-slate-900 leading-none">82</div>
                    <div className="text-[8px] text-slate-500">/100</div>
                  </div>
                  <div className="flex-1 bg-emerald-500 text-white py-2 rounded-lg text-center text-[12px] font-bold">🚀 GO</div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  <div className="bg-slate-50 p-1.5 rounded"><div className="text-[8px] uppercase text-slate-500">Ventes/jour</div><b className="text-[12px]">~60</b></div>
                  <div className="bg-slate-50 p-1.5 rounded"><div className="text-[8px] uppercase text-slate-500">Ventes/mois</div><b className="text-[12px]">~1 800</b></div>
                  <div className="bg-slate-50 p-1.5 rounded"><div className="text-[8px] uppercase text-slate-500">Concurrence</div><b className="text-[12px] text-emerald-600">Faible</b></div>
                  <div className="bg-slate-50 p-1.5 rounded"><div className="text-[8px] uppercase text-slate-500">BSR</div><b className="text-[12px]">#4 820</b></div>
                  <div className="bg-slate-50 p-1.5 rounded"><div className="text-[8px] uppercase text-slate-500">Prix</div><b className="text-[12px]">7,99 €</b></div>
                  <div className="bg-slate-50 p-1.5 rounded"><div className="text-[8px] uppercase text-slate-500">Avis</div><b className="text-[12px]">87</b></div>
                </div>
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-2 text-center text-[11px] text-emerald-900">
                  💰 Revenus estimés/mois : <b className="text-emerald-700 text-[13px]">~10 062 €</b>
                </div>
              </div>
              <div className="bg-slate-900 text-white text-center py-2.5 text-[11px] font-semibold">Analyse complète sur EbookStudio →</div>
            </div>
          </div>
        </div>

        {/* Aperçu mots-clés */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border-2 p-5 max-w-2xl mx-auto">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-3 font-semibold">🔑 Onglet "Mots-clés" — extraction automatique</div>
          <div className="mb-4">
            <div className="text-[10px] uppercase text-slate-500 font-bold mb-2">Mots-clés principaux</div>
            <div className="flex flex-wrap gap-1.5">
              {['spirituel', 'transformation', 'développement', 'éveil', 'méditation', 'conscience', 'épanouissement', 'sagesse'].map(k => (
                <span key={k} className="bg-sky-100 text-sky-800 px-2 py-1 rounded-full text-xs font-medium">{k}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-500 font-bold mb-2">Longue traîne (suggestions)</div>
            <div className="flex flex-wrap gap-1.5">
              {['développement personnel', 'transformer votre vie', 'éveil spirituel', 'méditation guidée', 'reveil conscience'].map(k => (
                <span key={k} className="bg-amber-100 text-amber-900 px-2 py-1 rounded-full text-xs font-medium">{k}</span>
              ))}
            </div>
          </div>
          <button className="mt-4 w-full bg-slate-900 hover:bg-orange-500 transition-colors text-white py-2 rounded-lg text-xs font-semibold">📋 Copier tous les mots-clés en 1 clic</button>
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

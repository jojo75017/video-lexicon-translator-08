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

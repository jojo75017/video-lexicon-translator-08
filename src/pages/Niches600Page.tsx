import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Search, Download, ArrowLeft, Target, TrendingUp } from 'lucide-react';
import { niches600, niches600Categories } from '@/data/niches600';

const PAGE_SIZE = 50;

const concurrenceColor: Record<string, string> = {
  Faible: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Modérée: 'bg-amber-100 text-amber-800 border-amber-300',
  Élevée: 'bg-rose-100 text-rose-800 border-rose-300',
};

export default function Niches600Page() {
  const [category, setCategory] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'bsr' | 'potentiel'>('potentiel');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = niches600;
    if (category !== 'all') list = list.filter((n) => n.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (n) =>
          n.niche.toLowerCase().includes(q) ||
          n.motCleAmazon.toLowerCase().includes(q) ||
          n.sousNiche.toLowerCase().includes(q),
      );
    }
    list = [...list].sort((a, b) =>
      sort === 'bsr' ? a.bsrCible - b.bsrCible : b.potentiel - a.potentiel,
    );
    return list;
  }, [category, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const exportCsv = () => {
    const header = ['ID', 'Niche', 'Catégorie', 'Mot-clé Amazon', 'BSR cible', 'Concurrence', 'Potentiel', 'Prix exemple'];
    const rows = filtered.map((n) => [
      n.id,
      `"${n.niche.replace(/"/g, '""')}"`,
      `"${n.sousNiche.replace(/"/g, '""')}"`,
      `"${n.motCleAmazon}"`,
      n.bsrCible,
      n.concurrence,
      n.potentiel,
      n.exemplePrix.toFixed(2),
    ]);
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `600-niches-kdp-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#008296] via-[#FF9E2D] to-[#EC4899] text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <Link to="/espace" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour à l'espace
          </Link>
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-[280px]">
              <Badge className="bg-white text-[#EC4899] font-black animate-pulse text-xs mb-3 border-0">
                🆕 Nouveauté Mai 2026
              </Badge>
              <h1 className="text-3xl md:text-5xl font-black mb-2 flex items-center gap-3">
                <Target className="w-10 h-10" />
                600 Niches KDP rentables
              </h1>
              <p className="text-white/90 text-base md:text-lg max-w-2xl">
                12 catégories · 50 niches chacune · mots-clés Amazon, BSR cibles, niveau de concurrence et potentiel commercial.
              </p>
            </div>
            <Button
              onClick={exportCsv}
              className="bg-white text-[#232F3E] hover:bg-white/90 font-bold"
            >
              <Download className="w-4 h-4 mr-2" /> Exporter en CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="max-w-7xl mx-auto px-4 py-6 sticky top-0 z-10 bg-[#FAFAFA]/95 backdrop-blur border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher une niche, un mot-clé…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>

          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
          >
            <option value="all">Toutes les catégories</option>
            {niches600Categories.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'bsr' | 'potentiel')}
            className="h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
          >
            <option value="potentiel">Trier par potentiel</option>
            <option value="bsr">Trier par BSR (croissant)</option>
          </select>

          <div className="text-sm text-gray-600 ml-auto">
            <strong className="text-[#008296]">{filtered.length}</strong> niches · page {safePage}/{totalPages}
          </div>
        </div>
      </div>

      {/* Grille */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slice.map((n) => (
            <div
              key={n.id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#008296] hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-2xl">{n.emoji}</span>
                <Badge variant="outline" className="text-[10px]">#{n.id}</Badge>
              </div>
              <h3 className="font-bold text-[#232F3E] text-base leading-tight mb-1">{n.niche}</h3>
              <p className="text-xs text-gray-500 mb-3">{n.sousNiche}</p>

              <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3">
                <p className="text-[11px] text-gray-500 uppercase font-semibold">Mot-clé Amazon</p>
                <p className="text-sm font-mono text-[#008296]">{n.motCleAmazon}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-gray-500">BSR cible</p>
                  <p className="font-bold text-[#232F3E]">≈ {n.bsrCible.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Concurrence</p>
                  <Badge className={`${concurrenceColor[n.concurrence]} text-[10px] font-semibold border`}>
                    {n.concurrence}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-500">Potentiel</p>
                  <p className="font-bold text-[#FF9E2D] flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {'★'.repeat(n.potentiel)}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Prix exemple</span>
                <strong className="text-[#232F3E]">{n.exemplePrix.toFixed(2)} €</strong>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" size="sm" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>
            Précédent
          </Button>
          <span className="text-sm text-gray-600 px-3">{safePage} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Suivant
          </Button>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF9E2D]" />
          Liste actualisée — Mai 2026 — EbookStudio V2
        </div>
      </div>
    </div>
  );
}

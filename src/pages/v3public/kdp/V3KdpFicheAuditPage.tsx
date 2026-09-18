import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Download, ExternalLink, Loader2, Search, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MARKETPLACES, fetchAmazonBook, fmtEur, fmtNum, type MarketBook } from '@/components/admin/market/marketShared';
import { callAIWriting, isAIConfigured } from '@/services/aiWritingService';

interface AplusModule {
  titre: string;
  texte: string;
  visuel: string;
}

interface FicheAudit {
  description: string;
  keywords: string[];
  aplus: AplusModule[];
}

const HISTORY_KEY = 'v3:kdp:fiche-audit:historique';
const DESC_LIMIT = 4000;

type HistoryEntry = { asin: string; marketplace: string; titre: string; date: string };

function readHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.slice(0, 10) : [];
  } catch {
    return [];
  }
}

function pushHistory(entry: HistoryEntry): HistoryEntry[] {
  const next = [entry, ...readHistory().filter((h) => !(h.asin === entry.asin && h.marketplace === entry.marketplace))].slice(0, 10);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* stockage indisponible */ }
  return next;
}

const copy = async (text: string, label = 'Copié') => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} ✓`);
  } catch {
    toast.error('Copie impossible dans ce navigateur.');
  }
};

/** Bloc encadré, style maison d'édition. */
function Bloc({ titre, sous, children, action }: { titre: string; sous?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-5" style={{ borderColor: 'var(--v3-line)' }}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="v3-serif text-[19px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>{titre}</h2>
          {sous && <p className="mt-0.5 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>{sous}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function V3KdpFicheAuditPage() {
  const [asin, setAsin] = useState('');
  const [marketplace, setMarketplace] = useState('fr');
  const [etape, setEtape] = useState<'repos' | 'extraction' | 'redaction'>('repos');
  const [erreur, setErreur] = useState<string | null>(null);
  const [livre, setLivre] = useState<MarketBook | null>(null);
  const [fiche, setFiche] = useState<FicheAudit | null>(null);
  const [historique, setHistorique] = useState<HistoryEntry[]>([]);

  useEffect(() => { setHistorique(readHistory()); }, []);

  const occupe = etape !== 'repos';

  const analyser = async (asinVoulu?: string, marketVoulu?: string) => {
    const code = (asinVoulu ?? asin).trim().toUpperCase();
    const market = marketVoulu ?? marketplace;
    if (!/^[A-Z0-9]{10}$/.test(code)) {
      setErreur("L'ASIN doit contenir 10 caractères (lettres et chiffres), par exemple B08HFDFKRFG sans espace.");
      return;
    }
    if (!isAIConfigured()) {
      setErreur("Aucune clé IA valide enregistrée. Ouvrez « Paramétrage des clés » puis revenez ici.");
      return;
    }

    setErreur(null);
    setFiche(null);
    setAsin(code);
    setMarketplace(market);

    let donnees: MarketBook;
    try {
      setEtape('extraction');
      donnees = await fetchAmazonBook(code, market);
      setLivre(donnees);
    } catch (e: any) {
      setEtape('repos');
      setErreur(e?.message || "Ce livre n'a pas été trouvé sur ce marché. Vérifiez l'ASIN et le pays choisi, puis réessayez.");
      return;
    }

    try {
      setEtape('redaction');
      const prompt = `Tu es un spécialiste de la mise en vente sur Amazon KDP. Écris en français uniquement, jamais de latin, jamais de mot inventé, jamais de mot étranger décoratif.

Livre analysé :
Titre : ${donnees.title}
${donnees.author ? `Auteur : ${donnees.author}` : ''}
${donnees.categories?.length ? `Catégories Amazon : ${donnees.categories.join(' / ')}` : ''}
${donnees.price != null ? `Prix : ${donnees.price} €` : ''}
${donnees.pages != null ? `Pages : ${donnees.pages}` : ''}
Description actuelle sur Amazon : ${(donnees.description || '(vide)').slice(0, 3000)}

Produis exactement trois livrables :
1. "description" : une description de vente prête à coller dans KDP, ${DESC_LIMIT} caractères maximum, structure accroche / promesse / bénéfices / invitation à commander. Texte simple, pas de balise HTML.
2. "keywords" : exactement 7 expressions de mots-clés backend KDP, chacune de 50 caractères maximum, sans répétition, sans le nom de l'auteur, sans marque.
3. "aplus" : exactement 4 modules de contenu A+, dans cet ordre : bannière avec texte, trois colonnes de bénéfices, texte enrichi de présentation, tableau comparatif. Chaque module a un titre, un texte à coller, et une suggestion de visuel.

Réponds uniquement avec ce JSON :
{"description":"...","keywords":["...","...","...","...","...","...","..."],"aplus":[{"titre":"...","texte":"...","visuel":"..."}]}`;

      const brut = await callAIWriting(prompt, { temperature: 0.7, jsonMode: true, maxTokens: 4096 });
      const bloc = brut.match(/\{[\s\S]*\}/);
      if (!bloc) throw new Error('Réponse illisible du moteur IA. Relancez l’analyse.');
      const parsed = JSON.parse(bloc[0]) as FicheAudit;

      setFiche({
        description: (parsed.description || '').trim().slice(0, DESC_LIMIT),
        keywords: (parsed.keywords || []).map((k) => String(k).trim()).filter(Boolean).slice(0, 7),
        aplus: (parsed.aplus || []).slice(0, 4).map((m) => ({
          titre: String(m?.titre || '').trim(),
          texte: String(m?.texte || '').trim(),
          visuel: String(m?.visuel || '').trim(),
        })),
      });
      setHistorique(pushHistory({ asin: code, marketplace: market, titre: donnees.title, date: new Date().toISOString() }));
    } catch (e: any) {
      setErreur(e?.message || "La rédaction n'a pas abouti. Relancez l'analyse.");
    } finally {
      setEtape('repos');
    }
  };

  const exporter = () => {
    if (!livre || !fiche) return;
    const lignes = [
      `FICHE AUDIT — ${livre.title}`,
      `ASIN ${livre.asin} · ${marketplace.toUpperCase()}`,
      '',
      '=== DESCRIPTION ===',
      fiche.description,
      '',
      '=== 7 MOTS-CLÉS BACKEND ===',
      ...fiche.keywords.map((k, i) => `${i + 1}. ${k}`),
      '',
      '=== CONTENU A+ (4 MODULES) ===',
      ...fiche.aplus.flatMap((m, i) => [`Module ${i + 1} — ${m.titre}`, m.texte, `[Visuel : ${m.visuel}]`, '']),
    ];
    const blob = new Blob([lignes.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fiche-audit-${livre.asin}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const majMot = (i: number, valeur: string) =>
    setFiche((f) => (f ? { ...f, keywords: f.keywords.map((k, j) => (j === i ? valeur : k)) } : f));
  const majModule = (i: number, champ: keyof AplusModule, valeur: string) =>
    setFiche((f) => (f ? { ...f, aplus: f.aplus.map((m, j) => (j === i ? { ...m, [champ]: valeur } : m)) } : f));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <Helmet>
        <title>Fiche Audit KDP — un ASIN, tout le contenu | Ebookstudio</title>
        <meta name="description" content="Collez un ASIN Amazon : description de vente, 7 mots-clés backend et contenu A+ en 4 modules, prêts à coller dans votre interface KDP." />
      </Helmet>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link to="/v3/kdp" className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
          <ArrowLeft className="h-4 w-4" /> Retour à l'espace KDP
        </Link>
        <Link to="/v3/fonctionnalites/cles-api" className="text-[12.5px] underline" style={{ color: 'var(--v3-muted)' }}>
          Paramétrage des clés
        </Link>
      </div>

      <header className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--v3-gold-600)' }}>
          Espace KDP · page 1
        </p>
        <h1 className="v3-serif text-[30px] font-semibold" style={{ color: 'var(--v3-ink)' }}>Fiche Audit</h1>
        <p className="mt-1 max-w-2xl text-[14px]" style={{ color: 'var(--v3-muted)' }}>
          Un seul code ASIN, et vous repartez avec la description de vente, les 7 mots-clés à saisir en coulisses
          et les 4 modules de contenu A+ — tout est modifiable avant de copier.
        </p>
      </header>

      <section className="mb-5 rounded-2xl border p-5" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)' }}>
        <div className="grid gap-3 sm:grid-cols-[1fr,200px,auto] sm:items-end">
          <div>
            <Label className="text-xs">Code ASIN du livre</Label>
            <Input
              value={asin}
              onChange={(e) => setAsin(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !occupe) analyser(); }}
              placeholder="B08HFDFKRFG"
              className="font-mono uppercase"
              maxLength={10}
            />
          </div>
          <div>
            <Label className="text-xs">Marché Amazon</Label>
            <select
              value={marketplace}
              onChange={(e) => setMarketplace(e.target.value)}
              className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              style={{ borderColor: 'var(--v3-line)' }}
            >
              {MARKETPLACES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>
          <Button
            onClick={() => analyser()}
            disabled={occupe}
            className="v3-btn v3-btn-primary h-10 [background:var(--v3-emerald)!important] [color:var(--v3-on-emerald)!important] hover:[background:var(--v3-emerald-600)!important]"
          >
            {occupe ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span className="ml-1.5">Analyser la fiche</span>
          </Button>
        </div>

        {occupe && (
          <p className="mt-3 text-[13px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
            {etape === 'extraction' ? '1/2 — Lecture de la fiche Amazon…' : '2/2 — Rédaction de la description, des mots-clés et du contenu A+…'}
          </p>
        )}

        {erreur && (
          <div className="mt-3 rounded-lg border px-3 py-2 text-[13px]" style={{ borderColor: '#f3c2c2', background: '#fdf3f3', color: '#8a2222' }}>
            {erreur}
          </div>
        )}

        {historique.length > 0 && !occupe && (
          <div className="mt-4">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--v3-muted)' }}>
              Vos dernières analyses
            </p>
            <div className="flex flex-wrap gap-1.5">
              {historique.map((h) => (
                <button
                  key={h.asin + h.marketplace}
                  type="button"
                  onClick={() => analyser(h.asin, h.marketplace)}
                  className="rounded-full border px-2.5 py-1 text-[11.5px]"
                  style={{ borderColor: 'var(--v3-line)', background: '#fff', color: 'var(--v3-ink)' }}
                  title={h.titre}
                >
                  {h.asin} · {h.marketplace.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {livre && (
        <section className="mb-5 rounded-2xl border bg-white p-5" style={{ borderColor: 'var(--v3-line)' }}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="v3-serif text-[20px] font-semibold" style={{ color: 'var(--v3-ink)' }}>{livre.title}</h2>
              <p className="text-[13px]" style={{ color: 'var(--v3-muted)' }}>
                {livre.author || 'Auteur non indiqué'} · ASIN {livre.asin} · {marketplace.toUpperCase()}
              </p>
            </div>
            <a
              href={livre.amazonUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold"
              style={{ color: 'var(--v3-emerald)' }}
            >
              Voir sur Amazon <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <dl className="mt-4 grid gap-3 text-[13px] sm:grid-cols-3 lg:grid-cols-5">
            {[
              ['Prix', fmtEur(livre.price)],
              ['Note', livre.rating != null ? `${livre.rating} / 5` : 'Non disponible'],
              ['Avis', livre.reviews != null ? fmtNum(livre.reviews) : 'Non disponible'],
              ['Classement', livre.bsr != null ? `#${fmtNum(livre.bsr)}` : 'Non disponible'],
              ['Pages', livre.pages != null ? fmtNum(livre.pages) : 'Non disponible'],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded-lg border px-3 py-2" style={{ borderColor: 'var(--v3-line)' }}>
                <dt className="text-[10.5px] uppercase tracking-wider" style={{ color: 'var(--v3-muted)' }}>{k}</dt>
                <dd className="font-semibold" style={{ color: 'var(--v3-ink)' }}>{v}</dd>
              </div>
            ))}
          </dl>

          {livre.categories?.length > 0 && (
            <p className="mt-3 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
              Catégories : {livre.categories.join(' · ')}
            </p>
          )}
        </section>
      )}

      {fiche && (
        <div className="space-y-5">
          <div className="flex justify-end">
            <Button variant="outline" onClick={exporter} className="gap-1.5 border-[var(--v3-emerald)] [background:var(--v3-paper)!important] [color:var(--v3-ink)!important] hover:[background:var(--v3-emerald-50)!important] hover:[color:var(--v3-ink)!important]">
              <Download className="h-4 w-4" /> Tout exporter
            </Button>
          </div>

          <Bloc
            titre="Description de vente"
            sous={`${fiche.description.length} / ${DESC_LIMIT} caractères`}
            action={
              <Button variant="outline" size="sm" className="gap-1.5 border-[var(--v3-emerald)] [background:var(--v3-paper)!important] [color:var(--v3-ink)!important] hover:[background:var(--v3-emerald-50)!important] hover:[color:var(--v3-ink)!important]" onClick={() => copy(fiche.description, 'Description copiée')}>
                <Copy className="h-3.5 w-3.5" /> Copier
              </Button>
            }
          >
            <Textarea
              rows={14}
              value={fiche.description}
              maxLength={DESC_LIMIT}
              onChange={(e) => setFiche({ ...fiche, description: e.target.value })}
              className="text-[13.5px]"
            />
          </Bloc>

          <Bloc
            titre="7 mots-clés à saisir en coulisses"
            sous="Ces mots-clés se saisissent dans votre interface KDP : ils n'apparaissent pas sur la page du livre."
            action={
              <Button variant="outline" size="sm" className="gap-1.5 border-[var(--v3-emerald)] [background:var(--v3-paper)!important] [color:var(--v3-ink)!important] hover:[background:var(--v3-emerald-50)!important] hover:[color:var(--v3-ink)!important]" onClick={() => copy(fiche.keywords.join('\n'), 'Mots-clés copiés')}>
                <Copy className="h-3.5 w-3.5" /> Tout copier
              </Button>
            }
          >
            <ul className="space-y-2">
              {fiche.keywords.map((k, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold"
                    style={{ background: 'var(--v3-gold-soft)', color: 'var(--v3-emerald)' }}
                  >
                    {i + 1}
                  </span>
                  <Input value={k} onChange={(e) => majMot(i, e.target.value)} maxLength={50} className="font-mono text-[13px]" />
                  <span className="w-16 shrink-0 text-right text-[11px]" style={{ color: 'var(--v3-muted)' }}>{k.length} car.</span>
                    <Button variant="ghost" size="sm" className="[color:var(--v3-ink)!important] hover:[background:var(--v3-emerald-50)!important]" onClick={() => copy(k)} aria-label={`Copier le mot-clé ${i + 1}`}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
            {fiche.keywords.length !== 7 && (
              <p className="mt-3 text-[12.5px]" style={{ color: '#8a2222' }}>
                {fiche.keywords.length} mots-clés obtenus au lieu de 7 — relancez l'analyse pour compléter.
              </p>
            )}
          </Bloc>

          <Bloc titre="Contenu A+ — 4 modules" sous="Textes prêts à coller module par module dans le gestionnaire A+ d'Amazon. Le visuel reste à ajouter de votre côté.">
            <div className="space-y-4">
              {fiche.aplus.map((m, i) => (
                <div key={i} className="rounded-xl border p-4" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)' }}>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
                      <Sparkles className="h-3.5 w-3.5" /> Module {i + 1}
                    </span>
                    <Button variant="outline" size="sm" className="gap-1.5 border-[var(--v3-emerald)] [background:var(--v3-paper)!important] [color:var(--v3-ink)!important] hover:[background:var(--v3-emerald-50)!important] hover:[color:var(--v3-ink)!important]" onClick={() => copy(`${m.titre}\n\n${m.texte}\n\n[Visuel : ${m.visuel}]`, `Module ${i + 1} copié`)}>
                      <Copy className="h-3.5 w-3.5" /> Copier ce module
                    </Button>
                  </div>
                  <Input value={m.titre} onChange={(e) => majModule(i, 'titre', e.target.value)} className="mb-2 font-semibold" />
                  <Textarea rows={6} value={m.texte} onChange={(e) => majModule(i, 'texte', e.target.value)} className="text-[13px]" />
                  <div className="mt-2">
                    <Label className="text-[11px]">Suggestion de visuel</Label>
                    <Input value={m.visuel} onChange={(e) => majModule(i, 'visuel', e.target.value)} className="text-[12.5px]" />
                  </div>
                </div>
              ))}
            </div>
          </Bloc>
        </div>
      )}
    </div>
  );
}

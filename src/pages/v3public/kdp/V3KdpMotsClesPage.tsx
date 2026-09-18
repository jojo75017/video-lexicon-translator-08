import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Download, Loader2, Search, Sparkles, Tags } from 'lucide-react';
import { toast } from 'sonner';
import SelecteurLivreBiblio from '@/components/kdp/SelecteurLivreBiblio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MARKETPLACES, fetchAmazonBook } from '@/components/admin/market/marketShared';
import { callAIWriting, isAIConfigured } from '@/services/aiWritingService';

/** Historique local (10 dernières recherches). */
const STORE_KEY = 'v3:kdp:motscles:recherches';
/** Plans de lancement déjà créés — réutilisés comme point de départ. */
const PLANS_KEY = 'v3:kdp:lancement:plans';

interface Piste {
  motCle: string;
  intention: string;
  concurrence: string;
  pourquoi: string;
}

interface Analyse {
  /** 7 mots-clés backend KDP, prêts à coller. */
  backend: string[];
  pistes: Piste[];
  titres: string[];
  sousTitres: string[];
  aEviter: string[];
  conseil: string;
}

interface StoredRecherche {
  id: string;
  requete: string;
  marche: string;
  date: string;
  analyse: Analyse;
}

const lire = (): StoredRecherche[] => {
  try {
    const list = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    return Array.isArray(list) ? list.slice(0, 10) : [];
  } catch {
    return [];
  }
};

const ecrire = (list: StoredRecherche[]) => {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(list.slice(0, 10))); } catch { /* stockage indisponible */ }
};

const lirePlans = (): { titre: string; genre: string; resume: string }[] => {
  try {
    const list = JSON.parse(localStorage.getItem(PLANS_KEY) || '[]');
    if (!Array.isArray(list)) return [];
    return list
      .map((p: any) => ({
        titre: String(p?.brief?.titre || p?.titre || '').trim(),
        genre: String(p?.brief?.genre || '').trim(),
        resume: String(p?.brief?.resume || '').trim(),
      }))
      .filter((p) => p.titre);
  } catch {
    return [];
  }
};

const copier = async (texte: string, label = 'Copié') => {
  try {
    await navigator.clipboard.writeText(texte);
    toast.success(`${label} ✓`);
  } catch {
    toast.error('Copie impossible dans ce navigateur.');
  }
};

const nettoyer = (v: unknown) => String(v ?? '').trim();

export default function V3KdpMotsClesPage() {
  const [mode, setMode] = useState<'mot' | 'asin'>('mot');
  const [requete, setRequete] = useState('');
  const [asin, setAsin] = useState('');
  const [marche, setMarche] = useState('fr');
  const [contexte, setContexte] = useState('');
  const [etape, setEtape] = useState<'repos' | 'lecture' | 'analyse'>('repos');
  const [erreur, setErreur] = useState<string | null>(null);
  const [courant, setCourant] = useState<StoredRecherche | null>(null);
  const [historique, setHistorique] = useState<StoredRecherche[]>([]);
  const [plans, setPlans] = useState<{ titre: string; genre: string; resume: string }[]>([]);

  useEffect(() => {
    setHistorique(lire());
    setPlans(lirePlans());
  }, []);

  const occupe = etape !== 'repos';
  const paysLabel = useMemo(
    () => MARKETPLACES.find((m) => m.id === marche)?.label || marche,
    [marche],
  );

  const sauver = (rech: StoredRecherche) => {
    setCourant(rech);
    const suite = [rech, ...lire().filter((r) => r.id !== rech.id)].slice(0, 10);
    ecrire(suite);
    setHistorique(suite);
  };

  const analyser = async (motDepart?: string, contexteDepart?: string) => {
    const mot = nettoyer(motDepart ?? requete);
    if (mot.length < 3) {
      setErreur('Écrivez un mot-clé ou un sujet de livre (au moins 3 lettres), par exemple « journal de gratitude ».');
      return;
    }
    if (!isAIConfigured()) {
      setErreur("Aucune clé IA valide enregistrée. Ouvrez « Paramétrage des clés » puis revenez ici.");
      return;
    }
    setErreur(null);
    setRequete(mot);
    setEtape('analyse');
    try {
      const ctx = nettoyer(contexteDepart ?? contexte);
      const prompt = `Tu es spécialiste du référencement des livres sur Amazon KDP, marché ${paysLabel}.
Écris en français courant uniquement : jamais de latin, jamais de mot inventé, jamais de mot étranger décoratif.
N'invente aucun chiffre : pas de volume de recherche, pas de nombre de ventes, pas de pourcentage. Les niveaux de concurrence sont des estimations qualitatives (« faible », « moyenne », « forte ») et doivent être présentés comme telles.

Sujet de départ : ${mot}
${ctx ? `Contexte du livre : ${ctx}` : ''}

Donne :
- "backend" : exactement 7 mots-clés backend KDP, chacun de 2 à 5 mots, sans répétition du même mot principal, chacun sous 50 caractères, écrits comme un lecteur les taperait sur Amazon.
- "pistes" : 10 à 14 expressions de recherche (mélange d'expressions courtes et longues) avec "motCle", "intention" (ce que cherche le lecteur, une phrase courte), "concurrence" (faible, moyenne ou forte) et "pourquoi" (pourquoi elle vaut le coup, une phrase).
- "titres" : 5 propositions de titre percutant utilisant les meilleures expressions.
- "sousTitres" : 5 propositions de sous-titre riches en mots-clés.
- "aEviter" : 3 à 5 expressions à ne pas utiliser (marques déposées, termes interdits par Amazon, mots trop vagues) avec la raison en quelques mots.
- "conseil" : un paragraphe de 3 phrases maximum expliquant comment placer ces mots-clés dans le titre, le sous-titre, la description et les 7 champs backend.

Réponds uniquement avec ce JSON :
{"backend":["..."],"pistes":[{"motCle":"...","intention":"...","concurrence":"...","pourquoi":"..."}],"titres":["..."],"sousTitres":["..."],"aEviter":["..."],"conseil":"..."}`;

      const brut = await callAIWriting(prompt, { temperature: 0.7, jsonMode: true, maxTokens: 6000 });
      const bloc = brut.match(/\{[\s\S]*\}/);
      if (!bloc) throw new Error('Réponse illisible du moteur IA. Relancez la recherche.');
      const parsed = JSON.parse(bloc[0]);

      const analyse: Analyse = {
        backend: (parsed.backend || []).map(nettoyer).filter(Boolean).slice(0, 7),
        pistes: (parsed.pistes || [])
          .map((p: any) => ({
            motCle: nettoyer(p?.motCle),
            intention: nettoyer(p?.intention),
            concurrence: nettoyer(p?.concurrence),
            pourquoi: nettoyer(p?.pourquoi),
          }))
          .filter((p: Piste) => p.motCle),
        titres: (parsed.titres || []).map(nettoyer).filter(Boolean).slice(0, 5),
        sousTitres: (parsed.sousTitres || []).map(nettoyer).filter(Boolean).slice(0, 5),
        aEviter: (parsed.aEviter || []).map(nettoyer).filter(Boolean).slice(0, 5),
        conseil: nettoyer(parsed.conseil),
      };
      if (!analyse.pistes.length && !analyse.backend.length) {
        throw new Error("L'analyse reçue est vide. Relancez la recherche.");
      }

      sauver({ id: `${Date.now()}`, requete: mot, marche, date: new Date().toISOString(), analyse });
    } catch (e: any) {
      setErreur(e?.message || "L'analyse n'a pas abouti. Relancez-la.");
    } finally {
      setEtape('repos');
    }
  };

  const depuisAsin = async () => {
    const code = asin.trim().toUpperCase();
    if (!/^[A-Z0-9]{10}$/.test(code)) {
      setErreur("L'ASIN doit contenir 10 caractères (lettres et chiffres), sans espace.");
      return;
    }
    setErreur(null);
    setEtape('lecture');
    try {
      const livre = await fetchAmazonBook(code, marche);
      setAsin(code);
      const ctx = [livre.title, livre.categories?.slice(0, 3).join(', '), (livre.description || '').slice(0, 600)]
        .filter(Boolean)
        .join(' — ');
      setContexte(ctx);
      setEtape('repos');
      toast.success('Fiche Amazon lue — analyse des mots-clés en cours.');
      await analyser(livre.title || code, ctx);
    } catch (e: any) {
      setErreur(e?.message || "Ce livre n'a pas été trouvé sur ce marché. Vérifiez l'ASIN et le pays, ou passez par un mot-clé.");
      setEtape('repos');
    }
  };

  const texteComplet = () => {
    if (!courant) return '';
    const a = courant.analyse;
    return [
      `MOTS-CLÉS AMAZON — ${courant.requete} (${MARKETPLACES.find((m) => m.id === courant.marche)?.label || courant.marche})`,
      '',
      '=== 7 MOTS-CLÉS BACKEND (à coller dans KDP) ===',
      ...a.backend.map((k, i) => `${i + 1}. ${k}`),
      '',
      '=== EXPRESSIONS À VISER ===',
      ...a.pistes.map((p) => `- ${p.motCle} | concurrence ${p.concurrence || 'non estimée'} | ${p.intention} | ${p.pourquoi}`),
      '',
      '=== TITRES PROPOSÉS ===',
      ...a.titres.map((t) => `- ${t}`),
      '',
      '=== SOUS-TITRES PROPOSÉS ===',
      ...a.sousTitres.map((t) => `- ${t}`),
      '',
      '=== À ÉVITER ===',
      ...a.aEviter.map((t) => `- ${t}`),
      '',
      '=== COMMENT LES PLACER ===',
      a.conseil,
    ].join('\n');
  };

  const exporter = () => {
    if (!courant) return;
    const blob = new Blob([texteComplet()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mots-cles-${courant.requete.toLowerCase().replace(/[^a-z0-9]+/gi, '-').slice(0, 40) || 'livre'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const majBackend = (i: number, valeur: string) => {
    if (!courant) return;
    const backend = courant.analyse.backend.map((k, n) => (n === i ? valeur : k));
    sauver({ ...courant, analyse: { ...courant.analyse, backend } });
  };

  const btn = 'v3-btn v3-btn-primary h-10';
  const btnContour = 'gap-1.5 border-[var(--v3-action-orange)] [background:var(--v3-paper)!important] [color:var(--v3-ink)!important] hover:[background:var(--v3-action-orange)!important] hover:[color:var(--v3-action-orange-text)!important]';
  const couleurConcurrence = (c: string) => {
    const v = c.toLowerCase();
    if (v.includes('faible')) return '#1b6b3a';
    if (v.includes('forte') || v.includes('élev')) return '#8a2222';
    return 'var(--v3-gold-600)';
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <Helmet>
        <title>Recherche de mots-clés Amazon pour votre livre | Ebookstudio</title>
        <meta name="description" content="Trouvez les expressions que vos lecteurs tapent sur Amazon : 7 mots-clés backend, titres, sous-titres et expressions à viser pour votre livre KDP." />
      </Helmet>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link to="/v3/kdp" className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
          <ArrowLeft className="h-4 w-4" /> Retour à l'espace KDP
        </Link>
        <Link to="/v3/fonctionnalites/cles" className="text-[12.5px] underline" style={{ color: 'var(--v3-muted)' }}>
          Paramétrage des clés
        </Link>
      </div>

      <header className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--v3-gold-600)' }}>
          Espace KDP · page 3
        </p>
        <h1 className="v3-serif text-[30px] font-semibold" style={{ color: 'var(--v3-ink)' }}>Mots-clés percutants</h1>
        <p className="mt-1 max-w-2xl text-[14px]" style={{ color: 'var(--v3-muted)' }}>
          Partez d'un sujet ou d'un ASIN : vous obtenez les 7 mots-clés à coller dans KDP, les expressions à viser,
          des titres et sous-titres, et ce qu'il faut éviter. Aucun chiffre inventé : les niveaux de concurrence sont des estimations.
        </p>
      </header>

      <SelecteurLivreBiblio
        asinSaisi={asin}
        marketplaceSaisi={marche}
        onChoisir={(l) => {
          setAsin(l.asin);
          setMarche(l.marketplace);
          setMode('asin');
          setContexte(`${l.titre}${l.genre ? ` — ${l.genre}` : ''}\n${l.description || ''}`.trim().slice(0, 1200));
        }}
      />

      {/* Recherche */}
      <section className="mb-4 rounded-2xl border p-5" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)' }}>
        <div className="mb-3 flex flex-wrap gap-2">
          <Button size="sm" className={mode === 'mot' ? btn : btnContour} variant={mode === 'mot' ? 'default' : 'outline'} onClick={() => setMode('mot')}>
            <Search className="h-3.5 w-3.5" /> Par mot-clé
          </Button>
          <Button size="sm" className={mode === 'asin' ? btn : btnContour} variant={mode === 'asin' ? 'default' : 'outline'} onClick={() => setMode('asin')}>
            <Tags className="h-3.5 w-3.5" /> Par ASIN
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-[200px,1fr,auto] sm:items-end">
          <div>
            <Label className="text-xs">Marché Amazon</Label>
            <select
              value={marche}
              onChange={(e) => setMarche(e.target.value)}
              className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              style={{ borderColor: 'var(--v3-line)' }}
            >
              {MARKETPLACES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>
          {mode === 'mot' ? (
            <div>
              <Label className="text-xs">Mot-clé ou sujet du livre</Label>
              <Input
                value={requete}
                onChange={(e) => setRequete(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !occupe) void analyser(); }}
                placeholder="Ex : carnet de gratitude, romance historique, gestion du stress…"
              />
            </div>
          ) : (
            <div>
              <Label className="text-xs">Code ASIN d'un livre Amazon</Label>
              <Input value={asin} onChange={(e) => setAsin(e.target.value)} placeholder="B08HFDFKRFG" className="font-mono uppercase" maxLength={10} />
            </div>
          )}
          <Button
            onClick={() => (mode === 'asin' ? void depuisAsin() : void analyser())}
            disabled={occupe}
            className={btn}
          >
            {occupe ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span className="ml-1.5">Analyser</span>
          </Button>
        </div>

        <div className="mt-3">
          <Label className="text-xs">Contexte du livre (facultatif, améliore beaucoup le résultat)</Label>
          <Textarea
            rows={3}
            value={contexte}
            onChange={(e) => setContexte(e.target.value)}
            placeholder="À qui s'adresse le livre, le problème traité, le ton, le format."
            className="text-[13px]"
          />
        </div>

        {occupe && (
          <p className="mt-2 text-[13px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
            {etape === 'lecture' ? 'Lecture de la fiche Amazon…' : 'Recherche des expressions…'}
          </p>
        )}

        {erreur && (
          <div className="mt-3 rounded-lg border px-3 py-2 text-[13px]" style={{ borderColor: '#f3c2c2', background: '#fdf3f3', color: '#8a2222' }}>
            {erreur}
          </div>
        )}

        {plans.length > 0 && !occupe && (
          <div className="mt-4">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--v3-muted)' }}>
              Pas d'idée ? Partez d'un de vos livres
            </p>
            <div className="flex flex-wrap gap-1.5">
              {plans.slice(0, 6).map((p, i) => (
                <button
                  key={`${p.titre}-${i}`}
                  type="button"
                  onClick={() => {
                    const ctx = [p.genre, p.resume].filter(Boolean).join(' — ');
                    setContexte(ctx);
                    void analyser(p.genre || p.titre, ctx);
                  }}
                  className="rounded-full border px-2.5 py-1 text-[11.5px]"
                  style={{ borderColor: 'var(--v3-line)', background: '#fff', color: 'var(--v3-ink)' }}
                >
                  {p.titre}
                </button>
              ))}
            </div>
          </div>
        )}

        {historique.length > 0 && !occupe && (
          <div className="mt-4">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--v3-muted)' }}>
              Vos 10 dernières recherches
            </p>
            <div className="flex flex-wrap gap-1.5">
              {historique.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => { setCourant(r); setRequete(r.requete); setMarche(r.marche); }}
                  className="rounded-full border px-2.5 py-1 text-[11.5px]"
                  style={{ borderColor: 'var(--v3-line)', background: '#fff', color: 'var(--v3-ink)' }}
                >
                  {r.requete}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {courant && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4" style={{ borderColor: 'var(--v3-gold)', background: 'var(--v3-cream)' }}>
            <p className="text-[13.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
              Résultats pour « {courant.requete} » · {MARKETPLACES.find((m) => m.id === courant.marche)?.label || courant.marche}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className={btnContour} onClick={() => copier(texteComplet(), 'Tout copié')}>
                <Copy className="h-3.5 w-3.5" /> Tout copier
              </Button>
              <Button variant="outline" size="sm" className={btnContour} onClick={exporter}>
                <Download className="h-3.5 w-3.5" /> Tout exporter
              </Button>
            </div>
          </div>

          {/* 7 mots-clés backend */}
          {courant.analyse.backend.length > 0 && (
            <section className="rounded-2xl border bg-white p-5" style={{ borderColor: 'var(--v3-line)' }}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="v3-serif text-[19px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
                  Les 7 mots-clés à coller dans KDP
                </h2>
                <Button variant="outline" size="sm" className={btnContour} onClick={() => copier(courant.analyse.backend.join('\n'), 'Mots-clés copiés')}>
                  <Copy className="h-3.5 w-3.5" /> Copier les 7
                </Button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {courant.analyse.backend.map((k, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-5 text-right text-[12px] font-semibold" style={{ color: 'var(--v3-gold-600)' }}>{i + 1}</span>
                    <Input value={k} maxLength={50} onChange={(e) => majBackend(i, e.target.value)} className="text-[13.5px]" />
                    <Button variant="outline" size="sm" className={btnContour} onClick={() => copier(k, 'Mot-clé copié')}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
                Un mot-clé par champ dans KDP, 50 caractères maximum par champ. Vous pouvez les modifier ici avant de les copier.
              </p>
            </section>
          )}

          {/* Expressions */}
          {courant.analyse.pistes.length > 0 && (
            <section className="rounded-2xl border bg-white p-5" style={{ borderColor: 'var(--v3-line)' }}>
              <h2 className="v3-serif mb-1 text-[19px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>Expressions à viser</h2>
              <p className="mb-3 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
                La concurrence indiquée est une estimation, pas une mesure. Cliquez une expression pour l'analyser à son tour.
              </p>
              <div className="space-y-2">
                {courant.analyse.pistes.map((p, i) => (
                  <div key={i} className="rounded-xl border p-3" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)' }}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => void analyser(p.motCle, contexte)}
                        className="text-left text-[14px] font-semibold underline"
                        style={{ color: 'var(--v3-ink)' }}
                      >
                        {p.motCle}
                      </button>
                      <div className="flex items-center gap-2">
                        {p.concurrence && (
                          <span className="rounded-full border px-2 py-0.5 text-[11.5px] font-semibold"
                            style={{ borderColor: 'var(--v3-line)', background: '#fff', color: couleurConcurrence(p.concurrence) }}>
                            concurrence {p.concurrence}
                          </span>
                        )}
                        <Button variant="outline" size="sm" className={btnContour} onClick={() => copier(p.motCle, 'Expression copiée')}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    {(p.intention || p.pourquoi) && (
                      <p className="mt-1 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
                        {[p.intention, p.pourquoi].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Titres / sous-titres */}
          {(courant.analyse.titres.length > 0 || courant.analyse.sousTitres.length > 0) && (
            <section className="grid gap-4 sm:grid-cols-2">
              {[
                { titre: 'Titres proposés', items: courant.analyse.titres },
                { titre: 'Sous-titres proposés', items: courant.analyse.sousTitres },
              ].map((bloc) => bloc.items.length > 0 && (
                <div key={bloc.titre} className="rounded-2xl border bg-white p-5" style={{ borderColor: 'var(--v3-line)' }}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h2 className="v3-serif text-[18px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>{bloc.titre}</h2>
                    <Button variant="outline" size="sm" className={btnContour} onClick={() => copier(bloc.items.join('\n'), 'Copié')}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <ul className="space-y-1.5 text-[13.5px]" style={{ color: 'var(--v3-ink)' }}>
                    {bloc.items.map((t, i) => (
                      <li key={i} className="flex gap-2"><span style={{ color: 'var(--v3-gold-600)' }}>•</span> {t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* À éviter + conseil */}
          {(courant.analyse.aEviter.length > 0 || courant.analyse.conseil) && (
            <section className="rounded-2xl border bg-white p-5" style={{ borderColor: 'var(--v3-line)' }}>
              {courant.analyse.aEviter.length > 0 && (
                <>
                  <h2 className="v3-serif mb-2 text-[18px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>À éviter</h2>
                  <ul className="mb-3 space-y-1.5 text-[13.5px]" style={{ color: 'var(--v3-ink)' }}>
                    {courant.analyse.aEviter.map((t, i) => (
                      <li key={i} className="flex gap-2"><span style={{ color: '#8a2222' }}>•</span> {t}</li>
                    ))}
                  </ul>
                </>
              )}
              {courant.analyse.conseil && (
                <>
                  <h2 className="v3-serif mb-1 text-[18px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>Comment les placer</h2>
                  <p className="text-[13.5px]" style={{ color: 'var(--v3-ink)' }}>{courant.analyse.conseil}</p>
                </>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

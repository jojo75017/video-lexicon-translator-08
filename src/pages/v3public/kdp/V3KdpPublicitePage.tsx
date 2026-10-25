import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Download, Loader2, Megaphone, Sparkles, Tags } from 'lucide-react';
import { toast } from 'sonner';
import SelecteurLivreBiblio from '@/components/kdp/SelecteurLivreBiblio';
import ConcurrentsBibliotheque from '@/components/kdp/ConcurrentsBibliotheque';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MARKETPLACES, fetchAmazonBook } from '@/components/admin/market/marketShared';
import AdsProfitSimulator from '@/components/kdp/AdsProfitSimulator';
import { ADS_CAMPAIGN_TYPES, ADS_LEVELS, approvedCompetitorAsins, splitDailyBudget, type AdsLevel } from '@/lib/kdp/adsPlan';
import { callAIWriting, isAIConfigured } from '@/services/aiWritingService';

/** Historique local (10 derniers résumés publicitaires). */
const STORE_KEY = 'v3:kdp:publicite:resumes';
/** Plans de lancement déjà créés — réutilisés comme point de départ. */
const PLANS_KEY = 'v3:kdp:lancement:plans';

interface Campagne {
  nom: string;
  ciblage: string;
  objectif: string;
  motsCles: string[];
  asins: string[];
  budgetJour: string;
  enchere: string;
  aSurveiller: string;
}

interface Resume {
  livre: string;
  asin: string;
  promesse: string;
  lecteur: string;
  campagnes: Campagne[];
  negatifs: string[];
  etapes: string[];
  prudence: string;
}

interface StoredResume {
  id: string;
  titre: string;
  marche: string;
  date: string;
  resume: Resume;
  dailyBudget?: number;
  level?: AdsLevel;
}

const lire = (): StoredResume[] => {
  try {
    const list = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    return Array.isArray(list) ? list.slice(0, 10) : [];
  } catch {
    return [];
  }
};

const ecrire = (list: StoredResume[]) => {
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
const liste = (v: unknown, max = 30): string[] =>
  (Array.isArray(v) ? v : []).map(nettoyer).filter(Boolean).slice(0, max);

export default function V3KdpPublicitePage() {
  const [mode, setMode] = useState<'livre' | 'asin'>('livre');
  const [titre, setTitre] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [asin, setAsin] = useState('');
  const [concurrents, setConcurrents] = useState('');
  const [marche, setMarche] = useState('fr');
  const [niveau, setNiveau] = useState<AdsLevel>('debutant');
  const [budget, setBudget] = useState('');
  const [etape, setEtape] = useState<'repos' | 'lecture' | 'analyse'>('repos');
  const [erreur, setErreur] = useState<string | null>(null);
  const [courant, setCourant] = useState<StoredResume | null>(null);
  const [historique, setHistorique] = useState<StoredResume[]>([]);
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

  const sauver = (r: StoredResume) => {
    setCourant(r);
    const suite = [r, ...lire().filter((x) => x.id !== r.id)].slice(0, 10);
    ecrire(suite);
    setHistorique(suite);
  };

  const preparer = async (depart?: { titre: string; genre: string; description: string; asin?: string }) => {
    const t = nettoyer(depart?.titre ?? titre);
    const g = nettoyer(depart?.genre ?? genre);
    const d = nettoyer(depart?.description ?? description);
    const a = nettoyer(depart?.asin ?? asin).toUpperCase();

    if (t.length < 2) {
      setErreur('Indiquez le titre de votre livre (ou son ASIN) pour préparer les campagnes.');
      return;
    }
    if (d.length < 40) {
      setErreur('Décrivez votre livre en quelques phrases (au moins 40 caractères) : sujet, lecteur visé, bénéfice.');
      return;
    }
    let budgets: number[];
    try { budgets = splitDailyBudget(Number(budget)); } catch (error) {
      setErreur(error instanceof Error ? error.message : 'Budget invalide.'); return;
    }
    if (!isAIConfigured()) {
      setErreur("Aucune clé IA valide enregistrée. Ouvrez « Paramétrage des clés » puis revenez ici.");
      return;
    }

    setErreur(null);
    setTitre(t); setGenre(g); setDescription(d);
    setEtape('analyse');

    try {
      const rivaux = approvedCompetitorAsins(concurrents).slice(0, 30);
      const prompt = `Tu es consultant en publicité Amazon Ads pour des auteurs indépendants, marché ${paysLabel}.
Écris en français courant uniquement : jamais de latin, jamais de mot inventé, jamais de mot étranger décoratif.
N'invente aucune donnée mesurée : pas de volume de recherche, pas de nombre de ventes, pas de taux de clic, pas de pourcentage chiffré. Les budgets et enchères sont des fourchettes de départ prudentes présentées comme des suggestions à ajuster (en euros par jour pour le budget, en euros par clic pour l'enchère).

Livre : ${t}
${g ? `Genre / sujet : ${g}` : ''}
Description : ${d}
${a ? `ASIN du livre : ${a}` : ''}
${rivaux.length ? `ASIN de livres concurrents fournis par l'auteur : ${rivaux.join(', ')}` : ''}

Prépare un résumé publicitaire avec exactement 3 campagnes Sponsored Products dans cet ordre : automatique, mots-clés exacts, produits/ASIN concurrents. Niveau de conseils : ${ADS_LEVELS[niveau]} (ce niveau ne change ni le budget ni le nombre de campagnes).
Budget TOTAL demandé par l'auteur : ${budget} EUR/jour, réparti ${budgets.join(' / ')} EUR/jour. Ne le multiplie pas par 3. Aucun lancement automatique.
Pour les mots-clés exacts, propose 25 expressions pertinentes sans prétendre connaître leur volume de recherche. Pour les produits, utilise exclusivement les ASIN fournis ; sans ASIN, liste vide et conseil d'en sélectionner dans Amazon Ads. Ne propose pas Sponsored Brands.

Pour chaque campagne : "nom" (nom clair à recopier dans Amazon Ads), "ciblage" (automatique, mots-clés exacts, expression, large, ou produits), "objectif" (une phrase : ce que cette campagne va chercher), "motsCles" (25 expressions, vide pour une campagne automatique), "asins" (ASIN concurrents à cibler quand c'est une campagne produits, sinon vide — n'utilise que des ASIN fournis par l'auteur, n'en invente aucun), "budgetJour" (montant attribué parmi les trois budgets indiqués), "enchere" (fourchette de départ), "aSurveiller" (la seule chose à regarder dans cette campagne).

Ajoute aussi :
- "promesse" : en une phrase, l'argument de vente que la publicité doit porter.
- "lecteur" : à qui les annonces doivent s'adresser.
- "negatifs" : 6 à 12 mots-clés à exclure pour ne pas payer des clics inutiles.
- "etapes" : 5 étapes concrètes, dans l'ordre, pour créer ces campagnes dans Amazon Ads puis les ajuster les premières semaines.
- "prudence" : un paragraphe de 3 phrases maximum rappelant qu'on démarre petit, qu'on laisse tourner avant de juger, et qu'aucun résultat n'est garanti.

Réponds uniquement avec ce JSON :
{"promesse":"...","lecteur":"...","campagnes":[{"nom":"...","ciblage":"...","objectif":"...","motsCles":["..."],"asins":["..."],"budgetJour":"...","enchere":"...","aSurveiller":"..."}],"negatifs":["..."],"etapes":["..."],"prudence":"..."}`;

      const brut = await callAIWriting(prompt, { temperature: 0.65, jsonMode: true, maxTokens: 6000 });
      const bloc = brut.match(/\{[\s\S]*\}/);
      if (!bloc) throw new Error('Réponse illisible du moteur IA. Relancez la préparation.');
      const parsed = JSON.parse(bloc[0]);

      if (!Array.isArray(parsed.campagnes) || parsed.campagnes.length !== 3) throw new Error('Le moteur doit fournir les trois campagnes. Relancez la préparation.');
      const resume: Resume = {
        livre: t,
        asin: a,
        promesse: nettoyer(parsed.promesse),
        lecteur: nettoyer(parsed.lecteur),
        campagnes: (parsed.campagnes || [])
          .map((c: any, index: number) => ({
            nom: nettoyer(c?.nom),
            ciblage: ADS_CAMPAIGN_TYPES[index],
            objectif: nettoyer(c?.objectif),
            motsCles: index === 1 ? liste(c?.motsCles, 25) : [],
            asins: index === 2 ? rivaux : [],
            budgetJour: `${budgets[index].toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €/jour`,
            enchere: nettoyer(c?.enchere),
            aSurveiller: nettoyer(c?.aSurveiller),
          }))
          .filter((c: Campagne) => c.nom),
        negatifs: liste(parsed.negatifs, 12),
        etapes: liste(parsed.etapes, 8),
        prudence: nettoyer(parsed.prudence),
      };

      if (resume.campagnes.length !== 3) throw new Error('Le résumé reçu est vide. Relancez la préparation.');

      sauver({ id: `${Date.now()}`, titre: t, marche, date: new Date().toISOString(), resume, dailyBudget: Number(budget), level: niveau });
    } catch (e: any) {
      setErreur(e?.message || "La préparation n'a pas abouti. Relancez-la.");
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
      const g = (livre.categories || []).slice(0, 2).join(', ');
      const d = (livre.description || '').slice(0, 1200);
      setTitre(livre.title || code);
      setGenre(g);
      setDescription(d);
      setEtape('repos');
      toast.success('Fiche Amazon lue — préparation des campagnes en cours.');
      await preparer({ titre: livre.title || code, genre: g, description: d, asin: code });
    } catch (e: any) {
      setErreur(e?.message || "Ce livre n'a pas été trouvé sur ce marché. Vérifiez l'ASIN et le pays, ou remplissez le formulaire.");
      setEtape('repos');
    }
  };

  const texteComplet = () => {
    if (!courant) return '';
    const r = courant.resume;
    return [
      `PUBLICITÉ AMAZON — ${r.livre}${r.asin ? ` (${r.asin})` : ''} · ${MARKETPLACES.find((m) => m.id === courant.marche)?.label || courant.marche}`,
      '',
      `Promesse à porter : ${r.promesse}`,
      `Lecteur visé : ${r.lecteur}`,
      '',
      '=== CAMPAGNES ===',
      ...r.campagnes.flatMap((c) => [
        `• ${c.nom} — ciblage ${c.ciblage}`,
        `  Objectif : ${c.objectif}`,
        c.motsCles.length ? `  Mots-clés : ${c.motsCles.join(' | ')}` : '',
        c.asins.length ? `  ASIN à cibler : ${c.asins.join(', ')}` : '',
        `  Budget de départ : ${c.budgetJour} · Enchère de départ : ${c.enchere}`,
        `  À surveiller : ${c.aSurveiller}`,
        '',
      ]).filter(Boolean),
      '=== MOTS-CLÉS À EXCLURE ===',
      ...r.negatifs.map((n) => `- ${n}`),
      '',
      '=== ÉTAPES ===',
      ...r.etapes.map((e, i) => `${i + 1}. ${e}`),
      '',
      '=== À GARDER EN TÊTE ===',
      r.prudence,
    ].join('\n');
  };

  const exporter = () => {
    if (!courant) return;
    const blob = new Blob([texteComplet()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `publicite-amazon-${courant.titre.toLowerCase().replace(/[^a-z0-9]+/gi, '-').slice(0, 40) || 'livre'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const btn = 'v3-btn v3-btn-primary h-10';
  const btnContour = 'gap-1.5 border-[var(--v3-action-orange)] [background:var(--v3-paper)!important] [color:var(--v3-ink)!important] hover:[background:var(--v3-action-orange)!important] hover:[color:var(--v3-action-orange-text)!important]';

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <Helmet>
        <title>Publicité Amazon pour votre livre — résumé de campagnes | Ebookstudio</title>
        <meta name="description" content="Préparez vos publicités Amazon à partir de votre livre ou de son ASIN : campagnes, mots-clés, ASIN concurrents à cibler, budgets de départ et étapes." />
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
          Espace KDP · page 4
        </p>
        <h1 className="v3-serif text-[30px] font-semibold" style={{ color: 'var(--v3-ink)' }}>Amazon Ads — plan de trois campagnes</h1>
        <p className="mt-1 max-w-2xl text-[14px]" style={{ color: 'var(--v3-muted)' }}>
          Partez de votre livre ou de son ASIN : vous recevez un résumé de publicité prêt à recopier dans Amazon Ads —
          campagnes, mots-clés, ASIN concurrents à cibler, budgets de départ et mots-clés à exclure.
          Plans à recopier : aucune campagne n’est lancée et aucune dépense n’est engagée depuis cette page.
        </p>
      </header>

      <SelecteurLivreBiblio
        asinSaisi={asin}
        marketplaceSaisi={marche}
        onChoisir={(l) => {
          setAsin(l.asin);
          setMarche(l.marketplace);
          setTitre(l.titre || '');
          setGenre(l.genre || '');
          setDescription(l.description || '');
        }}
      />

      <ConcurrentsBibliotheque
        marche={marche}
        valeur={concurrents}
        onChange={setConcurrents}
      />

      <section className="mb-4 rounded-lg border p-5" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)' }}>
        <div className="mb-3 flex flex-wrap gap-2">
          <Button size="sm" className={mode === 'livre' ? btn : btnContour} variant={mode === 'livre' ? 'default' : 'outline'} onClick={() => setMode('livre')}>
            <Megaphone className="h-3.5 w-3.5" /> Décrire mon livre
          </Button>
          <Button size="sm" className={mode === 'asin' ? btn : btnContour} variant={mode === 'asin' ? 'default' : 'outline'} onClick={() => setMode('asin')}>
            <Tags className="h-3.5 w-3.5" /> Partir d'un ASIN
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label className="text-xs">Marché Amazon</Label>
            <select
              value={marche}
              onChange={(e) => setMarche(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              style={{ borderColor: 'var(--v3-line)' }}
            >
              {MARKETPLACES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-xs">ASIN de votre livre {mode === 'livre' && '(facultatif)'}</Label>
            <Input value={asin} onChange={(e) => setAsin(e.target.value)} placeholder="B08HFDFKRFG" className="font-mono uppercase" maxLength={10} />
          </div>
          {mode === 'livre' && (
            <>
              <div>
                <Label className="text-xs">Titre du livre</Label>
                <Input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex : Le carnet de gratitude en 5 minutes" />
              </div>
              <div>
                <Label className="text-xs">Genre ou sujet principal</Label>
                <Input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Ex : développement personnel, romance historique…" />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Description du livre ({description.length} caractères, 40 minimum)</Label>
                <Textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Sujet, lecteur visé, contenu principal, bénéfice pour le lecteur, problème résolu."
                  className="text-[13px]"
                />
              </div>
            </>
          )}
          <div className="sm:col-span-2">
            <Label className="text-xs">ASIN de livres concurrents à cibler (facultatif, un par ligne ou séparés par des virgules)</Label>
            <Textarea
              rows={2}
              value={concurrents}
              onChange={(e) => setConcurrents(e.target.value)}
              placeholder="B0F7S92DMQ, B0H9TQLRFP"
              className="font-mono text-[13px] uppercase"
            />
            <p className="mt-1 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
              Seuls les ASIN que vous indiquez ici pourront être ciblés : aucun code n'est inventé.
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div>
            <Label className="text-xs">Niveau des conseils</Label>
            <div className="mt-1 flex gap-2">
              {(Object.entries(ADS_LEVELS) as [AdsLevel, string][]).map(([v, l]) => (
                <Button
                  key={v}
                  size="sm"
                  variant={niveau === v ? 'default' : 'outline'}
                  aria-pressed={niveau === v}
                  className="v3-chip-toggle h-10"
                  onClick={() => setNiveau(v)}
                >
                  {l}
                </Button>
              ))}
            </div>
          </div>
          <div><Label htmlFor="ads-budget">Budget total des 3 campagnes (€ / jour)</Label><Input id="ads-budget" type="number" min="0.03" step="0.01" value={budget} onChange={e => setBudget(e.target.value)} placeholder="Votre budget total" /></div>
          <Button onClick={() => (mode === 'asin' ? void depuisAsin() : void preparer())} disabled={occupe} className={btn}>
            {occupe ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span className="ml-1.5">Préparer mes publicités</span>
          </Button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">Le budget est réparti entre les trois campagnes. C’est un montant quotidien moyen, pas un plafond garanti ; vérifiez les règles Amazon avant activation. Un test de 30 jours est conseillé, sans garantie de vente.</p>
        {occupe && (
          <p className="mt-2 text-[13px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
            {etape === 'lecture' ? 'Lecture de la fiche Amazon…' : 'Préparation des campagnes…'}
          </p>
        )}

        {erreur && (
          <div className="mt-3 rounded-lg border px-3 py-2 text-[13px]" style={{ borderColor: 'hsl(var(--destructive))', background: 'hsl(var(--background))', color: 'hsl(var(--destructive))' }}>
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
                <Button variant="outline" size="sm"
                  key={`${p.titre}-${i}`}
                  type="button"
                  onClick={() => { setMode('livre'); setTitre(p.titre); setGenre(p.genre); setDescription(p.resume); }}
                  className="rounded-full border px-2.5 py-1 text-[11.5px]"
                  style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-paper)', color: 'var(--v3-ink)' }}
                >
                  {p.titre}
                </Button>
              ))}
            </div>
          </div>
        )}

        {historique.length > 0 && !occupe && (
          <div className="mt-4">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--v3-muted)' }}>
              Vos 10 derniers résumés
            </p>
            <div className="flex flex-wrap gap-1.5">
              {historique.map((r) => (
                <Button variant="outline" size="sm"
                  key={r.id}
                  type="button"
                  onClick={() => { setCourant(r); setTitre(r.titre); setMarche(r.marche); if (r.dailyBudget) setBudget(String(r.dailyBudget)); }}
                  className="rounded-full border px-2.5 py-1 text-[11.5px]"
                  style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-paper)', color: 'var(--v3-ink)' }}
                >
                  {r.titre}
                </Button>
              ))}
            </div>
          </div>
        )}
      </section>

      {courant && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4" style={{ borderColor: 'var(--v3-gold)', background: 'var(--v3-cream)' }}>
            <div>
              <p className="text-[13.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
                Plan de campagnes généré — « {courant.resume.livre} »{courant.resume.asin ? ` · ${courant.resume.asin}` : ''}
              </p>
              <p className="text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
                {MARKETPLACES.find((m) => m.id === courant.marche)?.label || courant.marche} · {courant.resume.campagnes.length} campagnes · {courant.dailyBudget ? `${courant.dailyBudget} €/jour au total · Test conseillé : 30 jours` : 'Ancien plan enregistré'} · {ADS_LEVELS[courant.level ?? 'debutant']}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className={btnContour} onClick={() => copier(texteComplet(), 'Tout copié')}>
                <Copy className="h-3.5 w-3.5" /> Tout copier
              </Button>
              <Button variant="outline" size="sm" className={btnContour} onClick={exporter}>
                <Download className="h-3.5 w-3.5" /> Tout exporter
              </Button>
            </div>
          </div>

          <div role="note" className="border-l-4 border-primary bg-secondary/40 p-4 text-sm">Aucune performance n’est garantie. Vérifiez les mots-clés, les ASIN et les enchères dans Amazon Ads. Les campagnes préparées ici ne sont pas des campagnes actives.</div>
          {(courant.resume.promesse || courant.resume.lecteur) && (
            <section className="grid gap-4 sm:grid-cols-2">
              {[
                { t: 'La promesse à porter', v: courant.resume.promesse },
                { t: 'Le lecteur visé', v: courant.resume.lecteur },
              ].map((b) => b.v && (
                <div key={b.t} className="rounded-lg border bg-background p-5" style={{ borderColor: 'var(--v3-line)' }}>
                  <h2 className="v3-serif mb-1 text-[18px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>{b.t}</h2>
                  <p className="text-[13.5px]" style={{ color: 'var(--v3-ink)' }}>{b.v}</p>
                </div>
              ))}
            </section>
          )}

          <section className="grid items-start gap-4 md:grid-cols-2">
            {courant.resume.campagnes.map((c, i) => (
              <div key={i} className="rounded-lg border bg-background p-5" style={{ borderColor: 'var(--v3-line)' }}>
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="v3-serif text-[19px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>{c.nom}</h2>
                    <p className="text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>Ciblage {c.ciblage} · {c.objectif}</p>
                  </div>
                  <Button variant="outline" size="sm" className={btnContour} onClick={() => copier(c.nom, 'Nom copié')}>
                    <Copy className="h-3.5 w-3.5" /> Nom
                  </Button>
                </div>

                <div className="mb-3 flex flex-wrap gap-2 text-[12.5px]">
                  {c.budgetJour && (
                    <span className="rounded-full border px-2.5 py-0.5" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)', color: 'var(--v3-ink)' }}>
                      Budget de départ : {c.budgetJour}
                    </span>
                  )}
                  {c.enchere && (
                    <span className="rounded-full border px-2.5 py-0.5" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)', color: 'var(--v3-ink)' }}>
                      Enchère de départ : {c.enchere}
                    </span>
                  )}
                </div>

                {c.motsCles.length > 0 && (
                  <div className="mb-3">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--v3-muted)' }}>
                        Mots-clés à recopier ({c.motsCles.length})
                      </p>
                      <Button variant="outline" size="sm" className={btnContour} onClick={() => copier(c.motsCles.join('\n'), 'Mots-clés copiés')}>
                        <Copy className="h-3.5 w-3.5" /> Copier la liste
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {c.motsCles.map((k, n) => (
                        <span key={n} className="rounded-full border px-2.5 py-1 text-[12px]" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)', color: 'var(--v3-ink)' }}>
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {c.asins.length > 0 && (
                  <div className="mb-3">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--v3-muted)' }}>
                        Livres concurrents à cibler
                      </p>
                      <Button variant="outline" size="sm" className={btnContour} onClick={() => copier(c.asins.join('\n'), 'ASIN copiés')}>
                        <Copy className="h-3.5 w-3.5" /> Copier les ASIN
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {c.asins.map((a, n) => (
                        <span key={n} className="rounded-full border px-2.5 py-1 font-mono text-[12px]" style={{ borderColor: 'var(--v3-gold)', background: 'var(--v3-paper)', color: 'var(--v3-ink)' }}>
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {c.ciblage === 'automatique' && <p className="mb-3 text-sm text-muted-foreground">Amazon sélectionne les recherches à partir de la fiche du livre. Aucun mot-clé à saisir pour ce ciblage.</p>}
                {c.ciblage === 'produits' && !c.asins.length && <p className="mb-3 text-sm text-muted-foreground">Aucun ASIN concurrent fourni. Choisissez des livres réellement comparables dans votre bibliothèque ou dans Amazon Ads avant de lancer cette campagne.</p>}
                <p className="mb-3 text-xs text-muted-foreground">Enchères suggérées, non mesurées. Vérifiez les réglages d’enchères dans Amazon Ads.</p>
                {c.aSurveiller && (
                  <p className="text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
                    À surveiller : {c.aSurveiller}
                  </p>
                )}
              </div>
            ))}
          </section>

          {courant.resume.negatifs.length > 0 && (
            <section className="rounded-lg border bg-background p-5" style={{ borderColor: 'var(--v3-line)' }}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h2 className="v3-serif text-[19px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>Mots-clés à exclure</h2>
                <Button variant="outline" size="sm" className={btnContour} onClick={() => copier(courant.resume.negatifs.join('\n'), 'Liste copiée')}>
                  <Copy className="h-3.5 w-3.5" /> Copier la liste
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {courant.resume.negatifs.map((n, i) => (
                  <span key={i} className="rounded-full border px-2.5 py-1 text-[12px]" style={{ borderColor: 'hsl(var(--destructive))', background: 'hsl(var(--background))', color: 'hsl(var(--destructive))' }}>
                    {n}
                  </span>
                ))}
              </div>
            </section>
          )}

          {courant.resume.etapes.length > 0 && (
            <section className="rounded-lg border bg-background p-5" style={{ borderColor: 'var(--v3-line)' }}>
              <h2 className="v3-serif mb-2 text-[19px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>Dans quel ordre avancer</h2>
              <ol className="space-y-1.5 text-[13.5px]" style={{ color: 'var(--v3-ink)' }}>
                {courant.resume.etapes.map((e, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-semibold" style={{ color: 'var(--v3-gold-600)' }}>{i + 1}.</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {courant.dailyBudget && <AdsProfitSimulator key={courant.id} daily={courant.dailyBudget} />}
          <nav className="flex flex-wrap gap-4 text-sm text-primary"><Link to="/v3/kdp/fiche-audit">Audit de la fiche produit →</Link><Link to="/v3/kdp/mots-cles">Analyse des mots-clés →</Link><Link to="/v3/kdp/lancement">Plan de lancement →</Link></nav>
          {courant.resume.prudence && (
            <section className="rounded-lg border p-5" style={{ borderColor: 'var(--v3-gold)', background: 'var(--v3-cream)' }}>
              <h2 className="v3-serif mb-1 text-[18px] font-semibold" style={{ color: 'var(--v3-ink)' }}>À garder en tête</h2>
              <p className="text-[13.5px]" style={{ color: 'var(--v3-muted)' }}>{courant.resume.prudence}</p>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

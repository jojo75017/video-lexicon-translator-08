import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarCheck, Copy, Download, Loader2, Rocket, Search } from 'lucide-react';
import { toast } from 'sonner';
import SelecteurLivreBiblio from '@/components/kdp/SelecteurLivreBiblio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MARKETPLACES, fetchAmazonBook } from '@/components/admin/market/marketShared';
import { callAIWriting, isAIConfigured } from '@/services/aiWritingService';
import {
  LAUNCH_BOOK_TYPES,
  LAUNCH_BRIEF_VIDE,
  LAUNCH_FORMATS,
  LAUNCH_WEEKS,
  RESUME_LIMIT,
  type LaunchBrief,
  type LaunchDay,
  type LaunchPlan,
} from '@/data/kdpLaunchPlan';

const STORE_KEY = 'v3:kdp:lancement:plans';

interface StoredPlan {
  id: string;
  titre: string;
  date: string;
  brief: LaunchBrief;
  plan: LaunchPlan;
  faits: number[];
}

const lire = (): StoredPlan[] => {
  try {
    const list = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    return Array.isArray(list) ? list.slice(0, 5) : [];
  } catch {
    return [];
  }
};

const ecrire = (list: StoredPlan[]) => {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(list.slice(0, 5))); } catch { /* stockage indisponible */ }
};

const copier = async (texte: string, label = 'Copié') => {
  try {
    await navigator.clipboard.writeText(texte);
    toast.success(`${label} ✓`);
  } catch {
    toast.error('Copie impossible dans ce navigateur.');
  }
};

const texteJour = (j: LaunchDay) =>
  `Jour ${j.jour} — ${j.action}${j.canal ? `\nCanal : ${j.canal}` : ''}${j.duree ? `\nTemps : ${j.duree}` : ''}${j.texte ? `\n\n${j.texte}` : ''}`;

export default function V3KdpLancementPage() {
  const [asin, setAsin] = useState('');
  const [marketplace, setMarketplace] = useState('fr');
  const [brief, setBrief] = useState<LaunchBrief>(LAUNCH_BRIEF_VIDE);
  const [etape, setEtape] = useState<'repos' | 'lecture' | 'redaction'>('repos');
  const [erreur, setErreur] = useState<string | null>(null);
  const [courant, setCourant] = useState<StoredPlan | null>(null);
  const [plans, setPlans] = useState<StoredPlan[]>([]);

  useEffect(() => { setPlans(lire()); }, []);

  const occupe = etape !== 'repos';
  const majBrief = (champ: keyof LaunchBrief, valeur: string) => setBrief((b) => ({ ...b, [champ]: valeur }));

  const total = useMemo(
    () => courant?.plan.semaines.reduce((n, s) => n + s.jours.length, 0) ?? 0,
    [courant],
  );

  const sauver = (maj: StoredPlan) => {
    setCourant(maj);
    const suite = [maj, ...lire().filter((p) => p.id !== maj.id)].slice(0, 5);
    ecrire(suite);
    setPlans(suite);
  };

  /** Préremplir le formulaire à partir d'un ASIN réel. */
  const remplirDepuisAsin = async () => {
    const code = asin.trim().toUpperCase();
    if (!/^[A-Z0-9]{10}$/.test(code)) {
      setErreur("L'ASIN doit contenir 10 caractères (lettres et chiffres), par exemple B08HFDFKRFG sans espace.");
      return;
    }
    setErreur(null);
    setEtape('lecture');
    try {
      const livre = await fetchAmazonBook(code, marketplace);
      setAsin(code);
      setBrief((b) => ({
        ...b,
        titre: livre.title || b.titre,
        genre: livre.categories?.[0] || b.genre,
        resume: (livre.description || b.resume).slice(0, RESUME_LIMIT),
        prix: livre.price != null ? String(livre.price) : b.prix,
        lienVente: livre.amazonUrl || b.lienVente,
      }));
      toast.success('Fiche Amazon lue — vérifiez et complétez les champs.');
    } catch (e: any) {
      setErreur(e?.message || "Ce livre n'a pas été trouvé sur ce marché. Vérifiez l'ASIN et le pays choisi, ou remplissez le formulaire à la main.");
    } finally {
      setEtape('repos');
    }
  };

  const creerPlan = async () => {
    if (!brief.titre.trim() || !brief.genre.trim()) {
      setErreur('Le titre et le sujet principal sont nécessaires pour créer le plan.');
      return;
    }
    if (!isAIConfigured()) {
      setErreur("Aucune clé IA valide enregistrée. Ouvrez « Paramétrage des clés » puis revenez ici.");
      return;
    }
    setErreur(null);
    setEtape('redaction');
    try {
      const prompt = `Tu es spécialiste du lancement de livres sur Amazon KDP. Écris en français courant uniquement : jamais de latin, jamais de mot inventé, jamais de mot étranger décoratif.

Livre :
Titre : ${brief.titre}
${brief.sousTitre ? `Sous-titre : ${brief.sousTitre}` : ''}
Type : ${brief.type}
Sujet principal : ${brief.genre}
${brief.resume ? `Résumé : ${brief.resume}` : ''}
${brief.dateSortie ? `Date de sortie : ${brief.dateSortie}` : ''}
${brief.prix ? `Prix : ${brief.prix} €` : ''}
Format : ${brief.format}
${brief.audience ? `Audience visée : ${brief.audience}` : ''}
${brief.lienVente ? `Lien de vente : ${brief.lienVente}` : ''}

Construis un plan de lancement sur 30 jours, en 4 semaines exactement :
Semaine 1 « Préparer » jours 1 à 7, semaine 2 « Faire parler » jours 8 à 14, semaine 3 « Vendre » jours 15 à 21, semaine 4 « Installer la durée » jours 22 à 30.
Chaque jour a : "jour" (numéro), "action" (une action concrète, une phrase), "canal" (email, réseau social, Amazon, avis lecteurs, communauté, hors ligne), "duree" (par exemple « 30 min »), "texte" (un message prêt à publier ou à envoyer quand c'est utile, sinon une chaîne vide).
Donne aussi "objectifs" : 4 à 6 repères à surveiller (avis à obtenir, classement visé, mots-clés à suivre), formulés comme des repères et jamais comme des promesses de revenus.

Réponds uniquement avec ce JSON :
{"semaines":[{"titre":"Préparer","jours":[{"jour":1,"action":"...","canal":"...","duree":"...","texte":"..."}]}],"objectifs":["..."]}`;

      const brut = await callAIWriting(prompt, { temperature: 0.7, jsonMode: true, maxTokens: 8192 });
      const bloc = brut.match(/\{[\s\S]*\}/);
      if (!bloc) throw new Error('Réponse illisible du moteur IA. Relancez la création du plan.');
      const parsed = JSON.parse(bloc[0]) as LaunchPlan;

      const semaines = (parsed.semaines || []).slice(0, 4).map((s, i) => ({
        titre: String(s?.titre || LAUNCH_WEEKS[i]?.titre || `Semaine ${i + 1}`),
        jours: (s?.jours || []).map((j, k) => ({
          jour: Number(j?.jour) || i * 7 + k + 1,
          action: String(j?.action || '').trim(),
          canal: String(j?.canal || '').trim(),
          duree: String(j?.duree || '').trim(),
          texte: String(j?.texte || '').trim(),
        })),
      }));
      if (!semaines.length) throw new Error("Le plan reçu est vide. Relancez la création.");

      sauver({
        id: `${Date.now()}`,
        titre: brief.titre,
        date: new Date().toISOString(),
        brief,
        plan: { semaines, objectifs: (parsed.objectifs || []).map((o) => String(o).trim()).filter(Boolean) },
        faits: [],
      });
    } catch (e: any) {
      setErreur(e?.message || "La création du plan n'a pas abouti. Relancez-la.");
    } finally {
      setEtape('repos');
    }
  };

  const basculerJour = (jour: number) => {
    if (!courant) return;
    const faits = courant.faits.includes(jour) ? courant.faits.filter((j) => j !== jour) : [...courant.faits, jour];
    sauver({ ...courant, faits });
  };

  const majJour = (si: number, ji: number, champ: keyof LaunchDay, valeur: string) => {
    if (!courant) return;
    const semaines = courant.plan.semaines.map((s, i) =>
      i !== si ? s : { ...s, jours: s.jours.map((j, k) => (k === ji ? { ...j, [champ]: valeur } : j)) },
    );
    sauver({ ...courant, plan: { ...courant.plan, semaines } });
  };

  const texteComplet = () => {
    if (!courant) return '';
    return [
      `PLAN DE LANCEMENT 30 JOURS — ${courant.brief.titre}`,
      courant.brief.sousTitre,
      `${courant.brief.type} · ${courant.brief.format}${courant.brief.dateSortie ? ` · sortie ${courant.brief.dateSortie}` : ''}`,
      '',
      ...courant.plan.semaines.flatMap((s, i) => [
        `=== SEMAINE ${i + 1} — ${s.titre} (${LAUNCH_WEEKS[i]?.jours ?? ''}) ===`,
        ...s.jours.map((j) => `${texteJour(j)}\n`),
      ]),
      '=== OBJECTIFS À SURVEILLER ===',
      ...courant.plan.objectifs.map((o) => `- ${o}`),
    ].filter((l) => l !== undefined).join('\n');
  };

  const exporter = () => {
    if (!courant) return;
    const blob = new Blob([texteComplet()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plan-lancement-30-jours-${courant.brief.titre.toLowerCase().replace(/[^a-z0-9]+/gi, '-').slice(0, 40) || 'livre'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const btnPrimaire = 'v3-btn v3-btn-primary h-10 [background:var(--v3-emerald)!important] [color:var(--v3-on-emerald)!important] hover:[background:var(--v3-emerald-600)!important]';
  const btnContour = 'gap-1.5 border-[var(--v3-emerald)] [background:var(--v3-paper)!important] [color:var(--v3-ink)!important] hover:[background:var(--v3-emerald-50)!important] hover:[color:var(--v3-ink)!important]';

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <Helmet>
        <title>Plan de lancement 30 jours pour votre livre KDP | Ebookstudio</title>
        <meta name="description" content="Décrivez votre livre ou collez un ASIN : obtenez un plan de lancement jour par jour sur 30 jours, avec les messages prêts à publier." />
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
          Espace KDP · page 2
        </p>
        <h1 className="v3-serif text-[30px] font-semibold" style={{ color: 'var(--v3-ink)' }}>Plan de lancement</h1>
        <p className="mt-1 max-w-2xl text-[14px]" style={{ color: 'var(--v3-muted)' }}>
          Structurez vos 30 premiers jours : une action par jour, le canal, le temps à prévoir et le message à publier.
          Vous pouvez partir d'un ASIN ou décrire votre livre à la main.
        </p>
      </header>

      <SelecteurLivreBiblio
        asinSaisi={asin}
        marketplaceSaisi={marketplace}
        onChoisir={(l) => {
          setAsin(l.asin);
          setMarketplace(l.marketplace);
          setBrief((b) => ({
            ...b,
            titre: l.titre || b.titre,
            genre: l.genre || b.genre,
            resume: l.description || b.resume,
          }));
        }}
      />

      {/* Départ par ASIN */}
      <section className="mb-4 rounded-2xl border p-5" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)' }}>
        <p className="mb-2 text-[13px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
          Votre livre est déjà en ligne ? Collez son ASIN, les champs se remplissent tout seuls.
        </p>
        <div className="grid gap-3 sm:grid-cols-[1fr,200px,auto] sm:items-end">
          <div>
            <Label className="text-xs">Code ASIN (facultatif)</Label>
            <Input value={asin} onChange={(e) => setAsin(e.target.value)} placeholder="B08HFDFKRFG" className="font-mono uppercase" maxLength={10} />
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
          <Button onClick={() => void remplirDepuisAsin()} disabled={occupe} className={btnPrimaire}>
            {etape === 'lecture' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span className="ml-1.5">Remplir depuis l'ASIN</span>
          </Button>
        </div>
      </section>

      {/* Formulaire du livre */}
      <section className="mb-4 rounded-2xl border bg-white p-5" style={{ borderColor: 'var(--v3-line)' }}>
        <h2 className="v3-serif mb-3 text-[19px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>Votre livre</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label className="text-xs">Titre du livre *</Label>
            <Input value={brief.titre} onChange={(e) => majBrief('titre', e.target.value)} placeholder="Mon nouveau livre" />
          </div>
          <div>
            <Label className="text-xs">Sous-titre</Label>
            <Input value={brief.sousTitre} onChange={(e) => majBrief('sousTitre', e.target.value)} placeholder="Le sous-titre de votre livre" />
          </div>
          <div>
            <Label className="text-xs">Type de livre</Label>
            <select
              value={brief.type}
              onChange={(e) => majBrief('type', e.target.value)}
              className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              style={{ borderColor: 'var(--v3-line)' }}
            >
              {LAUNCH_BOOK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-xs">Sujet principal *</Label>
            <Input value={brief.genre} onChange={(e) => majBrief('genre', e.target.value)} placeholder="Gestion du stress, romance historique…" />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Résumé du livre</Label>
            <Textarea
              rows={4}
              value={brief.resume}
              maxLength={RESUME_LIMIT}
              onChange={(e) => majBrief('resume', e.target.value)}
              placeholder="Le problème traité, à qui s'adresse le livre, ce que le lecteur va découvrir."
              className="text-[13.5px]"
            />
            <p className="mt-1 text-right text-[11px]" style={{ color: 'var(--v3-muted)' }}>{brief.resume.length} / {RESUME_LIMIT}</p>
          </div>
          <div>
            <Label className="text-xs">Date de sortie prévue</Label>
            <Input type="date" value={brief.dateSortie} onChange={(e) => majBrief('dateSortie', e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Prix (€)</Label>
            <Input value={brief.prix} onChange={(e) => majBrief('prix', e.target.value)} placeholder="9,99" />
          </div>
          <div>
            <Label className="text-xs">Format</Label>
            <select
              value={brief.format}
              onChange={(e) => majBrief('format', e.target.value)}
              className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              style={{ borderColor: 'var(--v3-line)' }}
            >
              {LAUNCH_FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-xs">Audience visée</Label>
            <Input value={brief.audience} onChange={(e) => majBrief('audience', e.target.value)} placeholder="Parents débordés, jeunes entrepreneurs…" />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Lien de vente (si déjà publié)</Label>
            <Input value={brief.lienVente} onChange={(e) => majBrief('lienVente', e.target.value)} placeholder="https://www.amazon.fr/dp/…" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={() => void creerPlan()} disabled={occupe} className={btnPrimaire}>
            {etape === 'redaction' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
            <span className="ml-1.5">Créer mon plan de lancement</span>
          </Button>
          {occupe && (
            <span className="text-[13px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
              {etape === 'lecture' ? 'Lecture de la fiche Amazon…' : 'Rédaction de vos 30 jours…'}
            </span>
          )}
        </div>

        {erreur && (
          <div className="mt-3 rounded-lg border px-3 py-2 text-[13px]" style={{ borderColor: '#f3c2c2', background: '#fdf3f3', color: '#8a2222' }}>
            {erreur}
          </div>
        )}

        {plans.length > 0 && !occupe && (
          <div className="mt-4">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--v3-muted)' }}>
              Vos derniers plans
            </p>
            <div className="flex flex-wrap gap-1.5">
              {plans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { setCourant(p); setBrief(p.brief); }}
                  className="rounded-full border px-2.5 py-1 text-[11.5px]"
                  style={{ borderColor: 'var(--v3-line)', background: '#fff', color: 'var(--v3-ink)' }}
                >
                  {p.titre || 'Sans titre'} · {p.faits.length} jour(s) fait(s)
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {courant && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4" style={{ borderColor: 'var(--v3-gold)', background: 'var(--v3-cream)' }}>
            <p className="inline-flex items-center gap-2 text-[13.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
              <CalendarCheck className="h-4 w-4" style={{ color: 'var(--v3-emerald)' }} />
              {courant.faits.length} / {total} jours faits
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className={btnContour} onClick={() => copier(texteComplet(), 'Plan copié')}>
                <Copy className="h-3.5 w-3.5" /> Tout copier
              </Button>
              <Button variant="outline" size="sm" className={btnContour} onClick={exporter}>
                <Download className="h-3.5 w-3.5" /> Tout exporter
              </Button>
            </div>
          </div>

          {courant.plan.semaines.map((s, si) => (
            <section key={si} className="rounded-2xl border bg-white p-5" style={{ borderColor: 'var(--v3-line)' }}>
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="v3-serif text-[19px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
                    Semaine {si + 1} — {s.titre}
                  </h2>
                  <p className="text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>{LAUNCH_WEEKS[si]?.jours}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={btnContour}
                  onClick={() => copier(s.jours.map(texteJour).join('\n\n'), `Semaine ${si + 1} copiée`)}
                >
                  <Copy className="h-3.5 w-3.5" /> Copier la semaine
                </Button>
              </div>

              <div className="space-y-3">
                {s.jours.map((j, ji) => {
                  const fait = courant.faits.includes(j.jour);
                  return (
                    <div
                      key={`${si}-${ji}`}
                      className="rounded-xl border p-4"
                      style={{ borderColor: 'var(--v3-line)', background: fait ? 'var(--v3-emerald-50)' : 'var(--v3-cream)' }}
                    >
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <label className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
                          <input type="checkbox" checked={fait} onChange={() => basculerJour(j.jour)} className="h-4 w-4" />
                          Jour {j.jour}
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-[11.5px]" style={{ color: 'var(--v3-muted)' }}>
                            {[j.canal, j.duree].filter(Boolean).join(' · ') || 'Canal non précisé'}
                          </span>
                          <Button variant="outline" size="sm" className={btnContour} onClick={() => copier(texteJour(j), `Jour ${j.jour} copié`)}>
                            <Copy className="h-3.5 w-3.5" /> Copier
                          </Button>
                        </div>
                      </div>
                      <Input
                        value={j.action}
                        onChange={(e) => majJour(si, ji, 'action', e.target.value)}
                        className="mb-2 font-semibold"
                      />
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Input value={j.canal} onChange={(e) => majJour(si, ji, 'canal', e.target.value)} placeholder="Canal" className="text-[12.5px]" />
                        <Input value={j.duree} onChange={(e) => majJour(si, ji, 'duree', e.target.value)} placeholder="Temps à prévoir" className="text-[12.5px]" />
                      </div>
                      {(j.texte || fait) && (
                        <Textarea
                          rows={4}
                          value={j.texte}
                          onChange={(e) => majJour(si, ji, 'texte', e.target.value)}
                          placeholder="Message prêt à publier ou à envoyer"
                          className="mt-2 text-[13px]"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {courant.plan.objectifs.length > 0 && (
            <section className="rounded-2xl border bg-white p-5" style={{ borderColor: 'var(--v3-line)' }}>
              <h2 className="v3-serif mb-2 text-[19px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>Objectifs à surveiller</h2>
              <p className="mb-3 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
                Des repères pour suivre votre lancement, jamais des promesses de résultats.
              </p>
              <ul className="space-y-1.5 text-[13.5px]" style={{ color: 'var(--v3-ink)' }}>
                {courant.plan.objectifs.map((o, i) => (
                  <li key={i} className="flex gap-2">
                    <span style={{ color: 'var(--v3-gold-600)' }}>•</span> {o}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

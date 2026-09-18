import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, BookMarked, Copy, Download, ExternalLink, Loader2, MessageCircle,
  Plus, RefreshCw, Search, Star, Trash2, Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MARKETPLACES } from '@/components/admin/market/marketShared';
import {
  actualiserLivre, ajouterParAsin, couvertureAmazon, estAsin, exporterJson, importerJson,
  lienAmazon, listerLivres, majLivre, marquerEnCours, supprimerLivre, type LivreBiblio, type StatutLivre,
} from '@/lib/kdp/bibliotheque';

const btn =
  'v3-btn h-10 gap-1.5 [background:var(--v3-action-orange)!important] [color:var(--v3-action-orange-text)!important] hover:[background:var(--v3-action-orange-hover)!important]';
const btnContour =
  'h-9 gap-1.5 border-[var(--v3-emerald)] [background:var(--v3-paper)!important] [color:var(--v3-ink)!important]';

const dateCourte = (iso: string) => {
  try { return new Date(iso).toLocaleDateString('fr-FR'); } catch { return '—'; }
};

export default function V3KdpBibliothequePage() {
  const [livres, setLivres] = useState<LivreBiblio[]>([]);
  const [asin, setAsin] = useState('');
  const [marketplace, setMarketplace] = useState('fr');
  const [statut, setStatut] = useState<StatutLivre>('mien');
  const [occupe, setOccupe] = useState(false);
  const [rafraichi, setRafraichi] = useState<string | null>(null);
  const [recherche, setRecherche] = useState('');
  const fichierRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { setLivres(listerLivres()); }, []);

  const visibles = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    const liste = q
      ? livres.filter((l) => `${l.titre} ${l.asin} ${l.auteur} ${l.etiquette}`.toLowerCase().includes(q))
      : livres;
    return [...liste].sort((a, b) => Number(b.enCours) - Number(a.enCours) || b.ajouteLe.localeCompare(a.ajouteLe));
  }, [livres, recherche]);

  const ajouter = async () => {
    const code = asin.trim().toUpperCase();
    if (!estAsin(code)) {
      toast.error('Un ASIN contient exactement 10 caractères.');
      return;
    }
    setOccupe(true);
    try {
      const livre = await ajouterParAsin(code, marketplace, { statut });
      setLivres(listerLivres());
      setAsin('');
      toast.success(`« ${livre.titre} » ajouté à votre bibliothèque`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ajout impossible.');
    } finally {
      setOccupe(false);
    }
  };

  const actualiser = async (id: string) => {
    setRafraichi(id);
    try {
      setLivres(await actualiserLivre(id));
      toast.success('Données Amazon actualisées');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Actualisation impossible.');
    } finally {
      setRafraichi(null);
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

  const exporter = () => {
    const blob = new Blob([exporterJson(livres)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ma-bibliotheque-kdp.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importer = async (fichier: File) => {
    try {
      setLivres(importerJson(await fichier.text()));
      toast.success('Bibliothèque importée');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Import impossible.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <Helmet>
        <title>Ma bibliothèque de livres KDP (ASIN) | Ebookstudio</title>
        <meta
          name="description"
          content="Enregistrez vos livres Amazon par ASIN et retrouvez-les sur toutes les pages KDP : fiche audit, plan de lancement, mots-clés et publicité."
        />
      </Helmet>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link to="/v3/kdp" className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
          <ArrowLeft className="h-4 w-4" /> Retour à l'espace KDP
        </Link>
        <Link to="/v3/kdp/agents?agent=biblio" className="text-[12.5px] underline" style={{ color: 'var(--v3-muted)' }}>
          Parler avec Biblio
        </Link>
      </div>

      <header className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--v3-gold-600)' }}>
          Espace KDP · ma bibliothèque
        </p>
        <h1 className="v3-serif text-[30px] font-semibold" style={{ color: 'var(--v3-ink)' }}>Ma bibliothèque de livres</h1>
        <p className="mt-1 max-w-2xl text-[14px]" style={{ color: 'var(--v3-muted)' }}>
          Enregistrez chaque livre une seule fois avec son ASIN : vous le retrouvez ensuite dans la fiche audit,
          le plan de lancement, les mots-clés et la publicité, sans jamais recoller son code.
        </p>
      </header>

      {/* Ajout */}
      <section className="mb-4 rounded-2xl border p-5" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)' }}>
        <div className="grid gap-3 sm:grid-cols-[1fr,200px,200px,auto] sm:items-end">
          <div>
            <Label className="text-xs">Code ASIN du livre</Label>
            <Input
              value={asin}
              onChange={(e) => setAsin(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !occupe) void ajouter(); }}
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
          <div>
            <Label className="text-xs">Ce livre est…</Label>
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value as StatutLivre)}
              className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              style={{ borderColor: 'var(--v3-line)' }}
            >
              <option value="mien">Un de mes livres</option>
              <option value="concurrent">Un livre concurrent à suivre</option>
            </select>
          </div>
          <Button onClick={() => void ajouter()} disabled={occupe} className={btn}>
            {occupe ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Ajouter le livre
          </Button>
        </div>
        <p className="mt-2 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
          Le titre, l'auteur, le prix, la note et le rang sont lus directement sur la fiche Amazon.
          Votre bibliothèque reste dans ce navigateur : utilisez l'export pour la transférer sur un autre appareil.
        </p>
      </section>

      {/* Barre d'outils */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--v3-muted)' }} />
          <Input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un titre, un ASIN, une étiquette…"
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={exporter} disabled={livres.length === 0} className={btnContour}>
          <Download className="h-4 w-4" /> Exporter
        </Button>
        <Button variant="outline" onClick={() => fichierRef.current?.click()} className={btnContour}>
          <Upload className="h-4 w-4" /> Importer
        </Button>
        <input
          ref={fichierRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) void importer(f); e.target.value = ''; }}
        />
      </div>

      {visibles.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-paper)' }}>
          <BookMarked className="mx-auto h-8 w-8" style={{ color: 'var(--v3-muted)' }} />
          <p className="mt-2 text-[14px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
            {livres.length === 0 ? 'Aucun livre enregistré pour le moment.' : 'Aucun livre ne correspond à cette recherche.'}
          </p>
          {livres.length === 0 && (
            <p className="mt-1 text-[13px]" style={{ color: 'var(--v3-muted)' }}>
              Collez l'ASIN de votre premier livre ci-dessus : il sera disponible partout dans l'espace KDP.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {visibles.map((l) => (
            <article
              key={l.id}
              className="rounded-2xl border p-4"
              style={{ borderColor: l.enCours ? 'var(--v3-emerald)' : 'var(--v3-line)', background: l.enCours ? 'var(--v3-cream)' : 'var(--v3-paper)' }}
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <img
                  src={couvertureAmazon(l.asin)}
                  alt={`Couverture de ${l.titre}`}
                  loading="lazy"
                  className="h-28 w-20 shrink-0 rounded object-cover"
                  style={{ background: 'var(--v3-cream)' }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-bold leading-snug" style={{ color: 'var(--v3-ink)' }}>{l.titre}</p>
                  <p className="text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
                    {l.auteur || 'Auteur non indiqué'} · ASIN {l.asin} · {l.marketplace.toUpperCase()}
                    {l.statut === 'concurrent' ? ' · livre concurrent' : ''}
                  </p>
                  <p className="mt-1 text-[12.5px]" style={{ color: 'var(--v3-ink)' }}>
                    {[
                      l.prix != null ? `Prix affiché : ${l.prix} €` : null,
                      l.note != null ? `Note : ${l.note}/5` : null,
                      l.avis != null ? `${l.avis} avis` : null,
                      l.bsr != null ? `Rang relevé : ${l.bsr}` : null,
                    ].filter(Boolean).join(' · ') || 'Données Amazon non disponibles pour ce livre.'}
                  </p>
                  <p className="mt-1 text-[11.5px]" style={{ color: 'var(--v3-muted)' }}>
                    Ajouté le {dateCourte(l.ajouteLe)} · dernière lecture Amazon le {dateCourte(l.majLe)}
                  </p>

                  <div className="mt-2 max-w-sm">
                    <Label className="text-[11px]">Étiquette (libre)</Label>
                    <Input
                      value={l.etiquette}
                      onChange={(e) => setLivres(majLivre(l.id, { etiquette: e.target.value.slice(0, 60) }))}
                      placeholder="Ex : série Polar, à relancer…"
                      className="h-9 text-[13px]"
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className={btnContour} onClick={() => void actualiser(l.id)} disabled={rafraichi === l.id}>
                      {rafraichi === l.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                      Actualiser
                    </Button>
                    <Button variant="outline" size="sm" className={btnContour} onClick={() => void copier(l.asin, 'ASIN copié')}>
                      <Copy className="h-3.5 w-3.5" /> Copier l'ASIN
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={btnContour}
                      onClick={() => { setLivres(marquerEnCours(l.id)); toast.success(`« ${l.titre} » est votre livre en cours`); }}
                    >
                      <Star className="h-3.5 w-3.5" /> {l.enCours ? 'Livre en cours' : 'Définir comme livre en cours'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={btnContour}
                      onClick={() => setLivres(majLivre(l.id, { statut: l.statut === 'mien' ? 'concurrent' : 'mien' }))}
                    >
                      {l.statut === 'mien' ? 'Classer en concurrent' : 'Classer dans mes livres'}
                    </Button>
                    <Link to={`/v3/kdp/agents?agent=biblio&livre=${encodeURIComponent(l.id)}`}>
                      <Button size="sm" className={btn}>
                        <MessageCircle className="h-3.5 w-3.5" /> Demander à Biblio
                      </Button>
                    </Link>
                    <a href={lienAmazon(l)} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm" className={btnContour}>
                        <ExternalLink className="h-3.5 w-3.5" /> Voir sur Amazon
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 gap-1.5 border-red-300 [background:var(--v3-paper)!important] [color:#b91c1c!important]"
                      onClick={() => { setLivres(supprimerLivre(l.id)); toast.success('Livre retiré de la bibliothèque'); }}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Supprimer
                    </Button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
                    <Link to="/v3/kdp/fiche-audit" className="underline" style={{ color: 'var(--v3-emerald)' }}>Fiche audit</Link>
                    <Link to="/v3/kdp/lancement" className="underline" style={{ color: 'var(--v3-emerald)' }}>Plan de lancement</Link>
                    <Link to="/v3/kdp/mots-cles" className="underline" style={{ color: 'var(--v3-emerald)' }}>Mots-clés</Link>
                    <Link to="/v3/kdp/publicite" className="underline" style={{ color: 'var(--v3-emerald)' }}>Publicité</Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

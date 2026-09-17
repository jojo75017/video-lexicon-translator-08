import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Copy,
  FileText,
  Info,
  Loader2,
  Mail,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import SeoHead from '@/components/funnel/SeoHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useIsAdmin from '@/hooks/useIsAdmin';
import '@/styles/v3-public.css';
import { supabase } from '@/integrations/supabase/client';
import {
  PRESTATION_DELAY,
  PRESTATION_FORMULAS,
  PRESTATION_NOT_INCLUDED,
  PRESTATION_OPTIONS,
  PRESTATION_PUBLICATION_NOTE,
  PRESTATION_REPLY_TEMPLATE,
  computePrestationPrice,
  type PrestationFormula,
} from '@/data/prestationKdp';

const STEPS = [
  {
    number: '01',
    title: 'Vous envoyez votre texte',
    text: 'Un fichier Word ou PDF, même imparfait. Nous vérifions ce qui manque et nous vous confirmons le prix exact.',
  },
  {
    number: '02',
    title: 'Nous préparons le livre',
    text: 'Correction, mise en page intérieure, couverture complète et fichiers au format demandé par Amazon.',
  },
  {
    number: '03',
    title: 'Vous validez et publiez',
    text: 'Vous relisez, vous demandez vos modifications, puis nous vous accompagnons jusqu’à la mise en vente.',
  },
];

export default function PrestationKdpPage() {
  const { isAdmin } = useIsAdmin();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bookType, setBookType] = useState('');
  const [pages, setPages] = useState('');
  const [formula, setFormula] = useState<PrestationFormula['id']>('cle-en-main');
  const [express, setExpress] = useState(true);
  const [details, setDetails] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const estimate = useMemo(() => {
    const parsed = Number.parseInt(pages, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    return computePrestationPrice({ formula, pages: parsed, express });
  }, [pages, formula, express]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !bookType.trim() || !details.trim()) {
      toast.error('Merci de remplir votre nom, votre e-mail, le type de livre et votre besoin.');
      return;
    }

    setSending(true);
    try {
      const selected = PRESTATION_FORMULAS.find((item) => item.id === formula);
      const { error } = await supabase.functions.invoke('send-subscriber-contact', {
        body: {
          email: email.trim(),
          name: name.trim(),
          subject: 'Demande de devis — Prestation KDP clé en main',
          category: 'Devis prestation KDP',
          message: [
            `Type de livre : ${bookType.trim()}`,
            `Nombre de pages : ${pages.trim() || 'non précisé'}`,
            `Formule souhaitée : ${selected?.name ?? formula}`,
            `Délai express 5 à 7 jours : ${express ? 'oui' : 'non'}`,
            estimate ? `Estimation affichée : ${estimate.total} €` : null,
            '',
            'Besoin :',
            details.trim(),
          ]
            .filter(Boolean)
            .join('\n'),
        },
      });
      if (error) throw error;
      setSent(true);
      toast.success('Votre demande est bien partie. Réponse sous 24 h ouvrées.');
    } catch (error) {
      console.error(error);
      toast.error('Envoi impossible. Vous pouvez écrire directement à boubetgeorges@gmail.com.');
    } finally {
      setSending(false);
    }
  };

  const copyReply = async () => {
    try {
      await navigator.clipboard.writeText(PRESTATION_REPLY_TEMPLATE);
      toast.success('Réponse type copiée.');
    } catch {
      toast.error('Copie impossible dans ce navigateur.');
    }
  };

  return (
    <div
      className="v3pub min-h-screen bg-[var(--v3-paper)] text-[var(--v3-ink)]"
      style={{ fontFamily: "'Work Sans', system-ui, sans-serif" }}
    >
      <SeoHead
        title="Prestation KDP clé en main — correction, mise en page, couverture | EbookStudio"
        description="Nous préparons votre livre pour Amazon KDP : correction, mise en page intérieure, couverture complète, version Kindle, titre et mots-clés. À partir de 149 €."
        canonical="/prestation-kdp"
      />

      {/* Hero */}
      <section className="border-b border-[var(--v3-line)] px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--v3-emerald)]">
            Service réalisé par notre atelier
          </p>
          <h1
            className="mt-4 text-4xl leading-[1.1] sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Votre livre prêt pour Amazon,
            <br />
            sans que vous touchiez à un fichier.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--v3-ink)]/75">
            Vous avez écrit votre manuscrit et vous ne voulez pas vous battre avec la mise en page, le dos de couverture
            ou les exigences techniques d’Amazon. Nous nous en occupons, et nous vous accompagnons jusqu’à la mise en
            vente.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <a href="#devis">
                Demander mon devis <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <a href="#formules">Voir les tarifs</a>
            </Button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-[var(--v3-ink)]/60">
            <Clock className="h-4 w-4" /> {PRESTATION_DELAY}
          </p>
        </div>
      </section>

      {/* Étapes */}
      <section className="px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="rounded-lg border border-[var(--v3-line)] bg-white/70 p-6">
              <span className="text-xs tracking-[0.2em] text-[var(--v3-gold)]">{step.number}</span>
              <h3 className="mt-3 text-xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--v3-ink)]/70">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formules */}
      <section id="formules" className="scroll-mt-24 border-y border-[var(--v3-line)] bg-white/60 px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
            Trois formules claires
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--v3-ink)]/70">
            Prix pour un livre de 100 à 150 pages. Au-delà, 1 € par page supplémentaire. Ces prix concernent notre
            travail sur votre livre : ils sont indépendants des abonnements EbookStudio.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {PRESTATION_FORMULAS.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col rounded-xl border p-7 ${
                  item.highlight
                    ? 'border-[var(--v3-emerald)] bg-white shadow-sm'
                    : 'border-[var(--v3-line)] bg-white/80'
                }`}
              >
                {item.highlight && (
                  <span className="mb-3 self-start rounded-full bg-[var(--v3-emerald)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white">
                    Le plus demandé
                  </span>
                )}
                <h3 className="text-2xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                  {item.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--v3-ink)]/65">{item.tagline}</p>
                <p className="mt-5 text-4xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                  {item.price} €
                </p>
                <ul className="mt-6 flex-1 space-y-3 text-sm leading-6">
                  {item.includes.map((line) => (
                    <li key={line} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--v3-emerald)]" />
                      <span className="text-[var(--v3-ink)]/80">{line}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-7 gap-2" variant={item.highlight ? 'default' : 'outline'}>
                  <a href="#devis">
                    Choisir {item.name} <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {PRESTATION_OPTIONS.map((option) => (
              <div key={option.label} className="rounded-lg border border-dashed border-[var(--v3-line)] p-5">
                <p className="text-sm font-medium">{option.label}</p>
                <p className="mt-1 text-sm text-[var(--v3-ink)]/65">{option.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publication + non inclus */}
      <section className="px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--v3-line)] bg-white/70 p-7">
            <h3 className="flex items-center gap-2 text-xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              <ShieldCheck className="h-5 w-5 text-[var(--v3-emerald)]" /> La publication sur votre compte
            </h3>
            <p className="mt-4 text-sm leading-6 text-[var(--v3-ink)]/75">{PRESTATION_PUBLICATION_NOTE}</p>
          </div>
          <div className="rounded-xl border border-[var(--v3-line)] bg-white/70 p-7">
            <h3 className="flex items-center gap-2 text-xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              <Info className="h-5 w-5 text-[var(--v3-gold)]" /> Ce qui n’est pas inclus
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-6">
              {PRESTATION_NOT_INCLUDED.map((line) => (
                <li key={line} className="flex gap-2">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-[var(--v3-ink)]/40" />
                  <span className="text-[var(--v3-ink)]/75">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Devis */}
      <section
        id="devis"
        className="scroll-mt-24 border-y border-[var(--v3-line)] bg-[var(--v3-emerald-50)] px-5 py-16 sm:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--v3-emerald)]">Devis gratuit</p>
          <h2 className="mt-3 text-3xl sm:text-4xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
            Parlez-nous de votre livre
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--v3-ink)]/70">
            Réponse sous 24 h ouvrées avec un prix ferme et un délai exact.
          </p>

          {sent ? (
            <div className="mt-8 rounded-xl border border-[var(--v3-emerald)] bg-white p-8 text-center">
              <Mail className="mx-auto h-8 w-8 text-[var(--v3-emerald)]" />
              <p className="mt-4 text-lg" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                Votre demande est bien arrivée.
              </p>
              <p className="mt-2 text-sm text-[var(--v3-ink)]/70">
                Vous recevrez le devis détaillé par e-mail. Vous pouvez aussi joindre votre fichier en répondant à ce
                message.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-5 rounded-xl border border-[var(--v3-line)] bg-white p-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="prestation-name">Votre nom *</Label>
                  <Input id="prestation-name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prestation-email">Votre e-mail *</Label>
                  <Input
                    id="prestation-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prestation-type">Type de livre *</Label>
                  <Input
                    id="prestation-type"
                    placeholder="Manuel, roman, guide pratique…"
                    value={bookType}
                    onChange={(e) => setBookType(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prestation-pages">Nombre de pages</Label>
                  <Input
                    id="prestation-pages"
                    inputMode="numeric"
                    placeholder="107"
                    value={pages}
                    onChange={(e) => setPages(e.target.value.replace(/[^0-9]/g, ''))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Formule souhaitée</Label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {PRESTATION_FORMULAS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormula(item.id)}
                      className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                        formula === item.id
                          ? 'border-[var(--v3-emerald)] bg-[var(--v3-emerald-50)]'
                          : 'border-[var(--v3-line)] hover:border-[var(--v3-emerald)]/50'
                      }`}
                    >
                      <span className="block font-medium">{item.name}</span>
                      <span className="text-[var(--v3-ink)]/60">{item.price} €</span>
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-3 rounded-lg border border-[var(--v3-line)] p-4 text-sm">
                <input
                  type="checkbox"
                  checked={express}
                  onChange={(e) => setExpress(e.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span>
                  <span className="font-medium">Délai express 5 à 7 jours</span>
                  <span className="block text-[var(--v3-ink)]/60">Majoration de 20 % sur la formule choisie.</span>
                </span>
              </label>

              {estimate && (
                <div className="rounded-lg border border-[var(--v3-gold)]/50 bg-[var(--v3-paper)] p-4 text-sm">
                  <p className="font-medium">Estimation indicative : {estimate.total} €</p>
                  <p className="mt-1 text-[var(--v3-ink)]/65">
                    Formule {estimate.base} €
                    {estimate.extraPages > 0 ? ` + pages supplémentaires ${estimate.extraPages} €` : ''}
                    {estimate.express > 0 ? ` + express ${estimate.express} €` : ''}. Le prix ferme est confirmé après
                    lecture de votre fichier.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="prestation-details">Votre besoin *</Label>
                <Textarea
                  id="prestation-details"
                  rows={5}
                  placeholder="Décrivez votre livre, son état actuel, et ce que vous attendez de nous."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" disabled={sending}>
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Envoyer ma demande de devis
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Alternative : faire soi-même */}
      <section className="px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl rounded-xl border border-[var(--v3-line)] bg-white/70 p-8 text-center">
          <BookOpen className="mx-auto h-6 w-6 text-[var(--v3-emerald)]" />
          <h3 className="mt-4 text-2xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
            Vous préférez le faire vous-même ?
          </h3>
          <p className="mt-3 text-sm leading-6 text-[var(--v3-ink)]/70">
            EbookStudio met les mêmes outils entre vos mains : écriture assistée, correction, couvertures et exports
            conformes à Amazon.
          </p>
          <Button asChild variant="outline" className="mt-6 gap-2">
            <Link to="/v3/forfaits">
              <FileText className="h-4 w-4" /> Voir les forfaits EbookStudio
            </Link>
          </Button>
        </div>
      </section>

      {isAdmin && (
        <section className="border-t border-[var(--v3-line)] px-5 pb-16 sm:px-8">
          <div className="mx-auto max-w-3xl rounded-xl border border-dashed border-[var(--v3-gold)] bg-white/70 p-6">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--v3-gold)]">Réservé à l’administrateur</p>
            <h3 className="mt-2 text-lg" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              Réponse type : manuel de 107 pages, délai express
            </h3>
            <p className="mt-2 text-sm text-[var(--v3-ink)]/65">
              Prix annoncé : 539 € (Clé en main 449 € + express 90 €).
            </p>
            <Button onClick={copyReply} variant="outline" className="mt-4 gap-2">
              <Copy className="h-4 w-4" /> Copier la réponse
            </Button>
            <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-[var(--v3-paper)] p-4 text-xs leading-5 text-[var(--v3-ink)]/80">
              {PRESTATION_REPLY_TEMPLATE}
            </pre>
          </div>
        </section>
      )}
    </div>
  );
}

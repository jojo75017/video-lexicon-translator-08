import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Check,
  Download,
  FileText,
  Image,
  Loader2,
  LockKeyhole,
  Mail,
  PenTool,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

import coverProBanner from '@/assets/cover-pro-banner.jpg';
import SeoHead from '@/components/funnel/SeoHead';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';

const OFFER_ITEMS = [
  'Assistant guidé en 3 étapes',
  'Illustration créée par IA et conservée dans votre espace privé',
  'Modèles professionnels et éditeur avancé',
  'Titre, sous-titre, auteur, couleurs et positions modifiables',
  'Bibliothèque pour retrouver et reprendre vos couvertures',
  'JPEG Kindle 1 600 × 2 560 px, PNG et PDF de première de couverture',
  '3 générations d’illustration incluses, puis utilisation de votre clé OpenAI',
];

const OBJECTIVES = [
  {
    icon: BookOpen,
    number: '01',
    title: 'Vous guider sans jargon',
    text: 'Vous partez du titre, du genre et du nom d’auteur. L’assistant organise ensuite le travail dans un ordre simple.',
  },
  {
    icon: PenTool,
    number: '02',
    title: 'Vous laisser la main',
    text: 'Chaque texte reste modifiable. Vous pouvez ajuster les polices, les couleurs, la disposition et l’illustration.',
  },
  {
    icon: Download,
    number: '03',
    title: 'Livrer un fichier exploitable',
    text: 'Le Studio prépare une image Kindle aplatie au bon format, sans poignées, bordures ni commandes de l’éditeur.',
  },
];

const FAQ = [
  {
    question: 'Le Studio crée-t-il réellement l’illustration ?',
    answer: 'Oui. Vous décrivez votre univers, puis l’illustration est générée par IA et appliquée à vos propositions de couverture.',
  },
  {
    question: 'Puis-je modifier le titre et le nom d’auteur ?',
    answer: 'Oui. Le titre, le sous-titre et le nom d’auteur restent des éléments modifiables dans l’assistant et dans l’éditeur avancé.',
  },
  {
    question: 'Que comprend le paiement unique de 67 € ?',
    answer: 'L’accès au Studio de couverture V4 et 3 générations d’illustration incluses. Après ces 3 générations, vous pouvez connecter votre propre clé OpenAI pour continuer à générer.',
  },
  {
    question: 'Quels fichiers puis-je télécharger aujourd’hui ?',
    answer: 'Le Studio exporte la première de couverture en JPEG Kindle 1 600 × 2 560 px, en PNG et en PDF de première de couverture.',
  },
  {
    question: 'Le devis personnalisé est-il obligatoire ?',
    answer: 'Non. L’offre fixe à 67 € peut être achetée directement. Le devis sert uniquement aux demandes particulières qui dépassent l’usage standard du Studio.',
  },
];

export default function V3CoverOfferPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [details, setDetails] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submitQuote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !projectType.trim() || !details.trim()) {
      toast.error('Merci de remplir tous les champs obligatoires.');
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-subscriber-contact', {
        body: {
          email: email.trim(),
          name: name.trim(),
          subject: 'Demande de devis — Studio de couverture V4',
          category: 'Devis Studio de couverture V4',
          message: `Type de projet : ${projectType.trim()}\nNombre de couvertures : ${quantity || '1'}\n\nBesoin :\n${details.trim()}`,
        },
      });
      if (error) throw error;
      setSent(true);
      toast.success('Votre demande de devis a bien été envoyée.');
    } catch (error) {
      console.error(error);
      toast.error('Envoi impossible. Vous pouvez écrire à contact@ebookstudio.fr.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--v3-paper)] text-[var(--v3-ink)]" style={{ fontFamily: "'Work Sans', system-ui, sans-serif" }}>
      <SeoHead
        title="Studio de couverture V4 — EbookStudio"
        description="Créez et exportez votre couverture Kindle avec le Studio V4 EbookStudio. Offre à 67 € ou devis personnalisé."
        canonical="/v3/offre-couverture-v4"
      />

      <section className="border-b border-[var(--v3-line)] px-5 py-10 sm:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.82fr)] lg:gap-16">
          <div>
            <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--v3-emerald)]">
              <span className="h-px w-9 bg-[var(--v3-gold)]" />
              Nouveauté V4 · Maison d’édition
            </div>
            <h1 className="max-w-3xl text-5xl leading-[0.98] sm:text-6xl lg:text-7xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              Studio de<br />
              <em className="text-[var(--v3-emerald)]">couverture V4</em>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--v3-muted)] sm:text-xl">
              De votre idée à une couverture Kindle prête à télécharger : une méthode guidée, une illustration créée par IA et des textes que vous gardez entièrement modifiables.
            </p>

            <div className="mt-8 flex flex-wrap items-end gap-5 border-y border-[var(--v3-line)] py-5">
              <div>
                <span className="block text-xs font-bold uppercase tracking-[0.16em] text-[var(--v3-muted)]">Accès au Studio</span>
                <span className="text-5xl text-[var(--v3-emerald)]" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>67 €</span>
              </div>
              <p className="pb-1 text-sm text-[var(--v3-muted)]">Paiement unique · 3 générations incluses</p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-orange-500 text-primary-foreground hover:bg-orange-600">
                <Link to="/v3/cover-pro?checkout=1">
                  Acheter le Studio V4 — 67 € <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-[var(--v3-emerald)] text-[var(--v3-emerald)] hover:bg-[var(--v3-emerald-50)]">
                <a href="#devis">Demander un devis particulier</a>
              </Button>
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-[var(--v3-muted)]">
              <ShieldCheck className="h-4 w-4 text-[var(--v3-emerald)]" /> Paiement sécurisé dans le formulaire intégré EbookStudio.
            </p>
          </div>

          <figure className="relative mx-auto w-full max-w-xl border border-[var(--v3-line)] bg-background p-3 shadow-xl">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={coverProBanner}
                alt="Trois exemples de couvertures de livres émeraude et or"
                width={1536}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="flex items-center justify-between gap-4 px-2 pb-1 pt-3 text-xs text-[var(--v3-muted)]">
              <span>Studio de couverture EbookStudio</span>
              <span className="font-semibold text-[var(--v3-emerald)]">Votre univers, votre titre, votre auteur</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--v3-gold-600)]">Pourquoi ce Studio</span>
              <h2 className="mt-3 text-4xl leading-tight sm:text-5xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                Une couverture ne devrait pas ressembler à un formulaire rempli.
              </h2>
            </div>
            <div className="space-y-5 text-base leading-8 text-[var(--v3-muted)]">
              <p>Le Studio V4 réunit le parcours guidé et l’éditeur détaillé dans un seul espace. Vous pouvez commencer simplement, puis reprendre chaque élément si vous souhaitez aller plus loin.</p>
              <p>L’illustration, la composition et les textes sont traités séparément. Votre titre n’est donc pas figé dans une image : il reste lisible, corrigeable et repositionnable avant le téléchargement.</p>
              <Button asChild variant="link" className="h-auto p-0 font-bold text-[var(--v3-emerald)]">
                <Link to="/v3/couverture-express">Voir l’assistant en 3 étapes <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>

          <div className="mt-14 grid border-y border-[var(--v3-line)] md:grid-cols-3">
            {OBJECTIVES.map(({ icon: Icon, number, title, text }, index) => (
              <article key={number} className={`py-8 md:px-7 ${index > 0 ? 'border-t border-[var(--v3-line)] md:border-l md:border-t-0' : ''}`}>
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-[var(--v3-gold-600)]" />
                  <span className="text-3xl text-[var(--v3-line)]" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>{number}</span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-[var(--v3-ink)]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--v3-muted)]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="v3-section-dark px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--v3-gold)]">Le parcours</span>
              <h2 className="mt-3 text-4xl leading-tight text-primary-foreground sm:text-5xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                Trois étapes, sans perdre le contrôle.
              </h2>
              <p className="mt-5 max-w-md leading-7 text-primary-foreground/70">L’assistant vous montre seulement la décision utile au bon moment. L’éditeur avancé reste disponible pour les réglages précis.</p>
            </div>
            <ol className="divide-y divide-primary-foreground/15 border-y border-primary-foreground/15">
              {[
                ['01', 'Votre livre', 'Indiquez le titre, le sous-titre, l’auteur, le genre et le format.'],
                ['02', 'Votre direction visuelle', 'Comparez trois propositions, créez ou changez l’illustration et ajustez la luminosité.'],
                ['03', 'Votre fichier', 'Vérifiez la composition, sauvegardez le projet et téléchargez les formats disponibles.'],
              ].map(([number, title, text]) => (
                <li key={number} className="grid gap-3 py-6 sm:grid-cols-[54px_180px_1fr] sm:items-start">
                  <span className="text-sm font-bold text-[var(--v3-gold)]">{number}</span>
                  <strong className="text-primary-foreground">{title}</strong>
                  <span className="text-sm leading-6 text-primary-foreground/65">{text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--v3-gold-600)]">Ce qui est inclus</span>
            <h2 className="mt-3 text-4xl leading-tight sm:text-5xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              Un atelier complet pour votre première de couverture.
            </h2>
            <div className="mt-9 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {OFFER_ITEMS.map((item) => (
                <div key={item} className="flex items-start gap-3 border-t border-[var(--v3-line)] pt-4">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--v3-emerald)]" />
                  <span className="text-sm leading-6 text-[var(--v3-muted)]">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 text-center">
              {[
                [Image, 'Illustration', 'Privée'],
                [FileText, 'JPEG Kindle', '1 600 × 2 560'],
                [LockKeyhole, 'Projets', 'Conservés'],
              ].map(([Icon, label, value]) => {
                const FeatureIcon = Icon as typeof Image;
                return (
                  <div key={String(label)} className="border border-[var(--v3-line)] bg-background px-2 py-5">
                    <FeatureIcon className="mx-auto h-5 w-5 text-[var(--v3-gold-600)]" />
                    <strong className="mt-2 block text-sm">{label as string}</strong>
                    <span className="block text-xs text-[var(--v3-muted)]">{value as string}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="self-start border border-[var(--v3-gold)] bg-background p-7 shadow-lg sm:p-9 lg:sticky lg:top-28">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--v3-emerald)]">Offre fixe</span>
            <h2 className="mt-3 text-3xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Studio de couverture V4</h2>
            <div className="my-6 border-y border-[var(--v3-line)] py-5">
              <span className="text-6xl text-[var(--v3-emerald)]" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>67 €</span>
              <span className="ml-2 text-sm text-[var(--v3-muted)]">une seule fois</span>
            </div>
            <ul className="space-y-3 text-sm text-[var(--v3-muted)]">
              <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-[var(--v3-emerald)]" /> Accès au Studio et à vos projets</li>
              <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-[var(--v3-emerald)]" /> 3 générations d’illustration incluses</li>
              <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-[var(--v3-emerald)]" /> Exports locaux sans crédit supplémentaire</li>
            </ul>
            <Button asChild size="lg" className="mt-7 w-full bg-orange-500 text-primary-foreground hover:bg-orange-600">
              <Link to="/v3/cover-pro?checkout=1">Payer 67 € et accéder au Studio <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <p className="mt-3 text-center text-xs leading-5 text-[var(--v3-muted)]">Après les 3 générations incluses, une clé OpenAI personnelle est nécessaire pour créer d’autres illustrations.</p>
          </aside>
        </div>
      </section>

      <section id="devis" className="scroll-mt-28 border-y border-[var(--v3-line)] bg-[var(--v3-emerald-50)] px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--v3-gold-600)]">Besoin particulier</span>
            <h2 className="mt-3 text-4xl leading-tight sm:text-5xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Demandez un devis clair.</h2>
            <p className="mt-5 leading-7 text-[var(--v3-muted)]">Pour plusieurs couvertures ou une demande qui dépasse le cadre du Studio, décrivez votre projet. Vous recevrez une réponse personnelle avant tout engagement.</p>
            <div className="mt-8 flex items-start gap-3 text-sm text-[var(--v3-muted)]">
              <Mail className="mt-0.5 h-5 w-5 text-[var(--v3-emerald)]" />
              <span>Vous pouvez aussi écrire directement à <a href="mailto:contact@ebookstudio.fr" className="font-bold text-[var(--v3-emerald)] underline">contact@ebookstudio.fr</a>.</span>
            </div>
          </div>

          {sent ? (
            <div role="status" className="flex min-h-[360px] flex-col items-center justify-center border border-[var(--v3-gold)] bg-background p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--v3-emerald-50)] text-[var(--v3-emerald)]"><Check className="h-6 w-6" /></div>
              <h3 className="mt-5 text-3xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Demande bien reçue.</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--v3-muted)]">Votre besoin a été transmis. Vous recevrez une réponse personnelle avec les prochaines étapes.</p>
              <Button type="button" variant="outline" className="mt-6" onClick={() => setSent(false)}>Envoyer une autre demande</Button>
            </div>
          ) : (
            <form onSubmit={submitQuote} className="border border-[var(--v3-line)] bg-background p-6 shadow-sm sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="quote-name">Nom *</Label>
                  <Input id="quote-name" value={name} onChange={(event) => setName(event.target.value)} className="mt-2" placeholder="Votre nom" required />
                </div>
                <div>
                  <Label htmlFor="quote-email">Email *</Label>
                  <Input id="quote-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2" placeholder="vous@exemple.fr" required />
                </div>
                <div>
                  <Label htmlFor="quote-type">Type de projet *</Label>
                  <Input id="quote-type" value={projectType} onChange={(event) => setProjectType(event.target.value)} className="mt-2" placeholder="Roman, guide, série…" required />
                </div>
                <div>
                  <Label htmlFor="quote-quantity">Nombre de couvertures</Label>
                  <Input id="quote-quantity" type="number" min="1" max="100" value={quantity} onChange={(event) => setQuantity(event.target.value)} className="mt-2" />
                </div>
              </div>
              <div className="mt-5">
                <Label htmlFor="quote-details">Votre besoin *</Label>
                <Textarea id="quote-details" value={details} onChange={(event) => setDetails(event.target.value)} className="mt-2 min-h-32 resize-y" placeholder="Décrivez les formats, l’univers visuel et les contraintes de votre projet." required />
              </div>
              <Button type="submit" size="lg" disabled={sending} className="mt-6 w-full bg-[var(--v3-emerald)] text-primary-foreground hover:bg-[var(--v3-emerald-600)]">
                {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours…</> : <><Send className="h-4 w-4" /> Envoyer ma demande de devis</>}
              </Button>
            </form>
          )}
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--v3-gold-600)]">Avant de choisir</span>
            <h2 className="mt-3 text-4xl sm:text-5xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Questions fréquentes</h2>
          </div>
          <Accordion type="single" collapsible className="mt-9 border-t border-[var(--v3-line)]">
            {FAQ.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`} className="border-[var(--v3-line)]">
                <AccordionTrigger className="text-left text-base hover:text-[var(--v3-emerald)] hover:no-underline">{item.question}</AccordionTrigger>
                <AccordionContent className="max-w-3xl leading-7 text-[var(--v3-muted)]">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="v3-section-dark px-5 py-14 text-center sm:px-8">
        <Sparkles className="mx-auto h-5 w-5 text-[var(--v3-gold)]" />
        <h2 className="mx-auto mt-4 max-w-3xl text-4xl leading-tight text-primary-foreground sm:text-5xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Votre prochaine couverture peut commencer aujourd’hui.</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-primary-foreground/70">Achetez l’accès au Studio V4 ou utilisez le devis si votre projet demande un accompagnement particulier.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-orange-500 text-primary-foreground hover:bg-orange-600">
            <Link to="/v3/cover-pro?checkout=1">Acheter maintenant — 67 € <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <a href="#devis">J’ai besoin d’un devis</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
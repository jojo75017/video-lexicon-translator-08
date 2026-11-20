import { useEffect, useState, type FormEvent } from 'react';
import { Helmet } from 'react-helmet';
import { BookOpen, CheckCircle2, Download, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import cuervo from '@/assets/vente-el-cuervo.jpg';
import { elCuervoExcerpt } from '@/data/elCuervoExcerpt';

type Reader = { email: string; first_name: string | null; consent_at: string };

export default function ElCuervoBookSite() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [pending, setPending] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [readers, setReaders] = useState<Reader[] | null>(null);
  const [readerError, setReaderError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadReaders() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !active) return;
      const { data: role } = await supabase.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle();
      if (!role || !active) return;
      const { data, error: loadError } = await supabase.from('book_reader_signups').select('email,first_name,consent_at').eq('book_slug', 'el-cuervo').order('consent_at', { ascending: false });
      if (!active) return;
      if (loadError) setReaderError('La liste des lecteurs est momentanément indisponible.');
      else setReaders(data || []);
    }
    void loadReaders();
    return () => { active = false; };
  }, []);

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if (!consent) { setError('Veuillez accepter de recevoir les nouvelles du livre.'); return; }
    setPending(true);
    setError('');
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('book-reader-signup', {
        body: { book_slug: 'el-cuervo', email: email.trim(), first_name: firstName.trim(), consent, website },
      });
      if (invokeError || !data?.ok) {
        let message = data?.error || 'L’inscription n’a pas pu être enregistrée. Réessayez dans un instant.';
        if (invokeError && 'context' in invokeError && invokeError.context instanceof Response) {
          const response = await invokeError.context.json().catch(() => null);
          message = response?.error || message;
        }
        setError(message);
      } else { setSubscribed(true); }
    } catch { setError('Connexion interrompue. Réessayez dans un instant.'); }
    finally { setPending(false); }
  }

  function exportReaders() {
    if (!readers) return;
    const cell = (value: string) => `"${value.replace(/^[=+@-]/, "'$&").replace(/"/g, '""')}"`;
    const csv = '\uFEFF' + ['email;prenom;consentement_date', ...readers.map((r) => [r.email, r.first_name || '', r.consent_at].map(cell).join(';'))].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'lecteurs-el-cuervo.csv'; link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Le Fils d’El Cuervo | Le livre de Georges Boubet</title>
        <meta name="description" content="Découvrez Le Fils d’El Cuervo, roman d’aventure de Georges Boubet. Disponible sur Amazon en Kindle et en broché. Inscrivez-vous aux nouvelles de l’auteur." />
      </Helmet>
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-12 md:grid-cols-2">
        <img src={cuervo} alt="Couverture du roman Le Fils d’El Cuervo" className="mx-auto w-full max-w-sm rounded-md shadow-xl" />
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">Roman d’aventure · 241 pages</p>
          <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-5xl">Le Fils d’El Cuervo</h1>
          <p className="mb-4 text-lg font-medium">Georges Boubet</p>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">Un héritage masqué, un cheval noir et une justice à rendre. Disponible en Kindle et en broché sur Amazon.</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg"><a href="https://www.amazon.fr/dp/B0HLL8PZB6" target="_blank" rel="noopener noreferrer">Acheter le Kindle</a></Button>
            <Button asChild size="lg" variant="outline"><a href="https://www.amazon.fr/dp/B0HRVVYL49" target="_blank" rel="noopener noreferrer">Acheter le broché</a></Button>
          </div>
          <Button asChild variant="link" className="mt-4 h-auto whitespace-normal px-0"><a href="#lecture"><BookOpen /> Découvrir le livre avant de choisir</a></Button>
        </div>
      </section>
      <section id="lecture" className="border-y border-border bg-muted/30 px-5 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase text-primary">Les premières lignes · Chapitre 1</p>
          <h2 className="mb-6 text-3xl font-bold">{elCuervoExcerpt.title}</h2>
          <div className="mb-7 space-y-5 text-lg leading-loose">{elCuervoExcerpt.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          <p className="mb-5 text-sm text-muted-foreground">Pour poursuivre votre découverte, consultez la fiche Kindle et son aperçu de lecture lorsqu’il est proposé par Amazon.</p>
          <Button asChild variant="outline" className="h-auto min-h-11 whitespace-normal py-3"><a href="https://www.amazon.fr/dp/B0HLL8PZB6" target="_blank" rel="noopener noreferrer"><BookOpen /> Voir la présentation et l’aperçu Amazon</a></Button>
        </div>
      </section>
      <section className="border-b border-border px-5 py-10 text-center"><div className="mx-auto max-w-3xl">
        <h2 className="mb-4 text-2xl font-bold">📢 Vous aimez ce livre ? Partagez-le avec vos amis !</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild><a href={`https://wa.me/?text=${encodeURIComponent('Regarde ce livre : « Le Fils d’El Cuervo ». Le début est gratuit ici : https://ebookstudio.fr/livre/el-cuervo')}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></Button>
          <Button asChild variant="outline"><a href="https://www.facebook.com/sharer/sharer.php?u=https://ebookstudio.fr/livre/el-cuervo" target="_blank" rel="noopener noreferrer">Facebook</a></Button>
          <Button asChild variant="outline"><a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Je découvre « Le Fils d’El Cuervo » : https://ebookstudio.fr/livre/el-cuervo')}`} target="_blank" rel="noopener noreferrer">X</a></Button>
          <Button variant="outline" onClick={() => void navigator.clipboard.writeText('https://ebookstudio.fr/livre/el-cuervo')}>Copier le lien</Button>
        </div>
      </div></section>
      <section className="mx-auto max-w-3xl px-5 py-14" aria-labelledby="reader-title">
        <Mail className="mb-4 h-7 w-7 text-primary" aria-hidden="true" />
        <h2 id="reader-title" className="mb-4 text-3xl font-bold">Gardons le contact</h2>
        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">Recevez les nouvelles de Georges Boubet et soyez informé de ses prochains livres. Une invitation à poursuivre l’aventure, sans obligation d’achat.</p>
        {subscribed ? <div role="status" className="flex items-start gap-3 border-l-4 border-primary bg-muted p-5"><CheckCircle2 className="mt-1 shrink-0 text-primary" /><div><p className="font-semibold">Votre inscription est enregistrée.</p><p className="mt-1 text-muted-foreground">Merci ! Vous pourrez recevoir les prochaines nouvelles de l’auteur.</p></div></div> :
          <form onSubmit={subscribe} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="reader-first-name">Prénom (facultatif)</Label><Input id="reader-first-name" autoComplete="given-name" maxLength={80} value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="reader-email">Adresse e-mail</Label><Input id="reader-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            </div>
            <div hidden aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></div>
            <div className="flex items-start gap-3"><Checkbox id="reader-consent" checked={consent} onCheckedChange={(value) => setConsent(value === true)} className="mt-1" /><Label htmlFor="reader-consent" className="text-sm font-normal leading-relaxed">J’accepte de recevoir par e-mail les nouvelles et prochains livres de Georges Boubet. Je peux retirer mon consentement à tout moment.</Label></div>
            <p className="text-sm leading-relaxed text-muted-foreground">Votre adresse est utilisée uniquement pour ces nouvelles. Pour retirer votre inscription, contactez l’auteur via les coordonnées des <a href="/mentions-legales" className="underline">mentions légales</a>. <a href="/politique-confidentialite" className="underline">Politique de confidentialité</a>.</p>
            {error && <p role="alert" className="text-destructive">{error}</p>}
            <Button type="submit" size="lg" disabled={pending || !consent}>{pending ? <Loader2 className="animate-spin" /> : <Mail />}{pending ? 'Enregistrement…' : 'Recevoir les nouvelles'}</Button>
          </form>}
      </section>
      {readers !== null && <section className="border-t border-border bg-muted/30 px-5 py-8"><div className="mx-auto max-w-3xl"><h2 className="mb-4 text-xl font-semibold">Lecteurs inscrits · Administration</h2><div className="mb-4 flex flex-wrap items-center gap-4"><p>{readers.length} inscription{readers.length > 1 ? 's' : ''}</p><Button onClick={exportReaders} variant="outline" disabled={!readers.length}><Download /> Exporter les e-mails (CSV)</Button></div><div className="max-h-64 overflow-auto">{readers.map((reader) => <div key={reader.email} className="border-b border-border py-3 text-sm"><p className="break-all font-medium">{reader.email}</p><p className="text-muted-foreground">{reader.first_name || 'Sans prénom'} · {new Date(reader.consent_at).toLocaleDateString('fr-FR')}</p></div>)}</div></div></section>}
      {readerError && <p role="alert" className="px-5 text-center text-destructive">{readerError}</p>}
      <footer className="border-t border-border px-5 py-6 text-center text-sm text-muted-foreground">
        Site créé avec <a href="/essai" className="font-semibold text-primary">EbookStudio</a>
        <nav aria-label="Informations légales" className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-3"><a href="/mentions-legales" className="underline">Mentions légales</a><a href="/politique-confidentialite" className="underline">Politique de confidentialité</a><a href="/cgv" className="underline">CGV</a></nav>
      </footer>
    </main>
  );
}

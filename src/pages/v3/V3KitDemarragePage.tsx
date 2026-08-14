import { Download, BookOpen, CheckCircle2, Mail } from 'lucide-react';

const PDF_URL = '/kit-demarrage-ebookstudio-v3.pdf';

const SOMMAIRE = [
  'Se connecter et retrouver son espace',
  'Paramétrer ses clés IA (Gemini, OpenRouter)',
  'Trouver une niche Amazon rentable',
  'Construire le sommaire avec l\'IA',
  'Écrire chapitre par chapitre',
  'La correction professionnelle en 4 passes',
  'Créer une couverture qui tient en vignette',
  'Publier : exports et métadonnées KDP',
  'Vendre : description, mots-clés, premiers avis',
  'Votre semaine de lancement (checklist 7 jours)',
  'Les 10 erreurs qui font refuser un livre',
  'Vos cadeaux et les 8 questions les plus posées',
];

export default function V3KitDemarragePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="rounded-2xl border border-[#c9a84c]/40 bg-[#064e3b] p-6 text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-[#e7cf8c]">Pour bien démarrer</p>
        <h1 className="mt-2 font-serif text-3xl">Kit de démarrage Ebookstudio V3</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85">
          16 pages illustrées de captures réelles de votre espace : de la première connexion
          jusqu'à la mise en vente sur Amazon KDP. À lire une fois, à garder sous la main.
        </p>
        <a
          href={PDF_URL}
          download
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#c9a84c] px-6 py-3 font-semibold text-[#1a1a1a] transition hover:bg-[#e7cf8c]"
        >
          <Download className="h-4 w-4" />
          Télécharger le kit (PDF)
        </a>
      </header>

      <section className="mt-8 rounded-2xl border bg-card p-6">
        <h2 className="flex items-center gap-2 font-serif text-xl text-[#064e3b]">
          <BookOpen className="h-5 w-5" /> Ce que contient le kit
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {SOMMAIRE.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a84c]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border bg-card p-6">
        <h2 className="font-serif text-xl text-[#064e3b]">Lire en ligne</h2>
        <div className="mt-4 overflow-hidden rounded-xl border">
          <object data={PDF_URL} type="application/pdf" className="h-[720px] w-full">
            <p className="p-6 text-sm text-muted-foreground">
              Votre navigateur n'affiche pas les PDF.{' '}
              <a href={PDF_URL} download className="font-semibold text-[#064e3b] underline">
                Téléchargez le kit ici
              </a>
              .
            </p>
          </object>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[#c9a84c]/50 bg-[#fdf6e3] p-6">
        <h2 className="flex items-center gap-2 font-serif text-lg text-[#064e3b]">
          <Mail className="h-5 w-5" /> Un blocage sur une étape ?
        </h2>
        <p className="mt-2 text-sm text-[#3a3a3a]">
          Écrivez-moi en précisant la page et l'étape, avec une capture si possible :{' '}
          <a href="mailto:boubetgeorges@gmail.com" className="font-semibold text-[#064e3b] underline">
            boubetgeorges@gmail.com
          </a>
          . Je réponds personnellement.
        </p>
      </section>
    </div>
  );
}

import cuervo from '@/assets/vente-el-cuervo.jpg';

export default function ElCuervoBookSite() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-16 md:grid-cols-2">
        <img src={cuervo} alt="Couverture du roman Le Fils d’El Cuervo" className="w-full rounded-2xl shadow-xl" />
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">Roman d’aventure · 241 pages</p>
          <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-5xl">Le Fils d’El Cuervo</h1>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">Un héritage masqué, un cheval noir et une justice à rendre. Disponible en Kindle et en broché sur Amazon.</p>
          <div className="flex flex-wrap gap-3">
            <a href="https://www.amazon.fr/dp/B0HLL8PZB6" target="_blank" rel="noopener noreferrer" className="rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground">Acheter le Kindle</a>
            <a href="https://www.amazon.fr/dp/B0HRVVYL49" target="_blank" rel="noopener noreferrer" className="rounded-xl border-2 border-primary px-6 py-3 font-bold text-primary">Acheter le broché</a>
          </div>
        </div>
      </section>
      <footer className="border-t border-border px-5 py-6 text-center text-sm text-muted-foreground">
        Site créé avec <a href="/essai" className="font-semibold text-primary">EbookStudio</a>
      </footer>
    </main>
  );
}

import EbookMultiTranslator from '@/components/ebook/EbookMultiTranslator';
import { BackButton } from "@/components/v3/BackButton";

export default function V3TranslatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
      <div className="max-w-6xl mx-auto px-4 pt-4"><BackButton /></div>
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: 'var(--v3-gold-600)' }}>
          Écrire · Nouveau
        </div>
        <h1 className="v3-serif text-3xl md:text-4xl font-semibold mt-1" style={{ color: 'var(--v3-emerald)' }}>
          🌍 Traduction 10 langues
        </h1>
        <p className="mt-2 text-[14px]" style={{ color: 'var(--v3-muted)' }}>
          Traduisez votre livre en EN, ES, DE, IT, PT, NL, PL, JA, ZH, AR — IA + relecture.
        </p>
      </div>
      <EbookMultiTranslator ebookTitle="" chapters={[]} preface="" conclusion="" />
    </div>
  );
}

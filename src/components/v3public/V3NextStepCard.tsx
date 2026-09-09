import { ArrowRight, BookOpen, ListOrdered } from 'lucide-react';
import { countWords, estimatedPages, narrativeForBook, type BookBrief } from '@/lib/v3/bookBrief';

/** Récit assez long pour un livre : 3 chapitres de 2 500 mots. */
const MIN_BOOK_WORDS = 7500;

/**
 * Dit à l'abonné, en une phrase, ce qui se passe maintenant et juste après :
 * raconter → sommaire → mise en page et export. Aucun appel IA.
 */
export default function V3NextStepCard({ brief, onOutline, onBook }: {
  brief: BookBrief;
  onOutline?: () => void;
  onBook?: () => void;
}) {
  const words = countWords(narrativeForBook(brief));
  const pages = estimatedPages(words);
  const hasOutline = (brief.outline || []).length > 0;
  const missing = Math.max(0, MIN_BOOK_WORDS - words);

  const step = !hasOutline && missing > 0 ? 'writing' : !hasOutline ? 'ready-outline' : 'ready-book';

  return (
    <div className="mt-3 rounded-2xl border p-3" style={{ borderColor: 'rgba(201,168,76,0.6)', background: '#FBF6E8' }}>
      <p className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: 'var(--v3-muted)' }}>
        Et après ? Votre livre, étape par étape
      </p>
      <p className="mt-1 text-[13px]" style={{ color: 'var(--v3-ink)' }}>
        {step === 'writing' && (
          <>Continuez à raconter : {words.toLocaleString('fr-FR')} mots écrits (environ {pages} page
          {pages > 1 ? 's' : ''}). Il reste environ {missing.toLocaleString('fr-FR')} mots avant de construire
          votre sommaire. Ensuite : chapitres, polices, puis Word, PDF, couverture, Amazon et audio.</>
        )}
        {step === 'ready-outline' && (
          <>Votre récit tient un livre : {words.toLocaleString('fr-FR')} mots, environ {pages} pages. Passez au
          sommaire : le Génie déduit les chapitres de vos textes (2 500 à 3 500 mots chacun) sans jamais
          réécrire ce que vous avez validé. Puis vous choisissez la police et vous téléchargez votre livre.</>
        )}
        {step === 'ready-book' && (
          <>Votre sommaire est prêt ({(brief.outline || []).length} chapitres). Choisissez la police et la mise en
          page, puis téléchargez votre livre en Word ou en PDF, ajoutez la couverture, la fiche Amazon et la
          version audio.</>
        )}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {onOutline && (
          <button type="button" onClick={onOutline} className="v3-btn v3-btn-primary text-[11.5px]">
            <ListOrdered className="h-3 w-3" /> Mon sommaire <ArrowRight className="h-3 w-3" />
          </button>
        )}
        {onBook && hasOutline && (
          <button type="button" onClick={onBook} className="v3-btn v3-btn-outline text-[11.5px]">
            <BookOpen className="h-3 w-3" /> Mon livre fini
          </button>
        )}
      </div>
    </div>
  );
}

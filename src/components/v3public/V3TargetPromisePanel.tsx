import { useState } from 'react';
import { Loader2, Sparkles, Wand2, Target } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getProvider, getProviderKey } from '@/services/aiWritingService';
import type { BookBrief } from '@/lib/v3/bookBrief';

type Props = {
  brief: BookBrief;
  onChange: (patch: Partial<BookBrief>) => void;
};

const ROWS: Array<[keyof BookBrief, string]> = [
  ['cibleProfil', 'Profil du lecteur'],
  ['cibleNiveau', 'Niveau'],
  ['cibleBesoins', 'Besoins / attentes'],
  ['cibleFrustrations', 'Frustrations'],
  ['promesseBenefices', 'Bénéfices clés'],
  ['promesseDifferenciation', 'Différenciation'],
  ['promesseEmotion', 'Émotion visée'],
];

/**
 * Cible & Promesse — 100 % IA.
 * L'auteur ne saisit rien : un seul bouton génère le profil lecteur et la promesse
 * centrale à partir du titre, de la catégorie et du synopsis.
 */
export default function V3TargetPromisePanel({ brief, onChange }: Props) {
  const [loading, setLoading] = useState(false);

  const hasResult = Boolean((brief.promesseCentrale || '').trim());

  const generate = async () => {
    const title = (brief.title || '').trim();
    const description = (brief.description || '').trim();
    if (title.length < 3 || description.length < 30) {
      toast.error('Renseigne d’abord le titre et un synopsis (30 caractères minimum).');
      return;
    }
    setLoading(true);
    try {
      const provider = getProvider();
      const userApiKey = provider === 'gemini' ? getProviderKey('gemini') : '';
      const { data, error } = await supabase.functions.invoke('autofill-target-promise', {
        body: {
          title,
          subtitle: (brief.subtitle || '').trim(),
          category: brief.category || '',
          bookIntroduction: description,
          language: 'fr',
          userApiKey,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      onChange({
        cibleProfil: data?.cibleProfil || '',
        cibleNiveau: data?.cibleNiveau || 'tous',
        cibleBesoins: data?.cibleBesoins || '',
        cibleFrustrations: data?.cibleFrustrations || '',
        promesseCentrale: data?.promesseCentrale || '',
        promesseBenefices: data?.promesseBenefices || '',
        promesseDifferenciation: data?.promesseDifferenciation || '',
        promesseEmotion: data?.promesseEmotion || '',
      });
      toast.success('Cible & Promesse générées par l’IA ✓');
    } catch (e: any) {
      toast.error(e?.message || 'Génération indisponible pour le moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[22px] border p-5" style={{ borderColor: 'var(--v3-border)', background: '#fff' }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="v3-chip v3-chip-orange"><Target className="h-3.5 w-3.5" /> Cible &amp; Promesse — 100 % IA</span>
          <p className="mt-2 text-xs" style={{ color: 'var(--v3-muted)' }}>
            Rien à remplir : l’IA déduit le lecteur idéal, ses frustrations et la promesse centrale de votre livre.
          </p>
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="v3-btn v3-btn-primary shrink-0 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {hasResult ? 'Régénérer' : 'Générer avec l’IA'}
        </button>
      </div>

      {hasResult ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border px-4 py-3" style={{ borderColor: 'var(--v3-orange-600, #C97A14)', background: 'var(--v3-orange-50, #fff7ed)' }}>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>Promesse centrale</span>
            <p className="v3-serif text-lg font-bold" style={{ color: 'var(--v3-ink)' }}>
              <Sparkles className="mr-1 inline h-4 w-4" />{brief.promesseCentrale}
            </p>
          </div>
          <dl className="grid gap-3 md:grid-cols-2">
            {ROWS.filter(([key]) => (brief[key] as string)?.trim()).map(([key, label]) => (
              <div key={key as string} className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--v3-border)' }}>
                <dt className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>{label}</dt>
                <dd className="whitespace-pre-line text-sm" style={{ color: 'var(--v3-ink)' }}>{brief[key] as string}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed px-4 py-6 text-center text-sm" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-muted)' }}>
          Aucune cible générée pour l’instant. Cliquez sur « Générer avec l’IA ».
        </p>
      )}
    </div>
  );
}

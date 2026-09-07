import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import type { CopyBlock } from '@/data/partnerProgram';

interface CopyBlockListProps {
  blocks: CopyBlock[];
  /** Palette : « editorial » (page publique V3) ou « admin » (espace interne). */
  tone?: 'editorial' | 'admin';
}

/**
 * Liste de textes prêts à copier-coller (kit partenaire, messages de démarchage).
 * Chaque bloc est éditable avant copie : on ne force jamais un texte tel quel.
 */
export default function CopyBlockList({ blocks, tone = 'editorial' }: CopyBlockListProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const copy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    toast.success('Texte copié');
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
  };

  const editorial = tone === 'editorial';

  return (
    <div className="space-y-4">
      {blocks.map((block) => {
        const value = drafts[block.key] ?? block.body;
        return (
          <div
            key={block.key}
            className="rounded-lg border bg-white p-4"
            style={{ borderColor: editorial ? 'rgba(15,52,46,0.14)' : 'rgba(35,47,62,0.12)' }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-[200px] flex-1">
                <h3
                  className="text-sm font-bold"
                  style={{ color: editorial ? '#0F342E' : '#232F3E' }}
                >
                  {block.label}
                </h3>
                {block.hint && (
                  <p className="mt-0.5 text-xs" style={{ color: 'rgba(35,47,62,0.6)' }}>
                    {block.hint}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => copy(block.key, value)}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition"
                style={{
                  background: editorial ? '#0F342E' : '#008296',
                  color: '#FFFFFF',
                }}
              >
                {copied === block.key ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Copié
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copier
                  </>
                )}
              </button>
            </div>

            <textarea
              value={value}
              onChange={(e) => setDrafts((d) => ({ ...d, [block.key]: e.target.value }))}
              rows={Math.min(18, Math.max(5, value.split('\n').length + 1))}
              spellCheck={false}
              className="mt-3 w-full resize-y rounded-md border bg-[#FCFCFA] p-3 font-mono text-xs leading-relaxed outline-none focus:ring-2"
              style={{
                borderColor: 'rgba(35,47,62,0.14)',
                color: '#232F3E',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

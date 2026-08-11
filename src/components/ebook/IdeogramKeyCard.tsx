import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Crown, CheckCircle2, KeyRound } from 'lucide-react';
import { getIdeogramKey, setIdeogramKey } from '@/lib/ebookExportOptions';

const GOLD = '#A8842C';

/**
 * Encart doré expliquant l'ajout d'une clé Ideogram v3 (BYOK) pour un rendu
 * typographique professionnel des couvertures. La clé reste locale à l'appareil.
 */
export const IdeogramKeyCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [key, setKey] = useState(getIdeogramKey());

  return (
    <div
      className={`rounded-xl border p-4 space-y-3 ${className}`}
      style={{ borderColor: GOLD, background: 'rgba(168,132,44,0.06)' }}
    >
      <div className="flex items-start gap-2">
        <Crown className="h-4 w-4 mt-0.5 shrink-0" style={{ color: GOLD }} />
        <div className="space-y-1">
          <p className="text-sm font-semibold" style={{ color: GOLD }}>
            Pour un rendu vraiment professionnel : ajoutez votre clé Ideogram
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ideogram v3 est aujourd'hui le seul moteur qui compose un{' '}
            <strong>titre net et parfaitement lisible</strong> directement sur la couverture (les
            autres déforment les lettres). Comptez environ <strong>0,06 € par couverture</strong>.
            <br />
            Créez un compte sur{' '}
            <a
              href="https://ideogram.ai/manage-api"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
              style={{ color: GOLD }}
            >
              ideogram.ai (API)
            </a>
            , copiez votre clé et collez-la ci-dessous : elle reste enregistrée sur votre appareil et
            n'est jamais partagée. Sans clé, la génération continue de fonctionner avec les moteurs
            inclus — la qualité typographique sera simplement moins fine.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="password"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setIdeogramKey(e.target.value);
          }}
          placeholder="Collez votre clé Ideogram ici pour un rendu pro"
          autoComplete="off"
          className="flex-1"
        />
        {key.trim().length > 20 ? (
          <span className="text-[11px] text-emerald-600 flex items-center gap-1 whitespace-nowrap">
            <CheckCircle2 className="h-3.5 w-3.5" /> Clé enregistrée
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground flex items-center gap-1 whitespace-nowrap">
            <KeyRound className="h-3.5 w-3.5" /> Aucune clé
          </span>
        )}
      </div>
    </div>
  );
};

export default IdeogramKeyCard;

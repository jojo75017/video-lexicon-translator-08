import React from 'react';
import { WritingAmbiance } from '@/data/writingAmbiances';

interface AmbiancePreviewProps {
  ambiance: WritingAmbiance;
}

export const AmbiancePreview: React.FC<AmbiancePreviewProps> = ({ ambiance }) => {
  const { palette, fonts } = ambiance;

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-xl border"
      style={{ background: palette.bg, borderColor: palette.surfaceAlt }}
    >
      {/* Barre éditeur factice */}
      <div
        className="px-5 py-3 flex items-center gap-2 text-xs font-medium"
        style={{ background: palette.headerBg, color: palette.headerText }}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        <span className="ml-3 opacity-80">Aperçu éditeur — Ambiance « {ambiance.name} »</span>
      </div>

      {/* Contenu manuscrit factice */}
      <div className="p-8 md:p-12" style={{ color: palette.text }}>
        <div
          className="text-xs uppercase tracking-widest mb-3"
          style={{ color: palette.textMuted, fontFamily: `'${fonts.bodyFamily}', sans-serif` }}
        >
          Chapitre 3
        </div>
        <h1
          className="text-4xl md:text-5xl leading-tight mb-6"
          style={{ fontFamily: `'${fonts.headingFamily}', serif`, color: palette.accent }}
        >
          Le silence avant l'aube
        </h1>
        <p
          className="text-base md:text-lg leading-relaxed mb-4"
          style={{ fontFamily: `'${fonts.bodyFamily}', sans-serif` }}
        >
          Elle posa la tasse sur la table de bois sombre, écouta le craquement familier
          du plancher. Dehors, la ville n'était encore qu'une rumeur. C'était son moment.
          Celui où les mots venaient sans effort, où chaque phrase trouvait sa place
          comme une pierre dans un mur ancien.
        </p>
        <p
          className="text-base md:text-lg leading-relaxed mb-6"
          style={{ fontFamily: `'${fonts.bodyFamily}', sans-serif` }}
        >
          Le manuscrit attendait, patient. Trois cents pages, déjà. Et l'histoire,
          enfin, commençait à respirer toute seule.
        </p>

        <div
          className="rounded-lg p-4 text-sm"
          style={{
            background: palette.surfaceAlt,
            color: palette.textMuted,
            fontFamily: `'${fonts.bodyFamily}', sans-serif`,
          }}
        >
          💡 Note de l'auteur : revenir sur la métaphore du mur ancien — possible parallèle avec l'enfance d'Elsa.
        </div>

        <div className="mt-6 flex gap-2">
          <span
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: palette.accent, color: palette.accentText }}
          >
            Enregistrer
          </span>
          <span
            className="px-3 py-1.5 rounded-full text-xs font-semibold border"
            style={{ borderColor: palette.accent, color: palette.accent }}
          >
            Suggestion IA
          </span>
        </div>
      </div>
    </div>
  );
};

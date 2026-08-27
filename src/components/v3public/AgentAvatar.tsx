interface Props {
  /** Identifiant de l'agent : détermine la variante de visage */
  seed: string;
  accent: string;
  robot?: boolean;
  size?: number;
}

/**
 * Avatar vectoriel maison : personnage stylisé (ou robot) en couleur d'accent.
 * Aucune dépendance aux polices emoji, rendu identique sur tous les appareils.
 */
export default function AgentAvatar({ seed, accent, robot = false, size = 56 }: Props) {
  const hash = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  const hair = hash % 4; // 0 court, 1 long, 2 chignon, 3 bouclé
  const glasses = hash % 3 === 0;
  const skin = ['#F3D2B3', '#E8B98C', '#C98C60', '#8D5A3B'][hash % 4];

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill={`${accent}1f`} />
      {robot ? (
        <>
          <line x1="32" y1="10" x2="32" y2="18" stroke={accent} strokeWidth="2.5" />
          <circle cx="32" cy="9" r="3.5" fill={accent} />
          <rect x="16" y="18" width="32" height="28" rx="9" fill={accent} />
          <rect x="21" y="26" width="22" height="13" rx="6" fill="#F8FAFC" />
          <circle cx="27.5" cy="32.5" r="3" fill={accent} />
          <circle cx="36.5" cy="32.5" r="3" fill={accent} />
          <rect x="24" y="48" width="16" height="9" rx="4" fill={`${accent}bb`} />
        </>
      ) : (
        <>
          {/* épaules */}
          <path d="M12 60c2-11 10-16 20-16s18 5 20 16z" fill={accent} />
          <path d="M27 40h10v8h-10z" fill={skin} />
          {/* tête */}
          <circle cx="32" cy="28" r="14" fill={skin} />
          {/* cheveux */}
          {hair === 0 && <path d="M18 26c0-9 6-14 14-14s14 5 14 14c-4-6-9-8-14-8s-10 2-14 8z" fill={accent} />}
          {hair === 1 && (
            <path d="M17 30c-1-12 6-19 15-19s15 7 14 19c-2-8-4-11-6-12-3 2-13 3-17 0-3 2-5 5-6 12z" fill={accent} />
          )}
          {hair === 2 && (
            <>
              <path d="M18 27c0-9 6-15 14-15s14 6 14 15c-4-7-9-9-14-9s-10 2-14 9z" fill={accent} />
              <circle cx="32" cy="10" r="5" fill={accent} />
            </>
          )}
          {hair === 3 && (
            <>
              <path d="M18 28c0-10 6-16 14-16s14 6 14 16c-4-7-9-9-14-9s-10 2-14 9z" fill={accent} />
              <circle cx="20" cy="24" r="4" fill={accent} />
              <circle cx="44" cy="24" r="4" fill={accent} />
            </>
          )}
          {/* yeux + sourire */}
          <circle cx="27" cy="28" r="1.8" fill="#1F2937" />
          <circle cx="37" cy="28" r="1.8" fill="#1F2937" />
          <path d="M28 34c1.6 1.6 6.4 1.6 8 0" stroke="#1F2937" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          {glasses && (
            <>
              <circle cx="27" cy="28" r="4.5" stroke="#1F2937" strokeWidth="1.3" fill="none" />
              <circle cx="37" cy="28" r="4.5" stroke="#1F2937" strokeWidth="1.3" fill="none" />
              <line x1="31.5" y1="28" x2="32.5" y2="28" stroke="#1F2937" strokeWidth="1.3" />
            </>
          )}
          {/* livre tenu */}
          <rect x="24" y="52" width="16" height="10" rx="1.5" fill="#F8FAFC" stroke={accent} strokeWidth="1.5" />
          <line x1="32" y1="52" x2="32" y2="62" stroke={accent} strokeWidth="1.2" />
        </>
      )}
    </svg>
  );
}

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { THEME } from "../theme";

/** Fond persistant : dégradé papier + formes qui dérivent lentement. */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();

  // Les dégradés sont figés (rasterisés une seule fois) et la dérive passe par
  // des translations : même rendu visuel, rendu vidéo beaucoup plus rapide.
  const drift = (phase: number, amplitude: number) =>
    Math.sin(frame / 220 + phase) * amplitude;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${THEME.bg} 0%, ${THEME.bgDeep} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.55,
          background: `radial-gradient(circle at 28% 22%, ${THEME.emeraldSoft} 0%, transparent 55%)`,
          transform: `translate(${drift(0, 60)}px, ${drift(1, 40)}px)`,
          willChange: "transform",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.7,
          background: `radial-gradient(circle at 78% 74%, ${THEME.goldSoft} 0%, transparent 52%)`,
          transform: `translate(${drift(2, 70)}px, ${drift(3, 46)}px)`,
          willChange: "transform",
        }}
      />


      {/* Filets fins horizontaux — texture éditoriale */}
      {[0.18, 0.42, 0.66, 0.9].map((y, i) => (
        <div
          key={y}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${y * 100}%`,
            height: 1,
            background: "rgba(30,42,50,0.06)",
            transform: `translateX(${drift(i * 1.4, 26)}px)`,
          }}
        />
      ))}

      {/* Trait or vertical, ancre visuelle constante */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 0,
          bottom: 0,
          width: 2,
          background: `linear-gradient(180deg, transparent, ${THEME.gold}, transparent)`,
          opacity: interpolate(frame, [0, 45], [0, 0.35], { extrapolateRight: "clamp" }),
        }}
      />
    </AbsoluteFill>
  );
};

export default Backdrop;

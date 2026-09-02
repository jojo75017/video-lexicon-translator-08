import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { THEME } from "../theme";
import type { Scene } from "../script";

interface Props {
  motif: Scene["motif"];
  fontFamily: string;
  displayFont: string;
}

const Card: React.FC<{
  children: React.ReactNode;
  delay: number;
  x?: number;
  accent?: string;
  width?: number;
}> = ({ children, delay, x = 0, accent = THEME.emerald, width = 320 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 140 } });
  const float = Math.sin((frame - delay) / 42) * 5;
  return (
    <div
      style={{
        width,
        background: THEME.paper,
        borderTop: `4px solid ${accent}`,
        boxShadow: "0 16px 40px rgba(30,42,50,0.10)",
        padding: "22px 24px",
        opacity: s,
        transform: `translate(${interpolate(s, [0, 1], [x + 40, x])}px, ${interpolate(s, [0, 1], [26, float])}px)`,
      }}
    >
      {children}
    </div>
  );
};

const Label: React.FC<{ children: React.ReactNode; font: string }> = ({ children, font }) => (
  <p style={{ margin: 0, fontFamily: font, fontSize: 26, color: THEME.ink, lineHeight: 1.3 }}>
    {children}
  </p>
);

const Tiny: React.FC<{ children: React.ReactNode; font: string }> = ({ children, font }) => (
  <p
    style={{
      margin: "6px 0 0",
      fontFamily: font,
      fontSize: 19,
      color: THEME.inkSoft,
      lineHeight: 1.4,
    }}
  >
    {children}
  </p>
);

/** Visuel dominant, propre à chaque séquence. */
export const Motif: React.FC<Props> = ({ motif, fontFamily, displayFont }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (motif === "opening" || motif === "closing") {
    const ring = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });
    return (
      <div style={{ position: "absolute", right: 150, top: 210 }}>
        <div
          style={{
            width: 380,
            height: 380,
            borderRadius: "50%",
            border: `2px solid ${THEME.gold}`,
            opacity: 0.5 * ring,
            transform: `rotate(${frame / 6}deg) scale(${interpolate(ring, [0, 1], [0.8, 1])})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 60,
            background: THEME.paper,
            boxShadow: "0 20px 50px rgba(30,42,50,0.14)",
            opacity: ring,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translateY(${Math.sin(frame / 46) * 6}px)`,
          }}
        >
          <span
            style={{
              fontFamily: displayFont,
              fontSize: 74,
              color: THEME.emerald,
              letterSpacing: "-0.02em",
            }}
          >
            V3
          </span>
        </div>
      </div>
    );
  }

  if (motif === "problem") {
    const items = [
      "Sommaire en désordre",
      "Chapitres qui se répètent",
      "Couverture au mauvais format",
      "Données KDP à la main",
    ];
    return (
      <div style={{ position: "absolute", right: 130, top: 200, display: "grid", gap: 16 }}>
        {items.map((item, i) => {
          const s = spring({ frame: frame - i * 10, fps, config: { damping: 20 } });
          const strike = interpolate(frame - i * 10 - 22, [0, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={item}
              style={{
                width: 430,
                background: THEME.paper,
                padding: "18px 22px",
                boxShadow: "0 12px 30px rgba(30,42,50,0.08)",
                opacity: s,
                transform: `translateX(${interpolate(s, [0, 1], [50, 0])}px)`,
                position: "relative",
              }}
            >
              <Label font={fontFamily}>{item}</Label>
              <div
                style={{
                  position: "absolute",
                  left: 22,
                  right: 22,
                  top: "52%",
                  height: 2,
                  background: THEME.gold,
                  transform: `scaleX(${strike})`,
                  transformOrigin: "left center",
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }

  if (motif === "outline") {
    return (
      <div style={{ position: "absolute", right: 130, top: 190, display: "grid", gap: 18 }}>
        {["Chapitre 1 — L'idée de départ", "Chapitre 2 — Ce que le lecteur cherche", "Chapitre 3 — La méthode"].map(
          (t, i) => {
            const s = spring({ frame: frame - i * 14, fps, config: { damping: 16, stiffness: 130 } });
            const check = interpolate(frame - i * 14 - 30, [0, 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={t}
                style={{
                  width: 460,
                  background: THEME.paper,
                  padding: "20px 22px",
                  borderLeft: `4px solid ${THEME.emerald}`,
                  boxShadow: "0 14px 34px rgba(30,42,50,0.09)",
                  opacity: s,
                  transform: `translateY(${interpolate(s, [0, 1], [30, Math.sin((frame - i * 20) / 50) * 4])}px)`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <Label font={fontFamily}>{t}</Label>
                <span
                  style={{
                    fontFamily: fontFamily,
                    fontSize: 24,
                    color: THEME.emerald,
                    opacity: check,
                    transform: `scale(${0.6 + check * 0.4})`,
                  }}
                >
                  ✓
                </span>
              </div>
            );
          },
        )}
      </div>
    );
  }

  if (motif === "writing") {
    const words = interpolate(frame, [0, 200], [340, 3180], { extrapolateRight: "clamp" });
    return (
      <div style={{ position: "absolute", right: 140, top: 210, display: "grid", gap: 20 }}>
        <Card delay={0} width={420}>
          <Tiny font={fontFamily}>Chapitre en cours</Tiny>
          <p
            style={{
              margin: "4px 0 0",
              fontFamily: displayFont,
              fontSize: 62,
              color: THEME.ink,
            }}
          >
            {Math.round(words).toLocaleString("fr-FR")} mots
          </p>
          <div style={{ marginTop: 14, height: 6, background: "rgba(30,42,50,0.08)" }}>
            <div
              style={{
                height: "100%",
                width: `${interpolate(frame, [0, 200], [8, 92], { extrapolateRight: "clamp" })}%`,
                background: THEME.emerald,
              }}
            />
          </div>
        </Card>
        <Card delay={26} width={420} accent={THEME.gold}>
          <Tiny font={fontFamily}>Mémoire du livre</Tiny>
          <Label font={fontFamily}>Personnages · lieux · dates · révélations</Label>
        </Card>
        <Card delay={52} width={420} accent={THEME.emerald}>
          <Tiny font={fontFamily}>Le chapitre 12 se souvient du chapitre 3</Tiny>
        </Card>
      </div>
    );
  }

  if (motif === "proof") {
    const passes = ["Dictée & ponctuation", "Répétitions & mots parasites", "Cohérence du récit", "Typographie française"];
    return (
      <div style={{ position: "absolute", right: 130, top: 200, display: "grid", gap: 14 }}>
        {passes.map((p, i) => {
          const s = spring({ frame: frame - i * 22, fps, config: { damping: 20 } });
          const bar = interpolate(frame - i * 22 - 12, [0, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={p}
              style={{
                width: 450,
                background: THEME.paper,
                padding: "16px 20px",
                boxShadow: "0 12px 28px rgba(30,42,50,0.08)",
                opacity: s,
                transform: `translateX(${interpolate(s, [0, 1], [40, 0])}px)`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Label font={fontFamily}>
                  Passe {i + 1} — {p}
                </Label>
                <span style={{ fontFamily, fontSize: 20, color: THEME.emerald }}>
                  {Math.round(bar * 100)} %
                </span>
              </div>
              <div style={{ marginTop: 10, height: 4, background: "rgba(30,42,50,0.08)" }}>
                <div style={{ height: "100%", width: `${bar * 100}%`, background: THEME.emerald }} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (motif === "publish") {
    const items = [
      ["Couverture", "Recto · tranche · verso — 300 dpi"],
      ["Export", "PDF · DOCX · EPUB · Audio"],
      ["Données KDP", "7 mots-clés · catégories BISAC"],
      ["Vendre", "Niches · concurrence · avis"],
    ];
    return (
      <div
        style={{
          position: "absolute",
          right: 130,
          top: 195,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        {items.map(([t, d], i) => (
          <Card key={t} delay={i * 16} width={250} accent={i % 2 ? THEME.gold : THEME.emerald}>
            <Label font={fontFamily}>{t}</Label>
            <Tiny font={fontFamily}>{d}</Tiny>
          </Card>
        ))}
      </div>
    );
  }

  // pricing
  const plans = [
    ["Plume", "27 €", "30 livres / mois · 40 chapitres"],
    ["Édition", "47 €", "Livres illimités · 60 chapitres"],
    ["Studio Pro", "97 €", "Tout inclus · séries multi-tomes"],
  ];
  return (
    <div style={{ position: "absolute", right: 130, top: 190, display: "grid", gap: 16 }}>
      {plans.map(([name, price, detail], i) => {
        const s = spring({ frame: frame - i * 26, fps, config: { damping: 17, stiffness: 130 } });
        const featured = i === 1;
        return (
          <div
            key={name}
            style={{
              width: 470,
              background: featured ? THEME.ink : THEME.paper,
              padding: "22px 26px",
              boxShadow: "0 16px 38px rgba(30,42,50,0.12)",
              opacity: s,
              transform: `translateY(${interpolate(s, [0, 1], [34, Math.sin((frame - i * 18) / 54) * 4])}px)`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 18,
              borderLeft: `4px solid ${featured ? THEME.gold : THEME.emerald}`,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontFamily: displayFont,
                  fontSize: 34,
                  color: featured ? THEME.paper : THEME.ink,
                }}
              >
                {name}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontFamily,
                  fontSize: 19,
                  color: featured ? "rgba(255,255,255,0.72)" : THEME.inkSoft,
                }}
              >
                {detail}
              </p>
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: displayFont,
                fontSize: 46,
                color: featured ? THEME.gold : THEME.emerald,
              }}
            >
              {price}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Motif;

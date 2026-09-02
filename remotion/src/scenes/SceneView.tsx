import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { THEME } from "../theme";
import type { Scene } from "../script";
import Subtitles from "../components/Subtitles";
import Motif from "../components/Motif";

interface Props {
  scene: Scene;
  index: number;
  total: number;
  fontFamily: string;
  displayFont: string;
}

export const SceneView: React.FC<Props> = ({ scene, index, total, fontFamily, displayFont }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 26 });
  const chapterSpring = spring({ frame: frame - 6, fps, config: { damping: 200 }, durationInFrames: 18 });
  const globalProgress = (index + Math.min(1, frame / durationInFrames)) / total;

  return (
    <AbsoluteFill>
      {/* Chapitre */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 132,
          opacity: chapterSpring,
          transform: `translateX(${interpolate(chapterSpring, [0, 1], [-24, 0])}px)`,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ width: 46, height: 2, background: THEME.gold }} />
        <span
          style={{
            fontFamily,
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: THEME.inkSoft,
          }}
        >
          {scene.chapter}
        </span>
      </div>

      {/* Titre */}
      <h1
        style={{
          position: "absolute",
          left: 150,
          top: 178,
          margin: 0,
          maxWidth: 760,
          fontFamily: displayFont,
          fontSize: 88,
          lineHeight: 1.02,
          letterSpacing: "-0.025em",
          color: THEME.ink,
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [34, 0])}px)`,
        }}
      >
        {scene.title}
      </h1>

      {/* Puces clés */}
      <div
        style={{
          position: "absolute",
          left: 152,
          top: 404,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          maxWidth: 760,
        }}
      >
        {scene.chips.map((chip, i) => {
          const s = spring({ frame: frame - 20 - i * 8, fps, config: { damping: 20 } });
          return (
            <span
              key={chip}
              style={{
                fontFamily,
                fontSize: 21,
                color: THEME.emerald,
                background: "rgba(11,110,85,0.09)",
                padding: "10px 18px",
                opacity: s,
                transform: `translateY(${interpolate(s, [0, 1], [14, 0])}px)`,
              }}
            >
              {chip}
            </span>
          );
        })}
      </div>

      <Motif motif={scene.motif} fontFamily={fontFamily} displayFont={displayFont} />

      <Subtitles lines={scene.lines} startAt={30} fontFamily={fontFamily} />

      {/* Progression globale */}
      <div style={{ position: "absolute", left: 150, right: 120, bottom: 54 }}>
        <div style={{ height: 3, background: "rgba(30,42,50,0.10)" }}>
          <div style={{ height: "100%", width: `${globalProgress * 100}%`, background: THEME.emerald }} />
        </div>
        <div
          style={{
            marginTop: 12,
            display: "flex",
            justifyContent: "space-between",
            fontFamily,
            fontSize: 18,
            color: THEME.inkSoft,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span>Ebookstudio V3</span>
          <span>
            {index + 1} / {total}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default SceneView;

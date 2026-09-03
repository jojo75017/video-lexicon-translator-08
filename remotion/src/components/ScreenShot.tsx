import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { THEME } from "../theme";

interface Props {
  file: string;
  caption: string;
  fontFamily: string;
}

/** Capture réelle de l'application, cadrée dans une fenêtre claire. */
export const ScreenShot: React.FC<Props> = ({ file, caption, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame: frame - 14, fps, config: { damping: 200 }, durationInFrames: 32 });
  const zoom = interpolate(frame, [0, 600], [1.02, 1.1], { extrapolateRight: "clamp" });
  const drift = Math.sin(frame / 90) * 8;

  return (
    <div
      style={{
        position: "absolute",
        right: 110,
        top: 190,
        width: 820,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [40, drift])}px)`,
      }}
    >
      <div
        style={{
          background: THEME.paper,
          boxShadow: "0 30px 70px rgba(30,42,50,0.18)",
          borderTop: `4px solid ${THEME.emerald}`,
          padding: 14,
        }}
      >
        <div style={{ position: "relative", height: 430, overflow: "hidden", background: THEME.bgDeep }}>
          <AbsoluteFill>
            <Img
              src={staticFile(`images/${file}`)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
                transform: `scale(${zoom})`,
              }}
            />
          </AbsoluteFill>
        </div>
        <p
          style={{
            margin: "14px 4px 2px",
            fontFamily,
            fontSize: 20,
            color: THEME.inkSoft,
            letterSpacing: "0.02em",
          }}
        >
          {caption}
        </p>
      </div>
    </div>
  );
};

export default ScreenShot;

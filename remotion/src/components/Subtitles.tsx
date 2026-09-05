import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { THEME } from "../theme";


interface Props {
  lines: string[];
  /** Durée en frames de chaque sous-titre (calée sur la voix off). */
  lineFrames: number[];
  /** Frame à laquelle le premier sous-titre apparaît. */
  startAt: number;
  fontFamily: string;
}

/** Bande de sous-titres incrustés, une réplique à la fois. */
export const Subtitles: React.FC<Props> = ({ lines, lineFrames, startAt, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let cursor = startAt;
  let active = -1;
  let localFrame = 0;
  let activeDuration = 0;

  for (let i = 0; i < lines.length; i += 1) {
    const dur = lineFrames[i] ?? 90;
    if (frame >= cursor && frame < cursor + dur) {
      active = i;
      localFrame = frame - cursor;
      activeDuration = dur;
      break;
    }
    cursor += dur;
  }

  if (active === -1) return null;

  const enter = spring({ frame: localFrame, fps, config: { damping: 200 }, durationInFrames: 14 });
  const exit = interpolate(localFrame, [activeDuration - 10, activeDuration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = enter * exit;
  const y = interpolate(enter, [0, 1], [22, 0]);
  const progress = interpolate(localFrame, [0, activeDuration], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 150,
        right: 120,
        bottom: 92,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.92)",
          borderLeft: `5px solid ${THEME.emerald}`,
          boxShadow: "0 18px 46px rgba(30,42,50,0.12)",
          padding: "26px 34px 24px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily,
            fontSize: 40,
            lineHeight: 1.34,
            color: THEME.ink,
            letterSpacing: "-0.01em",
          }}
        >
          {lines[active]}
        </p>
        <div style={{ marginTop: 18, height: 3, background: "rgba(30,42,50,0.08)" }}>
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              background: THEME.gold,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Subtitles;

import React from "react";
import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { FPS, SCENES, TOTAL_DURATION } from "./script";
import { TRANSITION_FRAMES } from "./theme";

const TOTAL = TOTAL_DURATION - TRANSITION_FRAMES * (SCENES.length - 1);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="main"
    component={MainVideo}
    durationInFrames={TOTAL}
    fps={FPS}
    width={1920}
    height={1080}
  />
);

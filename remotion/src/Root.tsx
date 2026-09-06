import React from "react";
import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { FPS, SCENES, TOTAL_DURATION } from "./script";
import {
  SCENES_BIENVENUE,
  SCENE_DURATIONS_BIENVENUE,
  LINE_DURATIONS_BIENVENUE,
  SUBTITLE_START_BIENVENUE,
  TOTAL_DURATION_BIENVENUE,
} from "./scriptBienvenue";
import { TRANSITION_FRAMES } from "./theme";

const TOTAL = TOTAL_DURATION - TRANSITION_FRAMES * (SCENES.length - 1);
const TOTAL_BIENVENUE =
  TOTAL_DURATION_BIENVENUE - TRANSITION_FRAMES * (SCENES_BIENVENUE.length - 1);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="main"
      component={MainVideo}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="bienvenue"
      component={MainVideo}
      durationInFrames={TOTAL_BIENVENUE}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{
        scenes: SCENES_BIENVENUE,
        sceneDurations: SCENE_DURATIONS_BIENVENUE,
        lineDurations: LINE_DURATIONS_BIENVENUE,
        subtitleStart: SUBTITLE_START_BIENVENUE,
      }}
    />
  </>
);

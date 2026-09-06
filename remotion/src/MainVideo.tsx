import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont as loadDisplay } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadBody } from "@remotion/google-fonts/WorkSans";
import { SCENES, SCENE_DURATIONS, LINE_DURATIONS, SUBTITLE_START, type Scene } from "./script";
import { TRANSITION_FRAMES } from "./theme";
import Backdrop from "./components/Backdrop";
import SceneView from "./scenes/SceneView";

const display = loadDisplay("normal", { weights: ["600"], subsets: ["latin"] });
const body = loadBody("normal", { weights: ["400", "500"], subsets: ["latin"] });

interface Props {
  scenes?: Scene[];
  sceneDurations?: number[];
  lineDurations?: number[][];
  subtitleStart?: number;
}

export const MainVideo: React.FC<Props> = ({
  scenes = SCENES,
  sceneDurations = SCENE_DURATIONS,
  lineDurations = LINE_DURATIONS,
  subtitleStart = SUBTITLE_START,
}) => {
  return (
    <AbsoluteFill>
      <Backdrop />
      <TransitionSeries>
        {scenes.map((scene, i) => (
          <React.Fragment key={scene.title}>
            <TransitionSeries.Sequence durationInFrames={sceneDurations[i]}>
              <SceneView
                scene={scene}
                index={i}
                total={scenes.length}
                fontFamily={body.fontFamily}
                displayFont={display.fontFamily}
                lineFrames={lineDurations[i]}
                startAt={i === 0 ? subtitleStart : 0}
              />
            </TransitionSeries.Sequence>
            {i < scenes.length - 1 ? (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            ) : null}
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export default MainVideo;

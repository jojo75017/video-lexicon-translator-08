import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont as loadDisplay } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadBody } from "@remotion/google-fonts/WorkSans";
import { SCENES, SCENE_DURATIONS } from "./script";
import { TRANSITION_FRAMES } from "./theme";
import Backdrop from "./components/Backdrop";
import SceneView from "./scenes/SceneView";

const display = loadDisplay("normal", { weights: ["600"], subsets: ["latin"] });
const body = loadBody("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Backdrop />
      <TransitionSeries>
        {SCENES.map((scene, i) => (
          <React.Fragment key={scene.title}>
            <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS[i]}>
              <SceneView
                scene={scene}
                index={i}
                total={SCENES.length}
                fontFamily={body.fontFamily}
                displayFont={display.fontFamily}
              />
            </TransitionSeries.Sequence>
            {i < SCENES.length - 1 ? (
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

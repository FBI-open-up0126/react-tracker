import React from "react";
import "./PageNotFound.scss";

/**
 * The start size of the animation.
 * Bigger the value means the font at start will be bigger
 * and the entire font size will also be bigger
 */
const ANIM_START_SIZE = 80;

/**
 * The flatness of the value. The bigger the value
 * the more flat the animation is
 */
const FLATNESS = 15;

export default function PageNotFound(): JSX.Element {
  const [textSize, setTextSize] = React.useState(ANIM_START_SIZE);

  // Only run once, after the first render happens, so that it will only
  // requestAnimationFrame for once
  React.useEffect(() => {
    const startTime = Date.now();

    const animation = () => {
      setTextSize(() => {
        const t = 6_000; // time for each animation

        const timeElapsed = Date.now() - startTime;
        const timeSinceStart = timeElapsed % t;

        const sizeToIncrease =
          -Math.pow((timeSinceStart % t) - t / 2, 2) / (t * FLATNESS) +
          t / (FLATNESS * 4);

        return sizeToIncrease + ANIM_START_SIZE;
      });
      requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  }, []);

  return (
    <>
      <p
        className="rainbow rainbow-text-animated"
        style={{
          fontSize: `${textSize}px`,
          textAlign: "center",
        }}
      >
        PaGe NoT fOuNd!!!!!
      </p>
    </>
  );
}

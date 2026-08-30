import React from "react";
import { Canvas } from "@react-three/fiber";
import { PufferFish, type FishAnimationState } from "./PufferFish";
import { PufferBubbles, type BubbleTrigger } from "./PufferBubbles";

interface PufferSceneProps {
  animState: FishAnimationState;
  onFishClick: () => void;
  bubbleTriggerRef: React.MutableRefObject<BubbleTrigger | null>;
}

export const PufferScene: React.FC<PufferSceneProps> = ({
  animState,
  onFishClick,
  bubbleTriggerRef,
}) => {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 3.8], fov: 48 }}
      dpr={[1, typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      {/* Studio-lit lighting matching snippet's reference look */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} />
      <directionalLight position={[-5, 5, 2]} intensity={0.5} color="#ffebd6" />
      <directionalLight position={[0, -4, 4]} intensity={0.25} color="#ffffff" />

      {/* Bubbles instanced pool */}
      <PufferBubbles triggerRef={bubbleTriggerRef} />

      {/* Procedural fish */}
      <PufferFish
        animState={animState}
        onFishClick={onFishClick}
        triggerBubbles={(x, y, z, count, spread, speed) =>
          bubbleTriggerRef.current?.(x, y, z, count, spread, speed)
        }
      />
    </Canvas>
  );
};

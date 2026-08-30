import React, { Suspense } from "react";
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
      camera={{ position: [0, 0.2, 4.6], fov: 46 }}
      dpr={[1, typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      {/* ── Studio 3-Point Lighting Setup ── */}
      {/* Soft natural ambient fill */}
      <ambientLight intensity={1.3} color="#fff8f0" />

      {/* Main key light: warm sunny highlight from top-front-right */}
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#ffffff" />

      {/* Cool blue-cyan rim backlight: highlights spikes, fins, and body silhouette */}
      <directionalLight position={[-4, 3, -4]} intensity={2.4} color="#38bdf8" />

      {/* Soft warm bottom bounce light: illuminates the crème belly */}
      <directionalLight position={[0, -4, 2]} intensity={1.2} color="#ffedd5" />

      {/* Top subtle rim highlight */}
      <pointLight position={[0, 4, 0]} intensity={1.1} color="#ffffff" distance={10} />

      <Suspense fallback={null}>
        <PufferFish
          animState={animState}
          onFishClick={onFishClick}
          triggerBubbles={(x, y, z, count, spread, speed) => {
            bubbleTriggerRef.current?.(x, y, z, count, spread, speed);
          }}
        />
        <PufferBubbles triggerRef={bubbleTriggerRef} />
      </Suspense>
    </Canvas>
  );
};

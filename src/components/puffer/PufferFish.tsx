import React, { useRef, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PufferBody } from "./PufferBody";
import { PufferEyes, type PufferEyesHandle } from "./PufferEyes";
import { PufferFins, type PufferFinsHandle } from "./PufferFins";
import { PufferSpikes } from "./PufferSpikes";
import type { BubbleTrigger } from "./PufferBubbles";

export interface FishAnimationState {
  isHovered: boolean;
  isSwimmingDown: boolean;
  isTransitioningToCorner: boolean;
  reducedMotion: boolean;
  isMobile: boolean;
}

interface PufferFishProps {
  animState: FishAnimationState;
  onFishClick: () => void;
  triggerBubbles: BubbleTrigger;
}

export const PufferFish: React.FC<PufferFishProps> = ({
  animState,
  onFishClick,
  triggerBubbles,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const eyesRef = useRef<PufferEyesHandle>(null);
  const finsRef = useRef<PufferFinsHandle>(null);

  // Puff animation
  const puffProgress = useRef(0);
  const isPuffActive = useRef(false);
  const puffCooldown = useRef(false);
  const [visualPuff, setVisualPuff] = useState(0);

  // Smooth transforms
  const currentScale = useRef(1.15);
  const currentRotY = useRef(0.78);
  const currentRotX = useRef(0);
  const currentRotZ = useRef(0);
  const currentY = useRef(0);
  const currentX = useRef(0);

  // Timers / state
  const idleBubbleTimer = useRef(0);
  const swimBubbleTimer = useRef(0);

  const { pointer } = useThree();

  /* ── click → puff + BIG visible bubble burst ── */
  const handleClick = useCallback(() => {
    if (puffCooldown.current) return;
    puffCooldown.current = true;
    isPuffActive.current = true;

    // Large burst — spawn 20 bubbles spread all around the fish
    triggerBubbles(0, 0, 0, 20, 0.9, 1.25);

    onFishClick();
    setTimeout(() => { puffCooldown.current = false; }, 700);
  }, [onFishClick, triggerBubbles]);

  useFrame((state, delta) => {
    if (!rootGroupRef.current) return;
    const time = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.1);

    /* 1 ── puff spring */
    if (isPuffActive.current) {
      puffProgress.current = THREE.MathUtils.lerp(puffProgress.current, 1.0, 14 * dt);
      if (puffProgress.current > 0.93) isPuffActive.current = false;
    } else {
      puffProgress.current = THREE.MathUtils.lerp(puffProgress.current, 0.0, 5 * dt);
    }
    if (Math.abs(puffProgress.current - visualPuff) > 0.03) setVisualPuff(puffProgress.current);

    /* 2 ── dynamic scale (shrinks smoothly during swim to corner to prevent clipping) */
    const baseSize = animState.isSwimmingDown
      ? 1.15
      : animState.isTransitioningToCorner
      ? 0.95
      : 0.88;

    const hoverBonus = animState.isHovered && !animState.isMobile ? 0.05 : 0;
    const targetScale = baseSize * (1 + puffProgress.current * 0.18 + hoverBonus);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 6 * dt);
    rootGroupRef.current.scale.setScalar(currentScale.current);

    /* 3 ── loading state in center: (+0.78 rad) */
    if (animState.isSwimmingDown) {
      const bobY = Math.sin(time * 2.2) * 0.05;
      currentY.current = THREE.MathUtils.lerp(currentY.current, bobY, 8 * dt);
      currentX.current = THREE.MathUtils.lerp(currentX.current, 0, 8 * dt);

      currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, 0.78, 8 * dt);
      currentRotX.current = THREE.MathUtils.lerp(currentRotX.current, Math.sin(time * 1.5) * 0.04, 8 * dt);
      currentRotZ.current = THREE.MathUtils.lerp(currentRotZ.current, Math.cos(time * 1.2) * 0.03, 8 * dt);

      // Continuous bubbles in loading screen
      idleBubbleTimer.current += dt;
      if (idleBubbleTimer.current > 0.4) {
        idleBubbleTimer.current = 0;
        triggerBubbles(-0.25, -0.2, 0.4, 2, 0.35, 0.85);
      }

    } else if (animState.isTransitioningToCorner) {
      /* 4 ── ACTIVE SWIMMING TO CORNER: dynamic dive angle & trailing bubble wake */
      swimBubbleTimer.current += dt;
      if (swimBubbleTimer.current > 0.06) {
        swimBubbleTimer.current = 0;
        // Continuous trailing bubble wake behind the tail
        triggerBubbles(0.35, -0.1, -0.5, 3, 0.25, 1.0);
      }

      // Dynamic swimming undulation
      const swimBob = Math.sin(time * 8.0) * 0.04;
      currentY.current = THREE.MathUtils.lerp(currentY.current, swimBob, 10 * dt);
      currentX.current = THREE.MathUtils.lerp(currentX.current, Math.cos(time * 8.0) * 0.03, 10 * dt);

      // Angled downward in direction of travel
      currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, 0.98, 8 * dt);
      currentRotX.current = THREE.MathUtils.lerp(currentRotX.current, 0.16, 8 * dt);
      currentRotZ.current = THREE.MathUtils.lerp(currentRotZ.current, 0.24, 8 * dt);

    } else {
      /* 5 ── reached corner: resting rotation (-0.78 rad) */
      const bobAmp = animState.reducedMotion ? 0.01 : 0.06;
      const bobY = Math.sin(time * 2.0) * bobAmp;
      currentY.current = THREE.MathUtils.lerp(currentY.current, bobY, 8 * dt);
      currentX.current = THREE.MathUtils.lerp(currentX.current, 0, 8 * dt);

      // Continuous ambient bubbles in corner
      idleBubbleTimer.current += dt;
      if (idleBubbleTimer.current > 0.55) {
        idleBubbleTimer.current = 0;
        if (!animState.reducedMotion) {
          triggerBubbles(
            (Math.random() - 0.5) * 0.7,
            -0.3 + Math.random() * 0.5,
            0.3 + Math.random() * 0.35,
            2,
            0.35,
            0.8
          );
        }
      }

      // Extra bubbles on hover
      if (animState.isHovered && Math.random() < 0.18) {
        triggerBubbles(
          (Math.random() - 0.5) * 0.6,
          -0.2 + Math.random() * 0.4,
          0.4,
          1,
          0.3,
          0.9
        );
      }

      /* 6 ── resting rotation in corner: (-0.78 rad) */
      const baseY = -0.78;
      if (!animState.reducedMotion && !animState.isMobile) {
        const lookX = THREE.MathUtils.clamp(pointer.x * 0.25, -0.25, 0.25);
        const lookY = THREE.MathUtils.clamp(-pointer.y * 0.18, -0.18, 0.18);
        const swayY = Math.sin(time * 1.1) * 0.03;
        const swayX = Math.cos(time * 1.6) * 0.018;

        currentRotY.current = THREE.MathUtils.lerp(
          currentRotY.current,
          baseY + lookX + swayY,
          5 * dt
        );
        currentRotX.current = THREE.MathUtils.lerp(
          currentRotX.current,
          lookY + swayX,
          5 * dt
        );
        currentRotZ.current = THREE.MathUtils.lerp(
          currentRotZ.current,
          Math.sin(time * 1.4) * 0.028,
          6 * dt
        );

        // Pupil tracking
        eyesRef.current?.setPupilOffset(
          THREE.MathUtils.clamp(pointer.x * 0.042, -0.05, 0.05),
          pointer.y * 0.038
        );
      } else {
        currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, baseY, 5 * dt);
        currentRotX.current = THREE.MathUtils.lerp(currentRotX.current, 0, 5 * dt);
        currentRotZ.current = THREE.MathUtils.lerp(currentRotZ.current, 0, 5 * dt);
        eyesRef.current?.setPupilOffset(-0.015, 0);
      }
    }

    /* Apply transforms */
    rootGroupRef.current.position.set(currentX.current, currentY.current, 0);
    rootGroupRef.current.rotation.set(currentRotX.current, currentRotY.current, currentRotZ.current);

    /* Fin speed: fast energetic swimming flutter during transit */
    let spd = 1.0, amp = 1.0;
    if (animState.isTransitioningToCorner) { spd = 3.4; amp = 1.8; }
    else if (animState.isSwimmingDown) { spd = 1.6; amp = 1.2; }
    else if (animState.isHovered) { spd = 1.8; amp = 1.3; }
    if (animState.reducedMotion) { spd = 0.4; amp = 0.3; }
    finsRef.current?.animateFins(time, spd, amp);
  });

  return (
    <group
      ref={rootGroupRef}
      onClick={(e) => { e.stopPropagation(); handleClick(); }}
    >
      <PufferBody puffProgress={visualPuff} />
      <PufferEyes ref={eyesRef} puffProgress={visualPuff} />
      <PufferFins ref={finsRef} />
      <PufferSpikes puffProgress={visualPuff} />
    </group>
  );
};

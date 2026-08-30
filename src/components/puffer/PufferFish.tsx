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
  const currentScale = useRef(1.0);
  const currentRotY = useRef(-0.78);
  const currentRotX = useRef(0);
  const currentRotZ = useRef(0);
  const currentY = useRef(0);
  const currentX = useRef(0);

  // Timers / state
  const idleBubbleTimer = useRef(0);
  const entryTimer = useRef(0);
  const swimBubbleTimer = useRef(0);

  const { pointer } = useThree();

  /* ── click → puff + BIG visible bubble burst ── */
  const handleClick = useCallback(() => {
    if (puffCooldown.current) return;
    puffCooldown.current = true;
    isPuffActive.current = true;

    // Large burst — spawn 18 bubbles spread all around the fish
    triggerBubbles(0, 0, 0, 18, 0.9, 1.2);

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

    /* 2 ── scale */
    const hoverBonus = animState.isHovered && !animState.isMobile ? 0.05 : 0;
    const targetScale = 0.95 * (1 + puffProgress.current * 0.18 + hoverBonus);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 10 * dt);
    rootGroupRef.current.scale.setScalar(currentScale.current);

    /* 3 ── loading dive from top → center */
    if (animState.isSwimmingDown) {
      entryTimer.current += dt;
      const t = Math.min(entryTimer.current / 1.1, 1.0);
      const ease = 1 - Math.pow(1 - t, 3);
      currentY.current = (1 - ease) * 5.0;
      currentX.current = THREE.MathUtils.lerp(currentX.current, 0, 8 * dt);

      // Face left-profile while falling
      currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, -0.65, 8 * dt);
      currentRotX.current = THREE.MathUtils.lerp(currentRotX.current, (1 - ease) * -0.22, 8 * dt);
      currentRotZ.current = THREE.MathUtils.lerp(currentRotZ.current, (1 - ease) * 0.12, 8 * dt);

      // Drop bubbles while falling
      if (Math.random() < 0.35) triggerBubbles(0, currentY.current - 0.3, 0.4, 1, 0.25, 0.9);

    } else if (animState.isTransitioningToCorner) {
      /* 4 ── swim to corner — continuous bubble trail */
      swimBubbleTimer.current += dt;
      if (swimBubbleTimer.current > 0.08) {
        swimBubbleTimer.current = 0;
        triggerBubbles(-0.4, 0, -0.6, 3, 0.22, 0.85);
      }
      currentRotZ.current = THREE.MathUtils.lerp(currentRotZ.current, -0.24, 10 * dt);
      currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, -0.78, 8 * dt);

    } else {
      /* 5 ── idle bob */
      const bobAmp = animState.reducedMotion ? 0.01 : 0.06;
      const bobY = Math.sin(time * 2.0) * bobAmp;
      currentY.current = THREE.MathUtils.lerp(currentY.current, bobY, 8 * dt);
      currentX.current = THREE.MathUtils.lerp(currentX.current, 0, 8 * dt);

      // Continuous ambient bubbles floating up around fish
      idleBubbleTimer.current += dt;
      if (idleBubbleTimer.current > 0.65) {
        idleBubbleTimer.current = 0;
        if (!animState.reducedMotion) {
          triggerBubbles(0.35 + Math.random() * 0.4, -0.3 + Math.random() * 0.5, 0.4 + Math.random() * 0.4, 2, 0.35, 0.75);
        }
      }

      /* 6 ── resting rotation: opposite side (face RIGHT showing LEFT profile) */
      const baseY = -0.78;
      if (!animState.reducedMotion && !animState.isMobile) {
        const lookX = THREE.MathUtils.clamp(pointer.x * 0.25, -0.25, 0.25);
        const lookY = THREE.MathUtils.clamp(-pointer.y * 0.18, -0.18, 0.18);
        const swayY = Math.sin(time * 1.1) * 0.03;
        const swayX = Math.cos(time * 1.6) * 0.018;

        currentRotY.current = THREE.MathUtils.lerp(
          currentRotY.current,
          baseY + lookX + swayY,
          6 * dt
        );
        currentRotX.current = THREE.MathUtils.lerp(
          currentRotX.current,
          lookY + swayX,
          6 * dt
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

    /* Fin speed */
    let spd = 1.0, amp = 1.0;
    if (animState.isTransitioningToCorner || animState.isSwimmingDown) { spd = 2.2; amp = 1.5; }
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

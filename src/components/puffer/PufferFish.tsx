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
  isAssistantOpen: boolean;
  reducedMotion: boolean;
  isMobile: boolean;
}

interface PufferFishProps {
  animState: FishAnimationState;
  onFishClick?: () => void;
  onFishDoubleClick?: () => void;
  triggerBubbles: BubbleTrigger;
}

export const PufferFish: React.FC<PufferFishProps> = ({
  animState,
  onFishClick,
  onFishDoubleClick,
  triggerBubbles,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const eyesRef = useRef<PufferEyesHandle>(null);
  const finsRef = useRef<PufferFinsHandle>(null);

  // Puff animation & hold/release tracking
  const puffProgress = useRef(0);
  const isHolding = useRef(false);
  const isPuffActive = useRef(false);
  const puffReleasePending = useRef(false);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const clickCount = useRef(0);
  const [visualPuff, setVisualPuff] = useState(0);

  // 3D Spin transition on assistant open / close
  const prevAssistantOpen = useRef(animState.isAssistantOpen);
  const spinAngle = useRef(0);
  const targetSpinAngle = useRef(0);

  // Smooth transforms
  const currentScale = useRef(1.15);
  const currentRotY = useRef(0.78);
  const currentRotX = useRef(0);
  const currentRotZ = useRef(0);
  const currentY = useRef(0);
  const currentX = useRef(0);

  const swimBubbleTimer = useRef(0);
  const { pointer } = useThree();

  /* ── Detect Assistant Open / Close to trigger spin & bubbles ── */
  if (prevAssistantOpen.current !== animState.isAssistantOpen) {
    prevAssistantOpen.current = animState.isAssistantOpen;
    // Add full 360 degree spin (or -360 on close)
    targetSpinAngle.current += animState.isAssistantOpen ? Math.PI * 2 : -Math.PI * 2;
    triggerBubbles(0, 0, 0.4, 4, 0.25, 0.9);
  }

  // Hold vs quick-click distinction
  const holdThresholdTimer = useRef<NodeJS.Timeout | null>(null);
  const pointerDownTime = useRef<number>(0);
  const wasHeldLongEnough = useRef<boolean>(false);

  /* ── Hold for Puff (Pointer Down with threshold delay) ── */
  const handlePointerDown = useCallback(() => {
    if (animState.isAssistantOpen) return;
    pointerDownTime.current = performance.now();
    wasHeldLongEnough.current = false;

    // Only start inflating if mouse is held for at least 220ms
    if (holdThresholdTimer.current) clearTimeout(holdThresholdTimer.current);
    holdThresholdTimer.current = setTimeout(() => {
      wasHeldLongEnough.current = true;
      isHolding.current = true;
      isPuffActive.current = true;
      puffReleasePending.current = true;
    }, 220);
  }, [animState.isAssistantOpen]);

  /* ── Release Puff (Pointer Up / Leave) ── */
  const handlePointerUp = useCallback(() => {
    if (animState.isAssistantOpen) return;
    if (holdThresholdTimer.current) {
      clearTimeout(holdThresholdTimer.current);
      holdThresholdTimer.current = null;
    }

    if (isHolding.current || wasHeldLongEnough.current) {
      isHolding.current = false;
      isPuffActive.current = false;
      if (puffReleasePending.current) {
        puffReleasePending.current = false;
        triggerBubbles(0, -0.05, 0.5, 5, 0.35, 1.0);
      }
    }
  }, [animState.isAssistantOpen, triggerBubbles]);

  /* ── Click Distinction (Single Click for Interaction, Double Click for Chat) ── */
  const handleClick = useCallback(() => {
    // If it was a long hold-to-puff release, do not trigger single click dialogue
    if (wasHeldLongEnough.current) {
      wasHeldLongEnough.current = false;
      return;
    }

    clickCount.current += 1;
    if (clickCount.current === 1) {
      clickTimeout.current = setTimeout(() => {
        if (clickCount.current === 1 && !animState.isAssistantOpen) {
          onFishClick?.();
        }
        clickCount.current = 0;
      }, 260);
    } else if (clickCount.current >= 2) {
      if (clickTimeout.current) clearTimeout(clickTimeout.current);
      clickCount.current = 0;
      // Double click
      isPuffActive.current = true;
      puffReleasePending.current = true;
      triggerBubbles(0, 0, 0.7, 5, 0.35, 1.1);
      setTimeout(() => {
        isPuffActive.current = false;
      }, 400);
      onFishDoubleClick?.();
    }
  }, [animState.isAssistantOpen, onFishClick, onFishDoubleClick, triggerBubbles]);

  useFrame((state, delta) => {
    if (!rootGroupRef.current) return;
    const time = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.1);

    /* 1 ── puff spring & release ── */
    if (isHolding.current || isPuffActive.current) {
      puffProgress.current = THREE.MathUtils.lerp(puffProgress.current, 1.0, 14 * dt);
      if (!isHolding.current && puffProgress.current > 0.9) {
        isPuffActive.current = false;
      }
    } else {
      if (puffReleasePending.current && puffProgress.current > 0.5) {
        puffReleasePending.current = false;
        triggerBubbles(0, -0.05, 0.5, 5, 0.35, 1.0);
      }
      puffProgress.current = THREE.MathUtils.lerp(puffProgress.current, 0.0, 6 * dt);
    }
    if (Math.abs(puffProgress.current - visualPuff) > 0.02) setVisualPuff(puffProgress.current);

    /* 2 ── dynamic scale: shrinks smoothly with spin when AI assistant box is open ── */
    const baseSize = animState.isSwimmingDown ? 1.15 : animState.isAssistantOpen ? 0.58 : 0.85;

    const hoverBonus =
      animState.isHovered && !animState.isMobile && !animState.isAssistantOpen ? 0.05 : 0;
    const targetScale = baseSize * (1 + puffProgress.current * 0.2 + hoverBonus);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 8 * dt);
    rootGroupRef.current.scale.setScalar(currentScale.current);

    /* 3 ── smooth spin interpolation ── */
    spinAngle.current = THREE.MathUtils.lerp(spinAngle.current, targetSpinAngle.current, 6 * dt);
    const spinTilt = Math.sin((targetSpinAngle.current - spinAngle.current) * 0.5) * 0.25;

    /* 4 ── loading state in center: (+0.78 rad) */
    if (animState.isSwimmingDown) {
      const bobY = Math.sin(time * 2.2) * 0.05;
      currentY.current = THREE.MathUtils.lerp(currentY.current, bobY, 8 * dt);
      currentX.current = THREE.MathUtils.lerp(currentX.current, 0, 8 * dt);

      currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, 0.78, 8 * dt);
      currentRotX.current = THREE.MathUtils.lerp(
        currentRotX.current,
        Math.sin(time * 1.5) * 0.04,
        8 * dt,
      );
      currentRotZ.current = THREE.MathUtils.lerp(
        currentRotZ.current,
        Math.cos(time * 1.2) * 0.03,
        8 * dt,
      );
    } else if (animState.isTransitioningToCorner) {
      /* 5 ── ACTIVE SWIMMING TO CORNER: dynamic dive angle */
      swimBubbleTimer.current += dt;
      if (swimBubbleTimer.current > 0.2) {
        swimBubbleTimer.current = 0;
        triggerBubbles(0.35, -0.1, -0.4, 1, 0.15, 0.8);
      }

      const swimBob = Math.sin(time * 8.0) * 0.04;
      currentY.current = THREE.MathUtils.lerp(currentY.current, swimBob, 10 * dt);
      currentX.current = THREE.MathUtils.lerp(
        currentX.current,
        Math.cos(time * 8.0) * 0.03,
        10 * dt,
      );

      currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, 0.98, 8 * dt);
      currentRotX.current = THREE.MathUtils.lerp(currentRotX.current, 0.16, 8 * dt);
      currentRotZ.current = THREE.MathUtils.lerp(currentRotZ.current, 0.24, 8 * dt);
    } else {
      /* 6 ── reached corner: resting rotation (-0.78 rad) */
      const bobAmp = animState.reducedMotion ? 0.01 : animState.isAssistantOpen ? 0.025 : 0.06;
      const bobY = Math.sin(time * 2.0) * bobAmp;
      currentY.current = THREE.MathUtils.lerp(currentY.current, bobY, 8 * dt);
      currentX.current = THREE.MathUtils.lerp(currentX.current, 0, 8 * dt);

      /* 7 ── resting rotation in corner + spin offset */
      const baseY = -0.78;
      if (!animState.reducedMotion && !animState.isMobile) {
        const lookX = THREE.MathUtils.clamp(pointer.x * 0.25, -0.25, 0.25);
        const lookY = THREE.MathUtils.clamp(-pointer.y * 0.18, -0.18, 0.18);
        const swayY = Math.sin(time * 1.1) * 0.03;
        const swayX = Math.cos(time * 1.6) * 0.018;

        currentRotY.current = THREE.MathUtils.lerp(
          currentRotY.current,
          baseY + lookX + swayY + spinAngle.current,
          5 * dt,
        );
        currentRotX.current = THREE.MathUtils.lerp(
          currentRotX.current,
          lookY + swayX + spinTilt,
          5 * dt,
        );
        currentRotZ.current = THREE.MathUtils.lerp(
          currentRotZ.current,
          Math.sin(time * 1.4) * 0.028 + spinTilt * 0.5,
          6 * dt,
        );

        // Pupil tracking
        eyesRef.current?.setPupilOffset(
          THREE.MathUtils.clamp(pointer.x * 0.042, -0.05, 0.05),
          pointer.y * 0.038,
        );
      } else {
        currentRotY.current = THREE.MathUtils.lerp(
          currentRotY.current,
          baseY + spinAngle.current,
          5 * dt,
        );
        currentRotX.current = THREE.MathUtils.lerp(currentRotX.current, spinTilt, 5 * dt);
        currentRotZ.current = THREE.MathUtils.lerp(currentRotZ.current, 0, 5 * dt);
        eyesRef.current?.setPupilOffset(-0.015, 0);
      }
    }

    /* Apply transforms */
    rootGroupRef.current.position.set(currentX.current, currentY.current, 0);
    rootGroupRef.current.rotation.set(
      currentRotX.current,
      currentRotY.current,
      currentRotZ.current,
    );

    /* Fin speed */
    let spd = 1.0,
      amp = 1.0;
    if (animState.isTransitioningToCorner) {
      spd = 3.4;
      amp = 1.8;
    } else if (animState.isSwimmingDown) {
      spd = 1.6;
      amp = 1.2;
    } else if (animState.isHovered) {
      spd = 1.8;
      amp = 1.3;
    }
    if (animState.isAssistantOpen) {
      spd = 0.8;
      amp = 0.6;
    }
    if (animState.reducedMotion) {
      spd = 0.4;
      amp = 0.3;
    }
    finsRef.current?.animateFins(time, spd, amp);
  });

  return (
    <group
      ref={rootGroupRef}
      onPointerDown={(e) => {
        e.stopPropagation();
        handlePointerDown();
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        handlePointerUp();
      }}
      onPointerOut={handlePointerUp}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
    >
      <PufferBody puffProgress={visualPuff} />
      <PufferEyes ref={eyesRef} puffProgress={visualPuff} />
      <PufferFins ref={finsRef} />
      <PufferSpikes puffProgress={visualPuff} />
    </group>
  );
};

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../portfolio/ThemeContext";

// Bubble Pool for high performance (instanced / reused memory)
const MAX_BUBBLES = 30;

interface BubbleData {
  active: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  scale: number;
  baseScale: number;
  life: number;
  maxLife: number;
  wobbleSpeed: number;
  wobbleOffset: number;
}

// Bubble emitter context/event bridge
type BubbleTrigger = (x?: number, y?: number, z?: number, count?: number, spread?: number, speed?: number) => void;

interface FishAnimationState {
  puffScale: number;
  isHovered: boolean;
  isSwimmingDown: boolean;
  isTransitioningToCorner: boolean;
  targetLook: { x: number; y: number };
  reducedMotion: boolean;
  isMobile: boolean;
  entryProgress: number; // 0 to 1
}

/* =========================================================================
   1. BUBBLE SYSTEM (Three.js Instanced Mesh)
   ========================================================================= */
function BubbleSystem({ triggerRef }: { triggerRef: React.MutableRefObject<BubbleTrigger | null> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const bubbles = useRef<BubbleData[]>(
    Array.from({ length: MAX_BUBBLES }, () => ({
      active: false,
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      scale: 0,
      baseScale: 0.08,
      life: 0,
      maxLife: 1.5,
      wobbleSpeed: 3,
      wobbleOffset: 0,
    }))
  );

  // Trigger function to spawn bubbles from fish mouth or position
  const spawnBubbles: BubbleTrigger = useCallback(
    (x = 0, y = 0, z = 0.8, count = 1, spread = 0.2, speed = 1.0) => {
      let spawned = 0;
      for (let i = 0; i < MAX_BUBBLES && spawned < count; i++) {
        const b = bubbles.current[i];
        if (!b.active) {
          b.active = true;
          b.x = x + (Math.random() - 0.5) * spread;
          b.y = y + (Math.random() - 0.5) * spread;
          b.z = z + (Math.random() - 0.5) * (spread * 0.5);
          b.vx = (Math.random() - 0.5) * 0.3 * speed;
          b.vy = (0.8 + Math.random() * 0.8) * speed;
          b.vz = (Math.random() - 0.5) * 0.2 * speed;
          b.baseScale = 0.04 + Math.random() * 0.06;
          b.scale = b.baseScale * 0.5;
          b.life = 0;
          b.maxLife = 1.2 + Math.random() * 1.0;
          b.wobbleSpeed = 2 + Math.random() * 3;
          b.wobbleOffset = Math.random() * Math.PI * 2;
          spawned++;
        }
      }
    },
    []
  );

  useEffect(() => {
    triggerRef.current = spawnBubbles;
    return () => {
      triggerRef.current = null;
    };
  }, [spawnBubbles, triggerRef]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    let hasActive = false;

    for (let i = 0; i < MAX_BUBBLES; i++) {
      const b = bubbles.current[i];
      if (!b.active) {
        dummy.position.set(0, -999, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        continue;
      }

      hasActive = true;
      b.life += delta;

      if (b.life >= b.maxLife) {
        b.active = false;
        dummy.position.set(0, -999, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        continue;
      }

      const progress = b.life / b.maxLife;

      // Upward motion with gentle sinusoidal drift
      b.x += (b.vx + Math.sin(time * b.wobbleSpeed + b.wobbleOffset) * 0.15) * delta;
      b.y += b.vy * delta;
      b.z += b.vz * delta;

      // Scale grows slightly then shrinks as it pops
      const scaleMultiplier = Math.sin(progress * Math.PI);
      const currentScale = b.baseScale * (1 + progress * 0.4) * scaleMultiplier;

      dummy.position.set(b.x, b.y, b.z);
      dummy.scale.set(currentScale, currentScale, currentScale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    if (hasActive) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_BUBBLES]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color="#c5f0ff"
        roughness={0.1}
        metalness={0.1}
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

/* =========================================================================
   2. PUFFER FISH MODEL (PRESERVING EXACT GEOMETRY & MATERIALS)
   ========================================================================= */
interface PufferFishModelProps {
  animState: FishAnimationState;
  onFishClick: () => void;
  triggerBubbles: (x?: number, y?: number, z?: number, count?: number, spread?: number, speed?: number) => void;
}

const PufferFishModel: React.FC<PufferFishModelProps> = ({ animState, onFishClick, triggerBubbles }) => {
  const fishGroupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftFinRef = useRef<THREE.Mesh>(null);
  const rightFinRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const leftPupilRef = useRef<THREE.Mesh>(null);
  const rightPupilRef = useRef<THREE.Mesh>(null);
  const spikesGroupRef = useRef<THREE.Group>(null);

  // Internal smooth transforms
  const currentScale = useRef(1.0);
  const currentRotY = useRef(0);
  const currentRotX = useRef(0);
  const currentRotZ = useRef(0);
  const currentY = useRef(0);
  const idleBubbleTimer = useRef(0);
  const entryTimer = useRef(0);

  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!fishGroupRef.current) return;
    const time = state.clock.getElapsedTime();
    const clampedDelta = Math.min(delta, 0.1);

    // 1. Scale lerping for puff animation
    const targetScale = animState.puffScale;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 10 * clampedDelta);

    const baseSize = 0.95;
    fishGroupRef.current.scale.set(
      baseSize * currentScale.current,
      baseSize * currentScale.current,
      baseSize * currentScale.current
    );

    // Spikes extend slightly during puff
    if (spikesGroupRef.current) {
      const spikeScale = 1.0 + (currentScale.current - 1.0) * 1.6;
      spikesGroupRef.current.scale.set(spikeScale, spikeScale, spikeScale);
    }

    // 2. Loading entrance dive animation (y from +4.2 down to 0)
    if (animState.isSwimmingDown) {
      entryTimer.current += clampedDelta;
      const t = Math.min(entryTimer.current / 1.1, 1.0);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - t, 3);
      currentY.current = (1 - ease) * 4.2;

      // Pitch down while diving
      const divePitch = (1 - ease) * -0.35;
      currentRotX.current = divePitch;

      // Continuous bubbles while swimming down
      if (Math.random() < 0.15) {
        triggerBubbles(0, currentY.current + 0.1, 0.5, 1, 0.15, 0.8);
      }
    } else {
      // Idle bobbing
      const bobAmp = animState.reducedMotion ? 0.02 : 0.07;
      const bobY = Math.sin(time * 2.2) * bobAmp;
      currentY.current = THREE.MathUtils.lerp(currentY.current, bobY, 8 * clampedDelta);

      // Occasional tiny idle bubble (every ~10-14s)
      idleBubbleTimer.current += clampedDelta;
      if (idleBubbleTimer.current > 12) {
        if (!animState.reducedMotion && Math.random() < 0.3) {
          triggerBubbles(0, currentY.current + 0.1, 0.8, 1, 0.05, 0.6);
        }
        idleBubbleTimer.current = 0;
      }
    }

    // 3. Loading complete transition tilt
    if (animState.isTransitioningToCorner) {
      // Tilts towards bottom-right direction
      currentRotZ.current = THREE.MathUtils.lerp(currentRotZ.current, -0.35, 6 * clampedDelta);
      currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, 0.45, 6 * clampedDelta);
    } else {
      currentRotZ.current = THREE.MathUtils.lerp(
        currentRotZ.current,
        animState.reducedMotion ? 0 : Math.sin(time * 1.5) * 0.04,
        6 * clampedDelta
      );
    }

    // 4. Cursor awareness & orientation (Subtle, non-aggressive damping)
    if (!animState.reducedMotion && !animState.isMobile && !animState.isTransitioningToCorner) {
      // Normalized pointer target
      const targetLookX = THREE.MathUtils.clamp(pointer.x * 0.35, -0.35, 0.35);
      const targetLookY = THREE.MathUtils.clamp(-pointer.y * 0.25, -0.25, 0.25);

      // Sway offset
      const swayRotY = Math.sin(time * 1.2) * 0.04;
      const swayRotX = Math.cos(time * 1.8) * 0.02;

      currentRotY.current = THREE.MathUtils.lerp(
        currentRotY.current,
        targetLookX + swayRotY,
        4 * clampedDelta
      );
      currentRotX.current = THREE.MathUtils.lerp(
        currentRotX.current,
        targetLookY + swayRotX,
        4 * clampedDelta
      );

      // Eye pupils subtly orienting towards cursor
      const pupilShiftX = THREE.MathUtils.clamp(pointer.x * 0.04, -0.03, 0.03);
      const pupilShiftY = THREE.MathUtils.clamp(pointer.y * 0.03, -0.02, 0.02);

      if (leftPupilRef.current) {
        leftPupilRef.current.position.x = 0.05 + pupilShiftX;
        leftPupilRef.current.position.y = pupilShiftY;
      }
      if (rightPupilRef.current) {
        rightPupilRef.current.position.x = -0.05 + pupilShiftX;
        rightPupilRef.current.position.y = pupilShiftY;
      }
    }

    // Apply main group transforms
    fishGroupRef.current.position.y = currentY.current;
    fishGroupRef.current.rotation.x = currentRotX.current;
    fishGroupRef.current.rotation.y = currentRotY.current;
    fishGroupRef.current.rotation.z = currentRotZ.current;

    // 5. Fin & Tail Flapping Physics
    let finSpeed = 4.2;
    let finAmp = 0.22;
    let tailAmp = 0.25;

    if (animState.isHovered) {
      finSpeed = 7.5;
      finAmp = 0.35;
      tailAmp = 0.35;
    } else if (animState.isSwimmingDown || animState.isTransitioningToCorner) {
      finSpeed = 8.5;
      finAmp = 0.38;
      tailAmp = 0.42;
    }

    if (animState.reducedMotion) {
      finSpeed = 1.8;
      finAmp = 0.08;
      tailAmp = 0.08;
    }

    const finPhase = Math.sin(time * finSpeed);
    const finRoll = Math.cos(time * finSpeed) * 0.15;

    if (leftFinRef.current) {
      leftFinRef.current.rotation.z = Math.PI / 6 + finPhase * finAmp;
      leftFinRef.current.rotation.y = finRoll;
    }
    if (rightFinRef.current) {
      rightFinRef.current.rotation.z = -Math.PI / 6 - finPhase * finAmp;
      rightFinRef.current.rotation.y = -finRoll;
    }
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(time * (finSpeed * 0.9)) * tailAmp;
      tailRef.current.rotation.z = Math.cos(time * (finSpeed * 0.9)) * 0.08;
    }
  });

  return (
    <group
      ref={fishGroupRef}
      onClick={(e) => {
        e.stopPropagation();
        onFishClick();
      }}
    >
      {/* Group wrapper for body */}
      <group ref={bodyRef}>
        {/* Main Body - Orange Top */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#f39c12" roughness={0.4} />
        </mesh>

        {/* Belly - White/Cream */}
        <mesh position={[0, -0.2, 0]} scale={[0.95, 0.7, 0.95]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#fdf5e6" roughness={0.6} />
        </mesh>
      </group>

      {/* Left Eye */}
      <group position={[-0.4, 0.4, 0.8]}>
        <mesh>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#f1c40f" /> {/* Yellow Outer */}
        </mesh>
        <mesh ref={leftPupilRef} position={[0.05, 0, 0.2]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#000000" /> {/* Black Pupil */}
        </mesh>
      </group>

      {/* Right Eye */}
      <group position={[0.4, 0.4, 0.8]}>
        <mesh>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#f1c40f" />
        </mesh>
        <mesh ref={rightPupilRef} position={[-0.05, 0, 0.2]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* Left Fin */}
      <mesh ref={leftFinRef} position={[-1.1, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#d35400" />
      </mesh>

      {/* Right Fin */}
      <mesh ref={rightFinRef} position={[1.1, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#d35400" />
      </mesh>

      {/* Tail */}
      <mesh ref={tailRef} position={[0, 0, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.4, 0.6, 4]} />
        <meshStandardMaterial color="#d35400" />
      </mesh>

      {/* Decorative Spikes */}
      <group ref={spikesGroupRef}>
        {[
          [0, 1.1, 0],
          [0.7, 0.8, 0],
          [-0.7, 0.8, 0],
          [0, 0.8, 0.7],
          [0, 0.8, -0.7],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <coneGeometry args={[0.08, 0.2, 8]} />
            <meshStandardMaterial color="#e67e22" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/* =========================================================================
   3. SPEECH BUBBLE COMPONENT (Theme Loyalist Personality)
   ========================================================================= */
function SpeechBubble({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3800);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      onClick={onDismiss}
      className="absolute -top-16 right-2 sm:right-6 z-50 cursor-pointer pointer-events-auto select-none"
    >
      <div className="relative rounded-2xl bg-foreground/90 px-3.5 py-2 text-xs font-medium text-background shadow-xl backdrop-blur-md border border-white/20 whitespace-nowrap">
        <span>{message}</span>
        {/* Speech Bubble Tail */}
        <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-foreground/90" />
      </div>
    </motion.div>
  );
}

/* =========================================================================
   4. PUFFER FISH COMPANION (MAIN INTEGRATION WRAPPER)
   ========================================================================= */
export interface PufferProps {
  loading?: boolean;
  onClick?: () => void;
  onAssistantOpen?: () => void;
}

export function PufferCompanion({ loading = false, onClick, onAssistantOpen }: PufferProps) {
  const { pufferEnabled, accent } = useTheme();
  const [speech, setSpeech] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPuffing, setIsPuffing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [settledInCorner, setSettledInCorner] = useState(!loading);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const bubbleTriggerRef = useRef<BubbleTrigger | null>(null);
  const prevAccent = useRef(accent);
  const isFirstMount = useRef(true);
  const puffTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check prefers-reduced-motion & mobile
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaMotion.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaMotion.addEventListener("change", handleMotionChange);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      mediaMotion.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Theme change personality reaction
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevAccent.current = accent;
      return;
    }

    if (prevAccent.current !== accent && pufferEnabled) {
      prevAccent.current = accent;
      // Show loyal speech bubble
      setSpeech("See? I don't change colors. I'm loyal.");
      // Trigger tiny happy bubble burst
      bubbleTriggerRef.current?.(0, 0, 0.8, 4, 0.2, 0.9);
    }
  }, [accent, pufferEnabled]);

  // Loading sequence orchestration
  useEffect(() => {
    if (!loading && !settledInCorner) {
      // Loading just finished -> Start swim-to-corner transition
      setIsTransitioning(true);
      // Small bubble burst on departure
      bubbleTriggerRef.current?.(0, 0, 0.8, 8, 0.3, 1.2);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setSettledInCorner(true);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [loading, settledInCorner]);

  // Trigger puff animation on click/tap
  const handlePuff = useCallback(() => {
    if (isPuffing) return; // Prevent click spam
    setIsPuffing(true);

    // Bubble burst during puff
    bubbleTriggerRef.current?.(0, 0, 0.8, 10, 0.4, 1.4);

    // Call external callbacks (for future AI assistant)
    onClick?.();
    onAssistantOpen?.();

    if (puffTimeoutRef.current) clearTimeout(puffTimeoutRef.current);
    puffTimeoutRef.current = setTimeout(() => {
      setIsPuffing(false);
    }, 600);
  }, [isPuffing, onClick, onAssistantOpen]);

  // Don't render or run 3D loops if disabled in settings
  if (!pufferEnabled) {
    return null;
  }

  // Animation state passed to 3D loop
  const animState: FishAnimationState = {
    puffScale: isPuffing ? 1.22 : isHovered ? 1.06 : 1.0,
    isHovered,
    isSwimmingDown: loading,
    isTransitioningToCorner: isTransitioning,
    targetLook: { x: 0, y: 0 },
    reducedMotion,
    isMobile,
    entryProgress: 1,
  };

  // Positions: Centered during initial loading, fixed bottom-right when settled
  const isCentered = loading;

  return (
    <div
      aria-label="Puffer fish mascot companion"
      role="region"
      className="pointer-events-none select-none"
    >
      <motion.div
        layout
        initial={
          isCentered
            ? {
                top: "32%",
                left: "50%",
                x: "-50%",
                y: "-50%",
                bottom: "auto",
                right: "auto",
                width: isMobile ? 180 : 220,
                height: isMobile ? 180 : 220,
                zIndex: 102,
              }
            : false
        }
        animate={
          isCentered
            ? {
                top: "32%",
                left: "50%",
                x: "-50%",
                y: "-50%",
                bottom: "auto",
                right: "auto",
                width: isMobile ? 180 : 220,
                height: isMobile ? 180 : 220,
                zIndex: 102,
              }
            : {
                top: "auto",
                left: "auto",
                x: "0%",
                y: "0%",
                bottom: isMobile ? 16 : 24,
                right: isMobile ? 16 : 24,
                width: isMobile ? 120 : 150,
                height: isMobile ? 120 : 150,
                zIndex: 40,
              }
        }
        transition={{
          type: "spring",
          stiffness: 75,
          damping: 16,
          mass: 0.9,
        }}
        className="fixed pointer-events-none"
      >
        {/* Personality Speech Bubble */}
        <AnimatePresence>
          {speech && (
            <SpeechBubble message={speech} onDismiss={() => setSpeech(null)} />
          )}
        </AnimatePresence>

        {/* 3D Canvas Scene */}
        <div
          onPointerEnter={() => {
            if (!isMobile) {
              setIsHovered(true);
              bubbleTriggerRef.current?.(0, 0, 0.8, 2, 0.15, 0.7);
            }
          }}
          onPointerLeave={() => {
            if (!isMobile) setIsHovered(false);
          }}
          onClick={handlePuff}
          className="relative h-full w-full pointer-events-auto cursor-pointer"
          title="Click the puffer fish!"
        >
          <Canvas
            camera={{ position: [0, 0, 3.8], fov: 48 }}
            dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          >
            {/* Lighting for 3D depth */}
            <ambientLight intensity={0.7} />
            <directionalLight position={[8, 8, 6]} intensity={1.4} />
            <directionalLight position={[-8, -8, -4]} intensity={0.4} />

            {/* Bubble particle system */}
            <BubbleSystem triggerRef={bubbleTriggerRef} />

            {/* Puffer Fish Mascot Model */}
            <PufferFishModel
              animState={animState}
              onFishClick={handlePuff}
              triggerBubbles={(x, y, z, count, spread, speed) =>
                bubbleTriggerRef.current?.(x, y, z, count, spread, speed)
              }
            />
          </Canvas>
        </div>
      </motion.div>
    </div>
  );
}

export { PufferCompanion as PufferFish, PufferCompanion as PufferFishScene, PufferFishModel };
export default PufferCompanion;
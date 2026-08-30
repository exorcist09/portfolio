import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAX_BUBBLES = 48;

export interface BubbleData {
  active: boolean;
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  scale: number; baseScale: number;
  life: number; maxLife: number;
  wobbleSpeed: number; wobbleOffset: number;
}

export type BubbleTrigger = (
  x?: number, y?: number, z?: number,
  count?: number, spread?: number, speed?: number
) => void;

interface PufferBubblesProps {
  triggerRef: React.MutableRefObject<BubbleTrigger | null>;
}

export const PufferBubbles: React.FC<PufferBubblesProps> = ({ triggerRef }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const bubbles = useRef<BubbleData[]>(
    Array.from({ length: MAX_BUBBLES }, () => ({
      active: false,
      x: 0, y: 0, z: 0,
      vx: 0, vy: 0, vz: 0,
      scale: 0, baseScale: 0.1,
      life: 0, maxLife: 1.5,
      wobbleSpeed: 3, wobbleOffset: 0,
    }))
  );

  const spawnBubbles: BubbleTrigger = useCallback(
    (x = 0, y = 0, z = 0.8, count = 1, spread = 0.35, speed = 1.0) => {
      let spawned = 0;
      for (let i = 0; i < MAX_BUBBLES && spawned < count; i++) {
        const b = bubbles.current[i];
        if (!b.active) {
          b.active = true;
          // Spawn scattered around the fish center
          b.x = x + (Math.random() - 0.5) * spread * 2;
          b.y = y + (Math.random() - 0.5) * spread;
          b.z = z + (Math.random() - 0.5) * spread;
          // Rise up, slight random horizontal drift
          b.vx = (Math.random() - 0.5) * 0.3 * speed;
          b.vy = (0.6 + Math.random() * 0.8) * speed;
          b.vz = (Math.random() - 0.5) * 0.25 * speed;
          // Bubbles are clearly visible — min size 0.08
          b.baseScale = 0.08 + Math.random() * 0.1;
          b.scale = b.baseScale * 0.4;
          b.life = 0;
          b.maxLife = 1.0 + Math.random() * 0.8;
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
    return () => { triggerRef.current = null; };
  }, [spawnBubbles, triggerRef]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.1);

    for (let i = 0; i < MAX_BUBBLES; i++) {
      const b = bubbles.current[i];
      if (!b.active) {
        dummy.position.set(0, -999, 0);
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        continue;
      }

      b.life += dt;

      if (b.life >= b.maxLife) {
        b.active = false;
        dummy.position.set(0, -999, 0);
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        continue;
      }

      const t = b.life / b.maxLife;

      // Drift upward + sinusoidal wobble
      b.x += (b.vx + Math.sin(time * b.wobbleSpeed + b.wobbleOffset) * 0.12) * dt;
      b.y += b.vy * dt;
      b.z += b.vz * dt;

      // Grow in, then pop at the end
      const sc = b.baseScale * Math.sin(t * Math.PI) * (1 + t * 0.3);

      dummy.position.set(b.x, b.y, b.z);
      dummy.scale.setScalar(Math.max(sc, 0));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_BUBBLES]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshStandardMaterial
        color="#d8f4ff"
        roughness={0.05}
        metalness={0.15}
        transparent
        opacity={0.82}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

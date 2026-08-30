import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAX_BUBBLES = 24;

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
      scale: 0, baseScale: 0.12,
      life: 0, maxLife: 1.4,
      wobbleSpeed: 3, wobbleOffset: 0,
    }))
  );

  const spawnBubbles: BubbleTrigger = useCallback(
    (x = 0, y = 0, z = 0.8, count = 2, spread = 0.35, speed = 1.0) => {
      let spawned = 0;
      for (let i = 0; i < MAX_BUBBLES && spawned < count; i++) {
        const b = bubbles.current[i];
        if (!b.active) {
          b.active = true;
          // Spawn position around fish
          b.x = x + (Math.random() - 0.5) * spread * 2;
          b.y = y + (Math.random() - 0.5) * spread;
          b.z = z + (Math.random() - 0.5) * spread;
          // Buoyant upward motion with gentle drift
          b.vx = (Math.random() - 0.5) * 0.35 * speed;
          b.vy = (0.7 + Math.random() * 0.7) * speed;
          b.vz = (Math.random() - 0.5) * 0.25 * speed;
          // Subtle size
          b.baseScale = 0.09 + Math.random() * 0.08;
          b.scale = 0;
          b.life = 0;
          b.maxLife = 1.0 + Math.random() * 0.6;
          b.wobbleSpeed = 2.5 + Math.random() * 2.5;
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
        dummy.position.set(0, 0, -100);
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        continue;
      }

      b.life += dt;

      if (b.life >= b.maxLife) {
        b.active = false;
        dummy.position.set(0, 0, -100);
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        continue;
      }

      const t = b.life / b.maxLife;

      // Buoyancy drift upward + organic wobble
      b.x += (b.vx + Math.sin(time * b.wobbleSpeed + b.wobbleOffset) * 0.12) * dt;
      b.y += b.vy * dt;
      b.z += b.vz * dt;

      // Pop in & out curve
      const sc = b.baseScale * Math.sin(t * Math.PI) * (1 + t * 0.3);

      dummy.position.set(b.x, b.y, b.z);
      dummy.scale.setScalar(Math.max(sc, 0.001));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, MAX_BUBBLES]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color="#0284c7"
        emissive="#0284c7"
        emissiveIntensity={0.65}
        roughness={0.1}
        metalness={0.15}
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

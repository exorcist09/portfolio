import React, { useMemo } from "react";
import * as THREE from "three";

// Exactly 8 pointed spikes: 4 top and 4 bottom
const RAW_SPIKE_POSITIONS: [number, number, number][] = [
  // ── 4 Top Spikes ──
  [0, 1.02, 0.25],       // Top Front Crown
  [0, 0.98, -0.42],      // Top Back Spine
  [-0.58, 0.88, -0.05],  // Top Left
  [0.58, 0.88, -0.05],   // Top Right

  // ── 4 Bottom Spikes ──
  [0, -1.0, 0.25],       // Bottom Front
  [0, -0.95, -0.42],     // Bottom Back
  [-0.58, -0.88, -0.05], // Bottom Left
  [0.58, -0.88, -0.05],  // Bottom Right
];

interface PufferSpikesProps {
  puffProgress: number;
}

export const PufferSpikes: React.FC<PufferSpikesProps> = ({ puffProgress }) => {
  const spikes = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    return RAW_SPIKE_POSITIONS.map((pos) => {
      const dir = new THREE.Vector3(...pos).normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(up, dir);
      const euler = new THREE.Euler().setFromQuaternion(q);
      return { pos, euler };
    });
  }, []);

  const ext = 1.0 + puffProgress * 0.14;
  const sc  = 0.85 + puffProgress * 0.55;

  return (
    <group>
      {spikes.map(({ pos, euler }, i) => (
        <mesh
          key={`spike-${i}`}
          position={[pos[0] * ext, pos[1] * ext, pos[2] * ext]}
          rotation={euler}
          scale={sc}
        >
          {/* Classic pointed cone spike */}
          <coneGeometry args={[0.075, 0.22, 16]} />
          <meshStandardMaterial color="#d84315" roughness={0.35} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
};

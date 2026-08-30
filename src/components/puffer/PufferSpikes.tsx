import React, { useMemo } from "react";
import * as THREE from "three";

// Exactly 8 pointed spikes adjusted for broader body profile
const RAW_SPIKE_POSITIONS: [number, number, number][] = [
  // ── 4 Top Spikes ──
  [0, 1.06, 0.28],       // Top Front Crown
  [0, 1.02, -0.46],      // Top Back Spine
  [-0.68, 0.92, -0.05],  // Top Left Flank
  [0.68, 0.92, -0.05],   // Top Right Flank

  // ── 4 Bottom Spikes ──
  [0, -1.04, 0.28],      // Bottom Front
  [0, -0.98, -0.46],     // Bottom Back
  [-0.68, -0.92, -0.05], // Bottom Left Flank
  [0.68, -0.92, -0.05],  // Bottom Right Flank
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
  const sc  = 0.88 + puffProgress * 0.55;

  return (
    <group>
      {spikes.map(({ pos, euler }, i) => (
        <mesh
          key={`spike-${i}`}
          position={[pos[0] * ext, pos[1] * ext, pos[2] * ext]}
          rotation={euler}
          scale={sc}
        >
          {/* Pointed cone spike */}
          <coneGeometry args={[0.08, 0.24, 16]} />
          <meshStandardMaterial color="#d84315" roughness={0.35} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
};

import React, { useMemo } from "react";
import * as THREE from "three";

interface SpikeDef {
  pos: [number, number, number];
  color?: string;
}

// 8 spikes defining the pufferfish crown, flanks, and belly
const RAW_SPIKES: SpikeDef[] = [
  // ── Top Spikes ──
  { pos: [0, 1.06, 0.28] },       // Top Front Crown
  { pos: [0, 0.98, -0.38] },      // Top Mid Spine
  { pos: [-0.68, 0.92, -0.02] },  // Top Left Flank
  { pos: [0.68, 0.92, -0.02] },   // Top Right Flank

  // ── Bottom Spikes ──
  { pos: [0, -1.05, 0.38], color: "#fff0ba" }, // Front Belly Spike (Matching yellowish-crème belly!)
  { pos: [0, -0.92, -0.38] },                  // Bottom Mid Spine
  { pos: [-0.68, -0.92, -0.02] },              // Bottom Left Flank
  { pos: [0.68, -0.92, -0.02] },               // Bottom Right Flank
];

interface SpikeData {
  pos: [number, number, number];
  euler: THREE.Euler;
  color: string;
}

interface PufferSpikesProps {
  puffProgress: number;
}

export const PufferSpikes: React.FC<PufferSpikesProps> = ({ puffProgress }) => {
  const spikes = useMemo<SpikeData[]>(() => {
    const up = new THREE.Vector3(0, 1, 0);
    return RAW_SPIKES.map(({ pos, color }) => {
      const dir = new THREE.Vector3(...pos).normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(up, dir);
      const euler = new THREE.Euler().setFromQuaternion(q);
      return {
        pos,
        euler,
        color: color || "#d84315",
      };
    });
  }, []);

  const ext = 1.0 + puffProgress * 0.14;
  const sc  = 0.88 + puffProgress * 0.55;

  return (
    <group>
      {spikes.map(({ pos, euler, color }, i) => (
        <mesh
          key={`spike-${i}`}
          position={[pos[0] * ext, pos[1] * ext, pos[2] * ext]}
          rotation={euler}
          scale={sc}
        >
          {/* Pointed cone spike with belly-matching color for front belly spike */}
          <coneGeometry args={[0.08, 0.24, 16]} />
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
};

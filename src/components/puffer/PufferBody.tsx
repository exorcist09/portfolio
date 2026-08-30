import React, { forwardRef, useMemo } from "react";
import * as THREE from "three";

interface PufferBodyProps {
  puffProgress: number;
}

// 3D sphere freckles on forehead
const FRECKLE_POSITIONS: [number, number, number][] = [
  [-0.1, 0.6, 0.78], [0.1, 0.6, 0.78], [0, 0.65, 0.74],
  [-0.15, 0.5, 0.85], [0.15, 0.5, 0.85], [0, 0.52, 0.88],
  [-0.05, 0.43, 0.91], [0.05, 0.43, 0.91],
];

export const PufferBody = forwardRef<THREE.Group, PufferBodyProps>(({ puffProgress }, ref) => {
  // Procedural texture: deep orange body with front white belly shifted slightly lower
  const bodyTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // 1. Solid deep orange base
    ctx.fillStyle = "#e64a19";
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. Front-bottom white belly shifted slightly lower to y = 805
    const bellyFront = ctx.createRadialGradient(256, 805, 0, 256, 805, 275);
    bellyFront.addColorStop(0.0, "#ffffff");
    bellyFront.addColorStop(0.50, "#ffffff");
    bellyFront.addColorStop(0.76, "#ffccbc");
    bellyFront.addColorStop(1.0, "#e64a19");
    ctx.fillStyle = bellyFront;
    ctx.beginPath();
    ctx.arc(256, 805, 275, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Plump smooth curved candy-pink smile tube
  const lipTubeGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.12, 0.015, -0.015),
      new THREE.Vector3(-0.06, 0.028, 0.01),
      new THREE.Vector3(0, 0.008, 0.02),
      new THREE.Vector3(0.06, 0.028, 0.01),
      new THREE.Vector3(0.12, 0.015, -0.015),
    ]);
    return new THREE.TubeGeometry(curve, 48, 0.062, 24, false);
  }, []);

  const bodyScale = 1.0 + puffProgress * 0.18;

  return (
    <group ref={ref}>
      {/* ── Main Body with Front-Lower White Belly ── */}
      <mesh position={[0, 0, 0]} scale={bodyScale}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={bodyTexture ?? undefined}
          color="#ffffff"
          roughness={0.34}
          metalness={0.02}
        />
      </mesh>

      {/* ── 3D Sphere Freckle Dots on Forehead ── */}
      {FRECKLE_POSITIONS.map((pos, i) => (
        <mesh key={`freckle-${i}`} position={pos}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshStandardMaterial color="#8c2205" roughness={0.4} />
        </mesh>
      ))}

      {/* ── Thick, Plump Seamless Candy-Pink Smiling Lips ── */}
      <group
        position={[0, 0.16, 0.95]}
        rotation={[0.08, 0, 0]}
        scale={1.0 + puffProgress * 0.1}
      >
        {/* Thick Seamless Curved Smile Tube */}
        <mesh geometry={lipTubeGeometry}>
          <meshStandardMaterial color="#ff88a3" roughness={0.26} metalness={0.02} />
        </mesh>

        {/* Left Rounded End Cap */}
        <mesh position={[-0.12, 0.015, -0.015]}>
          <sphereGeometry args={[0.062, 20, 20]} />
          <meshStandardMaterial color="#ff88a3" roughness={0.26} metalness={0.02} />
        </mesh>

        {/* Right Rounded End Cap */}
        <mesh position={[0.12, 0.015, -0.015]}>
          <sphereGeometry args={[0.062, 20, 20]} />
          <meshStandardMaterial color="#ff88a3" roughness={0.26} metalness={0.02} />
        </mesh>

        {/* Plump Lower Lip Pillow Cushion */}
        <mesh position={[0, -0.026, 0.015]} scale={[0.16, 0.075, 0.055]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color="#ff7e9a" roughness={0.26} metalness={0.02} />
        </mesh>

        {/* Subtle Smile Crease Depth */}
        <mesh position={[0, 0.003, 0.012]} scale={[0.11, 0.015, 0.025]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#7a1422" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
});

PufferBody.displayName = "PufferBody";

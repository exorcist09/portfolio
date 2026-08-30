import React, { forwardRef, useMemo } from "react";
import * as THREE from "three";

interface PufferBodyProps {
  puffProgress: number;
}

// 40+ 3D sphere freckle positions: Forehead, Temples, and large clusters above/around Fins
const FRECKLE_POSITIONS: [number, number, number][] = [
  // ── Forehead & Brow Center ──
  [-0.08, 0.65, 0.76], [0.08, 0.65, 0.76], [0, 0.72, 0.70],
  [-0.14, 0.54, 0.84], [0.14, 0.54, 0.84], [0, 0.58, 0.86],
  [-0.06, 0.46, 0.90], [0.06, 0.46, 0.90], [0, 0.48, 0.91],
  [-0.20, 0.62, 0.74], [0.20, 0.62, 0.74],
  [-0.12, 0.72, 0.66], [0.12, 0.72, 0.66],

  // ── Left Temple & Upper Flank ──
  [-0.45, 0.60, 0.64],
  [-0.55, 0.52, 0.60],
  [-0.38, 0.68, 0.58],

  // ── Right Temple & Upper Flank ──
  [0.45, 0.60, 0.64],
  [0.55, 0.52, 0.60],
  [0.38, 0.68, 0.58],

  // ── Heavy Cluster Above & Around Left Fin ──
  [-0.82, 0.45, 0.36],
  [-0.75, 0.55, 0.42],
  [-0.88, 0.36, 0.24],
  [-0.72, 0.40, 0.56],
  [-0.80, 0.52, 0.22],
  [-0.68, 0.60, 0.35],
  [-0.90, 0.30, 0.38],
  [-0.78, 0.35, 0.48],
  [-0.85, 0.48, 0.12],
  [-0.70, 0.45, 0.45],
  [-0.92, 0.22, 0.28],

  // ── Heavy Cluster Above & Around Right Fin ──
  [0.82, 0.45, 0.36],
  [0.75, 0.55, 0.42],
  [0.88, 0.36, 0.24],
  [0.72, 0.40, 0.56],
  [0.80, 0.52, 0.22],
  [0.70, 0.60, 0.35],
  [0.90, 0.30, 0.38],
  [0.78, 0.35, 0.48],
  [0.85, 0.48, 0.12],
  [0.70, 0.45, 0.45],
  [0.92, 0.22, 0.28],
];

export const PufferBody = forwardRef<THREE.Group, PufferBodyProps>(({ puffProgress }, ref) => {
  // Procedural texture: deep orange body with soft subtle freckles + yellowish-crème belly
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

    // 2. Soft, subtle baked freckle clusters on canvas texture
    ctx.fillStyle = "rgba(195, 75, 30, 0.45)";
    const canvasDots = [
      // Forehead cluster (x around 256, y 380..520)
      { x: 256, y: 440, r: 7 }, { x: 236, y: 420, r: 5.5 }, { x: 278, y: 425, r: 6 },
      { x: 254, y: 395, r: 5 }, { x: 220, y: 460, r: 4.5 }, { x: 295, y: 455, r: 5 },
      { x: 248, y: 480, r: 6 }, { x: 268, y: 475, r: 5.5 }, { x: 210, y: 485, r: 4 },
      { x: 304, y: 482, r: 4.5 }, { x: 256, y: 370, r: 4 }, { x: 232, y: 380, r: 3.5 },
      { x: 282, y: 378, r: 3.5 },
      // Left fin flank (x around 120..180)
      { x: 140, y: 520, r: 6 }, { x: 160, y: 500, r: 5 }, { x: 130, y: 550, r: 7 },
      { x: 155, y: 540, r: 5.5 }, { x: 175, y: 515, r: 4.5 }, { x: 125, y: 510, r: 5 },
      { x: 148, y: 565, r: 4.5 }, { x: 170, y: 555, r: 5 }, { x: 135, y: 580, r: 5.5 },
      // Right fin flank (x around 330..390)
      { x: 370, y: 520, r: 6 }, { x: 350, y: 500, r: 5 }, { x: 380, y: 550, r: 7 },
      { x: 355, y: 540, r: 5.5 }, { x: 335, y: 515, r: 4.5 }, { x: 385, y: 510, r: 5 },
      { x: 362, y: 565, r: 4.5 }, { x: 340, y: 555, r: 5.5 }, { x: 375, y: 580, r: 5.5 },
    ];
    canvasDots.forEach(({ x, y, r }) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Soft pastel yellowish-crème belly patch
    const bellyFront = ctx.createRadialGradient(256, 855, 0, 256, 855, 270);
    bellyFront.addColorStop(0.0, "#fff0ba");
    bellyFront.addColorStop(0.50, "#fff0ba");
    bellyFront.addColorStop(0.78, "#ffd296");
    bellyFront.addColorStop(1.0, "#e64a19");
    ctx.fillStyle = bellyFront;
    ctx.beginPath();
    ctx.arc(256, 855, 270, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Broader, clean smooth cartoon smile curve
  const smileGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.135, 0.02, -0.012),
      new THREE.Vector3(-0.068, -0.006, 0.008),
      new THREE.Vector3(0, -0.018, 0.014),
      new THREE.Vector3(0.068, -0.006, 0.008),
      new THREE.Vector3(0.135, 0.02, -0.012),
    ]);
    return new THREE.TubeGeometry(curve, 44, 0.048, 18, false);
  }, []);

  const bodyScale = 1.0 + puffProgress * 0.18;

  return (
    <group ref={ref}>
      {/* ── Main Body ── */}
      <mesh position={[0, 0, 0]} scale={bodyScale}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={bodyTexture ?? undefined}
          color="#ffffff"
          roughness={0.34}
          metalness={0.02}
        />
      </mesh>

      {/* ── 3D Sphere Freckle Dots (Softer, Subtle Warm Terracotta) ── */}
      {FRECKLE_POSITIONS.map((pos, i) => (
        <mesh key={`freckle-${i}`} position={pos}>
          <sphereGeometry args={[0.018, 10, 10]} />
          <meshStandardMaterial color="#c85628" roughness={0.5} transparent opacity={0.85} />
        </mesh>
      ))}

      {/* ── Broader, Cute Cartoon Pink Smile ── */}
      <group
        position={[0, 0.14, 0.96]}
        rotation={[0.06, 0, 0]}
        scale={1.0 + puffProgress * 0.1}
      >
        {/* Smooth Broad Smile Arc */}
        <mesh geometry={smileGeometry}>
          <meshStandardMaterial color="#ff7eb3" roughness={0.28} metalness={0.02} />
        </mesh>

        {/* Left Rounded Smile Tip */}
        <mesh position={[-0.135, 0.02, -0.012]}>
          <sphereGeometry args={[0.048, 16, 16]} />
          <meshStandardMaterial color="#ff7eb3" roughness={0.28} metalness={0.02} />
        </mesh>

        {/* Right Rounded Smile Tip */}
        <mesh position={[0.135, 0.02, -0.012]}>
          <sphereGeometry args={[0.048, 16, 16]} />
          <meshStandardMaterial color="#ff7eb3" roughness={0.28} metalness={0.02} />
        </mesh>
      </group>
    </group>
  );
});

PufferBody.displayName = "PufferBody";

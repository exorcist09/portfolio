import React, { forwardRef, useMemo } from "react";
import * as THREE from "three";

interface PufferBodyProps {
  puffProgress: number;
}

// 85+ Organic freckle positions across Forehead, Temples, Cheeks, and Flanks
const FRECKLE_POSITIONS: [number, number, number][] = [
  // ── Top Crown ──
  [0, 1.04, 0.20],
  [-0.14, 1.02, 0.22],
  [0.14, 1.02, 0.22],
  [-0.08, 1.05, 0.05],
  [0.08, 1.05, 0.05],
  [-0.22, 0.98, 0.15],
  [0.22, 0.98, 0.15],
  [0, 1.0, 0.38],
  [-0.15, 0.94, 0.35],
  [0.15, 0.94, 0.35],

  // ── High Forehead & Upper Brow ──
  [-0.12, 0.74, 0.72],
  [0.15, 0.72, 0.74],
  [0.02, 0.80, 0.66],
  [-0.05, 0.77, 0.68],
  [0.08, 0.78, 0.68],
  [-0.22, 0.66, 0.76],
  [0.20, 0.68, 0.74],
  [-0.16, 0.70, 0.72],
  [0.14, 0.71, 0.72],

  // ── Temples & Cheeks ──
  [-0.38, 0.68, 0.60],
  [0.36, 0.70, 0.58],
  [-0.52, 0.65, 0.55],
  [0.48, 0.68, 0.52],
  [-0.45, 0.58, 0.66],
  [0.44, 0.60, 0.64],
  [-0.68, 0.48, 0.52],
  [0.65, 0.52, 0.50],
  [-0.60, 0.42, 0.62],
  [0.58, 0.45, 0.60],
  [-0.72, 0.35, 0.58],
  [0.70, 0.38, 0.56],
  [-0.54, 0.32, 0.70],
  [0.52, 0.34, 0.68],
  [-0.35, 0.45, 0.78],
  [0.34, 0.46, 0.77],
  [-0.48, 0.38, 0.72],
  [0.46, 0.40, 0.71],

  // ── Left Flank & Above Fin ──
  [-0.92, 0.48, 0.32],
  [-0.85, 0.58, 0.22],
  [-1.02, 0.35, 0.18],
  [-0.88, 0.42, 0.45],
  [-0.78, 0.52, 0.12],
  [-0.96, 0.25, 0.32],
  [-0.82, 0.32, 0.52],
  [-0.98, 0.42, 0.22],
  [-0.76, 0.46, 0.38],
  [-0.90, 0.54, 0.30],
  [-1.04, 0.28, 0.25],
  [-0.84, 0.22, 0.48],
  [-0.75, 0.60, 0.28],
  [-0.88, 0.62, 0.18],
  [-0.80, 0.38, 0.42],
  [-0.94, 0.50, 0.16],
  [-1.00, 0.20, 0.35],
  [-0.72, 0.55, 0.36],

  // ── Right Flank & Above Fin ──
  [0.92, 0.48, 0.32],
  [0.85, 0.58, 0.22],
  [1.02, 0.35, 0.18],
  [0.88, 0.42, 0.45],
  [0.78, 0.52, 0.12],
  [0.96, 0.25, 0.32],
  [0.82, 0.32, 0.52],
  [0.98, 0.42, 0.22],
  [0.76, 0.46, 0.38],
  [0.90, 0.54, 0.30],
  [1.04, 0.28, 0.25],
  [0.84, 0.22, 0.48],
  [0.75, 0.60, 0.28],
  [0.88, 0.62, 0.18],
  [0.80, 0.38, 0.42],
  [0.94, 0.50, 0.16],
  [1.00, 0.20, 0.35],
  [0.72, 0.55, 0.36],

  // ── Rear Flanks ──
  [-0.55, 0.55, -0.52],
  [0.58, 0.52, -0.50],
  [-0.42, 0.64, -0.58],
  [0.40, 0.65, -0.56],
  [0.05, 0.68, -0.85],
  [-0.18, 0.55, -0.88],
  [0.16, 0.52, -0.88],
  [-0.32, 0.45, -0.82],
  [0.30, 0.46, -0.80],
  [-0.48, 0.48, -0.72],
  [0.46, 0.50, -0.70],
];

export const PufferBody = forwardRef<THREE.Group, PufferBodyProps>(({ puffProgress }, ref) => {
  // Procedural texture: deep orange body with freckles + yellowish-crème belly
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

    // 2. Rich darker baked freckles on canvas texture
    ctx.fillStyle = "rgba(155, 52, 16, 0.78)";
    const randomSeedDots = [
      { x: 256, y: 280, r: 6.5 }, { x: 220, y: 260, r: 5.5 }, { x: 290, y: 265, r: 6 },
      { x: 160, y: 400, r: 6 }, { x: 350, y: 395, r: 5.5 }, { x: 245, y: 410, r: 6.5 },
      { x: 275, y: 405, r: 6 }, { x: 210, y: 430, r: 5 }, { x: 300, y: 425, r: 5.5 },
      { x: 130, y: 480, r: 6.5 }, { x: 380, y: 475, r: 6.5 }, { x: 100, y: 530, r: 7 },
      { x: 410, y: 525, r: 7 }, { x: 145, y: 560, r: 5.5 }, { x: 365, y: 555, r: 5.5 },
      { x: 180, y: 450, r: 5.5 }, { x: 330, y: 450, r: 5.5 },
      { x: 115, y: 510, r: 6 }, { x: 395, y: 505, r: 6 },
      { x: 500, y: 420, r: 6.5 }, { x: 540, y: 460, r: 6 }, { x: 620, y: 440, r: 6.5 },
      { x: 720, y: 450, r: 5.5 }, { x: 800, y: 420, r: 6.5 }, { x: 850, y: 450, r: 6 },
      { x: 920, y: 430, r: 6.5 }, { x: 60, y: 440, r: 6 }, { x: 40, y: 500, r: 5.5 },
      { x: 480, y: 450, r: 6 }, { x: 580, y: 500, r: 5.5 }, { x: 670, y: 480, r: 6 },
    ];
    randomSeedDots.forEach(({ x, y, r }) => {
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

  // Anatomical Pufferfish body geometry: Chubby round front belly, tapered peduncle rear
  const bodyGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 64, 64);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Taper towards rear (z < 0): slender rear peduncle
      if (z < 0) {
        const t = -z; // 0 to 1
        const taper = 1.0 - t * 0.28;
        x *= taper;
        y *= (1.0 - t * 0.22);
      }

      // Chubby cheeks and saggy round belly in front-bottom
      if (z > 0 && y < 0.2) {
        y *= 1.08; // slightly deeper saggy cute belly
        x *= 1.05; // chubby cheeks
      }

      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Broader, clean smooth cartoon smile curve
  const smileGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.145, 0.02, -0.012),
      new THREE.Vector3(-0.072, -0.006, 0.008),
      new THREE.Vector3(0, -0.018, 0.014),
      new THREE.Vector3(0.072, -0.006, 0.008),
      new THREE.Vector3(0.145, 0.02, -0.012),
    ]);
    return new THREE.TubeGeometry(curve, 44, 0.055, 18, false);
  }, []);

  // Volumetric scale
  const scaleX = (1.18 + puffProgress * 0.18);
  const scaleY = (1.04 + puffProgress * 0.18);
  const scaleZ = (1.14 + puffProgress * 0.18);

  return (
    <group ref={ref}>
      {/* ── Main Sculpted Pufferfish Body (Chubby front belly, tapered tail transition) ── */}
      <mesh geometry={bodyGeometry} position={[0, 0, 0]} scale={[scaleX, scaleY, scaleZ]}>
        <meshStandardMaterial
          map={bodyTexture ?? undefined}
          color="#ffffff"
          roughness={0.34}
          metalness={0.02}
        />
      </mesh>

      {/* ── Cute Gill Arch Creases behind cheeks ── */}
      <mesh position={[-1.02, 0.18, 0.42]} rotation={[0, 0.35, 0.12]}>
        <torusGeometry args={[0.16, 0.022, 12, 24, Math.PI * 0.7]} />
        <meshStandardMaterial color="#b8340d" roughness={0.4} />
      </mesh>
      <mesh position={[1.02, 0.18, 0.42]} rotation={[0, -0.35, -0.12]}>
        <torusGeometry args={[0.16, 0.022, 12, 24, Math.PI * 0.7]} />
        <meshStandardMaterial color="#b8340d" roughness={0.4} />
      </mesh>

      {/* ── 3D Sphere Freckle Dots ── */}
      {FRECKLE_POSITIONS.map((pos, i) => (
        <mesh key={`freckle-${i}`} position={pos}>
          <sphereGeometry args={[0.02, 10, 10]} />
          <meshStandardMaterial color="#9e360e" roughness={0.42} />
        </mesh>
      ))}

      {/* ── Cute Cartoon Pink Smile ── */}
      <group
        position={[0, 0.14, 1.15]}
        rotation={[0.06, 0, 0]}
        scale={1.0 + puffProgress * 0.1}
      >
        {/* Smooth Broad Smile Arc */}
        <mesh geometry={smileGeometry}>
          <meshStandardMaterial color="#ff7eb3" roughness={0.28} metalness={0.02} />
        </mesh>

        {/* Left Rounded Smile Tip */}
        <mesh position={[-0.145, 0.02, -0.012]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color="#ff7eb3" roughness={0.28} metalness={0.02} />
        </mesh>

        {/* Right Rounded Smile Tip */}
        <mesh position={[0.145, 0.02, -0.012]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color="#ff7eb3" roughness={0.28} metalness={0.02} />
        </mesh>

        {/* Plump Lower Smile Pillow */}
        <mesh position={[0, -0.022, 0.008]} scale={[0.13, 0.055, 0.04]}>
          <sphereGeometry args={[1, 20, 20]} />
          <meshStandardMaterial color="#ff7eb3" roughness={0.28} metalness={0.02} />
        </mesh>
      </group>
    </group>
  );
});

PufferBody.displayName = "PufferBody";

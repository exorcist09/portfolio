import React, { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

export interface PufferFinsHandle {
  animateFins: (time: number, speedMult: number, ampMult: number) => void;
}

export const PufferFins = forwardRef<PufferFinsHandle>((_, ref) => {
  const leftRef  = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);
  const tailRef  = useRef<THREE.Group>(null);

  useImperativeHandle(ref, () => ({
    animateFins: (time, speedMult = 1, ampMult = 1) => {
      const s = 4.8 * speedMult;
      const a = 0.25 * ampMult;
      const p = Math.sin(time * s);

      // Hinged flapping anchored firmly to the body wall
      if (leftRef.current) {
        leftRef.current.rotation.z = Math.PI / 4.5 + p * a;
        leftRef.current.rotation.y = 0.35 + Math.cos(time * s) * 0.12 * ampMult;
      }
      if (rightRef.current) {
        rightRef.current.rotation.z = -Math.PI / 4.5 - p * a;
        rightRef.current.rotation.y = -0.35 - Math.cos(time * s) * 0.12 * ampMult;
      }
      if (tailRef.current) {
        tailRef.current.rotation.y = Math.sin(time * s * 0.85) * 0.38 * ampMult;
        tailRef.current.rotation.z = Math.cos(time * s * 0.85) * 0.05 * ampMult;
      }
    },
  }));

  // Body color base + darker orange shades for design rays
  const finBaseColor = "#e64a19";
  const finDarkRay = "#b8340d";    // Darker shade of body orange
  const finDeepContour = "#9c2807"; // Deep darker contour accent

  return (
    <group>
      {/* ── Left Fin: Ribbed Paddle with Darker Body-Shade Design ── */}
      <group ref={leftRef} position={[-0.92, 0.18, 0.22]} rotation={[0, 0.35, Math.PI / 4.5]}>
        {/* Main Base Blade */}
        <mesh position={[-0.2, 0, 0]} scale={[1, 0.16, 0.92]}>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshStandardMaterial color={finBaseColor} roughness={0.34} metalness={0.02} />
        </mesh>

        {/* Center Dark Fin Ray */}
        <mesh position={[-0.22, 0.012, 0]} scale={[0.92, 0.18, 0.32]}>
          <sphereGeometry args={[0.24, 24, 24]} />
          <meshStandardMaterial color={finDarkRay} roughness={0.32} metalness={0.03} />
        </mesh>

        {/* Upper Dark Accent Ray */}
        <mesh position={[-0.18, 0.008, 0.09]} rotation={[0, 0.22, 0]} scale={[0.82, 0.16, 0.26]}>
          <sphereGeometry args={[0.24, 20, 20]} />
          <meshStandardMaterial color={finDeepContour} roughness={0.32} metalness={0.03} />
        </mesh>

        {/* Lower Dark Accent Ray */}
        <mesh position={[-0.18, 0.008, -0.09]} rotation={[0, -0.22, 0]} scale={[0.82, 0.16, 0.26]}>
          <sphereGeometry args={[0.24, 20, 20]} />
          <meshStandardMaterial color={finDeepContour} roughness={0.32} metalness={0.03} />
        </mesh>
      </group>

      {/* ── Right Fin: Ribbed Paddle with Darker Body-Shade Design ── */}
      <group ref={rightRef} position={[0.92, 0.18, 0.22]} rotation={[0, -0.35, -Math.PI / 4.5]}>
        {/* Main Base Blade */}
        <mesh position={[0.2, 0, 0]} scale={[1, 0.16, 0.92]}>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshStandardMaterial color={finBaseColor} roughness={0.34} metalness={0.02} />
        </mesh>

        {/* Center Dark Fin Ray */}
        <mesh position={[0.22, 0.012, 0]} scale={[0.92, 0.18, 0.32]}>
          <sphereGeometry args={[0.24, 24, 24]} />
          <meshStandardMaterial color={finDarkRay} roughness={0.32} metalness={0.03} />
        </mesh>

        {/* Upper Dark Accent Ray */}
        <mesh position={[0.18, 0.008, 0.09]} rotation={[0, -0.22, 0]} scale={[0.82, 0.16, 0.26]}>
          <sphereGeometry args={[0.24, 20, 20]} />
          <meshStandardMaterial color={finDeepContour} roughness={0.32} metalness={0.03} />
        </mesh>

        {/* Lower Dark Accent Ray */}
        <mesh position={[0.18, 0.008, -0.09]} rotation={[0, 0.22, 0]} scale={[0.82, 0.16, 0.26]}>
          <sphereGeometry args={[0.24, 20, 20]} />
          <meshStandardMaterial color={finDeepContour} roughness={0.32} metalness={0.03} />
        </mesh>
      </group>

      {/* ── Fan Tail with Darker Body-Shade Design Rays ── */}
      <group position={[0, 0.05, -1.05]}>
        {/* Peduncle Base */}
        <mesh position={[0, 0, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.18, 0.18, 16]} />
          <meshStandardMaterial color={finBaseColor} roughness={0.38} metalness={0.02} />
        </mesh>

        {/* Oscillating Tail Lobes Pivot */}
        <group ref={tailRef} position={[0, 0, -0.12]}>
          {/* Upper Lobe Base */}
          <mesh position={[0, 0.18, -0.16]} rotation={[0.34, 0, 0]} scale={[0.065, 0.36, 0.42]}>
            <sphereGeometry args={[1, 18, 18]} />
            <meshStandardMaterial color={finBaseColor} roughness={0.34} metalness={0.02} />
          </mesh>
          {/* Upper Lobe Dark Ray */}
          <mesh position={[0, 0.21, -0.18]} rotation={[0.34, 0, 0]} scale={[0.075, 0.24, 0.32]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshStandardMaterial color={finDarkRay} roughness={0.3} metalness={0.03} />
          </mesh>

          {/* Lower Lobe Base */}
          <mesh position={[0, -0.16, -0.16]} rotation={[-0.34, 0, 0]} scale={[0.065, 0.32, 0.38]}>
            <sphereGeometry args={[1, 18, 18]} />
            <meshStandardMaterial color={finBaseColor} roughness={0.34} metalness={0.02} />
          </mesh>
          {/* Lower Lobe Dark Ray */}
          <mesh position={[0, -0.19, -0.18]} rotation={[-0.34, 0, 0]} scale={[0.075, 0.22, 0.3]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshStandardMaterial color={finDarkRay} roughness={0.3} metalness={0.03} />
          </mesh>

          {/* Center Streamlined Dark Spine */}
          <mesh position={[0, 0.01, -0.2]} scale={[0.055, 0.15, 0.4]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshStandardMaterial color={finDeepContour} roughness={0.3} metalness={0.03} />
          </mesh>
        </group>
      </group>
    </group>
  );
});

PufferFins.displayName = "PufferFins";

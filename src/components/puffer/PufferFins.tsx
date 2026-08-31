import React, { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

export interface PufferFinsHandle {
  animateFins: (time: number, speedMult: number, ampMult: number) => void;
}

export const PufferFins = forwardRef<PufferFinsHandle>((_, ref) => {
  const leftRef = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);
  const dorsalRef = useRef<THREE.Group>(null);
  const analRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);

  useImperativeHandle(ref, () => ({
    animateFins: (time, speedMult = 1, ampMult = 1) => {
      const s = 4.8 * speedMult;
      const a = 0.28 * ampMult;
      const p = Math.sin(time * s);

      // Flapping outward proudly from the body
      if (leftRef.current) {
        leftRef.current.rotation.z = Math.PI / 3.6 + p * a;
        leftRef.current.rotation.y = 0.52 + Math.cos(time * s) * 0.15 * ampMult;
      }
      if (rightRef.current) {
        rightRef.current.rotation.z = -Math.PI / 3.6 - p * a;
        rightRef.current.rotation.y = -0.52 - Math.cos(time * s) * 0.15 * ampMult;
      }
      if (dorsalRef.current) {
        dorsalRef.current.rotation.z = Math.sin(time * s * 0.8) * 0.16 * ampMult;
      }
      if (analRef.current) {
        analRef.current.rotation.z = -Math.sin(time * s * 0.8) * 0.16 * ampMult;
      }
      if (tailRef.current) {
        tailRef.current.rotation.y = Math.sin(time * s * 0.85) * 0.38 * ampMult;
        tailRef.current.rotation.z = Math.cos(time * s * 0.85) * 0.05 * ampMult;
      }
    },
  }));

  // Body color base + darker orange shades for design rays
  const finBaseColor = "#e64a19";
  const finDarkRay = "#b8340d"; // Darker shade of body orange
  const finDeepContour = "#9c2807"; // Deep darker contour accent

  return (
    <group>
      {/* ── Left Fin: Extended Outward from Body Wall ── */}
      <group ref={leftRef} position={[-1.18, 0.18, 0.26]} rotation={[0, 0.52, Math.PI / 3.6]}>
        {/* Main Paddle Blade */}
        <mesh position={[-0.26, 0, 0]} scale={[1.05, 0.18, 0.95]}>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshStandardMaterial color={finBaseColor} roughness={0.34} metalness={0.02} />
        </mesh>

        {/* Center Dark Fin Ray */}
        <mesh position={[-0.28, 0.014, 0]} scale={[0.96, 0.2, 0.34]}>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshStandardMaterial color={finDarkRay} roughness={0.32} metalness={0.03} />
        </mesh>

        {/* Upper Dark Accent Ray */}
        <mesh position={[-0.24, 0.01, 0.1]} rotation={[0, 0.22, 0]} scale={[0.85, 0.18, 0.28]}>
          <sphereGeometry args={[0.26, 20, 20]} />
          <meshStandardMaterial color={finDeepContour} roughness={0.32} metalness={0.03} />
        </mesh>

        {/* Lower Dark Accent Ray */}
        <mesh position={[-0.24, 0.01, -0.1]} rotation={[0, -0.22, 0]} scale={[0.85, 0.18, 0.28]}>
          <sphereGeometry args={[0.26, 20, 20]} />
          <meshStandardMaterial color={finDeepContour} roughness={0.32} metalness={0.03} />
        </mesh>
      </group>

      {/* ── Right Fin: Extended Outward from Body Wall ── */}
      <group ref={rightRef} position={[1.18, 0.18, 0.26]} rotation={[0, -0.52, -Math.PI / 3.6]}>
        {/* Main Paddle Blade */}
        <mesh position={[0.26, 0, 0]} scale={[1.05, 0.18, 0.95]}>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshStandardMaterial color={finBaseColor} roughness={0.34} metalness={0.02} />
        </mesh>

        {/* Center Dark Fin Ray */}
        <mesh position={[0.28, 0.014, 0]} scale={[0.96, 0.2, 0.34]}>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshStandardMaterial color={finDarkRay} roughness={0.32} metalness={0.03} />
        </mesh>

        {/* Upper Dark Accent Ray */}
        <mesh position={[0.24, 0.01, 0.1]} rotation={[0, -0.22, 0]} scale={[0.85, 0.18, 0.28]}>
          <sphereGeometry args={[0.26, 20, 20]} />
          <meshStandardMaterial color={finDeepContour} roughness={0.32} metalness={0.03} />
        </mesh>

        {/* Lower Dark Accent Ray */}
        <mesh position={[0.24, 0.01, -0.1]} rotation={[0, 0.22, 0]} scale={[0.85, 0.18, 0.28]}>
          <sphereGeometry args={[0.26, 20, 20]} />
          <meshStandardMaterial color={finDeepContour} roughness={0.32} metalness={0.03} />
        </mesh>
      </group>

      {/* ── Iconic Pufferfish Dorsal Finlet (Top Rear) ── */}
      <group ref={dorsalRef} position={[0, 0.96, -0.65]} rotation={[-0.32, 0, 0]}>
        <mesh position={[0, 0.14, 0]} scale={[0.07, 0.26, 0.34]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={finBaseColor} roughness={0.36} metalness={0.02} />
        </mesh>
        <mesh position={[0, 0.17, 0.02]} scale={[0.08, 0.16, 0.24]}>
          <sphereGeometry args={[1, 14, 14]} />
          <meshStandardMaterial color={finDarkRay} roughness={0.3} metalness={0.03} />
        </mesh>
      </group>

      {/* ── Iconic Pufferfish Ventral/Anal Finlet (Bottom Rear) ── */}
      <group ref={analRef} position={[0, -0.92, -0.65]} rotation={[0.32, 0, 0]}>
        <mesh position={[0, -0.14, 0]} scale={[0.07, 0.24, 0.32]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={finBaseColor} roughness={0.36} metalness={0.02} />
        </mesh>
        <mesh position={[0, -0.17, 0.02]} scale={[0.08, 0.15, 0.22]}>
          <sphereGeometry args={[1, 14, 14]} />
          <meshStandardMaterial color={finDarkRay} roughness={0.3} metalness={0.03} />
        </mesh>
      </group>

      {/* ── Fan Tail ── */}
      <group position={[0, 0.04, -1.1]}>
        {/* Peduncle Base */}
        <mesh position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.16, 0.18, 16]} />
          <meshStandardMaterial color={finBaseColor} roughness={0.38} metalness={0.02} />
        </mesh>

        {/* Oscillating Tail Lobes Pivot */}
        <group ref={tailRef} position={[0, 0, -0.12]}>
          {/* Upper Lobe */}
          <mesh position={[0, 0.18, -0.16]} rotation={[0.34, 0, 0]} scale={[0.065, 0.36, 0.42]}>
            <sphereGeometry args={[1, 18, 18]} />
            <meshStandardMaterial color={finBaseColor} roughness={0.34} metalness={0.02} />
          </mesh>
          <mesh position={[0, 0.21, -0.18]} rotation={[0.34, 0, 0]} scale={[0.075, 0.24, 0.32]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshStandardMaterial color={finDarkRay} roughness={0.3} metalness={0.03} />
          </mesh>

          {/* Lower Lobe */}
          <mesh position={[0, -0.16, -0.16]} rotation={[-0.34, 0, 0]} scale={[0.065, 0.32, 0.38]}>
            <sphereGeometry args={[1, 18, 18]} />
            <meshStandardMaterial color={finBaseColor} roughness={0.34} metalness={0.02} />
          </mesh>
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

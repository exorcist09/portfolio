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
      const a = 0.28 * ampMult;
      const p = Math.sin(time * s);

      if (leftRef.current)  { leftRef.current.rotation.z  =  Math.PI / 4 + p * a; leftRef.current.rotation.y  =  Math.cos(time * s) * 0.1; }
      if (rightRef.current) { rightRef.current.rotation.z = -Math.PI / 4 - p * a; rightRef.current.rotation.y = -Math.cos(time * s) * 0.1; }
      if (tailRef.current)  { tailRef.current.rotation.y = Math.sin(time * s * 0.85) * 0.42 * ampMult; }
    },
  }));

  // Deep dark orange matching body
  const finColor = "#e64a19";

  return (
    <group>
      {/* Left fin — deep dark orange */}
      <group ref={leftRef} position={[-0.95, 0.2, 0.3]} rotation={[0, 0.4, Math.PI / 4]}>
        <mesh scale={[1, 0.2, 1]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color={finColor} roughness={0.38} metalness={0.02} />
        </mesh>
      </group>

      {/* Right fin — deep dark orange */}
      <group ref={rightRef} position={[0.95, 0.2, 0.3]} rotation={[0, -0.4, -Math.PI / 4]}>
        <mesh scale={[1, 0.2, 1]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color={finColor} roughness={0.38} metalness={0.02} />
        </mesh>
      </group>

      {/* Fan tail — deep dark orange */}
      <group ref={tailRef} position={[0, 0.05, -1.15]}>
        {/* Peduncle */}
        <mesh position={[0, 0, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.2, 0.2, 16]} />
          <meshStandardMaterial color={finColor} roughness={0.38} metalness={0.02} />
        </mesh>
        {/* Upper lobe */}
        <mesh position={[0, 0.22, -0.2]} rotation={[0.36, 0, 0]} scale={[0.065, 0.38, 0.44]}>
          <sphereGeometry args={[1, 18, 18]} />
          <meshStandardMaterial color={finColor} roughness={0.38} metalness={0.02} />
        </mesh>
        {/* Lower lobe */}
        <mesh position={[0, -0.2, -0.2]} rotation={[-0.36, 0, 0]} scale={[0.065, 0.34, 0.4]}>
          <sphereGeometry args={[1, 18, 18]} />
          <meshStandardMaterial color={finColor} roughness={0.38} metalness={0.02} />
        </mesh>
        {/* Center thin lobe */}
        <mesh position={[0, 0.01, -0.24]} scale={[0.055, 0.16, 0.42]}>
          <sphereGeometry args={[1, 14, 14]} />
          <meshStandardMaterial color={finColor} roughness={0.38} metalness={0.02} />
        </mesh>
      </group>
    </group>
  );
});

PufferFins.displayName = "PufferFins";

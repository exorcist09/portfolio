import React, { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

export interface PufferEyesHandle {
  setPupilOffset: (ox: number, oy: number) => void;
}

interface PufferEyesProps {
  puffProgress: number;
}

interface EyeProps {
  position: [number, number, number];
  rotation: [number, number, number];
  pupilRef: React.RefObject<THREE.Group>;
}

// 3D spherical eyes with low-profile depth, symmetrically placed on broader face
const EyeMesh: React.FC<EyeProps> = ({ position, rotation, pupilRef }) => (
  <group position={position} rotation={rotation}>
    {/* Pink Outer Ring */}
    <mesh position={[0, 0, 0.02]}>
      <torusGeometry args={[0.26, 0.045, 16, 32]} />
      <meshStandardMaterial color="#ff7eb3" roughness={0.3} />
    </mesh>

    {/* White Eyeball Sphere */}
    <mesh scale={[1, 1, 0.55]}>
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.02} />
    </mesh>

    {/* Blue Iris + Pupil + Catchlight — embedded flush with eyeball surface */}
    <group ref={pupilRef} position={[0, 0, 0.12]}>
      {/* Blue Iris */}
      <mesh position={[0, 0, 0]} scale={[1, 1, 0.35]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#0984e3" roughness={0.2} metalness={0.05} />
      </mesh>

      {/* Black Pupil */}
      <mesh position={[0, 0, 0.05]} scale={[1, 1, 0.3]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.1} />
      </mesh>

      {/* Catchlight */}
      <mesh position={[0.038, 0.04, 0.08]} scale={[1, 1, 0.5]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  </group>
);

export const PufferEyes = forwardRef<PufferEyesHandle, PufferEyesProps>(
  ({ puffProgress }, ref) => {
    const leftPupilRef  = useRef<THREE.Group>(null);
    const rightPupilRef = useRef<THREE.Group>(null);

    useImperativeHandle(ref, () => ({
      setPupilOffset: (ox: number, oy: number) => {
        const cx = THREE.MathUtils.clamp(ox, -0.06, 0.06);
        const cy = THREE.MathUtils.clamp(oy, -0.05, 0.05);
        if (leftPupilRef.current)  { leftPupilRef.current.position.x = cx; leftPupilRef.current.position.y = cy; }
        if (rightPupilRef.current) { rightPupilRef.current.position.x = cx; rightPupilRef.current.position.y = cy; }
      },
    }));

    const es = 1.0 + puffProgress * 0.08;

    return (
      <group scale={es}>
        {/* Sits naturally on the broader chubby face */}
        <EyeMesh
          position={[-0.46, 0.25, 0.88]}
          rotation={[0.02, -0.15, 0]}
          pupilRef={leftPupilRef}
        />
        <EyeMesh
          position={[0.46, 0.25, 0.88]}
          rotation={[0.02, 0.15, 0]}
          pupilRef={rightPupilRef}
        />
      </group>
    );
  }
);

PufferEyes.displayName = "PufferEyes";

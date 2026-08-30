import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

const PufferFishModel = () => {
    const fishRef = useRef();
    const [hovered, setHovered] = useState(false);

    // Animation Loop: Handles the interactive "puff" scaling
    useFrame((state, delta) => {
        // Target scale: 1.3x when hovered, 1x when resting
        const targetScale = hovered ? 1.3 : 1.0;
        fishRef.current.scale.lerp(
            new THREE.Vector3(targetScale, targetScale, targetScale),
            10 * delta
        );
    });

    return (
        <group
            ref={fishRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        // Optional: Add onClick={() => doSomething()} for more interactivity
        >
            {/* Main Body - Orange Top */}
            <mesh position={[0, 0.2, 0]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="#f39c12" roughness={0.4} />
            </mesh>

            {/* Belly - White/Cream */}
            <mesh position={[0, -0.2, 0]} scale={[0.95, 0.7, 0.95]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="#fdf5e6" roughness={0.6} />
            </mesh>

            {/* Left Eye */}
            <group position={[-0.4, 0.4, 0.8]}>
                <mesh>
                    <sphereGeometry args={[0.25, 32, 32]} />
                    <meshStandardMaterial color="#f1c40f" /> {/* Yellow Outer */}
                </mesh>
                <mesh position={[0.05, 0, 0.2]}>
                    <sphereGeometry args={[0.12, 16, 16]} />
                    <meshStandardMaterial color="#000000" /> {/* Black Pupil */}
                </mesh>
            </group>

            {/* Right Eye */}
            <group position={[0.4, 0.4, 0.8]}>
                <mesh>
                    <sphereGeometry args={[0.25, 32, 32]} />
                    <meshStandardMaterial color="#f1c40f" />
                </mesh>
                <mesh position={[-0.05, 0, 0.2]}>
                    <sphereGeometry args={[0.12, 16, 16]} />
                    <meshStandardMaterial color="#000000" />
                </mesh>
            </group>

            {/* Left Fin */}
            <mesh position={[-1.1, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
                <boxGeometry args={[0.5, 0.1, 0.5]} />
                <meshStandardMaterial color="#d35400" />
            </mesh>

            {/* Right Fin */}
            <mesh position={[1.1, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
                <boxGeometry args={[0.5, 0.1, 0.5]} />
                <meshStandardMaterial color="#d35400" />
            </mesh>

            {/* Tail */}
            <mesh position={[0, 0, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.4, 0.6, 4]} />
                <meshStandardMaterial color="#d35400" />
            </mesh>

            {/* Decorative Spikes (Simplified) */}
            {[
                [0, 1.1, 0], [0.7, 0.8, 0], [-0.7, 0.8, 0],
                [0, 0.8, 0.7], [0, 0.8, -0.7]
            ].map((pos, i) => (
                <mesh key={i} position={pos}>
                    <coneGeometry args={[0.08, 0.2, 8]} />
                    <meshStandardMaterial color="#e67e22" />
                </mesh>
            ))}
        </group>
    );
};
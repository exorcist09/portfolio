"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface OrbCanvasProps {
  size?: number;
  isHovered?: boolean;
  pulseTrigger?: number;
  className?: string;
}

// Raw GLSL Vertex Shader: direct clip-space quad with zero camera distortion
const vertexShader = /* glsl */ `
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Raw GLSL Fragment Shader: Analytical raymarched glass plasma sphere
const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform float uRotation;
  uniform vec2 uMouse;
  uniform float uPulse;

  // Site Theme Accent Colors
  uniform vec3 uAccent;       // #EA580C
  uniform vec3 uAccentLight;  // #FB923C
  uniform vec3 uAccentDark;   // #C2410C

  mat3 rotateY(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat3(
      c, 0.0, s,
      0.0, 1.0, 0.0,
     -s, 0.0, c
    );
  }

  mat3 rotateZ(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat3(
      c, -s, 0.0,
      s,  c, 0.0,
      0.0, 0.0, 1.0
    );
  }

  mat3 rotateX(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat3(
      1.0, 0.0, 0.0,
      0.0, c, -s,
      0.0, s,  c
    );
  }

  void main() {
    // Perfectly centered UV coordinates from -1.0 to 1.0
    vec2 uv = (vUv - 0.5) * 2.0;
    float rUV = length(uv);

    // Camera setup
    vec3 ro = vec3(0.0, 0.0, 2.2);
    vec3 rd = normalize(vec3(uv, -2.2));

    // Analytical Sphere Intersection (Radius = 0.84 occupies ~85% of canvas)
    float R = 0.84;
    float b = dot(ro, rd);
    float c = dot(ro, ro) - R * R;
    float h = b * b - c;

    // Outside the sphere: render a tight glowing aura at the perimeter, discard outside
    if (h < 0.0) {
      if (rUV >= 0.82 && rUV < 0.98) {
        float auraFade = smoothstep(0.98, 0.83, rUV);
        float halo = exp(-pow((rUV - 0.83) * 26.0, 2.0));
        vec3 haloCol = uAccent; // Pure accent color, zero yellow cast
        float a = clamp(halo * 0.95 + auraFade * 0.3, 0.0, 1.0);
        gl_FragColor = vec4(haloCol, a);
      } else {
        discard; // 100% transparent outside, ZERO background
      }
      return;
    }

    // Front surface hit point
    float t1 = -b - sqrt(max(0.0, h));
    vec3 p1 = ro + t1 * rd;
    vec3 n1 = p1 / R;

    // Axial tilt + mouse interaction
    const float AXIAL_TILT = 0.4091;
    mat3 tiltMat = rotateZ(-AXIAL_TILT) * rotateX(uMouse.y * 0.22) * rotateY(uMouse.x * 0.22);
    mat3 rotMat = tiltMat * rotateY(uRotation);

    // 1. Double-ring concentric glass rim
    float NdotV = clamp(dot(n1, -rd), 0.0, 1.0);
    float rim1 = pow(clamp(1.0 - NdotV, 0.0, 1.0), 2.2);
    float rim2 = exp(-pow((NdotV - 0.26) * 7.5, 2.0));
    float doubleRim = rim1 * 1.6 + rim2 * 1.1;
    vec3 rimColor = uAccent; // Strictly accent color

    // 2. Rotating S-curve plasma chamber
    vec3 pRot = rotMat * p1;
    float wave = 0.36 * sin(pRot.x * 2.1 + pRot.z * 1.4 + uTime * 0.45)
               + 0.14 * cos(pRot.z * 2.8 - pRot.x * 1.2 + uTime * 0.25);
    float sPos = pRot.y - wave;

    float chamber = smoothstep(-0.25, 0.4, sPos);
    float crest = exp(-pow(sPos * 9.5, 2.0));

    vec3 colBase = uAccentDark;
    vec3 colMid = uAccent;
    vec3 colLight = uAccent;
    vec3 colCore = mix(uAccent, vec3(1.0, 1.0, 1.0), 0.7);

    vec3 chamberCol = mix(colBase, colMid, chamber);
    chamberCol = mix(chamberCol, colLight, smoothstep(0.2, 0.85, chamber));
    chamberCol = mix(chamberCol, colCore, crest * 0.9);

    // 3. Curved specular highlight
    vec3 keyLight = normalize(vec3(-0.62, 0.78, 0.55));
    vec3 halfKey = normalize(keyLight - rd);
    float specSharp = pow(clamp(dot(n1, halfKey), 0.0, 1.0), 38.0);
    float specBroad = pow(clamp(dot(n1, halfKey), 0.0, 1.0), 7.0) * 0.5;
    vec3 specHighlight = vec3(1.0, 1.0, 1.0) * specSharp * 2.0 + uAccent * (specBroad * 0.4);

    // Secondary rim reflection
    vec3 rimLight = normalize(vec3(0.68, -0.65, -0.25));
    vec3 halfRim = normalize(rimLight - rd);
    float specRim = pow(clamp(dot(n1, halfRim), 0.0, 1.0), 22.0) * 0.35;
    vec3 specRimCol = vec3(0.9, 0.95, 1.0) * specRim;

    // Lower void
    vec3 lowerVoid = vec3(0.015, 0.005, 0.002);

    // Combine: mix in rim smoothly so it never blows out to yellow
    vec3 finalColor = mix(lowerVoid, chamberCol, clamp(chamber * 0.88 + crest * 0.4, 0.0, 1.0));
    float rimFactor = clamp(doubleRim * 0.75, 0.0, 1.0);
    finalColor = mix(finalColor, rimColor, rimFactor * 0.8);
    finalColor += rimColor * (doubleRim * 0.35);
    finalColor += specHighlight + specRimCol;

    // Pulse brightness
    finalColor *= (1.0 + uPulse * 0.6);

    // Smooth alpha
    float alpha = clamp(doubleRim * 0.85 + chamber * 0.85 + crest + specSharp + 0.35, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

function parseColorToVec3(colorStr: string, fallback: [number, number, number]): THREE.Vector3 {
  try {
    if (!colorStr) return new THREE.Vector3(...fallback);
    const trimmed = colorStr.trim();
    if (trimmed.startsWith("#")) {
      const col = new THREE.Color(trimmed);
      return new THREE.Vector3(col.r, col.g, col.b);
    }
    return new THREE.Vector3(...fallback);
  } catch {
    return new THREE.Vector3(...fallback);
  }
}

export default function OrbCanvas({
  size = 76,
  isHovered = false,
  pulseTrigger = 0,
  className = "",
}: OrbCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pulseRef = useRef<number>(0);
  const spinBoostRef = useRef<number>(0);
  const rotationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isHoveredRef = useRef<boolean>(isHovered);

  // Keep isHovered ref in sync without triggering useEffect re-runs
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    if (pulseTrigger > 0) {
      pulseRef.current = 1.0;
      spinBoostRef.current = 2.0;
    }
  }, [pulseTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const styles = getComputedStyle(document.documentElement);
    const accentHex = styles.getPropertyValue("--accent") || "#EA580C";
    const accentLightHex = styles.getPropertyValue("--accent") || "#EA580C";
    const accentDarkHex = styles.getPropertyValue("--accent-hover") || "#C2410C";

    const vAccent = parseColorToVec3(accentHex, [0.918, 0.345, 0.047]);
    const vAccentLight = parseColorToVec3(accentHex, [0.918, 0.345, 0.047]);
    const vAccentDark = parseColorToVec3(accentDarkHex, [0.761, 0.255, 0.047]);

    let animationFrameId: number;
    lastTimeRef.current = performance.now();

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.Camera | null = null;
    let material: THREE.RawShaderMaterial | null = null;
    let geometry: THREE.PlaneGeometry | null = null;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(size, size, false);

      scene = new THREE.Scene();
      camera = new THREE.Camera();

      geometry = new THREE.PlaneGeometry(2, 2);
      material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uRotation: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uPulse: { value: 0 },
          uAccent: { value: vAccent },
          uAccentLight: { value: vAccentLight },
          uAccentDark: { value: vAccentDark },
        },
        transparent: true,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
      });

      const quad = new THREE.Mesh(geometry, material);
      quad.frustumCulled = false;
      scene.add(quad);
    } catch {
      renderer = null;
    }

    const currentMouse = new THREE.Vector2(0, 0);

    // 100% Procedural 2D Canvas Fallback in case WebGL context is unavailable
    const render2DFallback = (time: number, rot: number, pulse: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const r = (size / 2) * 0.82;

      // Outer glow
      const outerGlow = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r * 1.15);
      outerGlow.addColorStop(0, "rgba(234, 88, 12, 0.45)");
      outerGlow.addColorStop(1, "rgba(234, 88, 12, 0)");
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Base sphere body
      const baseGrad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.25, r * 0.1, cx, cy, r);
      baseGrad.addColorStop(0, accentHex);
      baseGrad.addColorStop(0.4, accentHex);
      baseGrad.addColorStop(0.85, "#9A3412");
      baseGrad.addColorStop(1, "#180702");
      ctx.fillStyle = baseGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Plasma wave core
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.96, 0, Math.PI * 2);
      ctx.clip();

      const waveGrad = ctx.createLinearGradient(0, 0, size, size);
      waveGrad.addColorStop(0, "rgba(255, 255, 255, 0.4)");
      waveGrad.addColorStop(0.5, "rgba(234, 88, 12, 0.6)");
      waveGrad.addColorStop(1, "transparent");

      ctx.fillStyle = waveGrad;
      ctx.beginPath();
      const waveY = cy + Math.sin(rot * 2) * (r * 0.25);
      ctx.ellipse(cx, waveY, r * 0.8, r * 0.35, rot * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Specular highlight crescent
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.beginPath();
      ctx.ellipse(cx - r * 0.38, cy - r * 0.38, r * 0.24, r * 0.12, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Glass rim strictly matching accent color
      ctx.strokeStyle = "rgba(234, 88, 12, 0.85)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 0.75, 0, Math.PI * 2);
      ctx.stroke();
    };

    const renderLoop = (time: number) => {
      const delta = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      // Calmer, gentler rotation speed (idle ~0.30 rad/s, hover ~0.70 rad/s)
      const targetSpeed = isHoveredRef.current ? 0.70 : 0.30;
      spinBoostRef.current *= Math.pow(0.12, delta);
      const speed = targetSpeed + spinBoostRef.current;
      rotationRef.current += speed * delta;

      pulseRef.current *= Math.pow(0.08, delta);

      currentMouse.x += (mouseRef.current.x - currentMouse.x) * Math.min(delta * 6, 1);
      currentMouse.y += (mouseRef.current.y - currentMouse.y) * Math.min(delta * 6, 1);

      if (renderer && scene && camera && material) {
        material.uniforms.uTime.value = time * 0.001;
        material.uniforms.uRotation.value = rotationRef.current;
        material.uniforms.uMouse.value.copy(currentMouse);
        material.uniforms.uPulse.value = pulseRef.current;
        renderer.render(scene, camera);
      } else {
        render2DFallback(time, rotationRef.current, pulseRef.current);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = { x: Math.max(-1, Math.min(1, nx)), y: Math.max(-1, Math.min(1, ny)) };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (renderer) renderer.dispose();
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      className={`select-none pointer-events-auto cursor-pointer ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: "block",
      }}
    />
  );
}

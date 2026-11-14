"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight } from "lucide-react";

export default function Mascot3D({ hidden = true }: { hidden?: boolean }) {
  if (hidden) return null;

  const mountRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"entering" | "waving" | "idle">("entering");
  const [speechVisible, setSpeechVisible] = useState(false);
  const [message, setMessage] = useState("Hey! I'm Adarsh's 3D buddy. Need help exploring?");
  const [isHovered, setIsHovered] = useState(false);
  const [positionX, setPositionX] = useState(180);

  const animStateRef = useRef({
    phase: "entering",
    walkCycle: 0,
    waveCycle: 0,
    idleCycle: 0,
    mouseTarget: { x: 0, y: 0 },
  });

  useEffect(() => {
    animStateRef.current.phase = phase;
  }, [phase]);

  // Walking entrance
  useEffect(() => {
    setPositionX(180);
    setPhase("entering");

    const startTime = performance.now();
    const duration = 2200;

    const animateWalkIn = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setPositionX(180 * (1 - ease));

      if (progress < 1) {
        requestAnimationFrame(animateWalkIn);
      } else {
        setPositionX(0);
        setPhase("waving");
        setTimeout(() => {
          setPhase("idle");
          setSpeechVisible(true);
        }, 2000);
      }
    };

    const frameId = requestAnimationFrame(animateWalkIn);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth + 80) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight + 120) / (window.innerHeight / 2);
      animStateRef.current.mouseTarget = {
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // =========================================
  // Three.js Scene
  // =========================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = 170;
    const H = 260;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 100);
    camera.position.set(0, 1.05, 4.6);
    camera.lookAt(0, 0.85, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.5);
    keyLight.position.set(2, 4, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x8899ff, 0.7);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xea580c, 2.0);
    rimLight.position.set(-2, 3, -3);
    scene.add(rimLight);

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xe8b89d,
      roughness: 0.55,
      metalness: 0.05,
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.8,
      metalness: 0.05,
    });

    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0x1c1c20,
      roughness: 0.6,
      metalness: 0.08,
    });

    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x12121a,
      roughness: 0.75,
      metalness: 0.05,
    });

    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0xea580c,
      roughness: 0.35,
      metalness: 0.15,
      emissive: 0xea580c,
      emissiveIntensity: 0.08,
    });

    const eyeWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf5f5f0,
      roughness: 0.3,
      metalness: 0.0,
    });

    const irisMat = new THREE.MeshStandardMaterial({
      color: 0x2c1a0e,
      roughness: 0.4,
      metalness: 0.1,
    });

    const pupilMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.2,
      metalness: 0.0,
    });

    const lipMat = new THREE.MeshStandardMaterial({
      color: 0xc08070,
      roughness: 0.5,
      metalness: 0.0,
    });

    const browMat = new THREE.MeshStandardMaterial({
      color: 0x151515,
      roughness: 0.8,
      metalness: 0.0,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xea580c,
      roughness: 0.3,
      metalness: 0.2,
      emissive: 0xea580c,
      emissiveIntensity: 0.15,
    });

    // ==========================================
    // CHARACTER BUILD - Proper Human Proportions
    // ==========================================
    const root = new THREE.Group();
    scene.add(root);

    // --- BODY GROUP (for bobbing) ---
    const bodyGroup = new THREE.Group();
    bodyGroup.position.y = 0.0;
    root.add(bodyGroup);

    // --- HIPS ---
    const hipsPivot = new THREE.Group();
    hipsPivot.position.y = 0.72;
    bodyGroup.add(hipsPivot);

    const hipsGeo = new THREE.SphereGeometry(0.2, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const hips = new THREE.Mesh(hipsGeo, pantsMat);
    hips.scale.set(1.15, 0.5, 0.85);
    hips.position.y = -0.02;
    hipsPivot.add(hips);

    // --- TORSO (tapered from shoulders to waist) ---
    const torsoPivot = new THREE.Group();
    torsoPivot.position.y = 0.08;
    hipsPivot.add(torsoPivot);

    // Main torso cylinder slightly tapered
    const torsoPoints: THREE.Vector2[] = [];
    torsoPoints.push(new THREE.Vector2(0.19, 0));     // waist
    torsoPoints.push(new THREE.Vector2(0.2, 0.08));
    torsoPoints.push(new THREE.Vector2(0.22, 0.2));    // mid
    torsoPoints.push(new THREE.Vector2(0.25, 0.34));   // chest
    torsoPoints.push(new THREE.Vector2(0.24, 0.42));   // shoulders
    torsoPoints.push(new THREE.Vector2(0.22, 0.46));   // neck base
    const torsoGeo = new THREE.LatheGeometry(torsoPoints, 20);
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torsoPivot.add(torso);

    // Shirt collar detail (small ring at neck)
    const collarGeo = new THREE.TorusGeometry(0.14, 0.022, 8, 16);
    const collar = new THREE.Mesh(collarGeo, shirtMat);
    collar.position.y = 0.46;
    collar.rotation.x = Math.PI * 0.5;
    torsoPivot.add(collar);

    // Accent stripe on shirt
    const stripeGeo = new THREE.PlaneGeometry(0.015, 0.36);
    const stripe = new THREE.Mesh(stripeGeo, accentMat);
    stripe.position.set(0, 0.23, 0.205);
    torsoPivot.add(stripe);

    // --- NECK ---
    const neckGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.1, 12);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = 0.5;
    torsoPivot.add(neck);

    // --- HEAD PIVOT ---
    const headPivot = new THREE.Group();
    headPivot.position.y = 0.58;
    torsoPivot.add(headPivot);

    // Head — slightly oval cranium
    const headGeo = new THREE.SphereGeometry(0.17, 24, 20);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.scale.set(1, 1.1, 0.95);
    head.position.y = 0.05;
    headPivot.add(head);

    // Jawline — subtle chin shape
    const jawGeo = new THREE.SphereGeometry(0.13, 16, 12, 0, Math.PI * 2, Math.PI * 0.3, Math.PI * 0.4);
    const jaw = new THREE.Mesh(jawGeo, skinMat);
    jaw.position.set(0, -0.04, 0.03);
    jaw.scale.set(1, 0.7, 0.9);
    headPivot.add(jaw);

    // --- FACE ---
    // Nose bridge
    const noseGeo = new THREE.SphereGeometry(0.028, 10, 8);
    const nose = new THREE.Mesh(noseGeo, skinMat);
    nose.position.set(0, 0.02, 0.165);
    nose.scale.set(0.75, 1.1, 1);
    headPivot.add(nose);

    // Nose tip
    const noseTipGeo = new THREE.SphereGeometry(0.022, 10, 8);
    const noseTip = new THREE.Mesh(noseTipGeo, skinMat);
    noseTip.position.set(0, -0.005, 0.175);
    headPivot.add(noseTip);

    // LEFT EYE
    const leftEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(0.058, 0.06, 0.13);
    headPivot.add(leftEyeGroup);

    const eyeWhiteGeo = new THREE.SphereGeometry(0.035, 14, 14);
    const leftEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    leftEyeWhite.scale.set(1, 0.8, 0.5);
    leftEyeGroup.add(leftEyeWhite);

    const irisGeo = new THREE.SphereGeometry(0.02, 12, 12);
    const leftIris = new THREE.Mesh(irisGeo, irisMat);
    leftIris.position.z = 0.014;
    leftIris.scale.set(1, 1, 0.5);
    leftEyeGroup.add(leftIris);

    const pupilGeo = new THREE.SphereGeometry(0.01, 10, 10);
    const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.z = 0.02;
    leftEyeGroup.add(leftPupil);

    // LEFT EYEBROW
    const browGeo = new THREE.BoxGeometry(0.05, 0.01, 0.015);
    const leftBrow = new THREE.Mesh(browGeo, browMat);
    leftBrow.position.set(0.058, 0.1, 0.15);
    leftBrow.rotation.z = -0.08;
    headPivot.add(leftBrow);

    // RIGHT EYE
    const rightEyeGroup = new THREE.Group();
    rightEyeGroup.position.set(-0.058, 0.06, 0.13);
    headPivot.add(rightEyeGroup);

    const rightEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    rightEyeWhite.scale.set(1, 0.8, 0.5);
    rightEyeGroup.add(rightEyeWhite);

    const rightIris = new THREE.Mesh(irisGeo, irisMat);
    rightIris.position.z = 0.014;
    rightIris.scale.set(1, 1, 0.5);
    rightEyeGroup.add(rightIris);

    const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.z = 0.02;
    rightEyeGroup.add(rightPupil);

    // RIGHT EYEBROW
    const rightBrow = new THREE.Mesh(browGeo, browMat);
    rightBrow.position.set(-0.058, 0.1, 0.15);
    rightBrow.rotation.z = 0.08;
    headPivot.add(rightBrow);

    // Mouth
    const mouthGeo = new THREE.BoxGeometry(0.055, 0.012, 0.015);
    const mouth = new THREE.Mesh(mouthGeo, lipMat);
    mouth.position.set(0, -0.04, 0.155);
    headPivot.add(mouth);

    // Ears
    const earGeo = new THREE.SphereGeometry(0.04, 10, 8);
    const leftEar = new THREE.Mesh(earGeo, skinMat);
    leftEar.position.set(0.165, 0.05, 0);
    leftEar.scale.set(0.4, 0.75, 0.5);
    headPivot.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, skinMat);
    rightEar.position.set(-0.165, 0.05, 0);
    rightEar.scale.set(0.4, 0.75, 0.5);
    headPivot.add(rightEar);

    // --- HAIR ---
    // Top hair volume
    const hairTopGeo = new THREE.SphereGeometry(0.18, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const hairTop = new THREE.Mesh(hairTopGeo, hairMat);
    hairTop.position.set(0, 0.06, -0.01);
    hairTop.scale.set(1.02, 1.0, 1.02);
    headPivot.add(hairTop);

    // Side hair fringe
    const fringeGeo = new THREE.SphereGeometry(0.12, 12, 10, -Math.PI * 0.3, Math.PI * 0.6, 0, Math.PI * 0.4);
    const fringe = new THREE.Mesh(fringeGeo, hairMat);
    fringe.position.set(0.06, 0.13, 0.1);
    fringe.rotation.z = -0.3;
    headPivot.add(fringe);

    // --- LEFT ARM ---
    const leftShoulderPivot = new THREE.Group();
    leftShoulderPivot.position.set(0.27, 0.4, 0);
    torsoPivot.add(leftShoulderPivot);

    // Shoulder cap
    const shoulderCapGeo = new THREE.SphereGeometry(0.06, 10, 10);
    const leftShoulderCap = new THREE.Mesh(shoulderCapGeo, shirtMat);
    leftShoulderPivot.add(leftShoulderCap);

    // Upper arm
    const upperArmGeo = new THREE.CylinderGeometry(0.052, 0.045, 0.22, 10);
    const leftUpperArm = new THREE.Mesh(upperArmGeo, shirtMat);
    leftUpperArm.position.y = -0.13;
    leftShoulderPivot.add(leftUpperArm);

    // Elbow pivot
    const leftElbowPivot = new THREE.Group();
    leftElbowPivot.position.y = -0.24;
    leftShoulderPivot.add(leftElbowPivot);

    // Forearm (skin showing)
    const forearmGeo = new THREE.CylinderGeometry(0.042, 0.035, 0.2, 10);
    const leftForearm = new THREE.Mesh(forearmGeo, skinMat);
    leftForearm.position.y = -0.1;
    leftElbowPivot.add(leftForearm);

    // Hand
    const handGeo = new THREE.SphereGeometry(0.04, 10, 10);
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.y = -0.22;
    leftHand.scale.set(0.85, 1.1, 0.65);
    leftElbowPivot.add(leftHand);

    // Fingers hint
    const fingerGeo = new THREE.CylinderGeometry(0.008, 0.006, 0.04, 6);
    for (let i = 0; i < 4; i++) {
      const finger = new THREE.Mesh(fingerGeo, skinMat);
      finger.position.set(-0.018 + i * 0.012, -0.26, 0.01);
      leftElbowPivot.add(finger);
    }

    // --- RIGHT ARM ---
    const rightShoulderPivot = new THREE.Group();
    rightShoulderPivot.position.set(-0.27, 0.4, 0);
    torsoPivot.add(rightShoulderPivot);

    const rightShoulderCap = new THREE.Mesh(shoulderCapGeo, shirtMat);
    rightShoulderPivot.add(rightShoulderCap);

    const rightUpperArm = new THREE.Mesh(upperArmGeo, shirtMat);
    rightUpperArm.position.y = -0.13;
    rightShoulderPivot.add(rightUpperArm);

    const rightElbowPivot = new THREE.Group();
    rightElbowPivot.position.y = -0.24;
    rightShoulderPivot.add(rightElbowPivot);

    const rightForearm = new THREE.Mesh(forearmGeo, skinMat);
    rightForearm.position.y = -0.1;
    rightElbowPivot.add(rightForearm);

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.y = -0.22;
    rightHand.scale.set(0.85, 1.1, 0.65);
    rightElbowPivot.add(rightHand);

    for (let i = 0; i < 4; i++) {
      const finger = new THREE.Mesh(fingerGeo, skinMat);
      finger.position.set(-0.018 + i * 0.012, -0.26, 0.01);
      rightElbowPivot.add(finger);
    }

    // --- LEFT LEG ---
    const leftHipPivot = new THREE.Group();
    leftHipPivot.position.set(0.1, 0.0, 0);
    hipsPivot.add(leftHipPivot);

    const upperLegGeo = new THREE.CylinderGeometry(0.07, 0.058, 0.3, 12);
    const leftUpperLeg = new THREE.Mesh(upperLegGeo, pantsMat);
    leftUpperLeg.position.y = -0.18;
    leftHipPivot.add(leftUpperLeg);

    const leftKneePivot = new THREE.Group();
    leftKneePivot.position.y = -0.33;
    leftHipPivot.add(leftKneePivot);

    const lowerLegGeo = new THREE.CylinderGeometry(0.055, 0.042, 0.28, 10);
    const leftLowerLeg = new THREE.Mesh(lowerLegGeo, pantsMat);
    leftLowerLeg.position.y = -0.14;
    leftKneePivot.add(leftLowerLeg);

    // Foot / shoe
    const shoeGeo = new THREE.BoxGeometry(0.09, 0.055, 0.15);
    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(0, -0.31, 0.025);
    leftKneePivot.add(leftShoe);

    // Sole
    const soleGeo = new THREE.BoxGeometry(0.092, 0.02, 0.155);
    const soleMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
    const leftSole = new THREE.Mesh(soleGeo, soleMat);
    leftSole.position.set(0, -0.34, 0.025);
    leftKneePivot.add(leftSole);

    // --- RIGHT LEG ---
    const rightHipPivot = new THREE.Group();
    rightHipPivot.position.set(-0.1, 0.0, 0);
    hipsPivot.add(rightHipPivot);

    const rightUpperLeg = new THREE.Mesh(upperLegGeo, pantsMat);
    rightUpperLeg.position.y = -0.18;
    rightHipPivot.add(rightUpperLeg);

    const rightKneePivot = new THREE.Group();
    rightKneePivot.position.y = -0.33;
    rightHipPivot.add(rightKneePivot);

    const rightLowerLeg = new THREE.Mesh(lowerLegGeo, pantsMat);
    rightLowerLeg.position.y = -0.14;
    rightKneePivot.add(rightLowerLeg);

    const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoe.position.set(0, -0.31, 0.025);
    rightKneePivot.add(rightShoe);

    const rightSole = new THREE.Mesh(soleGeo, soleMat);
    rightSole.position.set(0, -0.34, 0.025);
    rightKneePivot.add(rightSole);

    // Slight character turn
    root.rotation.y = 0.2;

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const st = animStateRef.current;

      if (st.phase === "entering") {
        st.walkCycle += dt * 8;
        const w = st.walkCycle;

        // Legs: alternating stride with knees bending
        leftHipPivot.rotation.x = Math.sin(w) * 0.5;
        rightHipPivot.rotation.x = -Math.sin(w) * 0.5;
        leftKneePivot.rotation.x = Math.max(0, -Math.sin(w) * 0.6);
        rightKneePivot.rotation.x = Math.max(0, Math.sin(w) * 0.6);

        // Arms counter-swing
        leftShoulderPivot.rotation.x = -Math.sin(w) * 0.4;
        rightShoulderPivot.rotation.x = Math.sin(w) * 0.4;
        leftElbowPivot.rotation.x = -0.3;
        rightElbowPivot.rotation.x = -0.3;
        leftShoulderPivot.rotation.z = 0.1;
        rightShoulderPivot.rotation.z = -0.1;

        // Body bob and lean
        bodyGroup.position.y = Math.abs(Math.sin(w)) * 0.03;
        hipsPivot.rotation.y = Math.sin(w) * 0.06;
        headPivot.rotation.x = 0;
        headPivot.rotation.z = 0;

      } else if (st.phase === "waving") {
        st.waveCycle += dt * 6;
        const wv = st.waveCycle;

        // Return legs to neutral
        leftHipPivot.rotation.x = THREE.MathUtils.lerp(leftHipPivot.rotation.x, 0, 0.12);
        rightHipPivot.rotation.x = THREE.MathUtils.lerp(rightHipPivot.rotation.x, 0, 0.12);
        leftKneePivot.rotation.x = THREE.MathUtils.lerp(leftKneePivot.rotation.x, 0, 0.12);
        rightKneePivot.rotation.x = THREE.MathUtils.lerp(rightKneePivot.rotation.x, 0, 0.12);
        bodyGroup.position.y = THREE.MathUtils.lerp(bodyGroup.position.y, 0, 0.12);
        hipsPivot.rotation.y = THREE.MathUtils.lerp(hipsPivot.rotation.y, 0, 0.12);

        // Left arm relaxed
        leftShoulderPivot.rotation.x = THREE.MathUtils.lerp(leftShoulderPivot.rotation.x, 0, 0.12);
        leftShoulderPivot.rotation.z = THREE.MathUtils.lerp(leftShoulderPivot.rotation.z, 0.1, 0.12);
        leftElbowPivot.rotation.x = THREE.MathUtils.lerp(leftElbowPivot.rotation.x, 0, 0.12);

        // Right arm up & waving
        rightShoulderPivot.rotation.x = THREE.MathUtils.lerp(rightShoulderPivot.rotation.x, 0.2, 0.15);
        rightShoulderPivot.rotation.z = THREE.MathUtils.lerp(rightShoulderPivot.rotation.z, -2.6, 0.15);
        rightElbowPivot.rotation.x = -0.8 + Math.sin(wv * 3) * 0.3;
        rightElbowPivot.rotation.z = Math.sin(wv * 3) * 0.15;

        // Head pleasant tilt
        headPivot.rotation.z = Math.sin(wv * 1.5) * 0.1;
        headPivot.rotation.x = -0.05;

      } else {
        // IDLE
        st.idleCycle += dt * 1.6;
        const idl = st.idleCycle;

        // Neutral standing
        leftHipPivot.rotation.x = THREE.MathUtils.lerp(leftHipPivot.rotation.x, 0, 0.08);
        rightHipPivot.rotation.x = THREE.MathUtils.lerp(rightHipPivot.rotation.x, 0, 0.08);
        leftKneePivot.rotation.x = THREE.MathUtils.lerp(leftKneePivot.rotation.x, 0, 0.08);
        rightKneePivot.rotation.x = THREE.MathUtils.lerp(rightKneePivot.rotation.x, 0, 0.08);

        // Breathing
        bodyGroup.position.y = Math.sin(idl) * 0.01;
        torso.scale.set(1 + Math.sin(idl) * 0.008, 1, 1 + Math.sin(idl) * 0.008);

        // Arms relaxed with subtle sway
        leftShoulderPivot.rotation.x = Math.sin(idl * 0.8) * 0.04;
        leftShoulderPivot.rotation.z = 0.1 + Math.sin(idl) * 0.015;
        leftElbowPivot.rotation.x = THREE.MathUtils.lerp(leftElbowPivot.rotation.x, -0.1, 0.08);

        rightShoulderPivot.rotation.x = THREE.MathUtils.lerp(rightShoulderPivot.rotation.x, -Math.sin(idl * 0.8) * 0.04, 0.08);
        rightShoulderPivot.rotation.z = THREE.MathUtils.lerp(rightShoulderPivot.rotation.z, -0.1 - Math.sin(idl) * 0.015, 0.08);
        rightElbowPivot.rotation.x = THREE.MathUtils.lerp(rightElbowPivot.rotation.x, -0.1, 0.08);
        rightElbowPivot.rotation.z = THREE.MathUtils.lerp(rightElbowPivot.rotation.z, 0, 0.08);

        // Head tracks mouse
        const tgtX = -st.mouseTarget.y * 0.2;
        const tgtY = st.mouseTarget.x * 0.35;
        headPivot.rotation.x = THREE.MathUtils.lerp(headPivot.rotation.x, tgtX, 0.06);
        headPivot.rotation.y = THREE.MathUtils.lerp(headPivot.rotation.y, tgtY, 0.06);
        headPivot.rotation.z = THREE.MathUtils.lerp(headPivot.rotation.z, 0, 0.08);

        // Eyes track mouse
        const eyeX = st.mouseTarget.x * 0.006;
        const eyeY = -st.mouseTarget.y * 0.004;
        leftIris.position.x = eyeX;
        leftIris.position.y = eyeY;
        leftPupil.position.x = eyeX;
        leftPupil.position.y = eyeY;
        rightIris.position.x = eyeX;
        rightIris.position.y = eyeY;
        rightPupil.position.x = eyeX;
        rightPupil.position.y = eyeY;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleMascotClick = () => {
    setPhase("waving");
    setSpeechVisible(true);
    const msgs = [
      "Check out Kairo & Fyn in the Projects section!",
      "Scroll down to see the interactive experience timeline!",
      "Adarsh is open for freelance — full-stack or systems!",
      "Hit Contact to send a message or copy the email!",
    ];
    setMessage(msgs[Math.floor(Math.random() * msgs.length)]);
    setTimeout(() => setPhase("idle"), 2000);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{
        transform: `translateX(${positionX}px)`,
        transition: phase === "entering" ? "none" : "transform 0.4s ease-out",
      }}
      className="fixed bottom-2 sm:bottom-4 right-2 sm:right-5 z-40 select-none flex flex-col items-end pointer-events-none"
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {speechVisible && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="pointer-events-auto relative mb-2 mr-3 w-64 sm:w-72 rounded-2xl border border-white/10 bg-[#111113]/92 backdrop-blur-xl p-3.5 shadow-2xl text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-[10px] font-mono-custom uppercase tracking-wider text-[var(--accent)] font-semibold">
                <Sparkles className="w-3 h-3 fill-[var(--accent)]" />
                Companion
              </span>
              <button
                onClick={() => setSpeechVisible(false)}
                className="text-[#8A8A85] hover:text-white transition-colors cursor-pointer p-0.5 rounded-full"
                aria-label="Close message"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-[#EDEDEA] leading-relaxed mb-3 font-sans">
              {message}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "work", label: "Projects" },
                { id: "experience", label: "Experience" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className="text-[10px] font-mono-custom px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#EDEDEA] border border-white/[0.08] transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>{s.label}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-[var(--accent)]" />
                </button>
              ))}
              <button
                onClick={() => scrollToSection("contact")}
                className="text-[10px] font-mono-custom px-2.5 py-1 rounded-full bg-[var(--accent)]/20 hover:bg-[var(--accent)]/30 text-[var(--accent)] border border-[var(--accent)]/40 transition-all cursor-pointer flex items-center gap-1 font-semibold"
              >
                <span>Contact</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>

            <div className="absolute -bottom-2 right-14 w-3.5 h-3.5 rotate-45 border-r border-b border-white/10 bg-[#111113]/95" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <div
        onClick={handleMascotClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="pointer-events-auto relative w-[150px] sm:w-[170px] h-[230px] sm:h-[260px] cursor-pointer group flex items-end justify-center"
        title="Click to interact"
      >
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-black/60 blur-sm pointer-events-none" />

        <div ref={mountRef} className="w-full h-full flex items-center justify-center" />

        {!speechVisible && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-6 right-4 px-2 py-0.5 rounded-full bg-black/80 border border-white/10 text-[10px] font-mono-custom text-[#8A8A85] whitespace-nowrap pointer-events-none shadow-lg"
          >
            click to wave 👋
          </motion.div>
        )}
      </div>
    </div>
  );
}

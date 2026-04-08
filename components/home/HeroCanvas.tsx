"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

function AnimatedOrb() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <Sphere ref={meshRef} args={[1.4, 64, 64]}>
        <MeshDistortMaterial
          color="#3a9bff"
          distort={0.35}
          speed={1.5}
          roughness={0.1}
          metalness={0.6}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  );
}

function RingAccent() {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime * 0.3;
      ringRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.3;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2.2, 0.04, 16, 80]} />
      <meshStandardMaterial color="#2dd4bf" transparent opacity={0.5} />
    </mesh>
  );
}

interface HeroCanvasProps {
  className?: string;
}

export default function HeroCanvas({ className }: HeroCanvasProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    // Static fallback: a simple gradient orb via CSS
    return (
      <div
        className={className}
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(58,155,255,0.3), transparent 70%)",
          borderRadius: "50%",
        }}
      />
    );
  }

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.4} color="#2dd4bf" />
        <Stars radius={40} depth={20} count={800} factor={2} fade speed={0.5} />
        <AnimatedOrb />
        <RingAccent />
      </Canvas>
    </div>
  );
}

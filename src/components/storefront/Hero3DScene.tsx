'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

// A wavy "fabric" element
function FabricElement({ position, color, scale, speed, distort, radius }: any) {
  return (
    <Float speed={speed} rotationIntensity={1.5} floatIntensity={2}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[radius, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          envMapIntensity={1}
          clearcoat={0.8}
          clearcoatRoughness={0}
          metalness={0.1}
          roughness={0.4}
          distort={distort}
          speed={speed * 2}
        />
      </mesh>
    </Float>
  );
}

// Embroidery pattern (TorusKnot)
function EmbroideryPattern({ position, scale }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusKnotGeometry args={[1, 0.3, 128, 32, 2, 3]} />
        <meshStandardMaterial
          color="#d4af37" // Gold color
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
}

// Scene Group that handles parallax
function SceneGroup() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Parallax effect based on mouse position
      const targetX = (state.pointer.x * Math.PI) / 10;
      const targetY = (state.pointer.y * Math.PI) / 10;
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Light effects & particles */}
      <Sparkles count={150} scale={15} size={2} speed={0.4} opacity={0.5} color="#ffd700" />
      <Sparkles count={50} scale={10} size={4} speed={0.2} opacity={0.3} color="#ffffff" />

      {/* Floating Fabrics */}
      {/* Ivory Fabric */}
      <FabricElement position={[-4, 2, -2]} color="#ffeedd" scale={1} speed={1.5} distort={0.4} radius={1.5} />
      {/* Soft Gold/Beige Fabric */}
      <FabricElement position={[4, -2, -3]} color="#eaddcd" scale={1.2} speed={1} distort={0.5} radius={2} />
      {/* Deep contrast element */}
      <FabricElement position={[2, 3, -4]} color="#b8977e" scale={0.8} speed={2} distort={0.3} radius={1} />

      {/* Embroidery Patterns (Gold Torus Knots) */}
      <EmbroideryPattern position={[-3, -1, 1]} scale={0.4} />
      <EmbroideryPattern position={[3, 1, 0]} scale={0.5} />
      <EmbroideryPattern position={[0, -2.5, -1]} scale={0.3} />
    </group>
  );
}

export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
      {/* pointer-events-auto is needed on the container so the canvas can receive mouse events for parallax, 
          but we must ensure it doesn't block the UI layer interactions by carefully layering. */}
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#d4af37" />
        
        {/* Adds realistic reflections */}
        <Environment preset="city" />
        
        <SceneGroup />
      </Canvas>
    </div>
  );
}

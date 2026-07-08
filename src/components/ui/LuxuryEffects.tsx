'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function LuxuryEffects() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate random particles
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10,
    }));
    setParticles(newParticles);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-transparent">
      {/* Aurora Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-aurora" style={{ background: 'radial-gradient(circle, rgba(196,116,138,0.4) 0%, transparent 70%)' }}></div>
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-aurora" style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.4) 0%, transparent 70%)', animationDelay: '-5s' }}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[150px] opacity-20 animate-aurora" style={{ background: 'radial-gradient(circle, rgba(242,168,190,0.4) 0%, transparent 70%)', animationDelay: '-10s' }}></div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: 'radial-gradient(circle, rgba(201,168,76,0.8) 0%, rgba(201,168,76,0) 100%)',
              boxShadow: '0 0 10px rgba(201,168,76,0.5)',
            }}
            animate={{
              y: [0, -100, -200],
              x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0.5],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Glass Overlay for texture */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
    </div>
  );
}

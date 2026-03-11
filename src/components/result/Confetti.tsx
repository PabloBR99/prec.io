"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface ConfettiProps {
  readonly visible: boolean;
}

const COLORS = ["#ffd700", "#e94560", "#0ead69", "#4dabf7", "#f4a261", "#ff6b9d"];
const PARTICLE_COUNT = 50;

interface Particle {
  readonly id: number;
  readonly x: number;
  readonly color: string;
  readonly size: number;
  readonly delay: number;
  readonly drift: number;
  readonly rotation: number;
  readonly shape: "rect" | "circle";
}

function createParticles(): readonly Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[i % COLORS.length],
    size: 4 + Math.random() * 6,
    delay: Math.random() * 0.8,
    drift: (Math.random() - 0.5) * 120,
    rotation: Math.random() * 720 - 360,
    shape: Math.random() > 0.5 ? "rect" : "circle",
  }));
}

export function Confetti({ visible }: ConfettiProps) {
  const particles = useMemo(createParticles, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, y: -20, x: `${p.x}vw`, rotate: 0, scale: 1 }}
          animate={{
            opacity: [1, 1, 0],
            y: "110vh",
            x: `calc(${p.x}vw + ${p.drift}px)`,
            rotate: p.rotation,
            scale: [1, 1.2, 0.8],
          }}
          transition={{
            duration: 2.5 + Math.random(),
            delay: p.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.shape === "rect" ? p.size * 1.5 : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : 2,
          }}
        />
      ))}
    </div>
  );
}

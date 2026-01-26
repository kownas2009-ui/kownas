import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: 'circle' | 'hexagon' | 'diamond';
}

const ParticleField = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    const types: Particle['type'][] = ['circle', 'hexagon', 'diamond'];
    
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 6,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 10,
        type: types[Math.floor(Math.random() * types.length)],
      });
    }
    setParticles(newParticles);
  }, []);

  const getParticleShape = (type: Particle['type'], size: number) => {
    switch (type) {
      case 'hexagon':
        return {
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          width: size,
          height: size,
        };
      case 'diamond':
        return {
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          width: size * 0.8,
          height: size,
        };
      default:
        return {
          borderRadius: '50%',
          width: size,
          height: size,
        };
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: particle.id % 3 === 0 
              ? 'hsl(var(--primary) / 0.3)'
              : particle.id % 3 === 1
              ? 'hsl(var(--secondary) / 0.25)'
              : 'hsl(var(--muted-foreground) / 0.15)',
            ...getParticleShape(particle.type, particle.size),
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            opacity: [0.2, 0.6, 0.3, 0.2],
            rotate: [0, 180, 360],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Connecting lines between some particles */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {particles.slice(0, 15).map((p1, i) => 
          particles.slice(i + 1, i + 3).map((p2, j) => (
            <motion.line
              key={`line-${i}-${j}`}
              x1={`${p1.x}%`}
              y1={`${p1.y}%`}
              x2={`${p2.x}%`}
              y2={`${p2.y}%`}
              stroke="url(#lineGradient)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))
        )}
      </svg>
    </div>
  );
};

export default ParticleField;

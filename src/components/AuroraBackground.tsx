import { motion } from "framer-motion";

const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Aurora Borealis Effect */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-1/4 w-[800px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, 50, -30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-[600px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, hsl(var(--secondary) / 0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, -80, 60, 0],
            y: [0, -40, 20, 0],
            scale: [1, 0.8, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-[700px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, hsl(168 60% 50% / 0.1) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
          animate={{
            x: [0, 60, -80, 0],
            y: [0, -60, 40, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      {/* Mesh gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          background: `
            radial-gradient(at 40% 20%, hsl(var(--primary) / 0.1) 0px, transparent 50%),
            radial-gradient(at 80% 0%, hsl(var(--secondary) / 0.08) 0px, transparent 50%),
            radial-gradient(at 0% 50%, hsl(168 55% 45% / 0.08) 0px, transparent 50%),
            radial-gradient(at 80% 50%, hsl(35 80% 50% / 0.06) 0px, transparent 50%),
            radial-gradient(at 0% 100%, hsl(var(--primary) / 0.06) 0px, transparent 50%),
            radial-gradient(at 80% 100%, hsl(var(--secondary) / 0.05) 0px, transparent 50%)
          `,
        }}
      />

      {/* Animated light rays */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full"
        style={{
          background: "linear-gradient(to bottom, hsl(var(--primary) / 0.05), transparent 30%, transparent 70%, hsl(var(--primary) / 0.02))",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scaleX: [1, 2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating sparkles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-primary/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default AuroraBackground;

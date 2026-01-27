import { motion } from "framer-motion";

// Cosmic star field background
export const CosmicStarField = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {/* Distant stars */}
    {[...Array(100)].map((_, i) => (
      <motion.div
        key={`star-${i}`}
        className="absolute rounded-full bg-white"
        style={{
          width: Math.random() * 2 + 1,
          height: Math.random() * 2 + 1,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 2 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
    
    {/* Nebula clouds */}
    <motion.div 
      className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20"
      style={{
        background: "radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)",
      }}
      animate={{
        x: ["-20%", "10%", "-20%"],
        y: ["-10%", "20%", "-10%"],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.div 
      className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[100px] opacity-15"
      style={{
        background: "radial-gradient(circle, hsl(var(--secondary) / 0.5) 0%, transparent 70%)",
      }}
      animate={{
        x: ["20%", "-10%", "20%"],
        y: ["10%", "-20%", "10%"],
        scale: [1.1, 0.9, 1.1],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    
    {/* Shooting stars */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={`shooting-${i}`}
        className="absolute h-[2px] bg-gradient-to-r from-white via-white to-transparent"
        style={{
          width: 100 + Math.random() * 100,
          top: `${20 + Math.random() * 40}%`,
          left: "-10%",
          transform: "rotate(-35deg)",
        }}
        animate={{
          x: ["0vw", "120vw"],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 1.5 + Math.random(),
          repeat: Infinity,
          delay: i * 8 + Math.random() * 5,
          repeatDelay: 10 + Math.random() * 10,
        }}
      />
    ))}
  </div>
);

// Glowing orbs with cosmic effect
export const CosmicOrbs = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {/* Primary cosmic orb */}
    <motion.div
      className="absolute top-1/4 -left-32 w-96 h-96 rounded-full"
      style={{
        background: "radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.1) 50%, transparent 70%)",
        filter: "blur(40px)",
      }}
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 50, 0],
        y: [0, 30, 0],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    
    {/* Secondary cosmic orb */}
    <motion.div
      className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full"
      style={{
        background: "radial-gradient(circle at 70% 70%, hsl(var(--secondary) / 0.35), hsl(var(--secondary) / 0.1) 50%, transparent 70%)",
        filter: "blur(50px)",
      }}
      animate={{
        scale: [1.1, 0.9, 1.1],
        x: [0, -40, 0],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2,
      }}
    />
    
    {/* Accent orb */}
    <motion.div
      className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full -translate-x-1/2 -translate-y-1/2"
      style={{
        background: "radial-gradient(circle, hsl(280 60% 60% / 0.15), transparent 60%)",
        filter: "blur(60px)",
      }}
      animate={{
        scale: [0.8, 1.3, 0.8],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </div>
);

// Aurora effect
export const AuroraEffect = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <motion.div
      className="absolute inset-0"
      style={{
        background: `
          linear-gradient(
            45deg,
            transparent 0%,
            hsl(var(--primary) / 0.03) 25%,
            hsl(var(--secondary) / 0.05) 50%,
            hsl(280 60% 60% / 0.03) 75%,
            transparent 100%
          )
        `,
        backgroundSize: "400% 400%",
      }}
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    
    {/* Aurora waves */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={`aurora-${i}`}
        className="absolute left-0 right-0 h-32"
        style={{
          top: `${20 + i * 25}%`,
          background: `linear-gradient(90deg, 
            transparent 0%, 
            hsl(var(--primary) / ${0.05 - i * 0.01}) 20%, 
            hsl(var(--secondary) / ${0.08 - i * 0.02}) 50%, 
            hsl(var(--primary) / ${0.05 - i * 0.01}) 80%, 
            transparent 100%
          )`,
          filter: "blur(30px)",
        }}
        animate={{
          x: [-100, 100, -100],
          opacity: [0.3, 0.6, 0.3],
          scaleY: [1, 1.5, 1],
        }}
        transition={{
          duration: 8 + i * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 1.5,
        }}
      />
    ))}
  </div>
);

// Cosmic particles with chemistry theme
export const CosmicChemistryParticles = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {/* Floating atoms */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={`atom-${i}`}
        className="absolute"
        style={{
          left: `${10 + Math.random() * 80}%`,
          top: `${10 + Math.random() * 80}%`,
        }}
        animate={{
          y: [0, -40, 0],
          x: [0, Math.sin(i) * 30, 0],
          rotate: [0, 360],
          opacity: [0.1, 0.4, 0.1],
        }}
        transition={{
          duration: 12 + Math.random() * 8,
          repeat: Infinity,
          delay: i * 0.8,
        }}
      >
        <svg width={40 + Math.random() * 30} height={40 + Math.random() * 30} viewBox="0 0 60 60">
          {/* Nucleus */}
          <motion.circle 
            cx="30" 
            cy="30" 
            r="8" 
            className="fill-primary/20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Electron orbits */}
          <ellipse cx="30" cy="30" rx="25" ry="10" className="stroke-primary/10 fill-none" strokeWidth="1" />
          <ellipse cx="30" cy="30" rx="25" ry="10" className="stroke-secondary/10 fill-none" strokeWidth="1" transform="rotate(60 30 30)" />
          <ellipse cx="30" cy="30" rx="25" ry="10" className="stroke-primary/10 fill-none" strokeWidth="1" transform="rotate(120 30 30)" />
          {/* Electrons */}
          <motion.circle
            cx="55"
            cy="30"
            r="3"
            className="fill-secondary/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "30px 30px" }}
          />
        </svg>
      </motion.div>
    ))}
    
    {/* Floating formulas */}
    {["H₂O", "NaCl", "CO₂", "C₆H₁₂O₆", "NH₃"].map((formula, i) => (
      <motion.span
        key={formula}
        className="absolute font-mono text-primary/10 text-lg font-bold"
        style={{
          left: `${15 + i * 18}%`,
          top: `${70 + (i % 2) * 15}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.05, 0.2, 0.05],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 10 + i * 2,
          repeat: Infinity,
          delay: i * 1.5,
        }}
      >
        {formula}
      </motion.span>
    ))}
    
    {/* Glowing particles */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={`particle-${i}`}
        className="absolute rounded-full"
        style={{
          width: 4 + Math.random() * 6,
          height: 4 + Math.random() * 6,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: i % 2 === 0 
            ? "hsl(var(--primary) / 0.3)" 
            : "hsl(var(--secondary) / 0.3)",
          boxShadow: i % 2 === 0
            ? "0 0 10px hsl(var(--primary) / 0.5), 0 0 20px hsl(var(--primary) / 0.3)"
            : "0 0 10px hsl(var(--secondary) / 0.5), 0 0 20px hsl(var(--secondary) / 0.3)",
        }}
        animate={{
          y: [0, -100 - Math.random() * 100, 0],
          x: [0, (Math.random() - 0.5) * 50, 0],
          opacity: [0, 0.8, 0],
          scale: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 6 + Math.random() * 6,
          repeat: Infinity,
          delay: Math.random() * 5,
        }}
      />
    ))}
  </div>
);

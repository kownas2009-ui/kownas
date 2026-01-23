import { motion } from "framer-motion";

// Animated floating atom
export const FloatingAtom = ({ 
  className = "", 
  delay = 0,
  size = 40
}: { 
  className?: string; 
  delay?: number;
  size?: number;
}) => {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.1, 1],
        y: [0, -20, 0],
        rotate: [0, 360]
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Nucleus */}
        <motion.circle
          cx="50"
          cy="50"
          r="12"
          className="fill-primary/60"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Electron orbits */}
        <ellipse 
          cx="50" 
          cy="50" 
          rx="35" 
          ry="12" 
          className="stroke-secondary/40"
          strokeWidth="1.5"
          fill="none"
        />
        <ellipse 
          cx="50" 
          cy="50" 
          rx="35" 
          ry="12" 
          className="stroke-primary/30"
          strokeWidth="1.5"
          fill="none"
          transform="rotate(60 50 50)"
        />
        <ellipse 
          cx="50" 
          cy="50" 
          rx="35" 
          ry="12" 
          className="stroke-secondary/30"
          strokeWidth="1.5"
          fill="none"
          transform="rotate(-60 50 50)"
        />
        
        {/* Electrons */}
        <motion.circle
          cx="85"
          cy="50"
          r="5"
          className="fill-secondary"
          animate={{ 
            offsetDistance: ["0%", "100%"],
            cx: [85, 15, 85],
            cy: [50, 50, 50]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </motion.div>
  );
};

// Bubbling beaker effect
export const BubblingBeaker = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <svg width="80" height="100" viewBox="0 0 80 100" fill="none">
        {/* Beaker */}
        <path
          d="M20 20 L20 70 Q20 85 40 85 Q60 85 60 70 L60 20"
          className="stroke-primary/50"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M15 20 L65 20"
          className="stroke-primary/50"
          strokeWidth="3"
        />
        
        {/* Liquid */}
        <motion.path
          d="M22 55 Q30 50 40 55 Q50 60 58 55 L58 70 Q58 82 40 82 Q22 82 22 70 Z"
          className="fill-primary/30"
          animate={{
            d: [
              "M22 55 Q30 50 40 55 Q50 60 58 55 L58 70 Q58 82 40 82 Q22 82 22 70 Z",
              "M22 55 Q30 60 40 55 Q50 50 58 55 L58 70 Q58 82 40 82 Q22 82 22 70 Z",
              "M22 55 Q30 50 40 55 Q50 60 58 55 L58 70 Q58 82 40 82 Q22 82 22 70 Z"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Bubbles */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={30 + i * 10}
            cy={70}
            r={3}
            className="fill-secondary/60"
            animate={{
              cy: [70, 40, 30],
              opacity: [1, 0.5, 0],
              scale: [1, 1.5, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        ))}
      </svg>
    </div>
  );
};

// DNA Helix animation
export const DNAHelix = ({ className = "" }: { className?: string }) => {
  return (
    <motion.div 
      className={className}
      animate={{ rotateY: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    >
      <svg width="60" height="120" viewBox="0 0 60 120" fill="none">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <motion.circle
              cx={15 + Math.sin(i * 0.8) * 15}
              cy={10 + i * 20}
              r="6"
              className="fill-primary/50"
              animate={{
                cx: [15 + Math.sin(i * 0.8) * 15, 45 - Math.sin(i * 0.8) * 15, 15 + Math.sin(i * 0.8) * 15]
              }}
              transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
            />
            <motion.circle
              cx={45 - Math.sin(i * 0.8) * 15}
              cy={10 + i * 20}
              r="6"
              className="fill-secondary/50"
              animate={{
                cx: [45 - Math.sin(i * 0.8) * 15, 15 + Math.sin(i * 0.8) * 15, 45 - Math.sin(i * 0.8) * 15]
              }}
              transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
            />
            <motion.line
              x1={15 + Math.sin(i * 0.8) * 15}
              y1={10 + i * 20}
              x2={45 - Math.sin(i * 0.8) * 15}
              y2={10 + i * 20}
              className="stroke-muted-foreground/30"
              strokeWidth="2"
              animate={{
                x1: [15 + Math.sin(i * 0.8) * 15, 45 - Math.sin(i * 0.8) * 15],
                x2: [45 - Math.sin(i * 0.8) * 15, 15 + Math.sin(i * 0.8) * 15]
              }}
              transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
            />
          </g>
        ))}
      </svg>
    </motion.div>
  );
};

// Animated molecule structure
export const AnimatedMolecule = ({ className = "" }: { className?: string }) => {
  return (
    <motion.svg
      className={className}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      initial={{ opacity: 0, rotate: -180 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Central atom */}
      <motion.circle
        cx="60"
        cy="60"
        r="15"
        className="fill-primary/40"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Bonds and outer atoms */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 60 + Math.cos(rad) * 40;
        const y = 60 + Math.sin(rad) * 40;
        return (
          <g key={i}>
            <motion.line
              x1="60"
              y1="60"
              x2={x}
              y2={y}
              className="stroke-primary/30"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            />
            <motion.circle
              cx={x}
              cy={y}
              r="10"
              className={i % 2 === 0 ? "fill-secondary/50" : "fill-primary/30"}
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            />
          </g>
        );
      })}
    </motion.svg>
  );
};

// Particle explosion effect for buttons
export const ParticleExplosion = ({ isActive }: { isActive: boolean }) => {
  if (!isActive) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-secondary"
          style={{
            left: "50%",
            top: "50%",
          }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: Math.cos((i * 30 * Math.PI) / 180) * 60,
            y: Math.sin((i * 30 * Math.PI) / 180) * 60,
            opacity: 0,
            scale: [1, 0]
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

// Periodic table element badge
export const ElementBadge = ({ 
  symbol, 
  number, 
  className = "" 
}: { 
  symbol: string; 
  number: number;
  className?: string;
}) => {
  return (
    <motion.div
      className={`relative w-16 h-20 rounded-lg border-2 border-primary/30 bg-card flex flex-col items-center justify-center ${className}`}
      whileHover={{ scale: 1.1, borderColor: "hsl(var(--primary))" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <span className="absolute top-1 left-2 text-xs text-muted-foreground">{number}</span>
      <span className="text-2xl font-bold text-primary">{symbol}</span>
    </motion.div>
  );
};

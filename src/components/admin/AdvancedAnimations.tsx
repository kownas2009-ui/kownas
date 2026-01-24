import { motion } from "framer-motion";

// DNA Helix Animation
export const DNAHelixAdmin = () => (
  <motion.div className="absolute right-0 top-1/4 w-24 opacity-20 pointer-events-none">
    <svg viewBox="0 0 100 400" className="w-full">
      {[...Array(20)].map((_, i) => (
        <motion.g key={i}>
          <motion.circle
            cx="20"
            cy={i * 20 + 10}
            r="6"
            className="fill-primary"
            animate={{
              cx: [20, 80, 20],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3,
              delay: i * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            cx="80"
            cy={i * 20 + 10}
            r="6"
            className="fill-secondary"
            animate={{
              cx: [80, 20, 80],
              opacity: [1, 0.3, 1],
            }}
            transition={{
              duration: 3,
              delay: i * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.line
            x1="20"
            y1={i * 20 + 10}
            x2="80"
            y2={i * 20 + 10}
            className="stroke-primary/30"
            strokeWidth="2"
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              delay: i * 0.15,
              repeat: Infinity,
            }}
          />
        </motion.g>
      ))}
    </svg>
  </motion.div>
);

// Periodic Table Element
export const PeriodicElement = ({ symbol, number, name, color }: {
  symbol: string;
  number: number;
  name: string;
  color: string;
}) => (
  <motion.div
    className={`w-20 h-24 rounded-xl ${color} flex flex-col items-center justify-center text-white shadow-lg`}
    whileHover={{ scale: 1.1, rotateY: 15 }}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring" }}
  >
    <span className="text-xs opacity-70">{number}</span>
    <span className="text-2xl font-bold">{symbol}</span>
    <span className="text-[10px] opacity-70">{name}</span>
  </motion.div>
);

// Electron Cloud Animation
export const ElectronCloud = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-3 h-3 rounded-full bg-primary/30"
        style={{
          left: "50%",
          top: "50%",
        }}
        animate={{
          x: [
            Math.cos(i * 60 * Math.PI / 180) * 100,
            Math.cos((i * 60 + 180) * Math.PI / 180) * 100,
            Math.cos(i * 60 * Math.PI / 180) * 100,
          ],
          y: [
            Math.sin(i * 60 * Math.PI / 180) * 50,
            Math.sin((i * 60 + 180) * Math.PI / 180) * 50,
            Math.sin(i * 60 * Math.PI / 180) * 50,
          ],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 4,
          delay: i * 0.3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
    <motion.div
      className="absolute w-8 h-8 rounded-full bg-secondary/20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </div>
);

// Bubbling Flask Animation
export const BubblingFlask = () => (
  <motion.div 
    className="absolute left-4 bottom-4 w-32 h-48 opacity-20 pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.2 }}
  >
    <svg viewBox="0 0 100 150" className="w-full h-full">
      {/* Flask shape */}
      <motion.path
        d="M30 0 L30 50 L10 120 Q10 145 50 145 Q90 145 90 120 L70 50 L70 0 Z"
        className="fill-primary/10 stroke-primary/30"
        strokeWidth="2"
      />
      
      {/* Liquid */}
      <motion.ellipse
        cx={50}
        cy={110}
        rx={35}
        ry={10}
        className="fill-primary/30"
        animate={{ 
          ry: [10, 12, 10],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      
      {/* Bubbles - fixed positions */}
      {[30, 40, 50, 60, 70, 35, 55, 65].map((x, i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={120}
          r={2 + (i % 3)}
          className="fill-primary/40"
          animate={{
            cy: [120, 60, 40],
            opacity: [1, 0.5, 0],
          }}
          transition={{
            duration: 2 + (i * 0.2),
            delay: i * 0.3,
            repeat: Infinity,
          }}
        />
      ))}
    </svg>
  </motion.div>
);

// Reaction Animation (for status changes)
export const ReactionBurst = ({ isActive }: { isActive: boolean }) => (
  <motion.div
    className="absolute inset-0 pointer-events-none"
    initial={false}
    animate={isActive ? { opacity: [0, 1, 0] } : { opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-primary left-1/2 top-1/2"
        animate={isActive ? {
          x: Math.cos(i * 30 * Math.PI / 180) * 50,
          y: Math.sin(i * 30 * Math.PI / 180) * 50,
          opacity: [1, 0],
          scale: [1, 0],
        } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    ))}
  </motion.div>
);

// Floating Formulas
export const FloatingFormulas = () => {
  const formulas = ["H₂O", "CO₂", "NaCl", "H₂SO₄", "CH₄", "C₂H₅OH", "NH₃", "HCl"];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {formulas.map((formula, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/10 font-mono text-2xl font-bold"
          style={{
            left: `${10 + (i * 12) % 80}%`,
            top: `${20 + (i * 15) % 60}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.05, 0.15, 0.05],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          {formula}
        </motion.div>
      ))}
    </div>
  );
};

// Atom Orbital Rings
export const AtomOrbitalRings = ({ className }: { className?: string }) => (
  <motion.div className={`relative w-24 h-24 ${className}`}>
    {/* Nucleus */}
    <motion.div
      className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    
    {/* Orbital rings */}
    {[0, 60, 120].map((rotation, i) => (
      <motion.div
        key={i}
        className="absolute inset-0"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <motion.div
          className="absolute w-full h-full border-2 border-primary/30 rounded-full"
          style={{ transform: "rotateX(70deg)" }}
        />
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-primary left-1/2 -translate-x-1/2"
          animate={{
            top: ["0%", "100%", "0%"],
            left: ["50%", "50%", "50%"],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    ))}
  </motion.div>
);

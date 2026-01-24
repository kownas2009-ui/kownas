import { useState, ReactNode, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChemistryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "beaker" | "atom";
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

// Molecule structure for button decoration
const MoleculeStructure = ({ isHovered }: { isHovered: boolean }) => (
  <motion.svg
    className="absolute -right-3 -top-3 w-12 h-12 pointer-events-none"
    viewBox="0 0 48 48"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ 
      opacity: isHovered ? 1 : 0, 
      scale: isHovered ? 1 : 0.5,
      rotate: isHovered ? 360 : 0
    }}
    transition={{ duration: 0.5 }}
  >
    <motion.circle cx="24" cy="24" r="6" className="fill-secondary/80" />
    <motion.circle cx="12" cy="16" r="4" className="fill-primary/60" />
    <motion.circle cx="36" cy="16" r="4" className="fill-primary/60" />
    <motion.circle cx="24" cy="40" r="4" className="fill-secondary/60" />
    <motion.line x1="24" y1="24" x2="12" y2="16" className="stroke-primary/40" strokeWidth="2" />
    <motion.line x1="24" y1="24" x2="36" y2="16" className="stroke-primary/40" strokeWidth="2" />
    <motion.line x1="24" y1="24" x2="24" y2="40" className="stroke-secondary/40" strokeWidth="2" />
  </motion.svg>
);

// Beaker bubbles animation
const BeakerBubbles = ({ isHovered }: { isHovered: boolean }) => {
  const bubbles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 80,
    delay: i * 0.15,
    size: 4 + Math.random() * 4,
    duration: 0.8 + Math.random() * 0.4
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
      {isHovered && bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-gradient-to-br from-secondary/60 to-primary/40"
          style={{
            left: `${bubble.left}%`,
            bottom: 0,
            width: bubble.size,
            height: bubble.size,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: -60,
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1.2, 0.8],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

// Atom orbital animation
const AtomOrbital = ({ isHovered }: { isHovered: boolean }) => (
  <motion.div
    className="absolute inset-0 pointer-events-none"
    animate={{ rotate: isHovered ? 360 : 0 }}
    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
  >
    <motion.div
      className="absolute w-full h-full"
      style={{ opacity: isHovered ? 1 : 0 }}
    >
      {/* Orbital paths */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <ellipse
          cx="50" cy="50" rx="45" ry="15"
          className="stroke-primary/20"
          strokeWidth="1"
          fill="none"
        />
        <ellipse
          cx="50" cy="50" rx="45" ry="15"
          className="stroke-secondary/20"
          strokeWidth="1"
          fill="none"
          transform="rotate(60 50 50)"
        />
        <ellipse
          cx="50" cy="50" rx="45" ry="15"
          className="stroke-primary/20"
          strokeWidth="1"
          fill="none"
          transform="rotate(-60 50 50)"
        />
      </svg>
      
      {/* Electrons */}
      {[0, 120, 240].map((angle, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-secondary"
          style={{
            left: "50%",
            top: "50%",
            transform: `rotate(${angle}deg) translateX(35px)`,
          }}
          animate={{
            rotate: [angle, angle + 360],
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </motion.div>
  </motion.div>
);

// Chemical reaction flash
const ReactionFlash = ({ isPressed }: { isPressed: boolean }) => (
  <>
    {isPressed && (
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-secondary/40 to-transparent" />
        
        {/* Sparks */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-secondary"
            style={{
              left: "50%",
              top: "50%",
            }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos((i * 30 * Math.PI) / 180) * 50,
              y: Math.sin((i * 30 * Math.PI) / 180) * 50,
              opacity: 0,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        ))}
      </motion.div>
    )}
  </>
);

const ChemistryButton = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button"
}: ChemistryButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = useCallback(() => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 400);
  }, []);

  const baseStyles = "relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl overflow-hidden transition-all duration-300";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25",
    secondary: "bg-secondary text-secondary-foreground hover:shadow-lg hover:shadow-secondary/25",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary/10",
    beaker: "bg-gradient-to-b from-primary to-primary/80 text-primary-foreground",
    atom: "bg-gradient-to-br from-primary via-primary/90 to-secondary/50 text-primary-foreground",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={(e) => {
        handlePress();
        onClick?.();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      className={cn(baseStyles, variants[variant], sizes[size], className, {
        "opacity-50 cursor-not-allowed": disabled
      })}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Liquid wave effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-white/10 to-transparent"
        initial={{ y: "100%" }}
        animate={{ y: isHovered ? "60%" : "100%" }}
        transition={{ duration: 0.4 }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "100%" : "-100%" }}
        transition={{ duration: 0.6 }}
      />

      {/* Variant-specific effects */}
      {(variant === "beaker" || variant === "primary") && <BeakerBubbles isHovered={isHovered} />}
      {variant === "atom" && <AtomOrbital isHovered={isHovered} />}
      {variant === "secondary" && <MoleculeStructure isHovered={isHovered} />}
      
      <ReactionFlash isPressed={isPressed} />

      {/* Content */}
      <motion.span 
        className="relative z-10 flex items-center gap-2"
        animate={{ y: isHovered ? -1 : 0 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

export default ChemistryButton;

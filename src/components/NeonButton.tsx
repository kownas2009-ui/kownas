import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "glow" | "cyan" | "pink" | "emerald" | "amber";
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const NeonButton = ({
  children,
  onClick,
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
}: NeonButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const variantStyles = {
    primary: "bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-foreground",
    secondary: "bg-gradient-to-r from-secondary via-secondary/90 to-primary text-secondary-foreground",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10",
    glow: "bg-gradient-to-r from-primary/80 via-secondary/80 to-primary/80 text-primary-foreground",
    cyan: "bg-gradient-to-r from-cyan-500 via-cyan-400 to-teal-500 text-white",
    pink: "bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 text-white",
    emerald: "bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500 text-white",
    amber: "bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-500 text-white",
  };
  
  const variantGlowColors: Record<string, string> = {
    primary: "hsl(var(--primary))",
    secondary: "hsl(var(--secondary))",
    outline: "hsl(var(--primary))",
    glow: "hsl(var(--primary))",
    cyan: "rgb(6, 182, 212)",
    pink: "rgb(236, 72, 153)",
    emerald: "rgb(16, 185, 129)",
    amber: "rgb(245, 158, 11)",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={cn(
        "relative overflow-hidden rounded-xl font-semibold transition-all duration-300",
        sizeStyles[size],
        variantStyles[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      style={{
        boxShadow: isHovered
          ? `0 0 20px ${variantGlowColors[variant] || variantGlowColors.primary}80, 0 0 40px ${variantGlowColors[variant] || variantGlowColors.primary}50, 0 0 60px ${variantGlowColors[variant] || variantGlowColors.primary}30`
          : `0 4px 15px ${variantGlowColors[variant] || variantGlowColors.primary}33`,
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: "linear-gradient(45deg, transparent, hsl(var(--secondary) / 0.3), transparent)",
        }}
        animate={{
          opacity: isHovered ? [0, 0.5, 0] : 0,
          x: isHovered ? ["-100%", "100%"] : "-100%",
        }}
        transition={{
          duration: 0.8,
          repeat: isHovered ? Infinity : 0,
          repeatDelay: 0.5,
        }}
      />

      {/* Neon border effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          border: "2px solid transparent",
          background: isHovered
            ? "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--primary))) border-box"
            : "transparent",
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Particle effects on hover */}
      {isHovered && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-secondary"
              style={{
                left: `${20 + i * 12}%`,
                bottom: 0,
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y: [-5, -25, -40],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.3],
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                repeat: Infinity,
              }}
            />
          ))}
        </>
      )}

      {/* Ripple effect on click */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white/30 rounded-xl"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Atom decorations */}
      <motion.div
        className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0"
        animate={{
          opacity: isHovered ? 0.6 : 0,
          rotate: isHovered ? 360 : 0,
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 16 16" className="w-full h-full">
          <circle cx="8" cy="8" r="2" fill="hsl(var(--secondary))" />
          <ellipse cx="8" cy="8" rx="6" ry="3" fill="none" stroke="hsl(var(--secondary))" strokeWidth="0.5" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0"
        animate={{
          opacity: isHovered ? 0.6 : 0,
          rotate: isHovered ? -360 : 0,
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 16 16" className="w-full h-full">
          <circle cx="8" cy="8" r="2" fill="hsl(var(--primary))" />
          <ellipse cx="8" cy="8" rx="6" ry="3" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" transform="rotate(60 8 8)" />
        </svg>
      </motion.div>

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default NeonButton;

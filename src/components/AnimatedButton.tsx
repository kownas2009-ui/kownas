import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const AnimatedButton = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button"
}: AnimatedButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const baseStyles = "relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl overflow-hidden transition-all duration-300";
  
  const variants = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground"
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
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={cn(baseStyles, variants[variant], sizes[size], className, {
        "opacity-50 cursor-not-allowed": disabled
      })}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "100%" : "-100%" }}
        transition={{ duration: 0.5 }}
      />

      {/* Ripple effect on press */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white/30 rounded-xl"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Particle bubbles on hover */}
      {isHovered && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-white/40"
              initial={{ 
                x: 0, 
                y: 0,
                opacity: 0 
              }}
              animate={{ 
                x: (Math.random() - 0.5) * 100,
                y: -30 - Math.random() * 30,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 0.8,
                delay: i * 0.1,
                repeat: Infinity
              }}
              style={{
                left: `${20 + i * 12}%`,
                bottom: "10%"
              }}
            />
          ))}
        </>
      )}

      {/* Atom orbital effect */}
      {isHovered && (
        <motion.div
          className="absolute -right-2 -top-2 w-8 h-8"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="3" className="fill-white/60" />
            <ellipse 
              cx="16" cy="16" rx="12" ry="4" 
              className="stroke-white/30" 
              strokeWidth="1" 
              fill="none"
            />
          </svg>
        </motion.div>
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default AnimatedButton;

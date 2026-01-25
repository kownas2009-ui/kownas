import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Sparkles } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-3 rounded-2xl bg-gradient-to-br from-card to-muted border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group shadow-soft hover:shadow-glow"
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      {/* Radial glow on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.4 }}
      />
      
      {/* Chemical reaction effect during toggle */}
      <AnimatePresence>
        {isAnimating && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: isDark 
                    ? "hsl(var(--secondary))" 
                    : "hsl(var(--primary))",
                  left: "50%",
                  top: "50%",
                }}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 30) * Math.PI / 180) * 30,
                  y: Math.sin((i * 30) * Math.PI / 180) * 30,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: i * 0.02 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
      
      {/* Bubbles on hover */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-secondary/60"
            style={{
              left: `${15 + i * 14}%`,
              bottom: 0,
            }}
            initial={{ y: 0, opacity: 0 }}
            whileHover={{
              y: -25,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.8,
              delay: i * 0.08,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            className="relative"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
          >
            <Moon className="w-5 h-5 text-secondary drop-shadow-[0_0_8px_hsl(var(--secondary))]" />
            {/* Stars around moon */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: `${-5 + i * 8}px`,
                  right: `${-8 + i * 4}px`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.3,
                  repeat: Infinity,
                }}
              >
                <Sparkles className="w-2 h-2 text-secondary/70" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            className="relative"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
          >
            <Sun className="w-5 h-5 text-secondary drop-shadow-[0_0_8px_hsl(var(--secondary))]" />
            {/* Sun rays */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-2 bg-secondary/40 rounded-full"
                  style={{
                    transform: `rotate(${i * 45}deg) translateY(-12px)`,
                  }}
                  animate={{
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.1,
                    repeat: Infinity,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orbital electron */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className="absolute w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary))]"
          style={{ top: "5%", left: "50%" }}
        />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
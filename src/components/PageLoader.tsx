import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const interval = 30;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => setIsLoading(false), 200);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            {/* Animated molecule/atom */}
            <motion.div className="relative w-32 h-32 mx-auto mb-8">
              {/* Nucleus */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-8 h-8 -mt-4 -ml-4 rounded-full bg-gradient-to-br from-primary to-secondary"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
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
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute w-4 h-4 rounded-full bg-primary shadow-lg"
                    style={{
                      top: "50%",
                      left: "50%",
                      marginTop: -8,
                      marginLeft: -8,
                    }}
                    animate={{
                      x: [0, 50, 0, -50, 0],
                      y: [50, 0, -50, 0, 50].map((v) => v * 0.4),
                    }}
                    transition={{
                      duration: 2 + i * 0.3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Logo text */}
            <motion.h1
              className="font-display text-3xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gradient">Chemia</span> z Anetą
            </motion.h1>

            {/* Progress bar */}
            <motion.div
              className="w-48 h-1 bg-muted rounded-full mx-auto overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
            </motion.div>

            {/* Loading text */}
            <motion.p
              className="mt-4 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Przygotowuję reakcję...
            </motion.p>

            {/* Floating formulas */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {["H₂O", "CO₂", "NaCl", "O₂", "C₆H₁₂O₆"].map((formula, i) => (
                <motion.div
                  key={i}
                  className="absolute text-primary/10 font-mono text-xl font-bold"
                  style={{
                    left: `${10 + i * 20}%`,
                    top: `${20 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.05, 0.15, 0.05],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  {formula}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;

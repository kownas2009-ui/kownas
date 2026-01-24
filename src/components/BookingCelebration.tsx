import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, Check } from "lucide-react";

interface BookingCelebrationProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const BookingCelebration = ({ isVisible, onComplete }: BookingCelebrationProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 60,
        y: 50 + (Math.random() - 0.5) * 60,
        color: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))",
      }));
      setParticles(newParticles);

      // Complete after animation
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Subtle overlay */}
          <motion.div
            className="absolute inset-0 bg-background/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Success icon */}
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 0 0 hsl(var(--primary) / 0.4)",
                  "0 0 0 20px hsl(var(--primary) / 0)",
                ],
              }}
              transition={{ duration: 1, repeat: 2 }}
            >
              <Check className="w-10 h-10 text-primary-foreground" />
            </motion.div>

            {/* Sparkle */}
            <motion.div
              className="absolute -top-2 -right-2"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: [0, 1, 0], rotate: 360 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            >
              <Sparkles className="w-6 h-6 text-secondary" />
            </motion.div>
          </motion.div>

          {/* Particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: "50%",
                top: "50%",
                background: particle.color,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: (particle.x - 50) * 4,
                y: (particle.y - 50) * 4,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            />
          ))}

          {/* Text */}
          <motion.p
            className="absolute mt-32 text-lg font-display font-semibold text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            Zarezerwowano! 🎉
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingCelebration;
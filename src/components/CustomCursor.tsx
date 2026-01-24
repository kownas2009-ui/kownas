import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  type: "atom" | "bubble" | "electron" | "molecule";
}

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const getRandomType = useCallback((): TrailPoint["type"] => {
    const types: TrailPoint["type"][] = ["atom", "bubble", "electron", "molecule"];
    return types[Math.floor(Math.random() * types.length)];
  }, []);

  useEffect(() => {
    let frameId: number;
    let lastAddTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const now = Date.now();
      if (now - lastAddTime > 50) {
        lastAddTime = now;
        setTrail((prev) => {
          const newPoint: TrailPoint = {
            id: now,
            x: e.clientX,
            y: e.clientY,
            type: getRandomType(),
          };
          return [...prev.slice(-12), newPoint];
        });
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Cleanup trail periodically
    const cleanupInterval = setInterval(() => {
      setTrail((prev) => prev.filter((p) => Date.now() - p.id < 800));
    }, 100);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      clearInterval(cleanupInterval);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [getRandomType]);

  const renderTrailElement = (point: TrailPoint, index: number) => {
    const age = (Date.now() - point.id) / 800;
    const opacity = Math.max(0, 1 - age);
    const scale = 0.5 + (1 - age) * 0.5;

    switch (point.type) {
      case "atom":
        return (
          <motion.div
            key={point.id}
            className="fixed pointer-events-none z-[9998]"
            style={{ left: point.x - 8, top: point.y - 8 }}
            initial={{ opacity: 0.8, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.5, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="3" fill="hsl(var(--primary))" opacity={opacity} />
              <ellipse
                cx="8"
                cy="8"
                rx="7"
                ry="3"
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth="1"
                opacity={opacity * 0.6}
              />
            </svg>
          </motion.div>
        );
      case "bubble":
        return (
          <motion.div
            key={point.id}
            className="fixed pointer-events-none z-[9998] rounded-full"
            style={{
              left: point.x - 6,
              top: point.y - 6,
              width: 12 * scale,
              height: 12 * scale,
              background: `radial-gradient(circle at 30% 30%, hsl(var(--primary) / ${opacity * 0.8}), hsl(var(--secondary) / ${opacity * 0.4}))`,
              boxShadow: `0 0 ${10 * opacity}px hsl(var(--primary) / 0.5)`,
            }}
            initial={{ opacity: 0.8, scale: 0.3, y: 0 }}
            animate={{ opacity: 0, scale: 1.2, y: -20 }}
            transition={{ duration: 0.8 }}
          />
        );
      case "electron":
        return (
          <motion.div
            key={point.id}
            className="fixed pointer-events-none z-[9998]"
            style={{
              left: point.x - 4,
              top: point.y - 4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: `hsl(var(--secondary))`,
              boxShadow: `0 0 ${15 * opacity}px hsl(var(--secondary)), 0 0 ${25 * opacity}px hsl(var(--primary) / 0.5)`,
            }}
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ 
              opacity: 0, 
              scale: 0.2,
              x: (Math.random() - 0.5) * 40,
              y: (Math.random() - 0.5) * 40,
            }}
            transition={{ duration: 0.6 }}
          />
        );
      case "molecule":
        return (
          <motion.div
            key={point.id}
            className="fixed pointer-events-none z-[9998]"
            style={{ left: point.x - 10, top: point.y - 10 }}
            initial={{ opacity: 0.7, scale: 0.5, rotate: 0 }}
            animate={{ opacity: 0, scale: 1.3, rotate: 180 }}
            transition={{ duration: 0.8 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="3" fill="hsl(var(--primary))" opacity={opacity} />
              <circle cx="4" cy="6" r="2" fill="hsl(var(--secondary))" opacity={opacity * 0.8} />
              <circle cx="16" cy="6" r="2" fill="hsl(var(--secondary))" opacity={opacity * 0.8} />
              <circle cx="10" cy="17" r="2" fill="hsl(var(--secondary))" opacity={opacity * 0.8} />
              <line x1="10" y1="10" x2="4" y2="6" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity={opacity * 0.5} />
              <line x1="10" y1="10" x2="16" y2="6" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity={opacity * 0.5} />
              <line x1="10" y1="10" x2="10" y2="17" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity={opacity * 0.5} />
            </svg>
          </motion.div>
        );
    }
  };

  return (
    <>
      {/* Hide default cursor globally */}
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Trail particles */}
      <AnimatePresence>
        {trail.map((point, index) => renderTrailElement(point, index))}
      </AnimatePresence>

      {/* Main cursor */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed pointer-events-none z-[9999]"
            style={{
              left: mousePos.x,
              top: mousePos.y,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: isClicking ? 0.8 : 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 40,
                height: 40,
                left: -20,
                top: -20,
                border: "2px solid hsl(var(--primary) / 0.3)",
                boxShadow: "0 0 20px hsl(var(--primary) / 0.3), inset 0 0 10px hsl(var(--primary) / 0.1)",
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity },
              }}
            />

            {/* Center atom */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 12,
                height: 12,
                left: -6,
                top: -6,
                background: "radial-gradient(circle at 30% 30%, hsl(var(--primary)), hsl(var(--secondary)))",
                boxShadow: `
                  0 0 10px hsl(var(--primary)),
                  0 0 20px hsl(var(--primary) / 0.5),
                  0 0 30px hsl(var(--secondary) / 0.3)
                `,
              }}
              animate={{
                scale: isClicking ? [1, 1.5, 1] : [1, 1.2, 1],
              }}
              transition={{
                duration: isClicking ? 0.2 : 0.8,
                repeat: isClicking ? 0 : Infinity,
              }}
            />

            {/* Orbiting electrons */}
            {[0, 120, 240].map((angle, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  background: "hsl(var(--secondary))",
                  boxShadow: "0 0 8px hsl(var(--secondary))",
                }}
                animate={{
                  x: [
                    Math.cos((angle * Math.PI) / 180) * 16 - 3,
                    Math.cos(((angle + 360) * Math.PI) / 180) * 16 - 3,
                  ],
                  y: [
                    Math.sin((angle * Math.PI) / 180) * 16 - 3,
                    Math.sin(((angle + 360) * Math.PI) / 180) * 16 - 3,
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;

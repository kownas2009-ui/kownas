import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  type: "spark" | "dot" | "ring";
}

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const isMobile = useIsMobile();

  const getRandomType = useCallback((): TrailPoint["type"] => {
    const types: TrailPoint["type"][] = ["spark", "dot", "ring"];
    return types[Math.floor(Math.random() * types.length)];
  }, []);

  useEffect(() => {
    // Don't add cursor on mobile/tablet devices
    if (isMobile) return;

    let lastAddTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const now = Date.now();
      if (now - lastAddTime > 40) {
        lastAddTime = now;
        setTrail((prev) => {
          const newPoint: TrailPoint = {
            id: now,
            x: e.clientX,
            y: e.clientY,
            type: getRandomType(),
          };
          return [...prev.slice(-15), newPoint];
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

    const cleanupInterval = setInterval(() => {
      setTrail((prev) => prev.filter((p) => Date.now() - p.id < 600));
    }, 100);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      clearInterval(cleanupInterval);
    };
  }, [getRandomType, isMobile]);

  // Don't render anything on mobile
  if (isMobile) return null;

  const renderTrailElement = (point: TrailPoint) => {
    const age = (Date.now() - point.id) / 600;
    const opacity = Math.max(0, 1 - age);

    switch (point.type) {
      case "spark":
        return (
          <motion.div
            key={point.id}
            className="fixed pointer-events-none z-[9998]"
            style={{
              left: point.x - 2,
              top: point.y - 2,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: `hsl(var(--primary))`,
              boxShadow: `0 0 ${8 * opacity}px hsl(var(--primary))`,
            }}
            initial={{ opacity: 0.9, scale: 1 }}
            animate={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.5 }}
          />
        );
      case "dot":
        return (
          <motion.div
            key={point.id}
            className="fixed pointer-events-none z-[9998] rounded-full"
            style={{
              left: point.x - 3,
              top: point.y - 3,
              width: 6,
              height: 6,
              background: `hsl(var(--secondary) / ${opacity * 0.7})`,
            }}
            initial={{ opacity: 0.7, scale: 0.8 }}
            animate={{ opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.4 }}
          />
        );
      case "ring":
        return (
          <motion.div
            key={point.id}
            className="fixed pointer-events-none z-[9998] rounded-full"
            style={{
              left: point.x - 6,
              top: point.y - 6,
              width: 12,
              height: 12,
              border: `1px solid hsl(var(--primary) / ${opacity * 0.5})`,
            }}
            initial={{ opacity: 0.6, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.5 }}
          />
        );
    }
  };

  return (
    <>
      {/* Hide default cursor globally - only on desktop */}
      <style>{`
        @media (min-width: 768px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Trail particles */}
      <AnimatePresence>
        {trail.map((point) => renderTrailElement(point))}
      </AnimatePresence>

      {/* Main cursor - minimalistic dot */}
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
            animate={{ opacity: 1, scale: isClicking ? 0.7 : 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            {/* Simple glowing dot */}
            <motion.div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "hsl(var(--primary))",
                boxShadow: `
                  0 0 8px hsl(var(--primary)),
                  0 0 16px hsl(var(--primary) / 0.5)
                `,
              }}
              animate={{
                scale: isClicking ? [1, 1.3, 1] : 1,
              }}
              transition={{
                duration: 0.15,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;

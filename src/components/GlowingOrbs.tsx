import { motion } from "framer-motion";

const GlowingOrbs = () => {
  const orbs = [
    { size: 300, x: "10%", y: "20%", color: "primary", delay: 0 },
    { size: 400, x: "80%", y: "60%", color: "secondary", delay: 2 },
    { size: 250, x: "50%", y: "80%", color: "primary", delay: 4 },
    { size: 350, x: "20%", y: "70%", color: "secondary", delay: 1 },
    { size: 200, x: "70%", y: "20%", color: "primary", delay: 3 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, hsl(var(--${orb.color}) / 0.15) 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Animated gradient mesh */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, hsl(var(--primary) / 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, hsl(var(--secondary) / 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, hsl(var(--primary) / 0.03) 0%, transparent 60%)
          `,
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default GlowingOrbs;

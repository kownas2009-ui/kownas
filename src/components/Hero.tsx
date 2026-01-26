import { motion, useScroll, useTransform } from "framer-motion";
import NeonButton from "@/components/NeonButton";
import { FloatingAtom, BubblingBeaker, AnimatedMolecule } from "./ChemistryAnimations";
import { Atom, Sparkles, ArrowDown, Zap, Star } from "lucide-react";
import { useRef } from "react";

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Animated mesh gradient */}
      <motion.div 
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, hsl(var(--primary) / 0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, hsl(var(--secondary) / 0.1) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, hsl(168 60% 50% / 0.05) 0%, transparent 60%)
          `,
        }}
        animate={{
          background: [
            `radial-gradient(circle at 20% 20%, hsl(var(--primary) / 0.15) 0%, transparent 40%),
             radial-gradient(circle at 80% 80%, hsl(var(--secondary) / 0.1) 0%, transparent 40%),
             radial-gradient(circle at 50% 50%, hsl(168 60% 50% / 0.05) 0%, transparent 60%)`,
            `radial-gradient(circle at 40% 30%, hsl(var(--primary) / 0.12) 0%, transparent 40%),
             radial-gradient(circle at 60% 70%, hsl(var(--secondary) / 0.12) 0%, transparent 40%),
             radial-gradient(circle at 30% 60%, hsl(168 60% 50% / 0.08) 0%, transparent 60%)`,
            `radial-gradient(circle at 20% 20%, hsl(var(--primary) / 0.15) 0%, transparent 40%),
             radial-gradient(circle at 80% 80%, hsl(var(--secondary) / 0.1) 0%, transparent 40%),
             radial-gradient(circle at 50% 50%, hsl(168 60% 50% / 0.05) 0%, transparent 60%)`,
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated chemistry decorations with parallax */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ y, opacity }}
      >
        <FloatingAtom className="top-20 left-10" delay={0} size={70} />
        <FloatingAtom className="top-1/4 right-20" delay={1} size={90} />
        <FloatingAtom className="bottom-32 left-1/4" delay={2} size={55} />
        <FloatingAtom className="top-1/2 right-10" delay={3} size={45} />
        <FloatingAtom className="top-1/3 left-1/3" delay={4} size={35} />
        
        <BubblingBeaker className="absolute bottom-20 right-20 opacity-60" />
        <AnimatedMolecule className="absolute top-1/3 left-20 opacity-50" />
        
        {/* Enhanced glowing orbs */}
        <motion.div 
          className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--secondary) / 0.15) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        {/* Floating chemistry formulas with glow */}
        <motion.div
          className="absolute top-1/4 left-8 text-7xl font-display font-bold"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--secondary) / 0.1))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 40px hsl(var(--primary) / 0.2)",
          }}
          animate={{ 
            opacity: [0.1, 0.25, 0.1],
            y: [0, -10, 0],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          H₂O
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 right-8 text-6xl font-display font-bold"
          style={{
            background: "linear-gradient(135deg, hsl(var(--secondary) / 0.15), hsl(var(--primary) / 0.1))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          animate={{ 
            opacity: [0.08, 0.2, 0.08],
            y: [0, 10, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        >
          C₆H₁₂O₆
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 text-5xl font-display font-bold"
          style={{
            background: "linear-gradient(135deg, hsl(168 60% 50% / 0.12), hsl(var(--primary) / 0.08))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          animate={{ 
            opacity: [0.05, 0.15, 0.05],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        >
          NaCl
        </motion.div>
      </motion.div>

      {/* Pulsing rings decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10"
            style={{
              width: 300 + i * 150,
              height: 300 + i * 150,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3 - i * 0.08, 0.5 - i * 0.1, 0.3 - i * 0.08],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 max-w-4xl mx-auto text-center"
        style={{ scale }}
      >
        {/* Animated Badge with glow */}
        <motion.div 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card premium-glow mb-8"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          whileHover={{ scale: 1.08, y: -2 }}
        >
          <motion.div
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Atom className="w-5 h-5 text-primary" />
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <span className="text-sm font-semibold text-foreground">Korepetycje online z chemii i fizyki</span>
          <Star className="w-4 h-4 text-secondary fill-secondary" />
        </motion.div>

        {/* Main heading with animated gradient */}
        <motion.h1 
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span className="text-foreground">Cześć, jestem </span>
          <motion.span 
            className="text-gradient-animated inline-block relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Aneta
            <motion.span
              className="absolute -bottom-2 left-0 w-full h-1 rounded-full bg-gradient-to-r from-primary via-secondary to-primary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            />
          </motion.span>
        </motion.h1>

        {/* Subtitle with stagger animation */}
        <motion.p 
          className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-body"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Pomogę Ci{" "}
          <motion.span 
            className="text-primary font-semibold"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            zrozumieć i polubić
          </motion.span>
          {" "}chemię oraz fizykę.{" "}
          <span className="text-secondary font-bold">95% skuteczności</span> zdanych matur!
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-5 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <NeonButton 
            variant="primary" 
            size="lg" 
            onClick={scrollToServices}
          >
            <Sparkles className="w-5 h-5" />
            <span>Poznaj ofertę</span>
          </NeonButton>
          
          <NeonButton 
            variant="outline" 
            size="lg" 
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Zap className="w-5 h-5" />
            <span>Umów lekcję</span>
          </NeonButton>
        </motion.div>

        {/* Stats with premium cards */}
        <motion.div 
          className="grid grid-cols-2 gap-6 mt-16 max-w-md mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          {[
            { value: "20+", label: "lat doświadczenia", icon: "🧪" },
            { value: "1000+", label: "szczęśliwych uczniów", icon: "🎓" }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="glass-card rounded-2xl p-5 card-3d"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-4xl mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 + index * 0.2, type: "spring", stiffness: 200 }}
              >
                {stat.icon}
              </motion.div>
              <motion.div 
                className="text-3xl md:text-4xl font-display font-bold text-gradient-animated"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.2, type: "spring" }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-muted-foreground mt-1 font-body">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator - positioned below stats */}
        <motion.div
          className="mt-12 flex justify-center cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 12, 0] }}
          transition={{ 
            opacity: { delay: 2 },
            y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
          }}
          onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex flex-col items-center gap-2 px-4 py-2 rounded-full hover:bg-primary/10 transition-colors">
            <span className="text-xs text-muted-foreground font-medium">Przewiń w dół</span>
            <motion.div
              className="relative"
              animate={{ 
                boxShadow: [
                  "0 0 10px hsl(var(--primary) / 0.3)",
                  "0 0 20px hsl(var(--primary) / 0.5)",
                  "0 0 10px hsl(var(--primary) / 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowDown className="w-6 h-6 text-primary" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

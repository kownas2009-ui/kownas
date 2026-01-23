import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FloatingAtom, BubblingBeaker, AnimatedMolecule } from "./ChemistryAnimations";
import { Atom, Sparkles, ArrowDown } from "lucide-react";

const Hero = () => {
  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Animated chemistry decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingAtom className="top-20 left-10" delay={0} size={60} />
        <FloatingAtom className="top-1/4 right-20" delay={1} size={80} />
        <FloatingAtom className="bottom-32 left-1/4" delay={2} size={50} />
        <FloatingAtom className="top-1/2 right-10" delay={3} size={40} />
        
        <BubblingBeaker className="absolute bottom-20 right-20 opacity-50" />
        <AnimatedMolecule className="absolute top-1/3 left-20 opacity-40" />
        
        {/* Glowing orbs with animation */}
        <motion.div 
          className="absolute top-1/3 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/15 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        {/* Chemistry formula decorations */}
        <motion.div
          className="absolute top-1/4 left-10 text-6xl font-display text-primary/10 font-bold"
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          H₂O
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 right-10 text-5xl font-display text-secondary/10 font-bold"
          animate={{ opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          CO₂
        </motion.div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Animated Badge */}
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-soft mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Atom className="w-4 h-4 text-primary" />
          </motion.div>
          <span className="text-sm font-medium text-muted-foreground">Korepetycje online</span>
        </motion.div>

        {/* Main heading with letter animation */}
        <motion.h1 
          className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Cześć, jestem{" "}
          <motion.span 
            className="text-gradient inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Aneta
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-body"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Pomogę Ci zrozumieć i pokochać chemię oraz fizykę. Indywidualne podejście, cierpliwość i pasja do nauki — to moja recepta na sukces.
        </motion.p>

        {/* CTA Button with chemistry animation */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="hero" 
              size="xl" 
              className="group relative overflow-hidden" 
              onClick={scrollToServices}
            >
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              
              {/* Bubbles on hover */}
              <motion.div
                className="absolute bottom-0 left-1/4 w-2 h-2 rounded-full bg-white/40"
                initial={{ y: 0, opacity: 0 }}
                whileHover={{ y: -20, opacity: [0, 1, 0] }}
                transition={{ duration: 0.8 }}
              />
              
              <Sparkles className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:rotate-12" />
              <span className="relative z-10">Poznaj ofertę</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats with counting animation */}
        <motion.div 
          className="grid grid-cols-2 gap-8 mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {[
            { value: "20+", label: "lat doświadczenia" },
            { value: "1000+", label: "uczniów" }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-3xl md:text-4xl font-display font-bold text-primary"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.2, type: "spring" }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-muted-foreground mt-1 font-body">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { delay: 2 },
            y: { duration: 1.5, repeat: Infinity }
          }}
        >
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

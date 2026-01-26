import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import InteractivePeriodicTable from "@/components/InteractivePeriodicTable";
import SuccessCounter from "@/components/SuccessCounter";
import ChemistryFacts from "@/components/ChemistryFacts";
import PageLoader from "@/components/PageLoader";
import AuroraBackground from "@/components/AuroraBackground";
import ParticleField from "@/components/ParticleField";
import { FloatingAtom, BubblingBeaker, DNAHelix, TestTube, BenzeneRing, FloatingFormula } from "@/components/ChemistryAnimations";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background relative overflow-hidden">
      {/* Page loading animation */}
      <PageLoader />
      
      {/* Custom neon cursor */}
      <CustomCursor />
      
      {/* Aurora Background Effect */}
      <AuroraBackground />
      
      {/* Particle Field */}
      <ParticleField />
      
      {/* Extensive floating chemistry decorations with parallax */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ y: backgroundY }}
      >
        {/* Floating atoms at various positions */}
        <FloatingAtom className="top-20 left-10 opacity-25" delay={0} size={80} />
        <FloatingAtom className="top-40 right-20 opacity-15" delay={1.5} size={60} />
        <FloatingAtom className="bottom-40 left-20 opacity-12" delay={3} size={70} />
        <FloatingAtom className="top-1/3 right-10 opacity-18" delay={2} size={50} />
        <FloatingAtom className="bottom-20 right-1/4 opacity-20" delay={4} size={65} />
        <FloatingAtom className="top-2/3 left-1/4 opacity-12" delay={5} size={45} />
        <FloatingAtom className="top-1/2 left-1/2 opacity-10" delay={6} size={55} />
        
        {/* Beakers and test tubes */}
        <BubblingBeaker className="bottom-20 right-10 opacity-15" />
        <BubblingBeaker className="top-1/2 left-5 opacity-12 scale-75" />
        <TestTube className="bottom-1/3 right-20 opacity-15" />
        <TestTube className="top-1/4 left-1/3 opacity-12 scale-90" />
        
        {/* DNA and benzene */}
        <DNAHelix className="absolute top-20 right-1/4 opacity-12" />
        <BenzeneRing className="absolute bottom-1/4 left-10 opacity-8" />
        <BenzeneRing className="absolute top-1/2 right-5 opacity-8 scale-75" />
        
        {/* Floating formulas */}
        <FloatingFormula formula="H₂O" className="top-1/4 left-10 text-7xl" delay={0} />
        <FloatingFormula formula="CO₂" className="bottom-1/3 right-10 text-6xl" delay={1} />
        <FloatingFormula formula="NaCl" className="top-1/2 left-1/3 text-5xl" delay={2} />
        <FloatingFormula formula="C₆H₁₂O₆" className="bottom-1/4 right-1/3 text-4xl" delay={3} />
        <FloatingFormula formula="H₂SO₄" className="top-3/4 left-1/4 text-5xl" delay={4} />
        <FloatingFormula formula="NH₃" className="top-1/3 right-1/4 text-6xl" delay={2.5} />
        <FloatingFormula formula="Fe₂O₃" className="bottom-1/2 left-1/2 text-4xl" delay={5} />
        
        {/* Premium glowing orbs with enhanced effects */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--secondary) / 0.1) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(168 60% 50% / 0.06) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        
        {/* Rising bubbles with variety */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`bubble-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${3 + i * 5}%`,
              bottom: -30,
              width: 6 + Math.random() * 14,
              height: 6 + Math.random() * 14,
              background: i % 4 === 0 
                ? "radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.1))" 
                : i % 4 === 1
                ? "radial-gradient(circle at 30% 30%, hsl(var(--secondary) / 0.25), hsl(var(--secondary) / 0.08))"
                : i % 4 === 2
                ? "radial-gradient(circle at 30% 30%, hsl(168 60% 50% / 0.2), hsl(168 60% 50% / 0.05))"
                : "radial-gradient(circle at 30% 30%, hsl(var(--muted-foreground) / 0.15), transparent)",
              boxShadow: i % 3 === 0 ? "0 0 10px hsl(var(--primary) / 0.2)" : "none",
            }}
            animate={{
              y: [0, -2500],
              x: [0, Math.sin(i) * 50, Math.cos(i) * 30, 0],
              opacity: [0, 0.6, 0.4, 0],
              scale: [1, 1.2, 0.8, 0.5],
            }}
            transition={{
              duration: 18 + Math.random() * 12,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "linear",
            }}
          />
        ))}
      </motion.div>
      
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <section id="about">
          <About />
        </section>
        <SuccessCounter />
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <section id="services">
          <Services />
        </section>
        <ChemistryFacts />
        <section id="testimonials">
          <Testimonials />
        </section>
        <section id="faq">
          <FAQ />
        </section>
        <section id="contact">
          <Contact />
        </section>
        <InteractivePeriodicTable />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

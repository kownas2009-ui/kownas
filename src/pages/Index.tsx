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
import { FloatingAtom, BubblingBeaker, DNAHelix, TestTube, BenzeneRing, FloatingFormula } from "@/components/ChemistryAnimations";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Custom neon cursor */}
      <CustomCursor />
      
      {/* Extensive floating chemistry decorations */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Floating atoms at various positions */}
        <FloatingAtom className="top-20 left-10 opacity-30" delay={0} size={70} />
        <FloatingAtom className="top-40 right-20 opacity-20" delay={1.5} size={50} />
        <FloatingAtom className="bottom-40 left-20 opacity-15" delay={3} size={60} />
        <FloatingAtom className="top-1/3 right-10 opacity-20" delay={2} size={45} />
        <FloatingAtom className="bottom-20 right-1/4 opacity-25" delay={4} size={55} />
        <FloatingAtom className="top-2/3 left-1/4 opacity-15" delay={5} size={40} />
        
        {/* Beakers and test tubes */}
        <BubblingBeaker className="bottom-20 right-10 opacity-20" />
        <BubblingBeaker className="top-1/2 left-5 opacity-15 scale-75" />
        <TestTube className="bottom-1/3 right-20 opacity-20" />
        <TestTube className="top-1/4 left-1/3 opacity-15 scale-90" />
        
        {/* DNA and benzene */}
        <DNAHelix className="absolute top-20 right-1/4 opacity-15" />
        <BenzeneRing className="absolute bottom-1/4 left-10 opacity-10" />
        <BenzeneRing className="absolute top-1/2 right-5 opacity-10 scale-75" />
        
        {/* Floating formulas */}
        <FloatingFormula formula="H₂O" className="top-1/4 left-10 text-6xl" delay={0} />
        <FloatingFormula formula="CO₂" className="bottom-1/3 right-10 text-5xl" delay={1} />
        <FloatingFormula formula="NaCl" className="top-1/2 left-1/3 text-4xl" delay={2} />
        <FloatingFormula formula="C₆H₁₂O₆" className="bottom-1/4 right-1/3 text-3xl" delay={3} />
        <FloatingFormula formula="H₂SO₄" className="top-3/4 left-1/4 text-4xl" delay={4} />
        <FloatingFormula formula="NH₃" className="top-1/3 right-1/4 text-5xl" delay={2.5} />
        
        {/* Glowing orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        
        {/* Rising bubbles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`bubble-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${5 + i * 8}%`,
              bottom: -20,
              width: 8 + Math.random() * 10,
              height: 8 + Math.random() * 10,
              background: i % 3 === 0 
                ? "hsl(var(--primary) / 0.15)" 
                : i % 3 === 1
                ? "hsl(var(--secondary) / 0.15)"
                : "hsl(var(--muted-foreground) / 0.1)",
            }}
            animate={{
              y: [0, -2000],
              x: [0, Math.sin(i) * 30],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 1.2,
              ease: "linear",
            }}
          />
        ))}
      </div>
      
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <section id="about">
          <About />
        </section>
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <section id="services">
          <Services />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
        <section id="faq">
          <FAQ />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

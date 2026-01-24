import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { FloatingAtom, BubblingBeaker } from "@/components/ChemistryAnimations";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating chemistry decorations */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <FloatingAtom className="top-20 left-10 opacity-20" delay={0} size={60} />
        <FloatingAtom className="top-40 right-20 opacity-15" delay={2} size={40} />
        <FloatingAtom className="bottom-40 left-20 opacity-10" delay={4} size={50} />
        <BubblingBeaker className="bottom-20 right-10 opacity-15" />
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

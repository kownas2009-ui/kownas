import { Button } from "@/components/ui/button";
import MoleculeDecoration from "./MoleculeDecoration";
import { Atom, Sparkles } from "lucide-react";

const Hero = () => {
  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <MoleculeDecoration className="absolute -top-10 -left-10 w-64 h-64 opacity-40 animate-float" />
        <MoleculeDecoration className="absolute top-1/4 -right-20 w-80 h-80 opacity-30 animate-float" style={{ animationDelay: "2s" }} />
        <MoleculeDecoration className="absolute bottom-10 left-1/4 w-48 h-48 opacity-25 animate-float" style={{ animationDelay: "4s" }} />
        
        {/* Glowing orbs */}
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-soft mb-8 animate-fade-in-up">
          <Atom className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Korepetycje online</span>
        </div>

        {/* Main heading */}
        <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Cześć, jestem{" "}
          <span className="text-gradient">Aneta</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up font-body" style={{ animationDelay: "0.2s" }}>
          Pomogę Ci zrozumieć i pokochać chemię oraz fizykę. Indywidualne podejście, cierpliwość i pasja do nauki — to moja recepta na sukces.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <Button variant="hero" size="xl" className="group" onClick={scrollToServices}>
            <Sparkles className="w-5 h-5 transition-transform group-hover:scale-110" />
            Poznaj ofertę
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-8 mt-16 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-primary">20+</div>
            <div className="text-sm text-muted-foreground mt-1 font-body">lat doświadczenia</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-primary">1000+</div>
            <div className="text-sm text-muted-foreground mt-1 font-body">uczniów</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

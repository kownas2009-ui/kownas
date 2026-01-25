import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Lightbulb, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const facts = [
  {
    title: "Woda rozszerza się zamarzając",
    content: "Lód jest o 9% mniej gęsty od wody. Dlatego kostki lodu unoszą się na powierzchni napoju!",
    emoji: "🧊"
  },
  {
    title: "Ludzkie ciało to chodzący układ okresowy",
    content: "W Twoim ciele znajduje się 60 różnych pierwiastków chemicznych, w tym złoto i uran!",
    emoji: "🧬"
  },
  {
    title: "Diament i grafit to ten sam węgiel",
    content: "Najtwardszy i jeden z najmiększych minerałów zbudowane są z tego samego pierwiastka - różni je tylko struktura.",
    emoji: "💎"
  },
  {
    title: "Tlen ma kolor!",
    content: "Ciekły tlen jest niebieski. Przy bardzo niskich temperaturach (-183°C) możesz zobaczyć piękny błękit.",
    emoji: "💙"
  },
  {
    title: "Banany są radioaktywne",
    content: "Zawierają potas-40, izotop promieniotwórczy. Ale spokojnie - musisz zjeść 10 milionów bananów naraz, żeby było niebezpiecznie!",
    emoji: "🍌"
  },
  {
    title: "Miód nigdy się nie psuje",
    content: "Dzięki niskiej zawartości wody i kwasowemu pH, miód jest naturalnym konserwantem. Archeologowie znaleźli jadalny miód sprzed 3000 lat!",
    emoji: "🍯"
  },
  {
    title: "Kobalt daje szkłu niebieski kolor",
    content: "Od starożytności tlenki kobaltu używane są do barwienia szkła i ceramiki na piękny kobaltowy błękit.",
    emoji: "🔵"
  },
  {
    title: "Ogień nie ma cienia",
    content: "Płomień emituje światło, więc nie blokuje go jak zwykłe obiekty. Dlatego ogień nie rzuca cienia!",
    emoji: "🔥"
  }
];

const ChemistryFacts = () => {
  // Randomize initial index on mount
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * facts.length));
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % facts.length);
    }, 6000);
    
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % facts.length);
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + facts.length) % facts.length);
  };

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lightbulb className="w-5 h-5 text-amber-500" />
            </motion.div>
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Ciekawostka chemiczna</span>
          </motion.div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Czy wiesz, że...? 🧪
          </h2>
        </motion.div>

        <div className="relative">
          {/* Navigation buttons */}
          <motion.button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          {/* Fact card */}
          <div className="overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-card border border-border p-8 md:p-12 text-center shadow-soft relative overflow-hidden"
              >
                {/* Decorative sparkles */}
                <motion.div
                  className="absolute top-4 right-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-primary/20" />
                </motion.div>
                
                {/* Emoji */}
                <motion.div
                  className="text-6xl mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  {facts[currentIndex].emoji}
                </motion.div>
                
                {/* Title */}
                <motion.h3
                  className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {facts[currentIndex].title}
                </motion.h3>
                
                {/* Content */}
                <motion.p
                  className="text-lg text-muted-foreground font-body max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {facts[currentIndex].content}
                </motion.p>
                
                {/* Background decoration */}
                <motion.div
                  className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {facts.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex 
                    ? "bg-primary w-6" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                whileHover={{ scale: 1.3 }}
                layout
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChemistryFacts;

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Atom, Sparkles, Zap } from "lucide-react";

interface Element {
  symbol: string;
  name: string;
  number: number;
  mass: string;
  category: string;
  color: string;
  description: string;
}

const elements: Element[] = [
  { symbol: "H", name: "Wodór", number: 1, mass: "1.008", category: "Niemetale", color: "from-sky-400 to-cyan-500", description: "Najlżejszy pierwiastek. Główny składnik gwiazd i wody." },
  { symbol: "He", name: "Hel", number: 2, mass: "4.003", category: "Gazy szlachetne", color: "from-purple-400 to-pink-400", description: "Bezbarwny gaz szlachetny używany w balonach." },
  { symbol: "Li", name: "Lit", number: 3, mass: "6.941", category: "Metale alkaliczne", color: "from-red-400 to-orange-400", description: "Najlżejszy metal. Stosowany w bateriach." },
  { symbol: "Be", name: "Beryl", number: 4, mass: "9.012", category: "Metale ziem alkalicznych", color: "from-lime-400 to-green-400", description: "Lekki metal o wysokiej temperaturze topnienia." },
  { symbol: "B", name: "Bor", number: 5, mass: "10.81", category: "Półmetale", color: "from-amber-400 to-yellow-400", description: "Półmetal stosowany w szkłach i materiałach ogniotrwałych." },
  { symbol: "C", name: "Węgiel", number: 6, mass: "12.01", category: "Niemetale", color: "from-gray-600 to-gray-800", description: "Podstawa życia organicznego. Tworzy diamenty i grafit." },
  { symbol: "N", name: "Azot", number: 7, mass: "14.01", category: "Niemetale", color: "from-blue-500 to-indigo-500", description: "78% atmosfery ziemskiej. Kluczowy dla życia." },
  { symbol: "O", name: "Tlen", number: 8, mass: "16.00", category: "Niemetale", color: "from-red-500 to-rose-500", description: "Niezbędny do oddychania i spalania." },
  { symbol: "F", name: "Fluor", number: 9, mass: "19.00", category: "Halogeny", color: "from-teal-400 to-cyan-400", description: "Najbardziej reaktywny pierwiastek." },
  { symbol: "Ne", name: "Neon", number: 10, mass: "20.18", category: "Gazy szlachetne", color: "from-pink-400 to-rose-400", description: "Gaz świecący czerwono-pomarańczowo w rurach neonowych." },
  { symbol: "Na", name: "Sód", number: 11, mass: "22.99", category: "Metale alkaliczne", color: "from-yellow-400 to-amber-500", description: "Metal reagujący gwałtownie z wodą. Składnik soli kuchennej." },
  { symbol: "Mg", name: "Magnez", number: 12, mass: "24.31", category: "Metale ziem alkalicznych", color: "from-green-400 to-emerald-400", description: "Lekki metal stosowany w stopach." },
  { symbol: "Al", name: "Glin", number: 13, mass: "26.98", category: "Metale", color: "from-slate-400 to-gray-400", description: "Lekki metal odporny na korozję. Folia aluminiowa." },
  { symbol: "Si", name: "Krzem", number: 14, mass: "28.09", category: "Półmetale", color: "from-indigo-400 to-blue-400", description: "Podstawa elektroniki i chipów komputerowych." },
  { symbol: "P", name: "Fosfor", number: 15, mass: "30.97", category: "Niemetale", color: "from-orange-400 to-red-400", description: "Kluczowy dla DNA i kości. Świeci w ciemności." },
  { symbol: "S", name: "Siarka", number: 16, mass: "32.07", category: "Niemetale", color: "from-yellow-500 to-amber-400", description: "Żółty pierwiastek o charakterystycznym zapachu." },
  { symbol: "Cl", name: "Chlor", number: 17, mass: "35.45", category: "Halogeny", color: "from-green-400 to-emerald-500", description: "Zielonożółty gaz. Dezynfekcja wody." },
  { symbol: "Ar", name: "Argon", number: 18, mass: "39.95", category: "Gazy szlachetne", color: "from-violet-400 to-purple-400", description: "1% atmosfery. Używany w żarówkach." },
  { symbol: "K", name: "Potas", number: 19, mass: "39.10", category: "Metale alkaliczne", color: "from-rose-400 to-pink-400", description: "Niezbędny dla roślin i ludzi." },
  { symbol: "Ca", name: "Wapń", number: 20, mass: "40.08", category: "Metale ziem alkalicznych", color: "from-lime-400 to-green-500", description: "Buduje kości i zęby. Składnik kredy." },
  { symbol: "Fe", name: "Żelazo", number: 26, mass: "55.85", category: "Metale przejściowe", color: "from-orange-500 to-red-600", description: "Najważniejszy metal przemysłowy. Hemoglobina." },
  { symbol: "Cu", name: "Miedź", number: 29, mass: "63.55", category: "Metale przejściowe", color: "from-orange-400 to-amber-600", description: "Doskonały przewodnik. Monety i przewody." },
  { symbol: "Zn", name: "Cynk", number: 30, mass: "65.38", category: "Metale przejściowe", color: "from-slate-400 to-zinc-500", description: "Ochrona przed korozją. Baterie." },
  { symbol: "Ag", name: "Srebro", number: 47, mass: "107.9", category: "Metale przejściowe", color: "from-gray-300 to-slate-400", description: "Najlepszy przewodnik elektryczny. Biżuteria." },
  { symbol: "Au", name: "Złoto", number: 79, mass: "197.0", category: "Metale przejściowe", color: "from-yellow-400 to-yellow-600", description: "Metal szlachetny. Symbol bogactwa." },
];

const categoryColors: Record<string, string> = {
  "Niemetale": "from-sky-400/20 to-cyan-500/20",
  "Gazy szlachetne": "from-purple-400/20 to-pink-400/20",
  "Metale alkaliczne": "from-red-400/20 to-orange-400/20",
  "Metale ziem alkalicznych": "from-lime-400/20 to-green-400/20",
  "Półmetale": "from-amber-400/20 to-yellow-400/20",
  "Halogeny": "from-teal-400/20 to-cyan-400/20",
  "Metale przejściowe": "from-orange-400/20 to-amber-500/20",
  "Metale": "from-slate-400/20 to-gray-400/20",
};

const ElementCard = ({ element, onClick, index }: { element: Element; onClick: () => void; index: number }) => (
  <motion.button
    onClick={onClick}
    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${element.color} flex flex-col items-center justify-center shadow-lg cursor-pointer group overflow-hidden`}
    whileHover={{ 
      scale: 1.2, 
      zIndex: 10,
      rotateY: 15,
      rotateX: -10,
      boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)"
    }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, scale: 0, rotateZ: -180 }}
    whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
    viewport={{ once: true }}
    transition={{ 
      type: "spring", 
      stiffness: 200,
      delay: index * 0.02
    }}
  >
    {/* Atomic number */}
    <span className="text-[10px] text-white/90 font-mono absolute top-1.5 left-2 font-bold">{element.number}</span>
    
    {/* Symbol */}
    <motion.span 
      className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg"
      whileHover={{ scale: 1.1 }}
    >
      {element.symbol}
    </motion.span>
    
    {/* Name on hover */}
    <motion.span 
      className="text-[8px] text-white/90 font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1.5"
    >
      {element.name}
    </motion.span>
    
    {/* Animated glow effect */}
    <motion.div 
      className="absolute inset-0 bg-white/0 group-hover:bg-white/20 rounded-2xl"
      transition={{ duration: 0.2 }}
    />
    
    {/* Orbiting electron on hover */}
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-white/80 opacity-0 group-hover:opacity-100"
      animate={{
        rotate: 360,
        x: [0, 20, 0, -20, 0],
        y: [-20, 0, 20, 0, -20],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
    
    {/* Sparkle effects */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-white opacity-0 group-hover:opacity-100"
        style={{
          left: `${20 + i * 25}%`,
          top: `${30 + i * 20}%`,
        }}
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2,
        }}
      />
    ))}
  </motion.button>
);

const ElementModal = ({ element, onClose }: { element: Element; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.5, y: 100, rotateX: 45 }}
      animate={{ scale: 1, y: 0, rotateX: 0 }}
      exit={{ scale: 0.5, y: 100, rotateX: -45 }}
      className="bg-card rounded-3xl p-8 max-w-md w-full shadow-2xl border border-border relative overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Animated background gradient */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${element.color} opacity-10`}
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
      
      <motion.button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-20"
        whileHover={{ rotate: 90, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="w-5 h-5" />
      </motion.button>

      <div className="relative z-10">
        <div className="flex items-start gap-6 mb-6">
          <motion.div 
            className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${element.color} flex flex-col items-center justify-center shadow-2xl relative`}
            animate={{ 
              rotate: [0, 3, -3, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <span className="text-xs text-white/90 font-mono absolute top-2 left-3 font-bold">{element.number}</span>
            <span className="text-5xl font-bold text-white drop-shadow-lg">{element.symbol}</span>
            
            {/* Orbital ring */}
            <motion.div
              className="absolute inset-[-8px] border-2 border-white/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute w-3 h-3 rounded-full bg-white shadow-lg"
              animate={{
                rotate: 360,
              }}
              style={{ x: 44 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          <div>
            <motion.h3 
              className="font-display text-3xl font-bold text-foreground"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {element.name}
            </motion.h3>
            <motion.p 
              className="text-muted-foreground flex items-center gap-2 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              {element.category}
            </motion.p>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-2 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="p-4 bg-muted/50 rounded-2xl border border-border/50"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Atom className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground">Numer atomowy</p>
            </div>
            <p className="text-2xl font-bold font-display">{element.number}</p>
          </motion.div>
          <motion.div 
            className="p-4 bg-muted/50 rounded-2xl border border-border/50"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-secondary" />
              <p className="text-xs text-muted-foreground">Masa atomowa</p>
            </div>
            <p className="text-2xl font-bold font-display">{element.mass} u</p>
          </motion.div>
        </motion.div>

        <motion.div
          className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-foreground leading-relaxed">{element.description}</p>
        </motion.div>
      </div>
    </motion.div>
  </motion.div>
);

const InteractivePeriodicTable = () => {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const categories = [...new Set(elements.map(e => e.category))];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background via-card/30 to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-primary/5"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Atom className="w-4 h-4 text-primary animate-spin-slow" />
            <span className="text-sm font-medium text-primary">Interaktywna nauka</span>
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Układ Okresowy Pierwiastków
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Kliknij na pierwiastek, aby poznać jego fascynujące właściwości!
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center gap-3 md:gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {elements.map((element, index) => (
            <ElementCard 
              key={element.symbol}
              element={element} 
              index={index}
              onClick={() => setSelectedElement(element)} 
            />
          ))}
        </motion.div>

        {/* Legend */}
        <motion.div 
          className="mt-16 p-6 rounded-3xl bg-card/50 backdrop-blur-sm border border-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-center font-display font-semibold text-foreground mb-6">Kategorie pierwiastków</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat, i) => (
              <motion.div 
                key={cat} 
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${categoryColors[cat] || 'from-gray-400/20 to-gray-500/20'} border border-border/50`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <motion.div 
                  className="w-3 h-3 rounded-full bg-primary/60"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
                <span className="text-sm text-foreground font-medium">{cat}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedElement && (
          <ElementModal element={selectedElement} onClose={() => setSelectedElement(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default InteractivePeriodicTable;

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

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

const ElementCard = ({ element, onClick }: { element: Element; onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br ${element.color} flex flex-col items-center justify-center shadow-lg cursor-pointer group overflow-hidden`}
    whileHover={{ scale: 1.15, zIndex: 10 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, scale: 0 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <span className="text-[10px] text-white/80 font-mono absolute top-1 left-2">{element.number}</span>
    <span className="text-xl sm:text-2xl font-bold text-white">{element.symbol}</span>
    <span className="text-[8px] text-white/70 hidden group-hover:block">{element.name}</span>
    
    {/* Glow effect */}
    <motion.div 
      className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100"
      transition={{ duration: 0.2 }}
    />
  </motion.button>
);

const ElementModal = ({ element, onClose }: { element: Element; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.8, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.8, y: 50 }}
      className="bg-card rounded-3xl p-8 max-w-md w-full shadow-2xl border border-border relative overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${element.color} opacity-10`} />
      
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative z-10">
        <div className="flex items-start gap-6 mb-6">
          <motion.div 
            className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${element.color} flex flex-col items-center justify-center shadow-xl`}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-xs text-white/80 font-mono">{element.number}</span>
            <span className="text-4xl font-bold text-white">{element.symbol}</span>
          </motion.div>
          <div>
            <h3 className="font-display text-3xl font-bold text-foreground">{element.name}</h3>
            <p className="text-muted-foreground">{element.category}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-muted/50 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Numer atomowy</p>
            <p className="text-xl font-bold">{element.number}</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Masa atomowa</p>
            <p className="text-xl font-bold">{element.mass} u</p>
          </div>
        </div>

        <p className="text-foreground leading-relaxed">{element.description}</p>
      </div>
    </motion.div>
  </motion.div>
);

const InteractivePeriodicTable = () => {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-card/50">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Interaktywny Układ Okresowy
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Kliknij na pierwiastek, aby dowiedzieć się więcej!
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {elements.map((element, index) => (
            <motion.div
              key={element.symbol}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
            >
              <ElementCard 
                element={element} 
                onClick={() => setSelectedElement(element)} 
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Legend */}
        <motion.div 
          className="mt-12 flex flex-wrap justify-center gap-4 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {["Niemetale", "Metale alkaliczne", "Gazy szlachetne", "Metale przejściowe", "Halogeny"].map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/50" />
              <span className="text-muted-foreground">{cat}</span>
            </div>
          ))}
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

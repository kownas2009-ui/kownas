import { motion } from "framer-motion";
import { useState } from "react";

const elements = [
  { symbol: "H", name: "Wodór", number: 1, color: "from-blue-400 to-cyan-400" },
  { symbol: "He", name: "Hel", number: 2, color: "from-purple-400 to-pink-400" },
  { symbol: "Li", name: "Lit", number: 3, color: "from-red-400 to-orange-400" },
  { symbol: "C", name: "Węgiel", number: 6, color: "from-gray-600 to-gray-800" },
  { symbol: "N", name: "Azot", number: 7, color: "from-blue-500 to-indigo-500" },
  { symbol: "O", name: "Tlen", number: 8, color: "from-red-500 to-rose-500" },
  { symbol: "Na", name: "Sód", number: 11, color: "from-yellow-400 to-amber-500" },
  { symbol: "Cl", name: "Chlor", number: 17, color: "from-green-400 to-emerald-500" },
  { symbol: "Fe", name: "Żelazo", number: 26, color: "from-orange-500 to-red-600" },
  { symbol: "Au", name: "Złoto", number: 79, color: "from-yellow-400 to-yellow-600" },
];

const FloatingElement = ({ element, index }: { element: typeof elements[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${10 + (index % 5) * 18}%`,
        top: `${20 + Math.floor(index / 5) * 35}%`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 0.15,
        scale: 1,
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        opacity: { delay: index * 0.1, duration: 0.5 },
        scale: { delay: index * 0.1, duration: 0.5 },
        y: { duration: 4 + index * 0.5, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 6 + index * 0.3, repeat: Infinity, ease: "easeInOut" },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.5, opacity: 0.9, zIndex: 100 }}
    >
      <motion.div
        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${element.color} flex flex-col items-center justify-center shadow-lg cursor-pointer`}
        style={{
          boxShadow: isHovered 
            ? `0 0 30px hsl(var(--primary) / 0.5), 0 0 60px hsl(var(--secondary) / 0.3)` 
            : `0 4px 20px rgba(0,0,0,0.2)`,
        }}
      >
        <span className="text-[10px] text-white/80 font-mono">{element.number}</span>
        <span className="text-xl font-bold text-white">{element.symbol}</span>
        {isHovered && (
          <motion.span 
            className="text-[8px] text-white/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {element.name}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
};

const PeriodicTable = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((element, index) => (
        <FloatingElement key={element.symbol} element={element} index={index} />
      ))}
    </div>
  );
};

export default PeriodicTable;

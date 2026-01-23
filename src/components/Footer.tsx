import { motion } from "framer-motion";
import { Atom, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border bg-card/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <Atom className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="font-display text-lg font-bold text-foreground">Aneta</span>
          </motion.div>

          {/* Copyright */}
          <motion.p 
            className="text-sm text-muted-foreground font-body flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            © {new Date().getFullYear()} Korepetycje z chemii. Stworzone z 
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500 inline mx-1" />
            </motion.span>
          </motion.p>

          {/* Chemistry decoration */}
          <div className="hidden md:flex items-center gap-4 text-muted-foreground/50 font-display text-sm">
            <span>H₂O</span>
            <span>•</span>
            <span>NaCl</span>
            <span>•</span>
            <span>CO₂</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

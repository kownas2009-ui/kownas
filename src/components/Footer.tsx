import { motion } from "framer-motion";
import { FlaskConical, Heart, Mail, Phone, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 px-4 border-t border-border bg-gradient-to-b from-card/30 to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-24 rounded-full bg-primary/5"
            style={{
              left: `${10 + i * 20}%`,
              top: `${20 + (i % 2) * 40}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
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
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* Logo & Description */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center relative overflow-hidden"
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                <FlaskConical className="w-6 h-6 text-primary-foreground relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              <div>
                <span className="font-display text-xl font-bold text-foreground">Aneta Kownacka</span>
                <p className="text-xs text-muted-foreground">Korepetycje z chemii</p>
              </div>
            </motion.div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Ponad 20 lat doświadczenia w nauczaniu chemii i fizyki. 
              Pomagam uczniom zrozumieć i pokochać przedmioty ścisłe.
            </p>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Kontakt
            </h3>
            <div className="space-y-3">
              <motion.a 
                href="mailto:aneta.kownacka79@gmail.com"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
                whileHover={{ x: 5 }}
              >
                <Mail className="w-4 h-4 group-hover:text-primary transition-colors" />
                aneta.kownacka79@gmail.com
              </motion.a>
              <motion.a 
                href="tel:+48507125569"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
                whileHover={{ x: 5 }}
              >
                <Phone className="w-4 h-4 group-hover:text-primary transition-colors" />
                +48 507 125 569
              </motion.a>
            </div>
          </motion.div>

          {/* Chemistry formulas */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-display font-semibold text-foreground">Chemia to pasja ❤️</h3>
            <div className="flex flex-wrap gap-3">
              {["H₂O", "NaCl", "CO₂", "H₂SO₄", "CH₄", "NH₃"].map((formula, i) => (
                <motion.span
                  key={formula}
                  className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-mono font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  {formula}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div 
          className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
        />

        {/* Copyright */}
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted-foreground font-body flex items-center gap-1">
            © {new Date().getFullYear()} Korepetycje z chemii. Stworzone z 
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500 inline mx-1" />
            </motion.span>
          </p>
          <p className="text-xs text-muted-foreground/60">
            Tylko zajęcia online • Cały tydzień 8:00–20:00
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

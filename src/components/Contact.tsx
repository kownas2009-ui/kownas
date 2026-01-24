import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Calendar, Video, Send, Phone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import MoleculeDecoration from "./MoleculeDecoration";

const Contact = () => {
  return (
    <section className="py-24 px-4 bg-card/50 relative overflow-hidden">
      {/* Background decoration */}
      <MoleculeDecoration className="absolute -bottom-20 -right-20 w-96 h-96 opacity-20" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.1 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Skontaktuj się</span>
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Skontaktuj się ze mną
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Masz pytania? Chętnie odpowiem i pomogę dobrać odpowiedni plan zajęć.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-8">
            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <motion.div 
                className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Phone className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  Telefon
                </h3>
                <a 
                  href="tel:+48507125569" 
                  className="text-muted-foreground font-body hover:text-primary transition-colors text-lg"
                >
                  +48 507 125 569
                </a>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Mail className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  Email
                </h3>
                <a 
                  href="mailto:a.kownacka@gmail.com"
                  className="text-muted-foreground font-body hover:text-primary transition-colors"
                >
                  a.kownacka@gmail.com
                </a>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.div 
                className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Video className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  Forma zajęć
                </h3>
                <p className="text-muted-foreground font-body">
                  Tylko online (Zoom / Google Meet)
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <motion.div 
                className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  Dostępność
                </h3>
                <p className="text-muted-foreground font-body">
                  Tylko weekendy (sobota i niedziela)
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="p-6 rounded-2xl bg-background border border-border shadow-soft mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <p className="font-display text-lg text-foreground italic">
                "Chemia to nie magia — to logika, którą można zrozumieć. Pozwól mi Ci to pokazać."
              </p>
              <p className="text-primary font-semibold mt-3">— Aneta</p>
            </motion.div>
          </div>

          {/* Contact form */}
          <motion.div 
            className="p-8 rounded-2xl bg-background border border-border shadow-card"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-2 font-body">
                    Imię
                  </label>
                  <Input placeholder="Twoje imię" className="bg-card" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-2 font-body">
                    Telefon
                  </label>
                  <Input placeholder="+48 ..." className="bg-card" />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-foreground mb-2 font-body">
                  Email
                </label>
                <Input type="email" placeholder="twoj@email.pl" className="bg-card" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-foreground mb-2 font-body">
                  Wiadomość
                </label>
                <Textarea
                  placeholder="Opisz swoje potrzeby, poziom nauki, dostępność..."
                  className="bg-card min-h-[120px]"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="hero" size="lg" className="w-full group">
                  <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  Wyślij wiadomość
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

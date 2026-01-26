import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import BookingDialog from "./BookingDialog";
import { Check, Beaker, FlaskConical, Sparkles } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Beaker,
      title: "Szkoła podstawowa",
      subtitle: "Chemia i Fizyka",
      price: "100",
      features: [
        "Podstawy chemii i fizyki",
        "Pomoc z zadaniami domowymi",
        "Przygotowanie do sprawdzianów",
        "Przygotowanie do konkursów",
      ],
      popular: false,
    },
    {
      icon: FlaskConical,
      title: "Liceum / Technikum",
      subtitle: "Chemia",
      price: "120",
      features: [
        "Chemia na poziomie rozszerzonym",
        "Przygotowanie do matury",
        "Rozwiązywanie zadań maturalnych",
        "Konsultacje przed egzaminem",
      ],
      popular: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <section className="py-24 px-4 relative">
      {/* Section background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card premium-glow mb-6"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-secondary" />
            </motion.div>
            <span className="text-sm font-semibold text-foreground">Cały tydzień dostępna</span>
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            <span className="text-gradient-animated">Oferta zajęć</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-body">
            Zajęcia online przez cały tydzień. Każda lekcja trwa <span className="text-primary font-semibold">60 minut</span>.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              whileHover={{ 
                y: -12,
                transition: { type: "spring", stiffness: 300 }
              }}
              className={`relative p-8 rounded-3xl border transition-all duration-500 card-3d ${
                service.popular
                  ? "bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground border-primary/50 shadow-lg"
                  : "glass-card border-border/50 hover:border-primary/30 hover:premium-glow"
              }`}
            >
              {/* Card glow effect */}
              {service.popular && (
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: "radial-gradient(circle at 50% 0%, hsl(var(--secondary) / 0.3) 0%, transparent 50%)",
                  }}
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}

              {service.popular && (
                <motion.div 
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-secondary via-yellow-400 to-secondary text-secondary-foreground text-sm font-bold shadow-lg"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  whileHover={{ scale: 1.1 }}
                >
                  ⭐ Najpopularniejsze
                </motion.div>
              )}

              <motion.div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  service.popular ? "bg-primary-foreground/20" : "gradient-hero"
                }`}
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <service.icon
                  className={`w-7 h-7 ${
                    service.popular ? "text-primary-foreground" : "text-primary-foreground"
                  }`}
                />
              </motion.div>

              <h3 className="font-display text-2xl font-bold mb-1">{service.title}</h3>
              <p className={`text-sm mb-4 ${service.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {service.subtitle}
              </p>

              {/* Price with animated glow */}
              <div className="flex items-baseline gap-1 mb-6">
                <motion.span 
                  className={`text-5xl font-display font-bold ${service.popular ? "" : "text-gradient-animated"}`}
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                >
                  {service.price}
                </motion.span>
                <span className={`text-lg ${service.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  zł / lekcja
                </span>
              </div>

              <ul className="space-y-4 mb-8">
                {service.features.map((feature, i) => (
                  <motion.li 
                    key={feature} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <motion.div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        service.popular ? "bg-secondary/20" : "bg-primary/10"
                      }`}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check
                        className={`w-4 h-4 ${
                          service.popular ? "text-secondary" : "text-primary"
                        }`}
                      />
                    </motion.div>
                    <span
                      className={`font-body ${
                        service.popular ? "text-primary-foreground/90" : "text-foreground"
                      }`}
                    >
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <BookingDialog lessonType={service.title}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative"
                >
                  <Button
                    variant={service.popular ? "accent" : "hero"}
                    size="lg"
                    className="w-full group relative overflow-hidden font-semibold text-base"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <Sparkles className="w-4 h-4 mr-2" />
                    Wybierz i zarezerwuj
                  </Button>
                </motion.div>
              </BookingDialog>
            </motion.div>
          ))}
        </motion.div>

        {/* Payment Info Section - BLIK Only */}
        <motion.div
          className="mt-16 max-w-md mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              Metoda płatności
            </h3>
            <p className="text-muted-foreground font-body">
              Szybka płatność BLIKIEM
            </p>
          </div>
          
          {/* BLIK Only */}
          <motion.div
            className="p-6 rounded-2xl bg-card border border-border shadow-soft"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-display font-semibold text-foreground">BLIK</h4>
                <p className="text-sm text-muted-foreground">15 min przed zajęciami</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-sm">
              <p className="text-muted-foreground mb-1">Numer telefonu do BLIK:</p>
              <p className="text-foreground font-medium text-lg">507 125 569</p>
              <p className="text-muted-foreground mt-2 text-xs">Wpisz kod BLIK w aplikacji bankowej maksymalnie 15 minut przed rozpoczęciem lekcji</p>
            </div>
          </motion.div>

          {/* Cancellation Policy */}
          <motion.div
            className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-amber-800 dark:text-amber-200 font-body">
              <strong>⚠️ Zasady anulowania:</strong> Bezpłatne anulowanie do 24h przed lekcją. 
              W przypadku późniejszego odwołania — opłata 50% wartości lekcji.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;

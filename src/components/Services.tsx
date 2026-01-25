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
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary-foreground">Tylko weekendy</span>
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Oferta zajęć
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Zajęcia online, tylko w weekendy. Każda lekcja trwa 60 minut.
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
                y: -10,
                transition: { type: "spring", stiffness: 300 }
              }}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                service.popular
                  ? "bg-primary text-primary-foreground border-primary shadow-card"
                  : "bg-card border-border shadow-soft hover:shadow-card"
              }`}
            >
              {service.popular && (
                <motion.div 
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-accent text-accent-foreground text-sm font-semibold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  Najpopularniejsze
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

              <div className="flex items-baseline gap-1 mb-6">
                <motion.span 
                  className="text-4xl font-display font-bold"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                >
                  {service.price}
                </motion.span>
                <span className={`${service.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  zł / lekcja
                </span>
              </div>

              <ul className="space-y-3 mb-8">
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
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check
                        className={`w-5 h-5 flex-shrink-0 ${
                          service.popular ? "text-secondary" : "text-primary"
                        }`}
                      />
                    </motion.div>
                    <span
                      className={`font-body ${
                        service.popular ? "text-primary-foreground/90" : "text-muted-foreground"
                      }`}
                    >
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <BookingDialog lessonType={service.title}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={service.popular ? "accent" : "hero"}
                    size="lg"
                    className="w-full group relative overflow-hidden"
                  >
                    <motion.span
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    Wybierz pakiet
                  </Button>
                </motion.div>
              </BookingDialog>
            </motion.div>
          ))}
        </motion.div>

        {/* Payment Info Section */}
        <motion.div
          className="mt-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              Metody płatności
            </h3>
            <p className="text-muted-foreground font-body">
              Wygodna płatność przelewem lub BLIKIEM
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Bank Transfer */}
            <motion.div
              className="p-6 rounded-2xl bg-card border border-border shadow-soft"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground">Przelew bankowy</h4>
                  <p className="text-sm text-muted-foreground">Płatność przed lekcją</p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <p className="text-muted-foreground mb-2">Nr konta:</p>
                <p className="text-foreground font-medium">Numer konta bankowego otrzymasz w prywatnej wiadomości po potwierdzeniu rezerwacji</p>
                <p className="text-muted-foreground mt-3 text-xs">Aneta Kownacka</p>
              </div>
            </motion.div>

            {/* BLIK */}
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
                  <p className="text-sm text-muted-foreground">Szybka płatność telefonem</p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <p className="text-muted-foreground mb-1">Numer telefonu do BLIK:</p>
                <p className="text-foreground font-medium text-lg">507 125 569</p>
                <p className="text-muted-foreground mt-2 text-xs">Wpisz kod BLIK w aplikacji bankowej</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;

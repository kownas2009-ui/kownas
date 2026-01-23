import { motion } from "framer-motion";
import { UserPlus, Calendar, Video, GraduationCap } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Załóż konto",
    description: "Zarejestruj się i uzupełnij swój profil. To zajmuje tylko chwilę."
  },
  {
    icon: Calendar,
    title: "Wybierz termin",
    description: "Wybierz dogodny termin zajęć w weekend. Dopasowuję się do Twojego planu."
  },
  {
    icon: Video,
    title: "Dołącz do lekcji",
    description: "Połącz się online i ucz się z domu. Wszystko czego potrzebujesz to komputer."
  },
  {
    icon: GraduationCap,
    title: "Osiągaj sukcesy",
    description: "Popraw oceny i zrozum chemię. Razem osiągniemy Twoje cele!"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Jak to działa?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Cztery proste kroki do lepszych ocen
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-secondary/30 to-primary/20" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center group"
            >
              {/* Step number */}
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center z-10"
                whileHover={{ scale: 1.1 }}
              >
                {index + 1}
              </motion.div>

              {/* Icon */}
              <motion.div
                className="relative w-32 h-32 mx-auto mb-6 rounded-2xl gradient-hero flex items-center justify-center shadow-card"
                whileHover={{ scale: 1.05, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <step.icon className="w-12 h-12 text-primary-foreground" />
                
                {/* Floating particles on hover */}
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-secondary opacity-0 group-hover:opacity-100"
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-primary/50 opacity-0 group-hover:opacity-100"
                  animate={{ 
                    y: [0, 10, 0],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </motion.div>

              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

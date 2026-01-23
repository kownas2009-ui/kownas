import { motion } from "framer-motion";
import { Heart, BookOpen, Users, Award, Clock, Laptop } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Heart,
      title: "Pasja do nauczania",
      description: "Chemia to moja wielka miłość, którą z radością dzielę się z uczniami.",
    },
    {
      icon: BookOpen,
      title: "Indywidualne podejście",
      description: "Każdy uczeń jest inny. Dostosuję metody nauczania do Twoich potrzeb.",
    },
    {
      icon: Users,
      title: "Cierpliwość",
      description: "Wierzę, że każdy może zrozumieć chemię. Wystarczy odpowiednie wsparcie.",
    },
    {
      icon: Award,
      title: "20+ lat doświadczenia",
      description: "Ponad 20 lat pracy z uczniami na różnych poziomach zaawansowania.",
    },
    {
      icon: Clock,
      title: "Elastyczne terminy",
      description: "Zajęcia w weekendy, dostosowane do Twojego harmonogramu.",
    },
    {
      icon: Laptop,
      title: "Wygodne zajęcia online",
      description: "Ucz się z domu przez Zoom lub Google Meet. Bez dojazdów.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  return (
    <section className="py-24 px-4 bg-card/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Dlaczego warto uczyć się ze mną?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Łączę wiedzę z empatią, tworząc przestrzeń, w której nauka staje się przyjemnością.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group p-6 rounded-2xl bg-background border border-border shadow-soft hover:shadow-card transition-all duration-300"
            >
              <motion.div 
                className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-4"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect line */}
              <motion.div
                className="h-0.5 bg-gradient-to-r from-primary to-secondary mt-4 origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;

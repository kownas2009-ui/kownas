import { motion } from "framer-motion";
import { Heart, BookOpen, Users, Award, Clock, Laptop, Sparkles } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Heart,
      title: "Pasja do nauczania",
      description: "Chemia to moja wielka miłość, którą z radością dzielę się z uczniami.",
      gradient: "from-rose-500 to-pink-600",
    },
    {
      icon: BookOpen,
      title: "Indywidualne podejście",
      description: "Każdy uczeń jest inny. Dostosuję metody nauczania do Twoich potrzeb.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Cierpliwość",
      description: "Wierzę, że każdy może zrozumieć chemię. Wystarczy odpowiednie wsparcie.",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: Award,
      title: "Egzaminator maturalny",
      description: "20+ lat doświadczenia w pracy z uczniami na różnych poziomach zaawansowania.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Clock,
      title: "Elastyczne terminy",
      description: "Zajęcia w całym tygodniu, dostosowane do Twojego harmonogramu.",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Laptop,
      title: "Wygodne zajęcia online",
      description: "Ucz się z domu przez Zoom lub Google Meet. Bez dojazdów.",
      gradient: "from-indigo-500 to-blue-600",
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    }
  };

  return (
    <section className="py-28 px-4 relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--secondary) / 0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{ 
            scale: [1.3, 1, 1.3],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card premium-glow mb-6"
            whileHover={{ scale: 1.05, y: -2 }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-secondary" />
            </motion.div>
            <span className="text-sm font-semibold text-foreground">O mnie</span>
          </motion.div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            <span className="text-gradient-animated">Dlaczego warto uczyć się ze mną?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-body">
            Łączę wiedzę z empatią, tworząc przestrzeń, w której nauka staje się przyjemnością.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative p-8 rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-soft hover:shadow-card transition-all duration-500 cosmic-card"
            >
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.1) 0%, transparent 50%)",
                }}
              />

              <motion.div 
                className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <feature.icon className="w-7 h-7 text-white" />
                {/* Icon glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, transparent, rgba(255,255,255,0.2))`,
                  }}
                />
              </motion.div>

              <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed">
                {feature.description}
              </p>

              {/* Animated bottom line */}
              <motion.div
                className={`h-1 rounded-full bg-gradient-to-r ${feature.gradient} mt-6 origin-left`}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 0.3 }}
                whileHover={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;

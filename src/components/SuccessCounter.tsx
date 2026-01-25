import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { GraduationCap, Users, Clock, Award, TrendingUp, Star } from "lucide-react";

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter = ({ value, suffix = "", duration = 2 }: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(Math.floor(easeOutQuart * value));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {displayValue}{suffix}
    </span>
  );
};

const stats = [
  {
    icon: Users,
    value: 1247,
    suffix: "+",
    label: "Zadowolonych uczniów",
    color: "from-blue-500 to-cyan-500",
    description: "którzy poprawili swoje oceny"
  },
  {
    icon: Clock,
    value: 20,
    suffix: "+",
    label: "Lat doświadczenia",
    color: "from-purple-500 to-pink-500",
    description: "w nauczaniu chemii i fizyki"
  },
  {
    icon: Award,
    value: 98,
    suffix: "%",
    label: "Skuteczność",
    color: "from-amber-500 to-orange-500",
    description: "zdanych matur i egzaminów"
  },
  {
    icon: Star,
    value: 5,
    suffix: ".0",
    label: "Średnia ocena",
    color: "from-green-500 to-emerald-500",
    description: "od uczniów i rodziców"
  }
];

const SuccessCounter = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section ref={containerRef} className="py-20 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <TrendingUp className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Nasze osiągnięcia</span>
          </motion.div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Liczby mówią same za siebie
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Przez lata pomogłam tysiącom uczniów osiągnąć sukces w chemii i fizyce
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="group"
            >
              <div className="relative p-6 rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
                {/* Gradient background on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                
                {/* Icon */}
                <motion.div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </motion.div>

                {/* Value */}
                <motion.div
                  className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </motion.div>

                {/* Label */}
                <h3 className="font-display font-semibold text-foreground mb-1">
                  {stat.label}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground font-body">
                  {stat.description}
                </p>

                {/* Decorative corner */}
                <motion.div
                  className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full opacity-5 group-hover:opacity-20 transition-opacity`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decoration */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-muted/50 border border-border"
            whileHover={{ scale: 1.05 }}
          >
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground font-body">
              Dołącz do grona zadowolonych uczniów!
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessCounter;
